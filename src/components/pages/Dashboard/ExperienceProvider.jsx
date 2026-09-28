import { useState } from 'react';
import { Context } from './experience-state';
import { initialDevices } from './home-model';
export function ExperienceProvider({ children, lightId = 'main-light' }) {
  const [devices,setDevices] = useState(initialDevices);
  const [fields,setFields] = useState({});
  return <Context.Provider value={{devices,setDevices,fields,setFields,lightId}}>{children}</Context.Provider>;
}
