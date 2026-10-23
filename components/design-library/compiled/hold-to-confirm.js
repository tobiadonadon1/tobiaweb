"use client";
/* Construct · Design library: the compiled preview of "Hold to confirm". The source is for members. */
import{useCallback as M,useEffect as x,useRef as u,useState as P}from"react";import{Fragment as z,jsx as t,jsxs as s}from"react/jsx-runtime";function T({label:o="Hold to delete",done:r="Deleted",tone:d="#e5484d",duration:p=1200,onConfirm:f}){let a=u(0),i=u(0),m=u(null),[n,c]=P("idle"),v=()=>m.current?.style.setProperty("--p",String(a.current)),l=M(e=>{cancelAnimationFrame(i.current);let b=performance.now(),w=y=>{let C=(y-b)/(e===1?p:p/2);if(b=y,a.current=Math.min(1,Math.max(0,a.current+C*e)),v(),e===1&&a.current>=1){c("done"),f?.();return}e===-1&&a.current<=0||(i.current=requestAnimationFrame(w))};i.current=requestAnimationFrame(w)},[p,f]),g=()=>{n!=="done"&&(c("holding"),l(1))},h=()=>{n==="holding"&&(c("idle"),l(-1))};return x(()=>{if(n!=="done")return;let e=setTimeout(()=>{c("idle"),l(-1)},1800);return()=>clearTimeout(e)},[n,l]),x(()=>()=>cancelAnimationFrame(i.current),[]),s(z,{children:[t("style",{children:S}),s("button",{ref:m,type:"button",className:"htc","data-state":n,style:{"--tone":d},onPointerDown:e=>{e.currentTarget.setPointerCapture(e.pointerId),g()},onPointerUp:h,onPointerCancel:h,onKeyDown:e=>{(e.key===" "||e.key==="Enter")&&!e.repeat&&(e.preventDefault(),g())},onKeyUp:e=>{(e.key===" "||e.key==="Enter")&&h()},onBlur:h,onContextMenu:e=>e.preventDefault(),"aria-label":n==="done"?r:`${o}. Press and hold to confirm.`,children:[t("span",{className:"htc-fill","aria-hidden":!0,children:t(k,{state:n,label:o,done:r})}),t("span",{className:"htc-base","aria-hidden":!0,children:t(k,{state:n,label:o,done:r})})]})]})}function k({state:o,label:r,done:d}){return s("span",{className:"htc-label",children:[s("span",{className:"htc-row","data-show":o==="idle",children:[t(N,{}),r]}),t("span",{className:"htc-row","data-show":o==="holding",children:"Keep holding"}),s("span",{className:"htc-row","data-show":o==="done",children:[t(L,{}),d]})]})}var N=()=>t("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:t("path",{d:"M4 7h16M10 11v6M14 11v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4h6v3"})}),L=()=>t("svg",{className:"htc-check",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round",strokeLinejoin:"round",children:t("path",{d:"M5 12.5l4.5 4.5L19 7.5"})}),S=`
.htc {
  --p: 0;
  position: relative;
  display: inline-grid;
  place-items: center;
  height: 52px;
  min-width: 220px;
  padding: 0 26px;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tone) 6%, #fffefb);
  color: var(--tone);
  font-family: inherit;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.005em;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  overflow: hidden;
  isolation: isolate;
  transition: transform 260ms cubic-bezier(.3, 1.4, .5, 1), box-shadow 260ms ease;
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--tone) 26%, transparent),
    0 1px 0 rgba(11, 31, 58, 0.04),
    0 12px 26px -18px rgba(11, 31, 58, 0.4);
}
.htc:focus-visible { outline: 2px solid var(--tone); outline-offset: 3px; }
.htc[data-state="holding"] { transform: scale(0.97); }
.htc[data-state="done"] { transform: scale(1); box-shadow: 0 10px 24px -12px var(--tone); }

/* The base label sits in the button's content box. The fill covers the
   whole button (padding included) and is cut off from the right with a
   straight edge; the button's own rounded corners do the rounding. */
.htc-base { grid-area: 1 / 1; display: grid; place-items: center; }
.htc-fill {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: grid;
  place-items: center;
  background: var(--tone);
  color: #fff;
  clip-path: inset(0 calc((1 - var(--p)) * 100%) 0 0);
}

/* Three labels stacked in one cell; only one is shown. The one leaving goes
   quickly, the one arriving springs in a beat later, and both travel far
   enough to leave the button entirely, so two never sit on top of each other. */
.htc-label { display: grid; }
.htc-row {
  grid-area: 1 / 1;
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(30px);
  transition: transform 200ms cubic-bezier(.4, 0, 1, 1), opacity 120ms ease;
}
.htc-row[data-show="true"] {
  opacity: 1;
  transform: none;
  transition: transform 420ms cubic-bezier(.3, 1.3, .5, 1) 60ms, opacity 200ms ease 60ms;
}
.htc-row[data-show="false"]:first-child { transform: translateY(-30px); }
/* Icons: set explicitly, so a site's global svg rule can't move them. */
.htc-row svg { display: block; flex: none; }

.htc-check path { stroke-dasharray: 24; stroke-dashoffset: 24; }
.htc[data-state="done"] .htc-check path { animation: htc-draw 380ms 140ms cubic-bezier(.6, 0, .2, 1) forwards; }
@keyframes htc-draw { to { stroke-dashoffset: 0; } }

@media (prefers-reduced-motion: reduce) {
  .htc, .htc-row, .htc-row[data-show="true"] { transition: opacity 120ms ease; }
  .htc-row, .htc-row[data-show="false"]:first-child { transform: none; }
  .htc[data-state="holding"] { transform: none; }
  .htc[data-state="done"] .htc-check path { animation: none; stroke-dashoffset: 0; }
}
`;export{T as default};
