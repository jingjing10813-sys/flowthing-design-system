import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, BookOpen, ChevronRight, Code2, FileText, FolderOpen, Plus, Search, Trash2, Upload, X, Download } from 'lucide-react';
import catalog from './catalog.json';
import { scanReferences, selectionKey, sourceLimits, sourceRole, validateSourceFile } from './mapping-source-utils';
import './MappingWorkspace.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-json';

function renderCode(tokens) {
  return tokens.map((token,index)=>typeof token==='string'?token:<span key={index} className={'mapping-syntax-'+token.type}>{typeof token.content==='string'?token.content:renderCode(Array.isArray(token.content)?token.content:[token.content])}</span>);
}
const defaultBasis=catalog.map(item=>item.id);
const roleNames={code:'구현 코드',style:'스타일',spec:'기능 명세',document:'문서'};
const demoSource=`// 샘플 코드: 실제 기기 API와 연결되지 않은 설명용 자료입니다.\nimport Button from './Button';\nimport AdaptiveLightSlider from './AdaptiveLightSlider';\n\nexport default function LightingExample({ confirmedPower, confirmedBrightness, requestPower, requestBrightness }) {\n  return (\n    <section>\n      <Button active={confirmedPower} onClick={() => requestPower(!confirmedPower)} />\n      <AdaptiveLightSlider value={confirmedBrightness} onChange={requestBrightness} />\n    </section>\n  );\n}\n`;
export default function MappingWorkspace() {
  const [sources,setSources]=useState([]);
  const [basisIds,setBasisIds]=useState(defaultBasis);
  const [basisQuery,setBasisQuery]=useState('');
  const [run,setRun]=useState(null);
  const [evidence,setEvidence]=useState(null);
  const [notice,setNotice]=useState('');
  const [loading,setLoading]=useState(false);
  const [dragging,setDragging]=useState(false);
  const [pasting,setPasting]=useState(false);
  const [pasteName,setPasteName]=useState('device-source.tsx');
  const [pasteText,setPasteText]=useState('');
  const [kind,setKind]=useState('all');
  const picker=useRef(null);
  const processing=useRef(false);
  const selected=sources.filter(item=>item.selected);
  const basis=catalog.filter(item=>basisIds.includes(item.id));
  const stale=run&&run.key!==selectionKey(sources,basisIds);
  const hasCode=selected.some(item=>['code','style'].includes(item.role));
  const updating=hasCode&&basis.length>0&&(!run||stale);
  const findings=(run?.findings||[]).filter(item=>kind==='all'||item.kind===kind);
  const activeSource=evidence?.source;
  const sourceLines=useMemo(()=>activeSource?.content.split('\n')||[],[activeSource?.content]);
  const previewStart=Math.max(0,(evidence?.line||1)-31);
  const previewLines=useMemo(()=>sourceLines.slice(previewStart,previewStart+160),[sourceLines,previewStart]);
  const extension=activeSource?.name.split('.').at(-1);
  const grammar=Prism.languages[extension==='js'?'javascript':extension==='ts'?'typescript':extension]||Prism.languages.plain;
  const codePreview=useMemo(()=>previewLines.map(line=>grammar?renderCode(Prism.tokenize(line||' ',grammar)):line),[previewLines,grammar]);
  async function attach(files) {
    if(processing.current)return;
    processing.current=true;setLoading(true);setNotice('');
    const added=[];const errors=[];
    let total=sources.reduce((sum,item)=>sum+item.size,0);
    try {
      for(const file of Array.from(files)) {
        const reason=validateSourceFile(file);
        if(reason){errors.push(`${file.name}: ${reason}`);continue;}
        if(sources.length+added.length>=sourceLimits.count){errors.push('작업당 20개 파일까지 첨부할 수 있어요.');break;}
        if(total+file.size>sourceLimits.total){errors.push(`${file.name}: 합계 10MB 제한을 초과했어요.`);continue;}
        const name=file.webkitRelativePath||file.name;
        if([...sources,...added].some(source=>source.name===name)){errors.push(`${name}: 같은 이름의 소스가 있어요. 기존 소스를 삭제하거나 파일 이름을 바꿔 주세요.`);continue;}
        try {
          const buffer=await file.arrayBuffer();
          const text=new TextDecoder('utf-8',{fatal:true}).decode(buffer);
          if(text.includes('\0'))throw new Error('binary');
          const content=text.replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n');
          const digest=await crypto.subtle.digest('SHA-256',buffer);
          const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,'0')).join('');
          added.push({id:crypto.randomUUID(),name,content,hash,size:file.size,role:sourceRole(name),selected:true});total+=file.size;
        } catch { errors.push(`${name}: UTF-8 텍스트로 읽을 수 없어요.`); }
      }
      setSources(items=>[...items,...added]);
      setNotice([added.length?`${added.length}개 소스를 로컬에서 읽었어요.`:'',...errors].filter(Boolean).join(' '));
    } finally {processing.current=false;setLoading(false);if(picker.current)picker.current.value='';}
  }
  function inspect(source,line=1) {setEvidence({source,line});}
  useEffect(()=>{
    const timer=setTimeout(()=>{
      const snapshot=sources.filter(item=>item.selected).map(item=>({...item}));
      const criteria=catalog.filter(item=>basisIds.includes(item.id));
      if(!snapshot.some(item=>['code','style'].includes(item.role))||!criteria.length){setRun(null);return;}
      setRun({key:selectionKey(sources,basisIds),sources:snapshot,basisIds:[...basisIds],findings:scanReferences(snapshot,criteria),at:new Date().toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})});
    },250);
    return ()=>clearTimeout(timer);
  },[sources,basisIds]);
  function exportRun() {
    if(!run)return;
    const output={mode:'local-text-reference-scan',aiConnected:false,stale:Boolean(stale),...run,sources:run.sources.map(({id,name,hash,role})=>({id,name,hash,role}))};
    const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)],{type:'application/json'}));
    const link=document.createElement('a');link.href=url;link.download='flowthing-mapping-references.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  return <div className="mapping-workspace">
    
    <div className="mapping-grid">
      <aside className="mapping-sources"><div className="mapping-pane-title"><h2>Sources</h2><span>{sources.length}</span></div><div className={`mapping-dropzone ${dragging?'is-dragging':''}`} onDragOver={event=>{event.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={event=>{event.preventDefault();setDragging(false);attach(event.dataTransfer.files);}}><Upload size={21}/><strong>코드 파일을 추가하세요</strong><span>JS · TS · JSX · TSX · CSS<br/>JSON · MD · TXT</span><button disabled={loading} onClick={()=>picker.current?.click()}><Plus size={13}/>{loading?'읽는 중…':'파일 선택'}</button><input ref={picker} type="file" multiple accept=".js,.jsx,.ts,.tsx,.css,.json,.md,.txt" className="mapping-hidden" onChange={event=>attach(event.target.files)}/></div><div className="mapping-import-actions"><button onClick={()=>setPasting(!pasting)}>텍스트 붙여넣기</button><button disabled={loading} onClick={()=>attach([new File([demoSource],'LightingExample.jsx',{type:'text/plain'})])}>샘플 코드</button></div>{pasting&&<form className="mapping-paste" onSubmit={event=>{event.preventDefault();attach([new File([pasteText],pasteName,{type:'text/plain'})]);setPasting(false);setPasteText('');}}><label>파일명<input value={pasteName} onChange={event=>setPasteName(event.target.value)} required/></label><label>원문<textarea value={pasteText} onChange={event=>setPasteText(event.target.value)} rows={6} required/></label><button disabled={loading||!pasteText.trim()}>소스 추가</button></form>}<p className="mapping-local-note">파일당 1MB · 최대 20개<br/>서버 전송 없이 이 화면에서만 보관</p>
        <div className="mapping-source-list"><h3>첨부 소스</h3>{!sources.length?<p>소스를 추가하면 원문을 볼 수 있어요.</p>:sources.map(source=><div className="mapping-source-row" key={source.id}><input type="checkbox" aria-label={`${source.name} 분석에 포함`} checked={source.selected} onChange={()=>setSources(items=>items.map(item=>item.id===source.id?{...item,selected:!item.selected}:item))}/><button className="mapping-source-open" onClick={()=>inspect(source)}><FileText size={14}/><span><strong title={source.name}>{source.name}</strong><small>{roleNames[source.role]} · {(source.size/1024).toFixed(1)}KB · 준비됨</small></span></button><button className="mapping-remove" aria-label={`${source.name} 삭제`} onClick={()=>{setSources(items=>items.filter(item=>item.id!==source.id));if(evidence?.source.id===source.id)setEvidence(null);setRun(null);}}><Trash2 size={12}/></button></div>)}</div>
        <div className="mapping-basis-list"><h3>디자인 시스템 기준<span>{basis.length}개 선택</span></h3><input type="search" aria-label="기준 컴포넌트 검색" placeholder="컴포넌트 검색…" value={basisQuery} onChange={event=>setBasisQuery(event.target.value)}/>{catalog.filter(item=>item.title.toLowerCase().includes(basisQuery.toLowerCase())).map(item=><label key={item.id}><input type="checkbox" checked={basisIds.includes(item.id)} onChange={()=>setBasisIds(ids=>ids.includes(item.id)?ids.filter(id=>id!==item.id):[...ids,item.id])}/><span>{item.title}</span></label>)}</div>
      </aside>
      <section className="mapping-results" aria-label="텍스트 참조 결과"><div className="mapping-results-header"><div><span className="mapping-mode">LOCAL SOURCE EXPLORER</span><h2>Code → Design system</h2><span>코드를 추가하면 참조가 자동으로 표시됩니다. 결과를 눌러 코드 근거를 확인하세요.</span></div>{run&&!stale&&<button onClick={exportRun} title="참조 결과 JSON 내보내기"><Download size={15}/></button>}</div><div className="mapping-run-status"><span>{selected.length}개 소스 선택</span><span>{basis.length}개 기준</span><span>{loading?'파일 읽는 중…':updating?'참조 자동 확인 중…':run&&!stale?`${run.findings.length}개 참조 · 자동 갱신됨`:'소스 대기 중'}</span></div><p className="mapping-notice" role="status">{notice||'첨부 코드는 실행하지 않습니다. 현재 기능은 이름·토큰의 텍스트 참조 확인입니다.'}</p>{run&&!stale&&hasCode&&basis.length?<><div className="mapping-result-filters">{[['all','전체'],['component','컴포넌트'],['token','토큰']].map(([id,label])=><button key={id} aria-pressed={kind===id} onClick={()=>setKind(id)}>{label}</button>)}</div>{findings.length?<div className="mapping-findings">{findings.map(item=><button className="mapping-finding" key={item.id} onClick={()=>inspect(run.sources.find(source=>source.id===item.sourceId),item.lines[0])}><div><span className="mapping-result-type">{item.kind==='token'?'TOKEN REFERENCE':'COMPONENT REFERENCE'}</span><strong>{item.componentName}</strong><p>{item.description}</p><span className="mapping-behavior">{item.behaviors.length?item.behaviors.join(' · '):'Supporting / token'}</span></div><footer><Code2 size={12}/><span>{item.sourceName}:{item.lines[0]}</span><span>{item.lines.length}개 줄 · 코드 근거 보기</span><ChevronRight size={13}/></footer></button>)}</div>:<div className="mapping-empty"><Search size={27}/><h3>선택 범위에서 참조를 찾지 못했어요.</h3><p>별칭·동적 구성·다른 파일의 연결은 확인하지 않습니다.<br/>관련 소스나 기준을 추가해 주세요.</p></div>}<div className="mapping-scope-note"><strong>확인 범위</strong><p>파일의 주석·문자열에도 이름이 포함될 수 있습니다. 실제 import·props·동작이 검증됐다는 의미는 아닙니다. 기능 지원 여부는 기기 명세와 별도로 확인해야 합니다.</p></div></>:<div className="mapping-empty" aria-live="polite"><FolderOpen size={32}/><h3>{loading?'파일을 읽고 있어요.':updating?'참조 결과를 자동으로 확인하고 있어요.':!basis.length?'확인할 디자인 시스템 기준을 선택하세요.':sources.length?'분석할 코드 파일을 선택하세요.':'코드를 넣으면 연결된 컴포넌트가 보입니다.'}</h3><p>{sources.length?'왼쪽에서 구현 코드·스타일과 기준을 선택하면 자동으로 갱신됩니다.':'파일을 추가하거나 샘플로 시작하세요. 별도의 실행 버튼 없이 결과를 확인할 수 있어요.'}</p>{!sources.length&&!loading&&<><div className="mapping-start-actions"><button onClick={()=>picker.current?.click()}><Plus size={14}/>코드 파일 추가</button><button className="mapping-sample-button" onClick={()=>attach([new File([demoSource],'LightingExample.jsx',{type:'text/plain'})])}>샘플로 체험하기<ChevronRight size={14}/></button></div><ol className="mapping-flow"><li><span>1</span>코드 추가</li><li><span>2</span>자동 참조 확인</li><li><span>3</span>결과에서 원문 보기</li></ol></>}</div>}</section>
      <aside className={`mapping-evidence ${evidence?'is-open':''}`}><div className="mapping-pane-title"><h2>Evidence</h2><button className="mapping-evidence-close" onClick={()=>setEvidence(null)} aria-label="원문 패널 닫기"><X size={16}/></button></div>{activeSource?<><div className="mapping-evidence-meta"><strong>{activeSource.name}</strong><span>revision {activeSource.hash.slice(0,8)} · {activeSource.content.split('\n').length}줄</span></div><div className="mapping-code-range"><span>{previewStart+1}–{Math.min(sourceLines.length,previewStart+160)} / {sourceLines.length}줄</span><button disabled={previewStart===0} onClick={()=>setEvidence({...evidence,line:Math.max(1,previewStart-129)})}>이전</button><button disabled={previewStart+160>=sourceLines.length} onClick={()=>setEvidence({...evidence,line:previewStart+161})}>다음</button></div><div className="mapping-code-view"><ol>{previewLines.map((line,index)=><li key={previewStart+index} className={previewStart+index+1===evidence.line?'is-highlighted':''} ref={previewStart+index+1===evidence.line?element=>element?.scrollIntoView({block:'nearest'}):undefined}><span>{previewStart+index+1}</span><code>{codePreview[index]}</code></li>)}</ol></div><div className="mapping-evidence-basis"><h3>관련 기준</h3>{(run?.findings||[]).filter(item=>item.sourceId===activeSource.id&&item.kind==='component').map(item=><a href={'#/components/'+item.componentId} key={item.id} target="_blank" rel="noopener noreferrer"><BookOpen size={12}/>{item.componentName}<ArrowUpRight size={12}/></a>)}<span>코드는 현재 선택한 소스의 원문입니다.<br/>실제 AI 분석은 아직 연결되지 않았어요.</span></div></>:<div className="mapping-evidence-empty"><Code2 size={25}/><p>소스 또는 결과를 선택하면<br/>원문과 줄 번호가 표시됩니다.</p></div>}</aside>
    </div>
  </div>;
}
