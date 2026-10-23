"use client";
/* Construct · Design library: the compiled preview of "Member card". The source is for members. */
import{useEffect as z,useRef as c}from"react";import{Fragment as R,jsx as n,jsxs as g}from"react/jsx-runtime";var a={rx:7,ry:-11,gx:22,gy:12};function C(h){let d=/^#?([0-9a-f]{6})$/i.exec(h.trim()),p=d?parseInt(d[1],16):728890,[x,b,f]=[p>>16&255,p>>8&255,p&255],l=(.2126*x+.7152*b+.0722*f)/255>.6,y=f>x+40&&f>150;return{light:l,ink:l?"#0b1f3a":"#faf8f2",a:"#e09a2b",b:"#d8452f",c:l?"#2b44c4":y?"#faf8f2":"#2b44c4"}}function D({name:h="Lena Fischer",tier:d="Ultimate",number:p="0412 2873 0019",since:x="Member since 2026",tone:b="#0b1f3a",glare:f=60}){let l=c(null),y=c(null),v=c({rx:{x:a.rx,v:0,t:a.rx},ry:{x:a.ry,v:0,t:a.ry},gx:{x:a.gx,v:0,t:a.gx},gy:{x:a.gy,v:0,t:a.gy},lift:{x:0,v:0,t:0}}),w=c(0),k=c(0),M=c(!1),u=C(b);z(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");M.current=t.matches;let r=()=>M.current=t.matches;return t.addEventListener("change",r),()=>{t.removeEventListener("change",r),cancelAnimationFrame(w.current)}},[]);let S=()=>{let t=l.current;if(!t)return;let{rx:r,ry:e,gx:o,gy:i,lift:s}=v.current;t.style.setProperty("--rx",`${r.x.toFixed(2)}deg`),t.style.setProperty("--ry",`${e.x.toFixed(2)}deg`),t.style.setProperty("--gx",`${o.x.toFixed(1)}%`),t.style.setProperty("--gy",`${i.x.toFixed(1)}%`),t.style.setProperty("--lift",s.x.toFixed(3)),t.style.setProperty("--tx",r.x.toFixed(2)),t.style.setProperty("--ty",e.x.toFixed(2))},N=t=>{let r=Math.min(.05,(t-k.current)/1e3);k.current=t;let e=v.current;for(;r>0;){let i=Math.min(r,.004166666666666667);r-=i;for(let[s,F,T]of[[e.rx,120,14],[e.ry,120,14],[e.gx,140,24],[e.gy,140,24],[e.lift,160,22]])s.v+=(F*(s.t-s.x)-T*s.v)*i,s.x+=s.v*i}S();let o=Object.values(e).some(i=>Math.abs(i.v)>.01||Math.abs(i.t-i.x)>.01);w.current=o?requestAnimationFrame(N):0},$=()=>{w.current||(k.current=performance.now(),w.current=requestAnimationFrame(N))},P=(t,r)=>{let{rx:e,ry:o,gx:i,gy:s,lift:F}=v.current;t=Math.max(-1,Math.min(1,t)),r=Math.max(-1,Math.min(1,r)),e.t=M.current?a.rx:-r*13,o.t=M.current?a.ry:t*17,i.t=50+t*46,s.t=50+r*46,F.t=1,$()},A=t=>{let r=y.current?.getBoundingClientRect();r&&P((t.clientX-r.left)/r.width*2-1,(t.clientY-r.top)/r.height*2-1)},m=()=>{let{rx:t,ry:r,gx:e,gy:o,lift:i}=v.current;t.t=a.rx,r.t=a.ry,e.t=a.gx,o.t=a.gy,i.t=0,$()},E=c({x:0,y:0});return g(R,{children:[n("style",{children:L}),g("div",{ref:l,className:"tc","data-light":u.light,style:{"--tone":b,"--fg":u.ink,"--pa":u.a,"--pb":u.b,"--pc":u.c,"--glare":Math.max(0,Math.min(100,f))/100,"--rx":`${a.rx}deg`,"--ry":`${a.ry}deg`,"--gx":`${a.gx}%`,"--gy":`${a.gy}%`},onPointerMove:t=>{t.pointerType==="touch"&&t.buttons===0||A(t)},onPointerDown:t=>t.pointerType==="touch"&&A(t),onPointerUp:t=>t.pointerType==="touch"&&m(),onPointerCancel:m,onPointerLeave:m,children:[n("span",{className:"tc-shadow","aria-hidden":!0}),g("div",{ref:y,className:"tc-card",tabIndex:0,role:"group","aria-roledescription":"membership card","aria-label":`Construct ${d} membership card. ${h}, number ${p}. ${x}.`,onFocus:t=>{t.currentTarget.matches(":focus-visible")&&(E.current={x:.55,y:-.45},P(.55,-.45))},onBlur:m,onKeyDown:t=>{let e=E.current;if(t.key==="ArrowLeft")e.x=Math.max(-1,e.x-.25);else if(t.key==="ArrowRight")e.x=Math.min(1,e.x+.25);else if(t.key==="ArrowUp")e.y=Math.max(-1,e.y-.25);else if(t.key==="ArrowDown")e.y=Math.min(1,e.y+.25);else if(t.key==="Escape"){m();return}else return;t.preventDefault(),P(e.x,e.y)},children:[n("span",{className:"tc-face","aria-hidden":!0,children:n("svg",{viewBox:"0 0 320 202",children:n("circle",{cx:"320",cy:"202",r:"96",fill:"var(--pb)"})})}),n("svg",{className:"tc-paper tc-z2",viewBox:"0 0 320 202","aria-hidden":!0,children:n("circle",{cx:"262",cy:"64",r:"38",fill:"var(--pa)"})}),n("svg",{className:"tc-paper tc-z3",viewBox:"0 0 320 202","aria-hidden":!0,children:n("path",{d:"M196 150 V118 A22 22 0 0 1 240 118 V150 Z",fill:"var(--pc)"})}),g("span",{className:"tc-words","aria-hidden":!0,children:[g("span",{className:"tc-brand",children:[n("svg",{width:"18",height:"18",viewBox:"0 0 18 18",children:n("path",{d:"M9 1.5a7.5 7.5 0 1 0 6.9 10.4h-4.2A3.6 3.6 0 1 1 11.7 6h4.2A7.5 7.5 0 0 0 9 1.5Z",fill:"currentColor"})}),"Construct"]}),g("span",{className:"tc-row",children:[n("span",{className:"tc-tier",children:d}),n("span",{className:"tc-since",children:x})]}),n("span",{className:"tc-name",children:h}),n("span",{className:"tc-num",children:p})]}),n("span",{className:"tc-glare","aria-hidden":!0})]})]})]})}var L=`
.tc {
  --tone: #0b1f3a;
  --fg: #faf8f2;
  --rx: 7deg; --ry: -11deg; --gx: 22%; --gy: 12%; --lift: 0;
  --tx: 7; --ty: -11;
  position: relative;
  display: grid;
  place-items: center;
  padding: 44px 40px;
  perspective: 900px;
  touch-action: pan-y;
  -webkit-tap-highlight-color: transparent;
}

/* The shadow on the table: it slides opposite to the tilt and spreads as the card lifts. */
.tc-shadow {
  position: absolute; left: 50%; top: 50%;
  width: 290px; height: 170px;
  margin: -85px 0 0 -145px;
  border-radius: 24px;
  background: color-mix(in srgb, var(--tone) 55%, #0b1f3a);
  opacity: calc(.5 - var(--lift) * .1);
  filter: blur(calc(14px + var(--lift) * 8px));
  transform:
    translate(calc(var(--ty) * -1.2px), calc(var(--tx) * 1.2px + 18px + var(--lift) * 10px))
    scale(calc(.92 + var(--lift) * .04));
  pointer-events: none;
}
.tc[data-light="true"] .tc-shadow { background: #0b1f3a; opacity: calc(.22 - var(--lift) * .04); }

.tc-card {
  position: relative;
  width: 320px;
  height: 202px;
  border-radius: 18px;
  transform-style: preserve-3d;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translateZ(calc(var(--lift) * 14px));
  color: var(--fg);
  outline: none;
  cursor: default;
  -webkit-tap-highlight-color: transparent;
}
.tc-card:focus-visible { outline: 2px solid var(--tone); outline-offset: 5px; }
.tc[data-light="true"] .tc-card:focus-visible { outline-color: #0b1f3a; }

.tc-face {
  position: absolute; inset: 0;
  border-radius: inherit;
  overflow: hidden;
  background:
    radial-gradient(140% 120% at 0% 0%, rgba(255,255,255,.10), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,.04), rgba(0,0,0,.10)),
    var(--tone);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.14),
    inset 0 1px 0 rgba(255,255,255,.22),
    inset 0 -1px 0 rgba(0,0,0,.25);
}
.tc-face svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.tc[data-light="true"] .tc-face {
  background:
    radial-gradient(140% 120% at 0% 0%, rgba(255,255,255,.7), transparent 55%),
    linear-gradient(180deg, rgba(255,255,255,0), rgba(11,31,58,.05)),
    var(--tone);
  box-shadow: inset 0 0 0 1px rgba(11,31,58,.12), inset 0 1px 0 #fff;
}

/* Depth: each layer floats at its own height above the card. */
.tc-paper {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  overflow: visible;
  pointer-events: none;
  filter: drop-shadow(0 3px 3px rgba(0,0,0,.22));
}
.tc-z2 { transform: translateZ(22px); filter: drop-shadow(0 5px 5px rgba(0,0,0,.25)); }
.tc-z3 { transform: translateZ(36px); filter: drop-shadow(0 6px 6px rgba(0,0,0,.28)); }
.tc[data-light="true"] .tc-paper { filter: drop-shadow(0 3px 3px rgba(11,31,58,.18)); }

.tc-words {
  position: absolute; inset: 0;
  padding: 20px 22px;
  display: grid;
  grid-template-rows: auto auto 1fr auto auto;
  justify-items: start;
  transform: translateZ(16px);
  pointer-events: none;
}
.tc-brand {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 15px; font-weight: 650; letter-spacing: -0.01em;
}
.tc-row { margin-top: 8px; display: flex; align-items: center; gap: 8px; }
.tc-since { font-size: 10.5px; opacity: .66; white-space: nowrap; }
.tc-tier {
  padding: 3px 8px 3px;
  border-radius: 999px;
  font: 600 9.5px/1.2 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--tone);
  background: var(--fg);
}
.tc-name {
  grid-row: 4;
  font-size: 17px; font-weight: 600; letter-spacing: -0.015em;
  white-space: nowrap;
}
.tc-num {
  grid-row: 5;
  margin-top: 5px;
  font-size: 11px;
  opacity: .72;
  white-space: nowrap;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  letter-spacing: .06em;
}

/* The glare: a soft spot plus a faint band, both riding on --gx/--gy. */
.tc-glare {
  position: absolute; inset: 0;
  border-radius: inherit;
  transform: translateZ(1px);
  pointer-events: none;
  opacity: calc(var(--glare) * (.7 + var(--lift) * .3));
  background:
    radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,.55), rgba(255,255,255,.14) 30%, transparent 58%),
    linear-gradient(115deg, transparent calc(var(--gx) - 30%), rgba(255,255,255,.10) var(--gx), transparent calc(var(--gx) + 30%));
}

@media (prefers-reduced-motion: reduce) {
  .tc-card { transform: rotateX(7deg) rotateY(-11deg); }
  .tc-shadow { transform: translate(10px, 28px) scale(.92); }
}
`;export{D as default};
