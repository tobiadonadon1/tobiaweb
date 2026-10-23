"use client";
/* Construct · Design library: the compiled preview of "Stacked bars". The source is for members. */
import{useEffect as F,useId as K,useMemo as B,useState as x}from"react";import{Fragment as _,jsx as a,jsxs as r}from"react/jsx-runtime";var c=["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],p=[{name:"Organic",values:[520,610,580,690,740,430,380]},{name:"Paid",values:[260,300,340,310,420,220,180]},{name:"Referral",values:[140,120,190,160,210,150,110]}],M={reef:["#0f9d8a","#ff6948","#ffbe2e"],citrus:["#ff7a00","#ffcf1a","#1fae6a"],sea:["#0b63ce","#37b3f5","#9adcf2"]},f=132,m=n=>n.toLocaleString("en-US"),H=n=>n>=1e3?`${+(n/1e3).toFixed(1)}k`:String(n);function I(n){let b=[50,100,200,250,500,1e3,2e3,2500,5e3],l=b.find(v=>n/v<=4)??b[b.length-1];return{step:l,top:Math.ceil(n*1.04/l)*l}}function U({palette:n="reef",label:b="Sessions"}){let l=M[n]??M.reef,v=K(),[E,z]=x(!1),[$,T]=x(!0),[s,g]=x(null),[o,d]=x(null);F(()=>{let e=requestAnimationFrame(()=>z(!0)),t=setTimeout(()=>T(!1),1100);return()=>{cancelAnimationFrame(e),clearTimeout(t)}},[]);let u=B(()=>c.map((e,t)=>p.reduce((i,h)=>i+h.values[t],0)),[]),R=Math.max(...o===null?u:p[o].values),{step:y,top:k}=I(R),A=Array.from({length:Math.floor(k/y)+1},(e,t)=>t*y),C=o===null?u.reduce((e,t)=>e+t,0):p[o].values.reduce((e,t)=>e+t,0),w=e=>{let t=e.currentTarget.getBoundingClientRect(),i=Math.floor((e.clientX-t.left)/t.width*c.length);g(Math.min(c.length-1,Math.max(0,i)))},L=e=>{let t=c.length-1,i=s;if(e.key==="ArrowRight")i=s===null?0:Math.min(t,s+1);else if(e.key==="ArrowLeft")i=s===null?t:Math.max(0,s-1);else if(e.key==="Home")i=0;else if(e.key==="End")i=t;else if(e.key==="Escape")i=null;else return;e.preventDefault(),g(i)},X=s===null?"":`${c[s]}: ${p.map(e=>`${e.name} ${m(e.values[s])}`).join(", ")}. Total ${m(u[s])}.`;return r(_,{children:[a("style",{children:Y}),r("div",{className:"skb","data-intro":$,"data-active":s!==null,style:{"--c0":l[0],"--c1":l[1],"--c2":l[2]},children:[r("div",{className:"skb-head",children:[r("span",{className:"skb-label",children:[o===null?b:p[o].name,a("span",{className:"skb-range",children:" \xB7 this week"})]}),a("span",{className:"skb-total",children:m(C)})]}),r("div",{className:"skb-plot",children:[a("div",{className:"skb-grid","aria-hidden":!0,children:A.map((e,t)=>a("div",{className:"skb-line",style:{bottom:`${e/k*f}px`},children:a("span",{children:H(e)})},t))}),r("div",{className:"skb-bars",role:"group","aria-roledescription":"chart","aria-label":`${b} per day this week, by source. Use the arrow keys to read each day.`,tabIndex:0,onPointerMove:w,onPointerDown:w,onPointerLeave:e=>e.pointerType==="mouse"&&g(null),onKeyDown:L,onBlur:()=>g(null),children:[c.map((e,t)=>{let i=0;return r("div",{className:"skb-col","data-on":s===t,style:{"--i":t},children:[a("div",{className:"skb-stack",children:p.map((h,S)=>{let N=o===null||o===S,P=E&&N?h.values[t]/k*f:0,D=i;return i+=P,a("span",{className:"skb-seg","data-gone":!N,style:{"--c":`var(--c${S})`,height:`${P}px`,transform:`translateY(${-D}px)`}},h.name)})}),a("span",{className:"skb-day","aria-hidden":!0,children:e.slice(0,1)})]},e)}),r("div",{className:"skb-tip","aria-hidden":!0,"data-show":s!==null,"data-side":(s??3)<4?"right":"left",style:{"--x":`${((s??3)+.5)/c.length*100}%`,"--y":`${Math.max(-22,Math.min(12,f-(s===null?0:(o===null?u[s]:p[o].values[s])/k*f)-6))}px`},children:[a("div",{className:"skb-tip-day",children:c[s??3]}),p.map((e,t)=>r("div",{className:"skb-tip-row","data-dim":o!==null&&o!==t,children:[a("i",{style:{background:l[t]}}),a("span",{children:e.name}),a("b",{children:m(e.values[s??3])})]},e.name)),r("div",{className:"skb-tip-row skb-tip-sum",children:[a("span",{children:"Total"}),a("b",{children:m(u[s??3])})]})]})]})]}),a("div",{className:"skb-legend",onPointerLeave:()=>d(null),children:p.map((e,t)=>r("button",{type:"button",className:"skb-key","data-off":o!==null&&o!==t,"aria-pressed":o===t,onPointerEnter:()=>d(t),onFocus:()=>d(t),onBlur:()=>d(null),onClick:()=>d(i=>i===t?null:t),children:[a("i",{style:{background:l[t]}}),e.name]},e.name))}),a("span",{className:"skb-sr","aria-live":"polite",id:`${v}-live`,children:X})]})]})}var Y=`
.skb {
  --ink: #12161c;
  --mute: rgb(18 22 28 / .5);
  --spring: cubic-bezier(.3, 1.25, .5, 1);
  position: relative;
  box-sizing: border-box;
  width: 344px;
  padding: 18px 20px 14px;
  border-radius: 20px;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(18 22 28 / .06),
    0 1px 2px rgb(18 22 28 / .06),
    0 18px 36px -24px rgb(18 22 28 / .35);
  user-select: none;
  -webkit-user-select: none;
}
.skb-head { display: grid; gap: 4px; margin-bottom: 16px; }
.skb-label { font-size: 12.5px; font-weight: 500; color: var(--mute); }
.skb-range { color: rgb(18 22 28 / .32); }
.skb-total {
  font-size: 28px; font-weight: 650; line-height: 1;
  letter-spacing: -.025em;
  font-variant-numeric: tabular-nums;
}

.skb-plot { position: relative; height: ${f}px; margin: 0 0 26px 28px; }
.skb-grid { position: absolute; inset: 0; pointer-events: none; }
.skb-line {
  position: absolute; left: 0; right: 0; height: 0;
  border-top: 1px dashed rgb(18 22 28 / .1);
  transition: bottom 520ms var(--spring);
}
.skb-line:first-child { border-top-style: solid; border-top-color: rgb(18 22 28 / .14); }
.skb-line span {
  position: absolute; right: calc(100% + 8px); top: -6px;
  font: 500 10px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: rgb(18 22 28 / .38);
}

.skb-bars {
  position: absolute; inset: 0;
  display: grid; grid-template-columns: repeat(7, 1fr);
  outline: none;
  touch-action: pan-y;
  cursor: crosshair;
}
.skb-bars:focus-visible { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--c0); border-radius: 6px; }
.skb-col { position: relative; transition: opacity 200ms ease; }
.skb[data-active="true"] .skb-col[data-on="false"] { opacity: .32; }
.skb-stack {
  position: absolute; bottom: 0; left: 50%;
  width: 24px; height: 0; margin-left: -12px;
}
.skb-seg {
  position: absolute; left: 0; right: 0; bottom: 0;
  box-sizing: border-box;
  border-bottom: 2px solid #fff; /* the gap between sources */
  border-radius: 5px;
  background: var(--c);
  transition:
    height 560ms var(--spring) calc(var(--i) * 22ms),
    transform 560ms var(--spring) calc(var(--i) * 22ms),
    opacity 240ms ease;
}
.skb-seg:first-child { border-bottom: 0; }
.skb[data-intro="true"] .skb-seg {
  transition:
    height 720ms var(--spring) calc(80ms + var(--i) * 60ms),
    transform 720ms var(--spring) calc(80ms + var(--i) * 60ms);
}
.skb-seg[data-gone="true"] { opacity: 0; }
.skb-day {
  position: absolute; left: 0; right: 0; top: calc(100% + 9px);
  text-align: center;
  font-size: 11px; font-weight: 600;
  color: rgb(18 22 28 / .4);
  transition: color 160ms ease;
}
.skb-col[data-on="true"] .skb-day { color: var(--ink); }

.skb-tip {
  --x: 50%; --y: 0px;
  position: absolute; left: var(--x); top: var(--y);
  z-index: 2;
  box-sizing: border-box;
  width: 126px;
  padding: 9px 10px 8px;
  border-radius: 11px;
  background: #12161c;
  color: #fff;
  box-shadow: 0 1px 2px rgb(18 22 28 / .2), 0 12px 26px -12px rgb(18 22 28 / .6);
  pointer-events: none;
  opacity: 0;
  transition:
    left 240ms cubic-bezier(.2, .8, .2, 1),
    top 240ms cubic-bezier(.2, .8, .2, 1),
    opacity 120ms ease,
    transform 120ms ease;
}
/* it sits beside the day: to the right on the first half of the week, to the left after */
.skb-tip[data-side="right"] { transform: translateX(18px) scale(.94); transform-origin: 0 20%; }
.skb-tip[data-side="left"] { transform: translateX(calc(-100% - 18px)) scale(.94); transform-origin: 100% 20%; }
.skb-tip[data-show="true"] {
  opacity: 1;
  transition:
    left 240ms cubic-bezier(.2, .8, .2, 1),
    top 240ms cubic-bezier(.2, .8, .2, 1),
    opacity 160ms ease,
    transform 320ms var(--spring);
}
.skb-tip[data-show="true"][data-side="right"] { transform: translateX(18px); }
.skb-tip[data-show="true"][data-side="left"] { transform: translateX(calc(-100% - 18px)); }
.skb-tip-day { font-size: 11px; font-weight: 600; color: rgb(255 255 255 / .55); margin-bottom: 6px; }
.skb-tip-row {
  display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 7px;
  height: 18px;
  font-size: 12px; font-weight: 500;
  transition: opacity 160ms ease;
}
.skb-tip-row[data-dim="true"] { opacity: .35; }
.skb-tip-row i { width: 7px; height: 7px; border-radius: 2px; }
.skb-tip-row b { font-weight: 600; font-variant-numeric: tabular-nums; }
.skb-tip-sum {
  grid-template-columns: 1fr auto;
  margin-top: 5px; padding-top: 6px; height: auto;
  border-top: 1px solid rgb(255 255 255 / .12);
  color: rgb(255 255 255 / .7);
}
.skb-tip-sum b { color: #fff; }

.skb-legend { display: flex; gap: 4px; margin: 0 -8px; }
.skb-key {
  display: inline-flex; align-items: center; gap: 7px;
  height: 28px; padding: 0 9px;
  border: 0; border-radius: 8px;
  background: transparent;
  color: var(--ink);
  font: inherit; font-size: 12px; font-weight: 600;
  cursor: pointer;
  transition: opacity 180ms ease, background-color 160ms ease, transform 200ms var(--spring);
}
.skb-key:hover, .skb-key[aria-pressed="true"] { background: rgb(18 22 28 / .05); }
.skb-key:active { transform: scale(.96); }
.skb-key:focus-visible { outline: 2px solid var(--c0); outline-offset: 1px; }
.skb-key[data-off="true"] { opacity: .38; }
.skb-key i { width: 8px; height: 8px; border-radius: 3px; flex: none; }

.skb-sr {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .skb-seg, .skb[data-intro="true"] .skb-seg, .skb-line { transition: opacity 120ms ease; }
  .skb-tip, .skb-tip[data-show="true"] { transition: opacity 120ms ease; }
  .skb-tip[data-side="right"] { transform: translateX(18px); }
  .skb-tip[data-side="left"] { transform: translateX(calc(-100% - 18px)); }
}
`;export{U as default};
