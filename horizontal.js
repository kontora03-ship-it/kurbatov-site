const sections=[...document.querySelectorAll('.rail-section')];
function update(){
  const vh=innerHeight;
  sections.forEach(section=>{
    if(innerWidth<=800) return;
    const sticky=section.querySelector('.sticky');
    const rail=section.querySelector('.rail');
    const r=section.getBoundingClientRect();
    const maxScroll=section.offsetHeight-vh;
    const passed=Math.min(maxScroll,Math.max(0,-r.top));
    const p=maxScroll>0?passed/maxScroll:0;
    const railW=rail.scrollWidth;
    const travel=Math.max(0,railW-innerWidth+innerWidth*.08);
    const dir=section.dataset.dir;
    const x=dir==='right' ? -travel+(travel*p) : -(travel*p);
    rail.style.transform=`translate3d(${x}px,0,0)`;
  });
}
let ticking=false;
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(()=>{update();ticking=false})}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',update);update();