import { useEffect, useMemo, useRef, useState } from 'react';
import { GripVertical, Minus, Plus, Maximize, RotateCcw } from 'lucide-react';
import catalog from './catalog.json';
import Demo from './Demo';
import './AtomicCompositionView.css';
const sources=import.meta.glob('../components/**/*.jsx',{query:'?raw',import:'default',eager:true});
function resolvePath(from,relative){const parts=from.split('/').slice(0,-1);for(const part of relative.split('/')){if(part==='..')parts.pop();else if(part!=='.')parts.push(part);}return parts.join('/').replace(/\.jsx$/,'');}
const graph=catalog.map(entry=>{const source=sources['../'+entry.source.slice(4)]||'';const imports=[...source.matchAll(/import\s+[\s\S]*?\sfrom\s*['"]([^'"]+)['"]/g)].map(match=>resolvePath(entry.source,match[1]));return {...entry,dependencies:catalog.filter(item=>imports.includes(item.source.replace(/\.jsx$/,''))).map(item=>item.id)};});
export default function AtomicCompositionView({names,onInspect,selectedName}){
  const namesKey=JSON.stringify(names);
  const related=useMemo(()=>{
    const selectedNames=JSON.parse(namesKey);
    const ids=new Set(graph.filter(entry=>selectedNames.includes(entry.title)).map(entry=>entry.id));
    let changed=true;while(changed){changed=false;for(const entry of graph){if(!ids.has(entry.id)&&entry.dependencies.some(id=>ids.has(id))){ids.add(entry.id);changed=true;}}}
    const addDependencies=id=>{const item=graph.find(entry=>entry.id===id);for(const child of item?.dependencies||[]){if(!ids.has(child)){ids.add(child);addDependencies(child);}}};
    for(const id of [...ids])addDependencies(id);
    return graph.filter(entry=>ids.has(entry.id));
  },[namesKey]);
  const viewport=useRef(null);
  const gesture=useRef(null);
  const [positions,setPositions]=useState({});
  const [pan,setPan]=useState({x:24,y:48});
  const [zoom,setZoom]=useState(.6);
  const groups=useMemo(()=>['atoms','molecules','organisms'],[]);
  const nodes=related.map(entry=>({...entry,x:positions[entry.id]?.x??40+groups.indexOf(entry.group)*370,y:positions[entry.id]?.y??90+related.filter(item=>item.group===entry.group).findIndex(item=>item.id===entry.id)*290}));
  const edges=nodes.flatMap(target=>target.dependencies.map(id=>({source:nodes.find(node=>node.id===id),target})).filter(edge=>edge.source));
  const worldWidth=Math.max(1100,...nodes.map(node=>node.x+330));
  const worldHeight=Math.max(440,...nodes.map(node=>node.y+290));
  useEffect(()=>{const node=viewport.current;if(!node)return;const observer=new ResizeObserver(()=>{setZoom(Math.min(.8,Math.max(.2,Math.min((node.clientWidth-48)/1100,(node.clientHeight-72)/Math.max(440,...groups.map(group=>90+related.filter(item=>item.group===group).length*290))))));setPan({x:24,y:36});});observer.observe(node);return()=>observer.disconnect();},[related,groups]);
  function fit(){const node=viewport.current;if(!node)return;const next=Math.min(1,Math.max(.2,Math.min((node.clientWidth-48)/worldWidth,(node.clientHeight-48)/worldHeight)));setZoom(next);setPan({x:(node.clientWidth-worldWidth*next)/2,y:24});}
  function changeZoom(next){next=Math.min(1.5,Math.max(.2,next));const rect=viewport.current.getBoundingClientRect();setPan(p=>({x:rect.width/2-(rect.width/2-p.x)*next/zoom,y:rect.height/2-(rect.height/2-p.y)*next/zoom}));setZoom(next);}
  function begin(event,node){if(event.button!==0)return;if(!node&&event.target.closest('.composition-node'))return;event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);gesture.current={id:node?.id,startX:event.clientX,startY:event.clientY,x:node?.x??pan.x,y:node?.y??pan.y};if(node)onInspect(node.title);}
  function move(event){const start=gesture.current;if(!start)return;const dx=event.clientX-start.startX,dy=event.clientY-start.startY;if(start.id)setPositions(items=>({...items,[start.id]:{x:Math.max(0,start.x+dx/zoom),y:Math.max(42,start.y+dy/zoom)}}));else setPan({x:start.x+dx,y:start.y+dy});}
  function end(){gesture.current=null;}
  return <div className="composition-graph" ref={viewport} onPointerDown={event=>begin(event)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} aria-label="컴포넌트 조합 노드 캔버스">
    <div className="composition-graph-legend">Atomic <span>→</span> Molecule <span>→</span> Organism</div>
    <div className="composition-world" style={{width:worldWidth,height:worldHeight,transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}>
      {groups.map((group,index)=><div className="composition-column-title" key={group} style={{left:40+index*370,top:28}}>{['Atomic','Molecule','Organism'][index]}</div>)}
      <svg className="composition-wires" width={worldWidth} height={worldHeight} aria-hidden="true"><defs><marker id="composition-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6" fill="#999"/></marker></defs>{edges.map(({source,target})=>{const x1=source.x+280,y1=source.y+122,x2=target.x,y2=target.y+122;const bend=Math.max(70,Math.abs(x2-x1)*.5);return <path key={source.id+'-'+target.id} className={selectedName===source.title||selectedName===target.title?'is-active':''} d={`M ${x1} ${y1} C ${x1+bend} ${y1}, ${x2-bend} ${y2}, ${x2} ${y2}`} markerEnd="url(#composition-arrow)"/>;})}</svg>
      {nodes.map(node=><article key={node.id} className={`composition-node ${selectedName===node.title?'is-selected':''}`} style={{left:node.x,top:node.y}}><button className="composition-node-header" onPointerDown={event=>{event.stopPropagation();begin(event,node);}} onClick={()=>onInspect(node.title)} onKeyDown={event=>{const delta={ArrowLeft:[-12,0],ArrowRight:[12,0],ArrowUp:[0,-12],ArrowDown:[0,12]}[event.key];if(delta){event.preventDefault();setPositions(items=>({...items,[node.id]:{x:Math.max(0,node.x+delta[0]),y:Math.max(42,node.y+delta[1])}}));}}} title="드래그 또는 방향키로 이동"><GripVertical size={14}/><strong>{node.title}</strong></button><div className="composition-node-preview"><Demo name={node.title}/></div><footer><button onClick={()=>onInspect(node.title)}>코드 보기 ↗</button><span>{node.dependencies.length?`${node.dependencies.length}개 요소 조합`:'기본 요소'}</span></footer>{node.dependencies.length>0&&<i className="composition-port input"/>}{edges.some(edge=>edge.source.id===node.id)&&<i className="composition-port output"/>}</article>)}
    </div>
    {!nodes.length&&<div className="composition-graph-empty">컴포넌트를 연결하면 조합 관계가 표시됩니다.</div>}
    <div className="composition-graph-tools" onPointerDown={event=>event.stopPropagation()}><button aria-label="축소" onClick={()=>changeZoom(zoom-.1)}><Minus size={15}/></button><span>{Math.round(zoom*100)}%</span><button aria-label="확대" onClick={()=>changeZoom(zoom+.1)}><Plus size={15}/></button><button aria-label="전체 노드 보기" onClick={fit}><Maximize size={15}/></button><button aria-label="노드 배치 초기화" onClick={()=>{setPositions({});setPan({x:24,y:36});setZoom(.5);}}><RotateCcw size={15}/></button></div>
  </div>;
}
