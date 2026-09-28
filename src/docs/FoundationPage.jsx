import { useState } from 'react';
import { foundationPages, foundationTokens } from './foundation-data';
import './Foundations.css';

function TokenSample({token}) {
  const {name,value}=token;
  const variable=`var(${name})`;
  if(name.includes('font-family')) return <span className="foundation-token-type" style={{fontFamily:variable}}>Ag 가</span>;
  if(name.includes('typescale')||/--comp-device-(name|status)-size/.test(name)) return <span className="foundation-token-type" style={{fontSize:variable}}>Ag</span>;
  if(name.includes('radius')) return <span className="foundation-token-radius" style={{borderRadius:variable}}/>;
  if(name.includes('padding')||name==='--ref-size-base') return <span className="foundation-token-spacing" style={{width:variable}}/>;
  if(name.includes('shadow')&&!name.includes('color')) return <span className="foundation-token-shadow" style={{boxShadow:variable}}/>;
  if(name.includes('opacity')) return <span className="foundation-token-color" style={{background:'#171717',opacity:variable}}/>;
  if(value.includes('gradient(')||name.includes('gradient')) return <span className="foundation-token-gradient" style={{background:variable}}/>;
  if(name.includes('palette')||name.includes('color')||name.includes('-bg')||name.includes('border')) return <span className="foundation-token-color" style={{background:variable}}/>;
  return <span className="foundation-token-fallback">—</span>;
}
export function FoundationTokenTable({tokens}) {
  const [copied,setCopied]=useState('');
  const copy=async name=>{try{await navigator.clipboard.writeText(name);setCopied(name);}catch{setCopied('error');}};
  return <div className="foundation-token-table-wrap"><table className="foundation-token-table"><thead><tr><th>Preview</th><th>Token</th><th>Value</th><th><span className="sr-only">복사</span></th></tr></thead><tbody>{tokens.map(token=><tr key={token.name}><td><TokenSample token={token}/></td><th scope="row"><code>{token.name}</code><small>{token.tier}</small></th><td><code>{token.value}</code></td><td><button className="foundation-copy" onClick={()=>copy(token.name)} aria-label={`${token.name} 복사`}>{copied===token.name?'Copied':'Copy'}</button></td></tr>)}</tbody></table><p className="foundation-copy-status" role="status">{copied==='error'?'복사하지 못했습니다.':copied?'토큰 이름을 복사했습니다.':''}</p></div>;
}
export function FoundationLinks() {
  return <div className="foundation-reference-links">{foundationPages.map(page=><a key={page.id} href={`#/foundations/${page.id}`}><strong>{page.title}</strong><span>{page.description}</span><i aria-hidden="true">↗</i></a>)}</div>;
}
export function FoundationOverview() {
  return <div className="foundation-doc"><div className="eyebrow">DESIGN FOUNDATIONS</div><h1>Foundations</h1><p className="lead">색상, 글꼴, 표면과 상태까지. Flowthing 화면을 구성하는 공통 기준을 살펴보세요.</p><div className="foundation-entry-links"><a href="#/foundations/design-token"><span>START HERE</span><h2>Design Token <i aria-hidden="true">↗</i></h2><p>Reference · System · Component의 연결 구조와 사용법</p></a><a href="#/foundations/design-token/reference"><span>ALL TOKENS</span><h2>Token Reference <i aria-hidden="true">↗</i></h2><p>현재 소스에 정의된 전체 토큰을 이름과 값으로 탐색</p></a></div><FoundationLinks/></div>;
}
export default function FoundationPage({page}) {
  const index=foundationPages.findIndex(item=>item.id===page.id);
  const next=foundationPages[index+1];
  const previous=foundationPages[index-1];
  return <div className="foundation-doc"><div className="eyebrow">FOUNDATIONS</div><h1>{page.title}</h1><p className="lead">{page.description}</p><div className={`foundation-cover foundation-cover-${page.id}`} aria-hidden="true">{page.id==='typography'?<><span>Ag</span><span>가나다</span></>:page.id==='state'?<><span>On</span><span>Off</span><span>Disabled</span></>:[0,1,2,3].map(i=><span key={i}/>)}</div><section id="foundation-guidelines"><h2>사용 기준</h2><p>{page.guidance}</p></section>{page.groups.map(([id,title,predicate])=><section id={`foundation-${id}`} key={id}><h2>{title}</h2><FoundationTokenTable tokens={foundationTokens.filter(predicate)}/></section>)}<section id="foundation-code"><h2>코드에서 사용하기</h2><pre><code>{`.control {\n  ${page.sample.replaceAll('\n','\n  ')}\n}`}</code></pre><p><a href="#/foundations/design-token/reference">전체 Token Reference →</a></p></section><div className="page-pagination"><a href={previous?`#/foundations/${previous.id}`:'#/foundations/design-token'}>← {previous?.title||'Design Token'}</a>{next&&<a href={`#/foundations/${next.id}`}>{next.title} →</a>}</div></div>;
}
