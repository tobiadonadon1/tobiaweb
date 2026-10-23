"use client";
/* Construct · Design library: the compiled preview of "Receipt". The source is for members. */
import{useEffect as T,useRef as k,useState as F}from"react";import{Fragment as j,jsx as e,jsxs as r}from"react/jsx-runtime";var B=[["Flat white",4.2],["Oat cookie",2.8],["Sparkling water",2.5]];function H({store:g="Bean & Barley",items:c=B,tax:d=.08,currency:l="$",speed:a=110,tone:h="#2ee6a6",onPrinted:o}){let[n,m]=F("idle"),[p,$]=F(0),N=k(null),x=k([]),f=k(!1),M=c.reduce((t,[,i])=>t+i,0),S=Math.round(M*d*100)/100,E=M+S,b=String(418+p).padStart(4,"0"),R=`${String(9+Math.floor((41+p*3)/60)).padStart(2,"0")}:${String((41+p*3)%60).padStart(2,"0")}`,P=()=>{x.current.forEach(t=>clearTimeout(t)),x.current=[]},u=(t,i)=>{x.current.push(window.setTimeout(t,i))};T(()=>(f.current=window.matchMedia("(prefers-reduced-motion: reduce)").matches,P),[]);let C=()=>{n==="idle"&&(P(),m("tearing"),u(()=>{$(t=>t+1),m("printing")},f.current?160:300))};return T(()=>{if(n!=="printing")return;let t=N.current;if(!t)return;let i=t.offsetHeight,w=Array.from(t.querySelectorAll("[data-line]")).map(s=>s.offsetTop+s.offsetHeight+3);w.push(i);let v=s=>t.style.setProperty("--off",`${Math.round(i-s)}px`),z=()=>{m("idle"),o?.()};if(f.current){v(i),u(z,200);return}v(0);let y=120;w.forEach((s,A)=>{u(()=>v(s),y),y+=A===w.length-1?0:a}),u(z,y+220)},[n,p]),r(j,{children:[e("style",{children:O}),r("div",{className:"rcp","data-phase":n,style:{"--rcp-tone":h,"--rcp-step":`${Math.min(140,a*.8)}ms`},children:[e("div",{className:"rcp-well",children:e("div",{className:"rcp-shadow",children:r("div",{className:"rcp-paper",ref:N,"aria-label":`Receipt ${b}`,role:"group",children:[e("div",{className:"rcp-head","data-line":!0,children:e("strong",{children:g})}),r("div",{className:"rcp-meta","data-line":!0,children:[r("span",{children:["No. ",b]}),r("span",{children:["23 Oct \xB7 ",R]})]}),e("hr",{className:"rcp-rule"}),c.map(([t,i])=>r("div",{className:"rcp-row","data-line":!0,children:[e("span",{children:t}),e("span",{className:"rcp-num",children:i.toFixed(2)})]},t)),e("hr",{className:"rcp-rule"}),r("div",{className:"rcp-row rcp-dim","data-line":!0,children:[r("span",{children:["Tax ",Math.round(d*1e3)/10,"%"]}),e("span",{className:"rcp-num",children:S.toFixed(2)})]}),r("div",{className:"rcp-row rcp-total","data-line":!0,children:[e("span",{children:"Total"}),r("span",{className:"rcp-num",children:[l,E.toFixed(2)]})]}),r("div",{className:"rcp-code","data-line":!0,children:[e(L,{seed:p+7}),r("span",{className:"rcp-num",children:["4 018240 ",b,"0 7"]})]})]},p)})}),r("div",{className:"rcp-printer",children:[e("span",{className:"rcp-led","aria-hidden":!0}),e("span",{className:"rcp-slot","aria-hidden":!0}),e("button",{type:"button",className:"rcp-btn",onClick:C,"aria-disabled":n!=="idle",children:n==="idle"?"Print":"Printing"})]}),e("span",{className:"rcp-sr",role:"status","aria-live":"polite",children:n==="printing"?"Printing":p>0?"Receipt printed":""})]})]})}function L({seed:g}){let c=g*9301+49297,d=()=>(c=(c*9301+49297)%233280)/233280,l=[],a=0,h=()=>{l.push([a,1.2],[a+2.4,1.2]),a+=4.8};for(h();a<132;){let o=.8+Math.floor(d()*3)*.8;l.push([a,o]),a+=o+.8+Math.floor(d()*3)*.8}return a=Math.max(a,134),h(),e("svg",{className:"rcp-bars",width:"140",height:"28",viewBox:`0 0 ${a-1.2} 28`,preserveAspectRatio:"none","aria-hidden":!0,children:l.map(([o,n],m)=>e("rect",{x:o,y:"0",width:n,height:"28",fill:"currentColor"},m))})}var O=`
.rcp {
  --paper: #fcfcf8;
  --ink: #232529;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 244px;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}
.rcp-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

/* The printer: a dark body with a slot, a status light and the button. */
.rcp-printer {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 48px;
  border-radius: 10px 10px 14px 14px;
  background: linear-gradient(180deg, #2a2c31, #1b1c20);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(0, 0, 0, 0.5),
    0 1px 2px rgba(0, 0, 0, 0.25),
    0 10px 22px -12px rgba(0, 0, 0, 0.55);
}
.rcp-slot {
  position: absolute; left: 18px; right: 18px; top: 5px; height: 5px;
  border-radius: 3px;
  background: #050506;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.9), 0 1px 0 rgba(255, 255, 255, 0.08);
}
.rcp-led {
  position: absolute; left: 18px; top: 24px;
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--rcp-tone);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.35), 0 0 10px var(--rcp-tone);
}
.rcp[data-phase="printing"] .rcp-led { animation: rcp-blink 420ms steps(2, jump-none) infinite; }
@keyframes rcp-blink { 50% { opacity: 0.25; box-shadow: 0 0 0 2px rgba(0,0,0,.35); } }

.rcp-btn {
  position: absolute; right: 10px; top: 17px;
  height: 22px; min-width: 74px; padding: 0 11px;
  border: 0; border-radius: 999px;
  background: var(--rcp-tone);
  color: #04261a;
  font: inherit; font-size: 11.5px; font-weight: 650; letter-spacing: 0.01em; line-height: 1;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(0, 0, 0, 0.18), 0 1px 2px rgba(0, 0, 0, 0.4);
  transition: transform 300ms cubic-bezier(.3, 1.5, .5, 1), filter 200ms ease;
}
.rcp-btn:active { transform: scale(0.93); transition-duration: 90ms; }
.rcp-btn[aria-disabled="true"] { cursor: default; filter: saturate(0.4) brightness(0.8); }
.rcp-btn:focus-visible { outline: 2px solid var(--rcp-tone); outline-offset: 3px; }

/* The paper lives above the slot: clipped at the bottom edge only, so it
   can feed up and be pulled away. The well is as tall as the receipt, so
   nothing around it moves while it prints. */
.rcp-well {
  position: relative;
  z-index: 1;
  margin-bottom: -7px;
  width: 196px;
  clip-path: inset(-120px -40px 0 -40px);
}
.rcp-shadow { filter: drop-shadow(0 1px 1px rgba(0,0,0,.08)) drop-shadow(0 10px 14px rgba(20,22,26,.14)); }
.rcp-paper {
  --off: 0px;
  padding: 15px 16px 19px;
  background:
    linear-gradient(0deg, rgba(0,0,0,.1), rgba(0,0,0,0) 16px),
    var(--paper);
  color: var(--ink);
  font-size: 11px;
  line-height: 1;
  transform: translateY(var(--off));
  transition: transform var(--rcp-step) cubic-bezier(.2, .8, .3, 1);
  /* the torn edge (where the last receipt came off): 10px teeth cut with a conic mask */
  -webkit-mask:
    linear-gradient(#000 0 0) bottom / 100% calc(100% - 6px) no-repeat,
    conic-gradient(from -45deg at 50% 100%, #000 90deg, #0000 0) top / 10px 6px repeat-x;
  mask:
    linear-gradient(#000 0 0) bottom / 100% calc(100% - 6px) no-repeat,
    conic-gradient(from -45deg at 50% 100%, #000 90deg, #0000 0) top / 10px 6px repeat-x;
}
/* a fresh receipt starts all the way inside the printer */
.rcp[data-phase="printing"] .rcp-paper { --off: 100%; }

/* Tearing: the old receipt is pulled up and away, faster than it came. */
.rcp[data-phase="tearing"] .rcp-shadow {
  transform: translate(10px, -40px) rotate(6deg);
  opacity: 0;
  transition: transform 300ms cubic-bezier(.5, 0, .9, .5), opacity 260ms ease 40ms;
}

.rcp-head { text-align: center; font-size: 13px; font-weight: 700; letter-spacing: 0.02em; padding-bottom: 7px; }
.rcp-meta, .rcp-row { display: flex; justify-content: space-between; gap: 10px; }
.rcp-meta {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 9.5px; opacity: 0.6; padding-bottom: 2px;
}
.rcp-row { padding: 3.5px 0; white-space: nowrap; }
.rcp-num { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-variant-numeric: tabular-nums; }
.rcp-dim { opacity: 0.6; }
.rcp-total { font-size: 13px; font-weight: 700; padding-top: 6px; }
.rcp-total .rcp-num { font-weight: 700; }
.rcp-rule {
  height: 0; margin: 8px 0; border: 0;
  border-top: 1.5px dashed color-mix(in srgb, var(--ink) 35%, transparent);
}
.rcp-code {
  display: flex; flex-direction: column; align-items: center; gap: 5px;
  padding-top: 10px;
}
.rcp-code .rcp-num { font-size: 8.5px; letter-spacing: 0.14em; opacity: 0.7; }
.rcp-bars { display: block; }

@media (prefers-reduced-motion: reduce) {
  .rcp-paper { transition: none; }
  .rcp[data-phase="printing"] .rcp-paper { animation: rcp-fade 220ms ease; }
  .rcp[data-phase="tearing"] .rcp-shadow { transform: none; transition: opacity 150ms ease; }
  .rcp[data-phase="printing"] .rcp-led { animation: none; }
}
@keyframes rcp-fade { from { opacity: 0; } }
`;export{H as default};
