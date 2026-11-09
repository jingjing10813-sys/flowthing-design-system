import { useState } from 'react';
import Dashboard from '../components/pages/Dashboard/Dashboard';
import Lighting from '../components/pages/LightingControl/LightingControl';
import Air from '../components/pages/AirConditionerControl/AirConditionerControl';
import Curtain from '../components/pages/SmartCurtainControl/SmartCurtainControl';
import Speaker from '../components/pages/SpeakerControl/SpeakerControl';
import Washer from '../components/pages/WasherControl/WasherControl';
import Fridge from '../components/pages/RefrigeratorControl/RefrigeratorControl';
import { ExperienceProvider } from '../components/pages/Dashboard/ExperienceProvider';
const pages={dashboard:Dashboard,lighting:Lighting,airconditioner:Air,curtain:Curtain,speaker:Speaker,washer:Washer,refrigerator:Fridge};
const routes={'main-light':'lighting','bed-light':'lighting',air:'airconditioner',fridge:'refrigerator'};
export default function DocumentTemplatePreview(){
  const [page,setPage]=useState('lighting');
  const Page=pages[page]||Dashboard;
  return <ExperienceProvider><div className="document-template-in-phone"><Page onNavigate={id=>setPage(routes[id]|| (pages[id]?id:'dashboard'))}/></div></ExperienceProvider>;
}
