"use client";
/* Construct · Design library: the compiled preview of "Member card". The source is for members. */
import{useEffect as q,useRef as a}from"react";import{Fragment as ee,jsx as o,jsxs as d}from"react/jsx-runtime";var c={rx:6,ry:-10},F={rx:12,ry:16},V=8,H=(f,y)=>({gx:50+y/F.ry*48,gy:50-f/F.rx*48});function W({name:f="Lena Fischer",tier:y="Pro",number:A="0412 2873 0019",since:S="since 2026",label:R="Member",finish:U="black",glare:Z=50,autoplay:N=!0}){let b=a(null),C=a(null),m=H(c.rx,c.ry),v=a({rx:{x:c.rx,v:0,t:c.rx},ry:{x:c.ry,v:0,t:c.ry},gx:{x:m.gx,v:0,t:m.gx},gy:{x:m.gy,v:0,t:m.gy},lift:{x:0,v:0,t:0}}),u=a(0),$=a(0),x=a(!1),D=a(N),O=a(!1),w=a(!1),k=a(!1),M=a(0),E=a(!1),I=a(0),p=a(0),G=()=>D.current&&O.current&&!x.current&&!w.current&&!k.current&&!E.current,J=()=>{let e=b.current;if(!e)return;let{rx:r,ry:t,gx:i,gy:l,lift:n}=v.current;e.style.setProperty("--mc-rx",`${r.x.toFixed(2)}deg`),e.style.setProperty("--mc-ry",`${t.x.toFixed(2)}deg`),e.style.setProperty("--mc-gx",`${i.x.toFixed(1)}%`),e.style.setProperty("--mc-gy",`${l.x.toFixed(1)}%`),e.style.setProperty("--mc-lift",n.x.toFixed(3)),e.style.setProperty("--mc-tx",r.x.toFixed(2)),e.style.setProperty("--mc-ty",t.x.toFixed(2))},X=e=>{let r=Math.min(.05,(e-$.current)/1e3);$.current=e;let t=v.current,i=G();if(i){p.current=Math.min(1,p.current+r/1.6),I.current+=r;let n=p.current*p.current*(3-2*p.current),s=I.current/V*Math.PI*2,P=c.rx*(1-n)+Math.sin(s*2)*7*n,T=c.ry*(1-n)+Math.sin(s)*13*n,j=H(P,T);t.rx.t=P,t.ry.t=T,t.gx.t=j.gx,t.gy.t=j.gy,t.lift.t=.35*n}else p.current=0;for(;r>0;){let n=Math.min(r,.004166666666666667);r-=n;for(let[s,P,T]of[[t.rx,120,15],[t.ry,120,15],[t.gx,140,24],[t.gy,140,24],[t.lift,160,24]])s.v+=(P*(s.t-s.x)-T*s.v)*n,s.x+=s.v*n}J();let l=Object.values(t).some(n=>Math.abs(n.v)>.01||Math.abs(n.t-n.x)>.01);u.current=i||l?requestAnimationFrame(X):0},g=()=>{u.current||($.current=performance.now(),u.current=requestAnimationFrame(X))};q(()=>{D.current=N,g()},[N]),q(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");x.current=e.matches;let r=()=>{x.current=e.matches,g()};e.addEventListener("change",r);let t=new IntersectionObserver(([i])=>{O.current=i.isIntersecting,g()});return b.current&&t.observe(b.current),()=>{e.removeEventListener("change",r),t.disconnect(),clearTimeout(M.current),cancelAnimationFrame(u.current),u.current=0}},[]);let z=()=>{clearTimeout(M.current),E.current=!0},B=()=>{clearTimeout(M.current),!(w.current||k.current)&&(M.current=window.setTimeout(()=>{E.current=!1,g()},1500))},L=(e,r)=>{let{rx:t,ry:i,gx:l,gy:n,lift:s}=v.current;e=Math.max(-1,Math.min(1,e)),r=Math.max(-1,Math.min(1,r)),t.t=x.current?c.rx:-r*F.rx,i.t=x.current?c.ry:e*F.ry,l.t=50+e*48,n.t=50+r*48,s.t=1,g()},K=e=>{let r=C.current?.getBoundingClientRect();r&&L((e.clientX-r.left)/r.width*2-1,(e.clientY-r.top)/r.height*2-1)},h=()=>{let{rx:e,ry:r,gx:t,gy:i,lift:l}=v.current;e.t=c.rx,r.t=c.ry,t.t=m.gx,i.t=m.gy,l.t=0,g()},Y=a({x:0,y:0}),Q=Math.max(0,Math.min(100,Z))/100;return d(ee,{children:[o("style",{children:_}),d("div",{ref:b,className:"mc","data-finish":U==="white"?"white":"black",style:{"--mc-glare":Q,"--mc-rx":`${c.rx}deg`,"--mc-ry":`${c.ry}deg`,"--mc-gx":`${m.gx}%`,"--mc-gy":`${m.gy}%`},onPointerEnter:()=>{w.current=!0,z()},onPointerLeave:()=>{w.current=!1,h(),B()},onPointerMove:e=>{e.pointerType==="touch"&&e.buttons===0||K(e)},onPointerDown:e=>e.pointerType==="touch"&&K(e),onPointerUp:e=>e.pointerType==="touch"&&h(),onPointerCancel:h,onFocus:()=>{k.current=!0,z()},onBlur:e=>{e.currentTarget.contains(e.relatedTarget)||(k.current=!1,B())},children:[o("span",{className:"mc-shadow","aria-hidden":!0}),d("div",{ref:C,className:"mc-card",tabIndex:0,role:"group","aria-roledescription":"membership card","aria-label":`${y} ${R.toLowerCase()} card. ${f}, number ${A}, ${S}.`,onFocus:e=>{e.currentTarget.matches(":focus-visible")&&(Y.current={x:.5,y:-.4},L(.5,-.4))},onBlur:h,onKeyDown:e=>{let t=Y.current;if(e.key==="ArrowLeft")t.x=Math.max(-1,t.x-.25);else if(e.key==="ArrowRight")t.x=Math.min(1,t.x+.25);else if(e.key==="ArrowUp")t.y=Math.max(-1,t.y-.25);else if(e.key==="ArrowDown")t.y=Math.min(1,t.y+.25);else if(e.key==="Escape"){h();return}else return;e.preventDefault(),L(t.x,t.y)},children:[o("span",{className:"mc-glare","aria-hidden":!0}),d("span",{className:"mc-words","aria-hidden":!0,children:[o("span",{className:"mc-top",children:d("span",{className:"mc-label",children:[o("i",{className:"mc-dot"}),R]})}),o("span",{className:"mc-tier",children:y}),o("span",{className:"mc-name",children:f}),d("span",{className:"mc-foot",children:[o("span",{children:A}),o("span",{children:S})]})]}),o("span",{className:"mc-edge","aria-hidden":!0})]})]})]})}var _=`
.mc {
  --mc-bg: #111111;
  --mc-fg: #ffffff;
  --mc-dim: rgba(255, 255, 255, 0.5);
  --mc-blue: #3d3df5;
  --mc-spec: 255, 255, 255;
  --mc-spec-k: 0.2;
  --mc-edge-base: rgba(255, 255, 255, 0.07);
  --mc-edge-hi: rgba(255, 255, 255, 0.55);
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
  --mc-bg: #f8f8f6;
  --mc-fg: #111111;
  --mc-dim: #8a8a8a;
  --mc-edge-base: rgba(17, 17, 17, 0.07);
  --mc-edge-hi: rgba(255, 255, 255, 1);
  --mc-shade-k: 0.14;
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
  transform: rotateX(var(--mc-rx)) rotateY(var(--mc-ry)) translateZ(calc(var(--mc-lift) * 10px));
  box-shadow:
    0 1px 1px rgba(var(--mc-shade), 0.06),
    0 2px 6px rgba(var(--mc-shade), 0.06);
  outline: none;
  cursor: default;
  -webkit-tap-highlight-color: transparent;
}
.mc-card:focus-visible { outline: 2px solid var(--mc-blue); outline-offset: 5px; }

.mc-words {
  position: absolute; inset: 0;
  padding: 20px 22px 19px;
  display: grid;
  grid-template-rows: auto auto 1fr auto auto;
  pointer-events: none;
}
.mc-top { display: flex; justify-content: space-between; align-items: center; }
.mc-label {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12.5px; font-weight: 450; letter-spacing: -0.005em;
  color: var(--mc-dim);
}
.mc-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--mc-blue);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--mc-blue) 18%, transparent);
}
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

/* The edge: a 1px ring, brightest on the side the light is on (masked to the border). */
.mc-edge {
  position: absolute; inset: 0;
  border-radius: inherit;
  padding: 1px;
  pointer-events: none;
  background:
    radial-gradient(60% 80% at var(--mc-gx) var(--mc-gy), var(--mc-edge-hi), transparent 70%),
    linear-gradient(var(--mc-edge-base), var(--mc-edge-base));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
}
.mc[data-finish="black"] .mc-edge { opacity: calc(0.35 + var(--mc-glare) * 0.65); }

@media (prefers-reduced-motion: reduce) {
  .mc-card { transform: rotateX(6deg) rotateY(-10deg); }
  .mc-shadow { transform: translate(10px, 26px) scale(0.94); }
}
`;export{W as default};
