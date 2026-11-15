 'use strict';
let guitarView='front';try{if(localStorage.getItem('guitar-view')==='top')guitarView='top'}catch{}
function setGuitarView(view){guitarView=view;for(const v of ['front','top']){$('guitar-'+v).hidden=v!==view;$('guitar-view-'+v).setAttribute('aria-pressed',String(v===view))}try{localStorage.setItem('guitar-view',view)}catch{}}
for(const v of ['front','top'])$('guitar-view-'+v).onclick=()=>setGuitarView(v);
const beforeGuitarLayout=updateLayout;
updateLayout=function(p){beforeGuitarLayout(p);$('guitar-display').hidden=activeLayout!=='guitar';if(activeLayout==='guitar')setGuitarView(guitarView)};
function guitarFrame(now){if(activeLayout==='guitar'){const p=selected();musicCards.forEach((item,i)=>{const held=!!p&&((p.buttons[musicMap[i]]?.value||0)>.5);const lit=!!p&&(held||now<item.until);for(const view of ['front','top']){const zone=$('guitar-'+view+'-zone-'+i);zone.classList.toggle('hit',lit);zone.setAttribute('aria-label',musicKinds.guitar[i]+(lit?'：ON':'：OFF'))}})}requestAnimationFrame(guitarFrame)}
setGuitarView(guitarView);updateLayout(selected());requestAnimationFrame(guitarFrame);
