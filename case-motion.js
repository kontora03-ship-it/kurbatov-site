(()=>{
 const media=matchMedia('(min-width:701px) and (hover:hover) and (prefers-reduced-motion:no-preference)');
 const targets=[...document.querySelectorAll('.motion-detail')];
 let observer=null,frame=0;const visible=new Set();
 function draw(){frame=0;for(const el of visible){const box=el.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight-box.top)/(innerHeight+box.height)));el.style.setProperty('--motion-scale',(1+progress*.035).toFixed(4));}}
 function request(){if(!frame&&visible.size)frame=requestAnimationFrame(draw);}
 function setup(){observer?.disconnect();visible.clear();cancelAnimationFrame(frame);frame=0;
  removeEventListener('scroll',request);removeEventListener('resize',request);
  targets.forEach(el=>el.style.removeProperty('--motion-scale'));
  if(!media.matches||!('IntersectionObserver' in window))return;
  observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target);}request();});
  targets.forEach(el=>observer.observe(el));addEventListener('scroll',request,{passive:true});addEventListener('resize',request,{passive:true});
 }
 media.addEventListener('change',setup);setup();
})();