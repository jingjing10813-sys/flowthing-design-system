import { useState } from 'react';

const sourceUrl = 'https://github.com/jingjing10813-sys/flowthing-design-system/blob/main/src/components/organisms/Cards/BinaryDeviceCard/BinaryDeviceCard.jsx';
const prompt = `선택한 Figma 프레임을 Flowthing의 기존 컴포넌트로 구현할 수 있는지 검토해줘.
먼저 Binary Device Card 문서와 실제 소스 코드를 확인하고, 재사용할 구성과 지원하지 않는 상태를 구분해줘.
컴포넌트·토큰·코드의 원문 위치를 붙이고, 확실하지 않은 값은 질문으로 남겨줘.
새 prop, 이벤트, 토큰을 임의로 만들지 마.`;

const handoff = `대상 Figma 프레임: [노드 링크 / 디자인 버전]
기준 컴포넌트: Binary Device Card — [문서 링크]
구현 소스: BinaryDeviceCard.jsx — [소스 링크]
동작·상태: on/off, 연결 끊김, 비활성 — [시안과 코드에서 확인한 범위]
토큰: [실제로 참조한 토큰]
차이·미정 항목: [시안에는 있으나 코드에서 확인되지 않은 내용]
결정할 사람과 기준: [담당자 / 확인 방법]`;

function CopyBlock({ title, value }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };
  return <div className="handoff-copy-block"><div className="handoff-copy-heading"><strong>{title}</strong><button className="doc-button" type="button" onClick={copy}>{copied ? '복사됨' : '복사'}</button></div><pre><code>{value}</code></pre></div>;
}

export default function DesignerHandoff() {
  return <div className="designer-handoff">
    <div className="eyebrow">FOR DESIGNERS · MCP HANDOFF</div>
    <h1>화면을 넘기는 대신,<br />판단 근거까지 연결합니다.</h1>
    <p className="lead">Figma 시안을 Flowthing의 기존 컴포넌트·토큰·구현 코드와 대조해 개발자가 이어서 판단할 수 있는 핸드오프를 만듭니다.</p>
    <div className="handoff-actions"><a className="handoff-primary" href="#handoff-steps">가이드 시작하기 <span aria-hidden="true">↘</span></a><a className="handoff-secondary" href="#/components/binary-device-card">예시 컴포넌트 보기 ↗</a></div>

    <section id="handoff-structure">
      <div className="handoff-section-heading"><span>01 / 연결 구조</span><h2>두 맥락을 함께 읽습니다</h2><p>Figma MCP는 선택한 프레임의 디자인 맥락을 전달합니다. Flowthing 문서와 저장소 코드는 컴포넌트의 실제 지원 범위를 확인하는 별도 근거입니다.</p></div>
      <div className="handoff-flow" aria-label="Figma 시안과 Flowthing 문서 및 코드가 MCP 클라이언트에서 함께 검토되어 핸드오프 결과로 이어집니다">
        <div className="handoff-flow-source"><small>DESIGN SOURCE</small><strong>Figma 시안</strong><span>프레임 · 컴포넌트 · 변수</span></div>
        <span className="handoff-flow-join" aria-hidden="true">↘</span>
        <div className="handoff-flow-center"><small>IN YOUR MCP CLIENT</small><strong>맥락 대조</strong><span>기존 구성 재사용 · 차이 확인<br />원문 근거와 미정 항목 기록</span></div>
        <span className="handoff-flow-join" aria-hidden="true">↗</span>
        <div className="handoff-flow-source"><small>SYSTEM SOURCE</small><strong>Flowthing</strong><span>문서 · 토큰 · 구현 코드</span></div>
      </div>
      <div className="handoff-outcome"><span aria-hidden="true">↓</span><strong>핸드오프 결과</strong><p>무엇을 재사용할지, 어떤 상태가 빠졌는지, 누가 무엇을 결정해야 하는지 한곳에 남깁니다.</p></div>
    </section>

    <section id="handoff-steps">
      <div className="handoff-section-heading"><span>02 / 따라 하기</span><h2>한 화면에서 연결 명세까지</h2><p>각 단계의 결과를 확인한 뒤 다음 단계로 넘어갑니다.</p></div>
      <ol className="handoff-steps">
        <li><span>01</span><div><h3>시안과 상태를 준비합니다</h3><p>Figma에서 대상 프레임, 사용한 컴포넌트, on/off·오프라인 등 필요한 상태를 정리하고 노드 링크를 복사합니다.</p><small>남길 것: 프레임 링크 · 디자인 버전 · 필요한 상태</small></div></li>
        <li><span>02</span><div><h3>MCP 클라이언트에서 디자인 맥락을 읽습니다</h3><p>Figma MCP를 연결한 클라이언트에서 선택한 프레임의 레이어·컴포넌트·변수·레이아웃을 확인합니다. <a href="https://help.figma.com/hc/en-us/articles/39216419318551-Get-started-with-the-Figma-MCP-server" target="_blank" rel="noreferrer">Figma 공식 연결 안내 ↗</a></p><small>남길 것: 선택한 노드와 확인된 디자인 속성</small></div></li>
        <li><span>03</span><div><h3>Flowthing의 실제 구현과 대조합니다</h3><p>관련 컴포넌트 문서의 미리보기·지원 범위·토큰과 저장소의 구현 코드를 함께 확인합니다. 비슷해 보인다는 이유만으로 속성이나 동작을 새로 만들지 않습니다.</p><small>남길 것: 재사용할 컴포넌트 · 소스 경로 · 차이 · 질문</small></div></li>
        <li><span>04</span><div><h3>근거가 있는 결과를 넘깁니다</h3><p>디자이너는 시안과 상태를, 개발자는 실제 API와 구현 가능성을 확인합니다. 아직 정해지지 않은 정책은 미정 항목으로 분리합니다.</p><small>남길 것: 아래 핸드오프 결과 양식</small></div></li>
      </ol>
    </section>

    <section id="handoff-example">
      <div className="handoff-section-heading"><span>03 / 사례</span><h2>Binary Device Card로 확인하기</h2><p>조명의 전원 카드를 넘긴다고 가정합니다. 시안의 카드 형태만 확인하지 말고, 현재 코드가 지원하는 상태와 이벤트를 함께 읽습니다.</p></div>
      <div className="handoff-example-grid">
        <div><small>DESIGN QUESTION</small><h3>켜짐·꺼짐은 어떻게 전달하나요?</h3><p>현재 구현의 <code>isOn</code>과 <code>onToggle</code>을 확인하고, 시안에서 필요한 연결 끊김·비활성 상태를 나란히 적습니다.</p><a href="#/components/binary-device-card">컴포넌트 미리보기와 토큰 보기 ↗</a></div>
        <div><small>IMPLEMENTATION EVIDENCE</small><h3>코드에서 확인한 범위만 적습니다</h3><p><code>isConnected</code>, <code>isActuatable</code>, <code>showControl</code>은 현재 소스에 있습니다. 실제 기기 명령 성공과 실패 복구는 이 코드만으로 확인할 수 없습니다.</p><a href={sourceUrl} target="_blank" rel="noreferrer">BinaryDeviceCard.jsx 원문 보기 ↗</a></div>
      </div>
    </section>

    <section id="handoff-template">
      <div className="handoff-section-heading"><span>04 / 작업에 쓰기</span><h2>요청문과 핸드오프 양식</h2><p>참조 자료를 함께 지정하고, 답변에 근거와 미정 항목이 남도록 요청합니다.</p></div>
      <CopyBlock title="MCP 클라이언트에 요청하기" value={prompt}/>
      <CopyBlock title="개발자에게 전달할 결과" value={handoff}/>
    </section>

    <section id="handoff-review">
      <div className="handoff-section-heading"><span>05 / 최종 확인</span><h2>연결됐다는 것과 검증됐다는 것을 구별합니다</h2></div>
      <div className="handoff-review-grid"><div><strong>디자이너 확인</strong><p>시안의 구성·상태·토큰이 문서 및 컴포넌트 미리보기와 맞는지 확인합니다.</p></div><div><strong>개발자 확인</strong><p>props·이벤트·기기 API 연결과 실패·오프라인 처리 가능 범위를 확인합니다.</p></div><div><strong>함께 결정</strong><p>차이나 미정 정책을 담당자와 근거 링크를 붙여 기록합니다.</p></div></div>
      <div className="callout"><strong>현재 데모 범위</strong><p>Flowthing 웹은 방문자의 Figma 파일에 직접 연결되지 않습니다. AI 대화는 시나리오 데모이며, Mapping은 로컬 텍스트 참조 탐색입니다. 이 가이드는 실제 MCP 클라이언트에서 수행할 절차와 검토 기준을 설명합니다.</p></div>
      <div className="page-pagination"><a href="#/development">← Development</a><a href="#/development/guide">Developer Guide →</a></div>
    </section>
  </div>;
}
