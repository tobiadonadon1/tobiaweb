"use client";
/* Construct · Design library: the compiled preview of "Stacked bars". The source is for members. */
import{useEffect as w,useMemo as V,useRef as H,useState as v}from"react";import{Fragment as ae,jsx as o,jsxs as c}from"react/jsx-runtime";var l=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],i=[{name:"Organic",values:[470,540,500,590,620,430,640]},{name:"Paid",values:[230,280,260,300,330,200,360]},{name:"Referral",values:[120,140,140,150,170,130,180]}],j=6050,O=[...l.map((d,m)=>({day:m,solo:null})),{day:null,solo:null},{day:null,solo:0},{day:null,solo:1},{day:null,solo:2},{day:null,solo:null}],y=d=>d.toLocaleString("en-US"),E=d=>d.reduce((m,h)=>m+h,0);function Z({label:d="Traffic",tone:m="#3d3df5",today:h=6,autoplay:M=!0}){let S=Math.min(l.length-1,Math.max(0,Math.round(h))),T=H(null),[W,_]=v(!1),[q,G]=v(!0),[t,k]=v(null),[s,u]=v(null);w(()=>{let e=requestAnimationFrame(()=>_(!0)),a=setTimeout(()=>G(!1),1100);return()=>{cancelAnimationFrame(e),clearTimeout(a)}},[]);let f=V(()=>l.map((e,a)=>i.reduce((n,r)=>n+r.values[a],0)),[]),L=E(f),N=Math.round((L-j)/j*100),U=Math.max(...s===null?f:i[s].values)/.88,P=t===null?s===null?L:E(i[s].values):s===null?f[t]:i[s].values[t],Y=t===null?"":`${l[t]}${t===S?" \xB7 today":""}`,X=t===null?s===null?`this week \xB7 ${N>=0?"+":"\u2212"}${Math.abs(N)}%`:`${i[s].name} \xB7 this week`:s===null?Y:`${i[s].name} \xB7 ${l[t].slice(0,3)}`,[$,F]=v(!1);w(()=>{let e=T.current;if(!e||!M||typeof IntersectionObserver>"u")return;let a=window.matchMedia("(prefers-reduced-motion: reduce)"),n=!1,r=!1,b=!1,g=0,p=()=>F(n&&!r&&!b&&!a.matches),z=()=>{clearTimeout(g),g=window.setTimeout(p,1500)},A=new IntersectionObserver(([x])=>{n=x.isIntersecting,p()});A.observe(e);let D=()=>{r=!0,clearTimeout(g),p()},K=()=>{r=!1,z()},C=()=>{b=!0,clearTimeout(g),p()},B=x=>{b=e.contains(x.relatedTarget),z()};return e.addEventListener("pointerenter",D),e.addEventListener("pointerleave",K),e.addEventListener("focusin",C),e.addEventListener("focusout",B),a.addEventListener("change",p),()=>{A.disconnect(),clearTimeout(g),e.removeEventListener("pointerenter",D),e.removeEventListener("pointerleave",K),e.removeEventListener("focusin",C),e.removeEventListener("focusout",B),a.removeEventListener("change",p),F(!1)}},[M]);let I=H(0);w(()=>{if(!$)return;let e=()=>{let r=O[I.current%O.length];I.current++,k(r.day),u(r.solo)},a=window.setTimeout(e,900),n=window.setInterval(e,1700);return()=>{clearTimeout(a),clearInterval(n)}},[$]);let R=e=>{let a=e.currentTarget.getBoundingClientRect(),n=Math.floor((e.clientX-a.left)/a.width*l.length);k(Math.min(l.length-1,Math.max(0,n)))},J=e=>{let a=l.length-1,n=t;if(e.key==="ArrowRight")n=t===null?0:Math.min(a,t+1);else if(e.key==="ArrowLeft")n=t===null?a:Math.max(0,t-1);else if(e.key==="Home")n=0;else if(e.key==="End")n=a;else if(e.key==="Escape")n=null;else return;e.preventDefault(),k(n)},Q=t===null?"":`${l[t]}: ${i.map(e=>`${e.name} ${y(e.values[t])}`).join(", ")}. Total ${y(f[t])}.`;return c(ae,{children:[o("style",{children:ee}),c("div",{ref:T,className:"skb","data-intro":q,"data-active":t!==null,"data-solo":s!==null,style:{"--tone":m},children:[c("div",{className:"skb-top",children:[c("span",{className:"skb-label",children:[o("i",{"aria-hidden":!0}),d]}),o("span",{className:"skb-aside","aria-hidden":!0,children:"Sessions"})]}),c("div",{className:"skb-head",children:[c("div",{className:"skb-read",children:[o("span",{className:"skb-big",children:y(P)},P),o("span",{className:"skb-sub",children:X})]}),o("div",{className:"skb-legend",onPointerLeave:()=>u(null),children:i.map((e,a)=>c("button",{type:"button",className:"skb-key","data-k":a,"data-off":s!==null&&s!==a,"aria-pressed":s===a,onPointerEnter:()=>u(a),onFocus:()=>u(a),onBlur:()=>u(null),onClick:()=>u(n=>n===a?null:a),children:[o("i",{"aria-hidden":!0}),o("span",{children:e.name}),o("b",{children:y(t===null?E(e.values):e.values[t])})]},e.name))})]}),o("div",{className:"skb-bars",role:"group","aria-roledescription":"chart","aria-label":`${d} per day this week, by source. Use the arrow keys to read each day.`,tabIndex:0,onPointerMove:R,onPointerDown:R,onPointerLeave:e=>e.pointerType==="mouse"&&k(null),onKeyDown:J,onBlur:()=>k(null),children:l.map((e,a)=>{let n=s===null?f[a]:i[s].values[a];return c("div",{className:"skb-col","data-on":t===a,"data-today":a===S,style:{"--i":a},children:[o("div",{className:"skb-track",children:o("div",{className:"skb-fill",style:{height:W?`${(n/U*100).toFixed(2)}%`:"0%"},children:i.map((r,b)=>o("span",{className:"skb-seg","data-k":b,style:{flexGrow:s===null||s===b?r.values[a]:0}},r.name))})}),o("span",{className:"skb-day","aria-hidden":!0,children:e.slice(0,1)})]},e)})}),o("span",{className:"skb-sr","aria-live":"polite",children:Q})]})]})}var ee=`
.skb {
  --tone: #3d3df5;
  --card: #f8f8f6;
  --spring: cubic-bezier(.3, 1.25, .5, 1);
  position: relative;
  box-sizing: border-box;
  width: 300px;
  padding: 18px 20px 18px;
  border-radius: 28px;
  background: var(--card);
  color: #111;
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14);
  user-select: none;
  -webkit-user-select: none;
}
.skb-top { display: flex; align-items: center; justify-content: space-between; height: 18px; }
.skb-label { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; line-height: 1; color: #6b6b6b; }
.skb-label i { width: 6px; height: 6px; border-radius: 99px; background: var(--tone); flex: none; }
.skb-aside { font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace; color: #8a8a8a; }

.skb-head { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-top: 16px; }
.skb-read { display: grid; min-width: 0; }
.skb-big {
  font-size: 52px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.045em;
  font-variant-numeric: tabular-nums;
  animation: skb-in 260ms cubic-bezier(.2, .8, .2, 1);
}
@keyframes skb-in { from { opacity: .35; transform: translateY(3px); } }
.skb-sub {
  margin-top: 6px;
  font-size: 13px;
  line-height: 16px;
  color: #8a8a8a;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.skb-legend { display: grid; gap: 1px; margin: 0 -6px 0 0; flex: none; }
.skb-key {
  display: grid;
  grid-template-columns: 8px auto 38px;
  align-items: center;
  gap: 7px;
  height: 18px;
  padding: 0 6px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #8a8a8a;
  font: inherit;
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition: opacity 180ms ease, background-color 160ms ease;
}
.skb-key:hover, .skb-key[aria-pressed="true"] { background: rgb(0 0 0 / .04); color: #111; }
.skb-key:focus-visible { outline: 2px solid var(--tone); outline-offset: 0; }
.skb-key[data-off="true"] { opacity: .4; }
.skb-key i { width: 8px; height: 8px; border-radius: 2px; }
.skb-key[data-k="0"] i { background: #111; }
.skb-key[data-k="1"] i { background: #8a8a8a; }
.skb-key[data-k="2"] i { background: #cacac6; }
.skb-key b {
  font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: #8a8a8a;
}

.skb-bars {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin: 18px -4px 0;
  border-radius: 10px;
  outline: none;
  touch-action: pan-y;
  cursor: default;
}
.skb-bars:focus-visible { box-shadow: 0 0 0 2px var(--tone); }
.skb-col { display: grid; justify-items: center; gap: 9px; }
.skb-track {
  position: relative;
  width: 26px;
  height: 104px;
  border-radius: 8px;
  background: #ebebe8;
  overflow: hidden;
}
.skb-fill {
  --c0: #111; --c1: #111; --c2: #111;
  position: absolute; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column-reverse;
  border-radius: 8px;
  overflow: hidden;
  transition: height 560ms var(--spring) calc(var(--i) * 22ms), opacity 200ms ease;
}
.skb[data-intro="true"] .skb-fill { transition: height 760ms var(--spring) calc(80ms + var(--i) * 60ms); }
.skb-col[data-today="true"] .skb-fill { --c0: var(--tone); --c1: var(--tone); --c2: var(--tone); }
/* the day you point at splits into its sources, darkest at the bottom */
.skb[data-solo="false"] .skb-col[data-on="true"] .skb-fill { --c1: #8a8a8a; --c2: #cacac6; }
.skb[data-solo="false"] .skb-col[data-on="true"][data-today="true"] .skb-fill {
  --c1: color-mix(in srgb, var(--tone) 55%, #f8f8f6);
  --c2: color-mix(in srgb, var(--tone) 26%, #f8f8f6);
}
.skb[data-active="true"] .skb-col[data-on="false"] .skb-fill { opacity: .22; }
.skb-seg {
  flex: 0 1 0px;
  min-height: 0;
  box-sizing: border-box;
  border-top: 0 solid var(--card);
  background-clip: padding-box;
  transition: flex-grow 560ms var(--spring), background-color 220ms ease, border-top-width 220ms ease;
}
.skb-seg[data-k="0"] { background-color: var(--c0); }
.skb-seg[data-k="1"] { background-color: var(--c1); }
.skb-seg[data-k="2"] { background-color: var(--c2); }
.skb[data-solo="false"] .skb-col[data-on="true"] .skb-seg:not(:last-child) { border-top-width: 2px; }
.skb-day {
  font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  color: #a3a3a0;
  transition: color 160ms ease;
}
.skb-col[data-today="true"] .skb-day, .skb-col[data-on="true"] .skb-day { color: #111; }

.skb-sr {
  position: absolute; width: 1px; height: 1px; overflow: hidden;
  clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .skb-big { animation: none; }
  .skb-fill, .skb[data-intro="true"] .skb-fill, .skb-seg { transition: opacity 120ms ease; }
}
`;export{Z as default};
