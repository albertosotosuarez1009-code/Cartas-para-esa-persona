// ===== TUS POEMAS =====
const CARTAS = [
  {
    titulo: "MÁS ALLÁ DE LO SUPERFICIAL",
    mensaje: `Más allá de enamorarme de lo subjetivo y lo superficial, me enamoré de todo aquello que te hace ser el ser perfecto ante mis ojos.

Tu presencia hace que mi corazón se acelere cada que te veo; cada que te abrazo, mis brazos no quieren soltarte, mi mente solo me dice que no te deje ir y, dentro de mi mente, solo existes tú, aquella persona con la que amaría escribir parte de mi vida.

Solo tú sabes cómo ponerme nervioso y haces acelerar mi corazón, porque solo tú estás al centro de todos, porque, para mí, eres la única que brilla con tal intensidad que me hace imposible dejar de admirarte.`,
    firma: "— Con cariño ♡"
  },
  {
    titulo: "IMPREGNADA EN MIS PENSAMIENTOS",
    mensaje: `Sin pensarlo, has quedado impregnada en mis pensamientos. Tu sonrisa es aquello que más anhelo ver; esa risa que escucho me hace suspirar porque, sin darte cuenta, me cautivaste.

Tú, que con tu llegada diste color y calma a mi vida. Tú, que con pocas palabras me hiciste encontrar esa paz que hacía tanto tiempo no sentía. Te has vuelto tan importante para mí, porque tu llegada fue inesperada y, sin duda, la mejor.

Y si he de confesarte mi amor, que sea con este verso, dejando en claro que, más allá de lo físico, yo me enamoré de ti.`,
    firma: "— Para ti ♥"
  },
  {
    titulo: "ME HE ENAMORADO DE TI",
    mensaje: `Me he enamorado de la mujer que, ante mis ojos, es la perfección; de esa sonrisa que me hace suspirar, de esa voz que me pone nervioso y de esa pequeña mujer que, día tras día, acelera los latidos de mi corazón.

Me he enamorado de esa mujer que, sin darse cuenta, me tiene cautivado y fascinado; de aquella que, aunque le dedicara miles de versos, jamás dejaría de parecerme perfecta y hermosa ante mis ojos.

Esa mujer que cautivó mis pensamientos y conquistó mi forma de amar. A ti, mujer de mis versos, te amo y te anhelo mucho más de lo que mis palabras podrían expresar.`,
    firma: "— Guarda este mensaje"
  },
  {
    titulo: "EN MI MENTE SOLO EXISTES TÚ",
    mensaje: `En mi mente solo existes tú; tú, la persona que me ha hecho comprender que la vida, más allá del dolor, también es felicidad. Tú, que, sin importar las adversidades, siempre encuentras la manera de hacerme sonreír. Tú, que me has enseñado a seguir adelante sin permanecer atado al pasado.

Tú, de quien me enamoré porque, más allá de los defectos que tú misma puedes ver en ti, yo encuentro una perfección que quizá ni siquiera alcanzas a reconocer. Tú, que me enamoraste con cada parte de tu ser, con todo aquello que te hace ser quien eres.

Te amaré sin importar cuántos cambios experimentes, porque, ante mis ojos, siempre serás aquella mujer que me enamoró; esa persona que transformó mi manera de ver la vida y que, sin proponérselo, encontró un lugar en mi corazón.`,
    firma: "— De corazón"
  },
  {
    titulo: "SI CADA FLOR FUERA UN VERSO",
    mensaje: `Si cada flor fuera un verso inspirado en ti, tendrías un campo entero de flores, porque tú haces brotar versos de mi alma. Tú traes calma a mi mente y haces que cada rincón de mis pensamientos encuentre una razón para escribirte miles de versos.

Porque tú eres el centro de mi inspiración, eres parte de todo aquello que me hace sonreír y la razón por la que, entre tantas palabras, siempre termino escribiendo sobre ti.

Aunque quizá solo conozcas una parte de mí, en lo más profundo de mi ser eres el centro de mi universo. Y si he de demostrarte todo lo que significas para mí, deseo hacerlo con miles de versos, pero no solo con palabras, sino también con pequeñas acciones y detalles que te permitan sentir todo el amor que llevo dentro y que siento por ti.`,
    firma: "— Fin… por ahora ♡"
  }
];
// =================================

const $=id=>document.getElementById(id);
const arena=$("arena"), layer=$("targetLayer"), svg=$("aimLine"), bow=$("bow"), fx=$("fx");
let targets=[],selected=null,aiming=false,opened=0,locked=false,particles=[],raf=0;
const positions=[[.18,.20],[.49,.18],[.80,.23],[.25,.57],[.60,.48],[.82,.66]];

function arenaPoint(e){const r=arena.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function bowPoint(){const r=arena.getBoundingClientRect();return{x:57,y:r.height-73}}

function drawAim(to){
  const b=bowPoint();
  svg.setAttribute("viewBox",`0 0 ${arena.clientWidth} ${arena.clientHeight}`);
  svg.innerHTML="";
  if(!to)return;
  const dx=to.x-b.x,dy=to.y-b.y,len=Math.hypot(dx,dy)||1;
  const x2=b.x+dx/len*Math.min(len,75),y2=b.y+dy/len*Math.min(len,75);
  svg.innerHTML=`<line x1="${b.x}" y1="${b.y}" x2="${to.x}" y2="${to.y}" stroke="#8ef4ff" stroke-width="2" stroke-dasharray="5 7" opacity=".9"/><line x1="${b.x}" y1="${b.y}" x2="${x2}" y2="${y2}" stroke="#ffe58b" stroke-width="4"/><polygon points="${to.x},${to.y} ${to.x-8},${to.y-3} ${to.x-3},${to.y-9}" fill="#ffe58b"/>`;
}

function renderTargets(){
  layer.innerHTML="";
  targets.forEach(t=>{
    if(t.hit)return;
    const el=document.createElement("button");
    el.className="card-target";
    el.style.left=(t.x*100)+"%";el.style.top=(t.y*100)+"%";
    el.setAttribute("aria-label",`Apuntar a la carta ${t.index+1}`);
    el.innerHTML=`<span class="heart">♥</span><span class="num">${String(t.index+1).padStart(2,"0")}</span>`;
    el.addEventListener("click",()=>{
      if(locked)return;
      selected=t;
      drawAim({x:t.x*arena.clientWidth,y:t.y*arena.clientHeight});
      $("fire").disabled=false;
      $("aimNote").innerHTML="<strong>OBJETIVO FIJADO:</strong> pulsa DISPARAR para lanzar la flecha.";
    });
    layer.appendChild(el);t.el=el;
  });
  update();
}

function update(){
  $("count").textContent=`CARTAS: ${opened} / ${CARTAS.length}`;
  const left=targets.filter(t=>!t.hit).length;
  $("remaining").textContent=`${left} carta${left===1?"":"s"} oculta${left===1?"":"s"}`;
  const arrows=Math.max(0,CARTAS.length-opened);
  const a=$("arrowsStat"); if(a)a.textContent=`FLECHAS: ${arrows}`;
  $("fire").disabled=locked||!selected||left===0;
  if(left===0&&opened===CARTAS.length&&!locked)finish();
}

function init(){
  cancelAnimationFrame(raf);
  $("overlay").classList.remove("show");
  $("finale").classList.remove("show");
  opened=0;selected=null;locked=false;particles=[];
  fx.innerHTML="";
  targets=CARTAS.map((c,i)=>({index:i,x:positions[i%positions.length][0],y:positions[i%positions.length][1],hit:false,el:null}));
  targets.forEach((t,i)=>{
    if(i>=positions.length){
      const cols=Math.max(3,Math.ceil(Math.sqrt(CARTAS.length)));
      t.x=.1+(i%cols)*(.8/(cols-1));
      t.y=.18+Math.floor(i/cols)*.24;
    }
  });
  drawAim(null);
  $("aimNote").innerHTML="<strong>CONTROLES:</strong> toca una carta para apuntar o arrastra desde el arco. Suelta para disparar.";
  $("help").textContent="Toca una carta para fijar el objetivo y pulsa DISPARAR; o arrastra desde el arco hacia una carta y suelta.";
  renderTargets();
}

/* Estela de la flecha */
function spawnTrailDot(x,y){
  const c=document.createElementNS("http://www.w3.org/2000/svg","circle");
  c.setAttribute("cx",x);c.setAttribute("cy",y);c.setAttribute("r","3");
  c.setAttribute("fill","#8ef4ff");
  c.setAttribute("class","trail");
  svg.appendChild(c);
  setTimeout(()=>c.remove(),480);
}

/* Explosión al impactar */
function burst(x,y){
  for(let i=0;i<18;i++){
    const s=document.createElement("span");
    s.className="spark";
    const a=Math.random()*Math.PI*2, d=26+Math.random()*50;
    s.style.left=x+"px";s.style.top=y+"px";
    s.style.setProperty("--dx",(Math.cos(a)*d).toFixed(1)+"px");
    s.style.setProperty("--dy",(Math.sin(a)*d).toFixed(1)+"px");
    s.style.background=i%3===0?"#8ef4ff":i%2===0?"#ffe58b":"#ff7eb6";
    fx.appendChild(s);
    setTimeout(()=>s.remove(),650);
  }
  arena.classList.remove("shake");
  void arena.offsetWidth;
  arena.classList.add("shake");
  setTimeout(()=>arena.classList.remove("shake"),320);
}

function fire(){
  if(locked||!selected||selected.hit)return;
  locked=true;$("fire").disabled=true;
  const t=selected;
  const b=bowPoint();
  const to={x:t.x*arena.clientWidth,y:t.y*arena.clientHeight};
  const dx=to.x-b.x,dy=to.y-b.y,len=Math.hypot(dx,dy)||1;
  const angle=Math.atan2(dy,dx)*180/Math.PI;

  const arrow=document.createElementNS("http://www.w3.org/2000/svg","g");
  arrow.innerHTML=`<line x1="-18" y1="0" x2="17" y2="0" stroke="#ffe58b" stroke-width="4"/><polygon points="18,0 8,-5 8,5" fill="#ff7eb6"/><path d="M-17 0 l-7 -6 l2 6 l-2 6z" fill="#8ef4ff"/>`;
  arrow.setAttribute("transform",`translate(${b.x} ${b.y}) rotate(${angle})`);
  svg.appendChild(arrow);

  const start=performance.now(), duration=Math.min(700,Math.max(280,len*1.15));
  let lastTrail=0;
  function fly(now){
    const p=Math.min(1,(now-start)/duration);
    const ease=1-Math.pow(1-p,3);
    const x=b.x+dx*ease, y=b.y+dy*ease;
    arrow.setAttribute("transform",`translate(${x} ${y}) rotate(${angle})`);
    if(now-lastTrail>22){lastTrail=now;spawnTrailDot(x,y);}
    if(p<1){raf=requestAnimationFrame(fly);return}
    arrow.remove();
    burst(to.x,to.y);
    t.hit=true;
    if(t.el)t.el.classList.add("hit");
    opened++;selected=null;drawAim(null);
    $("aimNote").innerHTML="<strong>¡ACIERTO!</strong> Se ha descubierto una carta.";
    renderTargets();
    showLetter(t.index);
  }
  raf=requestAnimationFrame(fly);
}

function showLetter(i){
  const c=CARTAS[i];
  $("letterNum").textContent=`CARTA ${i+1} / ${CARTAS.length}`;
  $("letterTitle").textContent=c.titulo;
  $("letterBody").textContent=c.mensaje;
  $("letterSign").textContent=c.firma;
  $("overlay").classList.add("show");
  // reinicia el scroll de la carta al abrir
  const letter=$("overlay").querySelector(".letter");
  if(letter)letter.scrollTop=0;
  $("closeLetter").focus();
}

function closeLetter(){
  $("overlay").classList.remove("show");
  locked=false;
  const left=targets.filter(t=>!t.hit).length;
  if(left){
    $("aimNote").innerHTML="<strong>SIGUIENTE:</strong> elige otra carta y dispara.";
    update();
  } else finish();
}

/* Pantalla final emergente */
function finish(){
  $("overlay").classList.remove("show");
  $("finale").classList.add("show");
  $("aimNote").innerHTML="<strong>¡COMPLETADO!</strong> Has descubierto todas las cartas.";
  $("help").textContent="¡Lo conseguiste! Las partículas forman un corazón como recompensa final.";
  startHeart();
}

function startHeart(){
  const canvas=$("heartCanvas"),ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;
  particles=[];
  for(let i=0;i<190;i++){
    const t=Math.random()*Math.PI*2;
    const x=16*Math.pow(Math.sin(t),3);
    const y=13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t);
    particles.push({x:w/2+x*12,y:h/2-y*10,ox:Math.random()*w,oy:Math.random()*h,r:2+Math.random()*3,phase:Math.random()*6.28,speed:.8+Math.random()*1.8});
  }
  const start=performance.now();
  function frame(now){
    if(!$("finale").classList.contains("show"))return;
    const elapsed=(now-start)/1000;ctx.clearRect(0,0,w,h);
    particles.forEach((p,i)=>{
      const mix=Math.min(1,elapsed/1.8);
      const x=p.ox+(p.x-p.ox)*mix+Math.sin(elapsed*p.speed+p.phase)*2;
      const y=p.oy+(p.y-p.oy)*mix+Math.cos(elapsed*p.speed+p.phase)*2;
      ctx.fillStyle=i%3===0?"#8ef4ff":i%2===0?"#ffe58b":"#ff7eb6";
      ctx.fillRect(Math.round(x),Math.round(y),p.r*2,p.r*2);
    });
    raf=requestAnimationFrame(frame);
  }
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(frame);
}

function pointerDown(e){
  if(locked)return;
  const p=arenaPoint(e),b=bowPoint();
  if(Math.hypot(p.x-b.x,p.y-b.y)<100){aiming=true;try{bow.setPointerCapture(e.pointerId)}catch(_){};drawAim(p);e.preventDefault();}
}
function pointerMove(e){if(!aiming)return;const p=arenaPoint(e);drawAim(p);const t=nearest(p);if(t){selected=t;$("fire").disabled=false;}}
function pointerUp(e){
  if(!aiming)return;aiming=false;
  const p=arenaPoint(e),t=nearest(p);
  if(t){selected=t;drawAim({x:t.x*arena.clientWidth,y:t.y*arena.clientHeight});$("aimNote").innerHTML="<strong>OBJETIVO FIJADO:</strong> pulsa DISPARAR o vuelve a arrastrar para apuntar.";$("fire").disabled=false;}
  else drawAim(null);
}
function nearest(p){
  let best=null,dist=Infinity;
  targets.filter(t=>!t.hit).forEach(t=>{const x=t.x*arena.clientWidth,y=t.y*arena.clientHeight,d=Math.hypot(p.x-x,p.y-y);if(d<dist){dist=d;best=t}});
  return dist<Math.max(70,arena.clientWidth*.12)?best:null;
}

arena.addEventListener("pointerdown",pointerDown);
arena.addEventListener("pointermove",pointerMove);
arena.addEventListener("pointerup",pointerUp);
arena.addEventListener("pointercancel",()=>{aiming=false;drawAim(null)});
$("fire").addEventListener("click",fire);
$("reset").addEventListener("click",init);
$("playAgain").addEventListener("click",init);
$("closeLetter").addEventListener("click",closeLetter);
$("xClose").addEventListener("click",closeLetter);
$("overlay").addEventListener("click",e=>{if(e.target===$("overlay"))closeLetter()});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&$("overlay").classList.contains("show"))closeLetter();
  if(e.key==="Enter"&&!$("fire").disabled&&!$("overlay").classList.contains("show"))fire();
});
window.addEventListener("resize",()=>{
  if(selected)drawAim({x:selected.x*arena.clientWidth,y:selected.y*arena.clientHeight});
});

init();