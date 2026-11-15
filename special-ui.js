'use strict';
const specialNames={negcon:'ネジコン／ZEROTECH',tatacon:'タタコン',flight:'アナログジョイスティック'};
for(const [key,name] of Object.entries(specialNames))layouts[key]={...layouts.other,text:name+'：変換器から受け取った出力を表示します。'};
const specialPanel=document.createElement('section');specialPanel.className='panel';specialPanel.hidden=true;
specialPanel.innerHTML='<h2 id="special-title"></h2><p class="info" id="special-note"></p><div id="special-values" class="readouts"></div><div id="special-buttons" class="keygrid" style="margin-top:14px"></div>';
visualPanel.before(specialPanel);
// Migrate an older saved ZEROTECH selection to the merged neGcon item.
if(manualLayout==='zerotech'){manualLayout='negcon';try{localStorage.setItem('pad-layout','negcon')}catch{}}
const specialNotes={negcon:'ねじりとI/IIの変換後出力です。STDではI/IIが右Yへ合成され、DXではトリガーにパルス出力されます。元のI/II/Lアナログ値は個別復元できません。',tatacon:'標準タタコン設定の変換後出力：左面=A、右面=B、左縁=X、右縁=Y。リマップしている場合は数値表示でも確認してください。',flight:'PS用アナログジョイスティックの変換後出力です。標準配置では右の物理レバーが左出力、左の物理レバーが右出力です。'};
const specialAxisLabels={negcon:['ねじり出力（左X）','左Y','右X','I / II 合成出力（右Y）'],flight:['右レバー 横（左X）','右レバー 縦（左Y）','左レバー 横（右X）','左レバー 縦（右Y）']};
let specialBuilt='';
function buildSpecial(kind){if(specialBuilt===kind)return;specialBuilt=kind;$('special-values').replaceChildren();$('special-buttons').replaceChildren();
 if(kind!=='tatacon')for(let i=0;i<6;i++){
  const item=document.createElement('div');item.className='mini';
  const title=document.createElement('strong');title.textContent=i<4?specialAxisLabels[kind][i]:i===4?'LT出力':'RT出力';
  const value=document.createElement('span');value.className='num';value.id='special-axis-'+i;item.append(title,value);
  if(kind==='negcon'||kind==='flight'){
   const meter=document.createElement('div');meter.className='meter special-meter';meter.id='special-meter-'+i;
   meter.setAttribute('role','meter');meter.setAttribute('aria-label',title.textContent);meter.setAttribute('aria-valuemin',i<4?'-1':'0');meter.setAttribute('aria-valuemax','1');
   const bar=document.createElement('div');bar.className='fill';bar.id='special-fill-'+i;meter.append(bar);
   if(i<4){const center=document.createElement('span');center.className='special-center';meter.append(center)}
   const scale=document.createElement('div');scale.className='special-scale';
   for(const text of (i<4?['−100%','0','+100%']:['0%','100%'])){const label=document.createElement('span');label.textContent=text;scale.append(label)}
   item.append(meter,scale);
  }
  $('special-values').append(item);
 }
 const labels=kind==='tatacon'?[[0,'左面'],[1,'右面'],[2,'左縁'],[3,'右縁'],[8,'SELECT'],[9,'START']]:Array.from({length:17},(_,i)=>[i,'B'+i]);
 for(const [index,label] of labels){const el=document.createElement('div');el.className='key';el.textContent=label;el.dataset.specialButton=index;$('special-buttons').append(el)}
}
const beforeSpecialUpdate=updateLayout;
updateLayout=function(p){beforeSpecialUpdate(p);const special=Object.hasOwn(specialNames,activeLayout);specialPanel.hidden=!special||$('tab-visual').getAttribute('aria-selected')!=='true';
 if(special){visualPanel.querySelector('.diagram').hidden=true;visualPanel.querySelector('.readouts').hidden=true;buildSpecial(activeLayout);$('special-title').textContent=specialNames[activeLayout];$('special-note').textContent=specialNotes[activeLayout];$('special-title').style.fontSize=activeLayout==='flight'?'14px':'';$('layout-info').textContent=(autoLayout?'自動判定':'手動選択')+'：'+specialNames[activeLayout];$('layout-legend').textContent=layouts[activeLayout].text;}
};
function specialFrame(){const p=selected();if(Object.hasOwn(specialNames,activeLayout)){
 if(activeLayout!=='tatacon')for(let i=0;i<6;i++){
  const value=i<4?p?.axes[i]:p?.buttons[i+2]?.value;
  $('special-axis-'+i).textContent=Number.isFinite(value)?i<4?(value>=0?'+':'')+value.toFixed(4):Math.round(value*100)+'%':'—';
  if(activeLayout==='negcon'||activeLayout==='flight'){
   const present=Number.isFinite(value),v=present?Math.max(i<4?-1:0,Math.min(1,value)):0;
   const bar=$('special-fill-'+i),meter=$('special-meter-'+i);
   bar.style.width=(i<4?Math.abs(v)*50:v*100)+'%';bar.style.left=(i<4?(v<0?50+v*50:50):0)+'%';
   bar.style.background=i<4&&v<0?'#149fff':'#50d9bd';
   if(present){meter.setAttribute('aria-valuenow',String(v));meter.setAttribute('aria-valuetext',(i<4&&v>0?'+':'')+Math.round(v*100)+'%')}
   else{meter.removeAttribute('aria-valuenow');meter.setAttribute('aria-valuetext','未取得')}
  }
 }
 for(const el of $('special-buttons').children){const b=p?.buttons[Number(el.dataset.specialButton)];el.classList.toggle('on',!!b&&(b.pressed||b.value>.5))}
 }requestAnimationFrame(specialFrame)}
updateLayout(selected());requestAnimationFrame(specialFrame);

// BLE names may be retained by the host after a physical controller swap.
const beforeBtNameNotice=updateLayout;
updateLayout=function(p){beforeBtNameNotice(p);if(autoLayout&&p&&/^(?:PS2 (?:neGcon|Joystick|Tatacon|Wireless Controller)|PS1\/PS2 Bluetooth Gamepad)(?: Extended Gamepad)?$/i.test(p.id)&&activeLayout!=='train'){
 $('layout-info').textContent='BTの接続名は端末に残るため、機種判定には使用しません。接続したコントローラーの表示を手動で選んでください。';
}};
updateLayout(selected());
