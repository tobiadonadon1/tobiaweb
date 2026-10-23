"use client";
/* Construct · Design library: the compiled preview of "Copy field". The source is for members. */
import{useEffect as S,useRef as b,useState as f}from"react";import{Fragment as d,jsx as t,jsxs as e}from"react/jsx-runtime";function T({command:o="npx create-next-app@latest my-app",prompt:s="$",tone:x="#2b44c4",label:g="Copy command",onCopy:y}){let[n,l]=f("idle"),[i,w]=f(0),[m,k]=f("\u2318C"),h=b(null),p=b(void 0),v=async()=>{let a=!1;try{navigator.clipboard?.writeText&&(await navigator.clipboard.writeText(o),a=!0)}catch{a=!1}if(!a){let r=h.current,c=typeof window<"u"?window.getSelection():null;if(r&&c){let u=document.createRange();u.selectNodeContents(r),c.removeAllRanges(),c.addRange(u)}k(/Mac|iPhone|iPad/.test(navigator.platform||navigator.userAgent)?"\u2318C":"Ctrl+C")}l(a?"copied":"manual"),w(r=>r+1),a&&y?.(),clearTimeout(p.current),p.current=setTimeout(()=>l("idle"),a?1800:2600)};S(()=>()=>clearTimeout(p.current),[]);let C=n!=="idle",N=n==="manual"?`Press ${m}`:"Copied";return e(d,{children:[t("style",{children:P}),e("div",{className:"cpf","data-state":n,style:{"--tone":x},children:[t("span",{className:"cpf-prompt","aria-hidden":!0,children:s}),e("span",{className:"cpf-cmd",children:[i>0&&t("span",{className:"cpf-sweep","aria-hidden":!0},i),t("code",{ref:h,className:"cpf-code",children:t(M,{text:o})})]}),e("span",{className:"cpf-btnwrap",children:[i>0&&t("span",{className:"cpf-tag","aria-hidden":!0,"data-show":C,children:N}),t("button",{type:"button",className:"cpf-btn",onClick:v,"aria-label":g,children:e("svg",{className:"cpf-icon",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[e("g",{className:"cpf-copy",children:[t("path",{className:"cpf-back",d:"M15.5 8V6.5A2.5 2.5 0 0 0 13 4H6.5A2.5 2.5 0 0 0 4 6.5V13a2.5 2.5 0 0 0 2.5 2.5H8"}),t("rect",{className:"cpf-front",x:"8.5",y:"8.5",width:"11.5",height:"11.5",rx:"2.5",pathLength:1})]}),t("path",{className:"cpf-check",d:"M5.5 12.5l4.2 4.2L18.5 7.8",pathLength:1,strokeWidth:"2.4"})]})})]}),t("span",{className:"cpf-sr",role:"status","aria-live":"polite",children:n==="copied"?"Copied to clipboard":n==="manual"?`Command selected. Press ${m} to copy.`:""})]})]})}function M({text:o}){let s=/^((?:npx|bunx|pnpm dlx|yarn dlx)\s+|\S+\s+(?:(?:install|add|i|-D|--save-dev)\s+)+)(.*)$/.exec(o);return s?e(d,{children:[t("span",{className:"cpf-dim",children:s[1]}),s[2]]}):t(d,{children:o})}var P=`
.cpf {
  --ink: #0b1f3a;
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 54px;
  padding: 0 7px 0 18px;
  border-radius: 16px;
  background: #fffefb;
  color: var(--ink);
  font-family: inherit;
  box-shadow:
    inset 0 0 0 1px rgba(11, 31, 58, 0.12),
    0 1px 0 rgba(11, 31, 58, 0.04),
    0 14px 30px -22px rgba(11, 31, 58, 0.45);
  transition: box-shadow 500ms ease;
}
.cpf[data-state="copied"] {
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--tone) 45%, transparent),
    0 0 0 4px color-mix(in srgb, var(--tone) 10%, transparent),
    0 14px 30px -22px rgba(11, 31, 58, 0.45);
  transition-duration: 140ms;
}
.cpf-prompt {
  font: 600 14.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  color: var(--tone);
  margin-right: 10px;
  user-select: none;
  -webkit-user-select: none;
}
.cpf-cmd { position: relative; display: inline-flex; margin-right: 14px; }
.cpf-code {
  position: relative;
  font: 500 14.5px/1.5 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: var(--ink);
}
.cpf-dim { color: color-mix(in srgb, var(--ink) 52%, transparent); }
.cpf-code::selection, .cpf-code *::selection { background: color-mix(in srgb, var(--tone) 22%, transparent); }

/* The sweep: a selection-coloured band that wipes in left to right, then fades. */
.cpf-sweep {
  position: absolute;
  inset: -1px -4px;
  border-radius: 5px;
  background: color-mix(in srgb, var(--tone) 16%, transparent);
  clip-path: inset(0 100% 0 0 round 5px);
  animation: cpf-sweep 900ms cubic-bezier(.3, .7, .2, 1) forwards;
  pointer-events: none;
}
@keyframes cpf-sweep {
  0%   { clip-path: inset(0 100% 0 0 round 5px); opacity: 1; }
  32%  { clip-path: inset(0 0 0 0 round 5px); opacity: 1; }
  60%  { clip-path: inset(0 0 0 0 round 5px); opacity: 1; }
  100% { clip-path: inset(0 0 0 0 round 5px); opacity: 0; }
}

.cpf-btnwrap { position: relative; display: inline-grid; }
.cpf-btn {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 11px;
  background: color-mix(in srgb, var(--tone) 9%, #fff);
  color: var(--tone);
  cursor: pointer;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tone) 16%, transparent);
  transition: background-color 220ms ease, color 220ms ease, transform 300ms cubic-bezier(.3, 1.5, .5, 1), box-shadow 220ms ease;
  -webkit-tap-highlight-color: transparent;
}
.cpf-btn:hover { background: color-mix(in srgb, var(--tone) 15%, #fff); }
.cpf-btn:active { transform: scale(0.92); transition-duration: 90ms; }
.cpf-btn:focus-visible { outline: 2px solid var(--tone); outline-offset: 2px; }
.cpf[data-state="copied"] .cpf-btn {
  background: var(--tone);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 14px -8px var(--tone);
}

/* The icon: the front square un-draws, the back one tucks away, the check draws in. */
.cpf-icon { display: block; overflow: visible; }
.cpf-copy {
  transform-origin: 12px 12px;
  transition: transform 380ms cubic-bezier(.3, 1.4, .5, 1), opacity 220ms ease;
}
.cpf-front {
  stroke-dasharray: 1 2;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 260ms cubic-bezier(.5, 0, .2, 1);
}
.cpf-back { transition: opacity 200ms ease; }
.cpf-check {
  stroke-dasharray: 1 2;
  stroke-dashoffset: 1;
  opacity: 0;
  transition: stroke-dashoffset 120ms ease-in, opacity 120ms ease-in;
}
.cpf[data-state="copied"] .cpf-copy { transform: scale(0.7) rotate(-8deg); opacity: 0; transition-duration: 260ms, 180ms; }
.cpf[data-state="copied"] .cpf-front { stroke-dashoffset: -1; }
.cpf[data-state="copied"] .cpf-back { opacity: 0; }
.cpf[data-state="copied"] .cpf-check {
  stroke-dashoffset: 0;
  opacity: 1;
  transition: stroke-dashoffset 340ms 90ms cubic-bezier(.6, 0, .2, 1), opacity 60ms 90ms linear;
}

/* The tag rises out of the button with a little overshoot, and leaves
   faster, drifting on upwards. (It only exists after the first copy, so the
   page never plays the exit on load.) */
.cpf-tag {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  padding: 6px 9px;
  border-radius: 8px;
  background: var(--ink);
  color: #faf8f2;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.005em;
  white-space: nowrap;
  pointer-events: none;
  transform-origin: 50% 100%;
  box-shadow: 0 8px 18px -10px rgba(11, 31, 58, 0.6);
}
.cpf-tag::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 100%;
  width: 8px;
  height: 8px;
  background: inherit;
  border-radius: 0 0 2px 0;
  transform: translate(-50%, -5px) rotate(45deg);
}
.cpf-tag[data-show="true"] { animation: cpf-in 440ms 40ms cubic-bezier(.2, .8, .3, 1) both; }
.cpf-tag[data-show="false"] { animation: cpf-out 180ms ease-in forwards; }
@keyframes cpf-in {
  0%   { opacity: 0; transform: translate(-50%, 9px) scale(0.86); }
  55%  { opacity: 1; transform: translate(-50%, -2px) scale(1.03); }
  100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
}
@keyframes cpf-out {
  from { opacity: 1; transform: translate(-50%, 0) scale(1); }
  to   { opacity: 0; transform: translate(-50%, -6px) scale(0.97); }
}

.cpf-sr {
  position: absolute;
  width: 1px; height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@keyframes cpf-glow { from { opacity: 1; } to { opacity: 0; } }
@keyframes cpf-fade { from { opacity: 0; transform: translate(-50%, 0); } to { opacity: 1; transform: translate(-50%, 0); } }

@media (prefers-reduced-motion: reduce) {
  .cpf-sweep { clip-path: none; animation: cpf-glow 900ms ease forwards; }
  .cpf-copy, .cpf-front, .cpf-check, .cpf-btn { transition-duration: 1ms !important; transition-delay: 0ms !important; }
  .cpf-tag[data-show="true"] { animation: cpf-fade 120ms ease both; }
  .cpf-tag[data-show="false"] { animation: cpf-fade 120ms ease reverse forwards; }
  .cpf[data-state="copied"] .cpf-copy { transform: none; }
}
`;export{T as default};
