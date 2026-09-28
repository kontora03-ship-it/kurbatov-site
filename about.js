(()=>{
 const section=document.getElementById('about');if(!section)return;
 const pin=section.querySelector('.about-pin'),viewport=section.querySelector('.about-window'),content=section.querySelector('.about-content');
 const desktop=matchMedia('(min-width:981px)'),reduce=matchMedia('(prefers-reduced-motion:reduce)');
 let travel=0,distance=0,raf=0;
 const clamp=v=>Math.max(0,Math.min(1,v));
 function draw(){
  raf=0;
  if(!section.classList.contains('is-pinned')){content.style.transform='';return}
  const p=clamp(-section.getBoundingClientRect().top/Math.max(1,distance));
  content.style.transform=`translate3d(0,${(-travel*p).toFixed(2)}px,0)`;
  section.style.setProperty('--about-progress',p);
 }
 function request(){if(!raf)raf=requestAnimationFrame(draw)}
 function measure(){
  const enabled=desktop.matches&&!reduce.matches;
  section.classList.toggle('is-pinned',enabled);section.style.height='';content.style.transform='';
  if(enabled){
   travel=Math.max(0,content.scrollHeight-viewport.clientHeight);
   distance=travel>0?Math.max(240,travel*1.3):0;
   section.style.height=`${pin.offsetHeight+distance}px`;
  }else{travel=distance=0}
  draw();
 }
 addEventListener('scroll',request,{passive:true});addEventListener('resize',measure,{passive:true});addEventListener('pageshow',measure);
 desktop.addEventListener('change',measure);reduce.addEventListener('change',measure);
 if('ResizeObserver'in window)new ResizeObserver(measure).observe(content);
 if('IntersectionObserver'in window){
  section.classList.add('motion-ready');
  const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}},{threshold:.06});
  section.querySelectorAll('.about-reveal').forEach(el=>observer.observe(el));
 }
 document.fonts.ready.then(measure);measure();
})();
