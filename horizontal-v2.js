const reducedMotion=matchMedia("(prefers-reduced-motion: reduce)");

const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smoothstep=p=>p*p*(3-2*p);
const hero=document.querySelector('.hero');
const titleA=document.querySelector('.title-a');
const titleB=document.querySelector('.title-b');
const scenes=[...document.querySelectorAll('.scene')];
const states=new Map();

const cursorCross=document.createElement('div');
cursorCross.className='cursor-cross';
document.body.appendChild(cursorCross);
let mouseX=-100,mouseY=-100,crossX=-100,crossY=-100,crossVisible=false,activeHover=false;
addEventListener('mousemove',e=>{
  mouseX=e.clientX;mouseY=e.clientY;
  if(!crossVisible){
    crossVisible=true;
    crossX=mouseX+18;crossY=mouseY+18;
    cursorCross.classList.add('is-visible');
  }
},{passive:true});
addEventListener('mouseleave',()=>{crossVisible=false;cursorCross.classList.remove('is-visible')});
document.querySelectorAll('a,.card,.text-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>activeHover=true);
  el.addEventListener('mouseleave',()=>activeHover=false);
});

function measure(){
  const vw=innerWidth,vh=innerHeight;
  scenes.forEach(scene=>{
    const track=scene.querySelector('.track');
    if(vw<=980){
      scene.style.height='';
      states.set(scene,{travel:0,current:0,target:0});
      return;
    }
    const travel=Math.max(0,track.scrollWidth-vw);
    const scrollDistance=Math.max(vh*.86,travel*.84);
    scene.style.height=(vh+scrollDistance)+'px';
    const prev=states.get(scene)||{current:0};
    const initial=scene.dataset.direction==='reverse'?-travel:0;
    states.set(scene,{travel,current:states.has(scene)?prev.current:initial,target:initial,handoff:0,handoffTarget:0});
  });
  update();
}

function update(){
  const y=scrollY;
  if(hero){
    const h=Math.max(1,hero.offsetHeight*.9);
    const p=clamp(y/h);
    const e=reducedMotion.matches?0:p*(2-p);
    const mobile=innerWidth<=980;
    titleA?.style.setProperty('--txa',`${(-(mobile?innerWidth*.62:innerWidth*.28)*e).toFixed(1)}px`);
    titleB?.style.setProperty('--txb',`${((mobile?innerWidth*.74:innerWidth*.32)*e).toFixed(1)}px`);
  }
  if(innerWidth<=980)return;

  const vh=innerHeight;
  scenes.forEach(scene=>{
    const state=states.get(scene);if(!state)return;
    const top=scene.offsetTop;
    const range=Math.max(1,scene.offsetHeight-vh);
    const p=clamp((y-top)/range);
    const e=smoothstep(p);
    const reverse=scene.dataset.direction==='reverse';
    state.target=reverse?-state.travel*(1-e):-state.travel*e;
    scene.querySelector('.progress span')?.style.setProperty('--p',p.toFixed(4));

    const edge=.12;
    let handoff=0;
    if(p<edge) handoff=34*(1-smoothstep(p/edge));
    else if(p>1-edge) handoff=-34*smoothstep((p-(1-edge))/edge);

    const wrap=scene.querySelector('.track-wrap');
    const chrome=scene.querySelector('.scene-chrome');
    const note=scene.querySelector('.scene-note');
    const title=scene.querySelector('.scene-bg');
    state.handoffTarget=reducedMotion.matches?0:handoff;
    if(chrome)chrome.style.transform=`translate3d(0,${(handoff*.22).toFixed(1)}px,0)`;
    if(note)note.style.transform=`translate3d(0,${(handoff*.36).toFixed(1)}px,0)`;
    if(title){
      const drift=(e-.5)*(reverse?-30:30);
      title.style.transform=`translate3d(${drift.toFixed(1)}px,${(handoff*.32).toFixed(1)}px,0)`;
    }
  });
}

function frame(){
  if(crossVisible&&innerWidth>980){
    const targetX=mouseX+18,targetY=mouseY+18;
    crossX+=(targetX-crossX)*.105;
    crossY+=(targetY-crossY)*.105;
    const scale=activeHover?1.25:1;
    cursorCross.style.transform=`translate3d(${(crossX-7).toFixed(2)}px,${(crossY-7).toFixed(2)}px,0) scale(${scale})`;
  }
  if(innerWidth>980){
    scenes.forEach(scene=>{
      const st=states.get(scene);if(!st)return;
      st.current+=(st.target-st.current)*(reducedMotion.matches?1:.075);
      st.handoff+=(st.handoffTarget-st.handoff)*.065;
      scene.querySelector(".track-wrap").style.transform=`translate3d(0,${st.handoff.toFixed(2)}px,0)`;
      if(Math.abs(st.target-st.current)<.05)st.current=st.target;
      scene.querySelector('.track').style.transform=`translate3d(${st.current.toFixed(2)}px,0,0)`;
    });
  }
  drawGrid();
  requestAnimationFrame(frame);
}

let resizeTimer;
addEventListener('scroll',update,{passive:true});
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(measure,80)});
addEventListener('load',measure);
measure();update();

// A restrained, elastic grey grid behind the portrait.
const grid=document.querySelector('.hero-grid');
const ctx=grid.getContext('2d');
let gw=0,gh=0,gx=0,gy=0,gtx=0,gty=0,force=0,targetForce=0;
function sizeGrid(){
 gw=hero.clientWidth;gh=hero.clientHeight;
 const dpr=Math.min(devicePixelRatio||1,2);
 grid.width=gw*dpr;grid.height=gh*dpr;
 ctx.setTransform(dpr,0,0,dpr,0,0);
}
hero.addEventListener('pointermove',e=>{
 if(e.pointerType==='touch'||reducedMotion.matches)return;
 const r=hero.getBoundingClientRect();gtx=e.clientX-r.left;gty=e.clientY-r.top;targetForce=1;
},{passive:true});
hero.addEventListener('pointerleave',()=>targetForce=0);
function drawGrid(){
 if(hero.getBoundingClientRect().bottom<0)return;
 gx+=(gtx-gx)*.055;gy+=(gty-gy)*.055;
 force+=((reducedMotion.matches?0:targetForce)-force)*.045;
 ctx.clearRect(0,0,gw,gh);ctx.strokeStyle='rgba(160,165,170,.19)';ctx.lineWidth=.65;
 const step=64,radius=235;
 function point(x,y){
  const dx=x-gx,dy=y-gy,d=Math.hypot(dx,dy);
  const pull=Math.exp(-(d*d)/(radius*radius))*force*24;
  return [x+dx/Math.max(d,1)*pull,y+dy/Math.max(d,1)*pull];
 }
 ctx.beginPath();
 for(let x=-step;x<=gw+step;x+=step){
  for(let y=-step;y<=gh+step;y+=16){const p=point(x,y);if(y===-step)ctx.moveTo(...p);else ctx.lineTo(...p);}
 }
 for(let y=-step;y<=gh+step;y+=step){
  for(let x=-step;x<=gw+step;x+=16){const p=point(x,y);if(x===-step)ctx.moveTo(...p);else ctx.lineTo(...p);}
 }
 ctx.stroke();
}
new ResizeObserver(sizeGrid).observe(hero);sizeGrid();
if('IntersectionObserver' in window){
 const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');reveal.unobserve(entry.target);}
 }),{threshold:.06});
 document.querySelectorAll('.scene-content').forEach(el=>{el.classList.add('reveal-ready');reveal.observe(el);});
}
document.fonts.ready.then(measure);
frame();
