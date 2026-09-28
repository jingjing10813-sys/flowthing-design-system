import { createContext, useContext, useState } from 'react';
import { initialDevices } from './home-model';
export const Context = createContext(null);
export function useHomeDevices() {
  const context=useContext(Context);
  const local=useState(initialDevices);
  return context?[context.devices,context.setDevices]:local;
}
const mapping={lighting:{isLightOn:'on',brightness:'value'},airconditioner:{isOn:'on',targetTemp:'value',currentTemp:'current'},speaker:{isPlaying:'on',volume:'value'},curtain:{isOpen:'on',curtainLevel:'value'},washer:{isOn:'on',operationalState:'operation'},refrigerator:{fridgeTemp:'fridgeTemp',freezerTemp:'freezerTemp'}};
const ids={lighting:'main-light',airconditioner:'air',speaker:'speaker',curtain:'curtain',washer:'washer',refrigerator:'fridge'};
export function useExperienceState(page,key,initial) {
  const context=useContext(Context);
  const local=useState(initial);
  if(!context)return local;
  const field=mapping[page]?.[key];
  const id=page==='lighting'?context.lightId:ids[page];
  if(field){
    const device=context.devices.find(item=>item.id===id);
    if(device)return [device[field]??initial,update=>context.setDevices(items=>items.map(item=>item.id===id?{...item,[field]:typeof update==='function'?update(item[field]??initial):update}:item))];
  }
  const name=`${page}.${page==='lighting'?context.lightId+'.':''}${key}`;
  return [context.fields[name]??initial,update=>context.setFields(values=>({...values,[name]:typeof update==='function'?update(values[name]??initial):update}))];
}
