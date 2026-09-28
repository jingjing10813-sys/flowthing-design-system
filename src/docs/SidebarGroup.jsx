import { useId, useState } from 'react';
import { ChevronRight } from 'lucide-react';

export default function SidebarGroup({ title, active, selected, selectionKey, onSelect, children }) {
  const panelId=useId();
  const [expansion,setExpansion]=useState({key:selectionKey,open:active});
  const open=expansion.key===selectionKey?expansion.open:active;
  return <div className={`component-nav-group ${open?'is-expanded':''}`}>
    <button className={`component-nav-toggle ${selected?'is-selected':''}`} aria-expanded={open} aria-controls={panelId} onClick={()=>{
      setExpansion({key:selectionKey,open:!open});
      if(!open&&!selected)onSelect();
    }}><ChevronRight size={14} aria-hidden="true"/><span>{title}</span></button>
    <div className="component-nav-collapse" id={panelId} inert={!open} aria-hidden={!open}><div className="component-nav-items">{children}</div></div>
  </div>;
}
