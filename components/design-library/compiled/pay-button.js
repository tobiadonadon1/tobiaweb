"use client";
/* Construct · Design library: the compiled preview of "Pay button". The source is for members. */
import{useCallback as A,useEffect as S,useRef as t,useState as C}from"react";import{Fragment as Q,jsx as a,jsxs as n}from"react/jsx-runtime";function G({amount:i=42,currency:c="USD",label:o="Pay",done:x="Paid",card:F="4242",tone:B="#111111",success:q="#3d3df5",onPay:U,autoplay:k=!0}){let[s,j]=C("idle"),[H,v]=C(!1),[O,R]=C(!1),P=t(null),d=t("idle"),u=t(!0),L=J(i,c),M=t(k),l=t(!1),N=t(!1),b=t(!1),y=t(!1),T=t(!1),m=t(0),h=t(0),D=t(0),f=e=>{d.current=e,j(e)},E=async e=>{if(d.current!=="idle")return;R(e),f("busy");let g=performance.now();try{let p=e?void 0:U?.();p&&typeof p.then=="function"&&await p}catch{u.current&&f("idle");return}let w=Math.max(0,1300-(performance.now()-g));D.current=window.setTimeout(()=>u.current&&f("done"),w)},z=()=>M.current&&l.current&&!N.current&&!b.current&&!y.current&&!T.current,r=A(e=>{clearTimeout(m.current),v(!1),!(!z()||d.current!=="idle")&&(m.current=window.setTimeout(()=>{!z()||d.current!=="idle"||(v(!0),m.current=window.setTimeout(()=>{v(!1),z()&&E(!0)},150))},e))},[]);S(()=>{if(s==="done"){let e=setTimeout(()=>f("idle"),1800);return()=>clearTimeout(e)}s==="idle"&&r(2200)},[s,r]),S(()=>{M.current=k,r(1200)},[k,r]),S(()=>{u.current=!0;let e=window.matchMedia("(prefers-reduced-motion: reduce)");N.current=e.matches;let g=()=>{N.current=e.matches,r(1200)};e.addEventListener("change",g);let w=new IntersectionObserver(([p])=>{let Y=l.current;l.current=p.isIntersecting,Y!==l.current&&r(2600)});return P.current&&w.observe(P.current),()=>{u.current=!1,e.removeEventListener("change",g),w.disconnect(),clearTimeout(m.current),clearTimeout(h.current),clearTimeout(D.current)}},[r]);let I=()=>{clearTimeout(h.current),T.current=!0,r(0)},$=()=>{clearTimeout(h.current),!(b.current||y.current)&&(h.current=window.setTimeout(()=>{T.current=!1,r(900)},1500))},X=O?"":s==="busy"?"Processing payment":s==="done"?x:"";return n(Q,{children:[a("style",{children:K}),n("div",{ref:P,className:"pyb-wrap",onPointerEnter:()=>{b.current=!0,I()},onPointerLeave:()=>{b.current=!1,$()},onFocus:()=>{y.current=!0,I()},onBlur:e=>{e.currentTarget.contains(e.relatedTarget)||(y.current=!1,$())},children:[n("button",{type:"button",className:"pyb","data-phase":s,"data-pressed":H||void 0,style:{"--pyb-tone":B,"--pyb-ok":q},onClick:()=>E(!1),"aria-disabled":s!=="idle","aria-label":s==="done"?x:s==="busy"?"Processing payment":`${o} ${L}`,children:[n("span",{className:"pyb-idle","aria-hidden":!0,children:[a("span",{children:o}),a("span",{className:"pyb-num",children:L})]}),n("span",{className:"pyb-status","aria-hidden":!0,children:[n("svg",{className:"pyb-ring",width:"20",height:"20",viewBox:"0 0 20 20",fill:"none",children:[a("circle",{className:"pyb-track",cx:"10",cy:"10",r:"8.5"}),a("g",{className:"pyb-spin",children:a("circle",{className:"pyb-arc",cx:"10",cy:"10",r:"8.5",pathLength:"100"})}),a("path",{className:"pyb-tick",d:"M6.3 10.3l2.5 2.5 5-5.2",pathLength:"100"})]}),a("span",{className:"pyb-done",children:a("span",{children:x})})]})]}),F?n("span",{className:"pyb-card","aria-hidden":!0,children:[a("span",{className:"pyb-dots",children:"\u2022\u2022\u2022\u2022"})," ",F]}):null,a("span",{className:"pyb-sr",role:"status","aria-live":"polite",children:X})]})]})}function J(i,c){let o=Number.isInteger(i);try{return new Intl.NumberFormat("en-US",{style:"currency",currency:c,minimumFractionDigits:o?0:2,maximumFractionDigits:2}).format(i)}catch{return`${c} ${o?i:i.toFixed(2)}`}}var K=`
.pyb-wrap {
  position: relative;
  display: inline-grid;
  justify-items: center;
  gap: 14px;
}
.pyb {
  --pyb-spring: cubic-bezier(.3, 1.5, .45, 1);
  position: relative;
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
  background: var(--pyb-ok);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.16),
    0 1px 2px rgba(17, 17, 17, 0.12),
    0 12px 26px -12px color-mix(in srgb, var(--pyb-ok) 75%, transparent);
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
  stroke: currentColor; stroke-width: 1.6; stroke-linecap: round;
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
  font: 400 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  color: #8a8a8a;
  white-space: nowrap;
}
.pyb-dots { letter-spacing: 0.1em; }

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
  .pyb[data-phase="done"] .pyb-arc, .pyb[data-phase="done"] .pyb-tick { transition: none; }
}
@keyframes pyb-pulse { from { opacity: 0.35; } to { opacity: 1; } }
`;export{G as default};
