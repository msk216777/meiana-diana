function toast(t){const e=document.getElementById('toast');e.textContent=t;e.style.opacity=1;e.style.transform='translateY(0)';setTimeout(()=>{e.style.opacity=0;e.style.transform='translateY(10px)'},2500)}
document.querySelectorAll('.photo-card input').forEach(input=>input.addEventListener('change',e=>{const f=e.target.files[0],card=e.target.closest('.photo-card'),box=card.querySelector('.photo-placeholder');if(!f)return;const r=new FileReader();r.onload=()=>{box.innerHTML='<img alt="Our memory" src="'+r.result+'">';toast('Photo added ♥');};r.readAsDataURL(f)}));
function blow(btn){
  if(!btn || btn.classList.contains('off')) return;
  btn.classList.add('off');
  btn.setAttribute('aria-pressed','true');
  btn.querySelector('.flame')?.classList.add('extinguished');
  const candles=[...document.querySelectorAll('.candles .candle')];
  const remaining=candles.filter(x=>!x.classList.contains('off')).length;
  const wish=document.getElementById('wishText');
  if(!remaining){
    if(wish) wish.textContent='Wish made. Your birthday surprise is starting… ♥';
    if(typeof confetti==='function') confetti();
    window.setTimeout(openBirthdayVideo,650);
  } else if(wish){
    wish.textContent=remaining===1 ? 'One more candle… make it count. ♥' : `${remaining} candles left. Keep going, Daino. ♥`;
  }
}


/* Real photo lightbox */
(function(){
  const box=document.getElementById('photoLightbox');
  const image=document.getElementById('lightboxImage');
  const caption=document.getElementById('lightboxCaption');
  const close=document.getElementById('lightboxClose');
  if(!box||!image||!caption||!close)return;
  const open=(card)=>{image.src=card.dataset.full;caption.textContent=card.querySelector('figcaption')?.textContent||'';box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';};
  const shut=()=>{box.classList.remove('open');box.setAttribute('aria-hidden','true');image.src='';document.body.style.overflow='';};
  document.querySelectorAll('.memory-photo').forEach(card=>{
    card.addEventListener('click',()=>open(card));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(card);}});
  });
  close.addEventListener('click',shut); box.addEventListener('click',e=>{if(e.target===box)shut();}); document.addEventListener('keydown',e=>{if(e.key==='Escape')shut();});
})();


/* Birthday cake -> automatic video surprise */
(function(){
  const overlay=document.getElementById('birthdayVideoOverlay');
  const video=document.getElementById('birthdaySurpriseVideo');
  const close=document.getElementById('birthdayVideoClose');
  const bg=document.getElementById('bgMusic');
  if(!overlay || !video) return;
  function openBirthdayVideo(){
    overlay.classList.add('show');
    overlay.setAttribute('aria-hidden','false');
    document.body.classList.add('birthday-video-open');
    if(bg && !bg.paused) bg.pause();
    video.currentTime=0;
    video.volume=0.96;
    const playPromise=video.play();
    if(playPromise && playPromise.catch) playPromise.catch(()=>{});
  }
  function closeBirthdayVideo(){
    video.pause();
    overlay.classList.remove('show');
    overlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('birthday-video-open');
  }
  close?.addEventListener('click',closeBirthdayVideo);
  overlay.addEventListener('click',e=>{if(e.target===overlay) closeBirthdayVideo();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && overlay.classList.contains('show')) closeBirthdayVideo();});
  video.addEventListener('ended',()=>video.pause());
  window.openBirthdayVideo=openBirthdayVideo;
})();

/* Background music — user's uploaded track at a soft volume. */
(function(){
  const music=document.getElementById('bgMusic');
  const fab=document.getElementById('musicFab');
  if(!music || !fab) return;
  music.volume=0.16;
  let started=false;
  const update=()=>{
    const on=!music.paused;
    fab.classList.toggle('playing',on);
    fab.textContent=on ? '❚❚' : '♫';
    fab.setAttribute('aria-label',on ? 'Pause birthday music' : 'Play birthday music');
  };
  const start=()=>{
    if(started) return;
    started=true;
    music.play().then(update).catch(()=>{started=false;update();});
  };
  fab.addEventListener('click',()=>{
    if(music.paused){started=true;music.play().then(update).catch(update);}else{music.pause();update();}
  });
  document.addEventListener('pointerdown',e=>{ if(fab.contains(e.target)) return; start(); },{once:true,passive:true});
  document.addEventListener('keydown',e=>{ if(fab.contains(e.target)) return; start(); },{once:true});
  music.addEventListener('play',update);
  music.addEventListener('pause',update);
  update();
})();

/* Two-name swap puzzle — robust and easy to solve with the visible reference. */
(function(){
  const board=document.getElementById('puzzle');
  const result=document.getElementById('puzzleComplete');
  const shuffleBtn=document.getElementById('puzzleShuffle');
  if(!board || !result) return;
  const solved=[
    'M','E','G','H',
    'R','A','J','♥',
    'D','I','A','N',
    'A','♥','♡','♥'
  ];
  let tiles=[];
  let selected=-1;
  function isSolved(){ return tiles.every((v,i)=>v===solved[i]); }
  const screenshotStart=[
    'E','H','M','G',
    'J','R','A','♥',
    'D','I','A','N',
    '♥','A','♡','♥'
  ];
  function shuffle(){
    // Start from the exact shuffled layout shown in the uploaded screenshot.
    tiles=screenshotStart.slice();
    selected=-1;
    result.textContent='';
    render();
  }
  function render(){
    board.innerHTML='';
    tiles.forEach((value,idx)=>{
      const b=document.createElement('button');
      b.type='button';
      b.className='tile';
      b.textContent=value;
      b.setAttribute('aria-label',`Tile ${idx+1}: ${value}`);
      if(idx===selected)b.classList.add('selected');
      b.addEventListener('click',()=>tap(idx));
      board.appendChild(b);
    });
  }
  function tap(idx){
    if(selected===idx){selected=-1;render();return;}
    if(selected<0){selected=idx;render();return;}
    [tiles[selected],tiles[idx]]=[tiles[idx],tiles[selected]];
    selected=-1;
    render();
    if(isSolved()){
      result.innerHTML='You put <b>MEGHRAJ ♥ DIANA</b> together. That little heart is ours. ❤️';
      if(typeof confetti==='function') confetti();
    }
  }
  shuffleBtn?.addEventListener('click',shuffle);
  window.resetMeianaPuzzle=shuffle;
  shuffle();
})();

/* Secret Door — case-insensitive, keyboard-friendly, with a real unlocked state. */
function unlockSecret(){
  const input=document.getElementById('secretInput');
  const result=document.getElementById('secretResult');
  const status=document.getElementById('secretDoorStatus');
  const box=document.querySelector('#secret .secret-box');
  if(!input || !result) return;

  const value=input.value.trim().toLowerCase();
  // Main secret: MEIANA. Existing Meiana nicknames are also accepted.
  const accepted=new Set(['meiana','meiana♥','meghraj','diana','lilliput','daino','capsicum']);

  if(accepted.has(value)){
    box?.classList.add('unlocked');
    if(status) status.textContent='🔓 Door unlocked… welcome to our little secret.';
    result.classList.add('secret-success');
    result.innerHTML='<b>MEIANA ♥</b><br><span>Some things are meant only for the two of us.</span>';
    input.value='';
    input.blur();
    if(typeof confetti==='function') confetti();
    return;
  }

  box?.classList.remove('unlocked');
  if(status) status.textContent='🔒 That is not the secret word yet…';
  result.classList.add('secret-success');
  result.textContent='Try one of the names that belongs to our little world. ♥';
  input.focus();
}

document.addEventListener('DOMContentLoaded',()=>{
  const input=document.getElementById('secretInput');
  if(input){
    input.addEventListener('keydown',e=>{
      if(e.key==='Enter'){e.preventDefault();unlockSecret();}
    });
  }
});

/* Special letter reveal — fixes the Tap to open button. */
function openLetter(){
  const letter=document.getElementById('letter');
  const button=document.querySelector('.envelope');
  if(!letter) return;
  const isOpen=!letter.classList.contains('hidden');
  if(isOpen){
    letter.classList.add('hidden');
    letter.style.display='none';
    button?.classList.remove('opened');
    if(button) button.querySelector('b').textContent='Tap to open';
    return;
  }
  letter.classList.remove('hidden');
  letter.style.display='block';
  letter.classList.add('letter-open');
  button?.classList.add('opened');
  if(button) button.querySelector('b').textContent='Letter opened ♥';
  requestAnimationFrame(()=>letter.scrollIntoView({behavior:'smooth',block:'center'}));
  if(typeof confetti==='function') confetti();
}

/* Gift reveal — user's uploaded photo appears with the exact birthday message. */
(function(){
  const box=document.getElementById('giftBox');
  const reveal=document.getElementById('giftReveal');
  if(!box || !reveal) return;
  window.openGift=function(){
    box.classList.add('open');
    reveal.classList.add('show');
    reveal.setAttribute('aria-hidden','false');
    const music=document.getElementById('bgMusic');
    if(music && !music.paused) music.volume=0.11;
    toast('Your final gift is here, Diana. ❤️');
  };
})();


/* Open When cards — tap once to reveal, tap again to close. */
function toggleWhen(card){
  if(!card) return;
  const isOpen = card.classList.toggle('open');
  const teaser = card.querySelector('.tease');
  const message = card.querySelector('.hidden-msg');
  const lock = card.querySelector('.lock');

  card.setAttribute('aria-expanded', String(isOpen));
  if(teaser){
    teaser.setAttribute('aria-hidden', String(isOpen));
  }
  if(message){
    message.setAttribute('aria-hidden', String(!isOpen));
    message.setAttribute('tabindex', isOpen ? '0' : '-1');
  }
  if(lock){
    lock.textContent = isOpen ? '♥' : '✉';
  }

  if(isOpen){
    card.scrollIntoView({behavior:'smooth', block:'nearest'});
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.when-card').forEach(card=>{
    card.setAttribute('role','button');
    card.setAttribute('tabindex','0');
    card.setAttribute('aria-expanded','false');
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter' || e.key===' '){
        e.preventDefault();
        toggleWhen(card);
      }
    });
  });
});
