 'use strict';
class UnknownReceiver{
 constructor(){this.reset()}
 reset(){this.seq=null;this.parts=new Map();this.last=null;this.seenPage=-1;this.started=0;this.completed=null;this.device=null;this.lastAt=0}
 feed(p,now){
  const device=p?JSON.stringify([p.id,p.index,p.mapping,p.buttons.length,p.axes.length]):null;
  if(device!==this.device||now-this.lastAt>2500){this.reset();this.device=device}this.lastAt=now;
  if(!p||p.mapping!=='standard'||![4,5,8,9,10,11].every(i=>(p.buttons[i]?.value||0)>.5))return null;
  const pageValue=(p.buttons[6]?.value??-1)*255,seqValue=(p.buttons[7]?.value??-1)*255,page=Math.round(pageValue/24)-1,seq=Math.round(seqValue);
  if(page<0||page>9||Math.abs(pageValue-(page+1)*24)>2||seq<0||seq>255||Math.abs(seqValue-seq)>2)return null;
  const bytes=[];for(let i=0;i<4;i++){const axis=Math.abs(p.axes[i])*32767,v=Math.round((axis-1024)/120)||0;if(!Number.isFinite(axis)||v<0||v>255||Math.abs(axis-(1024+120*v))>12)return null;bytes.push(v)}
  // A fresh page 0 is required: never combine partial cycles across reconnects.
  if(seq!==this.seq){this.parts.clear();this.seq=seq;this.started=now;this.seenPage=-1}
  if(page===0){if(bytes[0]!==1||bytes[1]<3||bytes[1]>33)return null;this.parts.set(0,bytes)}
  else if(this.parts.has(0))this.parts.set(page,bytes);
  if(!this.parts.has(0)||this.completed===seq)return null;
  const meta=this.parts.get(0),n=meta[1],pages=Math.ceil(n/4);if(this.parts.size<pages+1)return null;
  const data=[];for(let i=1;i<=pages;i++){if(!this.parts.has(i))return null;data.push(...this.parts.get(i))}data.length=n;
  if(data[1]!==meta[2]||data[2]!==meta[3]){this.parts.clear();return null}
  this.completed=seq;this.last={seq,receivedAt:now,id:meta[2],header:meta[3],bytes:data};return this.last;
 }
}
function unknownDiff(base,current){const rows=[];for(let i=0;i<Math.max(base.length,current.length);i++){const a=base[i],b=current[i];if(a!==b)rows.push({offset:i,before:a??null,after:b??null,xor:a===undefined||b===undefined?null:a^b})}return rows}
if(typeof module!=='undefined')module.exports={UnknownReceiver,unknownDiff};
