export const sourceLimits = { perFile:1024*1024, total:10*1024*1024, count:20 };
const allowed = new Set(['js','jsx','ts','tsx','css','json','md','txt']);
export function validateSourceFile(file) {
  const extension = file.name.split('.').at(-1).toLowerCase();
  if (!allowed.has(extension)) return '지원하지 않는 파일 형식입니다.';
  if (file.size > sourceLimits.perFile) return '파일당 1MB까지 첨부할 수 있습니다.';
  if (!file.size) return '빈 파일은 첨부할 수 없습니다.';
  return null;
}
export function sourceRole(name) {
  const ext=name.split('.').at(-1).toLowerCase();
  return ['js','jsx','ts','tsx'].includes(ext)?'code':ext==='css'?'style':ext==='json'?'spec':'document';
}
export function scanReferences(sources, basis) {
  const findings=[];
  for(const source of sources) {
    if(!['code','style'].includes(source.role)) continue;
    const lines=source.content.split('\n');
    for(const item of basis) {
      const escaped=item.title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      const pattern=new RegExp(`\\b${escaped}\\b`);
      const occurrences=[];
      lines.forEach((line,index)=>{if(pattern.test(line))occurrences.push(index+1);});
      if(occurrences.length) findings.push({id:`${source.id}:${item.id}`,sourceId:source.id,sourceName:source.name,revision:source.hash,componentId:item.id,componentName:item.title,behaviors:item.behaviors,lines:occurrences,kind:'component',description:item.description});
    }
    const knownTokens=new Set(basis.flatMap(item=>item.tokens||[]));
    const tokens=new Map();
    lines.forEach((line,index)=>{for(const token of line.matchAll(/--[a-zA-Z][\w-]*/g)){if(knownTokens.has(token[0])){const hits=tokens.get(token[0])||[];if(hits.at(-1)!==index+1)hits.push(index+1);tokens.set(token[0],hits);}}});
    for(const [token,hits] of tokens) findings.push({id:`${source.id}:${token}`,sourceId:source.id,sourceName:source.name,revision:source.hash,componentName:token,behaviors:[],lines:hits,kind:'token',description:'선택한 컴포넌트 카탈로그에 포함된 토큰 이름의 텍스트 참조입니다.'});
  }
  return findings;
}
export function selectionKey(sources, basisIds) { return JSON.stringify({sources:sources.filter(s=>s.selected).map(s=>[s.id,s.hash]).sort(),basis:[...basisIds].sort()}); }
