import { useState } from 'react';
import { foundationTokens } from './foundation-data';
import { FoundationLinks, FoundationTokenTable } from './FoundationPage';

export default function TokenReference() {
  const [query,setQuery]=useState('');
  const tokens=foundationTokens.filter(token=>(token.name+' '+token.value).toLowerCase().includes(query.trim().toLowerCase()));
  return <section id="token-reference"><h2>토큰 레퍼런스</h2><p>항목별 사용 기준은 개별 Foundation 문서에서 확인하고, 전체 토큰의 정의는 여기서 탐색하세요.</p><FoundationLinks/><div className="foundation-reference-search"><label htmlFor="foundation-token-search">토큰 찾기</label><input id="foundation-token-search" type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search token names or values…"/><span role="status">{tokens.length} tokens</span></div>{['Reference','System','Component','Legacy'].map(tier=>{const items=tokens.filter(token=>token.tier===tier);return items.length?<section id={`reference-${tier.toLowerCase()}`} key={tier}><h2>{tier}{tier==='Legacy'?' compatibility':''}</h2><FoundationTokenTable tokens={items}/></section>:null;})}{tokens.length===0&&<p>일치하는 토큰이 없습니다. 다른 이름이나 값을 검색하세요.</p>}</section>;
}
