"use client";
/* Construct · Design library: the compiled preview of "Range dial". The source is for members. */
import{useCallback as it,useEffect as T,useMemo as lt,useRef as m,useState as G}from"react";import{Fragment as gt,jsx as i,jsxs as C}from"react/jsx-runtime";var ct={"\xB0C":{min:10,max:30,step:.5,value:21.5,label:"Heating to",place:"Living room",spoken:"degrees Celsius"},"%":{min:0,max:100,step:1,value:64,label:"Volume",place:"Kitchen",spoken:"percent"}},g=270,Y=41,w=240;function ut(a){let l=ct[a.unit==="%"?"%":"\xB0C"],h=a.unit==="%"?"%":"\xB0C",o=a.min??l.min,c=a.max??l.max,p=a.step??l.step,$=a.label??l.label,z=a.place??l.place,J=a.tone??"#d8452f",{onChange:O}=a,d=c-o,L=p<1?1:0,f=it(t=>Math.min(c,Math.max(o,Math.round((t-o)/p)*p+o)),[o,c,p]),k=f(a.defaultValue??l.value),[I,Q]=G(k),n=m(k),H=m(k),x=m(null),P=m(0),D=m(!1),M=m(null),K=m(h);T(()=>{K.current!==h&&(K.current=h,n.current=k,E(k),v())},[h]);let q=m(0),E=t=>{let e=f(t);if(e!==H.current){let s=performance.now();x.current?.setAttribute("data-fast",String(s-q.current<110)),q.current=s,H.current=e,Q(e),O?.(e)}},tt=t=>{let e=t>c?t-c:t<o?t-o:0,s=(Math.min(c,Math.max(o,t))-o)/d*g,r=e/d*g;return s+Math.sign(r)*mt(Math.abs(r),9)},v=()=>{let t=tt(n.current);x.current?.style.setProperty("--a",`${(t-g/2).toFixed(2)}deg`)};T(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");D.current=t.matches;let e=()=>D.current=t.matches;return t.addEventListener("change",e),v(),()=>{t.removeEventListener("change",e),cancelAnimationFrame(P.current)}},[]);let V=(t=0)=>{if(cancelAnimationFrame(P.current),D.current){n.current=f(n.current),E(n.current),v();return}let e=t*1e3,s=Math.abs(t)*1e3>d*.15?"coast":"spring",r=f(n.current),u=performance.now(),b=320,F=2*.72*Math.sqrt(b),y=R=>{let U=Math.min(.05,(R-u)/1e3);for(u=R;U>0;){let A=Math.min(U,.004166666666666667);s==="coast"?(n.current+=e*A,e*=Math.exp(-A/.16),(n.current>c||n.current<o||Math.abs(e)<d*.04)&&(s="spring",r=f(n.current))):(e+=(-b*(n.current-r)-F*e)*A,n.current+=e*A),U-=A}if(E(n.current),v(),s==="spring"&&Math.abs(n.current-r)<d*5e-4&&Math.abs(e)<d*.01){n.current=r,E(r),v();return}P.current=requestAnimationFrame(y)};P.current=requestAnimationFrame(y)},N=t=>{let e=M.current?n.current:f(n.current);n.current=Math.min(c,Math.max(o,f(e+t*p))),E(n.current),D.current?v():V(0)},B=m(N);B.current=N;let S=m(!1);T(()=>{let t=x.current;if(!t)return;let e=0,s=r=>{if(!S.current)return;r.preventDefault(),e+=r.deltaMode===1?r.deltaY*16:r.deltaY;let u=Math.trunc(e/24);u!==0&&(e-=u*24,B.current(-u))};return t.addEventListener("wheel",s,{passive:!1}),()=>t.removeEventListener("wheel",s)},[]);let W=t=>{let e=x.current.getBoundingClientRect(),s=t.clientX-(e.left+e.width/2),r=t.clientY-(e.top+e.height/2);return{deg:Math.atan2(r,s)*180/Math.PI,dist:Math.hypot(s,r)}},et=t=>{t.button===0&&(cancelAnimationFrame(P.current),S.current=!0,t.currentTarget.setPointerCapture(t.pointerId),M.current={id:t.pointerId,last:W(t).deg,y:t.clientY,samples:[[t.timeStamp,n.current]]},x.current?.setAttribute("data-grab","true"))},nt=t=>{let e=M.current;if(!e||e.id!==t.pointerId)return;let{deg:s,dist:r}=W(t),u;r>34?u=((s-e.last)%360+540)%360-180:u=(e.y-t.clientY)*1.1,e.last=s,e.y=t.clientY;let b=d*.12;n.current=Math.min(c+b,Math.max(o-b,n.current+u/g*d)),e.samples.push([t.timeStamp,n.current]),e.samples.length>6&&e.samples.shift(),E(n.current),v()},X=t=>{let e=M.current;!e||e.id!==t.pointerId||(M.current=null,x.current?.setAttribute("data-grab","false"),V(pt(e.samples)))},rt=t=>{let e={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:5,PageDown:-5};if(t.key in e)N(e[t.key]);else if(t.key==="Home")N(-1/0);else if(t.key==="End")N(1/0);else return;t.preventDefault()},at=lt(()=>Array.from({length:Y},(t,e)=>{let s=e/(Y-1),r=(-g/2+s*g-90)*Math.PI/180,u=e%5===0,b=w/2-6,F=b-(u?14:9),y=R=>R.toFixed(2);return{t:s,x1:y(w/2+Math.cos(r)*F),y1:y(w/2+Math.sin(r)*F),x2:y(w/2+Math.cos(r)*b),y2:y(w/2+Math.sin(r)*b)}}),[]),[st]=G(()=>`${((k-o)/d*g-g/2).toFixed(2)}deg`),j=(I-o)/d,Z=I.toFixed(L),ot=Math.max(c.toFixed(L).length,o.toFixed(L).length),_=Z.padStart(ot," ").split("");return C(gt,{children:[i("style",{children:bt}),C("div",{ref:x,className:"rdl",role:"slider",tabIndex:0,"aria-label":`${z} ${$.toLowerCase()}`,"aria-valuemin":o,"aria-valuemax":c,"aria-valuenow":I,"aria-valuetext":`${Z} ${l.spoken}`,"data-grab":"false",style:{"--tone":J,"--a":st},onPointerDown:et,onPointerMove:nt,onPointerUp:X,onPointerCancel:X,onKeyDown:rt,onFocus:()=>S.current=!0,onBlur:()=>S.current=!1,onPointerLeave:()=>{M.current||(S.current=!1)},children:[i("svg",{className:"rdl-ring",viewBox:`0 0 ${w} ${w}`,"aria-hidden":!0,children:at.map((t,e)=>i("line",{className:"rdl-tick","data-lit":t.t<=j+1e-6,"data-at":Math.abs(t.t-j)<.5/(Y-1),x1:t.x1,y1:t.y1,x2:t.x2,y2:t.y2},e))}),i("span",{className:"rdl-end rdl-min","aria-hidden":!0,children:o}),i("span",{className:"rdl-end rdl-max","aria-hidden":!0,children:c}),C("div",{className:"rdl-knob","aria-hidden":!0,children:[i("div",{className:"rdl-turn",children:i("span",{className:"rdl-dot"})}),C("div",{className:"rdl-face",children:[i("span",{className:"rdl-label",children:$}),C("span",{className:"rdl-value",children:[_.map((t,e)=>i(dt,{ch:t},_.length-e)),i("span",{className:"rdl-unit",children:h})]}),i("span",{className:"rdl-place",children:z})]})]})]})]})}function dt({ch:a}){return a===" "?i("span",{className:"rdl-slot","data-blank":"true"}):/\d/.test(a)?i("span",{className:"rdl-slot",children:i("span",{className:"rdl-col",style:{"--n":Number(a)},children:"0123456789".split("").map(l=>i("span",{children:l},l))})}):i("span",{className:"rdl-sym",children:a})}function mt(a,l){return l*(1-1/(a/l+1))}function pt(a){if(a.length<2)return 0;let[l,h]=a[0],[o,c]=a[a.length-1],p=o-l;return p>0&&p<160?(c-h)/p:0}var bt=`
.rdl {
  --a: 0deg;
  position: relative;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  font-family: inherit;
  color: #0b1f3a;
  /* the ring lets a vertical swipe scroll the page; only the knob holds on */
  touch-action: pan-y pinch-zoom;
  user-select: none;
  -webkit-user-select: none;
  cursor: grab;
  outline: none;
}
.rdl[data-grab="true"] { cursor: grabbing; }
.rdl-ring { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; }
.rdl-tick {
  stroke: rgb(11 31 58 / .16);
  stroke-width: 2.4;
  stroke-linecap: round;
  transition: stroke 160ms ease;
}
.rdl-tick[data-lit="true"] { stroke: var(--tone); }
.rdl-tick[data-at="true"] { stroke: #0b1f3a; stroke-width: 3; }
.rdl-end {
  position: absolute;
  bottom: 22px;
  font: 500 10.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: rgb(11 31 58 / .45);
}
.rdl-min { left: 50px; }
.rdl-max { right: 50px; }

.rdl-knob {
  position: absolute;
  inset: 40px;
  touch-action: none;
  border-radius: 999px;
  background: radial-gradient(120% 90% at 50% 18%, #fff 0 45%, #f3efe7 100%);
  box-shadow:
    inset 0 1px 0 #fff,
    inset 0 -3px 6px rgb(11 31 58 / .06),
    0 0 0 1px rgb(11 31 58 / .07),
    0 2px 3px rgb(11 31 58 / .1),
    0 16px 30px -12px rgb(11 31 58 / .4);
  transition: transform 260ms cubic-bezier(.3, 1.4, .5, 1), box-shadow 200ms ease;
}
.rdl[data-grab="true"] .rdl-knob { transform: scale(.985); }
/* focus: a ring hugging the knob, drawn on the dial itself (the round
   outline follows border-radius), with a white gap from the knob */
.rdl:focus-visible { outline: 2px solid var(--tone); outline-offset: -37px; }
.rdl:focus-visible .rdl-knob {
  box-shadow: inset 0 1px 0 #fff, 0 0 0 3px #fff, 0 16px 30px -12px rgb(11 31 58 / .4);
}
.rdl-turn { position: absolute; inset: 0; border-radius: inherit; transform: rotate(var(--a)); }
/* A knurled rim that turns with the knob, so even a small turn is visible. */
.rdl-turn::before {
  content: "";
  position: absolute;
  inset: 3px;
  border-radius: inherit;
  background: repeating-conic-gradient(rgb(11 31 58 / .1) 0 1.2deg, transparent 1.2deg 6deg);
  -webkit-mask: radial-gradient(closest-side, transparent calc(100% - 7px), #000 calc(100% - 6px));
  mask: radial-gradient(closest-side, transparent calc(100% - 7px), #000 calc(100% - 6px));
}
.rdl-dot {
  position: absolute;
  top: 15px;
  left: 50%;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border-radius: 999px;
  background: var(--tone);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--tone) 16%, transparent);
}
.rdl-face {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 2px;
  text-align: center;
}
.rdl-label, .rdl-place {
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: .01em;
  color: rgb(11 31 58 / .55);
}
.rdl-place { font: 500 10.5px/1 ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .06em; text-transform: uppercase; margin-top: 4px; }
.rdl-value {
  display: inline-flex;
  align-items: flex-start;
  font-size: 40px;
  font-weight: 600;
  letter-spacing: -0.03em;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}
.rdl-slot {
  display: inline-block;
  width: .62em;
  height: 1.1em;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(transparent, #000 18%, #000 82%, transparent);
  mask-image: linear-gradient(transparent, #000 18%, #000 82%, transparent);
  transition: width 260ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.rdl-slot[data-blank="true"] { width: 0; opacity: 0; }
.rdl-col {
  display: grid;
  text-align: center;
  transform: translateY(calc(var(--n) * -1.1em));
  transition: transform 420ms cubic-bezier(.3, 1.25, .5, 1);
}
.rdl[data-fast="true"] .rdl-col { transition: none; }
.rdl-col > span { height: 1.1em; }
.rdl-sym { width: .28em; text-align: center; }
.rdl-unit {
  margin: .2em 0 0 .08em;
  font-size: .42em;
  font-weight: 600;
  letter-spacing: 0;
  color: var(--tone);
}

@media (prefers-reduced-motion: reduce) {
  .rdl-col { transition: none; }
  .rdl-slot, .rdl-knob, .rdl-tick { transition-duration: 1ms; }
}
`;export{ut as default};
