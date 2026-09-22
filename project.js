document.getElementById('back').addEventListener('click',e=>{
 if(!document.referrer)return;
 const ref=new URL(document.referrer);
 if(ref.origin===location.origin&&(/\/(?:index|horizontal-v2)\.html$/.test(ref.pathname)||ref.pathname.endsWith('/'))){e.preventDefault();history.back();}
});
