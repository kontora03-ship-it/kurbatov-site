/* Yandex.Metrika counter 113393586 */
(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js?id=113393586','ym');
ym(113393586,'init',{ssr:true,webvisor:true,clickmap:true,ecommerce:'dataLayer',accurateTrackBounce:true,trackLinks:true});
/* /Yandex.Metrika counter */

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