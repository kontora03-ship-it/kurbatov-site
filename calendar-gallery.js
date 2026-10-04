(()=>{const root=document.querySelector('.rock-carousel');if(!root)return;
const track=root.querySelector('.rock-carousel-track'),cards=[...root.querySelectorAll('.calendar-open')],steps=[...root.querySelectorAll('[data-step]')],reduced=matchMedia('(prefers-reduced-motion:reduce)');
let current=0,opener=null,oldOverflow='';
function update(){steps[0].disabled=track.scrollLeft<=2;steps[1].disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2}
steps.forEach(b=>b.addEventListener('click',()=>{const stride=track.querySelector('.calendar-card').getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);track.scrollBy({left:Number(b.dataset.step)*stride*Math.max(1,Math.floor((track.clientWidth+parseFloat(getComputedStyle(track).gap)+1)/stride)),behavior:reduced.matches?'instant':'smooth'})}));
track.addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
const dialog=document.createElement('dialog');dialog.className='calendar-viewer';dialog.setAttribute('aria-label','Просмотр календаря');
dialog.innerHTML='<button class="calendar-close" type="button" aria-label="Закрыть календарь">×</button><img alt=""><footer><button type="button" data-nav="-1" aria-label="Предыдущий месяц">←</button><p aria-live="polite"></p><button type="button" data-nav="1" aria-label="Следующий месяц">→</button></footer>';document.body.append(dialog);
function render(){const original=cards[current].querySelector('img');dialog.querySelector('img').src=original.src;dialog.querySelector('img').alt=original.alt;dialog.querySelector('p').textContent=(current+1)+' / '+cards.length+' · '+original.alt}
function move(delta){current=(current+delta+cards.length)%cards.length;render()}
cards.forEach((b,i)=>b.addEventListener('click',()=>{current=i;opener=b;render();oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal()}));
dialog.querySelector('.calendar-close').addEventListener('click',()=>dialog.close());
dialog.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>move(Number(b.dataset.nav))));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{document.documentElement.style.overflow=oldOverflow;opener?.focus({preventScroll:true})});
})();