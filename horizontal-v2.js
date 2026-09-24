const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
const mobile=matchMedia('(max-width:980px)');
const finePointer=matchMedia('(hover:hover) and (pointer:fine)');
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const hero=document.querySelector('.hero');
const titleA=document.querySelector('.title-a');
const titleB=document.querySelector('.title-b');
const heroLight=document.querySelector('.hero-light');
const heroRole=document.querySelector('.hero-role');
const portrait=document.querySelector('.hero-portrait');
const roleTrack=document.querySelector('.hero-role-track');
const roleGroup=document.querySelector('.hero-role-group');
function measureRole(){
 const phraseWidth=roleGroup.scrollWidth/6;
 const previousSpeed=(innerWidth+(mobile.matches?innerWidth:phraseWidth))/(mobile.matches?19:24);
 roleTrack.style.setProperty('--role-duration',`${(roleGroup.scrollWidth/(previousSpeed*.35)).toFixed(2)}s`);
}
const scenes=[...document.querySelectorAll('.scene')];
const states=new Map();
let titleX=0,titleTarget=0;
function measure(){
 measureRole();
 const heroRect=hero.getBoundingClientRect();
 if(mobile.matches){
  const portraitRect=portrait.getBoundingClientRect();
  heroRole.style.top=`${portraitRect.top-heroRect.top+portraitRect.height/2}px`;
 }else heroRole.style.removeProperty('top');
 const firstName=titleA.getBoundingClientRect(),lastName=titleB.getBoundingClientRect();
 const lightPadding=mobile.matches?18:34;
 const lightTop=Math.max(0,Math.min(firstName.top,lastName.top)-heroRect.top-lightPadding);
 const lightBottom=Math.min(heroRect.height,Math.max(firstName.bottom,lastName.bottom)-heroRect.top+lightPadding);
 heroLight.style.top=`${lightTop}px`;
 heroLight.style.height=`${Math.max(1,lightBottom-lightTop)}px`;
 const vh=innerHeight;
 for(const scene of scenes){
  const track=scene.querySelector('.track');
  const travel=mobile.matches?0:Math.max(0,track.scrollWidth-innerWidth);
  const distance=travel?Math.max(vh*.5,travel*.92):0;
  scene.style.height=mobile.matches?'':`${vh+distance}px`;
  scene.classList.toggle('is-static',!travel);
  const start=scene.dataset.direction==='reverse'?-travel:0;
  states.set(scene,{travel,distance,current:start,target:start,track,wrap:scene.querySelector('.track-wrap'),top:0,handoff:0,targetHandoff:0});
 }
 for(const scene of scenes)states.get(scene).top=scene.offsetTop;
 update();
 for(const st of states.values()){st.current=st.target;st.track.style.transform=`translate3d(${st.current}px,0,0)`;}
}
function update(){
 const range=mobile.matches?Math.max(220,titleA.parentElement.offsetTop+titleA.parentElement.offsetHeight):hero.offsetHeight*.8;
 titleTarget=reducedMotion.matches?0:clamp(scrollY/range);
 for(const scene of scenes){
  const st=states.get(scene);if(!st||mobile.matches)continue;
  const p=clamp((scrollY-st.top)/Math.max(1,st.distance));
  st.target=-st.travel*(scene.dataset.direction==='reverse'?1-p:p);
  st.targetHandoff=0;
  scene.querySelector('.progress span')?.style.setProperty('--p',String(p));
 }
}
// Keyboard focus brings off-screen desktop cards into view.
document.addEventListener('focusin',e=>{
 const card=e.target.closest('.work-link');if(!card||mobile.matches)return;
 const scene=card.closest('.scene'),st=states.get(scene);if(!st?.travel)return;
 const rect=card.getBoundingClientRect();
 if(rect.left>=0&&rect.right<=innerWidth)return;
 const x=clamp(card.offsetLeft-innerWidth*.07,0,st.travel);
 const p=scene.dataset.direction==='reverse'?1-x/st.travel:x/st.travel;
 scrollTo({top:st.top+p*st.distance,behavior:reducedMotion.matches?'instant':'smooth'});
});
const cross=document.createElement('div');cross.className='cursor-cross';cross.setAttribute('aria-hidden','true');document.body.append(cross);
let mx=0,my=0,cx=0,cy=0,crossVisible=false;
addEventListener('pointermove',e=>{
 if(e.pointerType!=='mouse'||!finePointer.matches||reducedMotion.matches)return;
 mx=e.clientX+18;my=e.clientY+18;
 if(!crossVisible){cx=mx;cy=my;crossVisible=true;cross.classList.add('is-visible');}
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{crossVisible=false;cross.classList.remove('is-visible');});
// Ambient waves with a soft cursor response on desktop.
const grid=document.querySelector('.hero-grid');
const ctx=grid?.getContext('2d');
let gw=0,gh=0,lastGrid=0,gridDirty=true,phase=0;
let gridX=0,gridY=0,pointerX=0,pointerY=0,pointerForce=0,pointerInside=false;
hero.addEventListener('pointermove',e=>{
 if(mobile.matches||!finePointer.matches||e.pointerType!=='mouse'||reducedMotion.matches)return;
 const rect=hero.getBoundingClientRect();
 pointerX=e.clientX-rect.left;pointerY=e.clientY-rect.top;
 if(!pointerInside&&pointerForce<.01){gridX=pointerX;gridY=pointerY;}
 pointerInside=true;
},{passive:true});
hero.addEventListener('pointerleave',()=>{pointerInside=false;});
window.addEventListener('blur',()=>{pointerInside=false;});
function sizeGrid(){
 if(!ctx)return;
 gw=hero.clientWidth;gh=hero.clientHeight;
 const dpr=Math.min(devicePixelRatio||1,1.5);
 grid.width=Math.round(gw*dpr);grid.height=Math.round(gh*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);gridDirty=true;
}
function drawGrid(now,dt){
 if(!ctx||hero.getBoundingClientRect().bottom<=0)return;
 if(reducedMotion.matches&&!gridDirty)return;
 if(now-lastGrid<33&&!gridDirty)return;
 phase+=reducedMotion.matches?0:(now-lastGrid<150?now-lastGrid:dt)*.00018;
 const pointerEase=1-Math.exp(-Math.min(100,now-lastGrid)/180);
 gridX+=(pointerX-gridX)*pointerEase;gridY+=(pointerY-gridY)*pointerEase;
 const activePointer=pointerInside&&!mobile.matches&&finePointer.matches&&!reducedMotion.matches;
 pointerForce+=((activePointer?1:0)-pointerForce)*pointerEase;
 lastGrid=now;gridDirty=false;
 ctx.clearRect(0,0,gw,gh);ctx.strokeStyle='rgba(160,165,170,.21)';ctx.lineWidth=.65;
 const cell=(mobile.matches?56:72)*.6,amp=reducedMotion.matches?0:(mobile.matches?9:14);
 const point=(x,y)=>{
  const dx=x-gridX,dy=y-gridY,d=Math.hypot(dx,dy);
  const bend=28*pointerForce*Math.exp(-(d*d)/(190*190));
  return [x+amp*Math.sin(y/190+phase)*Math.cos(x/330-phase*.6)+dx/Math.max(d,1)*bend,
          y+amp*Math.sin(x/230-phase*.8)*Math.cos(y/370+phase*.5)+dy/Math.max(d,1)*bend];
 };
 ctx.beginPath();
 for(let x=-cell;x<=gw+cell;x+=cell){for(let y=-cell;y<=gh+cell;y+=20){const p=point(x,y);if(y===-cell)ctx.moveTo(...p);else ctx.lineTo(...p);}}
 for(let y=-cell;y<=gh+cell;y+=cell){for(let x=-cell;x<=gw+cell;x+=20){const p=point(x,y);if(x===-cell)ctx.moveTo(...p);else ctx.lineTo(...p);}}
 ctx.stroke();
}
let lastTime=0,raf=0;
function frame(now){
 if(document.hidden){raf=0;return;}
 const dt=Math.min(64,now-(lastTime||now-16.67));lastTime=now;
 const ease=1-Math.exp(-dt/95);
 titleX=reducedMotion.matches?titleTarget:titleX+(titleTarget-titleX)*ease;
 const distance=innerWidth*(mobile.matches ? .7 : .3);
 titleA.style.setProperty('--txa',`${(-distance*titleX).toFixed(2)}px`);
 titleB.style.setProperty('--txb',`${(distance*titleX).toFixed(2)}px`);
 if(!mobile.matches){for(const st of states.values()){
  st.current+= (st.target-st.current)*(reducedMotion.matches?1:ease);
  st.handoff+=(st.targetHandoff-st.handoff)*ease;
  st.track.style.transform=`translate3d(${st.current.toFixed(2)}px,0,0)`;
  st.wrap.style.transform=`translate3d(0,${st.handoff.toFixed(2)}px,0)`;
 }}
 if(crossVisible&&!mobile.matches){cx+=(mx-cx)*ease;cy+=(my-cy)*ease;cross.style.transform=`translate3d(${cx-7}px,${cy-7}px,0)`;}
 drawGrid(now,dt);raf=requestAnimationFrame(frame);
}
addEventListener('scroll',update,{passive:true});
let resizeTimer;
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{measure();sizeGrid();},100);},{passive:true});
addEventListener('pageshow',()=>{measure();sizeGrid();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){lastTime=0;raf=requestAnimationFrame(frame);}});
reducedMotion.addEventListener('change',()=>{gridDirty=true;update();});
if('ResizeObserver' in window)new ResizeObserver(sizeGrid).observe(hero);
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}},{threshold:.04,rootMargin:'0px 0px -8% 0px'});
 document.querySelectorAll('.scene-content,.work-link,.contact > .contact-kicker,.contact > h2,.contact > p,.contact-links,.contact footer').forEach(el=>{
  if(el.classList.contains('work-link')){
   el.classList.add('reveal-card');
   el.style.setProperty('--reveal-delay',`${Math.min([...el.parentElement.children].indexOf(el),3)*85}ms`);
  }else if(el.classList.contains('scene-content'))el.classList.add('reveal-ready');
  else{
   el.classList.add('reveal-item');
   el.style.setProperty('--reveal-delay',`${Math.min([...el.parentElement.children].indexOf(el),4)*70}ms`);
  }
  observer.observe(el);
 });
 let mobileInnerObserver;
 function observeMobileContent(){
  if(!mobile.matches||mobileInnerObserver)return;
  mobileInnerObserver=new IntersectionObserver(entries=>{
   for(const entry of entries)if(entry.isIntersecting){
    entry.target.classList.add('is-visible');
    mobileInnerObserver.unobserve(entry.target);
   }
  },{threshold:.04,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.scene .scene-chrome,.scene .scene-bg,.scene .scene-note,.work-link .card-media,.work-link .card-meta').forEach(el=>{
   el.classList.add('reveal-inner');
   const delay=el.classList.contains('scene-bg')?80:el.classList.contains('scene-note')?140:el.classList.contains('card-meta')?90:0;
   el.style.setProperty('--inner-delay',`${delay}ms`);
   mobileInnerObserver.observe(el);
  });
 }
 observeMobileContent();
 mobile.addEventListener('change',observeMobileContent);
}
measure();sizeGrid();
document.fonts.ready.then(measure);
raf=requestAnimationFrame(frame);
