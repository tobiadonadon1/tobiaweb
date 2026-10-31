"use client";
/* Construct · Design library: the compiled preview of "Batteries". The source is for members. */
import{useEffect as C,useRef as E,useState as M}from"react";import{Fragment as R,jsx as n,jsxs as r}from"react/jsx-runtime";var T={phone:{charge:4,drain:2,minLeft:9,minFull:1.3},watch:{charge:5,drain:12,minLeft:22,minFull:1.6},buds:{charge:6,drain:40,minLeft:6,minFull:1}},z=[{id:"phone",name:"Phone",level:64,charging:!0,hold:0},{id:"watch",name:"Watch",level:24,charging:!1,hold:0},{id:"buds",name:"Buds",level:91,charging:!1,hold:0}];function $({accent:t="#2ecf8f",low:i="#ffb020",critical:g="#ff4f7b",autoplay:p=!0}){let a=E(null),{active:o,live:s}=D(a,p),[l,f]=M(z),m=E(0),c=l.some(e=>e.charging&&e.level<100);C(()=>{if(!o&&!(s&&c))return;let e=window.setInterval(()=>{let u=++m.current;f(b=>b.map(x=>I(x,u,o)))},100);return()=>window.clearInterval(e)},[o,s,c]);let w=e=>f(u=>u.map(b=>b.id===e?{...b,charging:!b.charging,hold:0}:b));return r(R,{children:[n("style",{children:B}),r("div",{ref:a,className:"bt",style:{"--bt-accent":t,"--bt-low":i,"--bt-crit":g},"data-demo":o||void 0,children:[r("div",{className:"bt-head",children:[n("span",{className:"bt-dot","aria-hidden":!0}),"Batteries"]}),n("ul",{className:"bt-list",children:l.map(e=>n("li",{children:r("button",{type:"button",className:"bt-row","data-charging":e.charging||void 0,"data-tone":S(e),"aria-pressed":e.charging,"aria-label":`${e.name}, ${e.level}%, ${L(e)}. ${e.charging?"Unplug":"Plug in"}`,onClick:()=>w(e.id),children:[n("span",{className:"bt-tile","aria-hidden":!0,children:n(F,{id:e.id})}),r("span",{className:"bt-main",children:[r("span",{className:"bt-top",children:[r("span",{className:"bt-name",children:[e.name,n(A,{})]}),r("span",{className:"bt-val","aria-hidden":!0,children:[r("span",{className:"bt-pct",children:[e.level,"%"]}),n("span",{className:"bt-time",children:L(e)})]})]}),r("span",{className:"bt-bar","aria-hidden":!0,children:[n("span",{className:"bt-glow",style:{width:`${e.level}%`}}),n("span",{className:"bt-track",children:n("span",{className:"bt-fill",style:{width:`${e.level}%`}})})]})]})]})},e.id))})]})]})}function I(t,i,g){let p=T[t.id];if(t.charging){if(t.level>=100){if(!g)return t;let l=t.hold+1;return l>22?{...t,charging:!1,hold:0}:{...t,hold:l}}let s=i%p.charge===0?t.level+1:t.level;return g&&t.id==="watch"&&s>=54?{...t,level:s,charging:!1}:{...t,level:s}}if(!g)return t;let a=i%p.drain===0?Math.max(1,t.level-1):t.level,o=t.id==="phone"&&a<=58||t.id==="watch"&&a<=9||t.id==="buds"&&a<=20;return{...t,level:a,charging:o}}function S(t){return t.charging?"charging":t.level<15?"critical":t.level<30?"low":"ok"}function L(t){let i=T[t.id];return t.charging?t.level>=100?"Charged":`${N((100-t.level)*i.minFull)} to full`:`${N(t.level*i.minLeft)} left`}function N(t){let i=Math.max(1,Math.round(t));return i<60?`${i}m`:`${Math.floor(i/60)}h ${String(i%60).padStart(2,"0")}m`}function D(t,i){let[g,p]=M({active:!1,live:!1});return C(()=>{let a=t.current;if(!a)return;let o=window.matchMedia("(prefers-reduced-motion: reduce)"),s=!1,l=!1,f=!1,m=0,c=(d=0)=>{window.clearTimeout(m);let v=s,k=i&&s&&!l&&!f&&!o.matches;if(!k||!d){p(h=>h.active===k&&h.live===v?h:{active:k,live:v});return}p(h=>h.live===v?h:{...h,live:v}),m=window.setTimeout(()=>p({active:!0,live:v}),d)},w=new IntersectionObserver(([d])=>{s=d.isIntersecting,c()});w.observe(a);let e=()=>{l=!0,c()},u=()=>{l=!1,c(1500)},b=()=>{f=!0,c()},x=d=>{d.relatedTarget instanceof Node&&a.contains(d.relatedTarget)||(f=!1,c(1500))},y=()=>c();return a.addEventListener("pointerenter",e),a.addEventListener("pointerleave",u),a.addEventListener("focusin",b),a.addEventListener("focusout",x),o.addEventListener("change",y),()=>{window.clearTimeout(m),w.disconnect(),a.removeEventListener("pointerenter",e),a.removeEventListener("pointerleave",u),a.removeEventListener("focusin",b),a.removeEventListener("focusout",x),o.removeEventListener("change",y)}},[t,i]),g}function F({id:t}){let i={width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};return t==="phone"?r("svg",{...i,children:[n("rect",{x:"7",y:"3",width:"10",height:"18",rx:"2.6"}),n("path",{d:"M11 6h2"})]}):t==="watch"?r("svg",{...i,children:[n("rect",{x:"6.5",y:"7",width:"11",height:"10",rx:"3"}),n("path",{d:"M9 7l.6-3h4.8l.6 3M9 17l.6 3h4.8l.6-3"})]}):r("svg",{...i,children:[n("path",{d:"M8.5 5.5a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-1.4 2.2V18a1.2 1.2 0 0 1-2.4 0v-5.6A2.5 2.5 0 0 1 6 10V8a2.5 2.5 0 0 1 2.5-2.5z"}),n("path",{d:"M15.5 5.5A2.5 2.5 0 0 0 13 8v2.5a2.5 2.5 0 0 0 1.4 2.2V18a1.2 1.2 0 0 0 2.4 0v-5.6A2.5 2.5 0 0 0 18 10V8a2.5 2.5 0 0 0-2.5-2.5z"})]})}var A=()=>n("svg",{className:"bt-bolt",width:"9",height:"12",viewBox:"0 0 9 12","aria-hidden":!0,children:n("path",{d:"M5.4 0.6L0.9 6.9h3.2L3.4 11.4l4.7-6.5H4.8z",fill:"currentColor"})}),P=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.2 0 0 0 -.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,B=`
.bt {
  --bt-ink: #111;
  --bt-grey: #8a8a8a;
  --bt-track: #e7e7e3;
  --bt-house: #3d3df5;
  --bt-spring: cubic-bezier(.3, 1.4, .5, 1);
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  width: 300px;
  max-width: 100%;
  padding: 22px 22px 18px;
  border-radius: 28px;
  /* soft light from the top left onto a warm off-white */
  background:
    radial-gradient(130% 90% at 0% 0%, #ffffff 0%, rgb(255 255 255 / 0) 58%),
    #f5f5f1;
  color: var(--bt-ink);
  font-family: inherit;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .9),
    0 0 0 1px rgb(0 0 0 / .045),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .16);
}
.bt::before {
  content: "";
  position: absolute; inset: 0; z-index: -1;
  border-radius: inherit;
  background-image: ${P};
  background-size: 160px 160px;
  opacity: .045;
  pointer-events: none;
}
.bt-head {
  display: flex; align-items: center; gap: 9px;
  font-size: 13px; line-height: 1; color: #6b6b6b;
  letter-spacing: -0.005em;
}
.bt-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--bt-house); flex: none; }

.bt-list { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 2px; }
.bt-list > li { margin: 0; padding: 0; }

/* Colour means charge. Each row carries its state colour (--bt-c), a darker
   version for small text (--bt-c-ink) and a whisper of it for the tile. */
.bt-row {
  --bt-c: var(--bt-ink);
  --bt-c-ink: #4a4a4a;
  --bt-tile: #ecece8;
  --bt-tile-ink: #2a2a2a;
  display: flex; align-items: center; gap: 14px;
  margin: 0 -8px; width: calc(100% + 16px);
  padding: 10px 8px;
  border: 0; border-radius: 16px;
  background: transparent;
  color: inherit; font: inherit; text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 200ms ease, transform 220ms var(--bt-spring);
}
.bt-row[data-tone="charging"] {
  --bt-c: var(--bt-accent);
  --bt-c-ink: color-mix(in oklab, var(--bt-accent) 62%, #000);
  --bt-tile: color-mix(in srgb, var(--bt-accent) 15%, #f1f1ed);
  --bt-tile-ink: color-mix(in oklab, var(--bt-accent) 55%, #000);
}
.bt-row[data-tone="low"] {
  --bt-c: var(--bt-low);
  --bt-c-ink: color-mix(in oklab, var(--bt-low) 62%, #000);
  --bt-tile: color-mix(in srgb, var(--bt-low) 17%, #f1f1ed);
  --bt-tile-ink: color-mix(in oklab, var(--bt-low) 55%, #000);
}
.bt-row[data-tone="critical"] {
  --bt-c: var(--bt-crit);
  --bt-c-ink: color-mix(in oklab, var(--bt-crit) 78%, #000);
  --bt-tile: color-mix(in srgb, var(--bt-crit) 13%, #f1f1ed);
  --bt-tile-ink: color-mix(in oklab, var(--bt-crit) 75%, #000);
}
.bt-row:hover { background: rgb(0 0 0 / .025); }
.bt-row:active { transform: scale(.985); }
.bt-row:focus-visible { outline: 2px solid var(--bt-house); outline-offset: 0; }

.bt-tile {
  display: grid; place-items: center; flex: none;
  width: 36px; height: 36px; border-radius: 11px;
  background: var(--bt-tile);
  color: var(--bt-tile-ink);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .7), inset 0 0 0 1px rgb(0 0 0 / .035);
  transition: color 360ms ease, background-color 360ms ease;
}
.bt-tile svg { display: block; }

.bt-main { flex: 1; min-width: 0; display: grid; gap: 9px; }
.bt-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.bt-name {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14.5px; font-weight: 500; line-height: 1; letter-spacing: -0.01em;
  white-space: nowrap;
}
.bt-bolt {
  display: block; flex: none; color: var(--bt-accent);
  filter: drop-shadow(0 0 3px color-mix(in srgb, var(--bt-accent) 70%, transparent));
  opacity: 0; transform: scale(.4) rotate(-20deg);
  transition: opacity 140ms ease, transform 160ms ease;
}
.bt-row[data-charging] .bt-bolt {
  opacity: 1; transform: none;
  transition: opacity 200ms ease, transform 420ms var(--bt-spring);
}

/* The value: the percentage and the time sit in one 1-line window; hover
   rolls the time up into view. */
.bt-val {
  display: grid; justify-items: end;
  height: 13px; overflow: hidden;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; line-height: 13px; color: var(--bt-grey);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.bt-pct, .bt-time {
  grid-area: 1 / 1;
  transition: transform 380ms var(--bt-spring), opacity 200ms ease, color 360ms ease;
}
.bt-pct { color: var(--bt-c-ink); }
.bt-time { transform: translateY(100%); opacity: 0; }
.bt-row:hover .bt-pct, .bt-row:focus-visible .bt-pct { transform: translateY(-100%); opacity: 0; }
.bt-row:hover .bt-time, .bt-row:focus-visible .bt-time { transform: none; opacity: 1; color: var(--bt-ink); }
.bt-row:not([data-tone="ok"]):hover .bt-time,
.bt-row:not([data-tone="ok"]):focus-visible .bt-time { color: var(--bt-c-ink); }

/* The bar, with a soft coloured glow under the charging one. */
.bt-bar { position: relative; display: block; }
.bt-glow {
  position: absolute; left: 2px; top: 3px; height: 6px;
  max-width: calc(100% - 4px);
  border-radius: 99px;
  background: var(--bt-accent);
  filter: blur(6px);
  opacity: 0;
  transition: width 420ms cubic-bezier(.2, .8, .2, 1), opacity 400ms ease;
  pointer-events: none;
}
.bt-row[data-charging] .bt-glow { opacity: .55; }
.bt-track {
  position: relative; display: block;
  height: 7px; border-radius: 99px;
  background: var(--bt-track);
  box-shadow: inset 0 1px 1px rgb(0 0 0 / .05);
  overflow: hidden;
}
.bt-fill {
  position: absolute; inset: 0 auto 0 0;
  border-radius: inherit;
  background: var(--bt-c);
  overflow: hidden;
  transition: width 420ms cubic-bezier(.2, .8, .2, 1), background-color 360ms ease;
}
/* A lighter head-to-tail sheen on the charging bar. */
.bt-fill::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(90deg, rgb(255 255 255 / .38), rgb(255 255 255 / 0) 75%);
  opacity: 0;
  transition: opacity 360ms ease;
}
.bt-row[data-charging] .bt-fill::before { opacity: 1; }
/* The light running along the charging bar. */
.bt-fill::after {
  content: "";
  position: absolute; top: 0; bottom: 0; left: 0;
  width: 46px;
  background: linear-gradient(90deg, rgb(255 255 255 / 0), rgb(255 255 255 / .7), rgb(255 255 255 / 0));
  transform: translateX(-60px);
  opacity: 0;
}
.bt-row[data-charging] .bt-fill::after {
  opacity: 1;
  animation: bt-sweep 2.6s cubic-bezier(.45, 0, .25, 1) infinite;
}
@keyframes bt-sweep {
  0% { left: 0; transform: translateX(-60px); }
  70%, 100% { left: 100%; transform: translateX(10px); }
}

@media (prefers-reduced-motion: reduce) {
  .bt-fill, .bt-glow, .bt-row, .bt-pct, .bt-time, .bt-bolt, .bt-row[data-charging] .bt-bolt { transition: opacity 150ms ease; }
  .bt-row[data-charging] .bt-fill::after { animation: none; opacity: 0; }
  .bt-row:active { transform: none; }
}
`;export{$ as default};
