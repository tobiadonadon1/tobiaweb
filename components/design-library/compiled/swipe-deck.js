"use client";
/* Construct · Design library: the compiled preview of "Swipe deck". The source is for members. */
import{useCallback as U,useEffect as ae,useLayoutEffect as ie,useRef as g,useState as L}from"react";import{Fragment as C,jsx as n,jsxs as c}from"react/jsx-runtime";var oe=[{id:"plant",title:"Plant diary",note:"Knows when to water, from one photo",shape:"leaf"},{id:"tram",title:"Night tram",note:"Live departures that work offline",shape:"moon"},{id:"split",title:"Split the bill",note:"Snap the receipt, tap who had what",shape:"split"},{id:"pasta",title:"Pasta timer",note:"Every shape, from farfalle to fusilli",shape:"bow"},{id:"run",title:"Run club",note:"Find people who run your pace",shape:"route"}],V={paper:["#1e6a48","#2b44c4","#e09a2b","#d8452f","#0b1f3a"],night:["#0b1f3a","#16325c","#2b44c4","#0f4a5c","#1e6a48"],fruit:["#ee6a3c","#f2c14e","#c2304f","#5e9e4a","#e09a2b"]},P=300;function ce({cards:s=oe,palette:p="paper",threshold:l=100,onSwipe:u}){let k=V[p]??V.paper,[b,D]=L(()=>s.map((e,t)=>t)),[f,M]=L(0),[w,N]=L(0),[x,A]=L(0),[z,T]=L(""),y=g(null),m=g(new Map),i=g({x:0,y:0,r:0}),E=g(null),$=g(()=>{}),R=g(!1),K=g(!1),F=g(!1),Y=g(null),H=b.slice(f),h=H[0],I=H.length===0;ae(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");F.current=e.matches;let t=()=>F.current=e.matches;return e.addEventListener("change",t),()=>{e.removeEventListener("change",t),$.current()}},[]);let v=(e,t)=>y.current?.style.setProperty(e,t.toFixed(4)),j=U(()=>{let e=h===void 0?null:m.current.get(h),{x:t,y:r,r:a}=i.current;e&&(e.style.transform=`translate3d(${t.toFixed(2)}px, ${r.toFixed(2)}px, 0) rotate(${a.toFixed(3)}deg)`);let o=Math.min(1,Math.abs(t)/l);v("--lift",o),v("--keep",Math.max(0,Math.min(1,t/l))),v("--skip",Math.max(0,Math.min(1,-t/l)))},[h,l]),q=e=>y.current?.setAttribute("data-live",String(e));ie(()=>{i.current={x:0,y:0,r:0},v("--lift",0),v("--keep",0),v("--skip",0),K.current&&(K.current=!1,h!==void 0?m.current.get(h)?.focus({preventScroll:!0}):Y.current?.focus({preventScroll:!0}))},[h,x]);let B=U((e,t=0,r=0)=>{if(h===void 0||R.current)return;R.current=!0,$.current(),q(!1);let a=m.current.get(h),o=e==="right"?1:-1,{x:S,y:d,r:Z}=i.current,ne=Math.max(Math.abs(t),1.6),re=o*Math.max(420,ne*P*1.4),se=d+Math.max(-120,Math.min(120,r*220));a&&F.current?(a.style.transition=`opacity ${P/2}ms ease`,a.style.opacity="0"):a&&(a.style.transition=`transform ${P}ms cubic-bezier(.2,.65,.35,1), opacity ${P}ms ease-in`,a.style.transform=`translate3d(${re}px, ${se}px, 0) rotate(${Z+o*22}deg)`,a.style.opacity="0"),S===0&&v(e==="right"?"--keep":"--skip",1),v("--lift",1);let O=s[h];setTimeout(()=>{R.current=!1,e==="right"&&N(Q=>Q+1),M(Q=>Q+1),T(`${e==="right"?"Kept":"Skipped"} ${O.title}. ${H.length-1} left.`),u?.(O,e)},P)},[h,s,u,H.length]),X=(e,t)=>{if($.current(),F.current){i.current={x:0,y:0,r:0},j(),q(!1);return}let r={...i.current},a=E.current?.low??!1;$.current=ue(r.x,r.y,e,t,(o,S)=>{i.current={x:o,y:S,r:W(o,a)},j()},()=>q(!1))},W=(e,t)=>e/200*14*(t?-1:1),G=e=>{if(R.current||e.button!==0)return;$.current();let t=e.currentTarget;t.setPointerCapture(e.pointerId),t.style.transition="none";let r=t.getBoundingClientRect();E.current={id:e.pointerId,sx:e.clientX-i.current.x,sy:e.clientY-i.current.y,low:e.clientY>r.top+r.height*.62,samples:[[e.timeStamp,i.current.x,i.current.y]]},q(!0),y.current?.setAttribute("data-grab","true")},J=e=>{let t=E.current;if(!t||t.id!==e.pointerId)return;let r=e.clientX-t.sx,a=e.clientY-t.sy,o=Math.sign(a)*pe(Math.abs(a),60);t.samples.push([e.timeStamp,r,o]),t.samples.length>6&&t.samples.shift(),i.current={x:r,y:o,r:W(r,t.low)},j()},_=e=>{let t=E.current;if(!t||t.id!==e.pointerId)return;y.current?.setAttribute("data-grab","false");let[r,a]=de(t.samples),{x:o}=i.current,S=Math.abs(r)>.55&&Math.sign(r)===Math.sign(o)&&Math.abs(o)>16;Math.abs(o)>l||S?(E.current=null,B(o>0?"right":"left",r,a)):(X(r,a),E.current=null)},ee=e=>{(e.key==="ArrowRight"||e.key==="ArrowLeft")&&(e.preventDefault(),K.current=!0,B(e.key==="ArrowRight"?"right":"left"))},te=()=>{let e=s.map((t,r)=>r);for(let t=e.length-1;t>0;t--){let r=Math.floor(Math.random()*(t+1));[e[t],e[r]]=[e[r],e[t]]}m.current.forEach(t=>{t.style.transition="",t.style.transform="",t.style.opacity=""}),K.current=!0,D(e),M(0),N(0),A(t=>t+1),T(`Shuffled. ${s.length} cards.`)};return c(C,{children:[n("style",{children:me}),c("div",{ref:y,className:"swd","data-live":"false",style:{"--lift":0,"--keep":0,"--skip":0},children:[c("div",{className:"swd-deck","data-deal":x,children:[b.map((e,t)=>{let r=t-f;if(r<0)return null;let a=s[e],o=k[e%k.length],S=fe(o),d=r===0;return c("div",{ref:Z=>{Z?m.current.set(e,Z):m.current.delete(e)},className:"swd-card","data-depth":Math.min(r,3),style:{"--d":r,"--c":o,"--ink":S,"--deal":b.length-1-t,zIndex:20-r},tabIndex:d?0:-1,role:d?"group":void 0,"aria-roledescription":d?"card":void 0,"aria-label":d?`${a.title}: ${a.note}. ${f+1} of ${b.length}. Left arrow to skip, right arrow to keep.`:void 0,"aria-hidden":d?void 0:!0,onPointerDown:d?G:void 0,onPointerMove:d?J:void 0,onPointerUp:d?_:void 0,onPointerCancel:d?_:void 0,onKeyDown:d?ee:void 0,children:[c("div",{className:"swd-top",children:[n("span",{children:String(e+1).padStart(2,"0")}),n("span",{children:"App idea"})]}),n(le,{shape:a.shape}),c("div",{className:"swd-text",children:[n("strong",{children:a.title}),n("span",{children:a.note})]}),d&&c(C,{children:[n("span",{className:"swd-stamp swd-stamp-keep","aria-hidden":!0,children:"Keep"}),n("span",{className:"swd-stamp swd-stamp-skip","aria-hidden":!0,children:"Skip"})]})]},`${a.id}-${x}`)}),I&&c("div",{className:"swd-empty",children:[c("strong",{children:["That\u2019s all ",s.length,"."]}),c("span",{children:["You kept ",w===0?"none":w===s.length?"every one":w,"."]}),c("button",{ref:Y,type:"button",className:"swd-shuffle",onClick:te,children:[n("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:n("path",{d:"M3 7h3.5c4.5 0 6.5 10 11 10H21M3 17h3.5c1.6 0 2.8-1.3 3.9-3M14 9.5C15 8 16.2 7 17.5 7H21M18 4l3 3-3 3M18 14l3 3-3 3"})}),"Shuffle again"]})]})]}),c("div",{className:"swd-bar",children:[n("button",{type:"button",className:"swd-btn swd-btn-skip","aria-label":"Skip",disabled:I,onClick:()=>B("left"),children:n("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round","aria-hidden":!0,children:n("path",{d:"M6.5 6.5l11 11M17.5 6.5l-11 11"})})}),n("span",{className:"swd-count","aria-hidden":!0,children:I?"Done":`${f+1} / ${b.length}`}),n("button",{type:"button",className:"swd-btn swd-btn-keep","aria-label":"Keep",disabled:I,onClick:()=>B("right"),children:n("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:n("path",{d:"M5 12.5l4.5 4.5L19 7.5"})})})]}),n("span",{className:"swd-sr","aria-live":"polite",children:z})]})]})}function le({shape:s}){return c("svg",{className:"swd-art",viewBox:"0 0 120 92","aria-hidden":!0,children:[s==="leaf"&&c(C,{children:[n("path",{className:"swd-shade",d:"M30 84 C16 58 26 30 54 18 C64 44 56 70 30 84Z"}),n("path",{className:"swd-paper",d:"M24 84 C26 44 54 16 104 10 C102 56 76 84 24 84Z"}),n("path",{className:"swd-vein",d:"M28 82 C48 62 68 40 94 20 M52 62 l-4 -14 M68 46 l-2 -14 M60 56 l14 2 M76 40 l12 2"})]}),s==="moon"&&c(C,{children:[n("circle",{className:"swd-paper",cx:"58",cy:"48",r:"32"}),n("circle",{className:"swd-bite",cx:"74",cy:"38",r:"27"}),n("path",{className:"swd-paper",d:"M98 16 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5Z M100 62 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6Z"}),n("circle",{className:"swd-shade",cx:"20",cy:"22",r:"3"})]}),s==="split"&&c(C,{children:[n("path",{className:"swd-paper",d:"M56 12 A36 36 0 0 0 56 84Z"}),n("path",{className:"swd-paper",d:"M66 18 A36 36 0 0 1 66 90Z"}),n("path",{className:"swd-vein",d:"M40 32 h10 M36 46 h14 M40 60 h10 M72 38 h10 M72 52 h14 M72 66 h10"})]}),s==="bow"&&c(C,{children:[n("path",{className:"swd-paper",d:"M14 22 Q30 18 60 44 Q90 18 106 22 Q100 46 106 70 Q90 74 60 48 Q30 74 14 70 Q20 46 14 22Z"}),n("path",{className:"swd-vein",d:"M22 30 q4 16 0 32 M30 28 q4 18 0 36 M98 30 q-4 16 0 32 M90 28 q-4 18 0 36"}),n("ellipse",{className:"swd-shade",cx:"60",cy:"46",rx:"7",ry:"11"})]}),s==="route"&&c(C,{children:[n("path",{className:"swd-line",d:"M16 78 C36 78 34 52 54 50 S70 22 98 20"}),n("circle",{className:"swd-ring",cx:"16",cy:"78",r:"7"}),n("circle",{className:"swd-paper",cx:"98",cy:"20",r:"9"}),n("path",{className:"swd-shade",d:"M80 58 l12 -4 -4 12Z"})]})]})}function pe(s,p){return p*(1-1/(s/p+1))}function de(s){if(s.length<2)return[0,0];let p=s[0],l=s[s.length-1],u=l[0]-p[0];return u>0&&u<160?[(l[1]-p[1])/u,(l[2]-p[2])/u]:[0,0]}function ue(s,p,l,u,k,b){let f=1.24*Math.sqrt(380),M=s,w=p,N=l*1e3,x=u*1e3,A=performance.now(),z=requestAnimationFrame(function T(y){let m=Math.min(.064,(y-A)/1e3);for(A=y;m>0;){let i=Math.min(m,.004166666666666667);N+=(-380*M-f*N)*i,x+=(-380*w-f*x)*i,M+=N*i,w+=x*i,m-=i}if(Math.hypot(M,w)<.2&&Math.hypot(N,x)<8){k(0,0),b();return}k(M,w),z=requestAnimationFrame(T)});return()=>cancelAnimationFrame(z)}function fe(s){let p=/^#?([0-9a-f]{6})$/i.exec(s.trim());if(!p)return"#faf8f2";let l=parseInt(p[1],16),[u,k,b]=[l>>16&255,l>>8&255,l&255].map(D=>{let f=D/255;return f<=.03928?f/12.92:((f+.055)/1.055)**2.4});return .2126*u+.7152*k+.0722*b>.36?"#0b1f3a":"#faf8f2"}var me=`
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
`;export{ce as default};
