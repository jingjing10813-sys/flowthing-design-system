export function demoFrame(){return {demo:true,name:'스마트홈 · 거실',width:390,height:844,url:'',nodeId:'demo-living-room',fileKey:'local-demo',readAt:new Date().toISOString(),layers:[{id:'power',name:'거실 조명',type:'component',x:24,y:80,width:342,height:180}],mappings:{power:'BinaryDeviceCard'},states:{power:{isOn:true}},confirmed:true,context:'로컬 데모입니다. Figma에서 가져온 데이터가 아닙니다.',variables:'',screenshot:null};}
export function demoSources(){const content=`import { useState } from 'react';
import Button from './Button';
import AdaptiveLightSlider from './AdaptiveLightSlider';

export default function LivingRoom() {
  const [isOn, setIsOn] = useState(true);
  const [brightness, setBrightness] = useState(65);
  return (
    <section>
      <Button active={isOn} onClick={() => setIsOn(!isOn)} />
      <AdaptiveLightSlider value={brightness} onChange={setBrightness} />
    </section>
  );
}
`;return [{id:crypto.randomUUID(),name:'LivingRoom.demo.jsx',content,size:new Blob([content]).size,hash:'local-demo',role:'code',selected:true}];}
