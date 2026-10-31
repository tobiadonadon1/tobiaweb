"use client";
/* Construct · Design library: the compiled preview of "Range dial". The source is for members. */
import{useCallback as Me,useEffect as z,useMemo as Ee,useRef as h,useState as V}from"react";import{Fragment as Ie,jsx as m,jsxs as v}from"react/jsx-runtime";var ke={"\xB0C":{min:10,max:30,step:.5,value:21.5,place:"Living room",spoken:"degrees Celsius",sign:"\xB0"},"%":{min:0,max:100,step:1,value:64,place:"Kitchen",spoken:"percent",sign:"%"}},x=300,de=61,w=232,B=[.72,.46,.6,.38,.8,.54],_={"\xB0C":[[0,"#4cc2ff"],[.3,"#3d3df5"],[.44,"#7b5cff"],[.6,"#ff4f7b"],[.84,"#ff7a45"],[1,"#ff8a3d"]],"%":[[0,"#2ecf8f"],[.45,"#4cc2ff"],[1,"#3d3df5"]]},Ce=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.6 -.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.06'/%3E%3C/svg%3E")`;function Se(a){let l=a.unit==="%"?"%":"\xB0C",u=ke[l],n=a.min??u.min,d=a.max??u.max,g=a.step??u.step,S=a.place??u.place,F=a.now??19.5,W=a.tone??"#3d3df5",N=a.autoplay??!0,{onChange:K}=a,c=d-n,P=g<1?1:0,b=Me(e=>Math.min(d,Math.max(n,Math.round((e-n)/g)*g+n)),[n,d,g]),M=b(a.defaultValue??u.value),[E,ue]=V(M),i=h(M),Q=h(M),ee=h(null),k=h(null),L=h(0),q=h(!1),D=h(!1),A=h(null),X=h(l);z(()=>{X.current!==l&&(X.current=l,cancelAnimationFrame(L.current),i.current=M,I(M),C())},[l]);let te=h(0),I=e=>{let t=b(e);if(t!==Q.current){let r=performance.now();k.current?.setAttribute("data-fast",String(r-te.current<240)),te.current=r,Q.current=t,ue(t),D.current||K?.(t)}},me=e=>{let t=e>d?e-d:e<n?e-n:0,r=(Math.min(d,Math.max(n,e))-n)/c*x,s=t/c*x;return r+Math.sign(s)*Pe(Math.abs(s),9)},C=()=>{let e=me(i.current),t=k.current;t&&(t.style.setProperty("--a",`${(e-x/2).toFixed(2)}deg`),t.style.setProperty("--hc",J(_[X.current],e/x)))};z(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");q.current=e.matches;let t=()=>q.current=e.matches;return e.addEventListener("change",t),C(),()=>{e.removeEventListener("change",t),cancelAnimationFrame(L.current)}},[]);let O=(e=0,t)=>{if(cancelAnimationFrame(L.current),q.current){i.current=b(t??i.current),I(i.current),C();return}let r=e*1e3,s=t===void 0&&Math.abs(e)*1e3>c*.15?"coast":"spring",o=b(t??i.current),p=performance.now(),f=t===void 0?320:9,R=2*(t===void 0?.72:.92)*Math.sqrt(f),U=Y=>{let T=Math.min(.05,(Y-p)/1e3);for(p=Y;T>0;){let y=Math.min(T,.004166666666666667);s==="coast"?(i.current+=r*y,r*=Math.exp(-y/.16),(i.current>d||i.current<n||Math.abs(r)<c*.04)&&(s="spring",o=b(i.current))):(r+=(-f*(i.current-o)-R*r)*y,i.current+=r*y),T-=y}if(I(i.current),C(),s==="spring"&&Math.abs(i.current-o)<c*5e-4&&Math.abs(r)<c*.01){i.current=o,I(o),C(),D.current=!1;return}L.current=requestAnimationFrame(U)};L.current=requestAnimationFrame(U)},$=e=>{D.current=!1;let t=A.current?i.current:b(i.current);i.current=Math.min(d,Math.max(n,b(t+e*g))),I(i.current),q.current?C():O(0)},ne=h($);ne.current=$;let H=h(!1);z(()=>{let e=k.current;if(!e)return;let t=0,r=s=>{if(!H.current)return;s.preventDefault(),t+=s.deltaMode===1?s.deltaY*16:s.deltaY;let o=Math.trunc(t/24);o!==0&&(t-=o*24,ne.current(-o))};return e.addEventListener("wheel",r,{passive:!1}),()=>e.removeEventListener("wheel",r)},[]);let[re,ae]=V(!1);z(()=>{let e=ee.current;if(!e||!N||typeof IntersectionObserver>"u")return;let t=window.matchMedia("(prefers-reduced-motion: reduce)"),r=!1,s=!1,o=!1,p=0,f=()=>ae(r&&!s&&!o&&!t.matches),R=()=>{clearTimeout(p),p=window.setTimeout(f,1500)},U=new IntersectionObserver(([Z])=>{r=Z.isIntersecting,f()});U.observe(e);let Y=()=>{s=!0,clearTimeout(p),f()},T=()=>{s=!1,R()},y=()=>{o=!0,clearTimeout(p),f()},G=Z=>{o=e.contains(Z.relatedTarget),R()};return e.addEventListener("pointerenter",Y),e.addEventListener("pointerleave",T),e.addEventListener("focusin",y),e.addEventListener("focusout",G),t.addEventListener("change",f),()=>{U.disconnect(),clearTimeout(p),e.removeEventListener("pointerenter",Y),e.removeEventListener("pointerleave",T),e.removeEventListener("focusin",y),e.removeEventListener("focusout",G),t.removeEventListener("change",f),ae(!1)}},[N]);let se=h(O);se.current=O,z(()=>{if(!re)return;let e=0,t=()=>{let o=b(n+B[e%B.length]*c);o===b(i.current)&&(o=b(n+B[++e%B.length]*c)),e++,D.current=!0,se.current(0,o)},r=window.setTimeout(t,900),s=window.setInterval(t,3600);return()=>{clearTimeout(r),clearInterval(s)}},[re,n,c,b]);let ie=e=>{let t=k.current.getBoundingClientRect(),r=e.clientX-(t.left+t.width/2),s=e.clientY-(t.top+t.height/2);return{deg:Math.atan2(s,r)*180/Math.PI,dist:Math.hypot(r,s)}},pe=e=>{e.button===0&&(cancelAnimationFrame(L.current),D.current=!1,H.current=!0,e.currentTarget.setPointerCapture(e.pointerId),A.current={id:e.pointerId,last:ie(e).deg,y:e.clientY,samples:[[e.timeStamp,i.current]]},k.current?.setAttribute("data-grab","true"))},fe=e=>{let t=A.current;if(!t||t.id!==e.pointerId)return;let{deg:r,dist:s}=ie(e),o;s>40?o=((r-t.last)%360+540)%360-180:o=(t.y-e.clientY)*1.1,t.last=r,t.y=e.clientY;let p=c*.12;i.current=Math.min(d+p,Math.max(n-p,i.current+o/x*c)),t.samples.push([e.timeStamp,i.current]),t.samples.length>6&&t.samples.shift(),I(i.current),C()},oe=e=>{let t=A.current;!t||t.id!==e.pointerId||(A.current=null,k.current?.setAttribute("data-grab","false"),O(Le(t.samples)))},he=e=>{let t={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:5,PageDown:-5};if(e.key in t)$(t[e.key]);else if(e.key==="Home")$(-1/0);else if(e.key==="End")$(1/0);else return;e.preventDefault()},ge=Ee(()=>Array.from({length:de},(e,t)=>{let r=t/(de-1),s=(-x/2+r*x-90)*Math.PI/180,o=w/2-2,p=o-11,f=R=>R.toFixed(2);return{t:r,c:J(_[l],r),x1:f(w/2+Math.cos(s)*p),y1:f(w/2+Math.sin(s)*p),x2:f(w/2+Math.cos(s)*o),y2:f(w/2+Math.sin(s)*o)}}),[l]),[be]=V(()=>`${((M-n)/c*x-x/2).toFixed(2)}deg`),[ve]=V(()=>J(_[l],(M-n)/c)),xe=(E-n)/c,le=E.toFixed(P),we=Math.max(d.toFixed(P).length,n.toFixed(P).length),ce=le.padStart(we," ").split(""),j=l==="\xB0C"?E>F?"Heating":E<F?"Cooling":"Holding":E===0?"Muted":"Volume",ye=l==="%"?E===0?"hold":"vol":j==="Heating"?"heat":j==="Cooling"?"cool":"hold";return v(Ie,{children:[m("style",{children:Ae}),v("div",{ref:ee,className:"rdl","data-unit":l==="%"?"pct":"deg",style:{"--tone":W,"--grain":Ce},children:[v("div",{className:"rdl-top",children:[v("span",{className:"rdl-place",children:[m("i",{"aria-hidden":!0}),S]}),m("span",{className:"rdl-aside","aria-hidden":!0,children:l==="\xB0C"?`Now ${F.toFixed(1)}\xB0`:"Speaker"})]}),v("div",{ref:k,className:"rdl-dial",role:"slider",tabIndex:0,"aria-label":l==="\xB0C"?`${S} temperature`:`${S} volume`,"aria-valuemin":n,"aria-valuemax":d,"aria-valuenow":E,"aria-valuetext":`${le} ${u.spoken}`,"data-grab":"false","data-mode":ye,style:{"--a":be,"--hc":ve},onPointerDown:pe,onPointerMove:fe,onPointerUp:oe,onPointerCancel:oe,onKeyDown:he,onFocus:()=>H.current=!0,onBlur:()=>H.current=!1,onPointerLeave:()=>{A.current||(H.current=!1)},children:[m("div",{className:"rdl-light","aria-hidden":!0}),m("svg",{className:"rdl-ring",viewBox:`0 0 ${w} ${w}`,"aria-hidden":!0,children:ge.map((e,t)=>m("line",{className:"rdl-tick","data-lit":e.t<=xe+1e-6,style:{"--c":e.c},x1:e.x1,y1:e.y1,x2:e.x2,y2:e.y2},t))}),m("div",{className:"rdl-hand","aria-hidden":!0,children:m("span",{})}),v("span",{className:"rdl-end rdl-min","aria-hidden":!0,children:[n,u.sign]}),v("span",{className:"rdl-end rdl-max","aria-hidden":!0,children:[d,u.sign]}),v("div",{className:"rdl-face","aria-hidden":!0,children:[v("span",{className:"rdl-value",children:[ce.map((e,t)=>m(Ne,{ch:e},ce.length-t)),m("span",{className:"rdl-unit",children:u.sign})]}),v("span",{className:"rdl-status",children:[m("i",{}),j]})]})]})]})]})}function Ne({ch:a}){if(a===" ")return m("span",{className:"rdl-slot","data-blank":"true"});if(!/\d/.test(a))return m("span",{className:"rdl-sym",children:a});let l=Number(a);return m("span",{className:"rdl-slot",children:"0123456789".split("").map((u,n)=>m("span",{className:"rdl-digit","data-at":n<l?"up":n>l?"down":"on",children:u},u))})}function J(a,l){let u=Math.min(1,Math.max(0,l)),n=1;for(;n<a.length-1&&a[n][0]<u;)n++;let[d,g]=a[n-1],[S,F]=a[n],W=S>d?(u-d)/(S-d):0,N=(c,P)=>parseInt(c.slice(1+P*2,3+P*2),16),K="#";for(let c=0;c<3;c++)K+=Math.round(N(g,c)+(N(F,c)-N(g,c))*W).toString(16).padStart(2,"0");return K}function Pe(a,l){return l*(1-1/(a/l+1))}function Le(a){if(a.length<2)return 0;let[l,u]=a[0],[n,d]=a[a.length-1],g=n-l;return g>0&&g<160?(d-u)/g:0}var Ae=`
.rdl {
  --tone: #3d3df5;
  position: relative;
  box-sizing: border-box;
  width: 288px;
  padding: 18px 20px 20px;
  border-radius: 28px;
  background: var(--grain), #f8f8f6;
  color: #111;
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14);
  user-select: none;
  -webkit-user-select: none;
}
.rdl-top { display: flex; align-items: center; justify-content: space-between; height: 18px; }
.rdl-place {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; line-height: 1; color: #6b6b6b;
}
.rdl-place i { width: 6px; height: 6px; border-radius: 99px; background: var(--tone); flex: none; }
.rdl-aside {
  font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: #8a8a8a;
}

.rdl-dial {
  --a: 0deg;
  position: relative;
  width: ${w}px;
  height: ${w}px;
  margin: 10px auto 0;
  border-radius: 999px;
  /* the ring lets a vertical swipe scroll the page; only the middle holds on */
  touch-action: pan-y pinch-zoom;
  cursor: grab;
  outline: none;
}
.rdl-dial[data-grab="true"] { cursor: grabbing; }
.rdl-dial:focus-visible { box-shadow: 0 0 0 2px #f8f8f6, 0 0 0 4px var(--tone); }
.rdl-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.rdl-tick {
  stroke: #dededa;
  stroke-width: 1.7;
  stroke-linecap: round;
  transition: stroke 180ms ease;
}
.rdl-tick[data-lit="true"] { stroke: var(--c); }

/* a soft light inside the ring: warm while it heats, cool while it cools */
.rdl-light {
  position: absolute;
  inset: 16px;
  border-radius: 999px;
  pointer-events: none;
}
.rdl-light::before, .rdl-light::after {
  content: "";
  position: absolute; inset: 0;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 700ms ease;
}
.rdl-light::before {
  background:
    radial-gradient(closest-side at 50% 58%, rgb(255 122 69 / .2), rgb(255 79 123 / .09) 55%, rgb(255 79 123 / 0) 100%);
}
.rdl-light::after {
  background:
    radial-gradient(closest-side at 50% 58%, rgb(76 194 255 / .22), rgb(61 61 245 / .07) 55%, rgb(61 61 245 / 0) 100%);
}
.rdl-dial[data-mode="heat"] .rdl-light::before { opacity: 1; }
.rdl-dial[data-mode="cool"] .rdl-light::after,
.rdl-dial[data-mode="vol"] .rdl-light::after { opacity: .75; }

/* the hand: one longer tick that follows the value continuously, inside the ring */
.rdl-hand {
  position: absolute; inset: 0;
  transform: rotate(var(--a));
  pointer-events: none;
}
.rdl-hand span {
  position: absolute;
  left: 50%; top: -3px;
  width: 3px; height: 19px;
  margin-left: -1.5px;
  border-radius: 3px;
  background: var(--hc);
  /* the lit tip glows softly in its own colour */
  box-shadow:
    0 0 6px 1px color-mix(in srgb, var(--hc) 55%, transparent),
    0 0 18px 4px color-mix(in srgb, var(--hc) 22%, transparent);
  transition: transform 260ms cubic-bezier(.3, 1.4, .5, 1);
  transform-origin: 50% 0;
}
.rdl-dial[data-grab="true"] .rdl-hand span { transform: scaleY(1.18); }

.rdl-end {
  position: absolute;
  bottom: 6px;
  font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: #a3a3a0;
}
.rdl-min { right: calc(50% + 12px); color: #2b93d6; }
.rdl-max { left: calc(50% + 12px); color: #e2582a; }
.rdl[data-unit="pct"] .rdl-min { color: #17a46c; }
.rdl[data-unit="pct"] .rdl-max { color: #3d3df5; }

.rdl-face {
  position: absolute;
  inset: 44px;
  border-radius: 999px;
  touch-action: none;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 4px;
  text-align: center;
}
.rdl-value {
  display: inline-flex;
  align-items: flex-start;
  font-size: 58px;
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.rdl-slot {
  position: relative;
  display: inline-block;
  width: .56em;
  height: 1.1em;
  transition: width 260ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.rdl-slot[data-blank="true"] { width: 0; opacity: 0; }
.rdl-digit {
  position: absolute;
  inset: 0;
  text-align: center;
  transition: transform 320ms cubic-bezier(.3, 1.25, .5, 1), opacity 170ms ease, filter 170ms ease;
}
.rdl-digit[data-at="up"] { transform: translateY(-.28em) scale(.94); opacity: 0; filter: blur(4px); }
.rdl-digit[data-at="down"] { transform: translateY(.28em) scale(.94); opacity: 0; filter: blur(4px); }
/* Racing through values (a sweep, a flick): swap at once, no ghosts; the soft
   lift-and-blur is for when it slows down and settles. */
.rdl-dial[data-fast="true"] .rdl-digit { transition: none; }
.rdl-sym { width: .24em; text-align: center; }
.rdl-unit { width: .2em; margin-right: -.2em; letter-spacing: 0; } /* the sign hangs, so the digits sit in the middle */
.rdl-status {
  --s: #8a8a8a;
  --sd: #a3a3a0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 10px 0 8px;
  border-radius: 99px;
  font-size: 12.5px;
  line-height: 1;
  color: var(--s);
  background: color-mix(in srgb, var(--sd) 13%, transparent);
  transition: color 300ms ease, background-color 300ms ease;
}
.rdl-status i {
  width: 6px; height: 6px; border-radius: 99px; flex: none;
  background: var(--sd);
  box-shadow: 0 0 6px color-mix(in srgb, var(--sd) 70%, transparent);
  transition: background-color 300ms ease, box-shadow 300ms ease;
}
.rdl-dial[data-mode="heat"] .rdl-status { --s: #c8431a; --sd: #ff7a45; }
.rdl-dial[data-mode="cool"] .rdl-status { --s: #1d6fc4; --sd: #4cc2ff; }
.rdl-dial[data-mode="vol"] .rdl-status { --s: #3434d6; --sd: #3d3df5; }

@media (prefers-reduced-motion: reduce) {
  .rdl-digit { transition: opacity 120ms ease; transform: none !important; filter: none !important; }
  .rdl-slot, .rdl-tick, .rdl-hand span, .rdl-light::before, .rdl-light::after, .rdl-status, .rdl-status i { transition-duration: 1ms; }
}
`;export{Se as default};
