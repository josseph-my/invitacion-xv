/* Lógica: puerta, reloj, cuenta regresiva, música, scroll y confirmación. Requiere config.js antes. */
const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
document.documentElement.classList.add('js');scrollTo(0,0);
$$('[data-nm]').forEach(e=>e.textContent=C.name);
$('#vn').textContent=C.venue;$('#ad').textContent=C.address;$('#mp').href=C.maps;
$('#sg').textContent=C.songTitle;$('#sa').textContent=C.songArtist;$('#rb').textContent=C.rsvpBy;
if(C.photo){const p=$('.pi');p.style.backgroundImage=`url("${C.photo}")`;p.classList.add('has')}
/* Fondo: naipes flotantes */
['♠','♥','♦','♣','♠','♥','♦','♣'].forEach((g,i)=>{const e=document.createElement('i');e.textContent=g;
 e.style.cssText=`left:${(i*37+8)%92}%;top:${(i*53+6)%88}%;--r:${(i*47)%60-30}deg;animation-duration:${18+i%4*4}s;animation-delay:${-i*3}s`;$('.fl').append(e)});
/* Reloj: ticks y números */
const RM=['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'];let s='';
for(let i=0;i<60;i++){const M=i%5==0;s+=`<line y1="-86" y2="${M?-78:-82}" stroke="#2a0f10" stroke-width="${M?2:.8}" transform="rotate(${i*6})"/>`}
RM.forEach((n,i)=>{const a=i*Math.PI/6;s+=`<text x="${(65*Math.sin(a)).toFixed(1)}" y="${(-65*Math.cos(a)).toFixed(1)}" text-anchor="middle" dominant-baseline="central">${n}</text>`});
$('#tk').innerHTML=s;
const [h,m]=C.time.split(':').map(Number);
$('#hh').setAttribute('transform',`rotate(${(h%12+m/60)*30})`);$('#mh').setAttribute('transform',`rotate(${m*6})`);
/* Fecha y cuenta regresiva */
const [y,mo,dd]=C.date.split('-').map(Number),u=new Date(Date.UTC(y,mo-1,dd)),f=o=>u.toLocaleDateString('es',{...o,timeZone:'UTC'});
$('#dt').textContent=`${f({weekday:'long'})} ${dd} de ${f({month:'long'})}, ${y}`;
$('#tm').textContent=`${(h%12)||12}:${String(m).padStart(2,'0')} ${h<12?'a.m.':'p.m.'}`;
const T=new Date(`${C.date}T${C.time}:00${C.tz}`),cb=$$('.cb b');
function tick(){const n=new Date(),d=Math.max(0,T-n),v=[Math.floor(d/864e5),Math.floor(d/36e5)%24,Math.floor(d/6e4)%60,Math.floor(d/1e3)%60];
 cb.forEach((e,i)=>e.textContent=String(v[i]).padStart(2,'0'));$('#sec').setAttribute('transform',`rotate(${n.getSeconds()*6})`)}
tick();setInterval(tick,500);
/* Música */
const au=C.song?Object.assign(new Audio(C.song),{loop:true}):null,pl=$('#pl');let on=false;
function setP(v){on=v;$('.dw').classList.toggle('spin',v);pl.classList.toggle('on',v);pl.setAttribute('aria-label',v?'Pausar canción':'Reproducir canción')}
pl.onclick=()=>{if(au){on?au.pause():au.play().catch(()=>{})}setP(!on)};
/* Aparición al hacer scroll */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.2});
/* Puerta */
$('#go').onclick=()=>{$('#gate').classList.add('open');document.body.classList.remove('lock');
 if(au)au.play().then(()=>setP(true)).catch(()=>{});
 setTimeout(()=>$$('.rv').forEach(e=>io.observe(e)),800)};
/* Confirmación: una sola persona = un solo nombre */
const fm=$('#fm'),er=$('#er'),dn=$('#dn'),who=$('#who'),KEY='xv_rsvp',
MULTI=/(,|;|&|\/|\+|\by\b|\bfamilia\b|\bacompa|\bpareja\b|\bhij[oa]s?\b|\besposa?\b|\bnovi[oa]\b)/i;
const msg=(t,ok)=>{er.textContent=t;er.className='er'+(ok?' ok':'')};
function gracias(n,a,demo){fm.hidden=true;dn.hidden=false;
 $('#dm').textContent=`¡Gracias, ${n}! `+(a==='si'?'Tu asistencia quedó confirmada. Nos vemos en el reino.':'Lamentamos que no puedas acompañarnos; tu respuesta quedó registrada.')+(demo?' (Modo prueba: no se guardó en la hoja.)':'')}
function formulario(){dn.hidden=true;fm.hidden=false;$$('#fm .rv').forEach(e=>e.classList.add('in'));msg('')}
const inv=new URLSearchParams(location.search).get('invitado');
if(inv){who.value=inv.replace(/\s+/g,' ').trim().slice(0,80);who.readOnly=true}
try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.n)gracias(s.n,s.a)}catch(e){}
$('#ch').onclick=()=>{try{const s=JSON.parse(localStorage.getItem(KEY)||'null');if(s&&s.n&&!who.readOnly)who.value=s.n}catch(e){}formulario()};
/* Envío por JSONP: evita las restricciones CORS de Apps Script y siempre devuelve el resultado real */
function jsonp(params,ms=12000){
 return new Promise((res,rej)=>{
  const cb='_xv'+Date.now()+Math.floor(Math.random()*1e4),sc=document.createElement('script');
  const fin=()=>{clearTimeout(t);delete window[cb];sc.remove()};
  const t=setTimeout(()=>{fin();rej({error:'timeout'})},ms);
  window[cb]=d=>{fin();res(d)};
  sc.onerror=()=>{fin();rej({error:'red'})};
  sc.src=C.rsvpUrl+'?'+new URLSearchParams({...params,callback:cb});
  document.head.append(sc);
 })}
let busy=false;
$$('[data-r]').forEach(b=>b.onclick=async()=>{
 if(busy||$('#hp').value)return;
 const n=who.value.replace(/\s+/g,' ').trim(),a=b.dataset.r;
 if(n.length<3||n.split(' ').length<2||!/^[\p{L}][\p{L}\s.'’-]*$/u.test(n))return msg('Escribe tu nombre completo (nombre y apellido).');
 if(MULTI.test(n))return msg('Esta invitación es personal: escribe únicamente tu nombre.');
 busy=true;$$('[data-r]').forEach(x=>x.disabled=true);msg('Enviando… puede tardar unos segundos',1);
 try{
  if(C.rsvpUrl){
   const q={action:'rsvp',nombre:n,asistencia:a};let j;
   try{j=await jsonp(q)}catch(x){msg('Reintentando…',1);j=await jsonp(q)}
   if(!j.ok)throw j;
   try{localStorage.setItem(KEY,JSON.stringify({n,a}))}catch(e){}
   gracias(n,a)
  }else{
   await new Promise(r=>setTimeout(r,500));
   console.warn('C.rsvpUrl está vacío: modo prueba, no se guardó nada.');gracias(n,a,1)
  }
  msg('')
 }catch(e){
  msg(e&&e.error==='no_lista'?'No encontramos ese nombre en la lista. Escríbelo como aparece en tu invitación.':'No pudimos confirmar el envío. Inténtalo de nuevo; si ya había llegado, no se duplicará.')
 }
 busy=false;$$('[data-r]').forEach(x=>x.disabled=false)
});