"use client";
/* Construct · Design library: the compiled preview of "Weather". The source is for members. */
import{useEffect as S,useId as ee,useRef as T,useState as R}from"react";import{Fragment as me,jsx as o,jsxs as p}from"react/jsx-runtime";var q={Lisbon:{rise:462,set:1111,high:26,low:17},Oslo:{rise:492,set:1004,high:9,low:3},Tokyo:{rise:358,set:1012,high:19,low:12}},O=256,te=96,k=4,X=252,H=84,ne=66,j=e=>({x:k+(X-k)*e,y:H-ne*Math.sin(Math.PI*e)});function K(e,n){if(n-e<5e-4)return"";let t=Math.max(2,Math.ceil((n-e)*64)),r="";for(let f=0;f<=t;f++){let d=j(e+(n-e)*f/t);r+=`${f?"L":"M"}${d.x.toFixed(2)} ${d.y.toFixed(2)}`}return r}var re=(e,n,t)=>Math.round(n+(t-n)*Math.sin(Math.PI*Math.pow(e,1.4)));function Y(e){return e<.06?"Sunrise":e<.2?"Bright":e<.7?"Clear":e<.86?"Warm light":e<.95?"Golden hour":"Sunset"}var z=e=>[parseInt(e.slice(1,3),16),parseInt(e.slice(3,5),16),parseInt(e.slice(5,7),16)],N=(e,n,t)=>[e[0]+(n[0]-e[0])*t,e[1]+(n[1]-e[1])*t,e[2]+(n[2]-e[2])*t],u=(e,n=1)=>`rgb(${Math.round(e[0])} ${Math.round(e[1])} ${Math.round(e[2])} / ${+n.toFixed(3)})`;function V(e,n){let t=e.map(([r,f])=>[r,z(f)]);if(n<=t[0][0])return t[0][1];for(let r=1;r<t.length;r++)if(n<=t[r][0])return N(t[r-1][1],t[r][1],(n-t[r-1][0])/(t[r][0]-t[r-1][0]));return t[t.length-1][1]}var oe=[[0,"#ffa77a"],[.1,"#ffd9b8"],[.22,"#bfe4ff"],[.5,"#86d0ff"],[.64,"#ffe6b8"],[.8,"#ffb020"],[.9,"#ff7a45"],[1,"#ff4f7b"]],se=[[0,"#c8c2ff"],[.12,"#b4dfff"],[.5,"#4cc2ff"],[.66,"#7ccdff"],[.8,"#ffd27a"],[.9,"#ff9c86"],[1,"#7b5cff"]],A=["#4cc2ff","#7b5cff","#ff4f7b","#ff7a45","#ffb020","#ffd84a"].map(z),W=e=>{let n=Math.min(A.length-1,Math.max(0,e)),t=Math.min(A.length-2,Math.floor(n));return N(A[t],A[t+1],n-t)},L=[[0,2.6],[.12,4],[.3,4.5],[.5,4.75],[.7,4.4],[.82,4],[.92,3],[1,2]];function ae(e){for(let n=1;n<L.length;n++){let[t,r]=L[n-1],[f,d]=L[n];if(e<=f)return r+(d-r)*((e-t)/(f-t))}return L[L.length-1][1]}var ie=[22,22,22],ce=z("#fffbe6"),le=z("#2c9be0");function ue(e){let n=ae(e),t=W(n),r=Math.pow(Math.sin(Math.PI*e),3),f=1-Math.sin(Math.PI*e),d=Math.max(0,n-2),m=[0,.5,1].map(x=>W(d+(n-d)*x));return{tone:t,core:N(ce,t,.9-r*.72),word:N(Y(e)==="Clear"?le:t,ie,.26),arc:m,horizon:V(oe,e),upper:V(se,e),glow:.16+.44*f}}var G=e=>{let n=Math.floor(e/60)%24,t=Math.floor(e%60);return`${String(n).padStart(2,"0")}:${String(t).padStart(2,"0")}`},fe=e=>Math.min(1,Math.max(0,e));function de({city:e="Lisbon",accent:n="#3d3df5",autoplay:t=!0}){let r=q[e]??q.Lisbon,{ref:f,running:d}=pe(t),m=ee().replace(/[^a-zA-Z0-9_-]/g,""),[x,a]=R(.42),l=T(.42),g=T(1),[w,y]=R(!1),E=T(null),$=s=>{let c=fe(s);c!==l.current&&(g.current=c>l.current?1:-1),l.current=c,a(c)};S(()=>{if(!d)return;let s=11e3,c=Math.acos(1-2*l.current);g.current<0&&(c=2*Math.PI-c);let h=performance.now(),_=h,B=0,D=F=>{let J=Math.min(64,F-h);h=F;let Q=Math.min(1,(F-_)/800);c=(c+J/s*Math.PI*Q)%(2*Math.PI),g.current=c<Math.PI?1:-1;let U=(1-Math.cos(c))/2;l.current=U,a(U),B=requestAnimationFrame(D)};return B=requestAnimationFrame(D),()=>cancelAnimationFrame(B)},[d]);let C=s=>{let c=E.current?.getBoundingClientRect();if(!c||c.width===0)return;let h=(s.clientX-c.left)/c.width*O;$((h-k)/(X-k))},P=r.set-r.rise,M=r.rise+x*P,v=re(x,r.low,r.high),I=Y(x),b=j(x),i=ue(x),Z=`linear-gradient(to bottom,
    ${u(i.upper,0)} 0px,
    ${u(i.upper,.03)} 40px,
    ${u(i.upper,.17)} 80px,
    ${u(N(i.upper,i.horizon,.45),.4)} 118px,
    ${u(i.horizon,.72)} 153px,
    ${u(i.horizon,.24)} 154px,
    ${u(i.horizon,.05)} 204px)`;return p(me,{children:[o("style",{children:xe}),p("div",{ref:f,className:"wx",style:{"--wx-accent":n,"--wx-word":u(i.word)},children:[o("div",{className:"wx-band",style:{backgroundImage:Z},"aria-hidden":!0}),p("div",{className:"wx-head",children:[p("span",{className:"wx-label",children:[o("span",{className:"wx-dot","aria-hidden":!0}),e]}),p("span",{className:"wx-range",children:["H ",r.high,"\xB0 \xB7 L ",r.low,"\xB0"]})]}),p("div",{className:"wx-temp","aria-hidden":!0,children:[v,"\xB0"]}),o("div",{className:"wx-sky","aria-hidden":!0,children:o("span",{className:"wx-sky-word",children:I},I)}),o("div",{ref:E,className:"wx-arc","data-dragging":w,role:"slider",tabIndex:0,"aria-label":`Time of day in ${e}`,"aria-valuemin":r.rise,"aria-valuemax":r.set,"aria-valuenow":Math.round(M),"aria-valuetext":`${G(M)}, ${v} degrees, ${I}`,onPointerDown:s=>{s.button===0&&(s.currentTarget.setPointerCapture(s.pointerId),y(!0),C(s))},onPointerMove:s=>{w&&C(s)},onPointerUp:()=>y(!1),onPointerCancel:()=>y(!1),onKeyDown:s=>{let c=(s.shiftKey?60:10)/P,h=null;s.key==="ArrowRight"||s.key==="ArrowUp"?h=l.current+c:s.key==="ArrowLeft"||s.key==="ArrowDown"?h=l.current-c:s.key==="Home"?h=0:s.key==="End"&&(h=1),h!==null&&(s.preventDefault(),$(h))},children:p("svg",{viewBox:`0 0 ${O} ${te}`,width:"100%",height:"100%","aria-hidden":!0,children:[p("defs",{children:[p("radialGradient",{id:`${m}-glow`,children:[o("stop",{offset:"0",stopColor:u(i.tone),stopOpacity:i.glow}),o("stop",{offset:".45",stopColor:u(i.tone),stopOpacity:i.glow*.35}),o("stop",{offset:"1",stopColor:u(i.tone),stopOpacity:"0"})]}),p("radialGradient",{id:`${m}-sun`,cx:".38",cy:".36",r:".7",children:[o("stop",{offset:"0",stopColor:u(i.core)}),o("stop",{offset:"1",stopColor:u(i.tone)})]}),p("linearGradient",{id:`${m}-arc`,gradientUnits:"userSpaceOnUse",x1:k,y1:"0",x2:Math.max(k+1,b.x),y2:"0",children:[o("stop",{offset:"0",stopColor:u(i.arc[0])}),o("stop",{offset:".55",stopColor:u(i.arc[1])}),o("stop",{offset:"1",stopColor:u(i.arc[2])})]})]}),o("circle",{cx:b.x,cy:b.y,r:"64",fill:`url(#${m}-glow)`}),o("line",{x1:"-40",x2:O+40,y1:H+.5,y2:H+.5,className:"wx-base"}),o("path",{d:K(x,1),className:"wx-ahead"}),o("path",{d:K(0,x),className:"wx-done",stroke:`url(#${m}-arc)`}),p("g",{transform:`translate(${b.x.toFixed(2)} ${b.y.toFixed(2)})`,children:[o("circle",{r:"11.5",className:"wx-halo",fill:u(i.tone,.26)}),o("circle",{r:"6",className:"wx-sun",fill:`url(#${m}-sun)`})]})]})}),p("div",{className:"wx-times","aria-hidden":!0,children:[o("span",{children:G(r.rise)}),o("span",{className:"wx-now",children:G(M)}),o("span",{children:G(r.set)})]})]})]})}function pe(e){let n=T(null),[t,r]=R(!1),[f,d]=R(!0),[m,x]=R(!0);return S(()=>{let a=window.matchMedia("(prefers-reduced-motion: reduce)"),l=()=>x(a.matches);return l(),a.addEventListener("change",l),()=>a.removeEventListener("change",l)},[]),S(()=>{let a=n.current;if(!a)return;if(typeof IntersectionObserver>"u"){r(!0);return}let l=new IntersectionObserver(([g])=>r(g.isIntersecting),{threshold:.25});return l.observe(a),()=>l.disconnect()},[]),S(()=>{let a=n.current;if(!a)return;let l=!1,g=!1,w=0,y=()=>{clearTimeout(w),d(!1)},E=()=>{clearTimeout(w),!(l||g)&&(w=window.setTimeout(()=>d(!0),1500))},$=()=>{l=!0,y()},C=()=>{l=!1,E()},P=v=>{let I=v.target,b=!0;try{b=!!I?.matches(":focus-visible")}catch{b=!0}b&&(g=!0,y())},M=v=>{v.relatedTarget instanceof Node&&a.contains(v.relatedTarget)||g&&(g=!1,E())};return a.addEventListener("pointerenter",$),a.addEventListener("pointerleave",C),a.addEventListener("focusin",P),a.addEventListener("focusout",M),()=>{clearTimeout(w),a.removeEventListener("pointerenter",$),a.removeEventListener("pointerleave",C),a.removeEventListener("focusin",P),a.removeEventListener("focusout",M)}},[]),{ref:n,visible:t,running:e&&t&&f&&!m}}var he=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 -1.2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E")`,xe=`
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
  background: #f9f9f7;
  color: #111;
  font-family: inherit;
  overflow: hidden;
  isolation: isolate;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14),
    inset 0 1px 0 rgb(255 255 255 / .9);
  user-select: none;
  -webkit-user-select: none;
}
.wx *, .wx *::before, .wx *::after { box-sizing: border-box; }
/* matte paper: a whisper of grain over everything, never catching the pointer */
.wx::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: ${he};
  background-size: 160px 160px;
  opacity: .045;
  pointer-events: none;
  z-index: 3;
}
.wx-band { position: absolute; left: 0; right: 0; top: 96px; bottom: 0; pointer-events: none; }
.wx-head, .wx-temp, .wx-sky, .wx-times { position: relative; }

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
  color: var(--wx-word, #111);
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

.wx-base { stroke: rgb(255 255 255 / .7); stroke-width: 1; }
.wx-done { fill: none; stroke-width: 2.25; stroke-linecap: round; stroke-linejoin: round; }
.wx-ahead { fill: none; stroke: rgb(17 17 17 / .26); stroke-width: 1.8; stroke-linecap: round; stroke-dasharray: 0 5; }
.wx-sun { stroke: rgb(255 255 255 / .9); stroke-width: .9; }
.wx-halo {
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
  color: #7a7a7a;
  font-variant-numeric: tabular-nums;
}
.wx-now { color: #111; }

@media (prefers-reduced-motion: reduce) {
  .wx-sky-word { animation: none; }
  .wx-halo { transition: none; }
}
`;export{de as default};
