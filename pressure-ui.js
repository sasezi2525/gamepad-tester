 'use strict';
layouts.pressure={...layouts.other,text:'PS2パッドの□△○×感圧診断'};
const pressureDetectLayout=detectLayout;
detectLayout=function(p){return decodePressure(p)?'pressure':pressureDetectLayout(p)};
const pressurePanel=document.createElement('section');pressurePanel.className='panel';pressurePanel.hidden=true;
pressurePanel.innerHTML='<h2>PS2 感圧診断</h2><p class="info">SELECT＋START＋L1＋R1の4つだけを3秒押して開始／終了します。L2・R2を含む6ボタン操作では切り替わりません。USBはXInput出力で使用してください。</p><p class="info">診断中は左右スティックを感圧データの転送に使います。ゲームを終了してから使用してください。画面上の選択だけでは変換器のモードは切り替わりません。</p><p id="pressure-status" class="info"></p><div id="pressure-values" class="readouts"></div>';
visualPanel.before(pressurePanel);
for(const [i,name] of ['□','△','○','×'].entries()){const el=document.createElement('div');el.className='mini';el.innerHTML='<strong>'+name+'</strong><span class="num" id="pressure-value-'+i+'">未取得</span><div class="meter" id="pressure-meter-'+i+'" role="meter" aria-label="'+name+' 感圧" aria-valuemin="0" aria-valuemax="255"><div class="fill" id="pressure-fill-'+i+'"></div></div>';$('pressure-values').append(el)}
const pressureBeforeLayout=updateLayout;
updateLayout=function(p){pressureBeforeLayout(p);const show=activeLayout==='pressure';pressurePanel.hidden=!show||$('tab-visual').getAttribute('aria-selected')!=='true';if(show){visualPanel.querySelector('.diagram').hidden=true;visualPanel.querySelector('.readouts').hidden=true;$('layout-info').textContent=(autoLayout?'自動判定':'手動選択')+'：PS2 感圧診断'}};
function pressureFrame(){const p=selected(),data=decodePressure(p);if(activeLayout==='pressure'){$('pressure-status').textContent=!p?'未接続':!data?'診断信号なし。変換器を更新し、4ボタンを3秒長押ししてください。':!data.ready?'感圧データ未取得。感圧非対応、または感圧通信（ID79）に入れていません。':'感圧データ取得中（0〜255）';for(let i=0;i<4;i++){const v=data?.ready?data.values[i]:null;$('pressure-value-'+i).textContent=v===null?'未取得':Math.round(v/255*100)+'% · '+v+' / 255';$('pressure-fill-'+i).style.width=(v===null?0:v/255*100)+'%';const meter=$('pressure-meter-'+i);if(v===null){meter.removeAttribute('aria-valuenow');meter.setAttribute('aria-valuetext','未取得')}else{meter.setAttribute('aria-valuenow',String(v));meter.setAttribute('aria-valuetext',Math.round(v/255*100)+'%')}}}requestAnimationFrame(pressureFrame)}
updateLayout(selected());requestAnimationFrame(pressureFrame);
