"use client";
/* Construct · Design library: the compiled preview of "Like burst". The source is for members. */
import{useEffect as E,useRef as M,useState as S}from"react";import{Fragment as $,jsx as r,jsxs as u}from"react/jsx-runtime";var C=[[-90,52,140,0,0,10,0],[-66,58,-110,1,1,9,20],[-44,62,200,2,2,9,10],[-26,74,-160,3,3,8,30],[-114,54,120,3,1,8,0],[-138,52,-90,0,0,9,40],[-162,50,170,1,3,8,15],[180,48,-130,2,2,9,25],[156,50,100,0,3,8,5],[132,48,-180,3,2,9,35],[110,44,150,1,1,7,10],[-80,46,-70,2,0,7,45]],P=["1,1 9,0 10,7 3,10 0,6","0,3 10,0 9,4 1,7","5,0 10,9 0,8","2,0 10,2 8,10 0,8 1,4"],T=["var(--tone)","#e09a2b","#2b44c4","#1e6a48"];function z({count:c=1289,defaultLiked:h=!1,tone:N="#d8452f",label:v="Like",onChange:w}){let[p,x]=S(h),[d,t]=S(0),[o]=S(()=>Math.max(1,String(Math.floor(Math.abs(c))+1).length)),s=Math.max(0,Math.floor(c))+(p?1:0),a=M(null),b=()=>{let n=!p;x(n),n&&t(m=>m+1),w?.(n);let l=a.current;!l||window.matchMedia("(prefers-reduced-motion: reduce)").matches||(l.getAnimations().forEach(m=>m.cancel()),n?l.animate([{transform:"scale(1, 1)"},{transform:"scale(1.22, 0.72)",offset:.14},{transform:"scale(0.86, 1.2)",offset:.34},{transform:"scale(1.14, 1.04)",offset:.56},{transform:"scale(0.97, 0.99)",offset:.76},{transform:"scale(1, 1)"}],{duration:620,easing:"cubic-bezier(.3, .7, .4, 1)"}):l.animate([{transform:"scale(1)"},{transform:"scale(0.86)",offset:.4},{transform:"scale(1)"}],{duration:260,easing:"ease-out"}))};return u($,{children:[r("style",{children:H}),u("button",{type:"button",className:"lkb","data-liked":p,"aria-pressed":p,"aria-label":`${v}, ${s.toLocaleString("en-US")} likes`,onClick:b,style:{"--tone":N},children:[u("span",{className:"lkb-icon","aria-hidden":!0,children:[d>0&&p&&u("span",{className:"lkb-burst",children:[r("span",{className:"lkb-ring"}),C.map(([n,l,m,i,k,f,e],g)=>{let y=n*Math.PI/180;return r("svg",{className:"lkb-scrap",width:f,height:f,viewBox:"0 0 10 10",style:{"--x":`${(Math.cos(y)*l).toFixed(1)}px`,"--y":`${(Math.sin(y)*l).toFixed(1)}px`,"--r":`${m}deg`,"--delay":`${e}ms`,color:T[i]},children:r("polygon",{points:P[k],fill:"currentColor"})},g)})]},d),r("span",{ref:a,className:"lkb-heart",children:u("svg",{width:"24",height:"24",viewBox:"0 0 24 24",children:[r("path",{className:"lkb-line",d:A}),r("path",{className:"lkb-fill",d:A})]})})]}),r("span",{className:"lkb-count","aria-hidden":!0,children:r(F,{value:s,places:o,group:!0})})]})]})}var A="M12 20.2c-.3 0-.6-.1-.8-.3C8.6 17.8 3 13.4 3 8.9 3 6.1 5.1 4 7.7 4c1.8 0 3.3.9 4.3 2.4C13 4.9 14.5 4 16.3 4 18.9 4 21 6.1 21 8.9c0 4.5-5.6 8.9-8.2 11-.2.2-.5.3-.8.3z";function F({value:c,places:h,group:N=!1}){let v=M(null),[w]=S(c),p=M(null),x=M(!1),d=Array.from({length:h},(t,o)=>h-1-o);return E(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");x.current=t.matches;let o=()=>x.current=t.matches;return t.addEventListener("change",o),()=>t.removeEventListener("change",o)},[]),E(()=>{let t=v.current;if(!t)return;let o=Array.from(t.querySelectorAll("[data-wheel]")),s=d.map(i=>Math.floor(c/10**i));p.current||(p.current={pos:d.map(i=>Math.floor(w/10**i)),vel:d.map(()=>0)});let a=p.current,b=()=>o.forEach((i,k)=>{let f=i.children;for(let e=0;e<10;e++){let g=L(e,a.pos[k]),y=f[e+1];y.style.setProperty("--o",g.toFixed(4)),y.style.opacity=String(Math.max(0,1-Math.abs(g)*.9))}});if(x.current){a.pos=s.slice(),a.vel=s.map(()=>0),b();return}let n=0,l=performance.now(),m=i=>{let k=Math.min(.032,(i-l)/1e3);l=i;let f=!1;for(let e=0;e<s.length;e++){let g=a.pos[e]-s[e];a.vel[e]+=(-260*g-25*a.vel[e])*k,a.pos[e]+=a.vel[e]*k,Math.abs(a.pos[e]-s[e])>.002||Math.abs(a.vel[e])>.02?f=!0:(a.pos[e]=s[e],a.vel[e]=0)}b(),f&&(n=requestAnimationFrame(m))};return n=requestAnimationFrame(m),()=>cancelAnimationFrame(n)},[c]),r("span",{ref:v,className:"lkb-roller",children:d.map(t=>{let o=t===0||c>=10**t,s=Math.floor(w/10**t);return r("span",{className:"lkb-colwrap","data-shown":o,children:u("span",{className:"lkb-colin",children:[u("span",{className:"lkb-col","data-wheel":!0,children:[r("span",{className:"lkb-ph",children:"0"}),Array.from({length:10},(a,b)=>{let n=L(b,s);return r("span",{className:"lkb-digit",style:{"--o":n,opacity:Math.max(0,1-Math.abs(n)*.9)},children:b},b)})]}),N&&t>0&&t%3===0&&r("span",{className:"lkb-sep",children:","})]})},t)})})}function L(c,h){return((c-h)%10+15)%10-5}var H=`
.lkb {
  --ink: #0b1f3a;
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  height: 52px;
  padding: 0 20px 0 16px;
  border: 0;
  border-radius: 999px;
  background: #fffefb;
  color: var(--ink);
  font-family: inherit;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-shadow:
    inset 0 0 0 1px rgba(11, 31, 58, 0.12),
    0 1px 0 rgba(11, 31, 58, 0.04),
    0 12px 26px -18px rgba(11, 31, 58, 0.4);
  transition: transform 320ms cubic-bezier(.3, 1.5, .5, 1), background-color 300ms ease, box-shadow 300ms ease;
}
.lkb:hover { box-shadow: inset 0 0 0 1px rgba(11, 31, 58, 0.2), 0 1px 0 rgba(11, 31, 58, 0.04), 0 12px 26px -18px rgba(11, 31, 58, 0.4); }
.lkb:active { transform: scale(0.95); transition-duration: 100ms; }
.lkb:focus-visible { outline: 2px solid var(--tone); outline-offset: 3px; }
.lkb[data-liked="true"] {
  background: color-mix(in srgb, var(--tone) 9%, #fffefb);
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--tone) 30%, transparent),
    0 1px 0 rgba(11, 31, 58, 0.04),
    0 12px 26px -18px color-mix(in srgb, var(--tone) 70%, transparent);
}

.lkb-icon { position: relative; display: grid; place-items: center; width: 24px; height: 24px; }
.lkb-heart { display: grid; transform-origin: 50% 70%; }
.lkb-heart svg { display: block; overflow: visible; }
.lkb-line {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linejoin: round;
  transition: stroke 200ms ease;
}
.lkb-fill {
  fill: var(--tone);
  transform-origin: 12px 12.5px;
  transform: scale(0);
  transition: transform 160ms ease-in;
}
.lkb[data-liked="true"] .lkb-line { stroke: var(--tone); }
.lkb[data-liked="true"] .lkb-fill { transform: scale(1); transition: transform 420ms 70ms cubic-bezier(.3, 1.6, .5, 1); }

/* The burst: a ring and twelve scraps, centred on the heart. */
.lkb-burst { position: absolute; left: 50%; top: 50%; width: 0; height: 0; pointer-events: none; }
.lkb-ring {
  position: absolute;
  left: -22px; top: -22px;
  width: 44px; height: 44px;
  border-radius: 50%;
  border: 2px solid var(--tone);
  opacity: 0;
  animation: lkb-ring 480ms 90ms cubic-bezier(.2, .7, .3, 1) both;
}
@keyframes lkb-ring {
  0%   { opacity: 0.9; transform: scale(0.25); border-width: 6px; }
  100% { opacity: 0; transform: scale(1.35); border-width: 0.5px; }
}
.lkb-scrap {
  position: absolute;
  left: 0; top: 0;
  margin: -5px 0 0 -5px;
  opacity: 0;
  animation: lkb-fly 860ms calc(90ms + var(--delay)) cubic-bezier(.15, .7, .3, 1) both;
}
@keyframes lkb-fly {
  0%   { opacity: 1; transform: translate(0, 0) rotate(0deg) scale(0.2); }
  48%  { opacity: 1; transform: translate(var(--x), var(--y)) rotate(calc(var(--r) * 0.6)) scale(1); }
  100% { opacity: 0; transform: translate(calc(var(--x) * 1.12), calc(var(--y) + 16px)) rotate(var(--r)) scale(0.7); }
}

/* The count. */
.lkb-count {
  display: inline-flex;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
  transition: color 240ms ease;
}
.lkb[data-liked="true"] .lkb-count { color: color-mix(in srgb, var(--tone) 82%, var(--ink)); }
.lkb-roller { display: inline-flex; }
.lkb-colwrap {
  display: inline-grid;
  grid-template-columns: 1fr;
  transition: grid-template-columns 320ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.lkb-colwrap[data-shown="false"] { grid-template-columns: 0fr; opacity: 0; }
.lkb-colin { display: flex; min-width: 0; overflow: hidden; }
.lkb-col {
  position: relative;
  display: block;
  overflow: hidden;
  line-height: 1.5;
  -webkit-mask-image: linear-gradient(transparent, #000 20%, #000 80%, transparent);
  mask-image: linear-gradient(transparent, #000 20%, #000 80%, transparent);
}
.lkb-ph { visibility: hidden; }
.lkb-digit {
  position: absolute;
  left: 0; top: 0;
  width: 100%;
  text-align: center;
  transform: translateY(calc(var(--o) * 100%));
}
.lkb-sep { line-height: 1.5; }

@media (prefers-reduced-motion: reduce) {
  .lkb-burst { display: none; }
  .lkb-fill, .lkb[data-liked="true"] .lkb-fill { transform: scale(1); opacity: 0; transition: opacity 200ms ease; }
  .lkb[data-liked="true"] .lkb-fill { opacity: 1; }
  .lkb, .lkb-colwrap { transition-duration: 1ms; }
}
`;export{z as default};
