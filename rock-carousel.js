(()=>{const root=document.querySelector('.rock-carousel');if(!root)return;
const months=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],bands=["The Beatles","The Rolling Stones","The Who","The Doors","Pink Floyd","Led Zeppelin","Deep Purple","Nazareth","Uriah Heep","Queen","AC/DC","Guns N’ Roses"];let theme='white',current=0,opener=null,oldOverflow='';
const track=root.querySelector('.rock-carousel-track'),steps=[...root.querySelectorAll('[data-step]')],toggles=[...root.querySelectorAll('[data-theme]')],cards=[...root.querySelectorAll('.calendar-open')],reduced=matchMedia('(prefers-reduced-motion:reduce)');
const src=i=>'../assets/rock-case/remaining/sheet-'+String(3+i*2+(theme==='black'?1:0)).padStart(2,'0')+'.webp';
const label=i=>months[i]+' — '+bands[i]+', '+(theme==='black'?'чёрная':'белая')+' версия';
function update(){steps[0].disabled=track.scrollLeft<=2;steps[1].disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2}
toggles.forEach(b=>b.addEventListener('click',()=>{theme=b.dataset.theme;toggles.forEach(t=>t.setAttribute('aria-pressed',String(t===b)));cards.forEach((c,i)=>{const im=c.querySelector('img');im.src=src(i);im.alt=label(i)});}));
steps.forEach(b=>b.addEventListener('click',()=>{const stride=track.querySelector('.calendar-card').getBoundingClientRect().width+parseFloat(getComputedStyle(track).gap);track.scrollBy({left:Number(b.dataset.step)*stride*Math.max(1,Math.floor((track.clientWidth+1)/stride)),behavior:reduced.matches?'instant':'smooth'});}));
track.addEventListener('scroll',update,{passive:true});addEventListener('resize',update,{passive:true});update();
const dialog=document.createElement('dialog');dialog.className='calendar-viewer';dialog.setAttribute('aria-label','Просмотр календаря');
dialog.innerHTML='<button class="calendar-close" type="button" aria-label="Закрыть календарь">×</button><img alt=""><footer><button type="button" data-nav="-1" aria-label="Предыдущий месяц">←</button><p aria-live="polite"></p><button type="button" data-nav="1" aria-label="Следующий месяц">→</button></footer>';
document.body.append(dialog);
function render(){dialog.querySelector('img').src=src(current);dialog.querySelector('img').alt=label(current);dialog.querySelector('p').textContent=(current+1)+' / 12 · '+label(current);}
function move(delta){current=(current+delta+12)%12;render()}
cards.forEach((b,i)=>b.addEventListener('click',()=>{current=i;opener=b;render();oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal()}));
dialog.querySelector('.calendar-close').addEventListener('click',()=>dialog.close());
dialog.querySelectorAll('[data-nav]').forEach(b=>b.addEventListener('click',()=>move(Number(b.dataset.nav))));
dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1)}});
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{document.documentElement.style.overflow=oldOverflow;opener?.focus({preventScroll:true})});
})();