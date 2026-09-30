(()=>{
 if(!window.homeIntroPending)return;
 const root=document.documentElement;
 const signature=document.querySelector('.hero-signature');
 const photo=document.querySelector('.hero-portrait img');
 let started=false,timer,animations=[];
 function finish(){for(const a of animations)a.cancel();animations=[];clearTimeout(timer);signature?.classList.add('is-writing');}
 function start(){
  if(started)return;started=true;
  try{sessionStorage.setItem('kurbatov-intro-v92','1');}catch{}
  root.classList.remove('home-intro-pending');
  window.homeIntroPending=false;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||scrollY>80){finish();return;}
  const configs=[
   ['.hero-grid,.hero-light',0,1200,0],
   ['.hero-title',120,1050,12],
   ['.hero-portrait',300,1200,22],
   ['.hero-copy',560,900,12],
   ['.hero-categories',650,850,12],
   ['.nav,.hero-topline,.hero-foot,.hero-role',500,950,0]
  ];
  for(const [selector,delay,duration,y] of configs)for(const el of document.querySelectorAll(selector)){
   animations.push(el.animate([{opacity:0,translate:'0 '+y+'px'},{opacity:getComputedStyle(el).opacity,translate:'0 0'}],{delay,duration,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'}));
  }
  timer=setTimeout(()=>signature?.classList.add('is-writing'),650);
 }
 Promise.all([document.fonts.ready,photo?.decode().catch(()=>{})]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(start)));
 setTimeout(start,3500);
 addEventListener('scroll',()=>{if(scrollY>80){if(!started)start();finish();}},{passive:true});
 addEventListener('pageshow',e=>{if(e.persisted){root.classList.remove('home-intro-pending');finish();}});
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches){if(!started)start();finish();}});
})();