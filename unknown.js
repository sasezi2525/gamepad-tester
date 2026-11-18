 'use strict';
function isUnknownSignal(p){return !!p&&p.mapping==='standard'&&[4,5,8,9,10,11].every(i=>(p.buttons[i]?.value||0)>.5)&&p.axes.length>=4&&p.axes.slice(0,4).every(v=>Number.isFinite(v)&&Math.abs(v)>.2)}
class UnknownReceiver{
 constructor(){this.reset()}
 reset(){this.seq=null;this.parts=new Map();this.last=null;this.completed=null;this.device=null;this.lastAt=0;this.error=''}
 feed(p,now){const device=p?JSON.stringify([p.id,p.index,p.mapping,p.buttons.length,p.axes.length]):null;
 if(device!==this.device||now-this.lastAt>2500){this.reset();this.device=device}this.lastAt=now;
 if(!isUnknownSignal(p))return null;
 // The old axis transport is recognized by the UI but cannot be trusted if clamped.
 let page=0;for(let i=0;i<4;i++)if((p.buttons[i]?.value||0)>.5)page|=1<<i;if((p.buttons[12]?.value||0)>.5)page|=16;
 if(page>18)return null;
 const seq=p.axes.slice(0,4).reduce((v,x,i)=>v|(x>0?1<<i:0),0);
 const bytes=[];for(const i of [6,7]){const x=p.buttons[i]?.value,v=Math.round(x*255);if(!Number.isFinite(x)||v<0||v>255||Math.abs(x*255-v)>.75)return null;bytes.push(v)}
 if(seq!==this.seq){this.parts.clear();this.seq=seq}
 if(page===0){if(bytes[0]!==2||bytes[1]<3||bytes[1]>33){this.error='version';return null}this.parts.set(0,bytes);this.error=''}else if(this.parts.has(0))this.parts.set(page,bytes);
 if(!this.parts.has(0)||this.completed===seq)return null;
 const n=this.parts.get(0)[1],pages=Math.ceil(n/2),data=[];for(let i=1;i<=pages;i++){if(!this.parts.has(i))return null;data.push(...this.parts.get(i))}data.length=n;
 const expected=data[1]===0||data[1]===255||!(data[1]&15)?9:3+2*(data[1]&15);if(n!==expected){this.parts.clear();return null}
 const check=this.parts.get(pages+1);if(!check)return null;let crc=65535;for(const byte of data){crc^=byte<<8;for(let bit=0;bit<8;bit++)crc=((crc&32768)?(crc<<1)^0x1021:crc<<1)&65535}if(crc!==((check[0]<<8)|check[1])){this.error='checksum';return null}
 this.completed=seq;this.last={seq,receivedAt:now,id:data[1],header:data[2],bytes:data};return this.last;
 }
}
function unknownDiff(base,current){const rows=[];for(let i=0;i<Math.max(base.length,current.length);i++){const a=base[i],b=current[i];if(a!==b)rows.push({offset:i,before:a??null,after:b??null,xor:a===undefined||b===undefined?null:a^b})}return rows}
if(typeof module!=='undefined')module.exports={UnknownReceiver,unknownDiff,isUnknownSignal};
