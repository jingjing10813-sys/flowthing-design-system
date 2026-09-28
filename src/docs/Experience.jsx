import Dashboard from '../components/pages/Dashboard/Dashboard';
import Lighting from '../components/pages/LightingControl/LightingControl';
import Air from '../components/pages/AirConditionerControl/AirConditionerControl';
import Curtain from '../components/pages/SmartCurtainControl/SmartCurtainControl';
import Speaker from '../components/pages/SpeakerControl/SpeakerControl';
import Washer from '../components/pages/WasherControl/WasherControl';
import Fridge from '../components/pages/RefrigeratorControl/RefrigeratorControl';
import { ExperienceProvider } from '../components/pages/Dashboard/ExperienceProvider';
import './Experience.css';
const pages={lighting:Lighting,airconditioner:Air,curtain:Curtain,speaker:Speaker,washer:Washer,refrigerator:Fridge};
const deviceRoutes={'main-light':'lighting','bed-light':'lighting/bed-light',air:'airconditioner',speaker:'speaker',fridge:'refrigerator',curtain:'curtain',washer:'washer'};
export default function Experience({ route }) {
 const parts=route.split('/').filter(Boolean);
 const page=parts[1];
 const Page=pages[page];
 const navigate=id=>{location.hash=id==='dashboard'?'#/experience':'#/experience/'+(deviceRoutes[id]||id);};
 return <ExperienceProvider lightId={parts[2]==='bed-light'?'bed-light':'main-light'}><main className="experience-shell">
 {Page?<><div className="experience-bar"><a href="#/experience">← 우리 집</a><a href={'#/devices/'+page}>컴포넌트 문서 ↗</a></div><Page onNavigate={navigate} roomName={parts[2]==='bed-light'?'Bedroom':'Living Room'} deviceName={parts[2]==='bed-light'?'Bedroom Light':'Main Light'}/></>:!page?<Dashboard standalone onNavigate={navigate}/>:<div className="experience-missing"><p>기기 화면을 찾을 수 없어요.</p><a href="#/experience">우리 집으로</a></div>}
 </main></ExperienceProvider>;
}
