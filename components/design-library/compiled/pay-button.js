"use client";
/* Construct · Design library: the compiled preview of "Pay button". The source is for members. */
import{useCallback as Z,useEffect as C,useId as _,useRef as t,useState as S}from"react";import{Fragment as W,jsx as e,jsxs as n}from"react/jsx-runtime";function J({amount:i=42,currency:c="USD",label:o="Pay",done:x="Paid",card:M="4242",tone:U="#111111",success:Y="#3d3df5",accent:B="#7b5cff",onPay:X,autoplay:k=!0}){let[s,q]=S("idle"),[G,v]=S(!1),[R,A]=S(!1),N=t(null),l=t("idle"),d=t(!0),$=K(i,c),F=`pyb-g${_().replace(/[^a-zA-Z0-9_-]/g,"")}`,I=t(k),b=t(!1),P=t(!1),y=t(!1),u=t(!1),z=t(!1),m=t(0),h=t(0),L=t(0),f=a=>{l.current=a,q(a)},D=async a=>{if(l.current!=="idle")return;A(a),f("busy");let g=performance.now();try{let p=a?void 0:X?.();p&&typeof p.then=="function"&&await p}catch{d.current&&f("idle");return}let w=Math.max(0,1300-(performance.now()-g));L.current=window.setTimeout(()=>d.current&&f("done"),w)},T=()=>I.current&&b.current&&!P.current&&!y.current&&!u.current&&!z.current,r=Z(a=>{clearTimeout(m.current),v(!1),!(!T()||l.current!=="idle")&&(m.current=window.setTimeout(()=>{!T()||l.current!=="idle"||(v(!0),m.current=window.setTimeout(()=>{v(!1),T()&&D(!0)},150))},a))},[]);C(()=>{if(s==="done"){let a=setTimeout(()=>f("idle"),1800);return()=>clearTimeout(a)}s==="idle"&&r(2200)},[s,r]),C(()=>{I.current=k,r(1200)},[k,r]),C(()=>{d.current=!0;let a=window.matchMedia("(prefers-reduced-motion: reduce)");P.current=a.matches;let g=()=>{P.current=a.matches,r(1200)};a.addEventListener("change",g);let w=new IntersectionObserver(([p])=>{let H=b.current;b.current=p.isIntersecting,H!==b.current&&r(2600)});return N.current&&w.observe(N.current),()=>{d.current=!1,a.removeEventListener("change",g),w.disconnect(),clearTimeout(m.current),clearTimeout(h.current),clearTimeout(L.current)}},[r]);let E=()=>{clearTimeout(h.current),z.current=!0,r(0)},O=()=>{clearTimeout(h.current),!(y.current||u.current)&&(h.current=window.setTimeout(()=>{z.current=!1,r(900)},1500))},j=R?"":s==="busy"?"Processing payment":s==="done"?x:"";return n(W,{children:[e("style",{children:V}),n("div",{ref:N,className:"pyb-wrap","data-phase":s,onPointerEnter:()=>{y.current=!0,E()},onPointerLeave:()=>{y.current=!1,O()},onFocus:()=>{u.current=!0,E()},onBlur:a=>{a.currentTarget.contains(a.relatedTarget)||(u.current=!1,O())},children:[n("button",{type:"button",className:"pyb","data-phase":s,"data-pressed":G||void 0,style:{"--pyb-tone":U,"--pyb-ok":Y,"--pyb-ok2":B},onClick:()=>D(!1),"aria-disabled":s!=="idle","aria-label":s==="done"?x:s==="busy"?"Processing payment":`${o} ${$}`,children:[e("span",{className:"pyb-grain","aria-hidden":!0}),e("span",{className:"pyb-fill","aria-hidden":!0}),e("span",{className:"pyb-shine","aria-hidden":!0}),n("span",{className:"pyb-idle","aria-hidden":!0,children:[e("span",{children:o}),e("span",{className:"pyb-num",children:$})]}),n("span",{className:"pyb-status","aria-hidden":!0,children:[n("svg",{className:"pyb-ring",width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[e("defs",{children:n("linearGradient",{id:F,gradientUnits:"userSpaceOnUse",x1:"18.5",y1:"10",x2:"6",y2:"17.6",children:[e("stop",{offset:"0",stopColor:"#3d3df5",stopOpacity:"0.35"}),e("stop",{offset:"0.5",stopColor:"#7b5cff"}),e("stop",{offset:"1",stopColor:"#ff4f7b"})]})}),e("circle",{className:"pyb-track",cx:"10",cy:"10",r:"8.5"}),n("g",{className:"pyb-spin",children:[e("circle",{className:"pyb-arc",cx:"10",cy:"10",r:"8.5",pathLength:"100",stroke:`url(#${F})`}),e("circle",{className:"pyb-arc pyb-arc-w",cx:"10",cy:"10",r:"8.5",pathLength:"100"})]}),e("path",{className:"pyb-tick",d:"M6.3 10.3l2.5 2.5 5-5.2",pathLength:"100"})]}),e("span",{className:"pyb-done",children:e("span",{children:x})})]})]}),e("span",{className:"pyb-glow","aria-hidden":!0,children:e("i",{})}),M?n("span",{className:"pyb-card","aria-hidden":!0,children:[n("svg",{className:"pyb-mark",width:"16",height:"10",viewBox:"0 0 16 10",children:[e("circle",{cx:"5",cy:"5",r:"5",fill:"#ff4f7b"}),e("circle",{cx:"11",cy:"5",r:"5",fill:"#ffb020",fillOpacity:"0.85"})]}),e("span",{className:"pyb-dots",children:"\u2022\u2022\u2022\u2022"})," ",M]}):null,e("span",{className:"pyb-sr",role:"status","aria-live":"polite",children:j})]})]})}function K(i,c){let o=Number.isInteger(i);try{return new Intl.NumberFormat("en-US",{style:"currency",currency:c,minimumFractionDigits:o?0:2,maximumFractionDigits:2}).format(i)}catch{return`${c} ${o?i:i.toFixed(2)}`}}var Q=`url("data:image/svg+xml,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='1' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 1.6 0 0 0 -0.62'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>")}")`,V=`
.pyb-wrap {
  position: relative;
  isolation: isolate;
  display: inline-grid;
  justify-items: center;
  gap: 14px;
}
.pyb {
  --pyb-spring: cubic-bezier(.3, 1.5, .45, 1);
  position: relative;
  z-index: 1;
  display: inline-grid;
  place-items: center;
  width: 264px;
  max-width: 100%;
  height: 54px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  background: var(--pyb-tone);
  color: #fff;
  font-family: inherit;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.01em;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 1px 2px rgba(17, 17, 17, 0.18),
    0 10px 24px -12px rgba(17, 17, 17, 0.45);
  transition:
    transform 480ms var(--pyb-spring),
    background-color 360ms ease,
    box-shadow 360ms ease;
}
.pyb[data-phase="idle"]:hover { box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 1px 2px rgba(17, 17, 17, 0.2),
    0 14px 28px -12px rgba(17, 17, 17, 0.5); }
/* The press: quick in, springy out (the release uses the base transition). */
.pyb[data-phase="idle"]:active,
.pyb[data-pressed] {
  transform: scale(0.97);
  transition: transform 110ms cubic-bezier(.2, 0, .4, 1), background-color 360ms ease, box-shadow 160ms ease;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.06),
    0 1px 1px rgba(17, 17, 17, 0.2),
    0 4px 10px -8px rgba(17, 17, 17, 0.4);
}
.pyb[aria-disabled="true"] { cursor: default; }
.pyb:focus-visible { outline: 2px solid var(--pyb-ok); outline-offset: 3px; }
.pyb[data-phase="done"] {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    0 1px 2px rgba(17, 17, 17, 0.1),
    0 12px 26px -12px color-mix(in srgb, var(--pyb-ok2) 70%, transparent);
}

/* Material on the black pill: a fine grain and a soft top sheen. */
.pyb-grain {
  position: absolute; inset: 0; z-index: -1;
  border-radius: inherit;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.07), rgba(255, 255, 255, 0) 55%),
    ${Q} 0 0 / 120px 120px;
  opacity: 0.12;
  pointer-events: none;
}

/* Paid: the colour grows out of the ring at the centre, then a shine crosses it. */
.pyb-fill {
  position: absolute; inset: 0; z-index: -1;
  border-radius: inherit;
  background:
    radial-gradient(90% 160% at 18% -10%, rgba(76, 194, 255, 0.5), rgba(76, 194, 255, 0) 60%),
    radial-gradient(70% 140% at 100% 120%, rgba(255, 79, 123, 0.32), rgba(255, 79, 123, 0) 60%),
    linear-gradient(100deg, var(--pyb-ok) 0%, var(--pyb-ok2) 100%);
  clip-path: circle(80% at 50% 50%);
  opacity: 0;
  transition: opacity 380ms ease;
  pointer-events: none;
}
.pyb[data-phase="busy"] .pyb-fill { clip-path: circle(0% at 50% 50%); opacity: 1; transition: none; }
.pyb[data-phase="done"] .pyb-fill {
  clip-path: circle(80% at 50% 50%); opacity: 1;
  transition: clip-path 620ms cubic-bezier(.25, .8, .25, 1);
}
.pyb-shine {
  position: absolute; inset: 0; z-index: -1;
  border-radius: inherit;
  background: linear-gradient(105deg, rgba(255, 255, 255, 0) 35%, rgba(255, 255, 255, 0.34) 50%, rgba(255, 255, 255, 0) 65%);
  transform: translateX(-110%);
  opacity: 0;
  pointer-events: none;
}
.pyb[data-phase="done"] .pyb-shine { animation: pyb-sweep 900ms cubic-bezier(.4, 0, .2, 1) 420ms both; }
@keyframes pyb-sweep {
  from { transform: translateX(-110%); opacity: 1; }
  to { transform: translateX(110%); opacity: 1; }
}

/* The glow underneath: blooms when paid, then settles; fades out on reset. */
.pyb-glow {
  position: absolute; z-index: 0;
  top: 10px; left: 24px; right: 24px; height: 44px;
  opacity: 0;
  transition: opacity 380ms ease;
  pointer-events: none;
}
.pyb-glow i {
  position: absolute; inset: 0;
  border-radius: 999px;
  background: linear-gradient(90deg, #4cc2ff 0%, var(--pyb-ok, #3d3df5) 35%, #7b5cff 70%, #ff4f7b 100%);
  filter: blur(16px);
  opacity: 0.6;
  transform: translateY(15px) scale(0.92, 0.85);
}
.pyb-wrap[data-phase="done"] .pyb-glow { opacity: 1; transition: none; }
.pyb-wrap[data-phase="done"] .pyb-glow i { animation: pyb-bloom 1300ms cubic-bezier(.3, .7, .3, 1) 120ms both; }
@keyframes pyb-bloom {
  0% { opacity: 0; transform: translateY(2px) scale(0.7, 0.5); }
  32% { opacity: 1; transform: translateY(17px) scale(1.08, 1.3); }
  100% { opacity: 0.6; transform: translateY(15px) scale(0.92, 0.85); }
}

.pyb-idle, .pyb-status { grid-area: 1 / 1; position: relative; }

.pyb-idle {
  display: inline-flex; align-items: center; gap: 6px;
  white-space: nowrap;
  transition: transform 460ms cubic-bezier(.3, 1.3, .5, 1) 80ms, opacity 260ms ease 80ms;
}
.pyb-num { font-variant-numeric: tabular-nums; }
.pyb[data-phase="busy"] .pyb-idle,
.pyb[data-phase="done"] .pyb-idle {
  transform: translateY(-30px);
  opacity: 0;
  transition: transform 220ms cubic-bezier(.5, 0, .9, .5), opacity 160ms ease;
}

/* Spinner and result share one row: the word's column is 0fr until paid,
   so the ring sits dead centre while it spins, then slides left as "Paid"
   opens beside it. */
.pyb-status {
  display: inline-grid;
  grid-template-columns: auto 0fr;
  align-items: center;
  opacity: 0;
  transition: opacity 160ms ease, grid-template-columns 300ms ease;
}
.pyb[data-phase="busy"] .pyb-status { opacity: 1; transition: opacity 200ms ease 120ms; }
.pyb[data-phase="done"] .pyb-status {
  opacity: 1;
  grid-template-columns: auto 1fr;
  transition: grid-template-columns 520ms cubic-bezier(.3, 1.25, .5, 1) 160ms;
}
.pyb-done { min-width: 0; overflow: hidden; white-space: nowrap; }
.pyb-done span {
  display: inline-block; padding-left: 8px;
  transform: translateX(-8px); opacity: 0;
  transition: transform 200ms ease, opacity 120ms ease;
}
.pyb[data-phase="done"] .pyb-done span {
  transform: none; opacity: 1;
  transition: transform 460ms cubic-bezier(.3, 1.4, .5, 1) 220ms, opacity 240ms ease 220ms;
}

.pyb-ring { display: block; flex: none; overflow: visible; }
.pyb-track {
  stroke: rgba(255, 255, 255, 0.16); stroke-width: 1.6;
  opacity: 0; transition: opacity 200ms ease;
}
.pyb[data-phase="busy"] .pyb-track { opacity: 1; }
.pyb-spin { transform-origin: 10px 10px; }
.pyb[data-phase="busy"] .pyb-spin,
.pyb[data-phase="done"] .pyb-spin { animation: pyb-turn 720ms linear infinite; }
.pyb-arc {
  stroke-width: 1.8; stroke-linecap: round;
  stroke-dasharray: 0 100;
  opacity: 0; /* a zero-length dash still shows its round cap as a dot */
  transform: rotate(-90deg); transform-origin: 10px 10px;
  transition: opacity 120ms ease;
}
/* busy: the arc draws itself to a quarter of the ring, then turns */
.pyb[data-phase="busy"] .pyb-arc {
  stroke-dasharray: 28 100;
  opacity: 1;
  transition: stroke-dasharray 520ms cubic-bezier(.4, 0, .2, 1) 140ms, opacity 0ms 140ms;
}
/* done: it closes into a full ring (now the turning can't be seen) */
.pyb[data-phase="done"] .pyb-arc {
  stroke-dasharray: 100 100;
  opacity: 1;
  transition: stroke-dasharray 300ms cubic-bezier(.4, 0, .2, 1);
}
/* Two arcs share every move: the gradient one spins, the white one closes the ring. */
.pyb-arc-w { stroke: currentColor; }
.pyb[data-phase="busy"] .pyb-arc-w { opacity: 0; }
.pyb[data-phase="done"] .pyb-arc:not(.pyb-arc-w) {
  opacity: 0;
  transition: stroke-dasharray 300ms cubic-bezier(.4, 0, .2, 1), opacity 260ms ease;
}
.pyb-tick {
  stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 100; stroke-dashoffset: 100;
}
.pyb[data-phase="done"] .pyb-tick {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 340ms cubic-bezier(.6, 0, .2, 1) 200ms;
}
@keyframes pyb-turn { to { transform: rotate(360deg); } }

.pyb-card {
  display: inline-flex; align-items: center; gap: 6px;
  font: 400 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  color: #8a8a8a;
  white-space: nowrap;
}
.pyb-dots { letter-spacing: 0.1em; }
.pyb-mark { display: block; flex: none; margin-right: 2px; }
.pyb-mark circle:last-child { mix-blend-mode: multiply; }

.pyb-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pyb, .pyb[data-phase="idle"]:active, .pyb[data-pressed] { transform: none; transition: box-shadow 200ms ease, background-color 200ms ease; }
  .pyb-idle, .pyb[data-phase="busy"] .pyb-idle, .pyb[data-phase="done"] .pyb-idle,
  .pyb-done span, .pyb[data-phase="done"] .pyb-done span { transform: none; transition: opacity 180ms ease; }
  .pyb-status, .pyb[data-phase="done"] .pyb-status { transition: opacity 180ms ease; }
  .pyb[data-phase="busy"] .pyb-spin, .pyb[data-phase="done"] .pyb-spin { animation: none; }
  .pyb[data-phase="busy"] .pyb-arc { animation: pyb-pulse 1s ease-in-out infinite alternate; stroke-dasharray: 100 100; transition: none; }
  .pyb[data-phase="busy"] .pyb-arc-w { animation: none; }
  .pyb[data-phase="done"] .pyb-fill { transition: opacity 200ms ease; }
  .pyb[data-phase="busy"] .pyb-fill { clip-path: circle(80% at 50% 50%); opacity: 0; }
  .pyb[data-phase="done"] .pyb-shine { animation: none; }
  .pyb-wrap[data-phase="done"] .pyb-glow { transition: opacity 240ms ease; }
  .pyb-wrap[data-phase="done"] .pyb-glow i { animation: none; }
  .pyb[data-phase="done"] .pyb-arc, .pyb[data-phase="done"] .pyb-tick { transition: none; }
}
@keyframes pyb-pulse { from { opacity: 0.35; } to { opacity: 1; } }
`;export{J as default};
