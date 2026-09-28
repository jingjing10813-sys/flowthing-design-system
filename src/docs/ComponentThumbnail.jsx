import { useLayoutEffect, useRef } from 'react';
import Demo from './Demo';

export default function ComponentThumbnail({ name }) {
  const frame=useRef(null);
  const stage=useRef(null);
  useLayoutEffect(()=>{
    const host=frame.current;
    const content=stage.current;
    if(!host||!content)return;
    const fit=()=>{
      const rect=content.getBoundingClientRect();
      const previousScale=rect.width/content.offsetWidth||1;
      let left=0,top=0,right=content.offsetWidth,bottom=content.offsetHeight;
      for(const child of content.querySelector('.live-demo').children){
        if(!child.getClientRects().length)continue;
        const bounds=child.getBoundingClientRect();
        left=Math.min(left,(bounds.left-rect.left)/previousScale);
        top=Math.min(top,(bounds.top-rect.top)/previousScale);
        right=Math.max(right,(bounds.right-rect.left)/previousScale);
        bottom=Math.max(bottom,(bounds.bottom-rect.top)/previousScale);
      }
      const width=right-left,height=bottom-top;
      if(!width||!height)return;
      const inset=Math.min(24,host.clientWidth*.08);
      const scale=Math.max(.01,Math.min(1,(host.clientWidth-inset*2)/width,(host.clientHeight-inset*2)/height));
      const offsetX=(left+right-content.offsetWidth)/2;
      const offsetY=(top+bottom-content.offsetHeight)/2;
      content.style.setProperty('--thumbnail-fit-scale',String(scale/1.16));
      content.style.setProperty('--thumbnail-offset-x',`${-offsetX}px`);
      content.style.setProperty('--thumbnail-offset-y',`${-offsetY}px`);
      content.style.visibility='visible';
    };
    const observer=new ResizeObserver(fit);
    observer.observe(host);
    observer.observe(content);
    fit();
    let active=true;
    document.fonts.ready.then(()=>{if(active)fit();});
    return()=>{active=false;observer.disconnect();};
  },[name]);
  return <div className="component-thumbnail" ref={frame} aria-hidden="true"><div className="thumbnail-stage thumbnail-auto-fit" ref={stage} inert><Demo name={name}/></div></div>;
}
