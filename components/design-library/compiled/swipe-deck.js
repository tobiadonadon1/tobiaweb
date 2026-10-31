"use client";
/* Construct · Design library: the compiled preview of "Swipe deck". The source is for members. */
import{useCallback as ae,useEffect as J,useLayoutEffect as de,useRef as x,useState as F}from"react";import{Fragment as A,jsx as s,jsxs as c}from"react/jsx-runtime";var pe=[{id:"plant",title:"Plant diary",note:"Knows when to water, from one photo",shape:"leaf"},{id:"tram",title:"Night tram",note:"Live departures that work offline",shape:"moon"},{id:"split",title:"Split the bill",note:"Snap the receipt, tap who had what",shape:"split"},{id:"pasta",title:"Pasta timer",note:"Every shape, from farfalle to fusilli",shape:"bow"},{id:"run",title:"Run club",note:"Find people who run your pace",shape:"route"}],ie={paper:["#1e6a48","#2b44c4","#e09a2b","#d8452f","#0b1f3a"],night:["#0b1f3a","#16325c","#2b44c4","#0f4a5c","#1e6a48"],fruit:["#ee6a3c","#f2c14e","#c2304f","#5e9e4a","#e09a2b"]},Z=300;function ue({cards:a=pe,palette:p="paper",threshold:d=100,autoplay:h=!0,onSwipe:E}){let D=ie[p]??ie.paper,[v,y]=F(()=>a.map((e,t)=>t)),[b,N]=F(0),[k,S]=F(0),[L,j]=F(0),[U,I]=F(""),w=x(null),f=x(new Map),u=x({x:0,y:0,r:0}),C=x(null),R=x(()=>{}),q=x(!1),Q=x(!1),Y=x(!1),ee=x(null),O=v.slice(b),m=O[0],$=O.length===0;J(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");Y.current=e.matches;let t=()=>Y.current=e.matches;return e.addEventListener("change",t),()=>{e.removeEventListener("change",t),R.current()}},[]);let M=(e,t)=>w.current?.style.setProperty(e,t.toFixed(4)),W=ae(()=>{let e=m===void 0?null:f.current.get(m),{x:t,y:n,r}=u.current;e&&(e.style.transform=`translate3d(${t.toFixed(2)}px, ${n.toFixed(2)}px, 0) rotate(${r.toFixed(3)}deg)`);let i=Math.min(1,Math.abs(t)/d);M("--lift",i),M("--keep",Math.max(0,Math.min(1,t/d))),M("--skip",Math.max(0,Math.min(1,-t/d)))},[m,d]),K=e=>w.current?.setAttribute("data-live",String(e));de(()=>{u.current={x:0,y:0,r:0},M("--lift",0),M("--keep",0),M("--skip",0),Q.current&&(Q.current=!1,m!==void 0?f.current.get(m)?.focus({preventScroll:!0}):ee.current?.focus({preventScroll:!0}))},[m,L]);let H=ae((e,t=0,n=0)=>{if(m===void 0||q.current)return;q.current=!0,R.current(),K(!1);let r=f.current.get(m),i=e==="right"?1:-1,{x:l,y:o,r:g}=u.current,T=Math.max(Math.abs(t),1.6),P=i*Math.max(420,T*Z*1.4),_=o+Math.max(-120,Math.min(120,n*220));r&&Y.current?(r.style.transition=`opacity ${Z/2}ms ease`,r.style.opacity="0"):r&&(r.style.transition=`transform ${Z}ms cubic-bezier(.2,.65,.35,1), opacity ${Z}ms ease-in`,r.style.transform=`translate3d(${P}px, ${_}px, 0) rotate(${g+i*22}deg)`,r.style.opacity="0"),l===0&&M(e==="right"?"--keep":"--skip",1),M("--lift",1);let B=a[m];setTimeout(()=>{q.current=!1,e==="right"&&S(z=>z+1),N(z=>z+1),I(`${e==="right"?"Kept":"Skipped"} ${B.title}. ${O.length-1} left.`),E?.(B,e)},Z)},[m,a,E,O.length]),te=(e,t)=>{if(R.current(),Y.current){u.current={x:0,y:0,r:0},W(),K(!1);return}let n={...u.current},r=C.current?.low??!1;R.current=be(n.x,n.y,e,t,(i,l)=>{u.current={x:i,y:l,r:V(i,r)},W()},()=>K(!1))},V=(e,t)=>e/200*14*(t?-1:1),oe=e=>{if(q.current||e.button!==0)return;R.current();let t=e.currentTarget;t.setPointerCapture(e.pointerId),t.style.transition="none";let n=t.getBoundingClientRect();C.current={id:e.pointerId,sx:e.clientX-u.current.x,sy:e.clientY-u.current.y,low:e.clientY>n.top+n.height*.62,samples:[[e.timeStamp,u.current.x,u.current.y]]},K(!0),w.current?.setAttribute("data-grab","true")},ce=e=>{let t=C.current;if(!t||t.id!==e.pointerId)return;let n=e.clientX-t.sx,r=e.clientY-t.sy,i=Math.sign(r)*me(Math.abs(r),60);t.samples.push([e.timeStamp,n,i]),t.samples.length>6&&t.samples.shift(),u.current={x:n,y:i,r:V(n,t.low)},W()},X=e=>{let t=C.current;if(!t||t.id!==e.pointerId)return;w.current?.setAttribute("data-grab","false");let[n,r]=he(t.samples),{x:i}=u.current,l=Math.abs(n)>.55&&Math.sign(n)===Math.sign(i)&&Math.abs(i)>16;Math.abs(i)>d||l?(C.current=null,H(i>0?"right":"left",n,r)):(te(n,r),C.current=null)},le=e=>{(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(e.preventDefault(),Q.current=!0,H(e.key==="ArrowRight"?"right":"left"))},ne=(e=!0)=>{let t=a.map((n,r)=>r);for(let n=t.length-1;n>0;n--){let r=Math.floor(Math.random()*(n+1));[t[n],t[r]]=[t[r],t[n]]}f.current.forEach(n=>{n.style.transition="",n.style.transform="",n.style.opacity=""}),Q.current=e,y(t),N(0),S(0),j(n=>n+1),I(`Shuffled. ${a.length} cards.`)},[re,se]=F(!1);return J(()=>{let e=w.current;if(!e||!h)return;let t=window.matchMedia("(prefers-reduced-motion: reduce)"),n=!1,r=!1,i=!1,l=0,o=()=>se(n&&!r&&!i&&!t.matches),g=()=>{clearTimeout(l),l=window.setTimeout(o,1500)},T=new IntersectionObserver(([G])=>{n=G.isIntersecting,o()});T.observe(e);let P=()=>{r=!0,clearTimeout(l),o()},_=()=>{r=!1,g()},B=()=>{i=!0,clearTimeout(l),o()},z=G=>{i=e.contains(G.relatedTarget),g()};return e.addEventListener("pointerenter",P),e.addEventListener("pointerleave",_),e.addEventListener("focusin",B),e.addEventListener("focusout",z),()=>{T.disconnect(),clearTimeout(l),e.removeEventListener("pointerenter",P),e.removeEventListener("pointerleave",_),e.removeEventListener("focusin",B),e.removeEventListener("focusout",z),se(!1)}},[h]),J(()=>{if(!re)return;let e=0,t=!1,n=window.setTimeout(()=>{if($)return ne(!1);if(m===void 0||q.current||C.current)return;let r=b%3===1?-1:1,i=performance.now();t=!0,K(!0);let l=o=>{let g=Math.min(1,(o-i)/420),T=g*g,P=r*130*T;u.current={x:P,y:-8*T,r:V(P,!1)},W(),g<1?e=requestAnimationFrame(l):(t=!1,H(r>0?"right":"left",r*1.4,0))};e=requestAnimationFrame(l)},$?1400:2200);return()=>{clearTimeout(n),cancelAnimationFrame(e),t&&te(0,0)}},[re,b,L,$,m]),c(A,{children:[s("style",{children:we}),c("div",{ref:w,className:"swd","data-live":"false",style:{"--lift":0,"--keep":0,"--skip":0},children:[c("div",{className:"swd-deck","data-deal":L,children:[v.map((e,t)=>{let n=t-b;if(n<0)return null;let r=a[e],i=D[e%D.length],l=ge(i),o=n===0;return c("div",{ref:g=>{g?f.current.set(e,g):f.current.delete(e)},className:"swd-card","data-depth":Math.min(n,3),style:{"--d":n,"--c":i,"--ink":l,"--deal":v.length-1-t,zIndex:20-n},tabIndex:o?0:-1,role:o?"group":void 0,"aria-roledescription":o?"card":void 0,"aria-label":o?`${r.title}: ${r.note}. ${b+1} of ${v.length}. Left arrow to skip, right arrow to keep.`:void 0,"aria-hidden":o?void 0:!0,onPointerDown:o?oe:void 0,onPointerMove:o?ce:void 0,onPointerUp:o?X:void 0,onPointerCancel:o?X:void 0,onLostPointerCapture:o?X:void 0,onKeyDown:o?le:void 0,children:[c("div",{className:"swd-top",children:[s("span",{children:String(e+1).padStart(2,"0")}),s("span",{children:"App idea"})]}),s(fe,{shape:r.shape}),c("div",{className:"swd-text",children:[s("strong",{children:r.title}),s("span",{children:r.note})]}),o&&c(A,{children:[s("span",{className:"swd-stamp swd-stamp-keep","aria-hidden":!0,children:"Keep"}),s("span",{className:"swd-stamp swd-stamp-skip","aria-hidden":!0,children:"Skip"})]})]},`${r.id}-${L}`)}),$&&c("div",{className:"swd-empty",children:[c("strong",{children:["That\u2019s all ",a.length,"."]}),c("span",{children:["You kept ",k===0?"none":k===a.length?"every one":k,"."]}),c("button",{ref:ee,type:"button",className:"swd-shuffle",onClick:()=>ne(),children:[s("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:s("path",{d:"M3 7h3.5c4.5 0 6.5 10 11 10H21M3 17h3.5c1.6 0 2.8-1.3 3.9-3M14 9.5C15 8 16.2 7 17.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3"})}),"Shuffle again"]})]})]}),c("div",{className:"swd-bar",children:[s("button",{type:"button",className:"swd-btn swd-btn-skip","aria-label":"Skip",disabled:$,onClick:()=>H("left"),children:s("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round","aria-hidden":!0,children:s("path",{d:"M6.5 6.5l11 11M17.5 6.5l-11 11"})})}),s("span",{className:"swd-count","aria-hidden":!0,children:$?"Done":`${b+1} / ${v.length}`}),s("button",{type:"button",className:"swd-btn swd-btn-keep","aria-label":"Keep",disabled:$,onClick:()=>H("right"),children:s("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:s("path",{d:"M5 12.5l4.5 4.5L19 7.5"})})})]}),s("span",{className:"swd-sr","aria-live":"polite",children:U})]})]})}function fe({shape:a}){return c("svg",{className:"swd-art",viewBox:"0 0 120 92","aria-hidden":!0,children:[a==="leaf"&&c(A,{children:[s("path",{className:"swd-shade",d:"M30 84 C16 58 26 30 54 18 C64 44 56 70 30 84Z"}),s("path",{className:"swd-paper",d:"M24 84 C26 44 54 16 104 10 C102 56 76 84 24 84Z"}),s("path",{className:"swd-vein",d:"M28 82 C48 62 68 40 94 20 M52 62 l-4 -14 M68 46 l-2 -14 M60 56 l14 2 M76 40 l12 2"})]}),a==="moon"&&c(A,{children:[s("circle",{className:"swd-paper",cx:"58",cy:"48",r:"32"}),s("circle",{className:"swd-bite",cx:"74",cy:"38",r:"27"}),s("path",{className:"swd-paper",d:"M98 16 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5Z M100 62 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6Z"}),s("circle",{className:"swd-shade",cx:"20",cy:"22",r:"3"})]}),a==="split"&&c(A,{children:[s("path",{className:"swd-paper",d:"M56 12 A36 36 0 0 0 56 84Z"}),s("path",{className:"swd-paper",d:"M66 18 A36 36 0 0 1 66 90Z"}),s("path",{className:"swd-vein",d:"M40 32 h10 M36 46 h14 M40 60 h10 M72 38 h10 M72 52 h14 M72 66 h10"})]}),a==="bow"&&c(A,{children:[s("path",{className:"swd-paper",d:"M14 22 Q30 18 60 44 Q90 18 106 22 Q100 46 106 70 Q90 74 60 48 Q30 74 14 70 Q20 46 14 22Z"}),s("path",{className:"swd-vein",d:"M22 30 q4 16 0 32 M30 28 q4 18 0 36 M98 30 q-4 16 0 32 M90 28 q-4 18 0 36"}),s("ellipse",{className:"swd-shade",cx:"60",cy:"46",rx:"7",ry:"11"})]}),a==="route"&&c(A,{children:[s("path",{className:"swd-line",d:"M16 78 C36 78 34 52 54 50 S70 22 98 20"}),s("circle",{className:"swd-ring",cx:"16",cy:"78",r:"7"}),s("circle",{className:"swd-paper",cx:"98",cy:"20",r:"9"}),s("path",{className:"swd-shade",d:"M80 58 l12 -4 -4 12Z"})]})]})}function me(a,p){return p*(1-1/(a/p+1))}function he(a){if(a.length<2)return[0,0];let p=a[0],d=a[a.length-1],h=d[0]-p[0];return h>0&&h<160?[(d[1]-p[1])/h,(d[2]-p[2])/h]:[0,0]}function be(a,p,d,h,E,D){let y=1.24*Math.sqrt(380),b=a,N=p,k=d*1e3,S=h*1e3,L=performance.now(),j=requestAnimationFrame(function U(I){let w=Math.min(.064,(I-L)/1e3);for(L=I;w>0;){let f=Math.min(w,.004166666666666667);k+=(-380*b-y*k)*f,S+=(-380*N-y*S)*f,b+=k*f,N+=S*f,w-=f}if(Math.hypot(b,N)<.2&&Math.hypot(k,S)<8){E(0,0),D();return}E(b,N),j=requestAnimationFrame(U)});return()=>cancelAnimationFrame(j)}function ge(a){let p=/^#?([0-9a-f]{6})$/i.exec(a.trim());if(!p)return"#faf8f2";let d=parseInt(p[1],16),[h,E,D]=[d>>16&255,d>>8&255,d&255].map(v=>{let y=v/255;return y<=.03928?y/12.92:((y+.055)/1.055)**2.4});return .2126*h+.7152*E+.0722*D>.36?"#0b1f3a":"#faf8f2"}var we=`
.swd {
  --lift: 0;
  --keep: 0;
  --skip: 0;
  display: grid;
  justify-items: center;
  gap: 14px;
  font-family: inherit;
  user-select: none;
  -webkit-user-select: none;
}
.swd-deck {
  position: relative;
  width: 200px;
  height: 242px;
}

.swd-card {
  --k: calc(var(--d) - var(--lift));
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200px;
  height: 226px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 14px 16px 16px;
  border-radius: 22px;
  background: var(--c);
  color: var(--ink);
  transform-origin: 50% 0;
  transform: translateY(calc(var(--k) * -8px)) scale(calc(1 - var(--k) * .06));
  opacity: calc(3 - var(--k));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .16),
    inset 0 0 0 1px rgb(11 31 58 / .08),
    0 1px 2px rgb(11 31 58 / .12),
    0 14px 28px -16px rgb(11 31 58 / .5);
  transition: transform 420ms cubic-bezier(.3, 1.35, .5, 1), opacity 240ms ease;
  touch-action: pan-y;
  outline: none;
  overflow: hidden;
  animation: swd-in 520ms cubic-bezier(.3, 1.3, .5, 1) both;
  animation-delay: calc(var(--deal) * 55ms);
}
@keyframes swd-in { from { opacity: 0; translate: 0 26px; scale: .92; } }
.swd-card[data-depth="0"] {
  transform-origin: 50% 50%;
  cursor: grab;
  will-change: transform;
}
.swd[data-grab="true"] .swd-card[data-depth="0"] { cursor: grabbing; }
.swd[data-live="true"] .swd-card { transition: none; }
.swd-card[data-depth="0"]:focus-visible { box-shadow: 0 0 0 3px #faf8f2, 0 0 0 5px var(--c), 0 14px 28px -16px rgb(11 31 58 / .5); }

.swd-top {
  display: flex;
  justify-content: space-between;
  font: 500 10.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .72;
}
.swd-art {
  width: 132px;
  height: 100px;
  place-self: center;
  overflow: visible;
}
.swd-paper { fill: #faf8f2; filter: drop-shadow(0 2px 0 rgb(11 31 58 / .2)); }
.swd-shade { fill: color-mix(in srgb, var(--c) 55%, #0b1f3a); }
.swd-bite { fill: var(--c); }
.swd-vein { fill: none; stroke: color-mix(in srgb, var(--c) 70%, #0b1f3a); stroke-width: 2.2; stroke-linecap: round; }
.swd-line { fill: none; stroke: #faf8f2; stroke-width: 7; stroke-linecap: round; filter: drop-shadow(0 2px 0 rgb(11 31 58 / .2)); }
.swd-ring { fill: var(--c); stroke: #faf8f2; stroke-width: 4; }

.swd-text { display: grid; gap: 4px; }
.swd-text strong { font-size: 19px; font-weight: 650; letter-spacing: -0.02em; line-height: 1.1; }
.swd-text span { font-size: 12.5px; line-height: 1.3; opacity: .8; text-wrap: pretty; }

.swd-stamp {
  position: absolute;
  top: 40px;
  padding: 6px 12px 7px;
  border-radius: 10px;
  background: #faf8f2;
  border: 2.5px solid currentColor;
  font-size: 15px;
  font-weight: 750;
  letter-spacing: .08em;
  text-transform: uppercase;
  line-height: 1;
  pointer-events: none;
  box-shadow: 0 6px 14px -6px rgb(11 31 58 / .5);
}
.swd-stamp-keep { left: 14px; color: #1e6a48; rotate: -12deg; opacity: var(--keep); scale: calc(1.25 - var(--keep) * .25); }
.swd-stamp-skip { right: 14px; color: #d8452f; rotate: 12deg; opacity: var(--skip); scale: calc(1.25 - var(--skip) * .25); }

.swd-empty {
  position: absolute;
  inset: 16px 0 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 6px;
  border-radius: 22px;
  border: 1.5px dashed rgb(11 31 58 / .22);
  color: #0b1f3a;
  text-align: center;
  animation: swd-fade 360ms 120ms ease both;
}
@keyframes swd-fade { from { opacity: 0; scale: .96; } }
.swd-empty strong { font-size: 17px; font-weight: 650; letter-spacing: -0.015em; }
.swd-empty span { font-size: 13px; opacity: .62; margin-bottom: 10px; }
.swd-shuffle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: #0b1f3a;
  color: #faf8f2;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 0 rgb(255 255 255 / .12) inset, 0 8px 18px -10px rgb(11 31 58 / .7);
  transition: transform 220ms cubic-bezier(.3, 1.4, .5, 1);
}
.swd-shuffle:active { transform: scale(.96); }
.swd-shuffle:focus-visible { outline: 2px solid #0b1f3a; outline-offset: 3px; }

.swd-bar {
  display: grid;
  grid-template-columns: 44px 72px 44px;
  align-items: center;
  justify-items: center;
}
.swd-count {
  font: 500 12px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: #0b1f3a;
  opacity: .55;
}
.swd-btn {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgb(11 31 58 / .08), 0 1px 2px rgb(11 31 58 / .1), 0 6px 14px -8px rgb(11 31 58 / .4);
  transition: transform 260ms cubic-bezier(.3, 1.4, .5, 1), background-color 160ms ease, color 160ms ease, opacity 200ms ease;
}
.swd-btn-skip { color: #d8452f; scale: calc(1 + var(--skip) * .14); }
.swd-btn-keep { color: #1e6a48; scale: calc(1 + var(--keep) * .14); }
.swd-btn:active:not(:disabled) { transform: scale(.92); }
.swd-btn:focus-visible { outline: 2px solid currentColor; outline-offset: 3px; }
.swd-btn:disabled { opacity: .35; cursor: default; }
.swd-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .swd-card { transition: opacity 160ms ease; animation: swd-fade 200ms ease both; animation-delay: 0ms; }
  .swd-btn, .swd-shuffle { transition-duration: 1ms; }
}
`;export{ue as default};
