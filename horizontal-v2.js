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
 const animation=roleTrack.getAnimations().find(a=>a.animationName==='hero-role-travel');
 const timing=animation?.effect.getComputedTiming();
 const oldDuration=timing?.duration;
 const oldTime=animation?.currentTime;
 const phraseWidth=roleGroup.scrollWidth/6;
 const previousSpeed=(innerWidth+(mobile.matches?innerWidth:phraseWidth))/(mobile.matches?19:24);
 const duration=Number((roleGroup.scrollWidth/(previousSpeed*.35)).toFixed(2));
 roleTrack.style.setProperty('--role-duration',`${duration}s`);
 // Preserve the current position in the loop when its duration changes.
 if(animation&&typeof oldTime==='number'&&typeof oldDuration==='number'&&oldDuration>0){
  const delay=Number(timing.delay)||0;
  animation.currentTime=delay+(oldTime-delay)*duration*1000/oldDuration;
 }
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
 }else{
  const surnameBottom=titleB.getBoundingClientRect().bottom-heroRect.top;
  heroRole.style.top=`${surnameBottom+24}px`;
 }
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
function createAmbientGrid(host,grid,inverted=false){
const rgb=inverted?'95,90,85':'160,165,170';
const gridOpacity=inverted?.9:1;
const ctx=grid?.getContext('2d');
let gw=0,gh=0,lastGrid=0,gridDirty=true,phase=0;
// Sparse cell fills share the grid's deformation and animation clock.
let gridCells=[],cellClock=0,nextCell=0,seeded=false,cellStarted=0;
let gridX=0,gridY=0,pointerX=0,pointerY=0,pointerForce=0,pointerInside=false;
// These text blocks move with the horizontal tracks and scroll entrances.
// Protect every rendered text fragment, including large headings and nested labels.
const protectedText=[];
const textWalker=document.createTreeWalker(host,NodeFilter.SHOW_TEXT);
while(textWalker.nextNode()){
 const node=textWalker.currentNode;
 if(!node.textContent.trim()||node.parentElement.closest('script,style,canvas'))continue;
 const range=document.createRange();range.selectNodeContents(node);protectedText.push(range);
}
function cellAppearance(budget){
 // Maintain the requested share instead of relying on rare random rolls.
 if(gridCells.filter(c=>c.kind==='solid').length<Math.max(1,Math.round(budget*.07)))return {kind:'solid',rgb:inverted?'0,0,0':'255,255,255',alpha:1,accent:true};
 if(gridCells.filter(c=>c.kind==='blue').length<Math.max(1,Math.round(budget*.10)))return {kind:'blue',rgb:'41,151,255',alpha:.65,accent:true};
 return {kind:'quiet',rgb,alpha:.08+Math.random()*.06,accent:false};
}
function sizeGrid(){
 if(!ctx)return;
 const width=host.clientWidth,height=host.clientHeight;
 if(width!==gw||height!==gh){gridCells=[];nextCell=cellClock;seeded=false;}
 gw=width;gh=height;
 const dpr=Math.min(devicePixelRatio||1,1.5);
 grid.width=Math.round(gw*dpr);grid.height=Math.round(gh*dpr);
 ctx.setTransform(dpr,0,0,dpr,0,0);gridDirty=true;
}
function drawGrid(now,dt){
 if(!ctx)return;
 const rect=host.getBoundingClientRect();
 if(rect.bottom<=0||rect.top>=innerHeight)return;
 if(gw!==host.clientWidth||gh!==host.clientHeight||gridDirty)sizeGrid();
 pointerX=ambientPointer.x-rect.left;pointerY=ambientPointer.y-rect.top;
 pointerInside=ambientPointer.present&&pointerX>=0&&pointerX<=gw&&pointerY>=0&&pointerY<=gh;
 if(pointerInside&&pointerForce<.01){gridX=pointerX;gridY=pointerY;}
 if(reducedMotion.matches&&!gridDirty)return;
 if(now-lastGrid<33&&!gridDirty)return;
 const gridDt=Math.min(100,now-lastGrid||dt);
 phase+=reducedMotion.matches?0:(now-lastGrid<150?now-lastGrid:dt)*.00018;
 const pointerEase=1-Math.exp(-Math.min(100,now-lastGrid)/180);
 gridX+=(pointerX-gridX)*pointerEase;gridY+=(pointerY-gridY)*pointerEase;
 const activePointer=pointerInside&&!mobile.matches&&finePointer.matches&&!reducedMotion.matches;
 pointerForce+=((activePointer?1:0)-pointerForce)*pointerEase;
 lastGrid=now;gridDirty=false;
 ctx.clearRect(0,0,gw,gh);ctx.strokeStyle=`rgba(${rgb},${.21*gridOpacity})`;ctx.lineWidth=.65;
 const cell=(mobile.matches?56:72)*.6,amp=reducedMotion.matches?0:(mobile.matches?9:14);
 const point=(x,y)=>{
  const dx=x-gridX,dy=y-gridY,d=Math.hypot(dx,dy);
  const bend=28*pointerForce*Math.exp(-(d*d)/(190*190));
  return [x+amp*Math.sin(y/190+phase)*Math.cos(x/330-phase*.6)+dx/Math.max(d,1)*bend,
          y+amp*Math.sin(x/230-phase*.8)*Math.cos(y/370+phase*.5)+dy/Math.max(d,1)*bend];
 };
 // Fills stay inside the moving cells, underneath the fine grid lines.
 if(!reducedMotion.matches){
  cellClock+=gridDt*2.1125;
  gridCells=gridCells.filter(c=>cellClock-c.born<c.life);
  const budget=Math.round(Math.min(52,Math.max(10,Math.round(gw*gh/(cell*cell)*.036)))*1.2);
  // Begin each section with staggered cycles, softly revealed on entry.
  const firstRow=Math.max(0,Math.floor(-rect.top/cell));
  const lastRow=Math.min(Math.ceil(gh/cell),Math.ceil((innerHeight-rect.top)/cell));
  // Check positions before spawning, including the portrait that would hide accents.
  const textBounds=protectedText.flatMap(range=>[...range.getClientRects()]).filter(r=>r.width&&r.height);
  const portraitBounds=host.querySelector('.hero-portrait')?.getBoundingClientRect();
  const padding=amp+28*pointerForce+12;
  const overlaps=(x,y,r)=>x+cell+padding>r.left-rect.left&&x-padding<r.right-rect.left&&y+cell+padding>r.top-rect.top&&y-padding<r.bottom-rect.top;
  const blocked=(x,y)=>textBounds.some(r=>overlaps(x,y,r))||(portraitBounds&&overlaps(x,y,portraitBounds));
  function spawnCell(staggered=false){
   const appearance=cellAppearance(budget);
   for(let attempt=0;attempt<80;attempt++){
    const col=Math.floor(Math.random()*Math.ceil(gw/cell));
    const row=firstRow+Math.floor(Math.random()*Math.max(1,lastRow-firstRow));
    const x=col*cell,y=row*cell;
    if(x+cell>gw||y+cell>gh)continue;
    if(blocked(x,y))continue;
    const center=point(x+cell/2,y+cell/2);
    if(activePointer&&Math.hypot(center[0]-pointerX,center[1]-pointerY)<170)continue;
    if(gridCells.some(c=>c.col===col&&c.row===row))continue;
    const life=5500+Math.random()*5500;
    gridCells.push({col,row,born:cellClock-(staggered?life*(.12+Math.random()*.6):0),life,...appearance,visibility:1});
    return;
   }
  }
  if(!seeded){
   seeded=true;cellStarted=cellClock;
   for(let i=0;i<Math.ceil(budget*.65);i++)spawnCell(true);
  }
  if(cellClock>=nextCell&&gridCells.length<budget){
   spawnCell();
   nextCell=cellClock+(110+Math.random()*240)/1.2;
  }
  for(const c of gridCells){
   const age=(cellClock-c.born)/c.life;
   const entrance=clamp((cellClock-cellStarted)/1000);
   const pulse=c.kind==='solid'?clamp(Math.min(age/.3,(1-age)/.3)):Math.pow(Math.sin(Math.PI*age),2);
   const envelope=pulse*entrance*entrance*(3-2*entrance);
   const x=c.col*cell,y=c.row*cell,center=point(x+cell/2,y+cell/2);
   const distance=activePointer?Math.hypot(center[0]-pointerX,center[1]-pointerY):Infinity;
   const proximity=clamp((distance-80)/90);
   c.visibility+=(proximity-c.visibility)*(1-Math.exp(-gridDt/(proximity<c.visibility?70:700)));
   // Include maximum grid distortion and a quiet margin around small text.
   if(blocked(x,y))continue;
   ctx.fillStyle=`rgba(${c.rgb},${c.alpha*envelope*c.visibility*(c.accent?1:gridOpacity)})`;
   ctx.beginPath();
   ctx.moveTo(...point(x,y));
   for(let i=1;i<=4;i++)ctx.lineTo(...point(x+cell*i/4,y));
   for(let i=1;i<=4;i++)ctx.lineTo(...point(x+cell,y+cell*i/4));
   for(let i=1;i<=4;i++)ctx.lineTo(...point(x+cell-cell*i/4,y+cell));
   for(let i=1;i<=4;i++)ctx.lineTo(...point(x,y+cell-cell*i/4));
   ctx.closePath();ctx.fill();
  }
 }
 ctx.beginPath();
 for(let x=-cell;x<=gw+cell;x+=cell){for(let y=-cell;y<=gh+cell;y+=20){const p=point(x,y);if(y===-cell)ctx.moveTo(...p);else ctx.lineTo(...p);}}
 for(let y=-cell;y<=gh+cell;y+=cell){for(let x=-cell;x<=gw+cell;x+=20){const p=point(x,y);if(x===-cell)ctx.moveTo(...p);else ctx.lineTo(...p);}}
 ctx.stroke();
}
 return {draw:drawGrid,invalidate(){gridDirty=true;},host};
}
const ambientPointer={x:0,y:0,present:false};
addEventListener('pointermove',e=>{
 if(e.pointerType!=='mouse')return;
 ambientPointer.x=e.clientX;ambientPointer.y=e.clientY;ambientPointer.present=true;
},{passive:true});
document.documentElement.addEventListener('pointerleave',()=>{ambientPointer.present=false;});
addEventListener('blur',()=>{ambientPointer.present=false;});
const ambientGrids=[createAmbientGrid(hero,document.querySelector('.hero-grid'))];
for(const section of document.querySelectorAll('.scene,.contact')){
 const host=section.querySelector('.pin')||section;
 const canvas=document.createElement('canvas');
 canvas.className='section-grid';canvas.setAttribute('aria-hidden','true');host.prepend(canvas);
 ambientGrids.push(createAmbientGrid(host,canvas,section.classList.contains('light')||section.classList.contains('contact')));
}
function sizeGrid(){for(const grid of ambientGrids)grid.invalidate();}
function drawGrid(now,dt){for(const grid of ambientGrids)grid.draw(now,dt);}
let lastTime=0,raf=0;
function frame(now){
 if(document.hidden){raf=0;return;}
 const dt=Math.min(64,now-(lastTime||now-16.67));lastTime=now;
 const ease=1-Math.exp(-dt/95);
 titleX=reducedMotion.matches?titleTarget:titleX+(titleTarget-titleX)*ease;
 const distance=innerWidth*(mobile.matches ? .7 : .3);
 titleA.style.setProperty('--txa',`${(-distance*titleX).toFixed(2)}px`);
 titleB.style.setProperty('--txb',`${(distance*titleX).toFixed(2)}px`);
 const sceneEase=1-Math.exp(-dt/170);
 if(!mobile.matches){for(const st of states.values()){
  st.current+= (st.target-st.current)*(reducedMotion.matches?1:sceneEase);
  st.handoff+=(st.targetHandoff-st.handoff)*ease;
  st.track.style.transform=`translate3d(${st.current.toFixed(2)}px,0,0)`;
  st.wrap.style.transform=`translate3d(0,${st.handoff.toFixed(2)}px,0)`;
 }}
 if(crossVisible&&!mobile.matches){cx+=(mx-cx)*ease;cy+=(my-cy)*ease;cross.style.transform=`translate3d(${cx-7}px,${cy-7}px,0)`;}
 drawGrid(now,dt);raf=requestAnimationFrame(frame);
}
addEventListener('scroll',update,{passive:true});
addEventListener('resize',()=>{measure();sizeGrid();},{passive:true});
addEventListener('pageshow',()=>{measure();sizeGrid();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!raf){lastTime=0;raf=requestAnimationFrame(frame);}});
reducedMotion.addEventListener('change',()=>{sizeGrid();update();});
if('ResizeObserver' in window){
 const gridObserver=new ResizeObserver(sizeGrid);
 for(const grid of ambientGrids)gridObserver.observe(grid.host);
}
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

// Save the originating card and restore it after returning from a case.
const portfolioReturnKey='kurbatov-portfolio-return';
document.addEventListener('click',e=>{
 const card=e.target.closest('a.work-link');if(!card)return;
 const url=new URL(location.href);url.pathname=url.pathname.replace(/\/$/,'/index.html');
 const record={url:url.href,y:scrollY,width:innerWidth,height:innerHeight,card:card.getAttribute('href'),offset:card.getBoundingClientRect().top,time:Date.now()};
 try{sessionStorage.setItem(portfolioReturnKey,JSON.stringify(record));}catch{}
 if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0)history.replaceState({...history.state,portfolioReturn:record},'');
});
function restorePortfolio(event){
 const url=new URL(location.href);
 const explicit=url.searchParams.has('portfolio-return');
 const navigation=performance.getEntriesByType('navigation')[0];
 let record=history.state?.portfolioReturn;
 if(explicit){try{record=JSON.parse(sessionStorage.getItem(portfolioReturnKey));}catch{}}
 if(!record||(!explicit&&!event?.persisted&&navigation?.type!=='back_forward'))return;
 if(explicit){url.searchParams.delete('portfolio-return');history.replaceState({...history.state,portfolioReturn:record},'',url);}
 const card=[...document.querySelectorAll('a.work-link')].find(el=>el.getAttribute('href')===record.card);
 function restore(){
  measure();
  let y=record.y;
  if(card&&(record.width!==innerWidth||record.height!==innerHeight)){
   const scene=card.closest('.scene'),st=states.get(scene);
   if(mobile.matches)y=scrollY+card.getBoundingClientRect().top-Math.min(record.offset,innerHeight*.3);
   else if(st?.travel){
    const x=clamp(card.offsetLeft-innerWidth*.07,0,st.travel);
    const p=scene.dataset.direction==='reverse'?1-x/st.travel:x/st.travel;
    y=st.top+p*st.distance;
   }else if(scene)y=scene.offsetTop;
  }
  if(card){
   card.classList.add('is-visible');
   card.closest('.scene-content')?.classList.add('is-visible');
   card.querySelectorAll('.reveal-inner').forEach(el=>el.classList.add('is-visible'));
  }
  scrollTo({top:Math.max(0,y),behavior:'instant'});update();
  for(const st of states.values()){st.current=st.target;st.track.style.transform=`translate3d(${st.current}px,0,0)`;}
 }
 document.fonts.ready.then(()=>requestAnimationFrame(restore));
}
addEventListener('pageshow',restorePortfolio);
