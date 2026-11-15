'use strict';
// Source PS mappings pass unchanged through both adapters' ordinary digital path.
const musicKinds={guitar:['赤','緑','青','ピック','ウェイリング','SELECT','START'],drums:['ハイハット','スネア','ハイタム','ロータム','シンバル','バスペダル','SELECT','START']};
for(const kind of Object.keys(musicKinds))layouts[kind]={...layouts.other,text:'各入力の点灯・回数を確認できます。割当を押してから対象を操作してください。'};
const musicPanel=document.createElement('section');musicPanel.className='panel';musicPanel.hidden=true;
musicPanel.innerHTML='<h2 id="music-title"></h2><p class="info" id="music-status"></p><p class="info" id="drum-identification" hidden></p><div id="music-cards" class="readouts"></div><button id="music-reset" style="margin-top:12px">初期配置に戻す</button>';
visualPanel.before(musicPanel);
let musicKey='',musicMap=[],musicCards=[],musicPrevious=[],musicWaiting=-1,musicPad=null;
function musicStorage(p){return 'music-v112-'+activeLayout+'-'+JSON.stringify([p?.id||'',p?.mapping||'',p?.buttons.length||0])}
function musicDefaults(){return activeLayout==='guitar'?[7,1,3,12,6,8,9]:[3,1,7,5,0,6,8,9]}
function musicSave(){try{localStorage.setItem(musicKey,JSON.stringify(musicMap))}catch{}}
function musicBuild(p){const key=musicStorage(p);if(key===musicKey&&p===musicPad)return;musicPad=p;
 if(key===musicKey)return;musicKey=key;musicMap=musicDefaults();musicWaiting=-1;musicPrevious=(p?.buttons||[]).map(b=>b.value>.5);musicCards=[];
 try{const saved=JSON.parse(localStorage.getItem(key));if(Array.isArray(saved)&&saved.length===musicMap.length&&saved.every(v=>Number.isInteger(v)&&v>=-1&&v<128))musicMap=saved}catch{}
 $('music-cards').replaceChildren();musicKinds[activeLayout].forEach((name,i)=>{const card=document.createElement('div');card.className='mini';const title=document.createElement('strong');title.textContent=name;const value=document.createElement('div');const assign=document.createElement('button');assign.textContent='割当';assign.onclick=()=>{musicWaiting=i;musicPrevious=(selected()?.buttons||[]).map(b=>b.value>.5);$('music-status').textContent=name+'を操作してください（押しっぱなしの入力は一度離してください）。'};card.append(title,value,assign);$('music-cards').append(card);musicCards.push({card,value,count:0,until:0})});
 $('music-status').textContent=activeLayout==='guitar'?'KONAMI PS端子用の標準配置。異なる場合は割当を変更できます。':'実機で確認したPS用ドラム配置です。↑（B12）は常時オンの識別信号として別表示します。配置が異なる場合は割当を変更できます。';
}
$('music-reset').onclick=()=>{musicMap=musicDefaults();musicSave();musicKey='';musicBuild(selected())};
let otherOpen=false;const otherButton=$('other-category');otherButton.onclick=()=>{otherOpen=!otherOpen;updateLayout(selected())};
const beforeMusicUpdate=updateLayout;
updateLayout=function(p){beforeMusicUpdate(p);const special=!['ps','switch','xbox'].includes(activeLayout);$('other-types').hidden=!(otherOpen||special);otherButton.classList.toggle('active',special);otherButton.setAttribute('aria-expanded',String(otherOpen||special));const music=Object.hasOwn(musicKinds,activeLayout);musicPanel.hidden=!music||$('tab-visual').getAttribute('aria-selected')!=='true';if(music){visualPanel.querySelector('.diagram').hidden=true;visualPanel.querySelector('.readouts').hidden=true;$('music-title').textContent=activeLayout==='guitar'?'ギター':'ドラム';musicBuild(p)}};
function musicFrame(now){const p=selected();if(Object.hasOwn(musicKinds,activeLayout)){musicBuild(p);$('drum-identification').hidden=activeLayout!=='drums';if(activeLayout==='drums')$('drum-identification').textContent=!p?'識別信号 ↑（B12）：未接続':p.buttons[12]?.value>.5?'識別信号 ↑（B12）：ON（常時入力・打撃回数には含めません）':'識別信号 ↑（B12）：OFF';const down=(p?.buttons||[]).map(b=>b.value>.5);const edge=down.findIndex((v,i)=>v&&!musicPrevious[i]);if(musicWaiting>=0&&edge>=0){musicMap[musicWaiting]=edge;musicWaiting=-1;musicSave();$('music-status').textContent='割当を保存しました。'}
 musicCards.forEach((item,i)=>{const b=musicMap[i],held=!!down[b];if(held&&!musicPrevious[b]){item.count++;item.until=now+120}item.card.classList.toggle('on',held||now<item.until);item.card.style.borderColor=held||now<item.until?'#50d9bd':'';item.card.style.background=held||now<item.until?'#14594f':'';item.value.textContent=(b<0?'未割当':'B'+b)+' · '+item.count+'回'});musicPrevious=down;
 }requestAnimationFrame(musicFrame)}
const beforeMusicLabel=updateLayout;
updateLayout=function(p){beforeMusicLabel(p);if(Object.hasOwn(musicKinds,activeLayout))$('layout-info').textContent='手動選択：'+(activeLayout==='guitar'?'ギター':'ドラム')+(p?.mapping!=='standard'?'（非標準配置：割当を確認してください）':'')};
updateLayout(selected());requestAnimationFrame(musicFrame);
