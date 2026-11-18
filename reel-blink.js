 'use strict';
class ReelBlink{
 constructor(){this.phase=0;this.last=null;this.level=0;this.on=false}
 update(now,level){const dt=this.last===null?0:Math.max(0,Math.min(100,now-this.last));this.last=now;
 const target=Number.isFinite(level)?Math.max(0,Math.min(1,level)):0;
 if(target<=.05){this.phase=0;this.level=0;this.on=false;return {on:false,hz:0}}
 const speed=Math.max(0,Math.min(1,(target-.25)/.75));
 this.level+= (speed-this.level)*(1-Math.exp(-dt/100));
 const hz=1.5+10.5*this.level;this.phase=(this.phase+dt/1000*hz)%1;
 this.on=this.phase<.4;return {on:this.on,hz};
 }
}
if(typeof module!=='undefined')module.exports=ReelBlink;
