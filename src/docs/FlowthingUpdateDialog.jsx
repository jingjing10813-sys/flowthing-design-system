import { useEffect, useRef, useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
import './FlowthingUpdateDialog.css';

export default function FlowthingUpdateDialog({frame,previous,history=[],onClose,onConfirm}){
  const dialog=useRef(null);
  const [step,setStep]=useState('setup');
  const [applianceName,setApplianceName]=useState(previous?.applianceName||'');
  const [version,setVersion]=useState(()=>{const parts=(previous?.version||'0.0.0').split('.').map(Number);return parts.length===3&&parts.every(Number.isInteger)?`${parts[0]}.${parts[1]}.${parts[2]+1}`:'0.0.1';});
  const [footnote,setFootnote]=useState('');
  const [error,setError]=useState('');
  const available=frame.layers.filter(layer=>frame.mappings[layer.id]);
  const [selectedIds,setSelectedIds]=useState(()=>available.map(layer=>layer.id));
  const components=available.filter(layer=>selectedIds.includes(layer.id)).map(layer=>({id:layer.id,name:layer.name,component:frame.mappings[layer.id]}));
  const versionValid=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(version)&&!history.some(item=>item.version===version)&&previous?.version!==version;
  const valid=Boolean(applianceName.trim())&&versionValid&&components.length>0;
  useEffect(()=>{const node=dialog.current;node.showModal();return()=>node.close();},[]);
  async function confirm(){setError('');const result=await onConfirm({applianceName:applianceName.trim(),components,version,footnote:footnote.trim()});if(result===false)setError('저장하지 못했어요. 저장 공간을 확인한 뒤 다시 시도해 주세요.');}
  return <dialog ref={dialog} className="flowthing-update-dialog" onCancel={event=>{event.preventDefault();onClose();}}>
    <header><div><h2>{step==='setup'?'Flowthing 업데이트':'저장 내용 확인'}</h2><p>{step==='setup'?'등록할 기기와 컴포넌트 정보를 입력하세요.':'아래 내용으로 업데이트합니다.'}</p></div><button aria-label="업데이트 설정 닫기" onClick={onClose}><X size={19}/></button></header>
    <div className="flowthing-update-fields">{step==='setup'?<>
      <label>가전기기<input value={applianceName} onChange={e=>setApplianceName(e.target.value)} placeholder="ex/ 스마트 조명" maxLength={80} required/></label>
      <fieldset className="flowthing-component-picker"><legend>컴포넌트 <span>{components.length}개 선택</span></legend>{available.map(layer=><label key={layer.id}><input type="checkbox" checked={selectedIds.includes(layer.id)} onChange={()=>setSelectedIds(ids=>ids.includes(layer.id)?ids.filter(id=>id!==layer.id):[...ids,layer.id])}/><span><strong>{layer.name}</strong><small>{frame.mappings[layer.id]}</small></span></label>)}{!available.length&&<p>연결된 컴포넌트가 없어요.</p>}</fieldset>
      <label>버전<input value={version} onChange={e=>setVersion(e.target.value)} placeholder="0.0.1" aria-invalid={!versionValid}/>{!versionValid&&<small>중복되지 않은 버전을 숫자.숫자.숫자 형식으로 입력해 주세요.</small>}</label>
      <label>각주 <textarea value={footnote} onChange={e=>setFootnote(e.target.value)} maxLength={1000} rows={3} placeholder="변경 사항이나 사용 시 참고할 내용을 남겨주세요."/></label>
    </>:<><dl><dt>가전기기</dt><dd>{applianceName.trim()}</dd><dt>컴포넌트</dt><dd>{components.map(c=><div className="flowthing-review-component" key={c.id}>{c.name}<small>{c.component}</small></div>)}</dd><dt>버전</dt><dd>{version}</dd><dt>각주</dt><dd className="flowthing-footnote-value">{footnote.trim()||'없음'}</dd></dl><p>이 브라우저의 Flowthing 데모에 저장합니다.</p></>}</div>
    {error&&<p className="flowthing-update-error" role="alert">{error}</p>}
    <footer>{step==='setup'?<button className="builder-secondary" onClick={onClose}>취소</button>:<button className="builder-secondary" onClick={()=>setStep('setup')}><ArrowLeft size={14}/> 정보 수정</button>}{step==='setup'?<button className="builder-primary" disabled={!valid} onClick={()=>setStep('review')}>저장 내용 확인 <ArrowRight size={14}/></button>:<button className="builder-primary" disabled={!valid} onClick={confirm}>업데이트</button>}</footer>
  </dialog>;
}
