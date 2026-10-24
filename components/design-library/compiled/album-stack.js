"use client";
/* Construct · Design library: the compiled preview of "Album stack". The source is for members. */
import{useCallback as D,useEffect as V,useLayoutEffect as X,useRef as b,useState as R}from"react";import{Fragment as E,jsx as a,jsxs as l}from"react/jsx-runtime";var _=[{id:"tide",title:"Low Tide",artist:"Marlow Sands",art:"sun"},{id:"planes",title:"Paper Planes Club",artist:"The Overpass",art:"stripes"},{id:"neon",title:"Neon Dentist",artist:"Kiki Varga",art:"dots"},{id:"orbit",title:"Slow Orbit",artist:"Halden",art:"orbit"},{id:"static",title:"Summer Static",artist:"June Arcade",art:"waves"}],F={vivid:[["#ff5a1f","#ffe1cf"],["#0a84ff","#dff0ff"],["#ff2d75","#ffe3ee"],["#00b383","#d4fff0"],["#ffcc00","#2a2100"]],pastel:[["#f6c6a8","#b2431b"],["#b9dcf7","#0d4f8c"],["#f7bfd3","#a3194b"],["#bfe8d4","#14684a"],["#f8e6a0","#7a5a00"]],mono:[["#f2f2f0","#141414"],["#1c1c1e","#f2f2f0"],["#8e8e93","#f2f2f0"],["#f2f2f0","#1c1c1e"],["#2c2c2e","#d1d1d6"]]},m=200;function j({albums:n=_,palette:s="vivid",threshold:o=90,onChange:c}){let v=F[s]??F.vivid,[d,K]=R(()=>n.map((t,e)=>e)),[x,z]=R(!1),[Z,U]=R(""),P=b(null),h=b(new Map),w=b(null),k=b({x:0,y:0}),u=b(!1),M=b(null),$=b(!1),f=b(!1),N=d[0],g=n[N];V(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");f.current=t.matches;let e=()=>f.current=t.matches;return t.addEventListener("change",e),()=>t.removeEventListener("change",e)},[]);let L=(t,e)=>P.current?.style.setProperty(t,e.toFixed(4)),C=t=>P.current?.setAttribute("data-live",String(t));X(()=>{let t=M.current;if(M.current=null,L("--lift",0),t!==null){let e=h.current.get(t);e&&(e.style.transition="",e.style.transform="",e.style.opacity="")}$.current&&($.current=!1,h.current.get(d[0])?.focus({preventScroll:!0}))},[d]);let S=D((t,e)=>{let r=n[t[0]];K(t),U(`${e} ${r.title} by ${r.artist}.`),c?.(r)},[n,c]),T=D((t=1,e=0,r=0)=>{if(u.current||n.length<2)return;u.current=!0,C(!1);let i=h.current.get(N);if(i){let p=Math.max(200,Math.min(320,200+Math.abs(r)*60));i.style.transition=f.current?`opacity ${m}ms ease`:`transform ${m}ms cubic-bezier(.2,.7,.4,1)`,f.current?i.style.opacity="0":i.style.transform=`translate3d(${t*p}px, ${e*.5-8}px, 0) rotate(${t*18}deg)`}L("--lift",1),window.setTimeout(()=>{u.current=!1,M.current=N,S([...d.slice(1),d[0]],"Now showing")},m)},[n.length,N,d,S]),O=D(()=>{if(u.current||n.length<2)return;u.current=!0;let t=d[d.length-1],e=h.current.get(t);e&&(e.style.transition=f.current?`opacity ${m}ms ease`:`transform ${m}ms cubic-bezier(.2,.7,.4,1), opacity ${m}ms ease`,e.style.opacity="1",f.current||(e.style.transform="translate3d(-210px, -8px, 0) rotate(-18deg) scale(.94)")),window.setTimeout(()=>{u.current=!1,M.current=t,S([t,...d.slice(0,-1)],"Back to")},m)},[n.length,d,S]),H=t=>{let{x:e,y:r}=k.current;t.style.transform=`translate3d(${e.toFixed(2)}px, ${r.toFixed(2)}px, 0) rotate(${Math.max(-14,Math.min(14,e/16)).toFixed(3)}deg)`,L("--lift",Math.min(1,Math.abs(e)/(o*1.6)))},W=t=>{if(u.current||t.button!==0)return;let e=t.currentTarget,r=new DOMMatrixReadOnly(getComputedStyle(e).transform);k.current={x:r.m41,y:r.m42},e.setPointerCapture(t.pointerId),e.style.transition="none",w.current={id:t.pointerId,sx:t.clientX-r.m41,sy:t.clientY-r.m42,samples:[[t.timeStamp,r.m41,r.m42]]},C(!0),H(e)},Y=t=>{let e=w.current;if(!e||e.id!==t.pointerId)return;let r=t.clientX-e.sx,i=t.clientY-e.sy,p=Math.sign(i)*40*(1-1/(Math.abs(i)/40+1));e.samples.push([t.timeStamp,r,p]),e.samples.length>6&&e.samples.shift(),k.current={x:r,y:p},H(t.currentTarget)},B=t=>{let e=w.current;if(!e||e.id!==t.pointerId)return;w.current=null;let r=G(e.samples),{x:i,y:p}=k.current,A=Math.abs(r)>.5&&Math.sign(r)===Math.sign(i)&&Math.abs(i)>14;if(Math.abs(i)>o||A)return T(i>0?1:-1,p,r);let y=t.currentTarget;C(!1),y.style.transition=f.current?"transform 1ms":"transform 560ms cubic-bezier(.3,1.5,.5,1)",y.style.transform="",L("--lift",0)},q=t=>{t.key==="ArrowRight"||t.key==="ArrowLeft"?(t.preventDefault(),$.current=!0,t.key==="ArrowRight"?T(1):O()):(t.key===" "||t.key==="Enter")&&(t.preventDefault(),z(e=>!e))};return l(E,{children:[a("style",{children:Q}),l("div",{ref:P,className:"alb","data-live":"false","data-playing":x,style:{"--lift":0,"--n":n.length},children:[a("div",{className:"alb-stage",children:n.map((t,e)=>{let r=d.indexOf(e),i=r===0,[p,A]=v[e%v.length];return l("div",{ref:y=>{y?h.current.set(e,y):h.current.delete(e)},className:"alb-card","data-depth":r,style:{"--d":r,"--c":p,"--p":A,zIndex:50-r},tabIndex:i?0:-1,role:i?"group":void 0,"aria-roledescription":i?"record":void 0,"aria-label":i?`${t.title} by ${t.artist}. Left and right arrows to browse, Space to ${x?"pause":"play"}.`:void 0,"aria-hidden":i?void 0:!0,onPointerDown:i?W:void 0,onPointerMove:i?Y:void 0,onPointerUp:i?B:void 0,onPointerCancel:i?B:void 0,onKeyDown:i?q:void 0,children:[a("span",{className:"alb-disc","aria-hidden":!0,children:a("span",{className:"alb-vinyl",children:a("span",{className:"alb-label"})})}),l("span",{className:"alb-cover",children:[a(J,{art:t.art}),a("span",{className:"alb-name",children:t.artist})]})]},t.id)})}),l("div",{className:"alb-meta",children:[a("strong",{children:g.title}),a("span",{children:g.artist})]},g.id),l("div",{className:"alb-bar",children:[a("button",{type:"button",className:"alb-btn","aria-label":"Previous record",onClick:O,children:l("svg",{width:"20",height:"20",viewBox:"0 0 24 24","aria-hidden":!0,children:[a("path",{d:"M6 5.5v13",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round"}),a("path",{d:"M19 6.2v11.6a1 1 0 0 1-1.5.86L9.3 12.86a1 1 0 0 1 0-1.72l8.2-5.8A1 1 0 0 1 19 6.2Z",fill:"currentColor"})]})}),a("button",{type:"button",className:"alb-play","aria-label":x?`Pause ${g.title}`:`Play ${g.title}`,onClick:()=>z(t=>!t),children:x?l("svg",{width:"22",height:"22",viewBox:"0 0 24 24","aria-hidden":!0,children:[a("rect",{x:"6",y:"5",width:"4.2",height:"14",rx:"1.4",fill:"currentColor"}),a("rect",{x:"13.8",y:"5",width:"4.2",height:"14",rx:"1.4",fill:"currentColor"})]}):a("svg",{width:"22",height:"22",viewBox:"0 0 24 24","aria-hidden":!0,children:a("path",{d:"M8 5.6v12.8a1.1 1.1 0 0 0 1.68.93l10.1-6.4a1.1 1.1 0 0 0 0-1.86L9.68 4.67A1.1 1.1 0 0 0 8 5.6Z",fill:"currentColor"})})}),a("button",{type:"button",className:"alb-btn","aria-label":"Next record",onClick:()=>T(1),children:l("svg",{width:"20",height:"20",viewBox:"0 0 24 24","aria-hidden":!0,children:[a("path",{d:"M18 5.5v13",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round"}),a("path",{d:"M5 6.2v11.6a1 1 0 0 0 1.5.86l8.2-5.8a1 1 0 0 0 0-1.72L6.5 5.34A1 1 0 0 0 5 6.2Z",fill:"currentColor"})]})})]}),a("span",{className:"alb-sr","aria-live":"polite",children:Z})]})]})}function J({art:n}){return l("svg",{className:"alb-art",viewBox:"0 0 100 100","aria-hidden":!0,children:[n==="sun"&&l(E,{children:[a("circle",{className:"alb-ink",cx:"50",cy:"56",r:"27"}),a("rect",{className:"alb-cut",x:"0",y:"60",width:"100",height:"3"}),a("rect",{className:"alb-cut",x:"0",y:"68",width:"100",height:"4.5"}),a("rect",{className:"alb-cut",x:"0",y:"77",width:"100",height:"6"}),a("rect",{className:"alb-ink",x:"0",y:"86",width:"100",height:"14"})]}),n==="stripes"&&l(E,{children:[a("path",{className:"alb-ink",d:"M-10 70 L70 -10 L84 -10 L-10 84Z"}),a("path",{className:"alb-ink",d:"M8 110 L110 8 L110 26 L26 110Z"}),a("path",{className:"alb-ink",d:"M44 110 L110 44 L110 52 L52 110Z"})]}),n==="dots"&&I.map(([s,o,c])=>a("circle",{className:"alb-ink",cx:s,cy:o,r:c},`${s}-${o}`)),n==="orbit"&&l(E,{children:[a("circle",{className:"alb-ring",cx:"50",cy:"50",r:"34"}),a("circle",{className:"alb-ring",cx:"50",cy:"50",r:"22"}),a("circle",{className:"alb-ink",cx:"50",cy:"50",r:"10"}),a("circle",{className:"alb-ink",cx:"74",cy:"26",r:"5.5"}),a("circle",{className:"alb-ink",cx:"35",cy:"66",r:"3.2"})]}),n==="waves"&&[26,40,54,68,82].map((s,o)=>a("path",{className:"alb-wave",style:{strokeWidth:3+o*1.1},d:`M-4 ${s} q13 -${8+o} 26 0 t26 0 t26 0 t26 0 t26 0`},s))]})}var I=[];for(let n=0;n<7;n++)for(let s=0;s<7;s++){let o=8+s*14,c=8+n*14,v=Math.hypot(o-4,96-c)/130;I.push([o,c,Math.max(.8,6.4*(1-v))])}function G(n){if(n.length<2)return 0;let s=n[0],o=n[n.length-1],c=o[0]-s[0];return c>0&&c<160?(o[1]-s[1])/c:0}var Q=`
.alb {
  --lift: 0;
  display: grid;
  justify-items: center;
  gap: 12px;
  font-family: inherit;
  color: #f5f5f7;
  user-select: none;
  -webkit-user-select: none;
}
.alb-stage {
  position: relative;
  width: 156px;
  height: 184px;
  transition: translate 520ms cubic-bezier(.3, 1.3, .5, 1);
}
/* the record slides out to the right: make room for it */
.alb[data-playing="true"] .alb-stage { translate: -34px 0; }

.alb-card {
  --k: max(0, calc(var(--d) - var(--lift)));
  position: absolute;
  left: 0;
  bottom: 0;
  width: 156px;
  height: 156px;
  transform-origin: 50% 30%;
  transform: translate3d(0, calc(var(--k) * -14px), 0) scale(calc(1 - var(--k) * .07));
  opacity: calc(3.4 - var(--k));
  transition: transform 460ms cubic-bezier(.3, 1.3, .5, 1), opacity 260ms ease;
  touch-action: pan-y;
  outline: none;
  border-radius: 8px;
}
.alb-card[data-depth="0"] { cursor: grab; will-change: transform; }
.alb[data-live="true"] .alb-card { transition: none; }
.alb[data-live="true"] .alb-card[data-depth="0"] { cursor: grabbing; }
.alb-card[data-depth="0"]:focus-visible .alb-cover { box-shadow: 0 0 0 2px #121214, 0 0 0 4px #f5f5f7, 0 18px 30px -14px rgb(0 0 0 / .8); }

.alb-cover {
  position: absolute;
  inset: 0;
  display: block;
  border-radius: 8px;
  overflow: hidden;
  background: var(--c);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .22),
    inset 0 0 0 1px rgb(0 0 0 / .08),
    0 1px 2px rgb(0 0 0 / .4),
    0 18px 30px -14px rgb(0 0 0 / .8);
}
/* the faint sheen of a printed sleeve */
.alb-cover::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(125deg, rgb(255 255 255 / .16), transparent 42%, rgb(0 0 0 / .1));
  pointer-events: none;
}
.alb-art { position: absolute; inset: 0; width: 100%; height: 100%; }
.alb-ink { fill: var(--p); }
.alb-cut { fill: var(--c); }
.alb-ring { fill: none; stroke: var(--p); stroke-width: 2.4; }
.alb-wave { fill: none; stroke: var(--p); stroke-linecap: round; }
.alb-name {
  position: absolute;
  left: 10px;
  top: 9px;
  font: 600 9px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--p);
  transition: opacity 200ms ease;
}
.alb-card:not([data-depth="0"]) .alb-name { opacity: 0; }

/* the record, behind its sleeve */
.alb-disc {
  position: absolute;
  inset: 5px;
  border-radius: 50%;
  translate: 0 0;
  transition: translate 520ms cubic-bezier(.3, 1.3, .5, 1);
}
.alb[data-playing="true"] .alb-card[data-depth="0"] .alb-disc { translate: 46% 0; }
.alb[data-live="true"] .alb-disc { translate: 0 0 !important; transition: translate 200ms ease-out; }
.alb-vinyl {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background:
    radial-gradient(circle, transparent 30%, rgb(255 255 255 / .05) 31%, transparent 32%, transparent 52%, rgb(255 255 255 / .05) 53%, transparent 54%),
    conic-gradient(from 30deg, #0e0e0f, #2a2a2d 12%, #0e0e0f 25%, #0e0e0f 50%, #26262a 62%, #0e0e0f 75%),
    #0e0e0f;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / .06), 0 8px 18px -8px rgb(0 0 0 / .7);
  animation: alb-spin 2.4s linear infinite paused;
}
.alb[data-playing="true"] .alb-card[data-depth="0"] .alb-vinyl { animation-play-state: running; }
.alb-label {
  position: absolute;
  inset: 34%;
  border-radius: 50%;
  background: radial-gradient(circle, #121214 0 7%, var(--c) 8% 100%);
  box-shadow: inset 0 0 0 1.5px rgb(0 0 0 / .18);
}
.alb-label::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 14%;
  width: 22%;
  height: 4px;
  margin-left: -11%;
  border-radius: 2px;
  background: var(--p);
  opacity: .8;
}
@keyframes alb-spin { to { rotate: 360deg; } }

.alb-meta {
  display: grid;
  justify-items: center;
  gap: 3px;
  min-height: 38px;
  text-align: center;
  animation: alb-meta 340ms cubic-bezier(.3, 1.3, .5, 1) both;
}
@keyframes alb-meta { from { opacity: 0; translate: 0 6px; } }
.alb-meta strong { font-size: 15px; font-weight: 650; letter-spacing: -0.015em; line-height: 1.15; }
.alb-meta span { font-size: 12.5px; opacity: .58; line-height: 1.2; }

.alb-bar { display: flex; align-items: center; gap: 18px; }
.alb-btn, .alb-play {
  display: grid;
  place-items: center;
  border: 0;
  padding: 0;
  cursor: pointer;
  font: inherit;
  transition: transform 240ms cubic-bezier(.3, 1.4, .5, 1), background-color 160ms ease, opacity 160ms ease;
}
.alb-btn { width: 40px; height: 40px; border-radius: 999px; background: transparent; color: #f5f5f7; opacity: .8; }
.alb-btn:hover { opacity: 1; background: rgb(255 255 255 / .08); }
.alb-play {
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: #f5f5f7;
  color: #121214;
  box-shadow: inset 0 -1px 0 rgb(0 0 0 / .12), 0 8px 18px -10px rgb(0 0 0 / .8);
}
.alb-btn:active, .alb-play:active { transform: scale(.9); }
.alb-btn:focus-visible, .alb-play:focus-visible { outline: 2px solid #f5f5f7; outline-offset: 3px; }
.alb-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .alb-card { transition: opacity 160ms ease; }
  .alb-stage, .alb-disc { transition-duration: 1ms; }
  .alb-vinyl { animation: none; }
  .alb-meta { animation-duration: 1ms; }
}
`;export{j as default};
