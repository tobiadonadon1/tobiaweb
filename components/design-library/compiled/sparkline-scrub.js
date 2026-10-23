"use client";
/* Construct · Design library: the compiled preview of "Price chart". The source is for members. */
import{useEffect as I,useId as O,useMemo as U,useState as D}from"react";import{Fragment as j,jsx as a,jsxs as r}from"react/jsx-runtime";var h=(()=>{let o=1217,p=()=>{o=o+1831565813|0;let t=Math.imul(o^o>>>15,1|o);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296},n=[],s=61900,l=0;for(let t=0;t<120;t++)l=l*.8+(p()-.5)*.012,s*=1+l,n.push(s);let m=1.0374/(n[n.length-1]/n[0]);return n.map((t,y)=>Math.round(t*(1+(m-1)*(y/(n.length-1)))*100)/100)})(),X=["Sep","Oct","Nov"],E=[30,31,30];function C(o){let p=24+Math.floor(o/4),n=0;for(;p>E[n];)p-=E[n++];let s=o%4*6,l=s===0?"12 AM":s===12?"12 PM":s<12?`${s} AM`:`${s-12} PM`;return`${X[n]} ${p}, ${l}`}var d=300,u=132,L=14,_=10,c=h.length-1,M=o=>`$${o.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;function G({name:o="Bitcoin",ticker:p="BTC",tone:n="#00b35f",loss:s="#ff4d2e"}){let l=O().replace(/[^a-zA-Z0-9]/g,""),[m,t]=D(null),[y,F]=D(!1);I(()=>{let e=requestAnimationFrame(()=>F(!0));return()=>cancelAnimationFrame(e)},[]);let b=U(()=>{let e=Math.min(...h),f=Math.max(...h),g=x=>x/c*d,i=x=>L+(1-(x-e)/(f-e))*(u-L-_),S=h.map((x,$)=>[g($),i(x)]),z=S.map(([x,$],K)=>`${K?"L":"M"}${x.toFixed(1)} ${$.toFixed(1)}`).join(""),H=`${z}L${d} ${u}L0 ${u}Z`;return{pts:S,line:z,area:H,open:i(h[0])}},[]),v=m??c,w=h[v],k=w-h[0],N=k/h[0]*100,P=k>=0,[B,T]=b.pts[v],A=e=>{let f=e.currentTarget.getBoundingClientRect(),g=Math.round((e.clientX-f.left)/f.width*c);t(Math.min(c,Math.max(0,g)))},R=e=>{let f=e.shiftKey?4:1,g=m??c,i=g;if(e.key==="ArrowRight"||e.key==="ArrowUp")i=Math.min(c,g+f);else if(e.key==="ArrowLeft"||e.key==="ArrowDown")i=Math.max(0,g-f);else if(e.key==="Home")i=0;else if(e.key==="End")i=c;else if(e.key==="Escape")i=null;else return;e.preventDefault(),t(i===c?null:i)};return r(j,{children:[a("style",{children:Z}),r("div",{className:"pch","data-scrub":m!==null,"data-drawn":y,style:{"--tone":n,"--loss":s,"--cx":`${B}px`,"--cy":`${T}px`},children:[r("div",{className:"pch-head",children:[r("div",{className:"pch-asset",children:[a("span",{className:"pch-coin","aria-hidden":!0,children:p.slice(0,1)}),a("span",{className:"pch-name",children:o}),a("span",{className:"pch-ticker",children:p})]}),a("div",{className:"pch-price","aria-live":"off",children:M(w)}),r("div",{className:"pch-meta",children:[r("span",{className:"pch-change","data-up":P,children:[a("svg",{width:"9",height:"9",viewBox:"0 0 10 10","aria-hidden":!0,children:a("path",{d:"M5 1.5 9 8.5H1z",fill:"currentColor"})}),M(Math.abs(k))," (",Math.abs(N).toFixed(2),"%)"]}),a("span",{className:"pch-when",children:m===null?"Past month":C(v)})]})]}),r("div",{className:"pch-plot",role:"slider",tabIndex:0,"aria-label":`${o} price, past month`,"aria-valuemin":0,"aria-valuemax":c,"aria-valuenow":v,"aria-valuetext":`${m===null?"Now":C(v)}: ${M(w)}, ${P?"up":"down"} ${Math.abs(N).toFixed(2)} percent`,onPointerMove:A,onPointerDown:A,onPointerLeave:()=>t(null),onPointerUp:e=>e.pointerType!=="mouse"&&t(null),onPointerCancel:()=>t(null),onKeyDown:R,onBlur:()=>t(null),children:[r("svg",{className:"pch-svg pch-ghost",width:d,height:u,viewBox:`0 0 ${d} ${u}`,"aria-hidden":!0,children:[a("line",{className:"pch-open",x1:"0",x2:d,y1:b.open,y2:b.open}),a("path",{className:"pch-line",d:b.line})]}),a("div",{className:"pch-past",children:r("svg",{className:"pch-svg",width:d,height:u,viewBox:`0 0 ${d} ${u}`,"aria-hidden":!0,children:[a("defs",{children:r("linearGradient",{id:`${l}-fill`,x1:"0",y1:"0",x2:"0",y2:"1",children:[a("stop",{offset:"0",stopColor:n,stopOpacity:".2"}),a("stop",{offset:"1",stopColor:n,stopOpacity:"0"})]})}),a("path",{className:"pch-area",d:b.area,fill:`url(#${l}-fill)`}),a("path",{className:"pch-line pch-ink",d:b.line,pathLength:1})]})}),a("span",{className:"pch-cross","aria-hidden":!0}),a("span",{className:"pch-dot","aria-hidden":!0})]})]})]})}var Z=`
.pch {
  --tone: #00b35f;
  --loss: #ff4d2e;
  --ink: #0d1110;
  --glide: 420ms cubic-bezier(.2, .9, .25, 1);
  position: relative;
  box-sizing: border-box;
  width: 340px;
  padding: 20px 20px 18px;
  border-radius: 22px;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(13 17 16 / .06),
    0 1px 2px rgb(13 17 16 / .06),
    0 20px 40px -26px rgb(13 17 16 / .4);
  user-select: none;
  -webkit-user-select: none;
}
.pch-head { display: grid; gap: 6px; margin-bottom: 18px; }
.pch-asset { display: flex; align-items: center; gap: 8px; height: 22px; }
.pch-coin {
  display: grid; place-items: center;
  width: 22px; height: 22px; border-radius: 99px;
  background: var(--ink); color: #fff;
  font-size: 11.5px; font-weight: 700;
}
.pch-name { font-size: 13.5px; font-weight: 600; letter-spacing: -.005em; }
.pch-ticker {
  font: 600 10.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .06em;
  color: rgb(13 17 16 / .42);
}
.pch-price {
  font-size: 32px; font-weight: 650; line-height: 1.05;
  letter-spacing: -.03em;
  font-variant-numeric: tabular-nums;
}
.pch-meta { display: flex; align-items: center; gap: 10px; height: 18px; white-space: nowrap; }
.pch-change {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 13px; font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--tone);
}
.pch-change[data-up="false"] { color: var(--loss); }
.pch-change svg { display: block; flex: none; transition: transform 260ms cubic-bezier(.3, 1.4, .5, 1); }
.pch-change[data-up="false"] svg { transform: rotate(180deg); }
.pch-when { font-size: 13px; font-weight: 500; color: rgb(13 17 16 / .45); font-variant-numeric: tabular-nums; }

.pch-plot {
  position: relative;
  width: ${d}px;
  height: ${u}px;
  cursor: crosshair;
  touch-action: pan-y;
  outline: none;
  border-radius: 6px;
}
.pch-plot:focus-visible { outline: 2px solid var(--tone); outline-offset: 6px; border-radius: 8px; }
.pch-svg { position: absolute; left: 0; top: 0; display: block; overflow: visible; }
.pch-line { fill: none; stroke-width: 2.2; stroke-linejoin: round; stroke-linecap: round; }
.pch-ghost .pch-line { stroke: rgb(13 17 16 / .14); }
.pch-open { stroke: rgb(13 17 16 / .22); stroke-width: 1.2; stroke-dasharray: 1.5 4; stroke-linecap: round; }
.pch-ink { stroke: var(--tone); }

/* the past: full colour up to the cursor, cut with a straight edge */
.pch-past {
  position: absolute; inset: 0 -4px -4px 0;
  clip-path: inset(-12px 0 0 0);
  transition: clip-path var(--glide);
}
.pch[data-scrub="true"] .pch-past {
  clip-path: inset(-12px calc(100% - var(--cx) - 4px) 0 0);
  transition: clip-path 60ms linear;
}

/* first paint: the line draws itself in, then the fill fades up */
.pch-ink { stroke-dasharray: 1; stroke-dashoffset: 1; }
.pch-area { opacity: 0; }
.pch[data-drawn="true"] .pch-ink { stroke-dashoffset: 0; transition: stroke-dashoffset 1100ms cubic-bezier(.45, 0, .15, 1) 80ms; }
.pch[data-drawn="true"] .pch-area { opacity: 1; transition: opacity 600ms ease 700ms; }

.pch-cross {
  position: absolute; top: 0; bottom: 0; left: 0;
  width: 1px;
  background: rgb(13 17 16 / .28);
  transform: translateX(var(--cx));
  opacity: 0;
  transition: opacity 140ms ease, transform var(--glide);
  pointer-events: none;
}
.pch-dot {
  position: absolute; left: -5px; top: -5px;
  width: 10px; height: 10px; border-radius: 99px;
  background: var(--tone);
  box-shadow: 0 0 0 2.5px #fff, 0 1px 4px rgb(13 17 16 / .3);
  transform: translate(var(--cx), var(--cy));
  transition: transform var(--glide);
  pointer-events: none;
  opacity: 0;
}
.pch[data-drawn="true"] .pch-dot { opacity: 1; transition: transform var(--glide), opacity 200ms ease 1100ms; }
/* at rest the latest price breathes */
.pch-dot::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit;
  background: var(--tone);
  animation: pch-pulse 2s cubic-bezier(.2, .6, .3, 1) infinite;
}
@keyframes pch-pulse { 0% { transform: scale(1); opacity: .5; } 80%, 100% { transform: scale(3.2); opacity: 0; } }
.pch[data-scrub="true"] .pch-dot::after { animation: none; opacity: 0; }
.pch[data-scrub="true"] .pch-cross { opacity: 1; transition: opacity 140ms ease; }
.pch[data-scrub="true"] .pch-dot { transition: none; }
.pch[data-scrub="true"] .pch-cross { transform: translateX(var(--cx)); }

@media (prefers-reduced-motion: reduce) {
  .pch-ink, .pch[data-drawn="true"] .pch-ink { stroke-dashoffset: 0; transition: none; }
  .pch-area, .pch[data-drawn="true"] .pch-area { opacity: 1; transition: none; }
  .pch-past, .pch[data-scrub="true"] .pch-past, .pch-cross, .pch-dot, .pch[data-drawn="true"] .pch-dot { transition: none; }
  .pch-dot { opacity: 1; }
  .pch-dot::after { animation: none; opacity: 0; }
}
`;export{G as default};
