// Curated examples, not an LLM or a device capability parser.
export const demoCases = [
  { id:'light', category:'기기 구성', title:'밝기 조명', tag:'Binary · Linear', summary:'전원·밝기 지원 / 색온도 미지원', text:'전원·밝기만 지원하고 색온도는 지원하지 않는 조명이야. 밝기는 0–100%야. 어떤 컴포넌트와 연결 명세가 필요해?' },
  { id:'switch', category:'기기 구성', title:'4구 스위치', tag:'Binary · Channels', summary:'채널별 독립 제어 / 전체 제어', text:'4구 스위치이고 각 채널을 독립적으로 켜고 끌 수 있어. 전체 켜기도 지원해. 구성과 상태 처리를 알려줘.' },
  { id:'curtain', category:'기기 구성', title:'스마트 커튼', tag:'Linear · Action', summary:'열림 정도 / 열기·닫기·정지', text:'커튼은 열림 정도 0–100%와 열기·닫기·정지를 지원해. 밝기 슬라이더처럼 구성해도 돼?' },
  { id:'air', category:'기기 구성', title:'에어컨', tag:'Linear · State', summary:'설정 온도 / 현재 온도 / 냉방 모드', text:'에어컨은 전원, 18–30°C 설정 온도, 현재 온도, 냉방·송풍 모드를 지원해. 화면 구성과 모드별 조건을 알려줘.' },
  { id:'speaker', category:'기기 구성', title:'스피커', tag:'Action · Linear', summary:'재생·일시 정지 / 볼륨', text:'스피커는 재생·일시 정지와 0–100% 볼륨을 지원해. 재생 버튼을 전원 버튼과 구분하고 싶어.' },
  { id:'washer', category:'기기 구성', title:'세탁기', tag:'State · Action', summary:'코스 선택 / 시작·일시 정지', text:'세탁기는 일반·섬세 코스와 시작·일시 정지를 지원해. 세탁 중에는 코스 변경을 막는 조건으로 구성해줘.' },
  { id:'fridge', category:'기기 구성', title:'상태 확인용 냉장고', tag:'Readout · Capability', summary:'온도 조회만 가능 / 제어 미지원', text:'냉장고는 냉장·냉동 온도 조회만 지원하고 온도 변경과 전원 제어는 지원하지 않아. 어떤 카드를 써야 해?' },
  { id:'state', category:'상태·오류', title:'꺼짐과 연결 끊김', tag:'Connection · Power', summary:'제어 가능 여부 / 마지막 확인값', text:'전원이 꺼진 상태와 연결이 끊긴 상태는 어떻게 다르게 표현해? 카드의 클릭과 제어도 구분해줘.' },
  { id:'command', category:'상태·오류', title:'명령 실패와 복구', tag:'Pending · Failed', summary:'요청값 / 확인값 / 재시도', text:'조명 밝기를 바꿨는데 명령이 실패했어. 요청한 밝기와 실제 확인값, 재시도는 어떻게 표시해?' },
];
const policy = { title:'Patterns', description:'명령 처리·실패 복구·상태 동기화', href:'#/development/patterns', status:'정책 검토 항목' };
const guideline = { title:'Design Guidelines', description:'상태 의미·지원 기능·접근성', href:'#/development/design-guidelines', status:'현재 문서' };
const base = {
  light: {
    title:'전원과 밝기를 연결하고, 미지원 제어는 제외하세요.',
    body:'전원은 Binary, 밝기는 Linear로 구성합니다. 홈 카드에는 전원 상태와 마지막 확인 밝기를 표시하고, 상세에서는 밝기 조작에 집중합니다. 아래 값 범위는 이 예시의 입력 조건이며 모든 조명의 규격이 아닙니다.',
    rows:[['전원','Binary','Button'],['밝기','Linear','AdaptiveLightSlider'],['홈 상태·진입','Supporting','BinaryDeviceCard']],
    conditions:['전원 지원','밝기 지원 · 예시 0–100%','색온도 미지원'],
    states:[['켜짐','확인된 밝기와 전원 상태를 함께 표시'],['꺼짐','켜기 입력 제공. 저장 밝기 보존 여부는 정책 확인'],['연결 끊김','제어를 제한하고 연결 안내는 접근 가능하게 유지']],
    bindings:[['전원','Button.active ← 확인된 전원','Button.onClick → 전원 변경 요청'],['밝기','AdaptiveLightSlider.value ← 확인된 밝기(%)','onChange(value) → 요청값 변환 후 기기 명령'],['홈 카드','isOn / status / isConnected ← 기기 상태','onToggle → 전원 요청 · onClick → 상세 진입']],
    checks:['켜기 버튼이 상세 진입 이벤트를 함께 실행하지 않는지','미지원 색온도 제어가 노출되지 않는지','홈과 상세가 같은 기기의 확인값을 참조하는지'],
    note:'AdaptiveLightSlider의 현재 API는 value·onChange를 지원합니다. disabled prop은 없으므로 오프라인·대기 중 입력 제한은 상위 화면에서 처리해야 합니다.',
    questions:['밝기 API 단위와 최소·최대·증분','꺼짐 전환 시 밝기 보존 정책','기기 응답 전 요청값을 표시하는 방식'],
    ids:['button','adaptive-light-slider','binary-device-card'],
    followups:['색온도도 지원해. 구성 다시 알려줘','명령이 실패하면 어떻게 표시해?','밝기 API가 0–255야. 어떻게 연결해?'],
  },
  switch: {
    title:'채널별 제어와 전체 제어의 결과를 구분하세요.',
    body:'각 채널을 별도의 Binary 기능으로 연결합니다. 전체 켜기는 하나의 명령으로 보일 수 있지만, 채널별 확인 결과를 그대로 유지해야 일부 실패를 설명할 수 있습니다.',
    rows:[...['1','2','3','4'].map(n=>[`채널 ${n}`,'Binary','Button']),['전체 켜기','Action','Button']],
    conditions:['4개 채널 · 독립 제어','전체 켜기 지원 · 예시 조건'],
    states:[['일부 채널 켜짐','전체 상태를 단순 On으로 축약하지 않고 혼합 상태 표시'],['전체 켜기 대기','요청 대상과 채널별 확인 상태 분리'],['한 채널 실패','실패 채널을 식별하고 성공 채널 상태 유지']],
    bindings:[['개별 채널','Button.active ← channels[id].confirmedPower','onClick → 해당 채널 ID와 요청값 전송'],['전체 켜기','채널 상태 요약 ← 확인된 채널 목록','onClick → 전체 명령 또는 채널별 명령(기기 명세 확인)']],
    checks:['채널 ID와 사용자가 지정한 이름이 일치하는지','전체 켜기에서 한 채널 실패를 재현할 수 있는지','이미 성공한 채널을 무조건 재전송하지 않는지'],
    note:'현재 BinaryDeviceCard는 단일 제어용입니다. 4채널을 단일 isOn prop에 넣지 않습니다. 채널별 카드 구성 또는 다채널 전용 조합은 별도 설계가 필요합니다.',
    questions:['전체 명령의 원자성·채널별 응답 여부','채널별 이름과 순서','실패 채널만 재시도할 수 있는지'],
    ids:['button','binary-device-card'], followups:['전체 켜기에서 한 채널만 실패하면?','연결이 끊기면 채널들은 어떻게 보여줘?'],
  },
  curtain: {
    title:'Linear는 공유하되, 커튼의 의미로 연결하세요.',
    body:'조명 밝기와 커튼 열림 정도는 범위 조절이라는 행동은 같지만 의미가 다릅니다. 열림은 HorizontalSlider로 제안하고, 열기·닫기·정지는 각 명령을 실행하는 Action으로 구분합니다.',
    rows:[['열림 정도','Linear','HorizontalSlider'],['열기·닫기·정지','Action','Button'],['현재 열림 표시','Supporting','Readout']],
    conditions:['열림 정도 0–100% · 예시 조건','열기·닫기·정지 지원'],
    states:[['이동 중','실제 위치와 목표 위치를 구분하고 정지 입력 제공'],['완전히 닫힘','0%와 닫힘 문구를 함께 표시'],['연결 끊김','현재 위치를 확정하지 않고 마지막 확인값으로 구분']],
    bindings:[['열림 정도','HorizontalSlider.value ← 확인된 열림 정도','onChange(value) → 목표 위치 요청'],['정지','Button의 명령 라벨 ← 정지','onClick → stop 명령(실제 이름은 API 확인)']],
    checks:['0%가 닫힘인지 기기 API 방향과 일치하는지','이동 중 정지 버튼이 접근 가능한지','열림 라벨을 밝기 또는 전원으로 표시하지 않는지'],
    note:'HorizontalSlider의 기본 범위는 0–100입니다. 실제 위치 단위가 다르면 어댑터가 필요합니다. 기존 커튼 예시의 isOpen은 위치·이동 상태를 모두 표현하는 명세가 아닙니다.',
    questions:['위치 보고 주기와 모터 이동 상태 제공 여부','0%/100% 방향','이동 중 새 목표 명령 처리 정책'],
    ids:['horizontal-slider','button','readout'],followups:['커튼이 이동 중인데 연결이 끊기면?','명령이 실패하면 어떻게 표시해?'],
  },
  air: {
    title:'설정값과 측정값을 나누고 모드별 제약을 적용하세요.',
    body:'설정 온도는 Linear, 냉방·송풍 선택은 State입니다. 현재 실내 온도는 읽기 전용 측정값으로 표시합니다. 송풍에서 온도 설정을 허용하는지는 기기 명세로 확인하며 임의로 냉방 규칙을 적용하지 않습니다.',
    rows:[['전원','Binary','Button'],['설정 온도','Linear','TemperatureControl'],['냉방·송풍','State','Chip'],['현재 온도','Supporting','Readout']],
    conditions:['전원 지원','설정 온도 18–30°C · 예시 조건','현재 온도 조회','냉방·송풍 모드'],
    states:[['냉방','확인된 모드와 설정 온도, 측정 온도 분리'],['송풍','온도 제어 지원 여부를 확인 후 노출·비활성 결정'],['명령 대기','모드 요청과 확인된 모드를 구분']],
    bindings:[['온도','targetTemp / currentTemp / min / max ← 기기 명세','TemperatureControl.onChange → 설정 온도 요청'],['모드','Chip.active ← 확인된 mode와 비교','Chip.onClick → 해당 모드 요청']],
    checks:['설정 온도를 현재 실내 온도로 표시하지 않는지','지원하지 않는 난방 모드를 자동 추가하지 않는지','최소·최대 온도 입력이 실제 기기 범위에 맞는지'],
    note:'현재 TemperatureControl의 기본값 18–30은 컴포넌트 기본값입니다. 실제 기기의 범위·증분·섭씨/화씨 규칙을 대체하지 않습니다.',
    questions:['모드별 설정 온도 지원 여부','온도 증분과 단위 변환','현재 온도 미수신 시 표현'],
    ids:['temperature-control','chip','readout','button'],followups:['송풍 모드에서는 온도 설정을 지원하지 않아','명령이 실패하면 어떻게 표시해?'],
  },
  speaker: {
    title:'재생 상태와 전원 상태를 별도로 다루세요.',
    body:'재생·일시 정지는 콘텐츠 동작이고 전원 켜기·끄기와 같지 않습니다. 홈에는 ActionDeviceCard의 재생 상태를, 상세에는 볼륨 범위 조절을 연결하는 구성을 제안합니다.',
    rows:[['재생·일시 정지','Action','ActionDeviceCard'],['볼륨','Linear','HorizontalSlider']],
    conditions:['재생·일시 정지 지원','볼륨 0–100% · 예시 조건','전원 기능은 입력에서 확인되지 않음'],
    states:[['일시 정지','재생 시작 동작을 제공. 꺼짐으로 표시하지 않음'],['볼륨 0','무음과 재생 중 여부를 별도로 표시'],['연결 끊김','재생·볼륨 제어 제한. 마지막 상태는 현재 상태와 구분']],
    bindings:[['홈 카드','isPlaying / status / isConnected ← 재생·연결 상태','onAction → 현재 재생 상태에 따른 재생/일시 정지 요청'],['볼륨','HorizontalSlider.value ← 확인된 볼륨','onChange(value) → 볼륨 변경 요청']],
    checks:['일시 정지를 전원 Off로 번역하지 않는지','볼륨 0에서도 재생 상태를 잃지 않는지','액션 아이콘과 접근 가능한 이름이 함께 바뀌는지'],
    note:'볼륨 0을 무음으로 취급하는 방식과 별도의 mute 기능은 기기마다 다를 수 있습니다. 명세에 없는 mute 토글을 새 기능처럼 제공하지 않습니다.',
    questions:['볼륨 단위와 증분','독립적인 음소거 지원 여부','재생 상태 알림·확인 방식'],
    ids:['action-device-card','horizontal-slider'],followups:['볼륨이 0이면 전원을 꺼야 해?','명령이 실패하면 어떻게 표시해?'],
  },
  washer: {
    title:'코스 선택과 실행 명령을 분리하세요.',
    body:'일반·섬세 코스는 State, 시작·일시 정지는 Action입니다. 세탁 중 코스 변경을 제한한다는 입력 조건을 명세에 명시합니다. 명령을 보냈다는 사실과 실제 작동 중 상태를 구분해야 합니다.',
    rows:[['일반·섬세 코스','State','Chip'],['시작·일시 정지','Action','Button'],['작동 상태','Supporting','DeviceInfo']],
    conditions:['일반·섬세 코스','시작·일시 정지 지원','작동 중 코스 변경 제한 · 입력 조건'],
    states:[['대기','코스 선택·시작 입력 허용'],['작동 중','코스 변경 제한 사유 표시. 지원되는 일시 정지 제공'],['일시 정지','다시 시작 가능 여부는 기기 명세 확인']],
    bindings:[['코스','Chip.active ← confirmedCourse 비교','onClick → course 변경 요청'],['실행','Button 라벨·활성 여부 ← confirmedRunState','onClick → start / pause 요청(실제 API 이름 확인)']],
    checks:['작동 중 코스를 바꿀 수 없는 이유가 표시되는지','시작 클릭만으로 Running을 확정하지 않는지','원격 시작 불가 조건에서 조작을 제한하는지'],
    note:'Chip에는 disabled prop이 없습니다. 작동 중 코스 선택 제한은 상위 UI에서 입력 차단과 접근성 상태를 함께 처리해야 합니다. 원격 시작 안전 조건은 이 데모에서 승인되지 않았습니다.',
    questions:['문 열림·원격 시작 허용 상태 제공 여부','일시 정지 후 코스 변경 가능 여부','다시 시작 명령 지원 여부'],
    ids:['chip','button','device-info'],followups:['문이 열려 있을 때 시작 요청을 보내도 돼?','명령이 실패하면 어떻게 표시해?'],
  },
  fridge: {
    title:'조회 기능만 있다면 제어 버튼을 숨기세요.',
    body:'온도 조회는 Supporting 표시 기능입니다. 온도 변경·전원 제어 미지원이라는 조건에 따라 제어를 제공하지 않고 냉장·냉동 측정값을 구분해 보여줍니다.',
    rows:[['냉장·냉동 온도','Supporting','Readout'],['기기 요약·상세 이동','Supporting','BinaryDeviceCard']],
    conditions:['냉장·냉동 온도 조회만 지원','온도 변경 미지원','전원 제어 미지원'],
    states:[['연결됨','두 구획의 온도와 단위를 분리 표시'],['측정값 미수신','0°로 대체하지 않고 확인 불가 표시'],['연결 끊김','마지막 확인값과 시각을 현재 값과 구분']],
    bindings:[['요약 카드','status ← 냉장·냉동 확인 온도 / showControl=false','onClick → 상세 상태 조회'],['측정값','Readout ← 값·단위(실제 props는 문서 확인)','제어 이벤트 연결 없음']],
    checks:['미지원 전원 버튼이 보이지 않는지','상세 진입은 제어 미지원과 무관하게 가능한지','미수신 값이 0°C로 바뀌지 않는지'],
    note:'isActuatable=false만 전달하면 버튼은 비활성화되어 남을 수 있습니다. 제어 자체가 없는 이 사례에서는 현재 BinaryDeviceCard의 showControl=false를 사용합니다.',
    questions:['온도 단위와 갱신 주기','센서 미수신·오프라인의 구분','마지막 확인 시각 제공 여부'],
    ids:['readout','binary-device-card'],followups:['온도가 아직 수신되지 않았으면 0으로 보여줘도 돼?','연결이 끊기면 어떻게 표시해?'],
  },
  state: {
    title:'전원과 연결을 서로 다른 상태 축으로 관리하세요.',
    body:'꺼짐은 확인된 전원 상태이고 연결 끊김은 현재 상태를 확인할 수 없는 조건입니다. 카드의 상세 진입과 제어 버튼 입력도 따로 판단합니다.',
    rows:[['꺼짐 · 연결됨','켜기 입력 허용','BinaryDeviceCard'],['연결 끊김','제어 제한 · 안내 진입','BinaryDeviceCard']],
    conditions:['전원 상태와 연결 상태를 분리'],
    states:[['꺼짐','저장값·지원 기능 정책에 따라 켜기 제공'],['오프라인','제어 비활성. 연결 안내는 열 수 있음'],['재연결','실제 상태 재조회 전까지 마지막값으로 유지']],
    bindings:[['카드','isOn / isConnected를 별도 값으로 전달','onClick → 안내·상세 / onToggle → 전원 요청'],['표시값','마지막 확인값 + 확인 시각','오프라인에서 현재 값으로 단정하지 않음']],
    checks:['오프라인에서 입력이 실제 명령을 보내지 않는지','꺼짐 카드에서 켜기 입력이 가능한지','연결 안내가 비활성 카드에 가려지지 않는지'],
    note:'현재 카드 컴포넌트는 isConnected=false일 때 제어를 제한합니다. 연결 안내 문구·재연결 정책·데이터 신선도 표시는 상위 화면에서 정의해야 합니다.',
    questions:['재연결 완료 판단 기준','마지막 확인값 표시 정책'],
    ids:['binary-device-card'],followups:['명령 처리 중에는 어떤 상태가 필요해?'],
  },
};
function enrich(data, catalog) {
  const sources = (data.ids || []).map(id => {
    const item = catalog.find(entry => entry.id === id);
    if (!item) throw new Error('Unknown demo component: ' + id);
    return { title:item.title, description:item.description, href:'#/components/'+id, status:'기존 컴포넌트' };
  });
  return { ...data, sources:[...sources,policy,guideline], follow:data.followups?.[0] || demoCases[0].text };
}
export function replyFor(text, previous, catalog) {
  const explicit = /4구|스위치|채널/.test(text) ? 'switch' : /커튼/.test(text) ? 'curtain' : /에어컨|냉방|송풍/.test(text) ? 'air' : /스피커|볼륨/.test(text) ? 'speaker' : /세탁|코스|문이 열/.test(text) ? 'washer' : /냉장고|냉장|냉동|수신되지/.test(text) ? 'fridge' : /조명|밝기|색온도/.test(text) ? 'light' : null;
  const topic = explicit || previous?.deviceTopic || previous?.topic;
  if (/실패|처리 중|대기|타임아웃|재시도/.test(text)) {
    const source = base[topic] || base.light;
    return enrich({ topic:'command', deviceTopic:base[topic] ? topic : 'light', title:topic==='switch'?'전체 요청의 일부 실패를 채널별로 확인하세요.':'요청값과 확인값을 분리하고 실패를 설명하세요.', body:'사용자가 요청한 값은 requested, 기기가 확인한 값은 confirmed로 나눕니다. 명령 응답이 오기 전까지 성공으로 확정하지 않습니다. 아래는 정책 초안이며 실제 통신을 검증한 결과가 아닙니다.', rows:source.rows, conditions:previous?.deviceTopic===topic||previous?.topic===topic?previous.conditions:source.conditions, states:[['idle','확인된 값 표시·요청 가능'],['pending','요청값과 처리 중 표시. 중복 입력 정책은 미정'],['succeeded','기기 확인값으로 업데이트'],['failed / timed_out','실패 사유·확인값 유지 또는 복구·재시도 가능 여부 안내']], bindings:[['확인 상태','confirmed ← 기기 응답/상태 이벤트','검증되지 않은 요청값으로 덮어쓰지 않음'],['요청 상태','requested + commandStatus ← 사용자 입력','request ID로 결과를 해당 요청에 연결']], checks:['실패한 요청을 성공으로 표시하지 않는지','늦은 응답이 새 요청의 값을 덮어쓰지 않는지',...(topic==='switch'?['실패 채널만 식별하고 성공 채널 상태를 유지하는지']:[])], note:'타임아웃 시간·자동 재시도 횟수·낙관적 업데이트는 승인된 기준이 없습니다. 제품 담당자·API 명세 확인 후 결정하세요.', questions:['기기 완료 응답과 접수 응답의 차이','중복 명령 방지·재시도 안전성','타임아웃·이전 값 복구 정책'], ids:source.ids, followups:['연결이 끊기면 어떻게 표시해?'] },catalog);
  }
  if (/연결|오프라인|꺼진|꺼짐/.test(text) && !explicit) {
    const data=enrich({...base.state,topic:'state',deviceTopic:base[topic]?topic:undefined},catalog);
    if(previous?.conditions?.length) data.conditions=previous.conditions;
    return data;
  }
  const followChange = /지원|구성|단위|연결해|0.?255|어떻게|왜|알려/.test(text);
  if (base[topic] && (explicit || followChange)) {
    const data={...base[topic],topic,deviceTopic:topic};
    if(topic==='light') {
      const mentions=/색온도/.test(text);
      const unsupported=/색온도.*(지원하지|미지원|지원 안|안.*지원)/.test(text);
      const supports=mentions&&!unsupported&&/색온도.*지원/.test(text) || !mentions&&previous?.conditions?.includes('색온도 지원');
      if(supports) { data.rows=[...data.rows,['색온도','Linear','ColorTemperatureSlider']]; data.conditions=[...data.conditions.slice(0,2),'색온도 지원']; data.ids=[...data.ids,'color-temperature-slider']; data.note+=' 색온도는 실제 Kelvin 범위와 증분을 명세에 추가합니다.'; }
      if(/255/.test(text)) { data.conditions=[...data.conditions.filter(c=>!c.startsWith('밝기 지원')),'밝기 API 0–255 · UI 0–100%']; data.bindings=[...data.bindings,['밝기 변환','UI = round(api / 255 × 100)','API 요청 = round(ui / 100 × 255)']]; data.note+=' 이 선형 변환은 0–255 명세를 전제로 한 초안입니다. 0이 전원 꺼짐인지와 반올림 규칙은 확인해야 합니다.'; }
    }
    if(topic==='air'&&/송풍.*(지원하지|미지원|지원 안)/.test(text)) { data.conditions=[...data.conditions,'송풍에서 온도 설정 미지원']; data.note+=' 송풍에서는 온도 입력을 제한하고 이유를 표시합니다. 냉방 설정값 보존 여부는 별도 정책입니다.'; }
    if(topic==='washer'&&/문이 열/.test(text)) { data.title='원격 시작 허용 조건을 먼저 확인하세요.'; data.note+=' 문 열림 상태에서는 시작 요청을 허용할지 기기 안전 명세가 필요합니다. UI 제한만으로 실제 안전을 보장하지 않습니다.'; }
    return enrich(data,catalog);
  }
  return {topic:'unknown',title:'이 질문은 아직 데모 답변 범위 밖이에요.',body:'이 화면은 준비된 사례를 보여주는 프로토타입입니다. 자유 질문을 실제 AI가 해석하지 않습니다. 아래 설계 사례로 시작하거나 실제 연결 후 질문을 확장할 수 있어요.',conditions:[],questions:['실제 AI 검색·기기 명세 해석은 후속 연결 대상'],sources:[],followups:[demoCases[0].text],follow:demoCases[0].text};
}
