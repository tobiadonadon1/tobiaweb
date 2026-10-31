"use client";
/* Construct · Design library: the compiled preview of "Stacked bars". The source is for members. */
import{useEffect as E,useMemo as Z,useRef as H,useState as v}from"react";import{Fragment as q,jsx as o,jsxs as l}from"react/jsx-runtime";var c=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],i=[{name:"Organic",values:[470,540,500,590,620,430,640]},{name:"Paid",values:[230,280,260,300,330,200,360]},{name:"Referral",values:[120,140,140,150,170,130,180]}],O=6050,ee="#ff4f7b",ae="#ffb020",te=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.6 -.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.06'/%3E%3C/svg%3E")`,j=[...c.map((d,k)=>({day:k,solo:null})),{day:null,solo:null},{day:null,solo:0},{day:null,solo:1},{day:null,solo:2},{day:null,solo:null}],h=d=>d.toLocaleString("en-US"),M=d=>d.reduce((k,y)=>k+y,0);function se({label:d="Traffic",tone:k="#3d3df5",today:y=6,autoplay:S=!0}){let T=Math.min(c.length-1,Math.max(0,Math.round(y))),N=H(null),[G,W]=v(!1),[_,U]=v(!0),[t,m]=v(null),[n,u]=v(null);E(()=>{let e=requestAnimationFrame(()=>W(!0)),a=setTimeout(()=>U(!1),1100);return()=>{cancelAnimationFrame(e),clearTimeout(a)}},[]);let f=Z(()=>c.map((e,a)=>i.reduce((s,r)=>s+r.values[a],0)),[]),L=M(f),x=Math.round((L-O)/O*100),Y=Math.max(...n===null?f:i[n].values)/.88,P=t===null?n===null?L:M(i[n].values):n===null?f[t]:i[n].values[t],X=t===null?"":`${c[t]}${t===T?" \xB7 today":""}`,J=t===null?n===null?l(q,{children:["this week \xB7"," ",l("em",{className:"skb-change","data-up":x>=0,children:[x>=0?"+":"\u2212",Math.abs(x),"%"]})]}):`${i[n].name} \xB7 this week`:n===null?X:`${i[n].name} \xB7 ${c[t].slice(0,3)}`,[C,R]=v(!1);E(()=>{let e=N.current;if(!e||!S||typeof IntersectionObserver>"u")return;let a=window.matchMedia("(prefers-reduced-motion: reduce)"),s=!1,r=!1,b=!1,g=0,p=()=>R(s&&!r&&!b&&!a.matches),F=()=>{clearTimeout(g),g=window.setTimeout(p,1500)},I=new IntersectionObserver(([w])=>{s=w.isIntersecting,p()});I.observe(e);let z=()=>{r=!0,clearTimeout(g),p()},D=()=>{r=!1,F()},K=()=>{b=!0,clearTimeout(g),p()},B=w=>{b=e.contains(w.relatedTarget),F()};return e.addEventListener("pointerenter",z),e.addEventListener("pointerleave",D),e.addEventListener("focusin",K),e.addEventListener("focusout",B),a.addEventListener("change",p),()=>{I.disconnect(),clearTimeout(g),e.removeEventListener("pointerenter",z),e.removeEventListener("pointerleave",D),e.removeEventListener("focusin",K),e.removeEventListener("focusout",B),a.removeEventListener("change",p),R(!1)}},[S]);let $=H(0);E(()=>{if(!C)return;let e=()=>{let r=j[$.current%j.length];$.current++,m(r.day),u(r.solo)},a=window.setTimeout(e,900),s=window.setInterval(e,1700);return()=>{clearTimeout(a),clearInterval(s)}},[C]);let A=e=>{let a=e.currentTarget.getBoundingClientRect(),s=Math.floor((e.clientX-a.left)/a.width*c.length);m(Math.min(c.length-1,Math.max(0,s)))},Q=e=>{let a=c.length-1,s=t;if(e.key==="ArrowRight")s=t===null?0:Math.min(a,t+1);else if(e.key==="ArrowLeft")s=t===null?a:Math.max(0,t-1);else if(e.key==="Home")s=0;else if(e.key==="End")s=a;else if(e.key==="Escape")s=null;else return;e.preventDefault(),m(s)},V=t===null?"":`${c[t]}: ${i.map(e=>`${e.name} ${h(e.values[t])}`).join(", ")}. Total ${h(f[t])}.`;return l(q,{children:[o("style",{children:ne}),l("div",{ref:N,className:"skb","data-intro":_,"data-active":t!==null,"data-solo":n!==null,style:{"--tone":k,"--k1":ee,"--k2":ae,"--grain":te},children:[l("div",{className:"skb-top",children:[l("span",{className:"skb-label",children:[o("i",{"aria-hidden":!0}),d]}),o("span",{className:"skb-aside","aria-hidden":!0,children:"Sessions"})]}),l("div",{className:"skb-head",children:[l("div",{className:"skb-read",children:[o("span",{className:"skb-big",children:h(P)},P),o("span",{className:"skb-sub",children:J})]}),o("div",{className:"skb-legend",onPointerLeave:()=>u(null),children:i.map((e,a)=>l("button",{type:"button",className:"skb-key","data-k":a,"data-off":n!==null&&n!==a,"aria-pressed":n===a,onPointerEnter:()=>u(a),onFocus:()=>u(a),onBlur:()=>u(null),onClick:()=>u(s=>s===a?null:a),children:[o("i",{"aria-hidden":!0}),o("span",{children:e.name}),o("b",{children:h(t===null?M(e.values):e.values[t])})]},e.name))})]}),o("div",{className:"skb-bars",role:"group","aria-roledescription":"chart","aria-label":`${d} per day this week, by source. Use the arrow keys to read each day.`,tabIndex:0,onPointerMove:A,onPointerDown:A,onPointerLeave:e=>e.pointerType==="mouse"&&m(null),onKeyDown:Q,onBlur:()=>m(null),children:c.map((e,a)=>{let s=n===null?f[a]:i[n].values[a];return l("div",{className:"skb-col","data-on":t===a,"data-today":a===T,style:{"--i":a},children:[o("div",{className:"skb-track",children:o("div",{className:"skb-fill",style:{height:G?`${(s/Y*100).toFixed(2)}%`:"0%"},children:i.map((r,b)=>o("span",{className:"skb-seg","data-k":b,style:{flexGrow:n===null||n===b?r.values[a]:0}},r.name))})}),o("span",{className:"skb-day","aria-hidden":!0,children:e.slice(0,1)})]},e)})}),o("span",{className:"skb-sr","aria-live":"polite",children:V})]})]})}var ne=`
.skb {
  --tone: #3d3df5;
  --k1: #ff4f7b;
  --k2: #ffb020;
  --card: #f8f8f6;
  --spring: cubic-bezier(.3, 1.25, .5, 1);
  position: relative;
  box-sizing: border-box;
  width: 300px;
  padding: 18px 20px 18px;
  border-radius: 28px;
  background: var(--grain), var(--card);
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
.skb-change { font-style: normal; color: #0f9a62; }
.skb-change[data-up="false"] { color: #d83a62; }
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
.skb-key:hover, .skb-key[aria-pressed="true"] { background: color-mix(in srgb, var(--kc) 10%, transparent); color: #111; }
.skb-key:focus-visible { outline: 2px solid var(--tone); outline-offset: 0; }
.skb-key[data-off="true"] { opacity: .4; }
.skb-key i { width: 8px; height: 8px; border-radius: 3px; background: var(--kc); }
.skb-key[data-k="0"] { --kc: var(--tone); }
.skb-key[data-k="1"] { --kc: var(--k1); }
.skb-key[data-k="2"] { --kc: var(--k2); }
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
  background: #ecebe7;
  overflow: hidden;
  transition: box-shadow 300ms ease;
}
/* today's bar sits in a little light of its own colour */
.skb-col[data-today="true"] .skb-track {
  box-shadow: 0 10px 18px -10px color-mix(in srgb, var(--tone) 70%, transparent);
}
.skb-fill {
  /* resting bars: a soft stack, each source a light tint of its colour */
  --c0: color-mix(in srgb, var(--tone) 30%, #ecebe7);
  --c1: color-mix(in srgb, var(--k1) 34%, #ecebe7);
  --c2: color-mix(in srgb, var(--k2) 42%, #ecebe7);
  position: absolute; left: 0; right: 0; bottom: 0;
  display: flex;
  flex-direction: column-reverse;
  border-radius: 8px;
  overflow: hidden;
  transition: height 560ms var(--spring) calc(var(--i) * 22ms), opacity 200ms ease;
}
.skb[data-intro="true"] .skb-fill { transition: height 760ms var(--spring) calc(80ms + var(--i) * 60ms); }
/* today, and the day you point at: the sources in full colour */
.skb-col[data-today="true"] .skb-fill,
.skb-col[data-on="true"] .skb-fill { --c0: var(--tone); --c1: var(--k1); --c2: var(--k2); }
/* pointing at a day: the rest step back to their soft tints */
.skb[data-active="true"] .skb-col[data-on="false"] .skb-fill {
  --c0: color-mix(in srgb, var(--tone) 30%, #ecebe7);
  --c1: color-mix(in srgb, var(--k1) 34%, #ecebe7);
  --c2: color-mix(in srgb, var(--k2) 42%, #ecebe7);
  opacity: .6;
}
.skb[data-active="true"] .skb-col[data-on="false"] .skb-track { box-shadow: none; }
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
.skb[data-solo="false"] .skb-col[data-on="true"] .skb-seg:not(:last-child),
.skb[data-solo="false"][data-active="false"] .skb-col[data-today="true"] .skb-seg:not(:last-child) { border-top-width: 2px; }
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
  .skb-fill, .skb[data-intro="true"] .skb-fill, .skb-seg, .skb-track { transition: opacity 120ms ease; }
}
`;export{se as default};
