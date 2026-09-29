(()=>{
 const images=[...document.querySelectorAll('main figure img')];
 const dialog=document.createElement('dialog');dialog.className='case-lightbox';dialog.setAttribute('aria-label','Просмотр изображения');
 const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Закрыть изображение');
 const full=document.createElement('img');const caption=document.createElement('p');
 dialog.append(close,full,caption);document.body.append(dialog);
 let previousOverflow='',opener=null;
 const dismiss=()=>dialog.close();
 close.addEventListener('click',dismiss);
 dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss();});
 full.addEventListener('click',()=>dialog.classList.toggle('is-zoomed'));
 dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;dialog.classList.remove('is-zoomed');opener?.focus({preventScroll:true});});
 for(const img of images){
  const button=document.createElement('button');button.className='case-zoom-trigger';button.type='button';button.setAttribute('aria-label','Увеличить: '+img.alt);
  img.before(button);button.append(img);
  button.addEventListener('click',()=>{opener=button;full.src=img.currentSrc||img.src;full.alt=img.alt;caption.textContent=img.alt;previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();});
 }
 if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}},{threshold:.02});
  document.querySelectorAll('main figure,.case-copy,.case-intro,.next-project').forEach(el=>{el.classList.add('case-enter');observer.observe(el);});
 }
})();