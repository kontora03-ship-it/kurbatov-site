(() => {
 const back=document.getElementById('back');
 if(!back)return;
 const key='kurbatov-portfolio-return';
 const home=new URL('../index.html',location.href);
 let saved=null;
 try{
  const candidate=JSON.parse(sessionStorage.getItem(key));
  const url=new URL(candidate?.url);
  const ref=document.referrer?new URL(document.referrer):null;
  if(url.origin===home.origin&&url.pathname===home.pathname&&Date.now()-candidate.time<86400000&&ref?.origin===home.origin)saved=candidate;
 }catch{}
 const button=document.createElement('a');
 button.className='case-return';
 button.href=back.href;
 button.setAttribute('aria-label','Вернуться к просмотру работ');
 button.title='Вернуться к работам';
 button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m7-7-7 7 7 7"/></svg>';
 button.tabIndex=-1;button.setAttribute('aria-hidden','true');
 document.body.append(button);
 let shown=false;
 function updateButton(){
  if(scrollY>80)shown=true;
  button.classList.toggle('is-visible',shown);
  button.tabIndex=shown?0:-1;
  button.setAttribute('aria-hidden',String(!shown));
 }
 addEventListener('scroll',updateButton,{passive:true});
 addEventListener('pageshow',updateButton);
 updateButton();
 function goBack(e){
  if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  let ref=null;try{ref=new URL(document.referrer);}catch{}
  const fromHome=ref?.origin===home.origin&&(ref.pathname===home.pathname||ref.pathname===new URL('../',location.href).pathname);
  if(fromHome&&history.length>1){e.preventDefault();history.back();return;}
  if(saved){
   e.preventDefault();
   const target=new URL(saved.url);target.searchParams.set('portfolio-return','1');
   location.assign(target.href);
  }
 }
 back.addEventListener('click',goBack);
 button.addEventListener('click',goBack);
})();

/* Match the home page's trailing blue cross on mouse-driven desktops. */
(() => {
 const enabled=matchMedia('(min-width:981px) and (hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)');
 const cross=document.createElement('div');
 cross.className='cursor-cross';cross.setAttribute('aria-hidden','true');
 document.body.append(cross);
 let mx=0,my=0,cx=0,cy=0,visible=false,frame=0,last=0;
 function hide(){
  visible=false;cross.classList.remove('is-visible');
  cancelAnimationFrame(frame);frame=0;last=0;
 }
 function draw(time){
  const dt=last?Math.min(time-last,64):16.67;last=time;
  const ease=1-Math.exp(-dt/95);
  cx+=(mx-cx)*ease;cy+=(my-cy)*ease;
  cross.style.transform='translate3d('+(cx-7)+'px,'+(cy-7)+'px,0)';
  if(visible&&(Math.abs(mx-cx)>.05||Math.abs(my-cy)>.05))frame=requestAnimationFrame(draw);
  else {frame=0;last=0;}
 }
 addEventListener('pointermove',e=>{
  if(e.pointerType!=='mouse'||!enabled.matches){hide();return;}
  mx=e.clientX+18;my=e.clientY+18;
  if(!visible){
   cx=mx;cy=my;visible=true;
   cross.style.transform='translate3d('+(cx-7)+'px,'+(cy-7)+'px,0)';
   cross.classList.add('is-visible');
  }
  if(!frame)frame=requestAnimationFrame(draw);
 },{passive:true});
 document.documentElement.addEventListener('pointerleave',hide);
 addEventListener('blur',hide);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});
 enabled.addEventListener('change',hide);
})();
