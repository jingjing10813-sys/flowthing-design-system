import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { LightBulb } from 'iconoir-react';
import TemperatureControl from '../components/molecules/Circular/TemperatureControl/TemperatureControl';
import AdaptiveLightSlider from '../components/molecules/Linear/AdaptiveLightSlider/AdaptiveLightSliderNew';
import BinaryDeviceCard from '../components/organisms/Cards/BinaryDeviceCard/BinaryDeviceCard';
import BlindCurtain from '../components/organisms/BlindCurtain/BlindCurtain';
import ToggleBtn from '../components/molecules/ToggleBtn/ToggleBtn';
import HorizontalSlider from '../components/molecules/Linear/HorizontalSlider/HorizontalSlider';
import Slider from '../components/molecules/Linear/Slider/Slider';
import Button from '../components/atoms/Button/Button';
import Action from '../components/molecules/Binary/Action/Action';
import Dropdown from '../components/molecules/Selection/Dropdown/Dropdown';
import processImage from '../assets/precept-reference/process.webp';
import precisionImage from '../assets/precept-reference/precision.webp';
import assemblyImage from '../assets/precept-reference/assembly.webp';
import inspectionImage from '../assets/precept-reference/inspection.webp';
import closingImage from '../assets/precept-reference/closing.avif';
import './Landing.css';

const MotionDiv = motion.div;
function SymbolMark({ progress, reduced }) {
  const leftX=useTransform(progress,[0,.5],[-42,0]);
  const leftY=useTransform(progress,[0,.5],[28,0]);
  const middleY=useTransform(progress,[0,.5],[-22,0]);
  const rightX=useTransform(progress,[0,.5],[42,0]);
  const rightY=useTransform(progress,[0,.5],[-18,0]);
  return <svg viewBox="0 0 200 200" fill="none" aria-hidden="true"><defs><linearGradient id="landing-metal" x1="30" y1="10" x2="160" y2="180" gradientUnits="userSpaceOnUse"><stop stopColor="#fafafa"/><stop offset=".3" stopColor="#d4d4d4"/><stop offset=".53" stopColor="#737373"/><stop offset=".7" stopColor="#e5e5e5"/><stop offset="1" stopColor="#a3a3a3"/></linearGradient></defs><g transform="rotate(-20 100 100)" fill="url(#landing-metal)"><motion.rect style={reduced?undefined:{x:leftX,y:leftY}} x="35" y="49" width="34" height="110" rx="17"/><motion.rect style={reduced?undefined:{y:middleY}} x="83" y="18" width="34" height="164" rx="17"/><motion.rect style={reduced?undefined:{x:rightX,y:rightY}} x="131" y="67" width="34" height="84" rx="17"/></g></svg>;
}

function RevealTitle({ children, reduced, id }) {
  const lines=children.split('\n');
  return <motion.h2 id={id} initial="hidden" whileInView="visible" viewport={{once:true,amount:.5}}>{lines.map((line,lineIndex)=><span className="landing-reveal-line" key={line}>{line.split(' ').map((word,index)=><span className="landing-reveal-word" key={`${word}-${index}`}><motion.span variants={{hidden:{y:reduced?0:'105%',opacity:reduced?1:0},visible:{y:0,opacity:1}}} transition={{duration:.65,delay:(lineIndex*3+index)*.045,ease:[.22,1,.36,1]}}>{word}{'\u00a0'}</motion.span></span>)}</span>)}</motion.h2>;
}

// A single curtain feature travels from device capability to implementation guidance.
const FLOW_STEPS = [
  ['Read the feature','Curtain: position and movement.','Define the opening range and the Open, Close, and Pause commands.'],
  ['Map the behavior','Linear for position. Action for commands.','Choose patterns from what the user does, rather than the device name.'],
  ['Choose the parts','Atom → Molecule → Organism.','A track and thumb form a slider. Add command buttons to compose a curtain control.'],
  ['Compose the screen','From part to screen.','Place the opening value, position control, and commands together. Show what each action changes.'],
  ['Define the contract','Connect the UI to implementation.','Document the 0–100% range, command events, and pending or offline behavior before development.'],
];
function BehaviorExample({kind,name,index}) {
  const [on,setOn]=useState(index!==2);
  const [value,setValue]=useState([50,70,30][index]);
  const [mode,setMode]=useState('Auto');
  const [command,setCommand]=useState('Ready');
  const modes=['Auto','Low','High'];
  let control;
  if(kind==='Binary') control=index===0?<BinaryDeviceCard name="Living room" location="Lighting" status={on?'On':'Off'} isOn={on} onToggle={()=>setOn(!on)} icon={<LightBulb/>}/>:index===1?<button className="feature-toggle" role="switch" aria-checked={on} aria-label={`Toggle ${name}`} onClick={()=>setOn(!on)}><span><ToggleBtn isOn={on}/></span></button>:<Button active={on} icon={<LightBulb width={24}/>} aria-label="Toggle power button" onClick={()=>setOn(!on)}/>;
  else if(kind==='Linear') control=index===0?<HorizontalSlider value={value} onChange={setValue} height="56px" leftIcon={null} rightIcon={null} showValue={false}/>:index===1?<Slider value={value} onChange={setValue}/>:<AdaptiveLightSlider value={value} onChange={setValue} activeColor="rgb(245, 245, 245)" inactiveColor="rgb(212, 212, 212)"/>;
  else if(kind==='State') control=index===0?<div className="feature-mode-options" role="group" aria-label="Select fan speed">{modes.map(option=><Button key={option} active={mode===option} onClick={()=>setMode(option)}>{option}</Button>)}</div>:index===1?<Dropdown value={mode} options={modes.map(option=>({label:option,value:option}))} onChange={option=>setMode(option.value)}/>:<div className="feature-state-list" role="group" aria-label="Choose ventilation mode">{modes.map(option=><Button key={option} active={mode===option} onClick={()=>setMode(option)}>{mode===option?'●':'○'} {option}</Button>)}</div>;
  else control=index===0?<div className="feature-command-group">{[['Close',<ChevronLeft size={22}/>],['Pause',<Pause size={22}/>],['Open',<ChevronRight size={22}/>]].map(([label,icon])=><Action key={label} icon={icon} aria-label={`${label} curtain demo`} onClick={()=>setCommand(label)}/>)}</div>:index===1?<Action icon={<Play size={22}/>} onClick={()=>setCommand('Cleaning started')} aria-label="Start cleaning demo"/>:<Action onClick={()=>setCommand('Scene started')}>Run scene <ArrowUpRight size={16}/></Action>;
  const componentNames={Binary:['Device card','Toggle','Power button'],Linear:['Horizontal slider','Step slider','Adaptive light slider'],State:['Mode buttons','Dropdown','Option list'],Action:['Command group','Icon action','Text action']};
  return <div className={`feature-example feature-example-${kind.toLowerCase()} feature-example-variant-${index}`}><div className="feature-example-heading"><span>{name}</span><span>{componentNames[kind][index]}</span></div><div className="feature-example-control">{control}</div><output aria-live="polite">{kind==='Binary'?(on?'On':'Off'):kind==='Linear'?`${Math.round(value)}%`:kind==='State'?mode:command}</output></div>;
}
function FeatureScenes({reduced}) {
  const [scene,setScene]=useState(0);
  const [paused,setPaused]=useState(false);
  const sectionRef=useRef(null);
  const clockRef=useRef({scene:0,remaining:6500});
  const [visible,setVisible]=useState(false);
  useEffect(()=>{const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting),{threshold:.25});observer.observe(sectionRef.current);return ()=>observer.disconnect();},[]);
  useEffect(()=>{if(clockRef.current.scene!==scene)clockRef.current={scene,remaining:6500};if(reduced||paused||!visible)return;const started=performance.now();const timer=setTimeout(()=>setScene(current=>(current+1)%4),clockRef.current.remaining);return ()=>{clearTimeout(timer);clockRef.current.remaining=Math.max(0,clockRef.current.remaining-(performance.now()-started));};},[reduced,paused,visible,scene]);
  const scenes=[
    ['Binary','Switch between two states.','On / Off · Open / Closed'],
    ['Linear','Adjust a value within a range.','Brightness · Volume · Position'],
    ['State','Choose one of several modes.','Auto · Low · High'],
    ['Action','Run a command when pressed.','Open · Pause · Start'],
  ];
  const [title,lead,body]=scenes[scene];
  const examples=[['Living room light','Automation','Smart plug'],['Curtain position','Volume','Brightness'],['Fan speed','Air purifier','Ventilation'],['Curtain commands','Start cleaning','Run a scene']][scene];
  return <section ref={sectionRef} className="landing-feature-scenes" aria-label="Explore behavior patterns"><motion.img className="feature-scene-background" key={`photo-${scene}`} src={[precisionImage,assemblyImage,inspectionImage,processImage][scene]} alt="" initial={reduced?false:{opacity:0,scale:1.03}} animate={{opacity:1,scale:1}} transition={{duration:1}}/><div className="feature-scene-heading"><span>BEHAVIOR PATTERNS / 0{scene+1}</span><motion.div key={title} initial={reduced?false:{opacity:0,y:16}} animate={{opacity:1,y:0}}><h2>{title}</h2><p>{lead}<br/>{body}</p></motion.div><a href="#/components">Browse patterns <ArrowUpRight size={16}/></a></div><motion.div className="feature-scene-art feature-pattern-demo" key={title} initial={reduced?false:{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:.6}}>
    <div className="feature-example-composition"><div className="feature-example-caption"><span>ONE PATTERN</span><span>DIFFERENT DEVICES</span></div><div className="feature-example-grid">{examples.map((name,index)=><BehaviorExample key={`${title}-${name}`} kind={title} name={name} index={index}/>)}</div><p className="feature-example-note">Same behavior. Familiar controls.</p></div>
    </motion.div><div className="feature-scene-tabs" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} onFocusCapture={()=>setPaused(true)} onBlurCapture={event=>{if(!event.currentTarget.contains(event.relatedTarget))setPaused(false);}}>{scenes.map(([name],index)=><button key={name} aria-pressed={index===scene} onClick={()=>setScene(index)}><span className="feature-tab-track"><i key={`${scene}-${index}`} className={index<scene?'is-complete':index===scene&&!reduced&&visible?'is-running':''} style={{animationPlayState:paused?'paused':'running'}}/></span><span>0{index+1}</span>{name}</button>)}</div></section>;
}
function DeviceScenes({reduced}) {
  const [scene,setScene]=useState(0);
  const [on,setOn]=useState(true);
  const scenes=[['Lighting','Binary / Turn a light on or off.'],['Curtains','Linear / Set how far the curtain opens.'],['Climate','Linear / Choose the target temperature.']];
  return <section className="landing-device-scenes" aria-label="Device examples"><motion.div className="device-scene-preview" key={scene} initial={reduced?false:{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5}}>{scene===0?<BinaryDeviceCard name="Living room" location="Lighting" status={on?'On':'Off'} isOn={on} onToggle={()=>setOn(!on)} icon={<LightBulb/>}/>:scene===1?<BlindCurtain/>:<TemperatureControl targetTemp={24} currentTemp={22} gradientId="feature-climate"/>}</motion.div><div className="device-scene-copy"><span>0{scene+1} / 03</span><h2>{scenes[scene][0]}</h2><p>{scenes[scene][1]}</p><div><button aria-label="Previous device" onClick={()=>setScene((scene+2)%3)}><ChevronLeft size={20}/></button><button aria-label="Next device" onClick={()=>setScene((scene+1)%3)}><ChevronRight size={20}/></button></div></div></section>;
}
function ArcDial({progress,reduced}) {
  const [angle,setAngle]=useState(50);
  useMotionValueEvent(progress,'change',value=>setAngle(50-100*Math.min(1,Math.max(0,value))));
  const polar=(degrees,radius)=>({x:-280+radius*Math.cos(degrees*Math.PI/180),y:400+radius*Math.sin(degrees*Math.PI/180)});
  return <svg className="arc-dial" viewBox="0 0 1200 800" fill="none" aria-hidden="true"><g transform={`rotate(${reduced?50:angle} -280 400)`}><circle cx="-280" cy="400" r="630" stroke="#ffffff45"/>{Array.from({length:121},(_,index)=>{const degrees=index*2-120;const start=polar(degrees,630);const end=polar(degrees,index%5===0?649:637);return <line key={index} x1={start.x} y1={start.y} x2={end.x} y2={end.y} stroke="#ffffff75" strokeWidth={index%5===0?1.5:.7}/>;})}{FLOW_STEPS.map((step,index)=>{const point=polar(-50+index*25,555);return <text key={step[0]} x={point.x} y={point.y} fill="#ffffff80" fontSize="42" textAnchor="middle" dominantBaseline="central">0{index+1}</text>;})}{[0,1,2,3,4].map(index=>{const point=polar(-50+index*25,672);return <text key={`degree-${index}`} x={point.x} y={point.y} fill="#ffffff70" fontSize="11" textAnchor="middle">{index*25}°</text>;})}</g><circle cx="350" cy="400" r="5" fill="white"/><path d="M338 400h24" stroke="white"/></svg>;
}
function ArcProcess({reduced}) {
  const ref=useRef(null);
  const {scrollYProgress}=useScroll({target:ref,offset:['start start','end end']});
  const progress=useSpring(scrollYProgress,{stiffness:100,damping:30,mass:.4});
  const [active,setActive]=useState(0);
  useMotionValueEvent(progress,'change',value=>setActive(Math.min(4,Math.max(0,Math.round(value*4)))));
  const backgroundScale=useTransform(progress,[0,1],[1,1.1]);
  const visibleSteps=reduced?FLOW_STEPS:[FLOW_STEPS[active]];
  return <section ref={ref} id="landing-values" className={`landing-arc-process${reduced?' is-reduced':''}`} aria-labelledby="arc-title"><div className="landing-arc-sticky"><div className="arc-corner arc-corner-a"/><div className="arc-corner arc-corner-b"/><div className="arc-process-heading"><span>ONE FEATURE, END TO END</span><h2 id="arc-title">Curtain / Design to development</h2></div><motion.img className="arc-reference-background" src={processImage} alt="" style={reduced?undefined:{scale:backgroundScale}}/><ArcDial progress={progress} reduced={reduced}/><div className="arc-step-number" aria-hidden="true">0{active+1}</div><div className="arc-chapters">{visibleSteps.map(([label,title,body],index)=><motion.article className="arc-chapter" key={label} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.22}}><span>0{reduced?index+1:active+1} / 05 — {label}</span><h3>{label}</h3><p>{title}<br/>{body}</p></motion.article>)}</div><span className="arc-scroll-note">SCROLL TO CONNECT <ArrowDown size={13}/></span></div></section>;
}

function SystemDetails({reduced}) {
  const [open,setOpen]=useState(null);
  const [statement,setStatement]=useState(0);
  const metrics=[
    ['Devices','Device screen examples','LIGHTING · CLIMATE · CURTAINS · AUDIO','Explore lighting, air conditioning, curtains, speakers, washers, and refrigerators. These are UI examples, not verified hardware integrations.'],
    ['Features','Interaction coverage','POWER · LEVEL · MODE · COMMAND','Find power, brightness, temperature, position, mode, and command controls. Available features depend on the device.'],
    ['UI parts','Reusable components','ATOMS · MOLECULES · ORGANISMS','Browse components with their properties, interactive examples, and source code.'],
    ['Guides','Development references','STATES · COMMANDS · RECOVERY','Review usage guides and state-handling checklists. Automated specification checks are planned.'],
  ];
  const statements=[
    ['FOR USERS','Learn once. Use it again.','Familiar controls make it easier to move between different devices.'],
    ['FOR DESIGNERS','Build with reusable parts.','Compose device screens from existing components and patterns.'],
    ['FOR DEVELOPERS','Implement with clear references.','Review values, events, and UI states before writing device-specific code.'],
  ];
  return <><section className="landing-system-details" aria-labelledby="system-details-title"><p className="landing-eyebrow">◆ THE SYSTEM</p><RevealTitle reduced={reduced} id="system-details-title">What you can use.</RevealTitle><div className="system-detail-grid">{metrics.map(([number,label,tag,body],index)=><button className={`system-detail-card${open===index?' is-open':''}`} key={label} onClick={()=>setOpen(open===index?null:index)} aria-expanded={open===index}><span className="system-detail-number">{number}</span><span className="system-detail-label">{label}</span><span className="system-detail-back"><span>{tag}</span><p>{body}</p></span><span className="system-detail-plus" aria-hidden="true">{open===index?'−':'+'}</span></button>)}</div></section><section className="landing-statement-carousel" aria-label="Benefits for users, designers, and developers"><span>0{statement+1} / 03 &nbsp; {statements[statement][0]}</span><motion.p key={statement} initial={reduced?false:{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.45}}>{statements[statement][1]}<span className="landing-benefit-detail">{statements[statement][2]}</span></motion.p><div><button aria-label="Previous benefit" onClick={()=>setStatement((statement+2)%3)}><ChevronLeft size={20}/></button><button aria-label="Next benefit" onClick={()=>setStatement((statement+1)%3)}><ChevronRight size={20}/></button></div></section><div className="landing-pattern-marquee" aria-hidden="true"><div>{Array.from({length:4},(_,index)=><span key={index}>For users <i/> For designers <i/> For developers <i/></span>)}</div></div></>;
}

export default function Landing() {
  const track = useRef(null);
  const bentoRef = useRef(null);
  const reduced = useReducedMotion();
  const { scrollYProgress: rawScroll } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const scrollYProgress = useSpring(rawScroll, { stiffness: 85, damping: 26, mass: .65 });
  const symbolY = useTransform(scrollYProgress, [0, .65, 1], ['0vh', '17vh', '20vh']);
  const symbolScale = useTransform(scrollYProgress, [0, .65, 1], [1, .58, .4]);
  const symbolRotate = useTransform(scrollYProgress, [0, 1], [-8, 12]);
  const symbolOpacity = useTransform(scrollYProgress, [0, .55, .88], [1, .8, 0]);
  const introOpacity = useTransform(scrollYProgress, [0, .35, .6], [1, 1, 0]);
  const controlsOpacity = useTransform(scrollYProgress, [.45, .8], [0, 1]);
  const controlsY = useTransform(scrollYProgress, [.45, 1], [100, 0]);
  const [automation, setAutomation] = useState(false);
  const [level, setLevel] = useState(50);
  const [temperature, setTemperature] = useState(24);
  const [lightOn, setLightOn] = useState(true);
  const [brightness, setBrightness] = useState(0);
  const explore = () => document.getElementById('landing-components')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'center' });

  return <div className="landing">
    <a className="landing-skip" href="#landing-components" onClick={e => { e.preventDefault(); explore(); document.getElementById('landing-components')?.focus({ preventScroll: true }); }}>Skip to components</a>
    <header className="landing-header landing-morph-header landing-restored-header">
      <a className="landing-brand" href="#/start" aria-label="Flowthing home"><span className="flow-mark shared-brand-symbol" aria-hidden="true"><i/><i/><i/></span><span className="shared-brand-name">flowthing</span></a>
      <nav aria-label="Main navigation"><a href="#/foundations">Foundations</a><a href="#/components">Components</a><a href="#/devices">Device Library</a><a href="#/development">Development</a></nav>
      <a className="landing-header-link" href="#/components">Explore components <ArrowUpRight size={14}/></a>
    </header>
    <main>
      <section className="landing-scroll-track" ref={track} aria-labelledby="landing-title">
        <div className="landing-sticky">
          <div className="landing-hero">
            <MotionDiv className="landing-intro" style={reduced ? undefined : { opacity: introOpacity }}>
              <p className="landing-eyebrow">FLOWTHING DESIGN SYSTEM</p>
              <h1 id="landing-title"><span>Different things.</span><span>One flow.</span></h1>
              <p className="landing-description">Connect smart-home features to shared controls<br/>and clear implementation references.</p>
            </MotionDiv>
            <MotionDiv className="landing-symbol" style={reduced ? undefined : { y: symbolY, scale: symbolScale, rotate: symbolRotate, opacity: symbolOpacity }}><SymbolMark progress={scrollYProgress} reduced={reduced}/></MotionDiv>
            <MotionDiv className="landing-side-note" style={reduced ? undefined : { opacity: introOpacity }}><span>FEATURES → RULES → CONTROLS</span><p>Different devices.<br/>The same clear rules.</p></MotionDiv>
            <div className="landing-floor" aria-hidden="true"/>
            <MotionDiv className="landing-reveal-caption" style={reduced ? undefined : { opacity: controlsOpacity, y: controlsY }}><span>FLOWTHING DESIGN SYSTEM</span><p>Design. Build.<br/>Connect.</p></MotionDiv>
            <button className="landing-scroll-cue" onClick={()=>document.getElementById('landing-values')?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'})}>See the flow <ArrowDown size={15}/></button>
            <div className="landing-hero-facts"><div><span>DESIGNED FOR</span><p>Smart homes</p></div><div><span>DESIGN</span><p>Component library</p></div><div><span>BUILD</span><p>Code references</p></div><div><span>EXPLORE</span><p>Device examples</p></div></div>
          </div>
        </div>
      </section>
      <section className="landing-about" aria-labelledby="landing-about-title"><h2 id="landing-about-title">Why Flowthing</h2><div><h3>The gap</h3><p>Different devices use different controls. Unclear states and specs leave teams to interpret the same feature in different ways.</p><a href="#/components">Explore the library <ArrowUpRight size={15}/></a></div><div><h3>One clear reference</h3><p>Flowthing connects device features with interaction patterns, reusable components, and implementation references.</p></div></section>
      <FeatureScenes reduced={reduced}/>
      <DeviceScenes reduced={reduced}/>
      <ArcProcess reduced={reduced}/>
      <SystemDetails reduced={reduced}/>
      <section id="landing-components" tabIndex={-1} className="landing-components" aria-labelledby="landing-components-title">
        <div className="landing-section-heading"><div><p className="landing-eyebrow">TRY THE COMPONENTS</p><RevealTitle reduced={reduced} id="landing-components-title">Try the flow.</RevealTitle></div><div className="landing-library-navigation"><a href="#/components">View all <ArrowUpRight size={16}/></a><div><button aria-label="Previous components" onClick={()=>bentoRef.current?.scrollBy({left:-380,behavior:reduced?'instant':'smooth'})}><ChevronLeft size={20}/></button><button aria-label="Next components" onClick={()=>bentoRef.current?.scrollBy({left:380,behavior:reduced?'instant':'smooth'})}><ChevronRight size={20}/></button></div></div></div>
        <MotionDiv ref={bentoRef} className="landing-bento" initial={reduced ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}>
          <section className="bento-card bento-temperature">
            <div className="bento-heading"><span>01 / CLIMATE</span><a href="#/components/temperature-control" aria-label="Temperature Control documentation"><ArrowUpRight size={18}/></a></div>
            <h3>Temperature control</h3>
            <div className="bento-demo"><TemperatureControl targetTemp={temperature} currentTemp={22} onChange={setTemperature} gradientId="landing-temperature"/></div>
            <p>Use + / − to change the target temperature.</p>
          </section>
          <section className="bento-card bento-brightness">
            <div className="bento-heading"><span>02 / LIGHT</span><output aria-label="Brightness">{brightness}%</output></div>
            <div className="bento-demo"><AdaptiveLightSlider onChange={setBrightness} activeColor="rgb(245, 245, 245)" inactiveColor="rgb(212, 212, 212)"/></div>
            <h3>Brightness control</h3><p>Drag the control to adjust brightness.</p>
          </section>
          <section className="bento-card bento-device">
            <div className="bento-heading"><span>03 / DEVICES</span><a href="#/devices" aria-label="Device Library"><ArrowUpRight size={18}/></a></div>
            <h3>Device card</h3>
            <div className="bento-demo"><BinaryDeviceCard name="Living room" location="Lighting" status={lightOn ? 'On' : 'Off'} isOn={lightOn} onToggle={() => setLightOn(v => !v)} icon={<LightBulb aria-label="Toggle living room light"/>}/></div>
          </section>
          <section className="bento-card bento-toggle">
            <div className="bento-heading"><span>04 / CONTROL</span><span>{automation ? 'On' : 'Off'}</span></div>
            <div className="bento-toggle-content"><h3>Toggle</h3><button type="button" role="switch" aria-label="Toggle control demo" aria-checked={automation} onClick={() => setAutomation(v => !v)}><span inert aria-hidden="true"><ToggleBtn isOn={automation}/></span></button></div>
          </section>
          <section className="bento-card bento-slider">
            <div className="bento-heading"><span>05 / PRECISION</span><output aria-label="Light level">{Math.round(level)}%</output></div>
            <div className="bento-slider-content"><div><h3>Slider</h3><p>Drag the slider to change its value.</p></div><div className="bento-slider-demo"><HorizontalSlider value={level} onChange={setLevel} showIcons={false}/></div></div>
          </section>
        </MotionDiv>
        <div className="landing-section-bottom"><span>Interactive preview · No device connected</span><a href="#/components">Explore all components <ArrowUpRight size={16}/></a></div>
      </section>
      <section className="landing-ai-section landing-ai-closing" style={{backgroundImage:`linear-gradient(90deg,rgba(0,0,0,.7),rgba(0,0,0,.25)),url(${closingImage})`}} aria-labelledby="landing-ai-title"><div><p className="landing-eyebrow">NEED A HAND?</p><RevealTitle reduced={reduced} id="landing-ai-title">{'Have a device in mind?\nAsk Flowthing AI.'}</RevealTitle><p>Describe its features.<br/>Explore suggested patterns, components, and implementation references.</p></div><a href="#/ai">Ask Flowthing AI <ArrowUpRight size={17}/></a><span>Interactive demo · Prepared answers and local code references. Live AI is not connected yet.</span></section>
    </main>
    <footer className="landing-footer landing-reference-footer"><div><span>flowthing</span><p>Different things. One flow.</p></div><div><span>System</span><a href="#/foundations">[FOUNDATIONS]</a><a href="#/components">[COMPONENTS]</a><a href="#/devices">[DEVICE LIBRARY]</a></div><div><span>Build</span><a href="#/development">[DEVELOPMENT]</a><a href="#/development/guide">[DEVELOPER GUIDE]</a><a href="#/ai">[FLOWTHING AI]</a></div><div><span>Keep exploring.</span><p>Browse the system or try the AI demo.</p><a href="#/ai">Ask Flowthing AI <ArrowUpRight size={14}/></a></div><small>FLOWTHING DESIGN SYSTEM</small></footer>
  </div>;
}
