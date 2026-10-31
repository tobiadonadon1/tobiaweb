"use client";
/* Construct · Design library: the compiled preview of "Range dial". The source is for members. */
import{useCallback as be,useEffect as $,useMemo as xe,useRef as f,useState as O}from"react";import{Fragment as Pe,jsx as l,jsxs as b}from"react/jsx-runtime";var ye={"\xB0C":{min:10,max:30,step:.5,value:21.5,place:"Living room",spoken:"degrees Celsius",sign:"\xB0"},"%":{min:0,max:100,step:1,value:64,place:"Kitchen",spoken:"percent",sign:"%"}},w=300,se=61,x=232,Y=[.72,.46,.6,.38,.8,.54];function we(i){let c=i.unit==="%"?"%":"\xB0C",h=ye[c],o=i.min??h.min,u=i.max??h.max,v=i.step??h.step,z=i.place??h.place,K=i.now??19.5,ie=i.tone??"#3d3df5",W=i.autoplay??!0,{onChange:oe}=i,p=u-o,q=v<1?1:0,g=be(e=>Math.min(u,Math.max(o,Math.round((e-o)/v)*v+o)),[o,u,v]),k=g(i.defaultValue??h.value),[L,ce]=O(k),a=f(k),X=f(k),j=f(null),M=f(null),P=f(0),H=f(!1),A=f(!1),N=f(null),Z=f(c);$(()=>{Z.current!==c&&(Z.current=c,cancelAnimationFrame(P.current),a.current=k,S(k),E())},[c]);let _=f(0),S=e=>{let t=g(e);if(t!==X.current){let n=performance.now();M.current?.setAttribute("data-fast",String(n-_.current<110)),_.current=n,X.current=t,ce(t),A.current||oe?.(t)}},le=e=>{let t=e>u?e-u:e<o?e-o:0,n=(Math.min(u,Math.max(o,e))-o)/p*w,r=t/p*w;return n+Math.sign(r)*Ee(Math.abs(r),9)},E=()=>{let e=le(a.current);M.current?.style.setProperty("--a",`${(e-w/2).toFixed(2)}deg`)};$(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");H.current=e.matches;let t=()=>H.current=e.matches;return e.addEventListener("change",t),E(),()=>{e.removeEventListener("change",t),cancelAnimationFrame(P.current)}},[]);let U=(e=0,t)=>{if(cancelAnimationFrame(P.current),H.current){a.current=g(t??a.current),S(a.current),E();return}let n=e*1e3,r=t===void 0&&Math.abs(e)*1e3>p*.15?"coast":"spring",s=g(t??a.current),d=performance.now(),m=t===void 0?320:9,C=2*(t===void 0?.72:.92)*Math.sqrt(m),D=R=>{let I=Math.min(.05,(R-d)/1e3);for(d=R;I>0;){let y=Math.min(I,.004166666666666667);r==="coast"?(a.current+=n*y,n*=Math.exp(-y/.16),(a.current>u||a.current<o||Math.abs(n)<p*.04)&&(r="spring",s=g(a.current))):(n+=(-m*(a.current-s)-C*n)*y,a.current+=n*y),I-=y}if(S(a.current),E(),r==="spring"&&Math.abs(a.current-s)<p*5e-4&&Math.abs(n)<p*.01){a.current=s,S(s),E(),A.current=!1;return}P.current=requestAnimationFrame(D)};P.current=requestAnimationFrame(D)},F=e=>{A.current=!1;let t=N.current?a.current:g(a.current);a.current=Math.min(u,Math.max(o,g(t+e*v))),S(a.current),H.current?E():U(0)},G=f(F);G.current=F;let T=f(!1);$(()=>{let e=M.current;if(!e)return;let t=0,n=r=>{if(!T.current)return;r.preventDefault(),t+=r.deltaMode===1?r.deltaY*16:r.deltaY;let s=Math.trunc(t/24);s!==0&&(t-=s*24,G.current(-s))};return e.addEventListener("wheel",n,{passive:!1}),()=>e.removeEventListener("wheel",n)},[]);let[J,Q]=O(!1);$(()=>{let e=j.current;if(!e||!W||typeof IntersectionObserver>"u")return;let t=window.matchMedia("(prefers-reduced-motion: reduce)"),n=!1,r=!1,s=!1,d=0,m=()=>Q(n&&!r&&!s&&!t.matches),C=()=>{clearTimeout(d),d=window.setTimeout(m,1500)},D=new IntersectionObserver(([B])=>{n=B.isIntersecting,m()});D.observe(e);let R=()=>{r=!0,clearTimeout(d),m()},I=()=>{r=!1,C()},y=()=>{s=!0,clearTimeout(d),m()},V=B=>{s=e.contains(B.relatedTarget),C()};return e.addEventListener("pointerenter",R),e.addEventListener("pointerleave",I),e.addEventListener("focusin",y),e.addEventListener("focusout",V),t.addEventListener("change",m),()=>{D.disconnect(),clearTimeout(d),e.removeEventListener("pointerenter",R),e.removeEventListener("pointerleave",I),e.removeEventListener("focusin",y),e.removeEventListener("focusout",V),t.removeEventListener("change",m),Q(!1)}},[W]);let ee=f(U);ee.current=U,$(()=>{if(!J)return;let e=0,t=()=>{let s=g(o+Y[e%Y.length]*p);s===g(a.current)&&(s=g(o+Y[++e%Y.length]*p)),e++,A.current=!0,ee.current(0,s)},n=window.setTimeout(t,900),r=window.setInterval(t,3600);return()=>{clearTimeout(n),clearInterval(r)}},[J,o,p,g]);let te=e=>{let t=M.current.getBoundingClientRect(),n=e.clientX-(t.left+t.width/2),r=e.clientY-(t.top+t.height/2);return{deg:Math.atan2(r,n)*180/Math.PI,dist:Math.hypot(n,r)}},ue=e=>{e.button===0&&(cancelAnimationFrame(P.current),A.current=!1,T.current=!0,e.currentTarget.setPointerCapture(e.pointerId),N.current={id:e.pointerId,last:te(e).deg,y:e.clientY,samples:[[e.timeStamp,a.current]]},M.current?.setAttribute("data-grab","true"))},de=e=>{let t=N.current;if(!t||t.id!==e.pointerId)return;let{deg:n,dist:r}=te(e),s;r>40?s=((n-t.last)%360+540)%360-180:s=(t.y-e.clientY)*1.1,t.last=n,t.y=e.clientY;let d=p*.12;a.current=Math.min(u+d,Math.max(o-d,a.current+s/w*p)),t.samples.push([e.timeStamp,a.current]),t.samples.length>6&&t.samples.shift(),S(a.current),E()},ne=e=>{let t=N.current;!t||t.id!==e.pointerId||(N.current=null,M.current?.setAttribute("data-grab","false"),U(ke(t.samples)))},me=e=>{let t={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1,PageUp:5,PageDown:-5};if(e.key in t)F(t[e.key]);else if(e.key==="Home")F(-1/0);else if(e.key==="End")F(1/0);else return;e.preventDefault()},pe=xe(()=>Array.from({length:se},(e,t)=>{let n=t/(se-1),r=(-w/2+n*w-90)*Math.PI/180,s=x/2-2,d=s-11,m=C=>C.toFixed(2);return{t:n,x1:m(x/2+Math.cos(r)*d),y1:m(x/2+Math.sin(r)*d),x2:m(x/2+Math.cos(r)*s),y2:m(x/2+Math.sin(r)*s)}}),[]),[fe]=O(()=>`${((k-o)/p*w-w/2).toFixed(2)}deg`),he=(L-o)/p,re=L.toFixed(q),ge=Math.max(u.toFixed(q).length,o.toFixed(q).length),ae=re.padStart(ge," ").split(""),ve=c==="\xB0C"?L>K?"Heating":L<K?"Cooling":"Holding":L===0?"Muted":"Volume";return b(Pe,{children:[l("style",{children:Le}),b("div",{ref:j,className:"rdl",style:{"--tone":ie},children:[b("div",{className:"rdl-top",children:[b("span",{className:"rdl-place",children:[l("i",{"aria-hidden":!0}),z]}),l("span",{className:"rdl-aside","aria-hidden":!0,children:c==="\xB0C"?`Now ${K.toFixed(1)}\xB0`:"Speaker"})]}),b("div",{ref:M,className:"rdl-dial",role:"slider",tabIndex:0,"aria-label":c==="\xB0C"?`${z} temperature`:`${z} volume`,"aria-valuemin":o,"aria-valuemax":u,"aria-valuenow":L,"aria-valuetext":`${re} ${h.spoken}`,"data-grab":"false",style:{"--a":fe},onPointerDown:ue,onPointerMove:de,onPointerUp:ne,onPointerCancel:ne,onKeyDown:me,onFocus:()=>T.current=!0,onBlur:()=>T.current=!1,onPointerLeave:()=>{N.current||(T.current=!1)},children:[l("svg",{className:"rdl-ring",viewBox:`0 0 ${x} ${x}`,"aria-hidden":!0,children:pe.map((e,t)=>l("line",{className:"rdl-tick","data-lit":e.t<=he+1e-6,x1:e.x1,y1:e.y1,x2:e.x2,y2:e.y2},t))}),l("div",{className:"rdl-hand","aria-hidden":!0,children:l("span",{})}),b("span",{className:"rdl-end rdl-min","aria-hidden":!0,children:[o,h.sign]}),b("span",{className:"rdl-end rdl-max","aria-hidden":!0,children:[u,h.sign]}),b("div",{className:"rdl-face","aria-hidden":!0,children:[b("span",{className:"rdl-value",children:[ae.map((e,t)=>l(Me,{ch:e},ae.length-t)),l("span",{className:"rdl-unit",children:h.sign})]}),l("span",{className:"rdl-status",children:ve})]})]})]})]})}function Me({ch:i}){return i===" "?l("span",{className:"rdl-slot","data-blank":"true"}):/\d/.test(i)?l("span",{className:"rdl-slot",children:l("span",{className:"rdl-col",style:{"--n":Number(i)},children:"0123456789".split("").map(c=>l("span",{children:c},c))})}):l("span",{className:"rdl-sym",children:i})}function Ee(i,c){return c*(1-1/(i/c+1))}function ke(i){if(i.length<2)return 0;let[c,h]=i[0],[o,u]=i[i.length-1],v=o-c;return v>0&&v<160?(u-h)/v:0}var Le=`
.rdl {
  --tone: #3d3df5;
  position: relative;
  box-sizing: border-box;
  width: 288px;
  padding: 18px 20px 20px;
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
  width: ${x}px;
  height: ${x}px;
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
  stroke: #dcdcd8;
  stroke-width: 1.7;
  stroke-linecap: round;
  transition: stroke 180ms ease;
}
.rdl-tick[data-lit="true"] { stroke: var(--tone); }

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
  background: var(--tone);
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
.rdl-min { right: calc(50% + 12px); }
.rdl-max { left: calc(50% + 12px); }

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
  display: inline-block;
  width: .56em;
  height: 1.1em;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(transparent, #000 16%, #000 84%, transparent);
  mask-image: linear-gradient(transparent, #000 16%, #000 84%, transparent);
  transition: width 260ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.rdl-slot[data-blank="true"] { width: 0; opacity: 0; }
.rdl-col {
  display: grid;
  text-align: center;
  transform: translateY(calc(var(--n) * -1.1em));
  transition: transform 420ms cubic-bezier(.3, 1.25, .5, 1);
}
.rdl-dial[data-fast="true"] .rdl-col { transition: none; }
.rdl-col > span { height: 1.1em; }
.rdl-sym { width: .24em; text-align: center; }
.rdl-unit { width: .2em; margin-right: -.2em; letter-spacing: 0; } /* the sign hangs, so the digits sit in the middle */
.rdl-status {
  font-size: 13px;
  line-height: 1.2;
  color: #8a8a8a;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .rdl-col { transition: none; }
  .rdl-slot, .rdl-tick, .rdl-hand span { transition-duration: 1ms; }
}
`;export{we as default};
