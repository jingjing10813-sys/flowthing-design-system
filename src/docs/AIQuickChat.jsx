import { useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, BookOpen, ChevronDown, SquarePen, X } from 'lucide-react';
import { ThinkingOrb } from 'thinking-orbs';
import catalog from './catalog.json';
import { demoCases, replyFor } from './ai-demo-data';
import './AIQuickChat.css';

const deviceCases = { lighting:'light', airconditioner:'air', curtain:'curtain', speaker:'speaker', washer:'washer', refrigerator:'fridge' };
function suggestions(context) {
  if (context.entry) return [`${context.title}는 언제 사용해?`, `${context.title}의 구현 시 확인할 사항은?`];
  const sample = demoCases.find(item => item.id === deviceCases[context.deviceId]);
  return sample ? [sample.text, '연결이 끊기면 어떻게 표시해?'] : [demoCases[0].text, demoCases[7].text];
}
function contextualReply(question, context, previous) {
  if (context.entry && question.includes(context.title)) {
    const item = context.entry;
    return { title: `${item.title} 문서에서 확인할 기준`, body: item.description, note: '현재 카탈로그의 설명과 분류를 안내하는 데모입니다. 실제 props·기본값·지원 범위는 문서의 구현 코드에서 확인해 주세요.', conditions: item.behaviors.length ? item.behaviors.map(name => `행동 분류: ${name}`) : ['보조 구성 요소'], sources:[{title:item.title, href:context.href}], questions:['실제 속성과 이벤트','입력 제한·기기 상태의 처리 범위'] };
  }
  return replyFor(question, previous, catalog);
}
export default function AIQuickChat({ context, onClose, onExpand, open }) {
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState([]);
  const input = useRef(null);
  const bottom = useRef(null);
  useEffect(() => { if(!open)return; const timer=setTimeout(()=>input.current?.focus(),500); return ()=>clearTimeout(timer); }, [open]);
  useEffect(() => { bottom.current?.scrollIntoView({ block:'nearest', behavior:'smooth' }); }, [messages.length]);
  useEffect(() => { if(!open)return; const escape = event => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); } }; document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape); }, [onClose,open]);
  function send(value = draft) {
    const question = value.trim();
    if (!question) return;
    const previous = messages.at(-1);
    const answer = contextualReply(question, context, previous?.page === context.href ? previous.answer : null);
    setMessages(items => [...items, { id:crypto.randomUUID(), question, answer, page:context.href, pageTitle:context.title }]);
    setDraft(''); input.current?.focus();
  }
  return <aside className={`ai-quick-panel ${open?'is-expanded':''}`} id="ai-quick-panel" aria-labelledby="ai-quick-title" aria-hidden={!open} inert={!open}><div className="ai-quick-content">
    <header className="ai-quick-header"><span className="ai-quick-orb" aria-hidden="true"><ThinkingOrb state="composing" size={32} theme="dark"/></span><div><h2 id="ai-quick-title">Flowthing AI</h2><span>문서를 보면서, 함께 설계하세요.</span></div><button onClick={()=>{setMessages([]);setDraft('');input.current?.focus();}} aria-label="새 대화 시작" title="새 대화"><SquarePen size={16}/></button><a href="#/ai" onClick={event=>{event.preventDefault();onExpand({context,messages,draft});}} aria-label="전체 AI 작업 공간 열기" title="전체 작업 공간"><ArrowUpRight size={17}/></a><button onClick={onClose} aria-label="AI 채팅 닫기"><X size={18}/></button></header>
    
    <div className="ai-quick-thread">{!messages.length ? <div className="ai-quick-welcome"><div className="ai-quick-greeting"><ThinkingOrb state="composing" size={64} theme="dark"/><h3>함께 설계해 볼까요?</h3><p>현재 문서를 기준으로 도와드릴게요.</p></div><div className="ai-quick-suggestions">{suggestions(context).map(question => <button key={question} onClick={() => send(question)}>{question}<ArrowUpRight size={13}/></button>)}</div></div> : messages.map(message => <div className="ai-quick-exchange" key={message.id}><div className="ai-quick-question">{message.question}</div><div className="ai-quick-answer"><span className="ai-quick-answer-label">Flowthing AI <span>데모</span></span>{message.page !== context.href && <span className="ai-quick-old-page">{message.pageTitle}에서 질문</span>}<h3>{message.answer.title}</h3><p>{message.answer.body}</p>{message.answer.rows && <div className="ai-quick-mapping">{message.answer.rows.map(([feature,behavior,name]) => <div key={feature}><strong>{feature}</strong><span>{behavior}</span><span>{name}</span></div>)}</div>}{message.answer.note && <details><summary>확인할 사항<ChevronDown size={13}/></summary><p>{message.answer.note}</p>{message.answer.questions?.map(question => <p key={question}>· {question}</p>)}</details>}<div className="ai-quick-sources">{message.answer.sources.map(source => <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer"><BookOpen size={11}/>{source.title}<ArrowUpRight size={11}/></a>)}</div></div></div>)}<div ref={bottom}/></div>
    <footer className="ai-quick-footer"><div className="ai-quick-page"><BookOpen size={13}/><span>참조 중</span><strong title={context.title}>{context.title}</strong></div><form onSubmit={event => {event.preventDefault();send();}}><label htmlFor="ai-quick-input" className="ai-quick-sr-only">현재 문서에 대해 질문하기</label><textarea ref={input} id="ai-quick-input" rows={2} value={draft} maxLength={2000} onChange={event => setDraft(event.target.value)} placeholder="이 문서에 대해 질문하세요…" onKeyDown={event => { if(event.key==='Enter'&&!event.shiftKey&&!event.nativeEvent.isComposing){event.preventDefault();send();} }}/><button disabled={!draft.trim()} aria-label="질문 보내기"><ArrowUp size={16}/></button></form><p>실제 AI 미연결 · 준비된 사례와 문서 안내 데모</p></footer>
  </div></aside>;
}
