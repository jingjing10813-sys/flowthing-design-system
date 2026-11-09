import { randomUUID } from 'node:crypto';
const endpoint='http://127.0.0.1:3845/mcp';
export async function readRpc(response,id) {
  if(response.status===202)return null;
  if(!response.ok)throw new Error(`MCP 요청 실패 (${response.status})`);
  if(response.headers.get('content-type')?.includes('text/event-stream')) {
    const reader=response.body.getReader();const decoder=new TextDecoder();let buffer='';let size=0;
    try { while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16e6)throw new Error('응답이 너무 큽니다. 작은 프레임을 선택해 주세요.');buffer+=decoder.decode(value,{stream:true});buffer=buffer.replace(/\r\n/g,'\n');let end;while((end=buffer.indexOf('\n\n'))>=0){const block=buffer.slice(0,end);buffer=buffer.slice(end+2);const data=block.split('\n').filter(line=>line.startsWith('data:')).map(line=>line.slice(5).trimStart()).join('\n');if(!data)continue;let result;try{result=JSON.parse(data);}catch{continue;}if(result.id===id)return result;}} } finally {await reader.cancel();}
    throw new Error('MCP 응답이 중단됐습니다. 다시 연결해 주세요.');
  }
  const result=await response.json();if(result.id!==id)throw new Error('MCP 응답 ID가 일치하지 않습니다.');return result;
}
export function desktopClient() {
  let session;let protocol='2025-03-26';
  async function rpc(method,params,notification=false){const id=randomUUID();const headers={'Content-Type':'application/json',Accept:'application/json, text/event-stream'};if(session)headers['Mcp-Session-Id']=session;if(method!=='initialize')headers['MCP-Protocol-Version']=protocol;let response;
    try { response=await fetch(endpoint,{method:'POST',headers,body:JSON.stringify({jsonrpc:'2.0',...(notification?{}:{id}),method,...(params?{params}:{})}),signal:AbortSignal.timeout(method==='tools/call'?90000:8000)}); } catch {throw new Error('Figma 데스크톱 MCP에 연결할 수 없어요. Figma에서 Dev Mode → Enable desktop MCP server를 켜고 다시 확인해 주세요.');}
    if(response.headers.get('Mcp-Session-Id'))session=response.headers.get('Mcp-Session-Id');if(notification){if(!response.ok)throw new Error('MCP 초기화 확인 실패');await response.body?.cancel();return;}
    const data=await readRpc(response,id);if(data.error)throw new Error(data.error.message||'MCP 오류');return data.result;
  }
  return {async connect(){const info=await rpc('initialize',{protocolVersion:protocol,capabilities:{},clientInfo:{name:'flowthing-builder',version:'1.0.0'}});protocol=info.protocolVersion||protocol;await rpc('notifications/initialized',undefined,true);const tools=[];let cursor;do{const page=await rpc('tools/list',cursor?{cursor}:{});tools.push(...page.tools);cursor=page.nextCursor;}while(cursor&&tools.length<200);return {info,tools};},async call(tool,args){const result=await rpc('tools/call',{name:tool.name,arguments:args});if(result.isError)throw new Error(result.content?.filter(c=>c.type==='text').map(c=>c.text).join('\n')||'프레임을 읽지 못했어요.');return result;},async close(){if(session)try{await fetch(endpoint,{method:'DELETE',headers:{'Mcp-Session-Id':session,'MCP-Protocol-Version':protocol},signal:AbortSignal.timeout(2000)});}catch{/* Server may not support session deletion. */}}};
}
export function parseFrameUrl(value){const u=new URL(value);if(!['https:','http:'].includes(u.protocol)||!['figma.com','www.figma.com'].includes(u.hostname))throw new Error('Figma 프레임 링크를 입력해 주세요.');const match=u.pathname.match(/^\/(?:design|file)\/([a-zA-Z0-9]+)(?:\/|$)/);const nodeId=u.searchParams.get('node-id')?.replace('-',':');if(!match||!/^\d+:\d+$/.test(nodeId||''))throw new Error('node-id가 포함된 프레임 링크가 필요해요.');return {fileKey:match[1],nodeId,url:u.href};}
function argsFor(tool,frame){const known={nodeId:frame.nodeId,node_id:frame.nodeId,fileKey:frame.fileKey,file_key:frame.fileKey,clientLanguages:'javascript,html,css',clientFrameworks:'react',excludeScreenshot:false,skillNames:'figma-design-to-code'};const props=tool.inputSchema?.properties||{};const args=Object.fromEntries(Object.entries(known).filter(([key])=>key in props));for(const required of tool.inputSchema?.required||[])if(!(required in args))throw new Error(`현재 MCP 도구에 추가 입력이 필요해요: ${required}`);return args;}
export function figmaMcpBridge(){return {name:'flowthing-figma-mcp',configureServer(server){server.middlewares.use('/api/figma',async(req,res)=>{
  const send=(status,data)=>{res.statusCode=status;res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');res.end(JSON.stringify(data));};
  // Only same-origin requests from a loopback development server may reach Figma.
  const host=req.headers.host;let origin;try{origin=new URL(req.headers.origin||'');}catch{send(403,{error:'동일한 로컬 앱에서만 연결할 수 있어요.'});return;}
  if(!['127.0.0.1','localhost','[::1]'].includes(origin.hostname)||origin.host!==host||req.headers['x-flowthing-request']!=='1'){send(403,{error:'허용되지 않은 연결입니다.'});return;}
  if(req.method!=='POST'||!['/status','/frame'].includes(req.url)){send(404,{error:'지원하지 않는 요청입니다.'});return;}
  let body='';try{for await(const chunk of req){body+=chunk;if(body.length>8192)throw new Error('요청이 너무 큽니다.');}}catch(error){send(400,{error:error.message});return;}
  let frame;if(req.url==='/frame')try{frame=parseFrameUrl(JSON.parse(body).url);}catch(error){send(400,{error:error.message});return;}
  const client=desktopClient();try{const {info,tools}=await client.connect();const byName=name=>tools.find(t=>t.name===name);if(!byName('get_metadata')||!byName('get_design_context'))throw new Error('프레임 읽기 도구가 없는 MCP 서버예요. Figma 데스크톱 서버를 확인해 주세요.');
    if(!frame){send(200,{connected:true,server:info.serverInfo?.name,tools:tools.map(t=>t.name)});return;}
    const call=async name=>{const tool=byName(name);return tool?client.call(tool,argsFor(tool,frame)):null;};
    // Context must include a screenshot; separate screenshot tool is used when available.
    const context=await call('get_design_context');const metadata=await call('get_metadata');const screenshot=await call('get_screenshot');const variables=await call('get_variable_defs');
    send(200,{frame,readAt:new Date().toISOString(),metadata,context,screenshot,variables});
  }catch(error){send(503,{connected:false,error:error.message});}finally{await client.close();}
});}};}
