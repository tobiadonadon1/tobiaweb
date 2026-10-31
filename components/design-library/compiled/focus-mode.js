"use client";
/* Construct · Design library: the compiled preview of "Focus". The source is for members. */
import{useEffect as y,useRef as E,useState as k}from"react";import{Fragment as C,jsx as a,jsxs as o}from"react/jsx-runtime";function N({label:c="Focus",until:f="12:00",quiet:g=6,defaultOn:h=!0,accent:t="#7b5cff",second:m="#4cc2ff",autoplay:b=!0,onChange:l}){let s=E(null),r=T(s,b),[e,d]=k(h);y(()=>{if(!r)return;let n=window.setTimeout(()=>d(x=>!x),e?3400:2400);return()=>window.clearTimeout(n)},[r,e]);let p=()=>{let n=!e;d(n),l?.(n)};return o(C,{children:[a("style",{children:z}),o("div",{ref:s,className:"fm","data-on":e||void 0,style:{"--fm-accent":t,"--fm-second":m},onClick:n=>{n.target.closest(".fm-switch")||p()},children:[o("span",{className:"fm-glow","aria-hidden":!0,children:[a("span",{className:"fm-glow-in fm-glow-a"}),a("span",{className:"fm-glow-in fm-glow-b"})]}),a("span",{className:"fm-grain","aria-hidden":!0}),o("div",{className:"fm-head",children:[a("span",{className:"fm-dot","aria-hidden":!0}),c]}),a("span",{className:"fm-tile","aria-hidden":!0,children:a("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:a("path",{d:"M19.5 14.2A7.5 7.5 0 0 1 9.8 4.5a7.5 7.5 0 1 0 9.7 9.7z"})})}),o("div",{className:"fm-state","aria-hidden":!0,children:[o("span",{className:"fm-roll fm-big",children:[a("span",{className:"fm-w","data-show":e,children:"On"}),a("span",{className:"fm-w","data-show":!e,children:"Off"})]}),o("span",{className:"fm-roll fm-sub",children:[o("span",{className:"fm-w","data-show":e,children:["Until ",f," \xB7 ",g," apps quiet"]}),a("span",{className:"fm-w","data-show":!e,children:"Notifications on"})]})]}),a("button",{type:"button",role:"switch","aria-checked":e,"aria-label":`${c}${e?`, until ${f}, ${g} apps quiet`:""}`,className:"fm-switch",onClick:p,children:a("span",{className:"fm-knob"})})]})]})}function T(c,f){let[g,h]=k(!1);return y(()=>{let t=c.current;if(!t)return;let m=window.matchMedia("(prefers-reduced-motion: reduce)"),b=!1,l=!1,s=!1,r=0,e=(i=0)=>{window.clearTimeout(r);let v=f&&b&&!l&&!s&&!m.matches;!v||!i?h(v):r=window.setTimeout(()=>h(!0),i)},d=new IntersectionObserver(([i])=>{b=i.isIntersecting,e()});d.observe(t);let p=()=>{l=!0,e()},n=()=>{l=!1,e(1500)},x=()=>{s=!0,e()},u=i=>{i.relatedTarget instanceof Node&&t.contains(i.relatedTarget)||(s=!1,e(1500))},w=()=>e();return t.addEventListener("pointerenter",p),t.addEventListener("pointerleave",n),t.addEventListener("focusin",x),t.addEventListener("focusout",u),m.addEventListener("change",w),()=>{window.clearTimeout(r),d.disconnect(),t.removeEventListener("pointerenter",p),t.removeEventListener("pointerleave",n),t.removeEventListener("focusin",x),t.removeEventListener("focusout",u),m.removeEventListener("change",w)}},[c,f]),g}var L=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 2.2 0 0 0 -.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,z=`
.fm {
  --fm-spring: cubic-bezier(.3, 1.45, .5, 1);
  position: relative;
  box-sizing: border-box;
  display: flex; flex-direction: column; align-items: flex-start;
  width: 280px; max-width: 100%;
  height: 292px;
  padding: 22px 24px 24px;
  border-radius: 28px;
  background: linear-gradient(160deg, #17161d 0%, #101013 55%, #0d0d10 100%);
  color: #fff;
  font-family: inherit;
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .06),
    0 0 0 1px rgb(0 0 0 / .05),
    0 1px 2px rgb(0 0 0 / .06),
    0 14px 34px -14px rgb(0 0 0 / .34);
  transition: box-shadow 600ms ease;
}
.fm[data-on] {
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .08),
    0 0 0 1px rgb(0 0 0 / .05),
    0 1px 2px rgb(0 0 0 / .06),
    0 16px 38px -16px color-mix(in srgb, var(--fm-accent) 45%, rgb(0 0 0 / .4));
}

/* The grain, over the light so the glow is grained too. */
.fm-grain {
  position: absolute; inset: 0; z-index: -1;
  background-image: ${L};
  background-size: 160px 160px;
  opacity: .06;
  pointer-events: none;
}

/* The aurora: two soft lights in the top-right corner, the main colour and
   a second one, each breathing and drifting on its own slow loop so they
   never line up the same way twice. Off, only a faint ember of it remains. */
.fm-glow {
  position: absolute; z-index: -2; inset: 0;
  pointer-events: none;
  opacity: .14;
  transform: scale(.7);
  transform-origin: 85% 10%;
  transition: opacity 500ms ease, transform 700ms cubic-bezier(.4, 0, .2, 1);
}
.fm[data-on] .fm-glow {
  opacity: 1; transform: none;
  transition: opacity 900ms ease, transform 1200ms cubic-bezier(.2, .8, .2, 1);
}
.fm-glow-in {
  position: absolute; border-radius: 50%;
  animation-play-state: paused;
}
.fm[data-on] .fm-glow-in { animation-play-state: running; }
.fm-glow-a {
  width: 380px; height: 380px;
  right: -140px; top: -160px;
  background: radial-gradient(closest-side,
    color-mix(in srgb, var(--fm-accent) 70%, transparent),
    color-mix(in srgb, var(--fm-accent) 28%, transparent) 45%,
    color-mix(in srgb, var(--fm-accent) 0%, transparent));
  animation: fm-drift-a 11s ease-in-out infinite;
}
.fm-glow-b {
  width: 330px; height: 330px;
  left: -20px; top: -185px;
  background: radial-gradient(closest-side,
    color-mix(in srgb, var(--fm-second) 72%, transparent),
    color-mix(in srgb, var(--fm-second) 26%, transparent) 48%,
    color-mix(in srgb, var(--fm-second) 0%, transparent));
  mix-blend-mode: screen;
  animation: fm-drift-b 14s ease-in-out infinite;
}
@keyframes fm-drift-a {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: .85; }
  50% { transform: translate(-18px, 14px) scale(1.1); opacity: 1; }
}
@keyframes fm-drift-b {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: .7; }
  33% { transform: translate(-22px, 16px) scale(1.12); opacity: 1; }
  66% { transform: translate(18px, 26px) scale(.94); opacity: .8; }
}

.fm-head {
  display: flex; align-items: center; gap: 9px;
  font-size: 13px; line-height: 1; color: #8d8d92;
}
.fm-dot {
  width: 6px; height: 6px; border-radius: 50%; flex: none;
  background: #4a4a50;
  transition: background-color 400ms ease, box-shadow 400ms ease;
}
.fm[data-on] .fm-dot {
  background: var(--fm-accent);
  box-shadow: 0 0 8px 1px color-mix(in srgb, var(--fm-accent) 70%, transparent);
}

/* The moon tile. Off: dim and tipped back. On: lit from inside with a soft
   violet light, and upright. */
.fm-tile {
  position: relative;
  display: grid; place-items: center;
  width: 56px; height: 56px; margin-top: 28px;
  border-radius: 50%;
  background: #1c1b21;
  color: #5c5c62;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / .05);
  transition: color 400ms ease, box-shadow 500ms ease;
}
.fm-tile::before {
  content: "";
  position: absolute; inset: 0; border-radius: inherit;
  background: radial-gradient(circle at 34% 30%,
    color-mix(in srgb, var(--fm-accent) 55%, #2a2833) 0%,
    color-mix(in srgb, var(--fm-accent) 20%, #1e1d24) 55%,
    #1b1a20 100%);
  opacity: 0;
  transition: opacity 500ms ease;
}
.fm-tile svg {
  position: relative;
  display: block;
  transform: rotate(-35deg) scale(.86);
  transition: transform 420ms cubic-bezier(.4, 0, .2, 1), filter 500ms ease;
}
.fm[data-on] .fm-tile {
  color: #f4f0ff;
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / .1),
    inset 0 -6px 14px -6px color-mix(in srgb, var(--fm-accent) 60%, transparent),
    0 0 26px -6px color-mix(in srgb, var(--fm-accent) 60%, transparent),
    0 6px 18px -8px rgb(0 0 0 / .6);
}
.fm[data-on] .fm-tile::before { opacity: 1; }
.fm[data-on] .fm-tile svg {
  transform: rotate(0deg);
  filter: drop-shadow(0 0 6px color-mix(in srgb, #fff 45%, var(--fm-accent)));
  transition: transform 700ms var(--fm-spring), filter 500ms ease;
}

/* The words: both versions stacked in one window, like a two-word wheel:
   "On" lives above, "Off" below, and the window rolls between them. */
.fm-state { display: grid; gap: 8px; margin-top: auto; }
.fm-roll { display: grid; overflow: hidden; }
.fm-big {
  height: 46px;
  font-size: 44px; font-weight: 400; line-height: 46px; letter-spacing: -0.045em;
}
.fm-sub { height: 16px; font-size: 12.5px; line-height: 16px; color: #9a99a3; white-space: nowrap; }
.fm-w {
  grid-area: 1 / 1;
  transform: translateY(-100%); opacity: 0;
  transition: transform 260ms cubic-bezier(.4, 0, 1, 1), opacity 180ms ease;
}
.fm-w[data-show="true"] {
  transform: none; opacity: 1;
  transition: transform 520ms var(--fm-spring) 70ms, opacity 240ms ease 70ms;
}
.fm-w[data-show="false"]:last-child { transform: translateY(100%); }

/* The switch: grey off, a violet-to-blue gradient on (faded in, since
   gradients don't transition). */
.fm-switch {
  position: relative; flex: none;
  width: 54px; height: 32px; margin-top: 18px;
  padding: 0; border: 0; border-radius: 99px;
  background: #34343a;
  box-shadow: inset 0 1px 2px rgb(0 0 0 / .35);
  cursor: pointer;
  isolation: isolate;
  transition: box-shadow 300ms ease;
  -webkit-tap-highlight-color: transparent;
}
.fm-switch::before {
  content: "";
  position: absolute; inset: 0; z-index: -1; border-radius: inherit;
  background: linear-gradient(90deg, var(--fm-accent), color-mix(in oklab, var(--fm-second) 55%, #3d3df5));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .22);
  opacity: 0;
  transition: opacity 300ms ease;
}
.fm-switch[aria-checked="true"] {
  box-shadow: 0 0 18px -4px color-mix(in srgb, var(--fm-accent) 75%, transparent);
}
.fm-switch[aria-checked="true"]::before { opacity: 1; }
.fm-switch:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
.fm-knob {
  position: absolute; top: 3px; left: 3px;
  width: 26px; height: 26px; border-radius: 99px;
  background: #fff;
  box-shadow: 0 2px 6px rgb(0 0 0 / .3), 0 0 0 .5px rgb(0 0 0 / .04);
  transition: transform 460ms var(--fm-spring), width 220ms var(--fm-spring);
}
.fm-switch[aria-checked="true"] .fm-knob { transform: translateX(22px); }
/* Pressed: the knob stretches toward where it's going, like iOS. */
.fm-switch:active .fm-knob { width: 32px; }
.fm-switch[aria-checked="true"]:active .fm-knob { transform: translateX(16px); }

@media (prefers-reduced-motion: reduce) {
  .fm-glow, .fm[data-on] .fm-glow { transform: none; transition: opacity 200ms ease; }
  .fm-glow-in { animation: none; }
  .fm-tile svg, .fm[data-on] .fm-tile svg, .fm-knob { transition: none; }
  .fm-w, .fm-w[data-show="true"] { transform: none; transition: opacity 160ms ease; }
  .fm-w[data-show="false"]:last-child { transform: none; }
}
`;export{N as default};
