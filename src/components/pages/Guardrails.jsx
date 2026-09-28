import React from 'react';

const Guardrails = () => {
  return (
    <div className="doc-section">
      <h1 className="doc-title">AI Guardrails</h1>
      <p className="doc-intro">
        AI가 UI를 자동 생성할 때 준수해야 하는 규칙과 제약 사항입니다. 
        이를 통해 일관성 있고 안전한 UI를 보장합니다.
      </p>

      {/* Hierarchy Rules */}
      <section className="guardrail-section">
        <h2 className="guardrail-title">1. Atomic Hierarchy Rules</h2>
        <p className="guardrail-desc">
          AI가 컴포넌트를 조합할 때 <strong>Atomic Design 계층</strong>을 준수해야 합니다.
        </p>

        <div className="rule-card">
          <h3>계층 구조</h3>
          <pre className="code-block">
{`Pages
  └── Organisms (복합 컴포넌트)
        └── Molecules (기능 단위)
              └── Atoms (기본 단위)`}
          </pre>
        </div>

        <div className="rule-card">
          <h3>✅ 허용되는 조합</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>상위 계층</th>
                <th>포함 가능</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Page</td>
                <td>Organism, Molecule, Atom</td>
              </tr>
              <tr>
                <td>Organism</td>
                <td>Molecule, Atom</td>
              </tr>
              <tr>
                <td>Molecule</td>
                <td>Atom</td>
              </tr>
              <tr>
                <td>Atom</td>
                <td>없음 (최하위)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rule-card">
          <h3>❌ 금지되는 조합</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>위반</th>
                <th>예시</th>
                <th>이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Atom → Organism 포함</td>
                <td>Button 안에 BinaryDeviceCard</td>
                <td>하위가 상위 포함 불가</td>
              </tr>
              <tr>
                <td>Page → Atom만 사용</td>
                <td>Dashboard에 Button만</td>
                <td>구조적 복잡성 부족</td>
              </tr>
              <tr>
                <td>Molecule 건너뛰기</td>
                <td>Organism → Atom 직접</td>
                <td>중간 계층 필수</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pattern Constraints */}
      <section className="guardrail-section">
        <h2 className="guardrail-title">2. Pattern Constraints</h2>
        <p className="guardrail-desc">
          Matter Cluster 조합에 따라 <strong>허용되는 UI 패턴과 컴포넌트</strong>가 제한됩니다.
        </p>

        <div className="rule-card">
          <h3>Cluster → Pattern 매핑</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>Cluster 조합</th>
                <th>패턴</th>
                <th>허용 컴포넌트</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>OnOff만</td>
                <td>Binary</td>
                <td>BinaryDeviceCard</td>
              </tr>
              <tr>
                <td>OnOff + LevelControl</td>
                <td>Range</td>
                <td>+ VerticalSlider</td>
              </tr>
              <tr>
                <td>OnOff + ColorControl</td>
                <td>Range</td>
                <td>+ ColorTemperatureSlider</td>
              </tr>
              <tr>
                <td>Thermostat</td>
                <td>Circular</td>
                <td>TemperatureControl</td>
              </tr>
              <tr>
                <td>WindowCovering</td>
                <td>Range</td>
                <td>HorizontalSlider, BlindCurtain</td>
              </tr>
              <tr>
                <td>Measurement만</td>
                <td>Info</td>
                <td>Readout (제어 불가)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rule-card">
          <h3>핵심 제약 규칙</h3>
          <ul className="rules-list">
            <li><strong>Binary 패턴:</strong> 단순 on/off 기기에 연속값 컴포넌트(Slider 등) 사용 금지</li>
            <li><strong>Range 패턴 (밝기):</strong> 밝기는 수직 슬라이더로 표현 (직관적 UX)</li>
            <li><strong>Range 패턴 (커튼):</strong> 커튼 위치는 수평 슬라이더로 표현</li>
            <li><strong>Circular 패턴:</strong> 온도 조절은 다이얼 UI가 직관적, 슬라이더 금지</li>
            <li><strong>Info 패턴:</strong> 센서는 정보 표시만 가능, 모든 제어 컴포넌트 금지</li>
          </ul>
        </div>
      </section>

      {/* Token Enforcement */}
      <section className="guardrail-section">
        <h2 className="guardrail-title">3. Token Enforcement</h2>
        <p className="guardrail-desc">
          모든 스타일 값은 <strong>W3C 디자인 토큰</strong>을 사용해야 합니다.
        </p>

        <div className="rule-card">
          <h3>✅ 허용</h3>
          <pre className="code-block">
{`/* 토큰 참조 */
color: var(--sys-color-text-primary);
background: var(--comp-card-bg);
border-radius: var(--comp-card-radius);`}
          </pre>
        </div>

        <div className="rule-card">
          <h3>❌ 금지</h3>
          <pre className="code-block">
{`/* 하드코딩 금지 */
color: #ffffff;
color: #1a1a1a;
background: rgba(255, 255, 255, 0.65);
border-radius: 24px;`}
          </pre>
        </div>

        <div className="rule-card">
          <h3>토큰 계층</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>계층</th>
                <th>용도</th>
                <th>예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>--ref-palette-*</code></td>
                <td>원시 색상값</td>
                <td><code>--ref-palette-orange-500</code></td>
              </tr>
              <tr>
                <td><code>--sys-color-*</code></td>
                <td>의미론적 색상</td>
                <td><code>--sys-color-status-active</code></td>
              </tr>
              <tr>
                <td><code>--comp-*</code></td>
                <td>컴포넌트 특화</td>
                <td><code>--comp-card-bg</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Value Validation */}
      <section className="guardrail-section">
        <h2 className="guardrail-title">4. Value Validation</h2>
        <p className="guardrail-desc">
          기기 제어값은 <strong>안전한 범위</strong> 내에서만 허용됩니다.
        </p>

        <div className="rule-card">
          <h3>온도 (Thermostat)</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>구분</th>
                <th>범위</th>
                <th>기본값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Cooling</td>
                <td>16°C ~ 30°C</td>
                <td>24°C</td>
              </tr>
              <tr>
                <td>Heating</td>
                <td>16°C ~ 28°C</td>
                <td>22°C</td>
              </tr>
            </tbody>
          </table>
          <p className="note">금지: 음수 온도, 40°C 이상</p>
        </div>

        <div className="rule-card">
          <h3>기타 제어값</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>제어 타입</th>
                <th>범위</th>
                <th>기본값</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>밝기 (LevelControl)</td>
                <td>0% ~ 100%</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>색온도 (ColorControl)</td>
                <td>2700K ~ 6500K</td>
                <td>4000K</td>
              </tr>
              <tr>
                <td>커튼/블라인드 위치</td>
                <td>0% (닫힘) ~ 100% (열림)</td>
                <td>50%</td>
              </tr>
              <tr>
                <td>볼륨</td>
                <td>0% (음소거) ~ 100%</td>
                <td>30%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Accessibility */}
      <section className="guardrail-section">
        <h2 className="guardrail-title">5. Accessibility Rules</h2>
        <p className="guardrail-desc">
          모든 UI는 <strong>접근성 표준(WCAG 2.1 AA)</strong>을 준수해야 합니다.
        </p>

        <div className="rule-card">
          <h3>색상 대비비</h3>
          <ul className="rules-list">
            <li><strong>일반 텍스트:</strong> 4.5:1 이상</li>
            <li><strong>큰 텍스트:</strong> 3:1 이상 (18px+ 또는 14px+ bold)</li>
            <li><strong>아이콘/그래픽:</strong> 3:1 이상</li>
          </ul>
        </div>

        <div className="rule-card">
          <h3>터치 타겟 최소 크기</h3>
          <ul className="rules-list">
            <li><strong>버튼:</strong> 44x44px 이상</li>
            <li><strong>슬라이더 핸들:</strong> 44x44px 이상</li>
            <li><strong>탭 아이템:</strong> 48x48px 이상 (권장)</li>
            <li><strong>금지:</strong> 24px 미만 절대 금지</li>
          </ul>
        </div>

        <div className="rule-card">
          <h3>상태 표시 (다중 표시 필수)</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>상태</th>
                <th>색상</th>
                <th>텍스트</th>
                <th>아이콘</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Active</td>
                <td>Orange</td>
                <td>"켜짐"</td>
                <td>채워진 아이콘</td>
              </tr>
              <tr>
                <td>Inactive</td>
                <td>Gray</td>
                <td>"꺼짐"</td>
                <td>빈 아이콘</td>
              </tr>
              <tr>
                <td>Offline</td>
                <td>Light Gray</td>
                <td>"연결 끊김"</td>
                <td>ghost variant</td>
              </tr>
            </tbody>
          </table>
          <p className="note">❌ 잘못된 예: 색상만으로 ON/OFF 구분 (색맹 사용자)</p>
        </div>

        <div className="rule-card">
          <h3>ARIA 라벨 (필수)</h3>
          <pre className="code-block">
{`// ✅ 올바른 예
<Button aria-label="거실 조명 켜기" />
<Slider 
  aria-label="밝기 조절" 
  aria-valuenow={75} 
  aria-valuemin={0} 
  aria-valuemax={100} 
/>

// ❌ 잘못된 예
<Button /> // aria-label 없음
<div onClick={...} /> // role 없음`}
          </pre>
        </div>
      </section>

      {/* Device Compatibility */}
      <section className="guardrail-section">
        <h2 className="guardrail-title">6. Device Compatibility</h2>
        <p className="guardrail-desc">
          기기 상태와 기능에 따른 <strong>UI 호환성 규칙</strong>입니다.
        </p>

        <div className="rule-card">
          <h3>연결 상태별 표시</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>상태</th>
                <th>표시</th>
                <th>제어</th>
                <th>스타일</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>온라인</td>
                <td>정상 컴포넌트</td>
                <td>활성화</td>
                <td>기본 variant</td>
              </tr>
              <tr>
                <td>오프라인</td>
                <td>ghost variant</td>
                <td>비활성화</td>
                <td>opacity: 0.5, 점선 테두리</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rule-card">
          <h3>제어 가능 여부</h3>
          <table className="rules-table">
            <thead>
              <tr>
                <th>분류</th>
                <th>장치 예시</th>
                <th>UI 표시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>제어 가능<br/>(isActuatable: true)</td>
                <td>조명, 에어컨, 커튼</td>
                <td>제어 컴포넌트 활성화<br/>(Toggle, Slider 등)</td>
              </tr>
              <tr>
                <td>제어 불가<br/>(isActuatable: false)</td>
                <td>센서 (온도, 습도, 움직임)</td>
                <td>Readout만 표시<br/>제어 UI 금지</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="rule-card">
          <h3>지원 기능만 표시</h3>
          <p className="note">
            <strong>원칙:</strong> 기기가 지원하지 않는 기능의 UI는 표시하지 않음
          </p>
          <ul className="rules-list">
            <li>밝기 조절 없는 조명 → VerticalSlider 숨김</li>
            <li>색온도 없는 조명 → ColorTemperatureSlider 숨김</li>
            <li>팬 없는 에어컨 → FanModeSelector 숨김</li>
          </ul>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .doc-title {
          font-size: 28px;
          margin-bottom: 8px;
          color: var(--sys-color-text-primary);
        }
        
        .doc-intro {
          font-size: 16px;
          color: var(--sys-color-text-secondary);
          margin-bottom: 40px;
          line-height: 1.5;
        }

        .guardrail-section {
          margin-bottom: 60px;
        }

        .guardrail-title {
          font-size: 20px;
          color: var(--sys-color-text-primary);
          margin-top: 32px;
          margin-bottom: 12px;
          padding-left: 12px;
          border-left: 4px solid var(--color-neutral-300);
        }

        .guardrail-desc {
          font-size: 14px;
          color: var(--sys-color-text-tertiary);
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .rule-card {
          background: var(--sys-color-bg-primary);
          border: 1px solid var(--sys-color-border-primary);
          border-radius: 4px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .rule-card h3 {
          font-size: 16px;
          color: var(--sys-color-text-primary);
          margin: 0 0 16px 0;
          font-weight: 600;
        }

        .code-block {
          background: var(--color-neutral-50);
          border: 1px solid var(--sys-color-border-primary);
          border-radius: 4px;
          padding: 16px;
          font-family: var(--ref-font-family-base);
          font-size: 13px;
          color: var(--sys-color-text-primary);
          overflow-x: auto;
          margin: 0;
          line-height: 1.6;
        }

        .rules-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .rules-table thead {
          background: var(--color-neutral-50);
        }

        .rules-table th {
          padding: 12px;
          text-align: left;
          font-weight: 600;
          color: var(--sys-color-text-primary);
          border-bottom: 2px solid var(--sys-color-border-primary);
        }

        .rules-table td {
          padding: 12px;
          color: var(--sys-color-text-secondary);
          border-bottom: 1px solid var(--sys-color-border-primary);
          line-height: 1.5;
        }

        .rules-table code {
          background: var(--color-neutral-50);
          padding: 2px 6px;
          border-radius: 3px;
          font-family: var(--ref-font-family-base);
          font-size: 12px;
          color: var(--sys-color-text-primary);
        }

        .rules-list {
          margin: 0;
          padding-left: 20px;
          color: var(--sys-color-text-secondary);
          line-height: 1.8;
        }

        .rules-list li {
          margin-bottom: 8px;
        }

        .rules-list strong {
          color: var(--sys-color-text-primary);
        }

        .note {
          margin: 12px 0 0 0;
          padding: 12px;
          background: var(--color-neutral-50);
          border-left: 3px solid var(--color-neutral-300);
          border-radius: 4px;
          font-size: 13px;
          color: var(--sys-color-text-secondary);
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
};

export default Guardrails;
