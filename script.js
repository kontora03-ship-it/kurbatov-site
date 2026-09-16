const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

const projects={
  rock:{title:'Rock Lives in Us',category:'CALENDAR / PERSONAL PROJECT',descRu:'Минималистичный двухсторонний календарь о культовых музыкальных группах. В основе — чёрно-белая фотография, типографика и эстетика аналоговой музыкальной культуры.',descEn:'A minimalist double-sided calendar about iconic music bands, built around black-and-white photography, typography and analogue-era aesthetics.',images:['rock-1.webp','rock-2.webp']},
  tatprom:{title:'ТатПром Холдинг',category:'CORPORATE CALENDAR',descRu:'Календарь об истории нефтяной геологии и людях отрасли. Архивная эстетика соединена с современной графической системой и крупными иллюстративными образами.',descEn:'A corporate calendar about petroleum geology and the people behind the industry, combining archival aesthetics with a contemporary graphic system.',images:['tatprom-1.webp','tatprom-2.webp']},
  transneft:{title:'Транснефть — 9 Мая',category:'PRINT / CORPORATE',descRu:'Серия поздравительных материалов ко Дню Победы. Архивные фотографии и исторические мотивы собраны в современной композиции без избыточной декоративности.',descEn:'A Victory Day print series combining archival photography and historical references in a restrained contemporary composition.',images:['transneft-1.webp','transneft-2.webp','transneft-3.webp','transneft-4.webp']},
  garuss:{title:'GARUSS',category:'MERCH / IDENTITY',descRu:'Фирменный мерч на основе типографики, знака R и ограниченной палитры. Графика адаптирована под печать, вышивку и разные носители.',descEn:'A merch system built around typography, the R mark and a restrained palette, adapted for print, embroidery and multiple applications.',images:['garuss-1.webp']},
  woex:{title:'WOEX',category:'PACKAGING / PRODUCT DESIGN',descRu:'Модульная система упаковки для нескольких категорий бытовой техники. Единый визуальный язык сохраняет узнаваемость бренда и разделяет продуктовые линейки.',descEn:'A modular packaging system for several appliance categories, keeping one clear brand language while separating product lines.',images:['woex-1.webp','woex-2.webp']},
  transingstroy:{title:'Трансинжстрой',category:'CALENDAR / PRINT',descRu:'Корпоративный календарь с архитектурно-инженерной пластикой и туннельной темой. Объёмное фольгирование поддерживает ощущение света, глубины и материала.',descEn:'A corporate calendar built around engineering geometry and tunnel imagery, with dimensional foil details reinforcing light, depth and materiality.',images:['transingstroy-1.webp']},
  aviation:{title:'80 лет авиационному заводу',category:'ANNIVERSARY BOOK',descRu:'Юбилейное издание об истории завода. Обложка, архивные материалы, фотохроника и длинная редакционная структура собраны в единую систему.',descEn:'An anniversary publication about the plant’s history, combining cover design, archives, photography and long-form editorial structure.',images:['aviation-1.webp','aviation-2.webp']},
  buryatia:{title:'Изобразительное искусство',category:'ART BOOK',descRu:'Художественный альбом с большим количеством произведений и биографических материалов. Верстка построена вокруг крупных репродукций и спокойной типографики.',descEn:'An art book built around large reproductions, artist biographies and a restrained typographic system.',images:['buryatia-1.webp','buryatia-2.webp']}
};
const order=['rock','tatprom','transneft','garuss','woex','transingstroy','aviation','buryatia'];
const spriteClass={rock:'sprite-rock',tatprom:'sprite-tatprom',transneft:'sprite-transneft',garuss:'sprite-garuss',woex:'sprite-woex',transingstroy:'sprite-transingstroy',aviation:'sprite-aviation',buryatia:'sprite-buryatia'};

let lang='ru',currentProject='rock';

const translations={
  ru:{navWorks:'РАБОТЫ',navAbout:'ОБО МНЕ',navContact:'КОНТАКТ',heroSub:'Графический дизайн для реального мира.',heroNote:'Брендинг, упаковка, полиграфия, editorial, презентации и специальные проекты — от идеи до производства.',viewWorks:'СМОТРЕТЬ РАБОТЫ',rockText:projects.rock.descRu,tatpromText:projects.tatprom.descRu,transneftText:projects.transneft.descRu,garussText:projects.garuss.descRu,woexText:projects.woex.descRu,transingstroyText:projects.transingstroy.descRu,editorialIntro:'Книги и альбомы — отдельное направление моей работы. Здесь важны ритм, типографика, структура материала и уважение к изображению.',aviationText:projects.aviation.descRu,buryatiaText:projects.buryatia.descRu,aboutTitle:'ЛЕТ<br>В ДИЗАЙНЕ',aboutText:'Я Александр Курбатов — графический дизайнер и арт-директор. Работаю с брендингом, полиграфией, упаковкой, презентациями, мерчем и корпоративными проектами — от идеи до готового продукта.',processText:'От идеи и визуальной системы — до реального носителя и производства.',contactTitle:'ЕСТЬ ЗАДАЧА?<br><em>ДАВАЙТЕ ОБСУДИМ.</em>',contactText:'Открыт к проектной работе, арт-дирекшну и сотрудничеству.',nextProject:'СЛЕДУЮЩИЙ ПРОЕКТ'},
  en:{navWorks:'WORKS',navAbout:'ABOUT',navContact:'CONTACT',heroSub:'Graphic design for the real world.',heroNote:'Branding, packaging, print, editorial, presentations and special projects — from concept to production.',viewWorks:'VIEW WORK',rockText:projects.rock.descEn,tatpromText:projects.tatprom.descEn,transneftText:projects.transneft.descEn,garussText:projects.garuss.descEn,woexText:projects.woex.descEn,transingstroyText:projects.transingstroy.descEn,editorialIntro:'Books and art publications are a separate part of my practice, where rhythm, typography, structure and respect for imagery matter most.',aviationText:projects.aviation.descEn,buryatiaText:projects.buryatia.descEn,aboutTitle:'YEARS<br>IN DESIGN',aboutText:'I’m Alexandr Kurbatov — a graphic designer and art director working across branding, print, packaging, presentations, merch and corporate projects, from idea to production.',processText:'From idea and visual system to a real object and production.',contactTitle:'HAVE A PROJECT?<br><em>LET’S TALK.</em>',contactText:'Available for project work, art direction and collaboration.',nextProject:'NEXT PROJECT'}
};
function setLanguage(next){
  lang=next;document.documentElement.lang=next;
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.toggle('is-active',b.dataset.lang===next));
  document.querySelectorAll('[data-i18n]').forEach(el=>{const k=el.dataset.i18n;if(translations[next][k])el.textContent=translations[next][k]});
  document.querySelectorAll('[data-i18n-html]').forEach(el=>{const k=el.dataset.i18nHtml;if(translations[next][k])el.innerHTML=translations[next][k]});
  if(document.getElementById('projectDialog').open)fillDialog(currentProject);
}
document.querySelectorAll('.lang-btn').forEach(b=>b.addEventListener('click',()=>setLanguage(b.dataset.lang)));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');revealObserver.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -5%'});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const wipe=document.querySelector('.page-wipe');let lastTheme='light',wipeLock=false,wipeCount=0;
function playWipe(nextTheme){
  if(nextTheme===lastTheme||wipeLock||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  wipeLock=true;wipeCount++;
  const dark=nextTheme==='dark';
  wipe.style.setProperty('--wipe-bg',dark?'#151615':'#f4f3ef');
  wipe.style.setProperty('--wipe-grid',dark?'#f4f3ef':'#111');
  wipe.style.setProperty('--wipe-edge',dark?'#f4f3ef':'#111');
  wipe.classList.toggle('from-right',wipeCount%2===0);
  wipe.classList.remove('is-running');void wipe.offsetWidth;wipe.classList.add('is-running');
  lastTheme=nextTheme;
  setTimeout(()=>{wipe.classList.remove('is-running');wipeLock=false},710);
}
const themeObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(visible)playWipe(visible.target.dataset.theme);
},{threshold:.02,rootMargin:'-43% 0px -51% 0px'});
document.querySelectorAll('.theme-section').forEach(s=>themeObserver.observe(s));

const medias=[...document.querySelectorAll('.project-media')];
const hero=document.querySelector('.hero'),heroVisual=document.querySelector('.hero-visual'),process=document.querySelector('.process-section');
let ticking=false;
function updateMotion(){
  ticking=false;const vh=innerHeight;
  medias.forEach(m=>{const r=m.getBoundingClientRect(),center=r.top+r.height/2,d=Math.min(1,Math.abs(center-vh/2)/(vh*.95));m.style.transform=`scale(${(1-d*.012).toFixed(4)})`});
  if(heroVisual&&innerWidth>700){
    const r=hero.getBoundingClientRect(),p=clamp(-r.top/Math.max(1,r.height-innerHeight));
    heroVisual.style.transform=`translate3d(0,${(p*12).toFixed(1)}px,0)`;
    const a=heroVisual.querySelector('.plate-a'),b=heroVisual.querySelector('.plate-b'),la=heroVisual.querySelector('.hero-line-a'),lb=heroVisual.querySelector('.hero-line-b');
    if(a)a.style.transform=`translate3d(0,${(p*-10).toFixed(1)}px,0)`;
    if(b)b.style.transform=`translate3d(0,${(p*8).toFixed(1)}px,0)`;
    if(la)la.style.transform=`translateY(${(p*18).toFixed(1)}px)`;
    if(lb)lb.style.transform=`translateX(${(-p*15).toFixed(1)}px)`;
  }
  if(process){
    const r=process.getBoundingClientRect(),p=clamp((vh-r.top)/(vh+r.height*.35));process.style.setProperty('--process',p.toFixed(3));
  }
}
function requestMotion(){if(!ticking){ticking=true;requestAnimationFrame(updateMotion)}}
addEventListener('scroll',requestMotion,{passive:true});addEventListener('resize',requestMotion);requestMotion();

function mobileFocus(){
  if(matchMedia('(hover:hover)').matches)return;
  let best=null,bestDist=Infinity;
  medias.forEach(m=>{const r=m.getBoundingClientRect(),c=r.top+r.height/2,d=Math.abs(c-innerHeight/2);if(d<bestDist){bestDist=d;best=m}});
  medias.forEach(m=>m.classList.toggle('in-focus',m===best&&bestDist<innerHeight*.48));
}
addEventListener('scroll',()=>requestAnimationFrame(mobileFocus),{passive:true});mobileFocus();

const dialog=document.getElementById('projectDialog'),dTitle=document.getElementById('dialogTitle'),dCat=document.getElementById('dialogCategory'),dDesc=document.getElementById('dialogDescription'),dGallery=document.getElementById('dialogGallery');
function fillDialog(id){
  currentProject=id;const p=projects[id];if(!p)return;
  dTitle.textContent=p.title;dCat.textContent=p.category;dDesc.textContent=lang==='ru'?p.descRu:p.descEn;
  dGallery.innerHTML=`<div class="dialog-cover"><span class="sprite ${spriteClass[id]}" role="img" aria-label="${p.title}"></span></div>`;
}
function openProject(id){fillDialog(id);dialog.showModal();document.body.style.overflow='hidden'}
function closeDialog(){dialog.close();document.body.style.overflow=''}
document.querySelectorAll('[data-project]').forEach(block=>{
  const id=block.dataset.project,media=block.matches('.project-media')?block:block.querySelector('.project-media');if(!media)return;
  media.addEventListener('click',()=>openProject(id));media.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openProject(id)}});
});
document.querySelector('.dialog-close').addEventListener('click',closeDialog);
dialog.addEventListener('cancel',e=>{e.preventDefault();closeDialog()});
dialog.addEventListener('click',e=>{if(e.target===dialog)closeDialog()});
document.querySelector('.dialog-next').addEventListener('click',()=>{const idx=order.indexOf(currentProject);fillDialog(order[(idx+1)%order.length]);dialog.scrollTo({top:0,behavior:'smooth'})});