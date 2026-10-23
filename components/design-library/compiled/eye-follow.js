"use client";
/* Construct · Design library: the compiled preview of "Eyes". The source is for members. */
import{useEffect as ae,useRef as w,useState as le}from"react";import{Fragment as re,jsx as t,jsxs as a}from"react/jsx-runtime";var G=[[76,112],[124,112]],te="M100 38 C150 38 186 82 188 132 C190 170 160 188 100 188 C40 188 10 170 12 132 C14 82 50 38 100 38Z",ce=8;function fe({skin:c="#ffc23a",top:u="sprout",label:S="A little character that watches the pointer",onPress:k}){let g=w(null),b=w(null),p=w([]),m=w(null),B=w(null),[P,z]=le(!1),v=ne(c,"#000000",.12),x=ne(c,"#000000",.42);ae(()=>{let n=g.current,y=b.current;if(!n||!y)return;let f=window.matchMedia("(prefers-reduced-motion: reduce)"),h=f.matches,d=null,o=[0,2.5,0,2.5,0,1,0],l=o.slice(),C=0,L=0,F=0,oe=()=>{let e=y.getBoundingClientRect(),r=e.width/200;if(!d||!r){l.splice(0,7,0,0,0,0,0,0,0);return}G.forEach(([se,ie],j)=>{let J=d[0]-(e.left+se*r),_=d[1]-(e.top+ie*r),A=Math.hypot(J,_)||1,ee=Math.min(ce,A/(14*r));l[j*2]=J/A*ee,l[j*2+1]=_/A*ee});let i=e.left+e.width/2,$=e.top+e.height*.5,s=d[0]-i,U=d[1]-$,Q=Math.hypot(s,U)||1,X=Math.min(6,Q/(30*r));l[4]=s/Q*X,l[5]=U/Q*X*.7,l[6]=Math.max(-5,Math.min(5,s/(24*r)))},D=()=>{p.current.forEach((r,i)=>r?.setAttribute("transform",`translate(${o[i*2].toFixed(2)} ${o[i*2+1].toFixed(2)})`));let e=h?[0,0,0]:[o[4],o[5],o[6]];m.current?.setAttribute("transform",`translate(${e[0].toFixed(2)} ${e[1].toFixed(2)})`),B.current?.style.setProperty("--tilt",`${e[2].toFixed(2)}deg`)},T=performance.now(),V=e=>{let r=Math.min(.05,(e-T)/1e3);T=e;let i=1-Math.exp(-r*16),$=!1;for(let s=0;s<o.length;s++)o[s]+=(l[s]-o[s])*i,Math.abs(l[s]-o[s])>.02?$=!0:o[s]=l[s];D(),C=$?requestAnimationFrame(V):0},E=()=>{if(oe(),h){for(let e=0;e<o.length;e++)o[e]=l[e];D()}else C||(T=performance.now(),C=requestAnimationFrame(V))},N=e=>{d=[e.clientX,e.clientY],E()},Y=e=>{let r=e.target;if(r instanceof Element){if(r===n)d=null;else{let i=r.getBoundingClientRect();d=[i.left+i.width/2,i.top+i.height/2]}E()}},q=()=>d&&E(),I=()=>{n.dataset.blink="true",F=window.setTimeout(()=>{n.dataset.blink="false",Math.random()<.22&&(F=window.setTimeout(I,140))},110)},R=()=>{L=window.setTimeout(()=>{h||I(),R()},1800+Math.random()*3400)},W=!1,H=e=>{e!==W&&(W=e,e?(window.addEventListener("pointermove",N,{passive:!0}),window.addEventListener("pointerdown",N,{passive:!0}),window.addEventListener("focusin",Y),window.addEventListener("scroll",q,{passive:!0,capture:!0})):(window.removeEventListener("pointermove",N),window.removeEventListener("pointerdown",N),window.removeEventListener("focusin",Y),window.removeEventListener("scroll",q,{capture:!0})),window.clearTimeout(L),e&&R())},K=new IntersectionObserver(([e])=>H(e.isIntersecting));K.observe(n);let O=()=>{h=f.matches,E()};return f.addEventListener("change",O),()=>{H(!1),K.disconnect(),f.removeEventListener("change",O),cancelAnimationFrame(C),window.clearTimeout(L),window.clearTimeout(F)}},[]);let Z=()=>{P||(z(!0),k?.())},M=()=>z(!1);return a(re,{children:[t("style",{children:de}),t("button",{ref:g,type:"button",className:"eyf","data-press":P,"data-blink":"false","aria-label":S,"aria-pressed":P,style:{"--skin":c,"--shade":v,"--deep":x},onPointerDown:n=>{n.currentTarget.setPointerCapture(n.pointerId),Z()},onPointerUp:M,onPointerCancel:M,onKeyDown:n=>{(n.key===" "||n.key==="Enter")&&!n.repeat&&(n.preventDefault(),Z())},onKeyUp:n=>(n.key===" "||n.key==="Enter")&&M(),onBlur:M,onContextMenu:n=>n.preventDefault(),children:a("svg",{ref:b,className:"eyf-svg",viewBox:"0 0 200 210","aria-hidden":!0,children:[t("ellipse",{className:"eyf-floor",cx:"100",cy:"197",rx:"62",ry:"7"}),a("g",{ref:B,className:"eyf-body",children:[a("g",{className:"eyf-sticker",children:[u==="ears"&&a(re,{children:[t("circle",{cx:"48",cy:"64",r:"22"}),t("circle",{cx:"152",cy:"64",r:"22"})]}),u==="sprout"&&t("path",{d:"M101 40 C101 30 103 22 106 15 C112 4 130 2 138 8 C132 18 120 24 108 20 C96 10 82 11 76 16 C82 25 94 27 101 23"}),t("path",{d:te})]}),u==="ears"&&a("g",{children:[t("circle",{cx:"48",cy:"64",r:"22",fill:c}),t("circle",{cx:"152",cy:"64",r:"22",fill:c}),t("circle",{cx:"48",cy:"64",r:"11",fill:v}),t("circle",{cx:"152",cy:"64",r:"11",fill:v})]}),u==="sprout"&&a("g",{className:"eyf-sprout",children:[t("path",{d:"M101 40 C101 30 103 22 106 15",stroke:x,strokeWidth:"5",strokeLinecap:"round",fill:"none"}),t("path",{d:"M106 17 C112 4 130 2 138 8 C130 20 116 24 106 17Z",fill:x}),t("path",{d:"M103 22 C96 11 82 10 76 15 C82 25 95 27 103 22Z",fill:x})]}),t("path",{d:te,fill:c}),t("path",{d:"M24 148 C40 176 70 186 100 186 C130 186 160 176 176 148 C168 170 140 182 100 182 C60 182 32 170 24 148Z",fill:v}),t("path",{d:"M40 104 C42 84 54 64 72 54",className:"eyf-shine"}),a("g",{ref:m,children:[t("ellipse",{className:"eyf-cheek",cx:"52",cy:"140",rx:"12",ry:"7.5"}),t("ellipse",{className:"eyf-cheek",cx:"148",cy:"140",rx:"12",ry:"7.5"}),t("g",{className:"eyf-open",children:G.map(([n,y],f)=>t("g",{transform:`translate(${n} ${y})`,children:a("g",{className:"eyf-lid",children:[t("ellipse",{rx:"22",ry:"25",fill:"#fff"}),a("g",{ref:h=>void(p.current[f]=h),transform:"translate(0 2.5)",children:[t("circle",{r:"13",className:"eyf-ink"}),t("circle",{cx:"-4.5",cy:"-5",r:"4.2",fill:"#fff"}),t("circle",{cx:"4",cy:"4",r:"1.8",fill:"#fff",opacity:"0.85"})]})]})},f))}),t("g",{className:"eyf-happy",children:G.map(([n,y],f)=>t("path",{d:`M${n-15} ${y+6} Q${n} ${y-13} ${n+15} ${y+6}`,className:"eyf-line",strokeWidth:"7"},f))}),t("path",{className:"eyf-smile eyf-line",d:"M92 147 Q96 152 100 147 Q104 152 108 147",strokeWidth:"4.5"}),a("g",{className:"eyf-grin",children:[t("path",{d:"M84 143 Q100 146 116 143 Q114 168 100 168 Q86 168 84 143Z",className:"eyf-ink"}),t("path",{d:"M90 160 Q100 153 110 160 Q107 167 100 167 Q93 167 90 160Z",fill:"#ff6f7d"})]})]})]})]})})]})}function ne(c,u,S){let k=p=>/^#[0-9a-f]{6}$/i.test(p)?[1,3,5].map(m=>parseInt(p.slice(m,m+2),16)):null,g=k(c.trim()),b=k(u);return!g||!b?c:`#${g.map((p,m)=>Math.round(p+(b[m]-p)*S).toString(16).padStart(2,"0")).join("")}`}var de=`
.eyf {
  --skin: #ffc23a;
  --ink: #2a1a10;
  position: relative;
  display: block;
  width: clamp(180px, 48%, 290px);
  padding: 0;
  border: 0;
  border-radius: 40px;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}
.eyf:focus-visible { outline: 2px solid var(--deep); outline-offset: 7px; }
.eyf-svg { display: block; width: 100%; height: auto; overflow: visible; }
.eyf-sticker { fill: #fff; stroke: #fff; stroke-width: 14; stroke-linejoin: round; }
.eyf-shine { fill: none; stroke: #fff; stroke-width: 7; stroke-linecap: round; opacity: 0.55; }
.eyf-ink { fill: var(--ink); }
.eyf-line { fill: none; stroke: var(--ink); stroke-linecap: round; }
.eyf-floor { fill: #000; opacity: 0.08; transform-box: fill-box; transform-origin: center; transition: transform 420ms cubic-bezier(.3, 1.4, .5, 1); }
.eyf-cheek { fill: #ff8a94; opacity: 0.75; transition: opacity 240ms ease; }

/* The body leans toward what it looks at and squashes when pressed. */
.eyf-body {
  --tilt: 0deg;
  transform-box: view-box;
  transform-origin: 100px 190px;
  transform: rotate(var(--tilt));
  transition: transform 460ms cubic-bezier(.3, 1.5, .5, 1);
}
.eyf[data-press="true"] .eyf-body { transform: rotate(var(--tilt)) scale(1.06, 0.93); transition-duration: 160ms; transition-timing-function: cubic-bezier(.2, .8, .3, 1); }
.eyf[data-press="true"] .eyf-floor { transform: scaleX(1.1); }
.eyf[data-press="true"] .eyf-cheek { opacity: 1; }

/* Blink: the eyes close top-to-bottom quickly and open a little slower. */
.eyf-lid { transform-box: fill-box; transform-origin: center; transition: transform 140ms cubic-bezier(.3, 0, .3, 1); }
.eyf[data-blink="true"] .eyf-lid { transform: scaleY(0.08); transition-duration: 70ms; }

/* Pressed: open eyes swap for happy arcs, the smile for an open grin. */
.eyf-open, .eyf-happy, .eyf-smile, .eyf-grin { transform-box: fill-box; transform-origin: center; transition: opacity 120ms ease, transform 280ms cubic-bezier(.3, 1.5, .5, 1); }
.eyf-happy, .eyf-grin { opacity: 0; transform: scale(0.6); }
.eyf[data-press="true"] .eyf-open, .eyf[data-press="true"] .eyf-smile { opacity: 0; transform: scaleY(0.3); }
.eyf[data-press="true"] .eyf-happy, .eyf[data-press="true"] .eyf-grin { opacity: 1; transform: none; }

.eyf-sprout { transform-box: fill-box; transform-origin: 50% 100%; }
.eyf[data-press="true"] .eyf-sprout { animation: eyf-wiggle 520ms cubic-bezier(.3, 1.4, .5, 1); }
@keyframes eyf-wiggle { 0% { transform: rotate(0); } 30% { transform: rotate(-12deg); } 60% { transform: rotate(8deg); } 100% { transform: rotate(0); } }

@media (prefers-reduced-motion: reduce) {
  .eyf-body, .eyf[data-press="true"] .eyf-body { transform: none; transition: none; }
  .eyf[data-blink="true"] .eyf-lid { transform: none; }
  .eyf[data-press="true"] .eyf-sprout { animation: none; }
  .eyf-open, .eyf-happy, .eyf-smile, .eyf-grin, .eyf-floor { transition: opacity 120ms ease; transform: none !important; }
}
`;export{fe as default};
