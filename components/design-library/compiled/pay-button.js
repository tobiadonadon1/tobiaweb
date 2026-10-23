"use client";
/* Construct · Design library: the compiled preview of "Pay button". The source is for members. */
import{useEffect as y,useRef as g,useState as x}from"react";import{Fragment as N,jsx as e,jsxs as i}from"react/jsx-runtime";function w({amount:s=42,currency:t="USD",label:n="Pay",done:r="Paid",tone:m="#0a0a0a",success:b="#c6f432",onPay:u}){let[a,o]=x("idle"),p=g(!0),l=k(s,t);y(()=>(p.current=!0,()=>{p.current=!1}),[]);let h=async()=>{if(a!=="idle")return;o("busy");let d=performance.now();try{let c=u?.();c&&typeof c.then=="function"&&await c}catch{p.current&&o("idle");return}let f=Math.max(0,1300-(performance.now()-d));setTimeout(()=>p.current&&o("done"),f)};return y(()=>{if(a!=="done")return;let d=setTimeout(()=>o("idle"),1900);return()=>clearTimeout(d)},[a]),i(N,{children:[e("style",{children:z}),i("button",{type:"button",className:"pyb","data-phase":a,style:{"--pyb-tone":m,"--pyb-ok":b,"--pyb-ink":v(b)},onClick:h,"aria-disabled":a!=="idle","aria-label":a==="done"?r:a==="busy"?"Processing payment":`${n} ${l}`,children:[e("span",{className:"pyb-flood","aria-hidden":!0}),e("span",{className:"pyb-sheen","aria-hidden":!0}),i("span",{className:"pyb-idle","aria-hidden":!0,children:[e(P,{}),e("span",{children:n}),e("span",{className:"pyb-num",children:l})]}),i("span",{className:"pyb-status","aria-hidden":!0,children:[i("svg",{className:"pyb-ring",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",children:[e("g",{className:"pyb-spin",children:e("circle",{className:"pyb-arc",cx:"12",cy:"12",r:"10",pathLength:"100"})}),e("path",{className:"pyb-tick",d:"M7.4 12.3l3 3 6.2-6.4",pathLength:"100"})]}),e("span",{className:"pyb-done",children:e("span",{children:r})})]})]}),e("span",{className:"pyb-sr",role:"status","aria-live":"polite",children:a==="busy"?"Processing payment":a==="done"?r:""})]})}function k(s,t){try{return new Intl.NumberFormat("en-US",{style:"currency",currency:t}).format(s)}catch{return`${t} ${s.toFixed(2)}`}}function v(s){let t=/^#?([0-9a-f]{6})$/i.exec(s);if(!t)return"#0a0a0a";let n=parseInt(t[1],16);return(.299*(n>>16)+.587*(n>>8&255)+.114*(n&255))/255>.6?"#0a0a0a":"#ffffff"}var P=()=>i("svg",{className:"pyb-wallet",width:"22",height:"18",viewBox:"0 0 22 18",fill:"none",children:[e("rect",{x:"1",y:"3.5",width:"20",height:"13.5",rx:"3.2",stroke:"currentColor",strokeWidth:"1.7"}),e("path",{d:"M4 3.5l9.6-2.6a1.6 1.6 0 0 1 2 1.1l.4 1.5",stroke:"currentColor",strokeWidth:"1.7",strokeLinejoin:"round"}),e("rect",{x:"13.4",y:"8.2",width:"7.6",height:"4.4",rx:"2.2",fill:"currentColor"})]}),z=`
.pyb {
  position: relative;
  display: inline-grid;
  place-items: center;
  width: 280px;
  max-width: 100%;
  height: 58px;
  padding: 0 24px;
  border: 0;
  border-radius: 16px;
  background: var(--pyb-tone);
  color: #fff;
  font-family: inherit;
  font-size: 17px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.01em;
  cursor: pointer;
  overflow: hidden;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  -webkit-user-select: none;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.14),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3),
    0 1px 2px rgba(0, 0, 0, 0.22),
    0 14px 28px -14px color-mix(in srgb, var(--pyb-tone) 80%, transparent);
  transition:
    transform 520ms cubic-bezier(.3, 1.6, .45, 1),
    box-shadow 320ms ease;
}
/* The squash: quick in, springy out (the release uses the base transition). */
.pyb[data-phase="idle"]:active {
  transform: scale(0.975, 0.9);
  transition: transform 110ms cubic-bezier(.2, 0, .4, 1);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 1px 1px rgba(0, 0, 0, 0.25),
    0 6px 14px -10px color-mix(in srgb, var(--pyb-tone) 80%, transparent);
}
.pyb[aria-disabled="true"] { cursor: default; }
.pyb:focus-visible { outline: 2px solid var(--pyb-tone); outline-offset: 3px; }
.pyb[data-phase="done"] {
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 1px 2px rgba(0, 0, 0, 0.12),
    0 16px 30px -14px color-mix(in srgb, var(--pyb-ok) 90%, #000);
}

/* A soft top light, so the button reads as a thing, not a rectangle. */
.pyb-sheen {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.09), rgba(255,255,255,0) 52%);
}

/* The flood: a circle as wide as the button's diagonal, grown from the middle. */
.pyb-flood {
  position: absolute; z-index: 0;
  left: 50%; top: 50%;
  width: 320px; height: 320px;
  margin: -160px 0 0 -160px;
  border-radius: 50%;
  background: var(--pyb-ok);
  transform: scale(0);
  opacity: 0;
  transition: transform 0ms 260ms, opacity 240ms ease;
}
.pyb[data-phase="done"] .pyb-flood {
  transform: scale(1);
  opacity: 1;
  transition: transform 560ms cubic-bezier(.2, .8, .2, 1), opacity 0ms;
}

.pyb-idle, .pyb-status { grid-area: 1 / 1; position: relative; z-index: 1; }

.pyb-idle {
  display: inline-flex; align-items: center; gap: 9px;
  white-space: nowrap;
  transition: transform 460ms cubic-bezier(.3, 1.35, .5, 1) 80ms, opacity 260ms ease 80ms;
}
.pyb-idle span + span { margin-left: -3px; }
.pyb-wallet { display: block; flex: none; margin-right: 3px; opacity: 0.92; }
.pyb-num { font-variant-numeric: tabular-nums; }
.pyb[data-phase="busy"] .pyb-idle,
.pyb[data-phase="done"] .pyb-idle {
  transform: translateY(-34px);
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
  color: #fff;
  opacity: 0;
  transition: opacity 160ms ease, grid-template-columns 300ms ease, color 200ms ease;
}
.pyb[data-phase="busy"] .pyb-status { opacity: 1; transition: opacity 200ms ease 120ms; }
.pyb[data-phase="done"] .pyb-status {
  opacity: 1;
  grid-template-columns: auto 1fr;
  color: var(--pyb-ink);
  transition: grid-template-columns 520ms cubic-bezier(.3, 1.3, .5, 1) 180ms, color 160ms ease 60ms;
}
.pyb-done { min-width: 0; overflow: hidden; white-space: nowrap; }
.pyb-done span {
  display: inline-block; padding-left: 9px;
  transform: translateX(-10px); opacity: 0;
  transition: transform 200ms ease, opacity 120ms ease;
}
.pyb[data-phase="done"] .pyb-done span {
  transform: none; opacity: 1;
  transition: transform 460ms cubic-bezier(.3, 1.4, .5, 1) 240ms, opacity 240ms ease 240ms;
}

.pyb-ring { display: block; flex: none; overflow: visible; }
.pyb-spin { transform-origin: 12px 12px; }
.pyb[data-phase="busy"] .pyb-spin,
.pyb[data-phase="done"] .pyb-spin { animation: pyb-turn 760ms linear infinite; }
.pyb-arc {
  stroke: currentColor; stroke-width: 2.4; stroke-linecap: round;
  stroke-dasharray: 0 100;
  opacity: 0; /* a zero-length dash still shows its round cap as a dot */
  transform: rotate(-90deg); transform-origin: 12px 12px;
  transition: opacity 120ms ease;
}
/* busy: the arc draws itself to a third of the ring, then turns */
.pyb[data-phase="busy"] .pyb-arc {
  stroke-dasharray: 30 100;
  opacity: 1;
  transition: stroke-dasharray 560ms cubic-bezier(.4, 0, .2, 1) 140ms, opacity 0ms 140ms;
}
/* done: it closes into a full ring (now the turning can't be seen) */
.pyb[data-phase="done"] .pyb-arc {
  stroke-dasharray: 100 100;
  opacity: 1;
  transition: stroke-dasharray 300ms cubic-bezier(.4, 0, .2, 1);
}
.pyb-tick {
  stroke: currentColor; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round;
  stroke-dasharray: 100; stroke-dashoffset: 100;
}
.pyb[data-phase="done"] .pyb-tick {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 360ms cubic-bezier(.6, 0, .2, 1) 200ms;
}
@keyframes pyb-turn { to { transform: rotate(360deg); } }

.pyb-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pyb, .pyb[data-phase="idle"]:active { transform: none; transition: box-shadow 200ms ease, background-color 200ms ease; }
  .pyb-flood, .pyb[data-phase="done"] .pyb-flood { transform: scale(1); transition: opacity 220ms ease; }
  .pyb-idle, .pyb[data-phase="busy"] .pyb-idle, .pyb[data-phase="done"] .pyb-idle,
  .pyb-done span, .pyb[data-phase="done"] .pyb-done span { transform: none; transition: opacity 180ms ease; }
  .pyb-status, .pyb[data-phase="done"] .pyb-status { transition: opacity 180ms ease, color 180ms ease; }
  .pyb[data-phase="busy"] .pyb-spin, .pyb[data-phase="done"] .pyb-spin { animation: none; }
  .pyb[data-phase="busy"] .pyb-arc { animation: pyb-pulse 1s ease-in-out infinite alternate; stroke-dasharray: 100 100; transition: none; }
  .pyb[data-phase="done"] .pyb-arc, .pyb[data-phase="done"] .pyb-tick { transition: none; }
}
@keyframes pyb-pulse { from { opacity: 0.35; } to { opacity: 1; } }
`;export{w as default};
