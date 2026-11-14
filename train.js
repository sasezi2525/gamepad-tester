/* PS2 USB 0.8.1 / BLE 0.5.2: TrainController.h dedicated packet. */
(function(root){
 'use strict';
 const raw=v=>Math.abs(v)*32767;
 function packet(axes){
   if(!axes)return null;
   const a=Array.from(axes,raw),near=(v,n)=>Math.abs(v-n)<=4;
   const i=a.findIndex(v=>near(v,12345)),j=a.findIndex(v=>near(v,23456));
   if(i<0||j<0||i===j)return null;
   for(let k=0;k<a.length;k++){
     if(k===i||k===j||!Number.isFinite(a[k]))continue;
     const offset=a[k]-4096,code=Math.round(offset/16),power=code>>4,brake=code&15;
     if(offset>=-4&&Math.abs(offset-code*16)<=4&&power>=0&&power<=5&&brake<=9)
       return {power,brake,axis:k,source:'専用データ（自動検出）'};
   }
   return null;
 }
 function analog(axes,mode,pi,bi,pflip=false,bflip=false){
   let p=axes[pi],b=axes[bi];if(!Number.isFinite(p)||!Number.isFinite(b))return null;
   if(pflip)p=-p;if(bflip)b=-b;
   const clamp=(v,max)=>Math.max(0,Math.min(max,Math.round(v)));
   if(mode==='combined')return {power:clamp(-p*5,5),brake:clamp(p*9,9),source:'ワンハンドル軸（同時位置は復元不可）'};
   return {power:clamp(mode==='full'?(p+1)*2.5:p*5,5),brake:clamp(mode==='full'?(b+1)*4.5:b*9,9),source:'手動・'+(mode==='full'?'分離全軸':'分離半軸')};
 }
 function web(p){
   if(!p||p.mapping!=='standard')return null;
   const buttons=p.buttons;
   if(!buttons||![3,5,10,11].every(i=>buttons[i]?.pressed && buttons[i]?.value>=0.9))return null;
   const values=[buttons[6]?.value,buttons[7]?.value];
   if(!values.every(v=>Number.isFinite(v)&&v>=0&&v<=1))return null;
   const power=Math.round(values[0]*5),brake=Math.round(values[1]*9);
   if(Math.abs(values[0]-power/5)>.025||Math.abs(values[1]-brake/9)>.025)return null;
   // Emergency is independently emitted as LB by both firmwares.
   if(Boolean(buttons[4]?.pressed)!==(brake===9))return null;
   return {power,brake,source:'変換器の電車コン識別信号（Web方式1）'};
 }
 root.TrainDecoder={packet,analog,web};
 if(typeof module!=='undefined')module.exports=root.TrainDecoder;
})(typeof globalThis!=='undefined'?globalThis:this);
