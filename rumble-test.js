'use strict';
let rumbleTestRunning=false,rumbleTestCancel=null;
let rumbleRejectedKey='';
function rumbleDeviceKey(p){return p?p.index+'|'+p.id:''}
function supportedRumbleActuator(p){return [p?.vibrationActuator,...(p?.hapticActuators||[])].find(a=>typeof a?.playEffect==='function'&&(!a.effects||Array.from(a.effects).includes('dual-rumble')))}
function updateRumbleAvailability(){const p=selected();if(!p)rumbleRejectedKey='';const supported=!!supportedRumbleActuator(p)&&rumbleRejectedKey!==rumbleDeviceKey(p);$('rumble').disabled=rumbleTestRunning||!supported;$('rumble').setAttribute('aria-disabled',String($('rumble').disabled))}
function rumbleAvailabilityFrame(){updateRumbleAvailability();requestAnimationFrame(rumbleAvailabilityFrame)}
const rumbleWait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function stopRumbleActuator(a){try{if(typeof a.reset==='function')await a.reset();else await a.playEffect('dual-rumble',{startDelay:0,duration:1,strongMagnitude:0,weakMagnitude:0})}catch{}}
$('rumble').onclick=async()=>{
 if(rumbleTestRunning)return;
 const p=selected();if(!p){$('message').textContent='未接続です';return}
 const a=supportedRumbleActuator(p);
 if(!a){$('message').textContent='この環境では強・弱を分けた振動テストを利用できません';return}
 rumbleTestRunning=true;$('rumble').disabled=true;let cancelled=false,completed=false;
 rumbleTestCancel=()=>{cancelled=true;void stopRumbleActuator(a)};
 const check=()=>{const current=selected();if(cancelled||document.hidden||!current||current.connected===false||current.id!==p.id||current.index!==p.index)throw Error('interrupted')};
 const effect=async(strong,weak)=>{check();const result=await a.playEffect('dual-rumble',{startDelay:0,duration:500,strongMagnitude:strong,weakMagnitude:weak});if(result==='preempted')throw Error('interrupted');check()};
 try{
  check();$('message').textContent='振動テスト：強側（大モーター）';await effect(160/255,0);
  await stopRumbleActuator(a);check();$('message').textContent='振動テスト：休止';await rumbleWait(300);
  check();$('message').textContent='振動テスト：弱側（小モーター）';await effect(0,1);completed=true;
 }catch(e){if(e.message!=='interrupted')rumbleRejectedKey=rumbleDeviceKey(p);$('message').textContent=e.message==='interrupted'?'振動テストを中断しました':'この環境では強・弱を分けた振動テストを利用できません'}
 finally{await stopRumbleActuator(a);if(completed)$('message').textContent='振動テスト完了：強側→休止→弱側';rumbleTestCancel=null;rumbleTestRunning=false;updateRumbleAvailability()}
};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&rumbleTestCancel)rumbleTestCancel()});
window.addEventListener('gamepaddisconnected',e=>{if(rumbleTestCancel)rumbleTestCancel()});
window.addEventListener('pagehide',()=>{if(rumbleTestCancel)rumbleTestCancel()});

updateRumbleAvailability();requestAnimationFrame(rumbleAvailabilityFrame);
