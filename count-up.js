(()=>{
 const reduce=matchMedia('(prefers-reduced-motion: reduce)');
 const items=[...document.querySelectorAll('[data-count-to]')];
 if(!items.length||reduce.matches||!('IntersectionObserver' in window))return;
 const active=new Map();
 function finish(el){el.querySelector('[data-count-value]').textContent=el.dataset.countFinal;active.delete(el);}
 function run(el){
  const value=el.querySelector('[data-count-value]'),end=Number(el.dataset.countTo);
  const start=Number(el.dataset.countFrom||0),duration=end>1000?1900:1500;
  let began;
  function tick(now){
   if(reduce.matches){finish(el);return}
   if(document.documentElement.classList.contains('home-intro-pending')){
    active.set(el,requestAnimationFrame(tick));return;
   }
   began??=now;
   const p=Math.min(1,(now-began)/duration),n=Math.round(start+(end-start)*(1-Math.pow(1-p,3)));
   value.textContent=String(n).padStart(el.dataset.countFinal.length,'0');
   if(p<1)active.set(el,requestAnimationFrame(tick));else finish(el);
  }
  active.set(el,requestAnimationFrame(tick));
 }
 const observer=new IntersectionObserver(entries=>{
  for(const e of entries)if(e.isIntersecting){observer.unobserve(e.target);run(e.target);}
 },{threshold:.55,rootMargin:'0px 0px -5% 0px'});
 items.forEach(el=>{
  const final=el.textContent.trim();
  el.dataset.countFinal=final;el.setAttribute('aria-label',final);
  const span=document.createElement('span');span.dataset.countValue='';span.setAttribute('aria-hidden','true');span.textContent=final;
  el.replaceChildren(span);observer.observe(el);
 });
 reduce.addEventListener('change',e=>{if(e.matches){
  observer.disconnect();for(const [el,id]of active){cancelAnimationFrame(id);finish(el);}
 }});
})();