const app = document.getElementById('app');
const holdZone = document.getElementById('holdZone');
const giftBtn = document.getElementById('giftBtn');
const closeLetter = document.getElementById('closeLetter');
const audioBtn = document.getElementById('audioBtn');
const music = document.getElementById('music');
const floatingLayer = document.getElementById('floatingLayer');
const toast = document.getElementById('toast');

const phrases = [
  'Minh Châu','trung thu vui vẻ','iu em','i love you','iu em nhiều lắm','cảm ơn em vì tất cả',
  'iu em','Minh Châu','trung thu vui vẻ','chúc em một đời bình an','iu em nhiều lắm',
  'em thật nhiều may mắn','trung thu vui vẻ','iu em','Minh Châu','i love you'
];

function setStage(name){
  app.className = `stage stage-${name}`;
}

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast.t);
  showToast.t=setTimeout(()=>toast.classList.remove('show'),1600);
}

function seedStars(){
  const layer=document.getElementById('stars');
  for(let i=0;i<55;i++){
    const s=document.createElement('i'); s.className='star';
    s.style.left=(Math.random()*100)+'%'; s.style.top=(Math.random()*100)+'%';
    s.style.setProperty('--d',(1.2+Math.random()*3.6)+'s');
    s.style.animationDelay=(-Math.random()*3)+'s';
    layer.appendChild(s);
  }
}

function populateFlying(){
  floatingLayer.innerHTML='';
  phrases.forEach((txt,i)=>{
    const el=document.createElement('div'); el.className='float-item'; el.textContent=txt;
    el.style.left=(4+Math.random()*86)+'%'; el.style.top=(7+Math.random()*83)+'%';
    el.style.setProperty('--x',((Math.random()-.5)*150)+'px');
    el.style.setProperty('--y',((Math.random()-.5)*180)+'px');
    el.style.setProperty('--r',((Math.random()-.5)*10)+'deg');
    el.style.setProperty('--t',(5+Math.random()*8)+'s');
    el.style.setProperty('--delay',(-Math.random()*7)+'s');
    floatingLayer.appendChild(el);
  });
  [
    {x:7,y:45,r:-6,img:'assets/heart.jpg'},
    {x:58,y:24,r:5,img:'assets/heart.jpg'},
    {x:65,y:67,r:-4,img:'assets/heart.jpg'}
  ].forEach((p,i)=>{
    const el=document.createElement('img'); el.className='float-photo'; el.src=p.img; el.alt='';
    el.style.left=p.x+'%'; el.style.top=p.y+'%'; el.style.setProperty('--x',((i%2?1:-1)*70)+'px'); el.style.setProperty('--y',(i%2?55:-45)+'px'); el.style.setProperty('--t',(6+i)+'s'); el.style.setProperty('--delay',(-i*2)+'s'); floatingLayer.appendChild(el);
  });
}

let holdTimer=null, holding=false;
function startHold(e){
  if(app.classList.contains('stage-moon')===false) return;
  holding=true;
  holdZone.setPointerCapture?.(e.pointerId);
  holdTimer=setTimeout(()=>{
    holding=false;
    setStage('flying');
    populateFlying();
    showToast('Trung thu vui vẻ, Minh Châu ❤️');
    setTimeout(()=>setStage('heart'),5200);
  },850);
}
function cancelHold(){
  if(!holding) return;
  holding=false; clearTimeout(holdTimer); holdTimer=null;
}
holdZone.addEventListener('pointerdown',startHold);
holdZone.addEventListener('pointerup',cancelHold);
holdZone.addEventListener('pointercancel',cancelHold);
holdZone.addEventListener('pointerleave',cancelHold);

giftBtn.addEventListener('click',()=>{ setStage('letter'); });
closeLetter.addEventListener('click',()=>{ setStage('heart'); });

audioBtn.addEventListener('click',async()=>{
  try{
    if(music.paused){ await music.play(); audioBtn.textContent='🔊'; showToast('Đã bật nhạc'); }
    else { music.pause(); audioBtn.textContent='🔇'; showToast('Đã tắt nhạc'); }
  }catch(err){ showToast('Chạm thêm lần nữa để bật nhạc'); }
});

// A single tap on the heart scene opens the letter, matching the supplied recording's flow.
app.addEventListener('click',(e)=>{
  if(app.classList.contains('stage-heart') && !e.target.closest('button')) setStage('letter');
});

seedStars();

// Soft-start: the recording begins on the moon scene.
setStage('moon');
