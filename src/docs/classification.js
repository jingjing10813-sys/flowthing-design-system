// Behavior definitions: IoT_백지윤.pdf pp. 6–8. Supporting groups map existing code.
export const behaviorGroups = [
  { id: 'binary', title: 'Binary', description: '켜거나 끄고, 열거나 닫는 두 가지 상태 전환' },
  { id: 'linear', title: 'Linear', description: '범위 안에서 밝기·온도·위치 등의 값을 조절' },
  { id: 'state', title: 'State', description: '여러 옵션 중 하나의 상태나 모드를 선택' },
  { id: 'action', title: 'Action', description: '누르는 순간 명령을 실행하는 동작' },
  { id: 'supporting', title: 'Supporting elements', description: '네 가지 행동을 구성하는 표시 요소·조립 부품·탐색 요소' },
];
export const assemblyGroups = [
  { id: 'atoms', title: 'Atom', description: '데이터와 직접 매핑되는 최소 단위 컴포넌트' },
  { id: 'molecules', title: 'Molecule', description: '여러 Atom을 조합한 하나의 기능 단위' },
  { id: 'organisms', title: 'Organism', description: '기기 단위 UI를 구성하는 상위 구조' },
];
export const behaviorLabel = id => behaviorGroups.find(group => group.id === id)?.title || id;
const linearOrder = [
  'slider',
  'horizontal-slider',
  'vertical-slider-no-icons',
  'adaptive-light-slider',
  'color-temperature-slider',
  'temperature-control',
  'speaker-volume-control',
  'blind-curtain',
];
export function classify(items, axis = 'behavior') {
  return (axis === 'behavior' ? behaviorGroups : assemblyGroups).map(group => {
    const members=items.filter(item => axis === 'behavior' ? (item.behaviors.length ? item.behaviors.includes(group.id) : group.id === 'supporting') : item.group === group.id);
    if(axis==='behavior'&&group.id==='linear'){
      const rank=id=>linearOrder.includes(id)?linearOrder.indexOf(id):linearOrder.length;
      members.sort((a,b)=>rank(a.id)-rank(b.id));
    }
    return {...group,items:members};
  }).filter(group => group.items.length);
}
