 'use strict';
function decodeFishingLive(p,manual=false){if(!p||p.mapping!=='standard'||(p.buttons[11]?.value||0)<.5||isUnknownSignal(p)||(!manual&&!/^PS2 v[0-9.]+ Fishing(?: Extended Gamepad)?$/i.test(p.id)))return null;
 const on=i=>(p.buttons[i]?.value||0)>.5;let pressed=0;for(const [source,target] of [[14,0],[13,1],[15,2],[12,3],[10,4],[11,5],[0,8],[3,9],[1,10],[8,12],[9,15]])if(on(target))pressed|=1<<source;
 if(p.axes.length<4||p.axes.slice(0,4).some(v=>!Number.isFinite(v)))return null;
 const byte=(axis,center)=>Math.round(Math.max(0,Math.min(255,center+Math.max(-1,Math.min(1,axis))*(axis<0?center:255-center))));
 const bytes=[255,229,90,(~pressed)&255,((~pressed)>>8)&255,128,128,byte(p.axes[0],146),byte(p.axes[1],128),byte(p.axes[2],128),byte(p.axes[3],128),Math.round((p.buttons[6]?.value||0)*255),Math.round((p.buttons[7]?.value||0)*255)];return {id:229,header:90,bytes,source:'live'};
}
if(typeof module!=='undefined')module.exports=decodeFishingLive;
