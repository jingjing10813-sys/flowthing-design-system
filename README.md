# Flowthing (IoT Design System)

IoT 대시보드 및 컨트롤 패널 구축을 위한 React 기반 디자인 시스템입니다.
물리적 장치 제어와 실시간 상태 모니터링에 최적화된 컴포넌트 라이브러리를 효율적으로 관리하고 생산하기 위한 템플릿입니다.

## 🚀 시작하기 (Getting Started)

### 설치 (Installation)

```bash
npm install
```

### 개발 서버 실행 (Run Dev Server)

```bash
npm run dev
```

브라우저에서 `http://localhost:5173`으로 접속하여 확인할 수 있습니다.

---

## 📐 Atomic Design Classification (아토믹 계층 정의)

이 시스템은 사용자 경험(UX)과 기능적 복잡도를 기준으로 **Atom**, **Molecule**, **Organism**을 재정의하여 설계되었습니다.

### 1. Atom (시각적 최소 단위)

디자인의 **'심미적 규칙'**을 아톰으로 설계했습니다.

- **정의**: 더 이상 쪼갤 수 없는 시각적 요소이자 디자인 토큰의 집합체.
- **구성**: 버튼의 상태(Default, Pressed, Disabled), 크기, 색상, 아이콘 그 자체.
- **역할**: 기능보다는 스타일과 상태 표현에 집중합니다.

### 2. Molecule (기능적 최소 단위)

아톰들을 모아 사용자의 **'핵심 행동(Pattern)'**을 수행하는 모듈입니다.
IoT 환경의 **4대 행동 패턴**을 기반으로 기능 로직이 주입된 상태입니다.

- **Binary Molecule**:
  - 아톰 버튼에 '켜고 끄는 로직(Toggle/Trigger)'이 붙은 상태.
  - 예: 전원 스위치, 동작 트리거.
- **Linear Molecule**:
  - 슬라이더/다이얼 아톰에 '수치 조절 로직'이 붙은 상태.
  - 예: 온도 조절 다이얼, 밝기 슬라이더.

### 3. Organism (맥락 적응형 컨트롤러)

단순히 모듈을 배치하는 것이 아니라, **"무엇(What)"을 제어할지 판단하는 주체**입니다.

- **정의**: "온도", "조명"과 같은 도메인 맥락(Context)을 이해하는 완성된 제어 카드.
- **역할**: 주입된 데이터(맥락)에 따라 가장 적절한 Molecule(Binary vs Linear 등)을 선택하여 사용자에게 제시합니다.

---

## 🎨 W3C Design Tokens

이 시스템은 **W3C Design Tokens**의 표준 개념을 바탕으로 스타일을 관리합니다.
하드코딩된 값 대신 의미론적(Semantic) 토큰을 사용하여 유지보수성과 확장성을 확보했습니다.

- **Token Format**: `--comp-[component]-[property]-[state]`
- **Example**:
  - `--comp-button-bg-enabled`
  - `--comp-button-radius`

---

## 📂 Implementation Structure (구현 구조)

위의 아토믹 개념을 실제 코드베이스에서는 다음과 같은 폴더 구조로 관리합니다.

### `src/components/`

#### 1. `atoms/` & `foundations/`

시각적 원자(Atom)와 디자인 토큰을 관리합니다.

- **Colors, Typography, Icons**
- **Base Components**: `Button` (Visual only)

#### 2. `molecules/`

기능적 패턴(Binary, Linear)을 구현합니다.

- **Binary/**: `Action` (Trigger/Toggle logic)
- **Linear/**: _Planned_

#### 3. `inputs/` & `data-display/` (Pattern Collections)

각종 제어 및 표시 요소들을 역할별로 모아둔 디렉토리입니다.

- **inputs/**: `TemperatureControl`, `Switch`, `Slider`
- **data-display/**: `SensorCard`, `StatusBadge`

#### 4. `layout/` & `navigation/` & `overlay/`

화면 구성과 흐름을 담당하는 컨테이너 요소들입니다.

---

## 🛠 기술 스택 (Tech Stack)

- **Core**: React, Vite
- **Language**: JavaScript (ES6+)
- **Styling**: Vanilla CSS (CSS Modules & W3C Design Tokens)
