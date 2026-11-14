'use strict';
const specialNames={negcon:'ネジコン',zerotech:'ゼロテック',tatacon:'タタコン',flight:'大型アナログジョイスティック'};
for(const [key,name] of Object.entries(specialNames))layouts[key]={...layouts.other,text:name+'：変換器から受け取った出力を表示します。'};
const specialPanel=document.createElement('section');specialPanel.className='panel';specialPanel.hidden=true;
specialPanel.innerHTML='<h2 id="special-title"></h2><p class="info" id="special-note"></p><div id="special-values" class="readouts"></div><div id="special-buttons" class="keygrid" style="margin-top:14px"></div>';
visualPanel.before(specialPanel);
const subtypeRow=document.createElement('div');subtypeRow.className='row';
subtypeRow.innerHTML='<label>ネジコン系の表示 <select id="negcon-subtype"><option value="negcon">ネジコン</option><option value="zerotech">ゼロテック</option></select></label>';
specialPanel.append(subtypeRow);
let negconSubtype='negcon';try{if(localStorage.getItem('negcon-subtype')==='zerotech')negconSubtype='zerotech'}catch{}
$('negcon-subtype').value=negconSubtype;
$('negcon-subtype').onchange=e=>{negconSubtype=e.target.value;try{localStorage.setItem('negcon-subtype',negconSubtype)}catch{};if(!autoLayout&&['negcon','zerotech'].includes(manualLayout)){manualLayout=negconSubtype;try{localStorage.setItem('pad-layout',manualLayout)}catch{}}updateLayout(selected())};
for(const button of document.querySelectorAll('.layout-btn'))if(['negcon','zerotech'].includes(button.dataset.layout)){
 const original=button.onclick;button.onclick=e=>{negconSubtype=button.dataset.layout;$('negcon-subtype').value=negconSubtype;try{localStorage.setItem('negcon-subtype',negconSubtype)}catch{};original(e)};
}
const beforeSpecialDetect=detectLayout;
detectLayout=function(p){const kind=beforeSpecialDetect(p);return kind==='negcon'?negconSubtype:kind};
const specialNotes={negcon:'ねじりとI/IIの変換後出力です。STDではI/IIが右Yへ合成され、DXではトリガーにパルス出力されます。元のI/II/Lアナログ値は個別復元できません。',zerotech:'ネジコン互換として受信した出力を表示します。機種名は手動選択です。STD/DX等の本体モードによって軸・トリガーの用途が変わります。',tatacon:'標準タタコン設定の変換後出力：左面=A、右面=B、左縁=X、右縁=Y。リマップしている場合は数値表示でも確認してください。',flight:'大型PS用アナログジョイスティックの変換後出力です。標準配置では右の物理レバーが左出力、左の物理レバーが右出力です。'};
const specialAxisLabels={negcon:['ねじり出力（左X）','左Y','右X','I / II 合成出力（右Y）'],zerotech:['操舵出力（左X）','左Y','右X','合成出力（右Y）'],flight:['右レバー 横（左X）','右レバー 縦（左Y）','左レバー 横（右X）','左レバー 縦（右Y）']};
let specialBuilt='';
function buildSpecial(kind){if(specialBuilt===kind)return;specialBuilt=kind;$('special-values').replaceChildren();$('special-buttons').replaceChildren();
 if(kind!=='tatacon')for(let i=0;i<6;i++){const item=document.createElement('div');item.className='mini';const title=document.createElement('strong');title.textContent=i<4?specialAxisLabels[kind][i]:i===4?'LT出力':'RT出力';const value=document.createElement('span');value.className='num';value.id='special-axis-'+i;item.append(title,value);$('special-values').append(item)}
 const labels=kind==='tatacon'?[[0,'左面'],[1,'右面'],[2,'左縁'],[3,'右縁'],[8,'SELECT'],[9,'START']]:Array.from({length:17},(_,i)=>[i,'B'+i]);
 for(const [index,label] of labels){const el=document.createElement('div');el.className='key';el.textContent=label;el.dataset.specialButton=index;$('special-buttons').append(el)}
}
const beforeSpecialUpdate=updateLayout;
updateLayout=function(p){beforeSpecialUpdate(p);const special=Object.hasOwn(specialNames,activeLayout);specialPanel.hidden=!special||$('tab-visual').getAttribute('aria-selected')!=='true';
 if(special){visualPanel.querySelector('.diagram').hidden=true;visualPanel.querySelector('.readouts').hidden=true;buildSpecial(activeLayout);$('special-title').textContent=specialNames[activeLayout];$('special-note').textContent=specialNotes[activeLayout];subtypeRow.hidden=!['negcon','zerotech'].includes(activeLayout);$('layout-info').textContent=(autoLayout?'自動判定':'手動選択')+'：'+specialNames[activeLayout];$('layout-legend').textContent=layouts[activeLayout].text;}
};
function specialFrame(){const p=selected();if(Object.hasOwn(specialNames,activeLayout)){
 if(activeLayout!=='tatacon')for(let i=0;i<6;i++){const value=i<4?p?.axes[i]:p?.buttons[i+2]?.value;$('special-axis-'+i).textContent=Number.isFinite(value)?i<4?(value>=0?'+':'')+value.toFixed(4):Math.round(value*100)+'%':'—'}
 for(const el of $('special-buttons').children){const b=p?.buttons[Number(el.dataset.specialButton)];el.classList.toggle('on',!!b&&(b.pressed||b.value>.5))}
 }requestAnimationFrame(specialFrame)}
updateLayout(selected());requestAnimationFrame(specialFrame);

// BLE names may be retained by the host after a physical controller swap.
const beforeBtNameNotice=updateLayout;
updateLayout=function(p){beforeBtNameNotice(p);if(autoLayout&&p&&/^PS2 (?:neGcon|Joystick|Tatacon|Wireless Controller)(?: Extended Gamepad)?$/i.test(p.id)&&activeLayout!=='train'){
 $('layout-info').textContent='BTの接続名は端末に残るため、機種判定には使用しません。接続したコントローラーの表示を手動で選んでください。';
}};
updateLayout(selected());
