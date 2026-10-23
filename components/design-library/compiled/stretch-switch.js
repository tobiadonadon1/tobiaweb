"use client";
/* Construct · Design library: the compiled preview of "Stretch switch". The source is for members. */
import{useEffect as I,useId as D,useRef as m,useState as N}from"react";import{Fragment as u,jsx as e,jsxs as n}from"react/jsx-runtime";var P=.9;function G({label:d="Dark mode",hint:h="Easier on the eyes at night",checked:v,defaultChecked:F=!0,onChange:A,tone:E="#2b44c4",size:L="md",glyph:f="theme"}){let g=D(),[B,T]=N(F),r=v??B,b=m(null),[o]=N(()=>r?1:0),R=m({l:o,r:o,vl:0,vr:0}),l=m(0),W=()=>{let a=!r;v===void 0&&T(a),A?.(a)};return I(()=>{let a=b.current;if(!a)return;let s=r?1:0,x=window.matchMedia("(prefers-reduced-motion: reduce)").matches,t=R.current,k={k:560,c:27},q={k:210,c:16},y={k:900,c:60},M=x?y:r?q:k,w=x?y:r?k:q,z=()=>{let i=1+(t.r-t.l)*P;a.style.setProperty("--l",t.l.toFixed(4)),a.style.setProperty("--r",t.r.toFixed(4)),a.style.setProperty("--sy",Math.min(1.14,Math.max(.8,1/Math.sqrt(i))).toFixed(4)),a.parentElement?.style.setProperty("--p",Math.min(1,Math.max(0,(t.l+t.r)/2)).toFixed(4))};cancelAnimationFrame(l.current);let C=performance.now(),S=i=>{let c=Math.min(.024,(i-C)/1e3);C=i,t.vl+=(-M.k*(t.l-s)-M.c*t.vl)*c,t.vr+=(-w.k*(t.r-s)-w.c*t.vr)*c,t.l+=t.vl*c,t.r+=t.vr*c,t.r>1&&(t.r=1,t.vr=Math.min(0,t.vr)),t.l<0&&(t.l=0,t.vl=Math.max(0,t.vl));let p=.26/P;t.l>t.r+p&&(t.l=t.r+p),t.r<t.l-p&&(t.r=t.l-p),z(),Math.abs(t.l-s)+Math.abs(t.r-s)>8e-4||Math.abs(t.vl)+Math.abs(t.vr)>.004?l.current=requestAnimationFrame(S):(t.l=t.r=s,t.vl=t.vr=0,z())};return l.current=requestAnimationFrame(S),()=>cancelAnimationFrame(l.current)},[r]),n(u,{children:[e("style",{children:H}),n("div",{className:"lqt","data-size":L,"data-on":r,style:{"--tone":E},children:[(d||h)&&n("label",{className:"lqt-text",htmlFor:g,children:[d&&e("span",{className:"lqt-label",children:d}),h&&e("span",{className:"lqt-hint",children:h})]}),e("button",{id:g,type:"button",role:"switch","aria-checked":r,className:"lqt-track",onClick:W,style:{"--p":o},children:n("span",{ref:b,className:"lqt-knob",style:{"--l":o,"--r":o,"--sy":1},children:[f==="theme"&&n(u,{children:[n("svg",{className:"lqt-g lqt-sun",viewBox:"0 0 24 24","aria-hidden":!0,children:[e("circle",{cx:"12",cy:"12",r:"4.2",fill:"currentColor"}),e("g",{stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",children:e("path",{d:"M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"})})]}),e("svg",{className:"lqt-g lqt-moon",viewBox:"0 0 24 24","aria-hidden":!0,children:e("path",{d:"M20 14.6A8 8 0 0 1 9.4 4a8 8 0 1 0 10.6 10.6z",fill:"currentColor"})})]}),f==="mark"&&n(u,{children:[e("svg",{className:"lqt-g lqt-off",viewBox:"0 0 24 24","aria-hidden":!0,children:e("circle",{cx:"12",cy:"12",r:"5",fill:"none",stroke:"currentColor",strokeWidth:"2.4"})}),e("svg",{className:"lqt-g lqt-on",viewBox:"0 0 24 24","aria-hidden":!0,children:e("path",{d:"M12 6.5v11",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round"})})]})]})})]})]})}var H=`
.lqt {
  --ink: #0b1f3a;
  --k: 30px;
  --pad: 3.5px;
  display: inline-flex;
  align-items: center;
  gap: 22px;
  color: var(--ink);
  font-family: inherit;
}
.lqt[data-size="sm"] { --k: 20px; --pad: 3px; gap: 16px; }
.lqt[data-size="lg"] { --k: 40px; --pad: 4px; gap: 26px; }

.lqt-text { display: grid; gap: 3px; cursor: pointer; user-select: none; -webkit-user-select: none; }
.lqt-label { font-size: 16px; font-weight: 600; letter-spacing: -0.01em; line-height: 1.2; }
.lqt-hint { font-size: 13px; line-height: 1.3; color: color-mix(in srgb, var(--ink) 58%, transparent); }
.lqt[data-size="sm"] .lqt-label { font-size: 14px; }
.lqt[data-size="sm"] .lqt-hint { font-size: 12px; }
.lqt[data-size="lg"] .lqt-label { font-size: 18px; }
.lqt[data-size="lg"] .lqt-hint { font-size: 14px; }

.lqt-track {
  --travel: calc(var(--k) * 0.9);
  position: relative;
  flex: none;
  width: calc(var(--k) * 1.9 + var(--pad) * 2);
  height: calc(var(--k) + var(--pad) * 2);
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ink) 13%, #f1eadb);
  box-shadow: inset 0 1px 2px rgba(11, 31, 58, 0.16), inset 0 0 0 1px rgba(11, 31, 58, 0.05);
  cursor: pointer;
  isolation: isolate;
  transition: transform 260ms cubic-bezier(.3, 1.5, .5, 1);
  -webkit-tap-highlight-color: transparent;
}
/* The "on" colour, faded in by the knob's own position (--p, painted with the springs). */
.lqt-track::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background: var(--tone);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
  opacity: var(--p);
}
.lqt-track:active { transform: scale(0.96); transition-duration: 100ms; }
.lqt-track:focus-visible { outline: 2px solid var(--tone); outline-offset: 3px; }

/* The knob: its edges and height come from the springs (--l, --r, --sy). */
.lqt-knob {
  position: absolute;
  top: 50%;
  left: calc(var(--pad) + var(--l) * var(--travel));
  width: calc(var(--k) + (var(--r) - var(--l)) * var(--travel));
  height: calc(var(--k) * var(--sy));
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: #fffefb;
  box-shadow:
    0 1px 1px rgba(11, 31, 58, 0.18),
    0 3px 8px -2px rgba(11, 31, 58, 0.3),
    inset 0 -1px 0 rgba(11, 31, 58, 0.06);
}

/* Glyphs: one turns out as the other turns in. */
.lqt-g {
  grid-area: 1 / 1;
  display: block;
  width: calc(var(--k) * 0.56);
  height: calc(var(--k) * 0.56);
  transition: transform 420ms cubic-bezier(.3, 1.5, .5, 1), opacity 200ms ease;
}
.lqt-sun { color: #e09a2b; }
.lqt-moon { color: var(--tone); }
.lqt-off { color: color-mix(in srgb, var(--ink) 40%, transparent); }
.lqt-on { color: var(--tone); }
.lqt[data-on="true"] .lqt-sun, .lqt[data-on="true"] .lqt-off { opacity: 0; transform: rotate(90deg) scale(0.4); }
.lqt[data-on="false"] .lqt-moon, .lqt[data-on="false"] .lqt-on { opacity: 0; transform: rotate(-70deg) scale(0.4); }

@media (prefers-reduced-motion: reduce) {
  .lqt-g { transition: opacity 160ms ease; transform: none !important; }
  .lqt-track:active { transform: none; }
}
`;export{G as default};
