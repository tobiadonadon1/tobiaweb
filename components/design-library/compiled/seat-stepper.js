"use client";
/* Construct · Design library: the compiled preview of "Seat stepper". The source is for members. */
import{useEffect as H,useRef as C,useState as S}from"react";import{Fragment as B,jsx as r,jsxs as k}from"react/jsx-runtime";function X({label:s="Seats",value:f,defaultValue:M=3,min:h=1,max:g=10,price:m=19,currency:b="\u20AC",tone:d="#1e6a48",onChange:x}){let[n,c]=S(M),i=z(f??n,h,g),y=C(i);y.current=i;let P=C(null),w=C(void 0),[l]=S(()=>String(Math.max(Math.abs(g),Math.abs(h))).length),[p]=S(()=>String(Math.round(Math.max(Math.abs(g),Math.abs(h))*m)).length),o=a=>{let e=y.current+a;return e<h||e>g?(t(a),!1):(y.current=e,f===void 0&&c(e),x?.(e),!0)},t=a=>{let e=P.current;if(!e)return;if(e.getAnimations().forEach(N=>N.cancel()),window.matchMedia("(prefers-reduced-motion: reduce)").matches){e.animate([{color:"#d8452f"},{color:"#d8452f",offset:.6},{}],{duration:420});return}let v=7*a;e.animate([{transform:"translateX(0)"},{transform:`translateX(${v}px)`,offset:.18},{transform:`translateX(${-v*.7}px)`,offset:.42},{transform:`translateX(${v*.4}px)`,offset:.66},{transform:`translateX(${-v*.15}px)`,offset:.84},{transform:"translateX(0)"}],{duration:380,easing:"ease-out"})},u=()=>clearTimeout(w.current),L=a=>e=>{if(e.button!==0||(e.currentTarget.setPointerCapture(e.pointerId),u(),!o(a)))return;let v=150,N=()=>{o(a)&&(v=Math.max(55,v*.86),w.current=setTimeout(N,v))};w.current=setTimeout(N,420)};H(()=>u,[]);let T=a=>e=>{e.key===" "?(e.preventDefault(),o(a)):e.key==="ArrowUp"||e.key==="ArrowRight"?(e.preventDefault(),o(1)):(e.key==="ArrowDown"||e.key==="ArrowLeft")&&(e.preventDefault(),o(-1))},$=Math.round(i*m),D=s.toLowerCase();return k(B,{children:[r("style",{children:F}),k("div",{className:"rlc",role:"group","aria-label":s,style:{"--tone":d},children:[r("span",{className:"rlc-label","aria-hidden":!0,children:s}),k("div",{className:"rlc-stepper",children:[r("button",{type:"button",className:"rlc-btn","aria-label":`Fewer ${D}`,"aria-disabled":i<=h,onPointerDown:L(-1),onPointerUp:u,onPointerCancel:u,onLostPointerCapture:u,onKeyDown:T(-1),onClick:a=>a.detail===0&&o(-1),onContextMenu:a=>a.preventDefault(),children:r("svg",{width:"18",height:"18",viewBox:"0 0 24 24","aria-hidden":!0,children:r("path",{d:"M5 12h14",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round"})})}),r("span",{ref:P,className:"rlc-num","aria-hidden":!0,children:r(E,{value:i,places:l})}),r("button",{type:"button",className:"rlc-btn rlc-add","aria-label":`More ${D}`,"aria-disabled":i>=g,onPointerDown:L(1),onPointerUp:u,onPointerCancel:u,onLostPointerCapture:u,onKeyDown:T(1),onClick:a=>a.detail===0&&o(1),onContextMenu:a=>a.preventDefault(),children:r("svg",{width:"18",height:"18",viewBox:"0 0 24 24","aria-hidden":!0,children:r("path",{d:"M5 12h14M12 5v14",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round"})})})]}),m>0&&k("span",{className:"rlc-price","aria-hidden":!0,children:[b,m," ",r("span",{className:"rlc-x",children:"\xD7"})," ",r(E,{value:i,places:l})," ",r("span",{className:"rlc-x",children:"="})," ",k("b",{className:"rlc-total",children:[b,r(E,{value:$,places:p,short:!0})]})]}),r("output",{className:"rlc-sr","aria-live":"polite",children:`${s}: ${i}${m>0?`, total ${b}${$}`:""}`})]})]})}function z(s,f,M){return Math.min(M,Math.max(f,Math.round(s)))}function E({value:s,places:f,short:M=!1}){let h=C(null),[g]=S(s),m=C(null),b=Array.from({length:f},(d,x)=>f-1-x);return H(()=>{let d=h.current;if(!d)return;let x=Array.from(d.querySelectorAll("[data-wheel]"));if(!m.current){let l=b.map(p=>Math.floor(g/10**p));m.current={pos:l.slice(),vel:b.map(()=>0),target:l.slice()}}let n=m.current,c=M?b.map((l,p)=>n.target[p]+A(Math.floor(s/10**l)%10,n.target[p])):b.map(l=>Math.floor(s/10**l));n.target=c;let i=()=>x.forEach((l,p)=>{for(let o=0;o<10;o++){let t=A(o,n.pos[p]),u=l.children[o+1];u.style.setProperty("--o",t.toFixed(4)),u.style.opacity=String(Math.max(0,1-Math.abs(t)*.9))}});if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){n.pos=c.slice(),n.vel=c.map(()=>0),i();return}let y=0,P=performance.now(),w=l=>{let p=Math.min(.032,(l-P)/1e3);P=l;let o=!1;for(let t=0;t<c.length;t++)n.vel[t]+=(-280*(n.pos[t]-c[t])-26*n.vel[t])*p,n.pos[t]+=n.vel[t]*p,Math.abs(n.pos[t]-c[t])>.002||Math.abs(n.vel[t])>.02?o=!0:(n.pos[t]=c[t],n.vel[t]=0);i(),o&&(y=requestAnimationFrame(w))};return y=requestAnimationFrame(w),()=>cancelAnimationFrame(y)},[s]),r("span",{ref:h,className:"rlc-roller",children:b.map(d=>{let x=Math.floor(g/10**d);return r("span",{className:"rlc-colwrap","data-shown":d===0||s>=10**d,children:k("span",{className:"rlc-col","data-wheel":!0,children:[r("span",{className:"rlc-ph",children:"0"}),Array.from({length:10},(n,c)=>{let i=A(c,x);return r("span",{className:"rlc-digit",style:{"--o":i,opacity:Math.max(0,1-Math.abs(i)*.9)},children:c},c)})]})},d)})})}function A(s,f){return((s-f)%10+15)%10-5}var F=`
.rlc {
  --ink: #0b1f3a;
  position: relative;
  display: inline-grid;
  justify-items: center;
  gap: 12px;
  color: var(--ink);
  font-family: inherit;
}
.rlc-label {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: color-mix(in srgb, var(--ink) 58%, transparent);
}
.rlc-stepper {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 68px;
  padding: 0 10px;
  border-radius: 999px;
  background: #fffefb;
  box-shadow:
    inset 0 0 0 1px rgba(11, 31, 58, 0.1),
    0 1px 0 rgba(11, 31, 58, 0.04),
    0 16px 30px -22px rgba(11, 31, 58, 0.45);
}
.rlc-btn {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: color-mix(in srgb, var(--tone) 11%, #fff);
  color: var(--tone);
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 160ms ease, color 160ms ease, transform 280ms cubic-bezier(.3, 1.6, .5, 1), opacity 200ms ease;
}
.rlc-btn:hover { background: color-mix(in srgb, var(--tone) 18%, #fff); }
.rlc-btn:active { background: var(--tone); color: #fff; transform: scale(0.9); transition-duration: 80ms; }
.rlc-btn:focus-visible { outline: 2px solid var(--tone); outline-offset: 2px; }
/* + is the main action: filled. */
.rlc-add {
  background: var(--tone);
  color: #fff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.22), 0 6px 14px -8px var(--tone);
}
.rlc-add:hover { background: color-mix(in srgb, var(--tone) 88%, #000); }
.rlc-add:active { background: color-mix(in srgb, var(--tone) 80%, #000); }
.rlc-btn[aria-disabled="true"] { opacity: 0.38; }
.rlc-add[aria-disabled="true"] { opacity: 1; background: color-mix(in srgb, var(--tone) 11%, #fff); color: color-mix(in srgb, var(--tone) 45%, #fff); box-shadow: none; }
.rlc-btn[aria-disabled="true"]:active { background: color-mix(in srgb, var(--tone) 11%, #fff); transform: scale(0.96); }
.rlc-btn:not(.rlc-add)[aria-disabled="true"]:active { color: var(--tone); }

.rlc-num {
  display: inline-flex;
  justify-content: center;
  min-width: 64px;
  font-size: 34px;
  font-weight: 650;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}
.rlc-price {
  font-size: 15px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: color-mix(in srgb, var(--ink) 62%, transparent);
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0;
}
.rlc-x { margin: 0 0.4em; opacity: 0.7; }
.rlc-total { display: inline-flex; font-weight: 650; color: var(--ink); }

.rlc-roller { display: inline-flex; }
.rlc-colwrap {
  display: inline-grid;
  grid-template-columns: 1fr;
  transition: grid-template-columns 360ms cubic-bezier(.3, 1.25, .5, 1), opacity 220ms ease;
}
.rlc-colwrap[data-shown="false"] { grid-template-columns: 0fr; opacity: 0; }
.rlc-col {
  position: relative;
  display: block;
  min-width: 0;
  overflow: hidden;
  line-height: 1.5;
  -webkit-mask-image: linear-gradient(transparent, #000 22%, #000 78%, transparent);
  mask-image: linear-gradient(transparent, #000 22%, #000 78%, transparent);
}
.rlc-ph { visibility: hidden; }
.rlc-digit {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  text-align: center;
  transform: translateY(calc(var(--o) * 100%));
}

.rlc-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .rlc-btn, .rlc-colwrap { transition-duration: 1ms; }
  .rlc-btn:active { transform: none; }
}
`;export{X as default};
