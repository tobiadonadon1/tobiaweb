"use client";
/* Construct · Design library: the compiled preview of "Envelope". The source is for members. */
import{useRef as m,useState as v}from"react";import{Fragment as b,jsx as e,jsxs as n}from"react/jsx-runtime";function g({message:r="You're in. Welcome to Construct.",from:i="Tobia",heading:d="Construct \xB7 23 Oct",tone:c="#d8452f",label:p="Open the letter"}){let[s,a]=v(!1),[l,f]=v(!1);s&&!l&&f(!0);let o=m("mouse");return n(b,{children:[e("style",{children:u}),n("button",{type:"button",className:"env","data-open":s,"data-opened":l||void 0,"aria-expanded":s,"aria-label":s?`${p}: ${r} From ${i}.`:p,style:{"--tone":c},onPointerEnter:t=>t.pointerType!=="touch"&&a(!0),onPointerLeave:t=>{t.pointerType!=="touch"&&(t.currentTarget.matches(":focus-visible")||a(!1))},onPointerDown:t=>o.current=t.pointerType,onFocus:t=>t.currentTarget.matches(":focus-visible")&&a(!0),onBlur:()=>a(!1),onClick:t=>{(t.detail===0||o.current==="touch")&&a(h=>!h),o.current="mouse"},children:[e("span",{className:"env-shadow","aria-hidden":!0}),n("span",{className:"env-body","aria-hidden":!0,children:[e("span",{className:"env-back"}),n("span",{className:"env-letter",children:[e("span",{className:"env-head",children:d}),e("span",{className:"env-msg",children:r}),n("span",{className:"env-sign",children:[e("span",{children:i}),e("svg",{className:"env-squiggle",width:"74",height:"10",viewBox:"0 0 74 10",fill:"none",children:e("path",{d:"M2 6.5C10 2.5 16 9 24 5.5S38 2 46 5.8 62 8.4 72 3.2",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round"})})]})]}),n("svg",{className:"env-front",viewBox:"0 0 264 172",preserveAspectRatio:"none",children:[e("path",{className:"env-side",d:"M0 0 L122 76 Q132 84 142 76 L264 0 V172 H0 Z"}),e("path",{className:"env-fold-l",d:"M0 0 L123 77 Q135 84 123 91 L0 172 Z"}),e("path",{className:"env-fold-r",d:"M264 0 L141 77 Q129 84 141 91 L264 172 Z"}),e("path",{className:"env-bottom",d:"M0 172 L121 99 Q132 92 143 99 L264 172 Z"}),e("path",{className:"env-crease",d:"M1 171.5 L121 99 Q132 92 143 99 L263 171.5"}),e("path",{className:"env-lip",d:"M0 0.5 L122 76.5 Q132 84.5 142 76.5 L264 0.5"})]}),n("span",{className:"env-flap",children:[n("span",{className:"env-face env-face-out",children:[n("svg",{viewBox:"0 0 264 92",preserveAspectRatio:"none",children:[e("path",{className:"env-flap-shade",d:"M0 0 H264 L142 83 Q132 90 122 83 Z"}),e("path",{d:"M0 0 H264 L142 80 Q132 87 122 80 Z"})]}),e("span",{className:"env-seal",children:n("svg",{width:"40",height:"40",viewBox:"0 0 34 34",children:[e("circle",{className:"env-seal-shade",cx:"17",cy:"18",r:"14.8"}),e("path",{className:"env-seal-edge",d:"M17 1.5l2.6 2.2 3.3-.8 1.4 3.1 3.3.9-.2 3.4 2.6 2.2-1.6 3 1.6 3-2.6 2.2.2 3.4-3.3.9-1.4 3.1-3.3-.8L17 32.5l-2.6-2.2-3.3.8-1.4-3.1-3.3-.9.2-3.4L4 21.5l1.6-3-1.6-3 2.6-2.2-.2-3.4 3.3-.9 1.4-3.1 3.3.8z"}),e("circle",{className:"env-seal-dot",cx:"17",cy:"17",r:"9"}),e("path",{className:"env-seal-star",d:"M17 11.6l1.5 3.6 3.9.3-3 2.5.9 3.8L17 19.8l-3.3 2 .9-3.8-3-2.5 3.9-.3z"})]})})]}),e("span",{className:"env-face env-face-in",children:n("svg",{viewBox:"0 0 264 92",preserveAspectRatio:"none",children:[e("path",{d:"M0 92 H264 L142 12 Q132 5 122 12 Z"}),e("path",{className:"env-lining",d:"M16 92 H248 L140 22 Q132 16 124 22 Z"})]})})]}),e("span",{className:"env-sheen"})]})]})]})}var u=`
.env {
  --tone: #d8452f;
  --ink: #0b1f3a;
  --cream: #faf8f2;
  --lift: cubic-bezier(.3, 1.35, .5, 1);
  --fold: cubic-bezier(.55, .05, .25, 1);
  position: relative;
  display: block;
  width: 264px;
  height: 172px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  border-radius: 10px;
}
.env:focus-visible { outline: none; }
.env:focus-visible .env-body { outline: 2px solid var(--tone); outline-offset: 6px; }

.env-body {
  position: absolute; inset: 0;
  display: block;
  border-radius: 8px;
  transition: transform 300ms var(--fold) 120ms;
}
.env[data-open="true"] .env-body { transform: translateY(26px); transition: transform 520ms var(--lift) 120ms; }

/* The shadow on the table: tighter and darker as the envelope settles. */
.env-shadow {
  position: absolute; left: 6%; right: 6%; bottom: -16px; height: 26px;
  border-radius: 50%;
  background: radial-gradient(closest-side, color-mix(in srgb, var(--ink) 34%, transparent), transparent);
  filter: blur(4px);
  opacity: .7;
  transform: translateY(0) scaleX(.96);
  transition: transform 300ms var(--fold) 120ms, opacity 300ms ease 120ms;
}
.env[data-open="true"] .env-shadow {
  opacity: 1;
  transform: translateY(24px) scaleX(1.04);
  transition: transform 520ms var(--lift) 120ms, opacity 400ms ease 120ms;
}

.env-back {
  position: absolute; inset: 0;
  border-radius: 7px;
  background: color-mix(in srgb, var(--tone) 62%, var(--ink));
  box-shadow: inset 0 14px 18px -10px color-mix(in srgb, var(--ink) 55%, transparent);
}

/* The letter. Closed it hides behind the pocket; open it rises 104px. */
.env-letter {
  position: absolute; left: 16px; right: 16px; top: 8px; height: 160px;
  display: flex; flex-direction: column; align-items: center;
  padding: 14px 16px 0;
  border-radius: 5px;
  background:
    linear-gradient(to bottom, transparent 0 27px, color-mix(in srgb, var(--tone) 22%, transparent) 27px 28px, transparent 28px),
    var(--cream);
  box-shadow: 0 1px 0 rgba(255,255,255,.9) inset, 0 6px 14px -8px color-mix(in srgb, var(--ink) 50%, transparent);
  color: var(--ink);
  text-align: center;
  transform: translateY(0) rotate(0deg);
  transition: transform 260ms cubic-bezier(.5, 0, .9, .6);
}
.env[data-open="true"] .env-letter {
  transform: translateY(-104px) rotate(-1.2deg);
  transition: transform 640ms var(--lift) 230ms;
}
.env-head {
  font: 500 9.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .08em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--ink) 55%, transparent);
  white-space: nowrap;
}
.env-msg {
  margin-top: 14px;
  max-width: 190px;
  font-size: 17px;
  line-height: 1.22;
  font-weight: 560;
  letter-spacing: -0.015em;
  text-wrap: balance;
  transform: rotate(-1.6deg);
}
.env-sign {
  position: relative;
  margin-top: 8px;
  display: grid; justify-items: center;
  font-size: 12.5px; font-weight: 500;
  color: color-mix(in srgb, var(--tone) 82%, var(--ink));
  transform: rotate(-3deg) translateX(34px);
}
.env-squiggle { margin-top: 1px; }
.env-squiggle path { stroke-dasharray: 80; stroke-dashoffset: 80; transition: stroke-dashoffset 160ms ease; }
.env[data-open="true"] .env-squiggle path { stroke-dashoffset: 0; transition: stroke-dashoffset 520ms cubic-bezier(.6, 0, .3, 1) 640ms; }

/* The front pocket. */
.env-front { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.env-side { fill: var(--tone); }
.env-fold-l { fill: color-mix(in srgb, var(--tone) 92%, var(--ink)); }
.env-fold-r { fill: color-mix(in srgb, var(--tone) 88%, var(--ink)); }
.env-bottom { fill: color-mix(in srgb, var(--tone) 90%, #fff); }
.env-crease { fill: none; stroke: rgba(255,255,255,.26); stroke-width: 1; }
.env-lip { fill: none; stroke: color-mix(in srgb, var(--tone) 70%, #fff); stroke-width: 1.2; opacity: .55; }
.env-front { border-radius: 7px; overflow: hidden; }

/* The flap. Closed it sits on top of everything; once it has turned past
   90\xB0 it drops behind the letter (z-index flips halfway through the turn). */
.env-flap {
  position: absolute; left: 0; right: 0; top: 0; height: 92px;
  border-radius: 7px 7px 0 0;
  z-index: 4;
  transform-origin: 50% 0;
  transform-style: preserve-3d;
  transform: perspective(640px) rotateX(0deg);
  transition: transform 380ms var(--fold) 170ms;
}
.env[data-open="true"] .env-flap {
  z-index: 0;
  transform: perspective(640px) rotateX(180deg);
  transition: transform 460ms var(--fold);
  animation: env-flap-down 460ms both;
}
/* Closing (only after it has been opened once, so nothing plays on load):
   it stays behind the letter until it is past upright again. */
.env[data-open="false"][data-opened] .env-flap { animation: env-flap-up 560ms both; }
@keyframes env-flap-down { 0%, 44.9% { z-index: 4; } 45%, 100% { z-index: 0; } }
@keyframes env-flap-up { 0%, 60.9% { z-index: 0; } 61%, 100% { z-index: 4; } }
/* Opening, the turn passes upright at about 45%; closing (after its 170ms
   delay), at about 61%. */
@keyframes env-show-1st { 0%, 44.9% { opacity: 1; } 45%, 100% { opacity: 0; } }
@keyframes env-show-2nd { 0%, 44.9% { opacity: 0; } 45%, 100% { opacity: 1; } }
@keyframes env-hide-late { 0%, 60.9% { opacity: 1; } 61%, 100% { opacity: 0; } }
@keyframes env-show-late { 0%, 60.9% { opacity: 0; } 61%, 100% { opacity: 1; } }
.env-letter { z-index: 1; }
.env-back { z-index: 0; }
.env-front { z-index: 2; }

.env-face {
  position: absolute; inset: 0;
  display: block;
}
/* Closed: the outside shows. Open: the lining. While it turns, the keyframes
   swap them (and the flap's z-index) when it passes upright. */
.env-face-in { opacity: 0; }
.env[data-open="true"] .env-face-in { opacity: 1; animation: env-show-2nd 460ms both; }
.env[data-open="true"] .env-face-out { opacity: 0; animation: env-show-1st 460ms both; }
.env[data-open="false"][data-opened] .env-face-in { animation: env-hide-late 560ms both; }
.env[data-open="false"][data-opened] .env-face-out { animation: env-show-late 560ms both; }
.env-face > svg { position: absolute; inset: 0; display: block; width: 100%; height: 100%; overflow: hidden; }
/* round the two corners at the hinge, like the envelope under it */
.env-face-out > svg { border-radius: 7px 7px 0 0; }
.env-face-in > svg { border-radius: 0 0 7px 7px; }
.env-face-out { transform: translateZ(0.5px); }
.env-face-out > svg > path { fill: color-mix(in srgb, var(--tone) 94%, #fff); }
.env-face-out .env-flap-shade { fill: color-mix(in srgb, var(--ink) 22%, transparent); }
.env-face-in { transform: rotateX(180deg) translateZ(0.5px); }
.env-face-in > svg > path { fill: color-mix(in srgb, var(--tone) 72%, var(--ink)); }
.env-face-in .env-lining { fill: color-mix(in srgb, var(--tone) 22%, var(--cream)); }

/* The seal rides on the flap's outer face (and turns away with it). */
.env-seal {
  position: absolute; left: 50%; top: 62px;
  width: 40px; height: 40px; margin-left: -20px;
}
.env-seal svg { display: block; overflow: visible; }
.env-seal-shade { fill: color-mix(in srgb, var(--ink) 22%, transparent); }
.env-seal-edge { fill: var(--cream); }
.env-seal-dot { fill: var(--tone); }
.env-seal-star { fill: var(--cream); }

/* A soft light from the top left, over the whole paper. */
.env-sheen {
  position: absolute; inset: 0; z-index: 5;
  border-radius: 7px;
  pointer-events: none;
  background: linear-gradient(160deg, rgba(255,255,255,.16), rgba(255,255,255,0) 45%, rgba(0,0,0,.06));
}

@media (hover: hover) {
  .env:not([data-open="true"]):hover .env-seal { transform: rotate(-8deg); }
}
.env-seal { transition: transform 300ms var(--lift); }

@media (prefers-reduced-motion: reduce) {
  .env-body, .env-shadow, .env[data-open="true"] .env-body, .env[data-open="true"] .env-shadow,
  .env-flap, .env[data-open="true"] .env-flap, .env-seal,
  .env-squiggle path, .env[data-open="true"] .env-squiggle path { transition: none; }
  .env[data-open="true"] .env-flap, .env[data-open="false"][data-opened] .env-flap,
  .env[data-open] .env-face { animation: none !important; }
  /* The letter fades in where it ends up, and fades out before it drops. */
  .env-letter { opacity: 0; transition: opacity 140ms ease, transform 0s 140ms; }
  .env[data-open="true"] .env-letter { opacity: 1; transform: translateY(-104px); transition: opacity 180ms ease; }
}
`;export{g as default};
