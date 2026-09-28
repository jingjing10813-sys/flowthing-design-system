import Guardrails from '../components/pages/Guardrails';

const pages = [
  ['guide', 'Developer Guide', '로컬 실행과 컴포넌트 사용 방법을 확인하고 개발을 시작합니다.'],
  ['patterns', 'Patterns', '기기 연결, 명령 처리, 실패 복구 등 반복되는 동작을 검토합니다.'],
  ['ai-guardrails', 'AI Guardrails', 'AI가 참조할 컴포넌트 조합, 값 범위, 기기 호환성 규칙을 확인합니다.'],
  ['design-guidelines', 'Design Guidelines', '화면의 일관성, 타이포그래피, 접근성과 상태 표현을 점검합니다.'],
];

export default function Validation({ page }) {
  if (page === 'ai-guardrails') return <><div className="eyebrow">DEVELOPMENT</div><div className="callout"><strong>규칙 문서 · 검토 필요</strong><p>기존 가이드입니다. 계층 규칙의 모순과 실제 API 차이는 정리 중이며, 자동 검사 결과를 의미하지 않습니다.</p></div><Guardrails /></>;
  if (page === 'patterns') return <><div className="eyebrow">DEVELOPMENT</div><h1>Patterns</h1><p className="lead">스마트홈에서 반복되는 동작과 상태를 검토합니다.</p><div className="callout">아래는 명세를 정리할 검토 항목입니다. 기기별 정책은 확정 후 구현과 연결합니다.</div>{[
    ['기기 연결', '온라인·오프라인·재연결 상태를 구분하고, 현재 확인할 수 없는 값을 실제 측정값과 구별합니다.'],
    ['명령 처리', '사용자가 요청한 값과 기기가 확인한 값을 구분합니다. 명령 대기 중 중복 입력 처리도 정의합니다.'],
    ['실패와 복구', '실패 안내, 재시도, 이전 값 복구 조건을 함께 정의합니다.'],
    ['상태 동기화', '다른 사용자나 자동화로 변경된 상태가 화면에 반영되는 조건을 정의합니다.'],
  ].map(([title,description])=><div className="pattern-row" key={title}><h2>{title}</h2><p>{description}</p><span>정책 검토 항목</span></div>)}<div className="page-pagination"><a href="#/development">← Overview</a><a href="#/development/ai-guardrails">AI Guardrails →</a></div></>;
  if (page === 'design-guidelines') return <><div className="eyebrow">DEVELOPMENT</div><h1>Design Guidelines</h1><p className="lead">Flowthing 화면을 설계하고 검토할 때 사용하는 공통 기준입니다.</p>{[
    ['Typography', '영문과 숫자는 Urbanist, 한글은 Pretendard를 사용합니다. 자간은 기본값을 유지합니다.'],
    ['Color & Surfaces', '문서, 컴포넌트 미리보기, 목업 배경은 neutral 톤을 사용합니다. 상태는 색상뿐 아니라 텍스트와 아이콘으로도 구별합니다.'],
    ['Layout', '문서의 공통 너비와 여백을 유지합니다. 기기 목업은 너비 393px을 기준으로 하며 좁은 화면에 맞춰 줄어듭니다. 긴 화면은 내부 스크롤 없이 펼쳐 보여줍니다.'],
    ['Components', '문서의 속성과 이벤트가 실제 구현과 같은지 확인합니다. 지원하지 않는 기능은 사용 가능한 것으로 안내하지 않습니다.'],
    ['Accessibility', '키보드 조작, 포커스 표시, 이름과 상태 전달, 텍스트 대비를 확인합니다. 기존 컴포넌트의 접근성 검증은 별도 개선 작업입니다.'],
    ['Device States', '요청, 처리 중, 완료, 실패, 연결 끊김을 구분합니다. 실제 기기 상태를 확인하지 못한 경우 확정된 값처럼 표현하지 않습니다.'],
  ].map(([title,description])=><div className="pattern-row" key={title}><h2>{title}</h2><p>{description}</p></div>)}<div className="page-pagination"><a href="#/development/ai-guardrails">← AI Guardrails</a><a href="#/components">Components →</a></div></>;
  return <><div className="eyebrow">BUILD & REVIEW</div><h1>Development</h1><p className="lead">개발 시작부터 컴포넌트 사용, 동작 패턴과 설계 규칙까지 한곳에서 확인합니다.</p><a className="ai-workspace-entry" href="#/ai"><span><strong>Flowthing AI</strong><span>기기 기능과 디자인 시스템 기준을 함께 살펴보세요.</span></span><span>채팅 시작하기 ↗</span></a><div className="catalog-grid">{pages.map(([id,title,description])=><a key={id} href={'#/development/'+id} className="catalog-card"><span className="card-category">DEVELOPMENT</span><h2>{title}<span aria-hidden="true">↗</span></h2><p>{description}</p></a>)}</div><div className="callout"><strong>현재 제공 범위</strong><p>패턴과 규칙을 확인하는 문서 공간입니다. 명세 자동 검사와 변경 영향 분석은 후속 구현 대상입니다.</p></div></>;
}
