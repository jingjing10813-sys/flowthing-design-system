import { useEffect, useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import catalog from './catalog.json';
const sources=import.meta.glob('../components/**/*.jsx',{query:'?raw',import:'default',eager:true});
function tokens(items){return items.map((item,index)=>typeof item==='string'?item:<span key={index} className={'designer-code-'+item.type}>{tokens(Array.isArray(item.content)?item.content:[item.content])}</span>);}
export default function DesignerComponentCode({name,onProperties}){
  const [notice,setNotice]=useState('');
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),3000);return()=>clearTimeout(timer);},[notice]);
  const entry=catalog.find(item=>item.title===name);
  const source=entry?sources['../'+entry.source.slice(4)]:null;
  async function copy(){try{await navigator.clipboard.writeText(source);setNotice('Flowthing 컴포넌트 코드를 복사했어요.');}catch{setNotice('복사하지 못했어요. 클립보드 권한을 확인해 주세요.');}}
  if(!source)return <div className="designer-inspector-empty"><Code2 size={26}/><p>컴포넌트를 연결하면<br/>코드를 확인할 수 있어요.</p><button className="builder-secondary" onClick={onProperties}>컴포넌트 연결</button></div>;
  return <div className="designer-component-code"><div className="designer-code-filename">{entry.source.split('/').at(-1)}</div><pre aria-label={`${name} 컴포넌트 코드`}><code>{source.split('\n').map((line,index)=><span className="designer-code-line" key={index}><span aria-hidden="true">{index+1}</span><span>{tokens(Prism.tokenize(line||' ',Prism.languages.jsx))}</span></span>)}</code></pre><footer><button className="builder-primary" onClick={copy}><Copy size={14}/> 컴포넌트 코드 복사</button></footer>{notice&&<div className="developer-copy-toast" role="status"><Check size={15}/>{notice}</div>}</div>;
}
