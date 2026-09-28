export const initialDevices = [
  { id:'main-light', name:['거실 조명','Living room light'], room:'living', type:'light', on:true, connected:true, value:72 },
  { id:'air', name:['에어컨','Air conditioner'], room:'living', type:'climate', on:true, connected:true, value:24, current:26 },
  { id:'bed-light', name:['침실 조명','Bedroom light'], room:'bedroom', type:'light', on:false, connected:true, value:40 },
  { id:'speaker', name:['스피커','Speaker'], room:'living', type:'speaker', on:false, connected:true, value:35 },
  { id:'curtain', name:['스마트 커튼','Smart curtain'], room:'living', type:'curtain', on:true, connected:true, value:50, detailOnly:true },
  { id:'washer', name:['세탁기','Washer'], room:'kitchen', type:'washer', on:true, connected:true, operation:'Stopped', detailOnly:true },
  { id:'fridge', name:['냉장고','Refrigerator'], room:'kitchen', type:'fridge', on:true, connected:true, readOnly:true, fridgeTemp:3, freezerTemp:-18 },
  { id:'kitchen-light', name:['주방 조명','Kitchen light'], room:'kitchen', type:'light', on:false, connected:false, value:60 },
];
export function updateDevice(devices, id, patch) {
  return devices.map(device => device.id === id && device.connected && !device.readOnly ? { ...device, ...patch } : device);
}
export function applyScene(devices, scene) {
  return devices.map(device => {
    if (!device.connected || device.readOnly || device.type !== 'light') return device;
    if (scene === 'away') return { ...device, on:false };
    return { ...device, on:true, value:scene === 'night' ? 20 : 80 };
  });
}
