"use client";
/* Construct · Design library: the compiled preview of "Focus". The source is for members. */
import{useEffect as k,useRef as N,useState as y}from"react";import{Fragment as O,jsx as n,jsxs as i}from"react/jsx-runtime";function E({label:f="Focus",until:m="12:00",quiet:p=6,defaultOn:h=!0,accent:t="#3d3df5",autoplay:l=!0,onChange:u}){let r=N(null),c=L(r,l),[e,o]=y(h);k(()=>{if(!c)return;let a=window.setTimeout(()=>o(g=>!g),e?3400:2400);return()=>window.clearTimeout(a)},[c,e]);let d=()=>{let a=!e;o(a),u?.(a)};return i(O,{children:[n("style",{children:T}),i("div",{ref:r,className:"fm","data-on":e||void 0,style:{"--fm-accent":t},onClick:a=>{a.target.closest(".fm-switch")||d()},children:[n("span",{className:"fm-glow","aria-hidden":!0,children:n("span",{className:"fm-glow-in"})}),i("div",{className:"fm-head",children:[n("span",{className:"fm-dot","aria-hidden":!0}),f]}),n("span",{className:"fm-tile","aria-hidden":!0,children:n("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round",children:n("path",{d:"M19.5 14.2A7.5 7.5 0 0 1 9.8 4.5a7.5 7.5 0 1 0 9.7 9.7z"})})}),i("div",{className:"fm-state","aria-hidden":!0,children:[i("span",{className:"fm-roll fm-big",children:[n("span",{className:"fm-w","data-show":e,children:"On"}),n("span",{className:"fm-w","data-show":!e,children:"Off"})]}),i("span",{className:"fm-roll fm-sub",children:[i("span",{className:"fm-w","data-show":e,children:["Until ",m," \xB7 ",p," apps quiet"]}),n("span",{className:"fm-w","data-show":!e,children:"Notifications on"})]})]}),n("button",{type:"button",role:"switch","aria-checked":e,"aria-label":`${f}${e?`, until ${m}, ${p} apps quiet`:""}`,className:"fm-switch",onClick:d,children:n("span",{className:"fm-knob"})})]})]})}function L(f,m){let[p,h]=y(!1);return k(()=>{let t=f.current;if(!t)return;let l=window.matchMedia("(prefers-reduced-motion: reduce)"),u=!1,r=!1,c=!1,e=0,o=(s=0)=>{window.clearTimeout(e);let v=m&&u&&!r&&!c&&!l.matches;!v||!s?h(v):e=window.setTimeout(()=>h(!0),s)},d=new IntersectionObserver(([s])=>{u=s.isIntersecting,o()});d.observe(t);let a=()=>{r=!0,o()},g=()=>{r=!1,o(1500)},w=()=>{c=!0,o()},b=s=>{s.relatedTarget instanceof Node&&t.contains(s.relatedTarget)||(c=!1,o(1500))},x=()=>o();return t.addEventListener("pointerenter",a),t.addEventListener("pointerleave",g),t.addEventListener("focusin",w),t.addEventListener("focusout",b),l.addEventListener("change",x),()=>{window.clearTimeout(e),d.disconnect(),t.removeEventListener("pointerenter",a),t.removeEventListener("pointerleave",g),t.removeEventListener("focusin",w),t.removeEventListener("focusout",b),l.removeEventListener("change",x)}},[f,m]),p}var T=`
.fm {
  --fm-spring: cubic-bezier(.3, 1.45, .5, 1);
  position: relative;
  box-sizing: border-box;
  display: flex; flex-direction: column; align-items: flex-start;
  width: 280px; max-width: 100%;
  height: 292px;
  padding: 22px 24px 24px;
  border-radius: 28px;
  background: #121214;
  color: #fff;
  font-family: inherit;
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .06),
    0 14px 34px -14px rgb(0 0 0 / .32);
}

/* The light: a soft radial glow in the top-right corner. It fades and
   grows in when Focus turns on, and breathes slowly while it's on. */
.fm-glow {
  position: absolute; z-index: -1;
  top: -150px; right: -150px;
  width: 400px; height: 400px;
  pointer-events: none;
  opacity: 0;
  transform: scale(.6);
  transform-origin: 70% 30%;
  transition: opacity 500ms ease, transform 700ms cubic-bezier(.4, 0, .2, 1);
}
.fm[data-on] .fm-glow {
  opacity: 1; transform: none;
  transition: opacity 900ms ease, transform 1200ms cubic-bezier(.2, .8, .2, 1);
}
.fm-glow-in {
  position: absolute; inset: 0; border-radius: 50%;
  background: radial-gradient(closest-side,
    color-mix(in srgb, var(--fm-accent) 62%, transparent),
    color-mix(in srgb, var(--fm-accent) 26%, transparent) 45%,
    color-mix(in srgb, var(--fm-accent) 0%, transparent));
  animation: fm-breathe 5.5s ease-in-out infinite;
}
@keyframes fm-breathe {
  0%, 100% { transform: scale(1); opacity: .85; }
  50% { transform: scale(1.1); opacity: 1; }
}

.fm-head {
  display: flex; align-items: center; gap: 9px;
  font-size: 13px; line-height: 1; color: #8d8d92;
}
.fm-dot {
  width: 6px; height: 6px; border-radius: 50%; flex: none;
  background: #4a4a50;
  transition: background-color 400ms ease;
}
.fm[data-on] .fm-dot { background: var(--fm-accent); }

/* The moon tile. Off: dim and tipped back. On: lit and upright. */
.fm-tile {
  display: grid; place-items: center;
  width: 56px; height: 56px; margin-top: 28px;
  border-radius: 50%;
  background: #1d1d20;
  color: #5c5c62;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / .05);
  transition: background-color 400ms ease, color 400ms ease, box-shadow 400ms ease;
}
.fm-tile svg {
  display: block;
  transform: rotate(-35deg) scale(.86);
  transition: transform 420ms cubic-bezier(.4, 0, .2, 1);
}
.fm[data-on] .fm-tile {
  background: #26262b;
  color: #fff;
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / .08), 0 6px 18px -8px rgb(0 0 0 / .6);
}
.fm[data-on] .fm-tile svg { transform: rotate(0deg); transition: transform 700ms var(--fm-spring); }

/* The words: both versions stacked in one window, like a two-word wheel:
   "On" lives above, "Off" below, and the window rolls between them. */
.fm-state { display: grid; gap: 8px; margin-top: auto; }
.fm-roll { display: grid; overflow: hidden; }
.fm-big {
  height: 46px;
  font-size: 44px; font-weight: 400; line-height: 46px; letter-spacing: -0.045em;
}
.fm-sub { height: 16px; font-size: 12.5px; line-height: 16px; color: #8d8d92; white-space: nowrap; }
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

/* The switch. */
.fm-switch {
  position: relative; flex: none;
  width: 54px; height: 32px; margin-top: 18px;
  padding: 0; border: 0; border-radius: 99px;
  background: #34343a;
  cursor: pointer;
  transition: background-color 300ms ease;
  -webkit-tap-highlight-color: transparent;
}
.fm-switch[aria-checked="true"] { background: var(--fm-accent); }
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
`;export{E as default};
