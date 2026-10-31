"use client";
/* Construct · Design library: the compiled preview of "Weather". The source is for members. */
import{useEffect as N,useRef as I,useState as M}from"react";import{Fragment as Q,jsx as i,jsxs as d}from"react/jsx-runtime";var R={Lisbon:{rise:462,set:1111,high:26,low:17},Oslo:{rise:492,set:1004,high:9,low:3},Tokyo:{rise:358,set:1012,high:19,low:12}},F=256,W=96,S=4,H=252,$=84,X=66,O=e=>({x:S+(H-S)*e,y:$-X*Math.sin(Math.PI*e)});function D(e,a){if(a-e<5e-4)return"";let l=Math.max(2,Math.ceil((a-e)*64)),o="";for(let x=0;x<=l;x++){let f=O(e+(a-e)*x/l);o+=`${x?"L":"M"}${f.x.toFixed(2)} ${f.y.toFixed(2)}`}return o}var j=(e,a,l)=>Math.round(a+(l-a)*Math.sin(Math.PI*Math.pow(e,1.4)));function K(e){return e<.06?"Sunrise":e<.2?"Bright":e<.7?"Clear":e<.86?"Warm light":e<.95?"Golden hour":"Sunset"}var P=e=>{let a=Math.floor(e/60)%24,l=Math.floor(e%60);return`${String(a).padStart(2,"0")}:${String(l).padStart(2,"0")}`},U=e=>Math.min(1,Math.max(0,e));function G({city:e="Lisbon",accent:a="#3d3df5",autoplay:l=!0}){let o=R[e]??R.Lisbon,{ref:x,running:f}=Y(l),[m,E]=M(.42),t=I(.42),s=I(1),[u,p]=M(!1),b=I(null),g=n=>{let r=U(n);r!==t.current&&(s.current=r>t.current?1:-1),t.current=r,E(r)};N(()=>{if(!f)return;let n=11e3,r=Math.acos(1-2*t.current);s.current<0&&(r=2*Math.PI-r);let c=performance.now(),B=c,T=0,C=A=>{let q=Math.min(64,A-c);c=A;let V=Math.min(1,(A-B)/800);r=(r+q/n*Math.PI*V)%(2*Math.PI),s.current=r<Math.PI?1:-1;let z=(1-Math.cos(r))/2;t.current=z,E(z),T=requestAnimationFrame(C)};return T=requestAnimationFrame(C),()=>cancelAnimationFrame(T)},[f]);let v=n=>{let r=b.current?.getBoundingClientRect();if(!r||r.width===0)return;let c=(n.clientX-r.left)/r.width*F;g((c-S)/(H-S))},y=o.set-o.rise,w=o.rise+m*y,k=j(m,o.low,o.high),h=K(m),L=O(m);return d(Q,{children:[i("style",{children:J}),d("div",{ref:x,className:"wx",style:{"--wx-accent":a},children:[d("div",{className:"wx-head",children:[d("span",{className:"wx-label",children:[i("span",{className:"wx-dot","aria-hidden":!0}),e]}),d("span",{className:"wx-range",children:["H ",o.high,"\xB0 \xB7 L ",o.low,"\xB0"]})]}),d("div",{className:"wx-temp","aria-hidden":!0,children:[k,"\xB0"]}),i("div",{className:"wx-sky","aria-hidden":!0,children:i("span",{className:"wx-sky-word",children:h},h)}),i("div",{ref:b,className:"wx-arc","data-dragging":u,role:"slider",tabIndex:0,"aria-label":`Time of day in ${e}`,"aria-valuemin":o.rise,"aria-valuemax":o.set,"aria-valuenow":Math.round(w),"aria-valuetext":`${P(w)}, ${k} degrees, ${h}`,onPointerDown:n=>{n.button===0&&(n.currentTarget.setPointerCapture(n.pointerId),p(!0),v(n))},onPointerMove:n=>{u&&v(n)},onPointerUp:()=>p(!1),onPointerCancel:()=>p(!1),onKeyDown:n=>{let r=(n.shiftKey?60:10)/y,c=null;n.key==="ArrowRight"||n.key==="ArrowUp"?c=t.current+r:n.key==="ArrowLeft"||n.key==="ArrowDown"?c=t.current-r:n.key==="Home"?c=0:n.key==="End"&&(c=1),c!==null&&(n.preventDefault(),g(c))},children:d("svg",{viewBox:`0 0 ${F} ${W}`,width:"100%",height:"100%","aria-hidden":!0,children:[i("line",{x1:"0",x2:F,y1:$+.5,y2:$+.5,className:"wx-base"}),i("path",{d:D(m,1),className:"wx-ahead"}),i("path",{d:D(0,m),className:"wx-done"}),d("g",{transform:`translate(${L.x.toFixed(2)} ${L.y.toFixed(2)})`,children:[i("circle",{r:"11.5",className:"wx-halo"}),i("circle",{r:"5.5",className:"wx-sun"})]})]})}),d("div",{className:"wx-times","aria-hidden":!0,children:[i("span",{children:P(o.rise)}),i("span",{className:"wx-now",children:P(w)}),i("span",{children:P(o.set)})]})]})]})}function Y(e){let a=I(null),[l,o]=M(!1),[x,f]=M(!0),[m,E]=M(!0);return N(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)"),s=()=>E(t.matches);return s(),t.addEventListener("change",s),()=>t.removeEventListener("change",s)},[]),N(()=>{let t=a.current;if(!t)return;if(typeof IntersectionObserver>"u"){o(!0);return}let s=new IntersectionObserver(([u])=>o(u.isIntersecting),{threshold:.25});return s.observe(t),()=>s.disconnect()},[]),N(()=>{let t=a.current;if(!t)return;let s=!1,u=!1,p=0,b=()=>{clearTimeout(p),f(!1)},g=()=>{clearTimeout(p),!(s||u)&&(p=window.setTimeout(()=>f(!0),1500))},v=()=>{s=!0,b()},y=()=>{s=!1,g()},w=h=>{let L=h.target,n=!0;try{n=!!L?.matches(":focus-visible")}catch{n=!0}n&&(u=!0,b())},k=h=>{h.relatedTarget instanceof Node&&t.contains(h.relatedTarget)||u&&(u=!1,g())};return t.addEventListener("pointerenter",v),t.addEventListener("pointerleave",y),t.addEventListener("focusin",w),t.addEventListener("focusout",k),()=>{clearTimeout(p),t.removeEventListener("pointerenter",v),t.removeEventListener("pointerleave",y),t.removeEventListener("focusin",w),t.removeEventListener("focusout",k)}},[]),{ref:a,visible:l,running:e&&l&&x&&!m}}var J=`
.wx {
  --wx-accent: #3d3df5;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 300px;
  padding: 22px 22px 20px;
  border-radius: 28px;
  background: #f8f8f6;
  color: #111;
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14);
  user-select: none;
  -webkit-user-select: none;
}
.wx *, .wx *::before, .wx *::after { box-sizing: border-box; }

.wx-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 16px;
  font-size: 13px;
  line-height: 1;
}
.wx-label { display: inline-flex; align-items: center; gap: 8px; color: #6b6b6b; }
.wx-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--wx-accent); flex: none; }
.wx-range { color: #6b6b6b; font-size: 12.5px; font-variant-numeric: tabular-nums; }

.wx-temp {
  margin: 18px 0 0 -4px;
  font-size: 80px;
  font-weight: 400;
  line-height: .86;
  letter-spacing: -0.045em;
  font-variant-numeric: tabular-nums;
}
.wx-sky {
  margin-top: 14px;
  height: 20px;
  font-size: 15px;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: -0.005em;
  overflow: hidden;
}
.wx-sky-word { display: block; animation: wx-in 380ms cubic-bezier(.3, 1.3, .5, 1) both; }
@keyframes wx-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

.wx-arc {
  position: relative;
  margin: auto -4px 0;
  height: 98px;
  border-radius: 12px;
  cursor: grab;
  touch-action: none;
  outline: none;
}
.wx-arc[data-dragging="true"] { cursor: grabbing; }
.wx-arc:focus-visible { box-shadow: 0 0 0 2px #f8f8f6, 0 0 0 4px var(--wx-accent); }
.wx-arc svg { display: block; overflow: visible; }

.wx-base { stroke: #e6e6e3; stroke-width: 1; }
.wx-done { fill: none; stroke: var(--wx-accent); stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.wx-ahead { fill: none; stroke: #b9b9b4; stroke-width: 1.8; stroke-linecap: round; stroke-dasharray: 0 5; }
.wx-sun { fill: var(--wx-accent); }
.wx-halo {
  fill: color-mix(in srgb, var(--wx-accent) 16%, transparent);
  transform-box: fill-box;
  transform-origin: center;
  transition: transform 340ms cubic-bezier(.3, 1.4, .5, 1);
}
.wx-arc:hover .wx-halo, .wx-arc:focus-visible .wx-halo { transform: scale(1.18); }
.wx-arc[data-dragging="true"] .wx-halo { transform: scale(1.4); }

.wx-times {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px;
  line-height: 1;
  color: #8a8a8a;
  font-variant-numeric: tabular-nums;
}
.wx-now { color: #111; }

@media (prefers-reduced-motion: reduce) {
  .wx-sky-word { animation: none; }
  .wx-halo { transition: none; }
}
`;export{G as default};
