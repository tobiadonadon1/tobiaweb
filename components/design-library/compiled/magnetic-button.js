"use client";
/* Construct · Design library: the compiled preview of "Magnetic button". The source is for members. */
import{useEffect as q,useRef as p}from"react";import{Fragment as Y,jsx as c,jsxs as P}from"react/jsx-runtime";var g=()=>({x:0,v:0,t:0});function D({label:N="Get started",tone:S="#2b44c4",strength:T=50,onClick:$}){let i=p(null),F=p(null),x=p({bx:g(),by:g(),lx:g(),ly:g(),lift:g()}),u=p(0),y=p(0),h=p(!1);q(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");h.current=t.matches;let r=()=>h.current=t.matches;return t.addEventListener("change",r),()=>{t.removeEventListener("change",r),cancelAnimationFrame(u.current)}},[]);let z=()=>{let t=i.current;if(!t)return;let{bx:r,by:e,lx:n,ly:a,lift:l}=x.current;t.style.setProperty("--bx",`${r.x.toFixed(2)}px`),t.style.setProperty("--by",`${e.x.toFixed(2)}px`),t.style.setProperty("--lx",`${n.x.toFixed(2)}px`),t.style.setProperty("--ly",`${a.x.toFixed(2)}px`),t.style.setProperty("--lift",l.x.toFixed(3))},E=t=>{let r=Math.min(.05,(t-y.current)/1e3);y.current=t;let{bx:e,by:n,lx:a,ly:l,lift:b}=x.current,f=!1;for(;r>0;){let o=Math.min(r,.004166666666666667);r-=o;for(let[s,m,d]of[[e,210,15],[n,210,15],[a,150,11],[l,150,11],[b,260,22]])s.v+=(m*(s.t-s.x)-d*s.v)*o,s.x+=s.v*o}for(let o of[e,n,a,l,b])(Math.abs(o.v)>.01||Math.abs(o.t-o.x)>.01)&&(f=!0);z(),u.current=f?requestAnimationFrame(E):0},C=()=>{u.current||(y.current=performance.now(),u.current=requestAnimationFrame(E))},L=t=>{let r=F.current;if(!r)return;let e=r.getBoundingClientRect(),{bx:n,by:a,lx:l,ly:b,lift:f}=x.current,o=e.left+e.width/2-n.x,s=e.top+e.height/2-a.x,m=t.clientX-o,d=t.clientY-s,k=i.current?.getBoundingClientRect(),B=k?Math.hypot(m/(k.width/2),d/(k.height/2)):1,M=Math.max(0,Math.min(1,(1-B)/.25)),A=M*M*(3-2*M),v=h.current?0:Math.max(0,Math.min(100,T))/100*.5*A;n.t=34*Math.tanh(m*v/34),a.t=24*Math.tanh(d*v*.9/24),l.t=Math.max(-7,Math.min(7,m*v*.32)),b.t=Math.max(-4,Math.min(4,d*v*.3)),f.t=h.current?0:A;let R=(t.clientX-e.left)/e.width*100,X=(t.clientY-e.top)/e.height*100;i.current?.style.setProperty("--gx",`${R.toFixed(1)}%`),i.current?.style.setProperty("--gy",`${X.toFixed(1)}%`),C()},w=()=>{let{bx:t,by:r,lx:e,ly:n,lift:a}=x.current;t.t=r.t=e.t=n.t=a.t=0,i.current?.removeAttribute("data-hot"),C()};return P(Y,{children:[c("style",{children:H}),P("div",{ref:i,className:"mag",style:{"--tone":S},onPointerMove:t=>{t.pointerType==="touch"&&t.buttons===0||L(t)},onPointerDown:t=>{t.pointerType==="touch"&&L(t)},onPointerUp:t=>t.pointerType==="touch"&&w(),onPointerCancel:w,onPointerLeave:w,children:[c("span",{className:"mag-shadow","aria-hidden":!0}),c("button",{ref:F,type:"button",className:"mag-btn",onClick:$,onPointerEnter:()=>i.current?.setAttribute("data-hot",""),onPointerLeave:()=>i.current?.removeAttribute("data-hot"),children:P("span",{className:"mag-face",children:[c("span",{className:"mag-glow","aria-hidden":!0}),c("span",{className:"mag-label",children:N}),c("span",{className:"mag-arrow","aria-hidden":!0,children:c("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:c("path",{d:"M3 8h9.5M8.5 3.5 13 8l-4.5 4.5",stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",strokeLinejoin:"round"})})})]})})]})]})}var H=`
.mag {
  --tone: #2b44c4;
  --ink: #0b1f3a;
  --cream: #faf8f2;
  --bx: 0px; --by: 0px; --lx: 0px; --ly: 0px; --lift: 0;
  --gx: 50%; --gy: 50%;
  position: relative;
  box-sizing: border-box;
  display: grid;
  place-items: center;
  /* The field: the whole container, or at least this much around the button. */
  width: 100%;
  height: 100%;
  padding: 64px 72px;
  -webkit-tap-highlight-color: transparent;
}

/* The shadow follows at a third of the distance: the button reads as lifted. */
.mag-shadow {
  position: absolute; left: 50%; top: 50%;
  width: 172px; height: 40px;
  margin: -6px 0 0 -86px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--tone) 60%, var(--ink));
  filter: blur(calc(12px + var(--lift) * 6px));
  opacity: calc(.32 + var(--lift) * .1);
  transform: translate(calc(var(--bx) * .35), calc(var(--by) * .35 + 10px + var(--lift) * 6px)) scale(calc(.86 + var(--lift) * .06));
  pointer-events: none;
}

.mag-btn {
  position: relative;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  cursor: pointer;
  border-radius: 999px;
  touch-action: none;
  transform: translate(var(--bx), var(--by));
  -webkit-user-select: none;
  user-select: none;
}
.mag-btn:focus-visible { outline: 2px solid var(--tone); outline-offset: 4px; }

.mag-face {
  position: relative;
  display: inline-flex; align-items: center; gap: 14px;
  height: 58px;
  padding: 0 9px 0 28px;
  border-radius: inherit;
  background: var(--tone);
  color: var(--cream);
  overflow: hidden;
  isolation: isolate;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.22),
    inset 0 -2px 0 color-mix(in srgb, var(--ink) 22%, transparent),
    0 1px 2px color-mix(in srgb, var(--ink) 30%, transparent);
  transition: transform 260ms cubic-bezier(.3, 1.4, .5, 1);
}
.mag-btn:active .mag-face { transform: scale(.965); transition-duration: 90ms; }

/* A soft light under the pointer. */
.mag-glow {
  position: absolute; inset: 0; z-index: -1;
  background: radial-gradient(120px circle at var(--gx) var(--gy), rgba(255,255,255,.2), transparent 70%);
  opacity: 0;
  transition: opacity 240ms ease;
}
.mag[data-hot] .mag-glow { opacity: 1; }

.mag-label {
  font-size: 16.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  transform: translate(var(--lx), var(--ly));
}
.mag-arrow {
  display: grid; place-items: center;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: var(--cream);
  color: var(--tone);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--ink) 25%, transparent);
  transform: translate(calc(var(--lx) * .75), calc(var(--ly) * .75));
}
.mag-arrow svg {
  transition: transform 380ms cubic-bezier(.3, 1.6, .5, 1);
}
.mag[data-hot] .mag-arrow svg,
.mag-btn:focus-visible .mag-arrow svg { transform: translateX(3px); }
.mag-btn:active .mag-arrow svg { transform: translateX(5px); transition-duration: 120ms; }

@media (prefers-reduced-motion: reduce) {
  .mag-face, .mag-arrow svg, .mag-glow { transition: none; }
  .mag-btn:active .mag-face { transform: none; }
}
`;export{D as default};
