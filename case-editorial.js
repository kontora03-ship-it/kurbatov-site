(()=>{
 const images=[...document.querySelectorAll('main figure img')];
 const dialog=document.createElement('dialog');dialog.className='case-lightbox';dialog.setAttribute('aria-label','Просмотр изображения');
 const close=document.createElement('button');close.type='button';close.textContent='×';close.setAttribute('aria-label','Закрыть изображение');
 const full=document.createElement('img');const caption=document.createElement('p');
 const zoom=document.createElement('button');zoom.type='button';zoom.className='zoom-toggle';zoom.textContent='+';zoom.setAttribute('aria-label','Увеличить изображение');zoom.setAttribute('aria-pressed','false');
 function toggleZoom(){const active=dialog.classList.toggle('is-zoomed');zoom.textContent=active?'−':'+';zoom.setAttribute('aria-pressed',String(active));zoom.setAttribute('aria-label',active?'Вписать изображение':'Увеличить изображение');if(!active){dialog.scrollTop=0;dialog.scrollLeft=0;}}
 zoom.addEventListener('click',toggleZoom);
 dialog.append(close,zoom,full,caption);document.body.append(dialog);
 let previousOverflow='',opener=null;
 const dismiss=()=>dialog.close();
 close.addEventListener('click',dismiss);
 dialog.addEventListener('click',e=>{if(e.target===dialog)dismiss();});
 full.addEventListener('click',toggleZoom);
 dialog.addEventListener('close',()=>{document.documentElement.style.overflow=previousOverflow;dialog.classList.remove('is-zoomed');opener?.focus({preventScroll:true});});
 for(const img of images){
  const button=document.createElement('button');button.className='case-zoom-trigger';button.type='button';button.setAttribute('aria-label','Увеличить: '+img.alt);
  const link=img.closest('a');if(link&&link.querySelectorAll('img').length===1){link.replaceWith(button);}else{img.before(button);}button.append(img);
  button.addEventListener('click',()=>{opener=button;full.src=img.currentSrc||img.src;full.alt=img.alt;caption.textContent=img.alt;previousOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';zoom.textContent='+';zoom.setAttribute('aria-pressed','false');zoom.setAttribute('aria-label','Увеличить изображение');dialog.showModal();dialog.scrollTop=0;dialog.scrollLeft=0;});
 }
 if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
  const observer=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}},{threshold:.02});
  document.querySelectorAll('main figure,.case-copy,.case-intro,.art-copy,.case-facts,.next-project').forEach(el=>{el.classList.add('case-enter');observer.observe(el);});
 }
})();