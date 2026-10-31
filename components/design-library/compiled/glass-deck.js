"use client";
/* Construct · Design library: the compiled preview of "Glass deck". The source is for members. */
import{useCallback as pe,useEffect as ee,useId as xe,useLayoutEffect as ve,useRef as I,useState as K}from"react";import{Fragment as te,jsx as n,jsxs as l}from"react/jsx-runtime";var ye=[{id:"plant",title:"Plant Diary",note:"Point your camera at a plant. It learns the light it gets and tells you when to water.",meta:"About 2 weeks to build"},{id:"tram",title:"Night Tram",note:"Live departures for the last trams home, saved for when the signal drops.",meta:"About 3 weeks to build"},{id:"split",title:"Split the Bill",note:"Snap the receipt, tap who had what, and everyone gets their share in one message.",meta:"About 1 week to build"},{id:"pasta",title:"Pasta Timer",note:"Every shape from farfalle to fusilli, timed to the minute, with a nudge to save the water.",meta:"A weekend to build"},{id:"run",title:"Run Club",note:"Find people near you who run your pace, and join their next loop of the park.",meta:"About 4 weeks to build"}],ge={vivid:[["#2a7a68","#5bbf9f","#b4ecd6","#f6fffb"],["#3159b8","#6d97e6","#bcd5f8","#f6f9ff"],["#b04a64","#e3889a","#fbcac2","#fff7f5"],["#b0672e","#e3a35c","#fbdcae","#fffaf2"],["#2f7590","#64b1cc","#b8e5f2","#f5fcff"]],ocean:[["#3159b8","#6d97e6","#bcd5f8","#f6f9ff"]],silver:[["#48484c","#8a8a90","#d4d4d8","#ffffff"]]},$=228,E=236,q=34,ke=28,ie=-46,V=300;function we({cards:i=ye,palette:p="vivid",threshold:s=100,autoplay:c=!0,onSwipe:g}){let m=ge[p]??ge.vivid,L=xe().replace(/[^a-zA-Z0-9_-]/g,""),b=$e(),[u,P]=K(()=>i.map((e,t)=>t)),[y,x]=K(0),[S,R]=K(0),[N,z]=K(0),[D,v]=K(""),w=I(null),k=I(new Map),h=I({x:0,y:0,r:0}),F=I(null),W=I(()=>{}),Y=I(!1),X=I(!1),Z=I(!1),se=I(null),J=u.slice(y),M=J[0],G=J.length===0;ee(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");Z.current=e.matches;let t=()=>Z.current=e.matches;return e.addEventListener("change",t),()=>{e.removeEventListener("change",t),W.current()}},[]);let B=(e,t)=>w.current?.style.setProperty(e,t.toFixed(4)),Q=pe(()=>{let e=M===void 0?null:k.current.get(M),{x:t,y:r,r:a}=h.current;e&&(e.style.transform=`translate3d(${t.toFixed(2)}px, ${r.toFixed(2)}px, 0) rotate(${a.toFixed(3)}deg) ${ue(t)}`);let o=Math.min(1,Math.abs(t)/s);B("--lift",o),B("--keep",Math.max(0,Math.min(1,t/s))),B("--skip",Math.max(0,Math.min(1,-t/s)))},[M,s]),U=e=>w.current?.setAttribute("data-live",String(e));ve(()=>{h.current={x:0,y:0,r:0},B("--lift",0),B("--keep",0),B("--skip",0),X.current&&(X.current=!1,M!==void 0?k.current.get(M)?.focus({preventScroll:!0}):se.current?.focus({preventScroll:!0}))},[M,N]);let _=pe((e,t=0,r=0)=>{if(M===void 0||Y.current)return;Y.current=!0,W.current(),U(!1);let a=k.current.get(M),o=e==="right"?1:-1,{x:f,y:T,r:A}=h.current,d=Math.max(Math.abs(t),1.6),C=o*Math.max(420,d*V*1.4),H=T+Math.max(-120,Math.min(120,r*220));a&&Z.current?(a.style.transition=`opacity ${V/2}ms ease`,a.style.opacity="0"):a&&(a.style.transition=`transform ${V}ms cubic-bezier(.2,.65,.35,1), opacity ${V}ms ease-in`,a.style.transform=`translate3d(${C}px, ${H}px, 0) rotate(${A+o*16}deg) ${ue(o*400)}`,a.style.opacity="0"),f===0&&B(e==="right"?"--keep":"--skip",1),B("--lift",1);let O=i[M];setTimeout(()=>{Y.current=!1,e==="right"&&R(j=>j+1),x(j=>j+1),v(`${e==="right"?"Kept":"Skipped"} ${O.title}. ${J.length-1} left.`),g?.(O,e)},V)},[M,i,g,J.length]),oe=(e,t)=>{if(W.current(),Z.current){h.current={x:0,y:0,r:0},Q(),U(!1);return}let r={...h.current},a=F.current?.low??!1;W.current=Ee(r.x,r.y,e,t,(o,f)=>{h.current={x:o,y:f,r:ne(o,a)},Q()},()=>U(!1))},ne=(e,t)=>e/200*12*(t?-1:1),fe=e=>{if(Y.current||e.button!==0)return;W.current();let t=e.currentTarget;t.setPointerCapture(e.pointerId),t.style.transition="none";let r=t.getBoundingClientRect();F.current={id:e.pointerId,sx:e.clientX-h.current.x,sy:e.clientY-h.current.y,low:e.clientY>r.top+r.height*.62,samples:[[e.timeStamp,h.current.x,h.current.y]]},U(!0),w.current?.setAttribute("data-grab","true")},me=e=>{let t=F.current;if(!t||t.id!==e.pointerId)return;let r=e.clientX-t.sx,a=e.clientY-t.sy,o=Math.sign(a)*Se(Math.abs(a),60);t.samples.push([e.timeStamp,r,o]),t.samples.length>6&&t.samples.shift(),h.current={x:r,y:o,r:ne(r,t.low)},Q()},re=e=>{let t=F.current;if(!t||t.id!==e.pointerId)return;w.current?.setAttribute("data-grab","false");let[r,a]=Ce(t.samples),{x:o}=h.current,f=Math.abs(r)>.55&&Math.sign(r)===Math.sign(o)&&Math.abs(o)>16;Math.abs(o)>s||f?(F.current=null,_(o>0?"right":"left",r,a)):(oe(r,a),F.current=null)},he=e=>{(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(e.preventDefault(),X.current=!0,_(e.key==="ArrowRight"?"right":"left"))},le=(e=!0)=>{let t=i.map((r,a)=>a);for(let r=t.length-1;r>0;r--){let a=Math.floor(Math.random()*(r+1));[t[r],t[a]]=[t[a],t[r]]}k.current.forEach(r=>{r.style.transition="",r.style.transform="",r.style.opacity=""}),X.current=e,P(t),x(0),R(0),z(r=>r+1),v(`Shuffled. ${i.length} cards.`)},[de,ce]=K(!1);ee(()=>{let e=w.current;if(!e||!c)return;let t=window.matchMedia("(prefers-reduced-motion: reduce)"),r=!1,a=!1,o=!1,f=0,T=()=>ce(r&&!a&&!o&&!t.matches),A=()=>{clearTimeout(f),f=window.setTimeout(T,1500)},d=new IntersectionObserver(([ae])=>{r=ae.isIntersecting,T()});d.observe(e);let C=()=>{a=!0,clearTimeout(f),T()},H=()=>{a=!1,A()},O=()=>{o=!0,clearTimeout(f),T()},j=ae=>{o=e.contains(ae.relatedTarget),A()};return e.addEventListener("pointerenter",C),e.addEventListener("pointerleave",H),e.addEventListener("focusin",O),e.addEventListener("focusout",j),()=>{d.disconnect(),clearTimeout(f),e.removeEventListener("pointerenter",C),e.removeEventListener("pointerleave",H),e.removeEventListener("focusin",O),e.removeEventListener("focusout",j),ce(!1)}},[c]),ee(()=>{if(!de)return;let e=0,t=!1,r=window.setTimeout(()=>{if(G)return le(!1);if(M===void 0||Y.current||F.current)return;let a=y%3===1?-1:1,o=performance.now();t=!0,U(!0);let f=T=>{let A=Math.min(1,(T-o)/420),d=A*A,C=a*130*d;h.current={x:C,y:-8*d,r:ne(C,!1)},Q(),A<1?e=requestAnimationFrame(f):(t=!1,_(a>0?"right":"left",a*1.4,0))};e=requestAnimationFrame(f)},G?1400:2200);return()=>{clearTimeout(r),cancelAnimationFrame(e),t&&oe(0,0)}},[de,y,N,G,M]);let be=b?{filter:`url(#${L}-lens)`}:void 0;return l(te,{children:[n("style",{children:Ne}),l("div",{ref:w,className:"gld","data-live":"false",style:{"--lift":0,"--keep":0,"--skip":0},children:[b&&n(Le,{id:`${L}-lens`,map:b}),l("div",{className:"gld-deck","data-deal":N,children:[u.map((e,t)=>{let r=t-y;if(r<0)return null;let a=i[e],[o,f,T,A]=m[e%m.length],d=r===0;return l("div",{ref:C=>{C?k.current.set(e,C):k.current.delete(e)},className:"gld-card","data-depth":Math.min(r,3),style:{"--c1":o,"--c2":f,"--c3":T,"--c4":A,"--d":r,"--i":e,"--deal":u.length-1-t,zIndex:20-r},tabIndex:d?0:-1,role:d?"group":void 0,"aria-roledescription":d?"card":void 0,"aria-label":d?`${a.title}: ${a.note} ${a.meta}. ${y+1} of ${u.length}. Left arrow to skip, right arrow to keep.`:void 0,"aria-hidden":d?void 0:!0,onPointerDown:d?fe:void 0,onPointerMove:d?me:void 0,onPointerUp:d?re:void 0,onPointerCancel:d?re:void 0,onLostPointerCapture:d?re:void 0,onKeyDown:d?he:void 0,children:[n("div",{className:"gld-silk",style:be,"aria-hidden":!0,children:n(Me,{id:`${L}-${e}`,seed:e+1})}),n("div",{className:"gld-rim","aria-hidden":!0}),l("div",{className:"gld-text",children:[n("strong",{children:a.title}),n("span",{children:a.note})]}),l("div",{className:"gld-foot",children:[n("span",{children:a.meta}),n("div",{className:"gld-dots","aria-hidden":!0,children:u.map((C,H)=>n("i",{"data-on":H===t?"":void 0},H))})]}),d&&l(te,{children:[l("span",{className:"gld-badge gld-badge-keep","aria-hidden":!0,children:[n("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3.2",strokeLinecap:"round",strokeLinejoin:"round",children:n("path",{d:"M5 12.5l4.5 4.5L19 7.5"})}),"Keep"]}),l("span",{className:"gld-badge gld-badge-skip","aria-hidden":!0,children:[n("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3.2",strokeLinecap:"round",children:n("path",{d:"M6.5 6.5l11 11M17.5 6.5l-11 11"})}),"Skip"]})]})]},`${a.id}-${N}`)}),G&&l("div",{className:"gld-empty",children:[n("span",{className:"gld-done","aria-hidden":!0,children:n("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round",strokeLinejoin:"round",children:n("path",{d:"M5 12.5l4.5 4.5L19 7.5"})})}),n("strong",{children:"All sorted"}),l("span",{children:["You kept ",S===0?"none":S===i.length?"every one":`${S} of ${i.length}`,"."]}),l("button",{ref:se,type:"button",className:"gld-shuffle",onClick:()=>le(),children:[n("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:n("path",{d:"M3 7h3.5c4.5 0 6.5 10 11 10H21M3 17h3.5c1.6 0 2.8-1.3 3.9-3M14 9.5C15 8 16.2 7 17.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3"})}),"Shuffle again"]})]})]}),l("div",{className:"gld-bar",children:[n("button",{type:"button",className:"gld-btn gld-btn-skip","aria-label":"Skip",disabled:G,onClick:()=>_("left"),children:n("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round","aria-hidden":!0,children:n("path",{d:"M6.5 6.5l11 11M17.5 6.5l-11 11"})})}),n("span",{className:"gld-sep","aria-hidden":!0}),n("button",{type:"button",className:"gld-btn gld-btn-keep","aria-label":"Keep",disabled:G,onClick:()=>_("right"),children:n("svg",{width:"19",height:"19",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:n("path",{d:"M5 12.5l4.5 4.5L19 7.5"})})})]}),n("span",{className:"gld-sr","aria-live":"polite",children:D})]})]})}function Me({id:i,seed:p}){let s={viewBox:`0 0 ${$} ${E}`,preserveAspectRatio:"xMidYMid slice"},c=(g,m,L,b)=>l("filter",{id:`${i}-w${g}`,x:"-60%",y:"-60%",width:"220%",height:"220%",children:[n("feTurbulence",{type:"fractalNoise",baseFrequency:m,numOctaves:"3",seed:p*7+g,result:"noise"}),n("feDisplacementMap",{in:"SourceGraphic",in2:"noise",scale:L,xChannelSelector:"R",yChannelSelector:"G"}),n("feGaussianBlur",{stdDeviation:b})]});return l(te,{children:[l("svg",{...s,className:"gld-layer",children:[l("defs",{children:[l("radialGradient",{id:`${i}-sky`,cx:".15",cy:".1",r:"1.1",children:[n("stop",{offset:"0",style:{stopColor:"var(--c1)"}}),n("stop",{offset:".7",style:{stopColor:"var(--c2)"}}),n("stop",{offset:"1",style:{stopColor:"var(--c2)"}})]}),c(1,.012,70,10),c(2,.02,46,6),c(3,.028,30,3.5)]}),n("rect",{width:$,height:E,fill:`url(#${i}-sky)`})]}),l("svg",{...s,className:"gld-layer gld-drift-a",children:[n("ellipse",{filter:`url(#${i}-w1)`,cx:"150",cy:"168",rx:"92",ry:"62",style:{fill:"var(--c3)"},opacity:".85"}),n("ellipse",{filter:`url(#${i}-w1)`,cx:"40",cy:"220",rx:"70",ry:"40",style:{fill:"var(--c1)"},opacity:".7"})]}),l("svg",{...s,className:"gld-layer gld-drift-b",children:[n("ellipse",{filter:`url(#${i}-w2)`,cx:"176",cy:"120",rx:"58",ry:"40",style:{fill:"var(--c4)"},opacity:".55"}),n("ellipse",{filter:`url(#${i}-w2)`,cx:"90",cy:"190",rx:"60",ry:"26",style:{fill:"var(--c4)"},opacity:".35"})]}),n("svg",{...s,className:"gld-layer gld-drift-c",children:n("path",{filter:`url(#${i}-w3)`,d:"M30 176C70 150 120 160 160 140S220 100 250 112",fill:"none",style:{stroke:"var(--c4)"},strokeWidth:"10",strokeLinecap:"round",opacity:".4"})})]})}function $e(){let[i,p]=K(null);return ee(()=>{let s=document.createElement("canvas");s.width=$,s.height=E;let c=s.getContext("2d");if(!c)return;let g=c.createImageData($,E);for(let m=0;m<E;m++)for(let L=0;L<$;L++){let b=L+.5,u=m+.5,P=Math.min(Math.max(b,q),$-q),y=Math.min(Math.max(u,q),E-q),x,S,R;if(P!==b&&y!==u){let v=b-P,w=u-y,k=Math.hypot(v,w)||1;x=q-k,S=v/k,R=w/k}else{let v=b,w=$-b,k=u,h=E-u;x=Math.min(v,w,k,h),S=x===v?-1:x===w?1:0,R=S!==0?0:x===k?-1:1}let N=Math.max(0,1-Math.max(0,x)/ke),z=N*N*(3-2*N),D=(m*$+L)*4;g.data[D]=128+S*z*127,g.data[D+1]=128+R*z*127,g.data[D+2]=128,g.data[D+3]=255}c.putImageData(g,0,0),p(s.toDataURL())},[]),i}function Le({id:i,map:p}){let s=(c,g,m)=>l(te,{children:[n("feDisplacementMap",{in:"SourceGraphic",in2:"map",scale:c,xChannelSelector:"R",yChannelSelector:"G",result:`${m}d`}),n("feColorMatrix",{in:`${m}d`,type:"matrix",values:g,result:m})]});return n("svg",{className:"gld-defs",width:"0",height:"0","aria-hidden":!0,children:l("filter",{id:i,x:"0",y:"0",width:$,height:E,filterUnits:"userSpaceOnUse",colorInterpolationFilters:"sRGB",children:[n("feImage",{href:p,x:"0",y:"0",width:$,height:E,preserveAspectRatio:"none",result:"map"}),s(ie,"1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0","r"),s(ie*1.04,"0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0","g"),s(ie*1.07,"0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0","b"),n("feBlend",{in:"r",in2:"g",mode:"screen",result:"rg"}),n("feBlend",{in:"rg",in2:"b",mode:"screen"})]})})}function ue(i){return`perspective(700px) rotateY(${Math.max(-14,Math.min(14,i*.08)).toFixed(2)}deg)`}function Se(i,p){return p*(1-1/(i/p+1))}function Ce(i){if(i.length<2)return[0,0];let p=i[0],s=i[i.length-1],c=s[0]-p[0];return c>0&&c<160?[(s[1]-p[1])/c,(s[2]-p[2])/c]:[0,0]}function Ee(i,p,s,c,g,m){let b=1.24*Math.sqrt(380),u=i,P=p,y=s*1e3,x=c*1e3,S=performance.now(),R=requestAnimationFrame(function N(z){let D=Math.min(.064,(z-S)/1e3);for(S=z;D>0;){let v=Math.min(D,.004166666666666667);y+=(-380*u-b*y)*v,x+=(-380*P-b*x)*v,u+=y*v,P+=x*v,D-=v}if(Math.hypot(u,P)<.2&&Math.hypot(y,x)<8){g(0,0),m();return}g(u,P),R=requestAnimationFrame(N)});return()=>cancelAnimationFrame(R)}var Ne=`
.gld {
  --lift: 0;
  --keep: 0;
  --skip: 0;
  --label: #1d1d1f;
  --secondary: #6e6e73;
  --green: #248a3d;
  --red: #d70015;
  display: grid;
  justify-items: center;
  gap: 18px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
  color: var(--label);
  user-select: none;
  -webkit-user-select: none;
}
.gld-defs { position: absolute; width: 0; height: 0; }
.gld-deck { position: relative; width: ${$}px; height: ${E+22}px; }

/* The card: a slab of tinted glass. Colour lives inside it (the silk); the
   glass is the rim that catches the light, the glow just inside the edge
   that gives it thickness, and the shadow it throws in its own colour. */
.gld-card {
  --k: calc(var(--d) - var(--lift));
  position: absolute;
  left: 0;
  bottom: 0;
  width: ${$}px;
  height: ${E}px;
  box-sizing: border-box;
  display: grid;
  grid-template-rows: 1fr auto;
  padding: 20px 20px 16px;
  border-radius: ${q}px;
  overflow: hidden;
  isolation: isolate;
  background: var(--c2);
  color: #fff;
  transform-origin: 50% 0;
  transform: translateY(calc(var(--k) * -11px)) scale(calc(1 - var(--k) * .06));
  opacity: calc(3 - var(--k));
  box-shadow:
    0 0 0 .5px rgb(0 0 0 / .06),
    0 2px 6px -2px rgb(0 0 0 / .16),
    0 24px 44px -22px color-mix(in srgb, var(--c1) 55%, transparent);
  transition: transform 440ms cubic-bezier(.3, 1.3, .5, 1), opacity 240ms ease;
  touch-action: pan-y;
  outline: none;
  animation: gld-in 560ms cubic-bezier(.3, 1.25, .5, 1) both;
  animation-delay: calc(var(--deal) * 55ms);
}
@keyframes gld-in { from { opacity: 0; translate: 0 24px; scale: .94; } }
.gld-card[data-depth="0"] {
  transform-origin: 50% 50%;
  cursor: grab;
  will-change: transform;
}
.gld[data-grab="true"] .gld-card[data-depth="0"] { cursor: grabbing; }
.gld[data-live="true"] .gld-card { transition: none; }
.gld-card[data-depth="0"]:focus-visible { outline: 3px solid #0a84ff; outline-offset: 3px; }
/* Cards waiting behind show their colour only; the words come up as they rise. */
.gld-card:not([data-depth="0"]) :is(.gld-text, .gld-foot) { opacity: clamp(0, calc((.6 - var(--k)) * 2.5), 1); transition: opacity 200ms ease; }

.gld-silk { position: absolute; inset: 0; z-index: -2; }
.gld-layer { position: absolute; left: -14%; top: -14%; width: 128%; height: 128%; }
.gld-drift-a, .gld-drift-b, .gld-drift-c { will-change: transform; animation: gld-a 14s ease-in-out infinite alternate; animation-delay: calc(var(--i) * -2.9s); }
.gld-drift-b { animation-name: gld-b; animation-duration: 10s; animation-delay: calc(var(--i) * -2.1s); }
.gld-drift-c { animation-name: gld-c; animation-duration: 12s; animation-delay: calc(var(--i) * -3.7s); }
@keyframes gld-a { from { transform: translate(-7%, 4%) rotate(-6deg) scale(1); } to { transform: translate(6%, -6%) rotate(5deg) scale(1.08); } }
@keyframes gld-b { from { transform: translate(6%, -4%) scale(1.05); } to { transform: translate(-8%, 6%) scale(.95); } }
@keyframes gld-c { from { transform: translate(-5%, 3%) rotate(4deg); } to { transform: translate(7%, -4%) rotate(-5deg); } }
.gld-card[data-depth="2"] .gld-layer, .gld-card[data-depth="3"] .gld-layer { animation-play-state: paused; }

.gld-rim {
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background:
    radial-gradient(90% 70% at 6% 0%, rgb(255 255 255 / .2), rgb(255 255 255 / 0) 55%),
    linear-gradient(180deg, rgb(0 0 0 / 0) 62%, rgb(0 0 0 / .2));
  box-shadow:
    inset 0 1.5px 1px rgb(255 255 255 / .7),
    inset 0 -1px 1px rgb(255 255 255 / .28),
    inset 12px 14px 24px -16px rgb(255 255 255 / .5),
    inset -14px -16px 26px -18px rgb(255 255 255 / .32);
}
.gld-rim::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: linear-gradient(135deg, rgb(255 255 255 / .95), rgb(255 255 255 / .3) 22%, rgb(255 255 255 / 0) 48%, rgb(255 255 255 / .2) 72%, rgb(255 255 255 / .85));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}

.gld-text { display: grid; align-content: start; gap: 5px; }
.gld-text strong {
  font-size: 21px;
  font-weight: 600;
  letter-spacing: -0.024em;
  line-height: 1.15;
  text-shadow: 0 1px 2px rgb(0 0 0 / .18);
}
.gld-text span {
  font-size: 14px;
  line-height: 1.34;
  color: rgb(255 255 255 / .88);
  text-wrap: pretty;
  text-shadow: 0 1px 2px rgb(0 0 0 / .16);
}

.gld-foot { display: grid; gap: 10px; }
.gld-foot > span { font-size: 12px; font-weight: 500; color: rgb(255 255 255 / .82); text-shadow: 0 1px 2px rgb(0 0 0 / .14); }
.gld-dots { display: flex; gap: 5px; align-items: center; }
.gld-dots i { width: 6px; height: 6px; border-radius: 3px; background: rgb(255 255 255 / .45); }
.gld-dots i[data-on] { width: 18px; background: #fff; }

.gld-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  height: 26px;
  padding: 0 11px 0 9px;
  border-radius: 999px;
  background: rgb(255 255 255 / .95);
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  box-shadow: 0 4px 12px -4px rgb(0 0 0 / .3);
  pointer-events: none;
}
.gld-badge-keep { color: var(--green); opacity: var(--keep); scale: calc(.8 + var(--keep) * .2); }
.gld-badge-skip { color: var(--red); opacity: var(--skip); scale: calc(.8 + var(--skip) * .2); }

.gld-empty {
  position: absolute;
  inset: 10px 0 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 4px;
  text-align: center;
  animation: gld-fade 360ms 120ms ease both;
}
@keyframes gld-fade { from { opacity: 0; scale: .96; } }
.gld-done {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: 8px;
  border-radius: 999px;
  color: #fff;
  background: var(--green);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .35), 0 6px 16px -6px rgb(36 138 61 / .55);
}
.gld-empty strong { font-size: 17px; font-weight: 600; letter-spacing: -0.022em; }
.gld-empty > span:not(.gld-done) { font-size: 13px; color: var(--secondary); margin-bottom: 12px; }
.gld-shuffle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 36px;
  padding: 0 15px 0 13px;
  border: 0;
  border-radius: 999px;
  background: #1d1d1f;
  color: #fff;
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  box-shadow: inset 0 .5px 0 rgb(255 255 255 / .2), 0 6px 16px -8px rgb(0 0 0 / .5);
  transition: transform 220ms cubic-bezier(.3, 1.4, .5, 1);
}
.gld-shuffle:active { transform: scale(.95); }
.gld-shuffle:focus-visible { outline: 3px solid #0a84ff; outline-offset: 2px; }

/* The bar: one pebble of clear glass. */
.gld-bar {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  background: linear-gradient(180deg, rgb(255 255 255 / .92), rgb(255 255 255 / .7));
  -webkit-backdrop-filter: blur(14px) saturate(1.8);
  backdrop-filter: blur(14px) saturate(1.8);
  box-shadow:
    inset 0 1px 1px rgb(255 255 255 / 1),
    inset 0 -1px 1px rgb(0 0 0 / .04),
    0 0 0 .5px rgb(0 0 0 / .07),
    0 1px 3px rgb(0 0 0 / .06),
    0 10px 24px -10px rgb(0 0 0 / .22);
}
.gld-sep { width: .5px; height: 20px; background: rgb(0 0 0 / .12); }
.gld-btn {
  width: 44px;
  height: 40px;
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transition: transform 260ms cubic-bezier(.3, 1.5, .5, 1), background-color 160ms ease, opacity 200ms ease;
}
.gld-btn-skip { color: var(--red); background: rgb(215 0 21 / calc(var(--skip) * .12)); scale: calc(1 + var(--skip) * .08); }
.gld-btn-keep { color: var(--green); background: rgb(36 138 61 / calc(var(--keep) * .12)); scale: calc(1 + var(--keep) * .08); }
@media (hover: hover) {
  .gld-btn-skip:hover:not(:disabled) { background: rgb(215 0 21 / .1); }
  .gld-btn-keep:hover:not(:disabled) { background: rgb(36 138 61 / .1); }
}
.gld-btn:active:not(:disabled) { transform: scale(.88); }
.gld-btn:focus-visible { outline: 3px solid #0a84ff; outline-offset: 0; }
.gld-btn:disabled { opacity: .3; cursor: default; }
.gld-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .gld-card { transition: opacity 160ms ease; animation: gld-fade 200ms ease both; animation-delay: 0ms; }
  .gld-btn, .gld-shuffle { transition-duration: 1ms; }
  .gld-layer { animation: none; }
}
`;export{we as default};
