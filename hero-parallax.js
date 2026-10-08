(()=>{
 const hero=document.querySelector('.hero');if(!hero)return;
 const enabled=matchMedia('(min-width:981px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 const layers=[
  ['.hero-portrait img',12],['.hero-signature',12],
  ['.title-a',-6],['.title-b',-6],['.hero-role',4]
 ].map(([s,depth])=>({el:hero.querySelector(s),depth})).filter(x=>x.el);
 let x=0,y=0,tx=0,ty=0,raf=0,last=0,visible=true;
 function paint(){for(const {el,depth}of layers)el.style.setProperty('--hero-mouse-offset',x*depth+'px '+y*depth+'px');}
 function tick(now){
  const dt=last?Math.min(now-last,50):16;last=now;
  const ease=1-Math.exp(-dt/170);x+=(tx-x)*ease;y+=(ty-y)*ease;
  if(Math.abs(tx-x)+Math.abs(ty-y)<.001){x=tx;y=ty;paint();raf=0;last=0;return}
  paint();raf=requestAnimationFrame(tick);
 }
 function request(){if(!raf)raf=requestAnimationFrame(tick);}
 function reset(immediate=false){tx=ty=0;if(immediate){cancelAnimationFrame(raf);raf=last=x=y=0;paint();}else request();}
 hero.addEventListener('pointermove',e=>{
  if(!enabled.matches||!visible||e.pointerType!=='mouse')return;
  const r=hero.getBoundingClientRect();
  tx=Math.max(-1,Math.min(1,2*(e.clientX-r.left)/r.width-1));
  ty=Math.max(-1,Math.min(1,2*(e.clientY-r.top)/r.height-1));request();
 },{passive:true});
 hero.addEventListener('pointerleave',()=>reset());
 addEventListener('blur',()=>reset(true));
 document.addEventListener('visibilitychange',()=>{if(document.hidden)reset(true)});
 enabled.addEventListener('change',()=>reset(true));
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{
  visible=entries[0].isIntersecting;if(!visible)reset(true);
 }).observe(hero);
})();