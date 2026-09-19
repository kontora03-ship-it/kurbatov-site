const scenes=[...document.querySelectorAll('.hscene')];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const smoothstep=p=>p*p*(3-2*p);
const states=new Map();

function measure(){
  const vw=innerWidth, vh=innerHeight;
  scenes.forEach(scene=>{
    const track=scene.querySelector('.track');
    const progress=scene.querySelector('.progress');

    if(vw<=900){
      scene.style.height='';
      track.style.transform='';
      const wrap=scene.querySelector('.track-wrap');
      if(wrap) wrap.style.transform='';
      const chrome=scene.querySelector('.scene-chrome');
      if(chrome) chrome.style.transform='';
      const note=scene.querySelector('.category-note');
      if(note) note.style.transform='';
      if(progress) progress.style.setProperty('--p','0');
      states.set(scene,{target:0,current:0,travel:0});
      return;
    }

    const travel=Math.max(0,track.scrollWidth-vw);
    const scrollDistance=Math.max(vh*.95,travel*1.05);
    scene.style.height=(vh+scrollDistance)+'px';

    const prev=states.get(scene)||{current:0};
    states.set(scene,{travel,target:prev.current,current:prev.current});
  });
  updateTargets();
}

function updateTargets(){
  if(innerWidth<=900) return;

  const y=scrollY;
  const vh=innerHeight;

  scenes.forEach(scene=>{
    const state=states.get(scene);
    if(!state) return;

    const top=scene.offsetTop;
    const range=Math.max(1,scene.offsetHeight-vh);
    const p=clamp((y-top)/range);
    const e=smoothstep(p);
    const reverse=scene.dataset.direction==='reverse';

    state.target=reverse
      ? -state.travel*(1-e)
      : -state.travel*e;

    const progress=scene.querySelector('.progress');
    if(progress) progress.style.setProperty('--p',p.toFixed(4));

    // Section hand-off is movement only: previous scene rises away,
    // next scene enters slightly from below.
    const handoffY=(p-.5)*24;
    const edge=Math.abs(p-.5)*2;
    const handoffScale=1-(edge*.012);

    const wrap=scene.querySelector('.track-wrap');
    if(wrap){
      wrap.style.transform=`translate3d(0,${handoffY.toFixed(1)}px,0) scale(${handoffScale.toFixed(4)})`;
    }

    const chrome=scene.querySelector('.scene-chrome');
    if(chrome){
      chrome.style.transform=`translate3d(0,${(handoffY*.25).toFixed(1)}px,0)`;
    }

    const note=scene.querySelector('.category-note');
    if(note){
      note.style.transform=`translate3d(0,${(handoffY*.4).toFixed(1)}px,0)`;
    }

    const title=scene.querySelector('.scene-title');
    if(title){
      const drift=(e-.5)*(reverse?-34:34);
      const lift=handoffY*.32;
      title.style.transform=`translate3d(${drift.toFixed(1)}px,${lift.toFixed(1)}px,0)`;
    }
  });
}

function frame(){
  if(innerWidth>900){
    scenes.forEach(scene=>{
      const state=states.get(scene);
      if(!state) return;

      state.current+=(state.target-state.current)*.075;
      if(Math.abs(state.target-state.current)<.05) state.current=state.target;

      const track=scene.querySelector('.track');
      if(track){
        track.style.transform=`translate3d(${state.current.toFixed(2)}px,0,0)`;
      }
    });
  }
  requestAnimationFrame(frame);
}

let resizeTimer;
addEventListener('scroll',updateTargets,{passive:true});
addEventListener('resize',()=>{
  clearTimeout(resizeTimer);
  resizeTimer=setTimeout(measure,100);
});
addEventListener('load',measure);
measure();
frame();

/* Refined hero + hand-off from category 01 to 02 */
const refinedIntro=document.querySelector('.intro-refined');
const introNameA=refinedIntro?.querySelector('.name-a');
const introNameB=refinedIntro?.querySelector('.name-b');
const firstScene=document.querySelector('.first-scene');
const nextTease=firstScene?.querySelector('.next-tease');

function updateRefinedDetails(){
  if(refinedIntro){
    const h=Math.max(1,refinedIntro.offsetHeight);
    const p=clamp(scrollY/(h*.92));
    const e=p*(2-p);
    const mobile=innerWidth<=900;
    const travelA=(mobile?innerWidth*.62:innerWidth*.26);
    const travelB=(mobile?innerWidth*.72:innerWidth*.31);

    if(introNameA) introNameA.style.setProperty('--hero-a',`${(-e*travelA).toFixed(1)}px`);
    if(introNameB) introNameB.style.setProperty('--hero-b',`${(e*travelB).toFixed(1)}px`);
  }

  if(firstScene&&nextTease){
    const top=firstScene.offsetTop;
    const range=Math.max(1,firstScene.offsetHeight-innerHeight);
    const p=clamp((scrollY-top)/range);
    const reveal=clamp((p-.74)/.26);
    nextTease.style.setProperty('--next',reveal.toFixed(4));
  }
}

addEventListener('scroll',updateRefinedDetails,{passive:true});
addEventListener('resize',updateRefinedDetails);
updateRefinedDetails();

/* Delayed print registration cross */
const printCross=document.createElement('div');
printCross.className='cursor-cross';
printCross.innerHTML='<span></span>';
document.body.appendChild(printCross);

let pointerX=-100;
let pointerY=-100;
let crossX=-100;
let crossY=-100;
let pointerSeen=false;

addEventListener('mousemove',e=>{
  pointerX=e.clientX;
  pointerY=e.clientY;

  if(!pointerSeen){
    pointerSeen=true;
    crossX=pointerX+18;
    crossY=pointerY+18;
    printCross.classList.add('is-visible');
  }
},{passive:true});

addEventListener('mouseleave',()=>{
  pointerSeen=false;
  printCross.classList.remove('is-visible');
});

function animatePrintCross(){
  if(pointerSeen && innerWidth>900){
    // Small permanent offset keeps the registration mark visible beside the native arrow,
    // while lerp gives the delayed trailing feel.
    const targetX=pointerX+18;
    const targetY=pointerY+18;
    crossX+=(targetX-crossX)*.105;
    crossY+=(targetY-crossY)*.105;
    printCross.style.transform=`translate3d(${(crossX-7).toFixed(2)}px,${(crossY-7).toFixed(2)}px,0)`;
  }
  requestAnimationFrame(animatePrintCross);
}
animatePrintCross();
