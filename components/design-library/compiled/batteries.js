"use client";
/* Construct · Design library: the compiled preview of "Batteries". The source is for members. */
import{useEffect as M,useRef as L,useState as S}from"react";import{Fragment as B,jsx as i,jsxs as r}from"react/jsx-runtime";var T={phone:{charge:4,drain:2,minLeft:9,minFull:1.3},watch:{charge:5,drain:20,minLeft:22,minFull:1.6},buds:{charge:6,drain:40,minLeft:6,minFull:1}},z=[{id:"phone",name:"Phone",level:64,charging:!0,hold:0},{id:"watch",name:"Watch",level:38,charging:!1,hold:0},{id:"buds",name:"Buds",level:91,charging:!1,hold:0}];function I({accent:e="#3d3df5",autoplay:n=!0}){let c=L(null),{active:o,live:a}=C(c,n),[b,s]=S(z),p=L(0),h=b.some(t=>t.charging&&t.level<100);M(()=>{if(!o&&!(a&&h))return;let t=window.setInterval(()=>{let u=++p.current;s(l=>l.map(v=>$(v,u,o)))},100);return()=>window.clearInterval(t)},[o,a,h]);let m=t=>s(u=>u.map(l=>l.id===t?{...l,charging:!l.charging,hold:0}:l));return r(B,{children:[i("style",{children:P}),r("div",{ref:c,className:"bt",style:{"--bt-accent":e},"data-demo":o||void 0,children:[r("div",{className:"bt-head",children:[i("span",{className:"bt-dot","aria-hidden":!0}),"Batteries"]}),i("ul",{className:"bt-list",children:b.map(t=>i("li",{children:r("button",{type:"button",className:"bt-row","data-charging":t.charging||void 0,"aria-pressed":t.charging,"aria-label":`${t.name}, ${t.level}%, ${N(t)}. ${t.charging?"Unplug":"Plug in"}`,onClick:()=>m(t.id),children:[i("span",{className:"bt-tile","aria-hidden":!0,children:i(D,{id:t.id})}),r("span",{className:"bt-main",children:[r("span",{className:"bt-top",children:[r("span",{className:"bt-name",children:[t.name,i(F,{})]}),r("span",{className:"bt-val","aria-hidden":!0,children:[r("span",{className:"bt-pct",children:[t.level,"%"]}),i("span",{className:"bt-time",children:N(t)})]})]}),i("span",{className:"bt-track","aria-hidden":!0,children:i("span",{className:"bt-fill",style:{width:`${t.level}%`}})})]})]})},t.id))})]})]})}function $(e,n,c){let o=T[e.id];if(e.charging){if(e.level>=100){if(!c)return e;let p=e.hold+1;return p>22?{...e,charging:!1,hold:0}:{...e,hold:p}}let s=n%o.charge===0?e.level+1:e.level;return c&&e.id==="watch"&&s>=54?{...e,level:s,charging:!1}:{...e,level:s}}if(!c)return e;let a=n%o.drain===0?Math.max(1,e.level-1):e.level,b=e.id==="phone"&&a<=58||e.id==="watch"&&a<=31||e.id==="buds"&&a<=20;return{...e,level:a,charging:b}}function N(e){let n=T[e.id];return e.charging?e.level>=100?"Charged":`${E((100-e.level)*n.minFull)} to full`:`${E(e.level*n.minLeft)} left`}function E(e){let n=Math.max(1,Math.round(e));return n<60?`${n}m`:`${Math.floor(n/60)}h ${String(n%60).padStart(2,"0")}m`}function C(e,n){let[c,o]=S({active:!1,live:!1});return M(()=>{let a=e.current;if(!a)return;let b=window.matchMedia("(prefers-reduced-motion: reduce)"),s=!1,p=!1,h=!1,m=0,t=(d=0)=>{window.clearTimeout(m);let f=s,w=n&&s&&!p&&!h&&!b.matches;if(!w||!d){o(g=>g.active===w&&g.live===f?g:{active:w,live:f});return}o(g=>g.live===f?g:{...g,live:f}),m=window.setTimeout(()=>o({active:!0,live:f}),d)},u=new IntersectionObserver(([d])=>{s=d.isIntersecting,t()});u.observe(a);let l=()=>{p=!0,t()},v=()=>{p=!1,t(1500)},x=()=>{h=!0,t()},y=d=>{d.relatedTarget instanceof Node&&a.contains(d.relatedTarget)||(h=!1,t(1500))},k=()=>t();return a.addEventListener("pointerenter",l),a.addEventListener("pointerleave",v),a.addEventListener("focusin",x),a.addEventListener("focusout",y),b.addEventListener("change",k),()=>{window.clearTimeout(m),u.disconnect(),a.removeEventListener("pointerenter",l),a.removeEventListener("pointerleave",v),a.removeEventListener("focusin",x),a.removeEventListener("focusout",y),b.removeEventListener("change",k)}},[e,n]),c}function D({id:e}){let n={width:18,height:18,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.7,strokeLinecap:"round",strokeLinejoin:"round"};return e==="phone"?r("svg",{...n,children:[i("rect",{x:"7",y:"3",width:"10",height:"18",rx:"2.6"}),i("path",{d:"M11 6h2"})]}):e==="watch"?r("svg",{...n,children:[i("rect",{x:"6.5",y:"7",width:"11",height:"10",rx:"3"}),i("path",{d:"M9 7l.6-3h4.8l.6 3M9 17l.6 3h4.8l.6-3"})]}):r("svg",{...n,children:[i("path",{d:"M8.5 5.5a2.5 2.5 0 0 1 2.5 2.5v2.5a2.5 2.5 0 0 1-1.4 2.2V18a1.2 1.2 0 0 1-2.4 0v-5.6A2.5 2.5 0 0 1 6 10V8a2.5 2.5 0 0 1 2.5-2.5z"}),i("path",{d:"M15.5 5.5A2.5 2.5 0 0 0 13 8v2.5a2.5 2.5 0 0 0 1.4 2.2V18a1.2 1.2 0 0 0 2.4 0v-5.6A2.5 2.5 0 0 0 18 10V8a2.5 2.5 0 0 0-2.5-2.5z"})]})}var F=()=>i("svg",{className:"bt-bolt",width:"9",height:"12",viewBox:"0 0 9 12","aria-hidden":!0,children:i("path",{d:"M5.4 0.6L0.9 6.9h3.2L3.4 11.4l4.7-6.5H4.8z",fill:"currentColor"})}),P=`
.bt {
  --bt-ink: #111;
  --bt-grey: #8a8a8a;
  --bt-track: #e6e6e3;
  --bt-spring: cubic-bezier(.3, 1.4, .5, 1);
  box-sizing: border-box;
  width: 300px;
  max-width: 100%;
  padding: 22px 22px 18px;
  border-radius: 28px;
  background: #f8f8f6;
  color: var(--bt-ink);
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14);
}
.bt-head {
  display: flex; align-items: center; gap: 9px;
  font-size: 13px; line-height: 1; color: #6b6b6b;
  letter-spacing: -0.005em;
}
.bt-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--bt-accent); flex: none; }

.bt-list { list-style: none; margin: 14px 0 0; padding: 0; display: grid; gap: 2px; }
.bt-list > li { margin: 0; padding: 0; }

.bt-row {
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
.bt-row:hover { background: rgb(0 0 0 / .025); }
.bt-row:active { transform: scale(.985); }
.bt-row:focus-visible { outline: 2px solid var(--bt-accent); outline-offset: 0; }

.bt-tile {
  display: grid; place-items: center; flex: none;
  width: 36px; height: 36px; border-radius: 11px;
  background: #ececea;
  color: #2a2a2a;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / .03);
  transition: color 300ms ease;
}
.bt-tile svg { display: block; }
.bt-row[data-charging] .bt-tile { color: var(--bt-ink); }

.bt-main { flex: 1; min-width: 0; display: grid; gap: 9px; }
.bt-top { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.bt-name {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14.5px; font-weight: 500; line-height: 1; letter-spacing: -0.01em;
  white-space: nowrap;
}
.bt-bolt {
  display: block; flex: none; color: var(--bt-accent);
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
  transition: transform 380ms var(--bt-spring), opacity 200ms ease;
}
.bt-pct { color: #4a4a4a; }
.bt-time { transform: translateY(100%); opacity: 0; }
.bt-row:hover .bt-pct, .bt-row:focus-visible .bt-pct { transform: translateY(-100%); opacity: 0; }
.bt-row:hover .bt-time, .bt-row:focus-visible .bt-time { transform: none; opacity: 1; color: var(--bt-ink); }
.bt-row[data-charging]:hover .bt-time, .bt-row[data-charging]:focus-visible .bt-time { color: var(--bt-accent); }

.bt-track {
  position: relative; display: block;
  height: 7px; border-radius: 99px;
  background: var(--bt-track);
  overflow: hidden;
}
.bt-fill {
  position: absolute; inset: 0 auto 0 0;
  border-radius: inherit;
  background: var(--bt-ink);
  overflow: hidden;
  transition: width 420ms cubic-bezier(.2, .8, .2, 1), background-color 360ms ease;
}
.bt-row[data-charging] .bt-fill { background: var(--bt-accent); }
/* The light running along the charging bar. */
.bt-fill::after {
  content: "";
  position: absolute; top: 0; bottom: 0; left: 0;
  width: 46px;
  background: linear-gradient(90deg, rgb(255 255 255 / 0), rgb(255 255 255 / .55), rgb(255 255 255 / 0));
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
  .bt-fill, .bt-row, .bt-pct, .bt-time, .bt-bolt, .bt-row[data-charging] .bt-bolt { transition: opacity 150ms ease; }
  .bt-row[data-charging] .bt-fill::after { animation: none; opacity: 0; }
  .bt-row:active { transform: none; }
}
`;export{I as default};
