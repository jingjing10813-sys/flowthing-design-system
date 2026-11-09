import { useMemo, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, ChevronDown, CircleHelp, ClipboardCopy, Code2, ExternalLink, Figma, Layers3, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { LightBulb } from 'iconoir-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-json';
import BinaryDeviceCard from '../components/organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';
import Button from '../components/atoms/Button/Button';
import DeviceInfo from '../components/molecules/Display/DeviceInfo/DeviceInfo';
import './HandoffStudio.css';

const figmaHelp = 'https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/';
const codeUrl = 'https://github.com/jingjing10813-sys/flowthing-design-system/blob/main/src/components/organisms/Cards/BinaryDeviceCard/BinaryDeviceCard.jsx';
const clients = {
  Codex: 'Plugins에서 Figma를 설치하고 계정 인증',
  Cursor: 'MCP 설정에 Figma 서버를 추가하고 인증',
  'VS Code': 'MCP 서버 설정에 Figma 서버를 추가하고 인증',
};
const rows = [
  { id: 'power', label: '전원 상태', node: 'Power / Toggle', behavior: 'Binary', component: 'Binary Device Card', status: 'mapped', props: 'isOn · onToggle', detail: '켜짐·꺼짐 값과 전환 이벤트는 현재 컴포넌트의 속성으로 전달할 수 있습니다.' },
  { id: 'connection', label: '연결 상태', node: 'Connection / Status', behavior: 'State', component: 'Binary Device Card', status: 'mapped', props: 'isConnected', detail: '연결이 끊기면 카드 투명도가 바뀌고 제어 버튼이 비활성화됩니다. 실제 연결 상태를 읽는 API는 별도입니다.' },
  { id: 'action', label: '제어 가능 여부', node: 'Control / Enabled', behavior: 'State', component: 'Binary Device Card', status: 'mapped', props: 'isActuatable · showControl', detail: '제어 가능 여부와 버튼 노출은 속성으로 조절합니다. 권한 정책은 이 코드에서 확인되지 않습니다.' },
  { id: 'failure', label: '명령 실패·복구', node: 'Unspecified', behavior: 'Pattern', component: '정책 확인 필요', status: 'review', props: '구현 근거 없음', detail: '명령 대기, 실패 안내, 이전 값 복구는 현재 카드 코드만으로 결정할 수 없습니다.' },
];

function validFigmaLink(value) {
  try {
    const url = new URL(value);
    return /(^|\.)figma\.com$/.test(url.hostname) && /^\/(design|file)\/[^/]+/.test(url.pathname) && url.searchParams.has('node-id');
  } catch { return false; }
}

function renderToken(token, index) {
  if (typeof token === 'string') return token;
  const content = Array.isArray(token.content) ? token.content.map(renderToken) : typeof token.content === 'string' ? token.content : renderToken(token.content, 0);
  return <span key={index} className={`studio-syntax-${token.type}`}>{content}</span>;
}

function HighlightedCode({ value, language }) {
  const grammar = language === 'json' ? Prism.languages.json : language === 'text' ? Prism.languages.plain : Prism.languages.jsx;
  const lines = value.split('\n');
  return <pre className="handoff-code-scroll" aria-label={`${language.toUpperCase()} 코드`}><code>{lines.map((line, index) => <span className="handoff-code-line" key={index}><span className="handoff-line-number" aria-hidden="true">{index + 1}</span><span>{Prism.tokenize(line || ' ', grammar).map(renderToken)}</span></span>)}</code></pre>;
}

export default function HandoffStudio() {
  const [client, setClient] = useState('Codex');
  const [figmaLink, setFigmaLink] = useState('');
  const [selected, setSelected] = useState('power');
  const [isOn, setIsOn] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [isActuatable, setIsActuatable] = useState(true);
  const [showControl, setShowControl] = useState(true);
  const [codeOpen, setCodeOpen] = useState(true);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [codeTab, setCodeTab] = useState('jsx');
  const [copied, setCopied] = useState(false);
  const [serverCopied, setServerCopied] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const active = rows.find(row => row.id === selected);
  const validLink = validFigmaLink(figmaLink.trim());

  const jsxCode = useMemo(() => `import { useState } from 'react';
import { LightBulb } from 'iconoir-react';
import BinaryDeviceCard from './components/organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';

export default function LightingCard() {
  const [isOn, setIsOn] = useState(${isOn});
  const isConnected = ${isConnected};
  const isActuatable = ${isActuatable};

  return (
    <BinaryDeviceCard
      name="Living room light"
      location="Living room"
      status={isConnected ? (isOn ? 'On' : 'Off') : 'Offline'}
      isOn={isOn}
      isConnected={isConnected}
      isActuatable={isActuatable}
      showControl={${showControl}}
      onToggle={() => setIsOn(value => !value)}
      icon={<LightBulb />}
    />
  );
}`, [isOn, isConnected, isActuatable, showControl]);

  const mappingCode = useMemo(() => JSON.stringify({
    source: 'sample-frame',
    figmaLink: validLink ? figmaLink.trim() : null,
    figmaContentRead: false,
    component: 'BinaryDeviceCard',
    assembly: { atom: 'Button', molecule: 'DeviceInfo', organism: 'BinaryDeviceCard' },
    states: { isOn, isConnected, isActuatable, showControl },
    unresolved: ['command pending', 'command failure', 'rollback policy'],
  }, null, 2), [figmaLink, validLink, isOn, isConnected, isActuatable, showControl]);

  const handoffText = `Flowthing handoff · sample\n\nDesign source: ${validLink ? `${figmaLink.trim()} (reference only; content not read)` : 'sample frame; Figma not connected'}\nComponent: BinaryDeviceCard\nDocument: https://jingjing10813-sys.github.io/flowthing-design-system/#/components/binary-device-card\nCode: ${codeUrl}\n\nCurrent states: on=${isOn}, connected=${isConnected}, actuatable=${isActuatable}, control visible=${showControl}\nConfirmed props: isOn, onToggle, isConnected, isActuatable, showControl\nOpen decisions: command pending, failure feedback, rollback policy\n\nThis is a sample mapping, not an analysis of the linked Figma file.`;
  const code = codeTab === 'jsx' ? jsxCode : codeTab === 'mapping' ? mappingCode : handoffText;

  async function copy(value, type) {
    try {
      await navigator.clipboard.writeText(value);
      if (type === 'server') { setServerCopied(true); window.setTimeout(() => setServerCopied(false), 2200); }
      else { setCopied(true); window.setTimeout(() => setCopied(false), 2200); }
    } catch { if (type === 'server') setServerCopied(false); else setCopied(false); }
  }

  return <div className={`handoff-admin ${codeOpen ? '' : 'is-code-collapsed'}`}>
    {sourcesOpen && <aside id="handoff-source-drawer" className="handoff-sources" aria-label="디자인 및 시스템 소스">
      <div className="handoff-panel-heading"><div><span>WORKSPACE INPUT</span><h2>Sources</h2></div><div className="handoff-panel-actions"><span className="handoff-count">02</span><button type="button" aria-label="소스 패널 접기" onClick={() => setSourcesOpen(false)}><PanelLeftClose size={17}/></button></div></div>
      <div className="handoff-source-block"><div className="handoff-source-title"><Figma size={16}/><strong>Figma selection</strong></div><div className="handoff-selected-frame"><span className="handoff-mini-frame"><LightBulb width={20} height={20}/></span><div><strong>Living room light</strong><small>Lighting / sample frame · 샘플</small></div><Check size={14}/></div><label htmlFor="handoff-figma-link">다른 프레임 링크</label><input id="handoff-figma-link" type="url" value={figmaLink} onChange={event => setFigmaLink(event.target.value)} placeholder="Figma node URL…"/>{figmaLink && <p className={validLink ? '' : 'handoff-input-error'}>{validLink ? '링크만 보관됩니다. 파일 내용은 읽지 않아요.' : 'node-id가 포함된 링크를 입력하세요.'}</p>}</div>
      <div className="handoff-source-block"><div className="handoff-source-title"><Layers3 size={16}/><strong>Flowthing system</strong></div><a className="handoff-system-source" href="#/components/binary-device-card"><span>01</span><div><strong>Binary Device Card</strong><small>컴포넌트 · 상태 · 토큰 · 준비됨</small></div><ArrowUpRight size={13}/></a><a className="handoff-system-source" href={codeUrl} target="_blank" rel="noreferrer"><span>02</span><div><strong>Implementation</strong><small>BinaryDeviceCard.jsx</small></div><ArrowUpRight size={13}/></a></div>
      <div className="handoff-connect-block"><button className="handoff-connect-toggle" type="button" aria-expanded={guideOpen} onClick={() => setGuideOpen(!guideOpen)}><span><CircleHelp size={15}/> MCP 연결 안내</span><ChevronDown size={14}/></button>{guideOpen && <div className="handoff-connect-body"><p>Figma 연결은 지원되는 클라이언트에서 인증합니다. 이 웹은 연결 상태를 읽지 않아요.</p><div className="handoff-client-list">{Object.keys(clients).map(name => <button key={name} type="button" aria-pressed={client === name} onClick={() => setClient(name)}>{name}</button>)}</div><p>{clients[client]}</p><div className="handoff-server-line"><code>https://mcp.figma.com/mcp</code><button type="button" aria-label="Figma MCP 서버 주소 복사" onClick={() => copy('https://mcp.figma.com/mcp', 'server')}>{serverCopied ? <Check size={13}/> : <ClipboardCopy size={13}/>}</button></div><a href={figmaHelp} target="_blank" rel="noreferrer">공식 연결 안내 <ExternalLink size={12}/></a></div>}</div>
      
    </aside>}

    <main className="handoff-analysis" aria-label="시안과 구현 비교 분석">
      <div className="handoff-project-strip"><button type="button" className="handoff-source-trigger" onClick={() => setSourcesOpen(value => !value)} aria-expanded={sourcesOpen} aria-controls="handoff-source-drawer"><PanelLeftOpen size={16}/><span>Sources</span><b>02</b></button><div className="handoff-project-path"><span><Figma size={13}/> Lighting / Living room light</span><ArrowRight size={13}/><span><Layers3 size={13}/> Flowthing / Binary Device Card</span></div><span className="handoff-project-mode">SAMPLE · FIGMA 미연결</span></div>
      <div className="handoff-analysis-header"><h2>Atom → Molecule → Organism</h2></div>
      <div className="handoff-visual-map"><div className="handoff-assembly-flow"><div className="handoff-assembly-stage"><div className="handoff-assembly-label"><span>01 / ATOM</span><strong>Control</strong></div><div className="handoff-assembly-preview"><Button active={isOn} disabled={!isConnected || !isActuatable} variant={!isConnected ? 'ghost' : !isActuatable ? 'filled' : !isOn ? 'neumorph-dark' : 'neumorph'} onClick={() => setIsOn(value => !value)} aria-label="샘플 조명 전원 전환" icon={<LightBulb/>}/></div><div className="handoff-assembly-caption"><strong>Button</strong><span>전원 입력 · on/off</span></div></div><span className="handoff-assembly-arrow" aria-hidden="true"><ArrowRight size={17}/></span><div className="handoff-assembly-stage"><div className="handoff-assembly-label"><span>02 / MOLECULE</span><strong>Information</strong></div><div className="handoff-assembly-preview"><DeviceInfo name="Living room light" location="Living room" status={isConnected ? (isOn ? 'On' : 'Off') : 'Offline'} isOn={isOn}/></div><div className="handoff-assembly-caption"><strong>DeviceInfo</strong><span>이름 · 위치 · 상태</span></div></div><span className="handoff-assembly-arrow" aria-hidden="true"><ArrowRight size={17}/></span><div className="handoff-assembly-stage is-organism"><div className="handoff-assembly-label"><span>03 / ORGANISM</span><strong>Device card</strong></div><div className="handoff-assembly-preview"><BinaryDeviceCard name="Living room light" location="Living room" status={isConnected ? (isOn ? 'On' : 'Off') : 'Offline'} isOn={isOn} isConnected={isConnected} isActuatable={isActuatable} showControl={showControl} onToggle={() => setIsOn(value => !value)} icon={<LightBulb/>} style={{width:'100%',maxWidth:290}}/></div><div className="handoff-assembly-caption"><strong>BinaryDeviceCard</strong><span>Button + DeviceInfo</span></div></div></div></div>
      <div className="handoff-controls"><strong className="handoff-controls-title">State</strong><label><input type="checkbox" checked={isOn} onChange={event => setIsOn(event.target.checked)}/> On</label><label><input type="checkbox" checked={isConnected} onChange={event => setIsConnected(event.target.checked)}/> Connected</label><label><input type="checkbox" checked={isActuatable} onChange={event => setIsActuatable(event.target.checked)}/> Actuatable</label><label><input type="checkbox" checked={showControl} onChange={event => setShowControl(event.target.checked)}/> Control</label></div>
      <div className="handoff-results-head"><h3>화면 요소와 구현 기준</h3></div>
      <div className="handoff-results" role="group" aria-label="비교 항목">{rows.map(row => <button type="button" key={row.id} aria-pressed={selected === row.id} className={`handoff-result ${selected === row.id ? 'is-selected' : ''}`} onClick={() => setSelected(row.id)}><span className="handoff-result-icon">{row.status === 'mapped' ? <Check size={12}/> : <CircleHelp size={12}/>}</span><strong>{row.label}</strong><span className="handoff-chip-behavior">{row.behavior}</span></button>)}</div>
      <div className="handoff-selection-detail"><strong>{active.label}</strong><p>{active.detail}</p></div>
      <div className="handoff-context-grid"><div className="handoff-context-card"><span>FIGMA FRAME · SAMPLE</span><div className="handoff-context-frame"><div><LightBulb width={15} height={15}/><small>Living room</small></div><strong>Light</strong><p>Power <b>{isOn ? 'On' : 'Off'}</b></p></div></div><div className="handoff-context-card"><span>INTERPRETED BEHAVIOR</span><div className="handoff-context-behaviors"><div><strong>Binary</strong><p>전원 전환</p><small>ON ↔ OFF</small></div><div><strong>State</strong><p>연결 · 제어 가능</p><small>{isConnected ? 'CONNECTED' : 'OFFLINE'} · {isActuatable ? 'ENABLED' : 'DISABLED'}</small></div></div></div></div>
    </main>

    {codeOpen ? <aside className="handoff-code-panel" aria-label="생성된 코드와 전달 명세"><div className="handoff-code-heading"><h2>Generated code</h2><button type="button" aria-label="코드 패널 접기" onClick={() => setCodeOpen(false)}><PanelRightClose size={17}/></button></div><div className="handoff-code-tabs" role="tablist" aria-label="결과 형식">{[['jsx','LightingCard.jsx'],['mapping','Mapping.json'],['handoff','Handoff.md']].map(([id,label]) => <button type="button" role="tab" aria-selected={codeTab === id} key={id} onClick={() => setCodeTab(id)}>{label}</button>)}</div><HighlightedCode value={code} language={codeTab === 'mapping' ? 'json' : codeTab === 'handoff' ? 'text' : 'jsx'}/><div className="handoff-code-footer"><button type="button" onClick={() => copy(code, 'code')}>{copied ? <Check size={14}/> : <ClipboardCopy size={14}/>} {copied ? '복사됨' : '코드 복사'}</button></div></aside> : <button className="handoff-code-rail" type="button" onClick={() => setCodeOpen(true)} aria-label="코드 패널 펼치기"><PanelRightOpen size={18}/><Code2 size={17}/><span>CODE</span></button>}
  </div>;
}
