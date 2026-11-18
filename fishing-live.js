 'use strict';
function decodeFishingLive(p,manual=false){if(!p||p.mapping!=='standard'||isUnknownSignal(p)||(!manual&&!/^PS2 v[0-9.]+ Fishing(?: Extended Gamepad)?$/i.test(p.id)))return null;
 const standard=(p.buttons[11]?.value||0)<.5;
 const on=i=>(p.buttons[i]?.value||0)>.5;let pressed=0;for(const [source,target] of [[14,0],[13,1],[15,2],[12,3],[10,4],[11,5],[0,8],[3,9],[1,10],[8,standard?6:12],[9,standard?7:15]])if(on(target))pressed|=1<<source;
 if(p.axes.length<4||p.axes.slice(0,4).some(v=>!Number.isFinite(v)))return null;
 const byte=(axis,center)=>Math.round(Math.max(0,Math.min(255,center+Math.max(-1,Math.min(1,axis))*(axis<0?center:255-center))));
 const bytes=[255,229,90,(~pressed)&255,((~pressed)>>8)&255,128,128,byte(p.axes[0],146),byte(p.axes[1],128),standard?null:byte(p.axes[2],128),standard?null:byte(p.axes[3],128),standard?null:Math.round((p.buttons[6]?.value||0)*255),standard?((p.axes[2]||0)>.05?1:0):Math.round((p.buttons[7]?.value||0)*255)];return {id:229,header:90,bytes,source:standard?'live-standard':'live',reelLevel:standard?Math.max(0,p.axes[2]||0):null,motionLevel:standard?Math.abs(p.axes[3]||0):null};
}
if(typeof module!=='undefined')module.exports=decodeFishingLive;

// Tester presentation only: hide transport channels and restore physical names.
function fishingDisplayPad(p){const data=decodeFishingLive(p,typeof activeLayout!=='undefined'&&activeLayout==='fishing');if(!data||data.source==='live-standard')return p;
const buttons=p.buttons.map(b=>({value:b.value,pressed:b.pressed,touched:b.touched}));
for(const [target,source] of [[6,12],[7,15]]){const down=(p.buttons[source]?.value||0)>.5;buttons[target]={value:down?1:0,pressed:down,touched:down}}
for(const i of [11,12,13,14,15])buttons[i]={value:0,pressed:false,touched:false};
return {id:p.id,index:p.index,mapping:p.mapping,timestamp:p.timestamp,connected:p.connected,buttons,axes:[p.axes[0],p.axes[1],0,0],vibrationActuator:p.vibrationActuator,hapticActuators:p.hapticActuators};}
