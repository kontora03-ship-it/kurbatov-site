const scenes=[...document.querySelectorAll('.hscene')];
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
const states=new Map();

function measure(){
  const vw=innerWidth, vh=innerHeight;
  scenes.forEach(scene=>{
    const track=scene.querySelector('.track');
    const progress=scene.querySelector('.progress');
    if(vw<=900){
      scene.style.height='';
      track.style.transform='';
      if(progress) progress.style.setProperty('--p','0');
      states.set(scene,{target:0,current:0,travel:0});
      return;
    }
    const travel=Math.max(0,track.scrollWidth-vw);
    const scrollDistance=Math.max(vh*.9,travel*1.03);
    scene.style.height=(vh+scrollDistance)+'px';
    const prev=states.get(scene)||{current:0};
    states.set(scene,{travel,target:prev.current,current:prev.current});
  });
  updateTargets();
}

function updateTargets(){
  if(innerWidth<=900) return;
  const y=scrollY, vh=innerHeight;
  scenes.forEach(scene=>{
    const state=states.get(scene);
    if(!state) return;
    const top=scene.offsetTop;
    const range=Math.max(1,scene.offsetHeight-vh);
    const p=clamp((y-top)/range);
    const reverse=scene.dataset.direction==='reverse';
    state.target=reverse ? -state.travel*(1-p) : -state.travel*p;
    const bar=scene.querySelector('.progress');
    if(bar) bar.style.setProperty('--p',p.toFixed(4));
    const title=scene.querySelector('.scene-title');
    if(title){
      const drift=(p-.5)*(reverse?-28:28);
      title.style.transform=`translate3d(${drift.toFixed(1)}px,0,0)`;
    }
  });
}

function frame(){
  if(innerWidth>900){
    scenes.forEach(scene=>{
      const state=states.get(scene);
      if(!state) return;
      state.current += (state.target-state.current)*.11;
      if(Math.abs(state.target-state.current)<.05) state.current=state.target;
      scene.querySelector('.track').style.transform=`translate3d(${state.current.toFixed(2)}px,0,0)`;
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
const introPhoto=refinedIntro?.querySelector('.intro-photo');
const introNameA=refinedIntro?.querySelector('.name-a');
const introNameB=refinedIntro?.querySelector('.name-b');
const firstScene=document.querySelector('.first-scene');
const nextTease=firstScene?.querySelector('.next-tease');

function updateRefinedDetails(){
  if(innerWidth<=900){
    if(introPhoto) introPhoto.style.transform='';
    if(introNameA) introNameA.style.transform='';
    if(introNameB) introNameB.style.transform='';
    if(nextTease) nextTease.style.setProperty('--next','0');
    return;
  }

  if(refinedIntro){
    const h=Math.max(1,refinedIntro.offsetHeight);
    const p=clamp(scrollY/h);
    const e=p*(2-p);
    if(introPhoto) introPhoto.style.transform=`translate3d(0,${(e*14).toFixed(1)}px,0)`;
    if(introNameA) introNameA.style.transform=`translate3d(${(-e*18).toFixed(1)}px,0,0)`;
    if(introNameB) introNameB.style.transform=`translate3d(${(e*24).toFixed(1)}px,0,0)`;
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
