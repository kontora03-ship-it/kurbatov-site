(()=>{
const mode=Math.max(1,Math.min(3,Number(new URLSearchParams(location.search).get('variant'))||1));
const motion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const nodes=[...document.querySelectorAll('.nav,.hero-topline,.hero-title,.hero-portrait,.hero-copy,.hero-categories,.hero-foot,.hero-role,.hero-grid,.hero-light')];
let started=false;
async function start(){
 if(started)return;started=true;
 const signature=document.querySelector('.hero-signature');
 signature.classList.remove('is-writing');
 document.documentElement.classList.remove('intro-pending');
 if(motion){signature.classList.add('is-writing');return;}
 const configs=mode===1?
 [['.hero-grid,.hero-light',0,1000,0],['.hero-title,.hero-portrait',80,1000,0],['.nav,.hero-topline,.hero-copy,.hero-categories,.hero-foot,.hero-role',160,950,0]]:
 mode===2?
 [['.hero-grid,.hero-light',0,1200,0],['.hero-title',120,1050,12],['.hero-portrait',300,1200,22],['.hero-copy',560,900,12],['.hero-categories',650,850,12],['.nav,.hero-topline,.hero-foot,.hero-role',500,950,0]]:
 [['.hero-grid,.hero-light',0,1600,0],['.hero-title',100,1500,10],['.hero-portrait',80,1720,0],['.hero-copy,.hero-categories',650,1150,16],['.nav,.hero-topline,.hero-foot,.hero-role',520,1200,0]];
 for(const [selector,delay,duration,y]of configs)for(const el of document.querySelectorAll(selector)){
  const opacity=getComputedStyle(el).opacity;
  const from={opacity:0,translate:'0 '+y+'px'},to={opacity,translate:'0 0'};
  if(mode===3&&el.matches('.hero-portrait')){from.scale='1.065';to.scale='1';}
  el.animate([from,to],{delay,duration,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
 }
 // Keep the original order of handwriting; begin after the portrait enters.
 signature.getAnimations({subtree:true}).forEach(a=>a.cancel());
 setTimeout(()=>signature.classList.add('is-writing'),mode===1?350:mode===2?650:850);
}
const photo=document.querySelector('.hero-portrait img');
Promise.all([document.fonts.ready,photo.decode().catch(()=>{})]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(start)));
setTimeout(start,4500);
})();