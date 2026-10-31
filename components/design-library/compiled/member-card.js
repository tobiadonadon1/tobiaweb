"use client";
/* Construct · Design library: the compiled preview of "Member card". The source is for members. */
import{useEffect as Y,useRef as n}from"react";import{Fragment as se,jsx as i,jsxs as l}from"react/jsx-runtime";var c={rx:6,ry:-10},R={rx:12,ry:16},Q=8,j=(g,p)=>({gx:50+p/R.ry*48,gy:50-g/R.rx*48});function W({name:g="Lena Fischer",tier:p="Pro",number:w="0412 2873 0019",since:k="since 2026",label:u="Member",finish:x="black",glare:E=50,autoplay:S=!0}){let M=n(null),C=n(null),m=j(c.rx,c.ry),$=n({rx:{x:c.rx,v:0,t:c.rx},ry:{x:c.ry,v:0,t:c.ry},gx:{x:m.gx,v:0,t:m.gx},gy:{x:m.gy,v:0,t:m.gy},lift:{x:0,v:0,t:0}}),b=n(0),I=n(0),v=n(!1),B=n(S),O=n(!1),P=n(!1),T=n(!1),N=n(0),D=n(!1),z=n(0),f=n(0),V=()=>B.current&&O.current&&!v.current&&!P.current&&!T.current&&!D.current,Z=()=>{let e=M.current;if(!e)return;let{rx:r,ry:t,gx:o,gy:d,lift:a}=$.current;e.style.setProperty("--mc-rx",`${r.x.toFixed(2)}deg`),e.style.setProperty("--mc-ry",`${t.x.toFixed(2)}deg`),e.style.setProperty("--mc-gx",`${o.x.toFixed(1)}%`),e.style.setProperty("--mc-gy",`${d.x.toFixed(1)}%`),e.style.setProperty("--mc-lift",a.x.toFixed(3)),e.style.setProperty("--mc-tx",r.x.toFixed(2)),e.style.setProperty("--mc-ty",t.x.toFixed(2))},K=e=>{let r=Math.min(.05,(e-I.current)/1e3);I.current=e;let t=$.current,o=V();if(o){f.current=Math.min(1,f.current+r/1.6),z.current+=r;let a=f.current*f.current*(3-2*f.current),s=z.current/Q*Math.PI*2,F=c.rx*(1-a)+Math.sin(s*2)*7*a,A=c.ry*(1-a)+Math.sin(s)*13*a,q=j(F,A);t.rx.t=F,t.ry.t=A,t.gx.t=q.gx,t.gy.t=q.gy,t.lift.t=.35*a}else f.current=0;for(;r>0;){let a=Math.min(r,.004166666666666667);r-=a;for(let[s,F,A]of[[t.rx,120,15],[t.ry,120,15],[t.gx,140,24],[t.gy,140,24],[t.lift,160,24]])s.v+=(F*(s.t-s.x)-A*s.v)*a,s.x+=s.v*a}Z();let d=Object.values(t).some(a=>Math.abs(a.v)>.01||Math.abs(a.t-a.x)>.01);b.current=o||d?requestAnimationFrame(K):0},h=()=>{b.current||(I.current=performance.now(),b.current=requestAnimationFrame(K))};Y(()=>{B.current=S,h()},[S]),Y(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");v.current=e.matches;let r=()=>{v.current=e.matches,h()};e.addEventListener("change",r);let t=new IntersectionObserver(([o])=>{O.current=o.isIntersecting,h()});return M.current&&t.observe(M.current),()=>{e.removeEventListener("change",r),t.disconnect(),clearTimeout(N.current),cancelAnimationFrame(b.current),b.current=0}},[]);let U=()=>{clearTimeout(N.current),D.current=!0},G=()=>{clearTimeout(N.current),!(P.current||T.current)&&(N.current=window.setTimeout(()=>{D.current=!1,h()},1500))},H=(e,r)=>{let{rx:t,ry:o,gx:d,gy:a,lift:s}=$.current;e=Math.max(-1,Math.min(1,e)),r=Math.max(-1,Math.min(1,r)),t.t=v.current?c.rx:-r*R.rx,o.t=v.current?c.ry:e*R.ry,d.t=50+e*48,a.t=50+r*48,s.t=1,h()},X=e=>{let r=C.current?.getBoundingClientRect();r&&H((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1)},y=()=>{let{rx:e,ry:r,gx:t,gy:o,lift:d}=$.current;e.t=c.rx,r.t=c.ry,t.t=m.gx,o.t=m.gy,d.t=0,h()},_=n({x:0,y:0}),J=Math.max(0,Math.min(100,E))/100;return l(se,{children:[i("style",{children:ie}),l("div",{ref:M,className:"mc","data-finish":x==="white"||x==="aurora"?x:"black",style:{"--mc-glare":J,"--mc-rx":`${c.rx}deg`,"--mc-ry":`${c.ry}deg`,"--mc-gx":`${m.gx}%`,"--mc-gy":`${m.gy}%`},onPointerEnter:()=>{P.current=!0,U()},onPointerLeave:()=>{P.current=!1,y(),G()},onPointerMove:e=>{e.pointerType==="touch"&&e.buttons===0||X(e)},onPointerDown:e=>e.pointerType==="touch"&&X(e),onPointerUp:e=>e.pointerType==="touch"&&y(),onPointerCancel:y,onFocus:()=>{T.current=!0,U()},onBlur:e=>{e.currentTarget.contains(e.relatedTarget)||(T.current=!1,G())},children:[i("span",{className:"mc-shadow","aria-hidden":!0}),l("div",{ref:C,className:"mc-card",tabIndex:0,role:"group","aria-roledescription":"membership card","aria-label":`${p} ${u.toLowerCase()} card. ${g}, number ${w}, ${k}.`,onFocus:e=>{e.currentTarget.matches(":focus-visible")&&(_.current={x:.5,y:-.4},H(.5,-.4))},onBlur:y,onKeyDown:e=>{let t=_.current;if(e.key==="ArrowLeft")t.x=Math.max(-1,t.x-.25);else if(e.key==="ArrowRight")t.x=Math.min(1,t.x+.25);else if(e.key==="ArrowUp")t.y=Math.max(-1,t.y-.25);else if(e.key==="ArrowDown")t.y=Math.min(1,t.y+.25);else if(e.key==="Escape"){y();return}else return;e.preventDefault(),H(t.x,t.y)},children:[i("span",{className:"mc-tex","aria-hidden":!0}),i("span",{className:"mc-foil","aria-hidden":!0}),i("span",{className:"mc-glare","aria-hidden":!0}),l("span",{className:"mc-words","aria-hidden":!0,children:[l("span",{className:"mc-top",children:[l("span",{className:"mc-label",children:[i("i",{className:"mc-dot"}),u]}),i("span",{className:"mc-chip",children:l("svg",{width:"34",height:"26",viewBox:"0 0 34 26",fill:"none",children:[i("rect",{x:"10.5",y:"6.5",width:"13",height:"13",rx:"3"}),i("path",{d:"M0 9.5h10.5M0 16.5h10.5M23.5 9.5H34M23.5 16.5H34M17 0v6.5M17 19.5V26"})]})})]}),i("span",{className:"mc-tier",children:p}),i("span",{className:"mc-name",children:g}),l("span",{className:"mc-foot",children:[i("span",{children:w}),i("span",{children:k})]})]}),i("span",{className:"mc-edge","aria-hidden":!0})]})]})]})}var L=(g,p,w,k,u,x=1.6,E=-.62)=>`url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${g}' height='${p}'><filter id='n' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${w} ${k}' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${u} 0 0 0 0 ${u} 0 0 0 0 ${u} ${x} 0 0 0 ${E}'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`)}")`,ee=L(140,140,.95,.95,"1"),te=L(140,140,.95,.95,"0"),re=L(360,120,.0035,1.2,"1",.9,-.38),ae=L(360,120,.0035,1.2,"0",.9,-.38),ne="#7b5cff 0%, #4cc2ff 16%, #2ecf8f 30%, #ffb020 42%, #ff4f7b 54%, #7b5cff 68%, #4cc2ff 84%, #2ecf8f 100%",ce="rgba(123,92,255,0) 20%, #7b5cff 31%, #4cc2ff 40%, #2ecf8f 48%, #ff4f7b 59%, rgba(255,79,123,0) 71%",ie=`
.mc {
  --mc-bg: radial-gradient(130% 120% at 0% 0%, #1d1d21 0%, #111113 55%, #0b0b0c 100%);
  --mc-fg: #ffffff;
  --mc-dim: rgba(255, 255, 255, 0.52);
  --mc-blue: #3d3df5;
  --mc-dot: #3d3df5;
  --mc-spec: 255, 255, 255;
  --mc-spec-k: 0.2;
  --mc-grain: ${ee};
  --mc-brush: ${re};
  --mc-tex-k: 0.2;
  --mc-foil-k: 0.42;
  --mc-foil-blend: screen;
  --mc-edge-base: rgba(255, 255, 255, 0.08);
  --mc-edge-hi: rgba(255, 255, 255, 0.6);
  --mc-edge-k: 1;
  --mc-shade: 0, 0, 0;
  --mc-shade-k: 0.34;
  --mc-rx: 6deg; --mc-ry: -10deg; --mc-gx: 20%; --mc-gy: 25%; --mc-lift: 0;
  --mc-tx: 6; --mc-ty: -10;
  position: relative;
  display: grid;
  place-items: center;
  padding: 40px 30px;
  perspective: 1000px;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
}
.mc[data-finish="white"] {
  --mc-bg: radial-gradient(130% 120% at 0% 0%, #ffffff 0%, #f6f5f2 55%, #eceae5 100%);
  --mc-fg: #111111;
  --mc-dim: #85837e;
  --mc-grain: ${te};
  --mc-brush: ${ae};
  --mc-tex-k: 0.14;
  --mc-foil-k: 0.2;
  --mc-foil-blend: multiply;
  --mc-edge-base: rgba(17, 17, 17, 0.07);
  --mc-edge-hi: rgba(255, 255, 255, 1);
  --mc-edge-k: 0.72;
  --mc-shade-k: 0.14;
}
.mc[data-finish="aurora"] {
  --mc-bg:
    radial-gradient(90% 110% at 100% 100%, rgba(76, 194, 255, 0.42) 0%, rgba(76, 194, 255, 0) 60%),
    radial-gradient(70% 90% at 92% 0%, rgba(255, 79, 123, 0.3) 0%, rgba(255, 79, 123, 0) 60%),
    linear-gradient(135deg, #170f45 0%, #2a1c8f 42%, #3d3df5 100%);
  --mc-dim: rgba(255, 255, 255, 0.62);
  --mc-dot: #2ecf8f;
  --mc-tex-k: 0.2;
  --mc-foil-k: 0.55;
  --mc-edge-base: rgba(255, 255, 255, 0.14);
  --mc-edge-k: 0.85;
  --mc-shade: 34, 22, 140;
  --mc-shade-k: 0.38;
}

/* The shadow on the table: slides opposite the tilt and softens as the card lifts. */
.mc-shadow {
  position: absolute; left: 50%; top: 50%;
  width: 300px; height: 176px;
  margin: -88px 0 0 -150px;
  border-radius: 28px;
  background: rgb(var(--mc-shade));
  opacity: calc(var(--mc-shade-k) - var(--mc-lift) * 0.06);
  filter: blur(calc(18px + var(--mc-lift) * 8px));
  transform:
    translate(calc(var(--mc-ty) * -1px), calc(var(--mc-tx) * 1px + 20px + var(--mc-lift) * 8px))
    scale(calc(0.94 + var(--mc-lift) * 0.03));
  pointer-events: none;
}

.mc-card {
  position: relative;
  width: 340px;
  max-width: calc(100vw - 48px);
  aspect-ratio: 340 / 214;
  border-radius: 20px;
  background: var(--mc-bg);
  color: var(--mc-fg);
  isolation: isolate;
  transform: rotateX(var(--mc-rx)) rotateY(var(--mc-ry)) translateZ(calc(var(--mc-lift) * 10px));
  box-shadow:
    0 1px 1px rgba(var(--mc-shade), 0.06),
    0 2px 6px rgba(var(--mc-shade), 0.06);
  outline: none;
  cursor: default;
  -webkit-tap-highlight-color: transparent;
}
.mc-card:focus-visible { outline: 2px solid var(--mc-blue); outline-offset: 5px; }
.mc[data-finish="aurora"] .mc-card:focus-visible { outline-color: #7b5cff; }

/* Material: fine grain over long brushed strokes, like bead-blasted titanium. */
.mc-tex {
  position: absolute; inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background-image: var(--mc-grain), var(--mc-brush);
  background-size: 140px 140px, 360px 120px;
  opacity: var(--mc-tex-k);
}

/* Holographic foil: one long band of the palette, slid by the light (so by the
   tilt), strongest where the light falls and fading off across the card. */
.mc-foil {
  position: absolute; inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background: linear-gradient(115deg, ${ce});
  background-size: 260% 100%;
  background-position: calc(100% - var(--mc-gx)) 0;
  mix-blend-mode: var(--mc-foil-blend);
  opacity: calc(var(--mc-foil-k) * (0.45 + var(--mc-glare) * 1.1) * (0.85 + var(--mc-lift) * 0.15));
  -webkit-mask: radial-gradient(85% 120% at var(--mc-gx) var(--mc-gy), #000 0%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0.12) 100%);
  mask: radial-gradient(85% 120% at var(--mc-gx) var(--mc-gy), #000 0%, rgba(0, 0, 0, 0.45) 55%, rgba(0, 0, 0, 0.12) 100%);
}

.mc-words {
  position: absolute; inset: 0;
  padding: 20px 22px 19px;
  display: grid;
  grid-template-rows: auto auto 1fr auto auto;
  pointer-events: none;
}
.mc-top { display: flex; justify-content: space-between; align-items: center; height: 16px; }
.mc-label {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 450; letter-spacing: -0.005em;
  color: var(--mc-dim);
}
.mc-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--mc-dot);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--mc-dot) 22%, transparent);
}

/* The chip: warm metal under the same foil, so it flashes colour as the card turns. */
.mc-chip {
  position: relative;
  width: 34px; height: 26px;
  margin-top: 8px;
  border-radius: 6px;
  background:
    linear-gradient(118deg, ${ne}) calc(100% - var(--mc-gx)) 0 / 420% 100%,
    linear-gradient(155deg, #f1eee8 0%, #b9b4aa 48%, #ddd8cf 100%);
  background-blend-mode: soft-light, normal;
  box-shadow:
    inset 0 0 0 0.5px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.55),
    0 1px 2px rgba(0, 0, 0, 0.3);
}
.mc[data-finish="white"] .mc-chip { box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.7), 0 1px 1px rgba(0, 0, 0, 0.12); }
.mc-chip svg { position: absolute; inset: 0; display: block; }
.mc-chip rect, .mc-chip path { stroke: rgba(40, 32, 20, 0.34); stroke-width: 0.75; }

.mc-tier {
  margin-top: 12px;
  font-size: 46px; font-weight: 400; line-height: 1;
  letter-spacing: -0.045em;
  margin-left: -2px;
}
.mc-name {
  grid-row: 4;
  font-size: 15px; font-weight: 500; letter-spacing: -0.01em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.mc-foot {
  grid-row: 5;
  margin-top: 7px;
  display: flex; justify-content: space-between; gap: 12px;
  font: 400 11px/1.2 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.04em;
  color: var(--mc-dim);
  white-space: nowrap;
}

/* The light: one soft specular spot that rides on --mc-gx/--mc-gy. */
.mc-glare {
  position: absolute; inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: calc(var(--mc-glare) * (0.75 + var(--mc-lift) * 0.25));
  background: radial-gradient(
    75% 95% at var(--mc-gx) var(--mc-gy),
    rgba(var(--mc-spec), var(--mc-spec-k)),
    rgba(var(--mc-spec), calc(var(--mc-spec-k) * 0.35)) 38%,
    rgba(var(--mc-spec), 0) 72%
  );
}
/* On the light finish a white spot can't show, so the far side dims instead. */
.mc[data-finish="white"] .mc-glare {
  background: radial-gradient(
    120% 150% at var(--mc-gx) var(--mc-gy),
    rgba(255, 255, 255, 0.85),
    rgba(255, 255, 255, 0) 45%,
    rgba(17, 17, 17, 0.07) 100%
  );
}

/* The edge: a 1px iridescent ring that turns with the card, brightest on the
   side the light is on (masked to the border). */
.mc-edge {
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: 1px;
  pointer-events: none;
  background:
    radial-gradient(60% 80% at var(--mc-gx) var(--mc-gy), var(--mc-edge-hi), transparent 70%),
    conic-gradient(
      from calc(var(--mc-ty) * 9deg + 210deg),
      rgba(123, 92, 255, 0.95), rgba(76, 194, 255, 0.9), rgba(46, 207, 143, 0.8),
      rgba(255, 176, 32, 0.75), rgba(255, 79, 123, 0.85), rgba(123, 92, 255, 0.95)
    ),
    linear-gradient(var(--mc-edge-base), var(--mc-edge-base));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
  opacity: calc(var(--mc-edge-k) * (0.4 + var(--mc-glare) * 0.6));
}

@media (prefers-reduced-motion: reduce) {
  .mc-card { transform: rotateX(6deg) rotateY(-10deg); }
  .mc-shadow { transform: translate(10px, 26px) scale(0.94); }
}
`;export{W as default};
