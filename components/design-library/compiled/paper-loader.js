"use client";
/* Construct · Design library: the compiled preview of "Paper loader". The source is for members. */
import{Fragment as f,jsx as t,jsxs as i}from"react/jsx-runtime";var n=["polygon(50% 3%, 79% 11%, 97% 37%, 95% 68%, 76% 92%, 47% 98%, 19% 89%, 3% 63%, 5% 31%, 22% 10%)","polygon(7% 9%, 38% 5%, 70% 7%, 95% 6%, 93% 40%, 96% 72%, 92% 95%, 55% 93%, 6% 96%, 4% 52%)","polygon(46% 4%, 56% 18%, 72% 44%, 88% 70%, 98% 93%, 64% 94%, 30% 95%, 3% 92%, 17% 64%, 33% 30%)","polygon(11% 31%, 30% 9%, 52% 3%, 74% 10%, 92% 32%, 97% 62%, 96% 97%, 50% 95%, 5% 97%, 4% 60%)"],d=["#2b44c4","#e09a2b","#d8452f","#1e6a48"];function m({speed:s=1,caption:e="Cutting your shapes\u2026",colours:l=d,size:o=80}){let p=Math.min(3,Math.max(.25,s||1)),r=Math.round(2800/p);return i(f,{children:[t("style",{children:g}),i("div",{className:"ppl",role:"status","aria-label":e||"Loading",style:{"--dur":`${r}ms`,"--size":`${o}px`},children:[i("div",{className:"ppl-stage","aria-hidden":!0,children:[t("span",{className:"ppl-floor"}),l.map((c,a)=>t("span",{className:"ppl-piece",style:{"--c":c,"--a":n[a],"--b":n[(a+2)%4],"--dir":a%2?-1:1,"--turn":a%2?"-360deg":"360deg",animationDelay:`${-r*a/4}ms`},children:t("span",{className:"ppl-cut",style:{animationDelay:`${-r*a/4}ms`}})},a))]}),e?t("p",{className:"ppl-caption","aria-hidden":!0,children:e}):null]})]})}var g=`
.ppl {
  display: grid;
  justify-items: center;
  gap: 22px;
  font-family: inherit;
  color: #0b1f3a;
}
.ppl-stage {
  position: relative;
  width: calc(var(--size) * 2.6);
  height: calc(var(--size) * 2);
}
.ppl-floor {
  position: absolute;
  left: 50%;
  bottom: calc(var(--size) * 0.12);
  width: calc(var(--size) * 1.1);
  height: calc(var(--size) * 0.16);
  margin-left: calc(var(--size) * -0.55);
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(11, 31, 58, .16), rgba(11, 31, 58, 0));
  animation: ppl-floor calc(var(--dur) / 4) ease-in-out infinite;
}
@keyframes ppl-floor { 0%, 100% { transform: scaleX(1); } 40% { transform: scaleX(.86); opacity: .8; } }

.ppl-piece {
  position: absolute;
  left: 50%;
  top: 50%;
  width: var(--size);
  height: var(--size);
  margin: calc(var(--size) / -2) 0 0 calc(var(--size) / -2);
  /* the shadow follows the cut, because it is taken after the clip */
  filter:
    drop-shadow(0 1px 0 rgba(11, 31, 58, .14))
    drop-shadow(0 5px 6px rgba(11, 31, 58, .14));
  animation: ppl-move var(--dur) linear infinite both;
  will-change: transform;
}
.ppl-cut {
  position: absolute;
  inset: 0;
  /* paper: a flat colour, lit a little from the top left */
  background:
    linear-gradient(155deg, color-mix(in srgb, var(--c) 82%, #fff) 0%, var(--c) 46%, color-mix(in srgb, var(--c) 90%, #000) 100%);
  clip-path: var(--a);
  animation: ppl-cut var(--dur) linear infinite both;
}

@keyframes ppl-move {
  0% { transform: translate(-4px, -22px) rotate(-7deg); z-index: 4; animation-timing-function: cubic-bezier(.4, 0, .6, 1); }
  3% { transform: translate(calc(var(--dir) * -6px - 2px), -32px) rotate(calc(var(--dir) * -6deg - 7deg)) scale(1.05); z-index: 4; animation-timing-function: cubic-bezier(.3, 0, .4, 1); }
  11% { transform: translate(calc(var(--dir) * var(--size) * .95), calc(var(--size) * -.62)) rotate(calc(var(--dir) * 95deg)) scale(.96, .45); z-index: 4; animation-timing-function: cubic-bezier(.3, 0, .6, 1); }
  14% { transform: translate(calc(var(--dir) * var(--size) * 1.08), calc(var(--size) * -.08)) rotate(calc(var(--dir) * 170deg)) scale(.94, 1); z-index: 4; }
  14.5% { z-index: 0; }
  18% { transform: translate(calc(var(--dir) * var(--size) * .82), calc(var(--size) * .42)) rotate(calc(var(--dir) * 250deg)) scale(.96, .5); z-index: 0; animation-timing-function: cubic-bezier(.2, .7, .3, 1); }
  25% { transform: translate(5px, 20px) rotate(calc(var(--turn) + 8deg)); z-index: 1; }

  35% { transform: translate(5px, 20px) rotate(calc(var(--turn) + 8deg)); z-index: 1; animation-timing-function: cubic-bezier(.3, 1.45, .5, 1); }
  45% { transform: translate(-9px, 6px) rotate(calc(var(--turn) - 4deg)); z-index: 2; }

  60% { transform: translate(-9px, 6px) rotate(calc(var(--turn) - 4deg)); z-index: 2; animation-timing-function: cubic-bezier(.3, 1.45, .5, 1); }
  70% { transform: translate(9px, -8px) rotate(calc(var(--turn) + 6deg)); z-index: 3; }

  85% { transform: translate(9px, -8px) rotate(calc(var(--turn) + 6deg)); z-index: 3; animation-timing-function: cubic-bezier(.3, 1.45, .5, 1); }
  95% { transform: translate(-4px, -22px) rotate(calc(var(--turn) - 7deg)); z-index: 4; }
  100% { transform: translate(-4px, -22px) rotate(calc(var(--turn) - 7deg)); z-index: 4; }
}

/* mid-air it is re-cut into another shape and darkens as it turns its back;
   in the pile, the lower a piece sits the less light it gets */
@keyframes ppl-cut {
  0%, 3% { clip-path: var(--a); filter: brightness(1); animation-timing-function: cubic-bezier(.5, 0, .5, 1); }
  12% { clip-path: var(--b); filter: brightness(.8); animation-timing-function: cubic-bezier(.5, 0, .5, 1); }
  15% { filter: brightness(1); }
  19% { filter: brightness(.84); }
  24% { clip-path: var(--a); }
  25%, 35% { clip-path: var(--a); filter: brightness(.9); }
  45%, 60% { filter: brightness(.94); }
  70%, 85% { filter: brightness(.97); }
  95%, 100% { clip-path: var(--a); filter: brightness(1); }
}

.ppl-caption {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.005em;
  color: color-mix(in srgb, #0b1f3a 62%, transparent);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .ppl-piece, .ppl-cut, .ppl-floor { animation: none; }
  .ppl-piece:nth-child(2) { transform: translate(-4px, -22px) rotate(-7deg); z-index: 4; }
  .ppl-piece:nth-child(3) { transform: translate(5px, 20px) rotate(8deg); z-index: 1; }
  .ppl-piece:nth-child(4) { transform: translate(-9px, 6px) rotate(-4deg); z-index: 2; }
  .ppl-piece:nth-child(5) { transform: translate(9px, -8px) rotate(6deg); z-index: 3; }
  .ppl-caption { animation: ppl-breathe 2.4s ease-in-out infinite; }
  @keyframes ppl-breathe { 50% { opacity: .45; } }
}
`;export{m as default};
