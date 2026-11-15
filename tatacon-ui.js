 'use strict';
const beforeTataconLayout=updateLayout;
updateLayout=function(p){beforeTataconLayout(p);$('tatacon-drawing').hidden=activeLayout!=='tatacon'};
const tataconUntil=new Map(),tataconPrevious=new Map();
function tataconFrame(now){const p=selected();for(const b of [14,1,4,5,8,9]){const down=activeLayout==='tatacon'&&!!p&&(p.buttons[b]?.value||0)>.5;if(down&&!tataconPrevious.get(b))tataconUntil.set(b,now+120);const lit=activeLayout==='tatacon'&&!!p&&(down||now<(tataconUntil.get(b)||0));if(!p||activeLayout!=='tatacon')tataconUntil.delete(b);const zone=$('tatacon-zone-'+b);zone.classList.toggle('hit',lit);zone.setAttribute('aria-label','B'+b+(lit?' ON':' OFF'));tataconPrevious.set(b,down)}requestAnimationFrame(tataconFrame)}
updateLayout(selected());requestAnimationFrame(tataconFrame);
