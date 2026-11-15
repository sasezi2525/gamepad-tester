 'use strict';
$('beat-mode').value=beatMode;
function buildBeatFigure(){const n=beatMode==='7'?7:5;let shapes='';
for(let i=0;i<n;i++){const black=i%2===1,x=black?114+Math.floor(i/2)*65:82+Math.floor(i/2)*65,y=black?122:209;shapes+='<rect id="beat-zone-'+i+'" class="beat-key'+(black?' black':'')+'" x="'+x+'" y="'+y+'" width="51" height="76" rx="5"/><text '+(black?'':'class="ink"')+' x="'+(x+25)+'" y="'+(y+43)+'">'+(i+1)+'</text>'}
$('beat-drawing').innerHTML='<svg class="beat-figure" viewBox="0 0 720 370" role="img" aria-label="ビートマニア'+n+'鍵。左が鍵盤、右がターンテーブル"><path class="beat-shell" d="M40 58 Q40 35 65 35 L654 35 Q680 35 680 60 L680 330 L40 330Z"/>'+shapes+'<circle class="beat-disc" cx="521" cy="202" r="111"/><circle cx="521" cy="202" r="35" fill="none" stroke="#55667b"/><g id="beat-zone-'+n+'" class="beat-arrow"><rect x="435" y="173" width="172" height="38" rx="10"/><text x="521" y="199">↻ 時計回り ↑</text></g><g id="beat-zone-'+(n+1)+'" class="beat-arrow"><rect x="435" y="221" width="172" height="38" rx="10"/><text x="521" y="247">↺ 反時計回り ↓</text></g><rect id="beat-zone-'+(n+2)+'" class="beat-key black" x="469" y="52" width="45" height="26" rx="4"/><rect id="beat-zone-'+(n+3)+'" class="beat-key black" x="538" y="52" width="45" height="26" rx="4"/><text x="491" y="100">SELECT</text><text x="560" y="100">START</text></svg>';
}
$('beat-mode').onchange=()=>{beatMode=$('beat-mode').value==='7'?'7':'5';musicKinds.beatmania=beatLabels();musicKey='';try{localStorage.setItem('beat-mode',beatMode)}catch{}buildBeatFigure();updateLayout(selected())};
const beforeBeatLayout=updateLayout;
updateLayout=function(p){beforeBeatLayout(p);$('beat-display').hidden=activeLayout!=='beatmania'};
function beatFrame(now){if(activeLayout==='beatmania'){const p=selected();musicCards.forEach((item,i)=>{const held=!!p&&(p.buttons[musicMap[i]]?.value||0)>.5,lit=!!p&&(held||now<item.until),zone=$('beat-zone-'+i);zone.classList.toggle('hit',lit);zone.setAttribute('aria-label',musicKinds.beatmania[i]+(lit?'：ON':'：OFF'))})}requestAnimationFrame(beatFrame)}
buildBeatFigure();updateLayout(selected());requestAnimationFrame(beatFrame);
