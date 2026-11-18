 'use strict';
function decodePressure(p){if(!p||(p.buttons[5]?.value||0)>.5||p.mapping!=='standard'||![8,9,10,11].every(i=>p.buttons[i]?.pressed||p.buttons[i]?.value>.5)||Math.abs((p.buttons[6]?.value??-1)-94/255)>.015||Math.abs((p.buttons[7]?.value??-1)-186/255)>.015)return null;
const ready=(p.buttons[4]?.value||0)>.5;if(!ready)return {ready:false,values:null};
const values=[];for(let i=0;i<4;i++){const v=Math.abs(p.axes[i])*32767,raw=(Math.round((v-1024)/120)||0);if(!Number.isFinite(v)||raw<0||raw>255||Math.abs(v-(1024+raw*120))>12)return null;values.push(raw)}return {ready:true,values};}
if(typeof module!=='undefined')module.exports=decodePressure;

