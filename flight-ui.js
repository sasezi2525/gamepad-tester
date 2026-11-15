'use strict';
const flightButtonMap=[[0, 6], [1, 7], [2, 2], [3, 1], [4, 4], [5, 5], [6, 0], [7, 3], [8, 14], [9, 15], [10, 12], [11, 13], [12, 8], [13, 9], [14, 6], [15, 4], [16, 0], [17, 2], [18, 3], [19, 1], [20, 7], [21, 5]];
const beforeFlightLayout=updateLayout;
updateLayout=function(p){beforeFlightLayout(p);$('flight-drawing').hidden=activeLayout!=='flight'};
function flightFrame(){if(activeLayout==='flight'){const p=selected();for(const [i,b] of flightButtonMap){const pressed=!!p&&(p.buttons[b]?.value||0)>.5;const node=$('flight-button-'+i);node.classList.toggle('on',pressed);node.setAttribute('aria-label','B'+b+(pressed?' ON':' OFF'))}
for(const [x,axis] of [[210,2],[750,0]]){const clamp=v=>Number.isFinite(v)?Math.max(-1,Math.min(1,v)):0;const dx=clamp(p?.axes[axis]),dy=clamp(p?.axes[axis+1]);const dot=$('flight-dot-'+x);dot.setAttribute('cx',String(x+dx*18));dot.setAttribute('cy',String(500+dy*18));dot.classList.toggle('on',!!p&&(Math.abs(dx)>.05||Math.abs(dy)>.05))}}requestAnimationFrame(flightFrame)}
updateLayout(selected());requestAnimationFrame(flightFrame);
