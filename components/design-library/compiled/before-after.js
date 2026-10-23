"use client";
/* Construct · Design library: the compiled preview of "Before & after". The source is for members. */
import{useCallback as Z,useEffect as F,useId as j,useRef as g,useState as Y}from"react";import{Fragment as ee,jsx as e,jsxs as x}from"react/jsx-runtime";function G({before:p,after:f,beforeLabel:l="Before",afterLabel:b="After",start:d=50,tone:m="#faf8f2",onChange:w}){let h=g(null),M=g(null),o=g(360),u=g(-1),y=g(0),v=g(0),L=g("glide"),P=g(0),H=g(!1),k=g(null),A=g({before:!1,after:!1}),[U,$]=Y(!1),D=j().replace(/[^a-zA-Z0-9_-]/g,""),E=t=>Math.min(100,Math.max(0,t)),N=Z(()=>{let t=h.current;if(!t)return;let r=u.current;t.style.setProperty("--x",`${r.toFixed(2)}px`),t.style.setProperty("--hx",`${Math.min(o.current-24,Math.max(24,r)).toFixed(2)}px`);let i=E(r/o.current*100);M.current?.setAttribute("aria-valuenow",String(Math.round(i))),M.current?.setAttribute("aria-valuetext",`${Math.round(i)}% ${l.toLowerCase()}`);let a=r<96,c=r>o.current-88;a!==A.current.before&&t.setAttribute("data-hide-before",String(A.current.before=a)),c!==A.current.after&&t.setAttribute("data-hide-after",String(A.current.after=c))},[l]),S=Z(()=>{cancelAnimationFrame(P.current);let t=performance.now(),r=i=>{let a=Math.min(.05,(i-t)/1e3);t=i;let c=v.current;if(k.current&&L.current==="glide"&&Math.abs(c-u.current)<4&&(L.current="follow"),H.current||L.current==="follow")u.current=c,y.current=0;else{let W=1.72*Math.sqrt(260);for(;a>0;){let R=Math.min(a,.004166666666666667);y.current+=(-260*(u.current-c)-W*y.current)*R,u.current+=y.current*R,a-=R}}if(N(),Math.abs(u.current-c)<.15&&Math.abs(y.current)<6&&!k.current){u.current=c,N(),w?.(Math.round(c/o.current*100));return}P.current=requestAnimationFrame(r)};P.current=requestAnimationFrame(r)},[N,w]),C=Z(t=>{v.current=Math.min(o.current,Math.max(0,t)),L.current="glide",S()},[S]);F(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");H.current=t.matches;let r=()=>H.current=t.matches;t.addEventListener("change",r);let i=h.current,a=new ResizeObserver(()=>{if(!i)return;let c=o.current;o.current=i.clientWidth||360,u.current<0?u.current=v.current=E(d)/100*o.current:(u.current=u.current/c*o.current,v.current=v.current/c*o.current),N()});return i&&a.observe(i),()=>{t.removeEventListener("change",r),a.disconnect(),cancelAnimationFrame(P.current)}},[N]);let T=g(!0);F(()=>{if(T.current){T.current=!1;return}C(E(d)/100*o.current)},[d,C]);let q=t=>{let r=h.current.getBoundingClientRect();return t-r.left},X=t=>{if(t.button!==0)return;t.currentTarget.setPointerCapture(t.pointerId);let r=q(t.clientX),i=Math.abs(r-u.current)<26;k.current={id:t.pointerId,samples:[[t.timeStamp,r]],grabbed:i?u.current-r:0},v.current=r+k.current.grabbed,L.current=i?"follow":"glide",$(!0),S()},K=t=>{let r=k.current;if(!r||r.id!==t.pointerId)return;let i=q(t.clientX);r.samples.push([t.timeStamp,i]),r.samples.length>6&&r.samples.shift();let a=i+r.grabbed;a<0?a=-I(-a,14):a>o.current&&(a=o.current+I(a-o.current,14)),v.current=a},B=t=>{let r=k.current;if(!r||r.id!==t.pointerId)return;k.current=null,$(!1);let i=_(r.samples),a=Math.abs(i)>.3?i*120:0;y.current=L.current==="follow"?i*1e3:y.current,C(v.current+a)},V=t=>{let i=(t.shiftKey||t.key==="PageUp"||t.key==="PageDown"?10:2)/100,a=v.current,c=null;t.key==="ArrowRight"||t.key==="ArrowUp"||t.key==="PageUp"?c=a+i*o.current:t.key==="ArrowLeft"||t.key==="ArrowDown"||t.key==="PageDown"?c=a-i*o.current:t.key==="Home"?c=0:t.key==="End"&&(c=o.current),c!==null&&(t.preventDefault(),C(c))},O=J(m);return x(ee,{children:[e("style",{children:Q}),x("div",{ref:h,className:"icx","data-dragging":U,style:{"--tone":m,"--on-tone":O},onPointerDown:X,onPointerMove:K,onPointerUp:B,onPointerCancel:B,children:[e("div",{className:"icx-layer",children:f??e(z,{mode:"paint",uid:D})}),e("div",{className:"icx-layer icx-before",children:p??e(z,{mode:"sketch",uid:D})}),e("span",{className:"icx-tag icx-tag-before","aria-hidden":!0,children:l}),e("span",{className:"icx-tag icx-tag-after","aria-hidden":!0,children:b}),e("div",{className:"icx-line","aria-hidden":!0}),e("div",{ref:M,className:"icx-handle",role:"slider",tabIndex:0,"aria-label":`${l} and ${b} divider`,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":E(d),"aria-orientation":"horizontal",onKeyDown:V,children:e("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:e("path",{d:"M9 7l-5 5 5 5M15 7l5 5-5 5"})})})]})]})}var s={sky:"#f6e6c4",sun:"#d8452f",far:"#9aa8ec",range:"#2b44c4",hill:"#1e6a48",field:"#e09a2b",ink:"#0b1f3a",cream:"#faf8f2",pine:"#0f4a31"},n={far:"M0 150 L42 118 L78 136 L128 96 L176 140 L214 116 L262 146 L312 108 L360 132 V240 H0Z",range:"M0 172 L56 128 L96 152 L150 104 L206 158 L250 132 L302 162 L360 140 V240 H0Z",hill:"M0 196 C62 168 128 166 196 182 C252 195 304 178 360 170 V240 H0Z",field:"M0 222 C70 204 158 202 226 214 C282 224 326 214 360 208 V240 H0Z",cloud:"M56 66 a14 14 0 0 1 24 -10 a18 18 0 0 1 32 4 a12 12 0 0 1 6 23 H60 a12 12 0 0 1 -4 -17Z",cloud2:"M196 46 a10 10 0 0 1 17 -7 a13 13 0 0 1 23 3 a9 9 0 0 1 4 16 H199 a9 9 0 0 1 -3 -12Z",snow:"M128 96 L116 108 L124 106 L130 112 L136 106 L142 108Z M312 108 L301 117 L308 116 L313 121 L318 116 L324 117Z",house:"M66 168 h30 v22 h-30Z",roof:"M61 170 L81 152 L101 170Z",door:"M78 176 h7 v14 h-7Z",trees:"M262 188 l9 -26 l9 26Z M278 186 l11 -32 l11 32Z M298 184 l8 -22 l8 22Z",birds:"M150 58 q5 -5 10 0 q5 -5 10 0 M178 44 q4 -4 8 0 q4 -4 8 0",rows:"M18 230 C70 216 140 214 200 222 M120 238 C170 228 236 230 300 234"};function z({mode:p,uid:f}){let l=`icx-grain-${f}`,b=`icx-grid-${f}`;if(p==="paint")return x("svg",{className:"icx-art",viewBox:"1.5 0.5 357 238",preserveAspectRatio:"xMidYMid slice","aria-hidden":!0,children:[e("defs",{children:x("filter",{id:l,x:"0",y:"0",width:"100%",height:"100%",children:[e("feTurbulence",{type:"fractalNoise",baseFrequency:".9",numOctaves:"2",seed:"7"}),e("feColorMatrix",{values:"0 0 0 0 0.04  0 0 0 0 0.12  0 0 0 0 0.23  0 0 0 .55 0"}),e("feComposite",{in2:"SourceGraphic",operator:"in"})]})}),e("rect",{width:"360",height:"240",fill:s.sky}),e("circle",{cx:"270",cy:"74",r:"30",fill:s.sun}),x("g",{className:"icx-paper",children:[e("path",{d:n.cloud,fill:s.cream}),e("path",{d:n.cloud2,fill:s.cream})]}),e("path",{d:n.birds,fill:"none",stroke:s.ink,strokeWidth:"1.6",strokeLinecap:"round"}),e("path",{className:"icx-paper",d:n.far,fill:s.far}),x("g",{className:"icx-paper",children:[e("path",{d:n.range,fill:s.range}),e("path",{d:n.snow,fill:s.cream})]}),x("g",{className:"icx-paper",children:[e("path",{d:n.hill,fill:s.hill}),e("path",{d:n.house,fill:s.cream}),e("path",{d:n.roof,fill:s.sun}),e("path",{d:n.door,fill:s.ink}),e("path",{d:n.trees,fill:s.pine})]}),x("g",{className:"icx-paper",children:[e("path",{d:n.field,fill:s.field}),e("path",{d:n.rows,fill:"none",stroke:"#c9821c",strokeWidth:"1.5",strokeLinecap:"round"})]}),e("rect",{width:"360",height:"240",filter:`url(#${l})`,opacity:".13",style:{mixBlendMode:"multiply"}})]});let d=(m,w,h,M,o)=>x("g",{className:"icx-note",children:[e("path",{d:`M${m} ${w} L${h} ${M}`}),e("circle",{cx:m,cy:w,r:"1.6",className:"icx-dot"}),e("rect",{x:h+3,y:M-5,width:"7",height:"7",rx:"1.5",fill:o,stroke:"none"}),e("text",{x:h+13,y:M+1.5,children:o})]});return x("svg",{className:"icx-art icx-sketch",viewBox:"1.5 0.5 357 238",preserveAspectRatio:"xMidYMid slice","aria-hidden":!0,children:[e("defs",{children:e("pattern",{id:b,width:"12",height:"12",patternUnits:"userSpaceOnUse",children:e("path",{d:"M12 0H0V12",fill:"none",stroke:"#2b44c4",strokeOpacity:".09",strokeWidth:".8"})})}),e("rect",{width:"360",height:"240",fill:s.cream}),e("rect",{width:"360",height:"240",fill:`url(#${b})`}),x("g",{className:"icx-guide",children:[e("path",{d:"M0 74 H360 M270 0 V240"}),e("circle",{cx:"270",cy:"74",r:"44"})]}),x("g",{className:"icx-pencil",children:[e("circle",{cx:"270",cy:"74",r:"30"}),e("path",{d:n.cloud}),e("path",{d:n.cloud2}),e("path",{d:n.birds}),e("path",{d:n.far}),e("path",{d:n.range}),e("path",{d:n.snow}),e("path",{d:n.hill}),e("path",{d:n.house}),e("path",{d:n.roof}),e("path",{d:n.door}),e("path",{d:n.trees}),e("path",{d:n.field}),e("path",{d:n.rows})]}),d(247,60,226,28,s.sun),d(40,141,14,112,s.range),d(36,186,22,206,s.hill),d(206,222,232,196,s.field)]})}function I(p,f){return f*(1-1/(p/f+1))}function _(p){if(p.length<2)return 0;let[f,l]=p[0],[b,d]=p[p.length-1],m=b-f;return m>0&&m<160?(d-l)/m:0}function J(p){let f=/^#?([0-9a-f]{6})$/i.exec(p.trim());if(!f)return"#0b1f3a";let l=parseInt(f[1],16),[b,d,m]=[l>>16&255,l>>8&255,l&255].map(w=>{let h=w/255;return h<=.03928?h/12.92:((h+.055)/1.055)**2.4});return .2126*b+.7152*d+.0722*m>.4?"#0b1f3a":"#fff"}var Q=`
.icx {
  --x: 50%;
  position: relative;
  width: 360px;
  max-width: 100%;
  aspect-ratio: 3 / 2;
  border-radius: 20px;
  overflow: hidden;
  isolation: isolate;
  cursor: ew-resize;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(11 31 58 / .08),
    0 1px 2px rgb(11 31 58 / .08),
    0 18px 40px -22px rgb(11 31 58 / .45);
}
.icx-layer { position: absolute; inset: 0; }
.icx-layer > * { width: 100%; height: 100%; display: block; object-fit: cover; }
.icx-before { clip-path: inset(0 calc(100% - var(--x)) 0 0); }
.icx-art { pointer-events: none; }

.icx-paper { filter: drop-shadow(0 -1.5px 1.5px rgb(11 31 58 / .22)); }
.icx-pencil, .icx-guide, .icx-note path {
  fill: none;
  stroke: #0b1f3a;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.icx-pencil { stroke-width: 1.15; stroke-opacity: .78; }
.icx-guide { stroke: #2b44c4; stroke-width: .8; stroke-opacity: .45; stroke-dasharray: 3 4; }
.icx-note path { stroke-width: .8; stroke-opacity: .6; }
.icx-dot { fill: #0b1f3a; }
.icx-note text {
  font: 500 8.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  fill: #0b1f3a;
  fill-opacity: .72;
  letter-spacing: .02em;
}

.icx-tag {
  position: absolute;
  top: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: .01em;
  pointer-events: none;
  transition: opacity 200ms ease, transform 320ms cubic-bezier(.3, 1.4, .5, 1);
}
.icx-tag-before { left: 12px; background: #fff; color: #0b1f3a; box-shadow: 0 0 0 1px rgb(11 31 58 / .12); }
.icx-tag-after { right: 12px; background: rgb(11 31 58 / .82); color: #faf8f2; }
.icx[data-hide-before="true"] .icx-tag-before { opacity: 0; transform: translateX(-8px) scale(.92); transition-duration: 140ms; }
.icx[data-hide-after="true"] .icx-tag-after { opacity: 0; transform: translateX(8px) scale(.92); transition-duration: 140ms; }

.icx-line {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  margin-left: -1px;
  background: var(--tone);
  transform: translateX(var(--x));
  box-shadow: 0 0 0 .5px rgb(11 31 58 / .18), 0 0 12px rgb(11 31 58 / .18);
  pointer-events: none;
}
.icx-handle {
  position: absolute;
  top: 50%;
  left: 0;
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: var(--tone);
  color: var(--on-tone);
  transform: translateX(var(--hx, var(--x)));
  box-shadow:
    0 0 0 1px rgb(11 31 58 / .12),
    0 2px 4px rgb(11 31 58 / .14),
    0 10px 22px -8px rgb(11 31 58 / .45),
    inset 0 1px 0 rgb(255 255 255 / .5);
  outline: none;
  cursor: grab;
}
.icx-handle svg { transition: transform 320ms cubic-bezier(.3, 1.4, .5, 1); }
.icx[data-dragging="true"] { cursor: grabbing; }
.icx[data-dragging="true"] .icx-handle { cursor: grabbing; }
.icx[data-dragging="true"] .icx-handle svg { transform: scaleX(.8); }
.icx-handle:focus-visible { box-shadow: 0 0 0 3px var(--on-tone), 0 0 0 5px var(--tone), 0 10px 22px -8px rgb(11 31 58 / .45); }

@media (prefers-reduced-motion: reduce) {
  .icx-tag, .icx-handle svg { transition-duration: 1ms; }
}
`;export{G as default};
