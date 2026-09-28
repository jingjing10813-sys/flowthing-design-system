import React from 'react';
import {
  SunLight, HalfMoon, NavArrowLeft, NavArrowRight,
  SoundHigh, SoundOff, HomeSimple, StatsReport, Settings, SystemRestart,
  AppWindow, Pause, LogOut, Minus, Plus, SystemShut,
  LightBulb, Play, WifiOff, NavArrowDown, Fridge
} from 'iconoir-react';

export default function App() {
  return (
    <div style={{ padding: 50, display: 'flex', flexWrap: 'wrap', gap: 20, color: 'black', background: 'white' }}>
      <h1>Icon Test</h1>
      <div>SunLight: <SunLight /></div>
      <div>HalfMoon: <HalfMoon /></div>
      <div>NavArrowLeft: <NavArrowLeft /></div>
      <div>NavArrowRight: <NavArrowRight /></div>
      <div>SystemShut: <SystemShut /></div>
      <div>SoundHigh: <SoundHigh /></div>
      <div>SoundOff: <SoundOff /></div>
      <div>HomeSimple: <HomeSimple /></div>
      <div>StatsReport: <StatsReport /></div>
      <div>Settings: <Settings /></div>
      <div>SystemRestart: <SystemRestart /></div>
      <div>AppWindow: <AppWindow /></div>
      <div>Pause: <Pause /></div>
      <div>LogOut: <LogOut /></div>
      <div>Minus: <Minus /></div>
      <div>Plus: <Plus /></div>
      <div>LightBulb: <LightBulb /></div>
      <div>Play: <Play /></div>
      <div>WifiOff: <WifiOff /></div>
      <div>NavArrowDown: <NavArrowDown /></div>
      <div>Fridge: <Fridge /></div>
    </div>
  );
}
