 'use strict';
class TimedUnknownCapture{
 constructor(){this.active=null;this.result=null}
 start(label,seconds,baseline,device,now){if(this.active||!baseline||![5,10,20].includes(seconds)||!label.trim())return false;this.result=null;this.active={label:label.trim(),seconds,baseline:[...baseline],device,prepareUntil:now+3000,endAt:now+3000+seconds*1000,samples:[],skipFirst:true,lastKey:null};return true}
 stop(reason,now){const a=this.active;if(!a)return null;this.active=null;
 const ranges=[];for(let i=0;i<a.baseline.length;i++){let min=a.baseline[i],max=min,mask=0;for(const sample of a.samples){const v=sample.bytes[i];if(v===undefined)continue;min=Math.min(min,v);max=Math.max(max,v);mask|=v^a.baseline[i]}if(mask)ranges.push({offset:i,baseline:a.baseline[i],min,max,changedBits:mask})}
 this.result={kind:'timed',label:a.label,durationSeconds:a.seconds,reason,receivedDurationMs:Math.max(0,now-a.prepareUntil),samples:a.samples,ranges,diff:[],baselineBytes:a.baseline};return this.result}
 update(now,frame,device,visible=true){const a=this.active;if(!a)return null;if(!visible)return this.stop('page-hidden',now);if(device!==a.device)return this.stop('device-changed',now);if(now>=a.endAt)return this.stop('completed',now);if(now<a.prepareUntil||!frame)return null;
 const key=frame.seq+':'+frame.receivedAt;if(a.lastKey===key)return null;a.lastKey=key;
 // First completion can contain a snapshot acquired before the recording window.
 if(a.skipFirst){a.skipFirst=false;return null}
 a.samples.push({receivedOffsetMs:Math.round(now-a.prepareUntil),seq:frame.seq,id:frame.id,header:frame.header,bytes:[...frame.bytes]});return null}
}
if(typeof module!=='undefined')module.exports=TimedUnknownCapture;
