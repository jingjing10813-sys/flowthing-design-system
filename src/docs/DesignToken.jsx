import TokenReference from './TokenReference';

export default function DesignToken({ reference = false }) {
  return <div className="design-token-doc">
    <div className="eyebrow">FOUNDATIONS</div>
    <h1>{reference?'Token Reference':'Design Token'}</h1>
    <p className="lead">{reference?'현재 정의된 토큰의 이름, 값, 참조 관계를 한곳에서 확인합니다.':'디자인의 값을 이름으로 정의하고, 디자인과 개발에서 같은 기준으로 사용합니다.'}</p>
    <div className="token-cover" aria-hidden="true">
      <div><span>REFERENCE</span><strong>neutral · 0</strong><i className="token-cover-swatch" /></div>
      <span className="token-arrow">→</span>
      <div><span>SYSTEM</span><strong>bg · primary</strong><div className="token-cover-surface" /></div>
      <span className="token-arrow">→</span>
      <div><span>COMPONENT</span><strong>button · radius</strong><div className="token-cover-button">Button</div></div>
    </div>
    <nav className="document-tabs" aria-label="디자인 토큰 문서">
      <a href="#/foundations/design-token" aria-current={!reference ? 'page' : undefined}>Overview</a>
      <a href="#/foundations/design-token/reference" aria-current={reference ? 'page' : undefined}>Reference</a>
    </nav>
    {reference ? <TokenReference/> : <>
      <section id="token-introduction"><h2>디자인 토큰이 무엇인가요?</h2><p>색상, 크기, 그림자처럼 반복해서 사용하는 디자인 값에 이름을 붙인 것입니다. 개별 화면마다 값을 직접 지정하는 대신 같은 이름을 참조해 일관성을 유지합니다.</p><p>Flowthing에서는 CSS 변수로 토큰을 정의합니다. 문서의 이름과 실제 코드에서 사용하는 이름이 같아야 디자인 변경을 구현까지 이어갈 수 있습니다.</p></section>
      <section id="token-structure"><h2>Flowthing 디자인 토큰의 구성</h2><div className="token-tier-list">
        <div><span>01</span><h3>Reference</h3><p>색상 팔레트와 기본 글꼴처럼 바탕이 되는 값을 정의합니다.</p><code>--ref-palette-neutral-0</code></div>
        <div><span>02</span><h3>System</h3><p>본문, 배경, 상태 등 사용 목적에 맞춰 기본 값을 연결합니다.</p><code>--sys-color-bg-primary</code></div>
        <div><span>03</span><h3>Component</h3><p>버튼, 카드, 슬라이더에 필요한 구체적인 스타일을 정의합니다.</p><code>--comp-button-radius</code></div>
      </div><p>역할에 맞는 토큰이 있다면 그 이름을 우선 사용합니다. 기존 코드의 직접 지정 값과 토큰 적용 범위는 단계적으로 정리하고 있습니다.</p></section>
      <section id="token-usage"><h2>토큰 사용하기</h2><p>CSS에서 <code>var()</code>로 참조합니다. 아래 이름은 현재 프로젝트에 정의된 토큰입니다.</p><pre><code>{`.surface {\n  background: var(--sys-color-bg-primary);\n  color: var(--sys-color-text-primary);\n}\n\n.button {\n  border-radius: var(--comp-button-radius);\n  background: var(--comp-button-bg-enabled);\n}`}</code></pre><p>영문·숫자는 Urbanist, 한글은 Pretendard를 사용하고 자간은 기본값을 유지합니다.</p></section>
    </>}
    <div className="page-pagination"><a href="#/foundations">← Foundations</a>{!reference&&<a href="#/foundations/design-token/reference">Reference →</a>}</div>
  </div>;
}
