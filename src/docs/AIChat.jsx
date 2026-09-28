import { createElement, useEffect, useRef, useState } from 'react';
import { ArrowUp, ArrowUpRight, BookOpen, Check, ChevronDown, Copy, FileText, Lightbulb, Menu, MessageSquare, PanelRight, Plus, SlidersHorizontal, X, Layers, ArrowRight, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import catalog from './catalog.json';
import './AIChat.css';
import MappingWorkspace from './MappingWorkspace';

import { ThinkingOrb } from 'thinking-orbs';
import { demoCases, replyFor } from './ai-demo-data';
const prompts = demoCases.map(item => ({ ...item, icon: item.id==='light' ? Lightbulb : item.category==='상태·오류' ? MessageSquare : SlidersHorizontal }));

function AnswerDetails({ answer }) {
  return <div className="ai-detail-sections">
    {answer.states?.length > 0 && <section><h3>상태별 동작</h3><div className="ai-state-grid">{answer.states.map(([name,description]) => <div key={name}><span>{name}</span><p>{description}</p></div>)}</div></section>}
    {answer.bindings?.length > 0 && <section><h3>연결 명세 초안 <span>API 확인 필요</span></h3><div className="ai-binding-list">{answer.bindings.map(([name,read,write]) => <div key={name}><strong>{name}</strong><p><span>READ</span>{read}</p><p><span>WRITE</span>{write}</p></div>)}</div></section>}
    {answer.checks?.length > 0 && <section><h3>구현 전 확인</h3><ul className="ai-design-checks">{answer.checks.map(check => <li key={check}><Check size={13}/>{check}</li>)}</ul></section>}
  </div>;
}

function Mark({ size = 20, theme = 'light' }) { return <span className="ai-orb-mark" aria-hidden="true"><ThinkingOrb state="composing" size={size} theme={theme} /></span>; }
export default function AIChat({ handoff }) {
  const [sessions, setSessions] = useState(()=>handoff?.messages?.length?[{id:'document-conversation',title:handoff.context.title,messages:handoff.messages}]:[]);
  const [activeId, setActiveId] = useState(handoff?.messages?.length?'document-conversation':null);
  const [draft, setDraft] = useState(handoff?.draft||'');
  const [sidebar, setSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [contextOpen, setContextOpen] = useState(false);
  const [copied, setCopied] = useState(null);
  const [notice, setNotice] = useState('');
  const [view, setView] = useState(handoff?'conversation':'overview');
  const [caseFilter, setCaseFilter] = useState('전체');
  const filteredCases = prompts.filter(item => caseFilter==='전체' || item.category===caseFilter);
  const end = useRef(null);
  const input = useRef(null);
  const session = sessions.find(item => item.id === activeId);
  const messages = session?.messages || [];
  const latest = messages.at(-1)?.answer;
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages.length, activeId]);
  function send(value = draft, fresh = false) {
    const question = value.trim();
    if (!question) return;
    const id = (!fresh && activeId) || crypto.randomUUID();
    const message = { id: crypto.randomUUID(), question, answer: replyFor(question, fresh ? null : latest, catalog) };
    setSessions(items => !fresh && activeId ? items.map(item => item.id === id ? { ...item, messages: [...item.messages, message] } : item) : [{ id, title: question, messages: [message] }, ...items]);
    setActiveId(id); setView('conversation'); setDraft(''); setNotice(''); setCopied(null); input.current?.focus();
  }
  function newChat() { setView('overview'); setActiveId(null); setDraft(''); setSidebar(false); setNotice(''); input.current?.focus(); }
  async function copy(message) {
    const a = message.answer;
    try { await navigator.clipboard.writeText([a.title, a.body, ...(a.rows || []).map(row => row.join(' → ')), a.note, ...(a.states||[]).map(row=>row.join(': ')), ...(a.bindings||[]).map(row=>row.join(' | ')), ...(a.checks||[]), ...(a.questions||[]).map(q=>'추가 확인: '+q), ...a.sources.map(source => `${source.title}: ${new URL(source.href, location.href).href}`), '데모 답변 · 실제 AI 미연결'].filter(Boolean).join('\n\n')); setCopied(message.id); }
    catch { setNotice('복사하지 못했어요. 브라우저의 클립보드 권한을 확인해 주세요.'); }
  }
  return <div className={`ai-workspace ${handoff?'ai-from-panel':''} ${view==='conversation'?'ai-document-conversation':''}`}>
    <header className="ai-topbar"><div className="ai-topbar-brand"><button className="ai-icon ai-mobile-menu" aria-label="대화 목록 열기" onClick={() => setSidebar(true)}><Menu size={19}/></button><a href="#/start" className="ai-brand"><Mark size={32} theme="dark"/><span>Flowthing AI</span></a><span className="ai-brand-divider"/><span className="ai-product-name">Design workspace</span></div><div className="ai-topbar-actions"><span className="ai-demo-tag">Interactive demo</span><a href={handoff?.context.href||'#/components'}>{handoff?'문서로 돌아가기':'Design System'} <ArrowUpRight size={14}/></a></div></header>
    <div className={`ai-layout ${sidebarCollapsed ? 'ai-sidebar-collapsed' : ''} ${view==='mapping'?'ai-mapping-mode':''}`}>
      {sidebar && <button className="ai-backdrop" onClick={() => setSidebar(false)} aria-label="작업 메뉴 닫기"/>}
      <aside id="ai-workspace-sidebar" className={`ai-navigation ${sidebarCollapsed ? 'is-collapsed' : ''} ${sidebar ? 'is-mobile-open' : ''}`} aria-label="AI 작업 탐색">
        <div className="ai-navigation-heading"><button className="ai-nav-toggle" onClick={() => setSidebarCollapsed(value => !value)} aria-label={sidebarCollapsed ? '작업 사이드바 펼치기' : '작업 사이드바 접기'} aria-expanded={!sidebarCollapsed} aria-controls="ai-navigation-details">{sidebarCollapsed ? <PanelLeftOpen size={20}/> : <PanelLeftClose size={20}/>}</button><span className="ai-nav-label">Design workspace</span><button className="ai-nav-mobile-close" onClick={() => setSidebar(false)} aria-label="작업 메뉴 닫기"><X size={18}/></button></div>
        <nav className="ai-navigation-items" aria-label="작업 보기">
          <button className="ai-nav-item" aria-current={view==='overview'?'page':undefined} aria-label="Overview" title={sidebarCollapsed?'Overview':undefined} onClick={() => {setView('overview');setSidebar(false);}}><span className="ai-nav-icon"><Mark theme={view==='overview'?'light':'dark'}/></span><span className="ai-nav-label">Overview</span></button>
          <button className="ai-nav-item" aria-current={view==='conversation'?'page':undefined} aria-label="Conversation" title={sidebarCollapsed?'Conversation':undefined} onClick={() => {setView('conversation');setSidebar(false);}}><span className="ai-nav-icon"><MessageSquare size={21}/></span><span className="ai-nav-label">Conversation</span></button>
          <button className="ai-nav-item" aria-current={view==='mapping'?'page':undefined} aria-label="Mapping" title={sidebarCollapsed?'Mapping':undefined} onClick={() => {setView('mapping');setSidebar(false);}}><span className="ai-nav-icon"><Layers size={21}/></span><span className="ai-nav-label">Mapping</span></button>
          <button className="ai-nav-item ai-nav-new" aria-label="새 작업" title={sidebarCollapsed?'새 작업':undefined} onClick={newChat}><span className="ai-nav-icon"><Plus size={21}/></span><span className="ai-nav-label">새 작업</span></button>
        </nav>
        <div className="ai-navigation-details" id="ai-navigation-details"><h2>최근 작업</h2><div className="ai-navigation-history">{sessions.length ? sessions.map(item => <button key={item.id} aria-current={item.id===activeId?'page':undefined} onClick={() => {setActiveId(item.id);setView('conversation');setSidebar(false);setDraft('');}}><MessageSquare size={14}/><span>{item.title}</span></button>) : <p>첫 질문을 시작해 보세요.</p>}</div><p className="ai-navigation-memory">대화는 화면 이용 중에만 유지돼요.</p></div>
        <a className="ai-nav-item ai-nav-docs" href="#/components" aria-label="컴포넌트 문서" title={sidebarCollapsed?'컴포넌트 문서':undefined}><span className="ai-nav-icon"><BookOpen size={20}/></span><span className="ai-nav-label">Design System <ArrowUpRight size={12}/></span></a>
      </aside>
      <main className="ai-chat"><div className="ai-chat-heading"><div><h1>{view==='overview'?'Device design overview':view==='mapping'?'Capability mapping':'Design conversation'}</h1>{handoff?.context?<a className="ai-document-context" href={handoff.context.href}><BookOpen size={12}/>{handoff.context.title}<ArrowUpRight size={12}/></a>:<span>Workspace / Device design</span>}</div>{view!=='mapping'&&<button className="ai-context-toggle" onClick={() => setContextOpen(!contextOpen)} aria-expanded={contextOpen} aria-controls="ai-context"><PanelRight size={16}/><span>근거 보기</span></button>}</div>
        <div hidden={view!=='mapping'} className="ai-mapping-slot"><MappingWorkspace/></div><div className="ai-thread" hidden={view==='mapping'}>{view==='overview' ? <div className="ai-overview"><div className="ai-overview-title"><div><span className="ai-eyebrow">DEVICE DESIGN WORKSPACE</span><h2>기기의 기능을,<br/>우리의 설계 기준으로.</h2><p>기능 해석부터 컴포넌트 선택까지.<br/>설계에 필요한 기준을 AI와 함께 확인하세요.</p></div><div className="ai-overview-symbol"><Mark size={64}/></div></div><div className="ai-workflow-strip">{[['01','기능 설명','기기가 지원하는 기능 입력'],['02','구성 추천','패턴과 컴포넌트 확인'],['03','기준 확인','근거와 미정 조건 검토']].map(([n,title,desc]) => <div key={n}><span>{n}</span><strong>{title}</strong><p>{desc}</p></div>)}</div><div className="ai-section-heading"><h3>Start a design task</h3><span>{demoCases.length}개의 설계 사례</span></div><div className="ai-case-filters" aria-label="사례 분류">{['전체','기기 구성','상태·오류'].map(category=><button key={category} aria-pressed={caseFilter===category} onClick={()=>setCaseFilter(category)}>{category}</button>)}</div><div className="ai-task-list">{filteredCases.map(({icon,title,text,tag,summary}) => <button key={title} onClick={() => send(text, true)}><span className="ai-task-icon">{createElement(icon,{size:21})}</span><div><strong>{title}</strong><p>{summary}</p></div><span className="ai-task-meta">{tag}</span><ArrowRight size={17}/></button>)}</div><div className="ai-overview-bottom"><a href="#/components"><BookOpen size={19}/><div><strong>Component library</strong><p>현재 프로젝트의 {catalog.length}개 컴포넌트</p></div><ArrowUpRight size={16}/></a><a href="#/development/patterns"><FileText size={19}/><div><strong>Patterns & policies</strong><p>상태·명령 처리의 검토 기준</p></div><ArrowUpRight size={16}/></a></div></div> : !messages.length ? <div className="ai-welcome"><div className="ai-welcome-mark"><Mark size={64} theme="dark"/></div><span className="ai-eyebrow">FROM CAPABILITIES TO COMPONENTS</span><h2>어떤 기기를<br/>연결하고 있나요?</h2><p>기기의 기능과 궁금한 점을 알려주세요.<br/>컴포넌트와 패턴을 같은 기준으로 살펴볼게요.</p><div className="ai-prompt-grid">{prompts.slice(0,3).map(({ icon, title, text }) => <button key={title} onClick={() => send(text, true)}>{createElement(icon, { size: 20 })}<strong>{title}</strong><span>{text}</span><ArrowUpRight size={15} className="ai-prompt-arrow"/></button>)}</div></div> : <div className="ai-messages">{messages.map(message => <section className="ai-exchange" key={message.id}><div className="ai-user-message">{message.question}</div><div className="ai-answer"><div className="ai-answer-label"><Mark theme="dark"/><strong>Flowthing AI</strong><span>데모 답변</span></div><h2>{message.answer.title}</h2><p>{message.answer.body}</p>{message.answer.rows && <div className="ai-table-wrap"><table><caption className="ai-sr-only">기능별 추천 구성</caption><thead><tr><th>기능·상태</th><th>행동·처리</th><th>컴포넌트</th></tr></thead><tbody>{message.answer.rows.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>}{message.answer.note && <div className="ai-answer-note"><FileText size={16}/><p>{message.answer.note}</p></div>}<AnswerDetails answer={message.answer}/><div className="ai-source-links">{message.answer.sources.map(source => <a target="_blank" rel="noopener noreferrer" href={source.href} key={source.href}><BookOpen size={12}/>{source.title}<ArrowUpRight size={12}/></a>)}</div><div className="ai-answer-actions"><button onClick={() => copy(message)}>{copied === message.id ? <Check size={14}/> : <Copy size={14}/>}{copied === message.id ? '복사됨' : '답변 복사'}</button><button onClick={() => { setContextOpen(true); }}>조건과 근거 보기<ChevronDown size={14}/></button></div>{message === messages.at(-1) && <div className="ai-followup-list"><span>이어서 확인하기</span>{(message.answer.followups||[message.answer.follow]).map(question => <button key={question} className="ai-followup" onClick={() => send(question)}>{question}<ArrowUp size={14}/></button>)}</div>}</div></section>)}</div>}<div ref={end}/></div>
        <div className="ai-compose-area" hidden={view==='mapping'}><form className="ai-composer" onSubmit={event => { event.preventDefault(); send(); }}><label className="ai-sr-only" htmlFor="ai-message">기기 기능이나 디자인 시스템 질문</label><textarea id="ai-message" ref={input} value={draft} onChange={event => setDraft(event.target.value)} placeholder="기기 기능이나 궁금한 기준을 알려주세요…" rows={2} maxLength={4000} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); send(); } }}/><div className="ai-compose-bottom"><span>Enter 전송 · Shift + Enter 줄바꿈</span><button disabled={!draft.trim()} aria-label="질문 보내기"><ArrowUp size={19}/></button></div></form><p className="ai-compose-disclaimer">실제 AI 미연결 · 준비된 예시 답변입니다. 규칙과 API는 연결된 문서에서 확인하세요.</p><p className="ai-sr-only" role="status">{notice || (copied ? '답변을 복사했습니다.' : '')}</p></div>
      </main>
      {view!=='mapping'&&<aside id="ai-context" className={`ai-context ${contextOpen ? 'is-open' : ''}`}><div className="ai-context-heading"><h2>Context & sources</h2><button className="ai-icon" onClick={() => setContextOpen(false)} aria-label="근거 패널 닫기"><X size={17}/></button></div><p className="ai-context-intro">현재 답변의 조건과 근거를<br/>함께 확인하세요.</p><section><h3>기기 조건<span>{latest?.conditions.length || '—'}</span></h3>{latest?.conditions.length ? <ul className="ai-condition-list">{latest.conditions.map(condition => <li key={condition}><Check size={14}/>{condition}</li>)}</ul> : <div className="ai-context-empty"><SlidersHorizontal size={20}/><p>질문을 시작하면<br/>기기 조건이 여기에 표시돼요.</p></div>}</section><section><h3>참고한 기준</h3>{latest?.sources.length ? latest.sources.map(source => <a target="_blank" rel="noopener noreferrer" className="ai-source-card" href={source.href} key={source.href}><div><BookOpen size={15}/><ArrowUpRight size={13}/></div><strong>{source.title}</strong><p>{source.description}</p><span>{source.status}</span></a>) : <p className="ai-context-muted">답변에 사용한 문서만 표시합니다.</p>}</section>{latest?.questions.length > 0 && <section><h3>추가 확인</h3><ul className="ai-question-list">{latest.questions.map(question => <li key={question}>{question}</li>)}</ul></section>}<footer><span>Knowledge source</span><strong>현재 프로젝트 문서</strong><p>승인 버전과 실제 AI 검색은<br/>아직 연결되지 않았어요.</p></footer></aside>}
    </div>
  </div>;
}
