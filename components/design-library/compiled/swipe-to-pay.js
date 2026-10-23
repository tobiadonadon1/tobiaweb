"use client";
/* Construct · Design library: the compiled preview of "Swipe to pay". The source is for members. */
import{useCallback as A,useEffect as R,useId as X,useRef as p,useState as q}from"react";import{Fragment as Q,jsx as o,jsxs as L}from"react/jsx-runtime";var F=56,$=4;function j({label:s="Swipe to pay \u20AC59",busy:c,done:b,tone:h="#2b44c4",success:g="#1e6a48",onConfirm:i}){let v=O(s),u=c??v.busy,k=b??v.done,M=p(null),y=p(null),r=p(0),a=p(256),x=p(0),m=p(()=>{}),l=p(null),T=p(!1),[d,H]=q("idle"),E=p("idle"),z=X(),P=t=>{E.current=t,H(t)},C=()=>{let t=M.current;t&&(a.current=Math.max(1,t.clientWidth-F-$*2))},w=A(()=>{let t=M.current;if(!t)return;let e=Math.min(1,Math.max(0,r.current/a.current));t.style.setProperty("--x",`${r.current.toFixed(2)}px`),t.style.setProperty("--p",e.toFixed(4)),y.current?.setAttribute("aria-valuenow",String(Math.round(e*100)))},[]),f=A((t,e=0,n=.82,K)=>{if(m.current(),x.current=t,T.current){r.current=t,w(),K?.();return}m.current=G(r.current,t,e,420,n,W=>{r.current=W,w()},K)},[w]),D=A((t=0)=>{E.current==="busy"||E.current==="done"||(P("busy"),f(a.current,Math.max(0,t),1))},[f]);R(()=>{if(d!=="busy")return;let t=setTimeout(()=>{P("done"),i?.()},800);return()=>clearTimeout(t)},[d,i]),R(()=>{if(d!=="done")return;let t=setTimeout(()=>{P("idle"),f(0,0,.9)},1800);return()=>clearTimeout(t)},[d,f]),R(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");T.current=t.matches;let e=()=>T.current=t.matches;return t.addEventListener("change",e),C(),w(),()=>{t.removeEventListener("change",e),m.current()}},[w]);let S=d==="busy"||d==="done",I=t=>{if(S||t.button!==0)return;if(C(),!y.current?.contains(t.target)){r.current<2&&f(0,.9,.42);return}m.current(),t.currentTarget.setPointerCapture(t.pointerId),x.current=r.current,l.current={id:t.pointerId,from:t.clientX,start:r.current,samples:[[t.timeStamp,r.current]]},P("dragging")},U=t=>{let e=l.current;if(!e||e.id!==t.pointerId)return;let n=e.start+(t.clientX-e.from);n<0&&(n=-Y(-n,10)),r.current=Math.min(n,a.current),e.samples.push([t.timeStamp,r.current]),e.samples.length>6&&e.samples.shift(),w(),n>=a.current&&(l.current=null,D(B(e.samples)))},N=t=>{let e=l.current;if(!e||e.id!==t.pointerId)return;l.current=null;let n=B(e.samples);r.current+n*180>=a.current&&r.current>a.current*.3?D(n):(P("idle"),f(0,n))};return L(Q,{children:[o("style",{children:J}),L("div",{ref:M,className:"stc","data-phase":d,style:{"--tone":h,"--ok":g},onPointerDown:I,onPointerMove:U,onPointerUp:N,onPointerCancel:N,onLostPointerCapture:N,children:[o("span",{className:"stc-label","aria-hidden":!0,children:s}),o("span",{className:"stc-dock","aria-hidden":!0,children:o("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round",children:o("path",{d:"M5 12.5l4.5 4.5L19 7.5"})})}),o("span",{className:"stc-fill","aria-hidden":!0}),o("span",{className:"stc-status",id:z,"aria-live":"polite",children:d==="busy"?u:d==="done"?k:""}),L("div",{ref:y,className:"stc-knob",role:"slider",tabIndex:0,"aria-label":s,"aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":0,"aria-valuetext":d==="done"?k:d==="busy"?u:void 0,"aria-describedby":z,"aria-disabled":S||void 0,onKeyDown:t=>{if(S)return;C();let e=a.current/4,n=null;t.key==="ArrowRight"||t.key==="ArrowUp"?n=x.current+e:t.key==="ArrowLeft"||t.key==="ArrowDown"?n=x.current-e:t.key==="End"||t.key==="Enter"?n=a.current:(t.key==="Home"||t.key==="Escape")&&(n=0),n!==null&&(t.preventDefault(),n=Math.min(a.current,Math.max(0,Math.round(n/e)*e)),n>=a.current-.5?D():f(n,0,.9))},onBlur:()=>{E.current==="idle"&&!l.current&&r.current>0&&f(0)},children:[o("svg",{className:"stc-icon stc-arrow",width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:o("path",{d:"M5 12h13M13 6.5l5.5 5.5-5.5 5.5"})}),L("svg",{className:"stc-icon stc-spin",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none","aria-hidden":!0,children:[o("circle",{cx:"12",cy:"12",r:"9",stroke:"currentColor",strokeOpacity:".18",strokeWidth:"2.6"}),o("path",{d:"M12 3a9 9 0 0 1 9 9",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round"})]}),o("svg",{className:"stc-icon stc-check",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.8",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:o("path",{d:"M5 12.5l4.5 4.5L19 7.5"})})]})]})]})}function O(s){let b=((/\bto\s+([a-z]+)/i.exec(s)??/^([a-z]+)/i.exec(s))?.[1]??"confirm").toLowerCase(),h=u=>u.charAt(0).toUpperCase()+u.slice(1),g={pay:["Paying\u2026","Paid"],send:["Sending\u2026","Sent"],delete:["Deleting\u2026","Deleted"],unlock:["Unlocking\u2026","Unlocked"],confirm:["Confirming\u2026","Confirmed"]},[i,v]=g[b]??[`${h(b.replace(/e$/,""))}ing\u2026`,"Done"];return{busy:i,done:v}}function Y(s,c){return c*(1-1/(s/c+1))}function B(s){if(s.length<2)return 0;let[c,b]=s[0],[h,g]=s[s.length-1],i=h-c;return i>0&&i<160?(g-b)/i:0}function G(s,c,b,h,g,i,v){let u=s,k=b*1e3,M=2*g*Math.sqrt(h),y=performance.now(),r=requestAnimationFrame(function a(x){let m=Math.min(.064,(x-y)/1e3);for(y=x;m>0;){let l=Math.min(m,.004166666666666667);k+=(-h*(u-c)-M*k)*l,u+=k*l,m-=l}if(Math.abs(u-c)<.2&&Math.abs(k)<8){i(c),v?.();return}i(u),r=requestAnimationFrame(a)});return()=>cancelAnimationFrame(r)}var J=`
.stc {
  --x: 0px;
  --p: 0;
  --stc-knob: 56px;
  --stc-pad: 4px;
  position: relative;
  width: 320px;
  max-width: 100%;
  height: calc(var(--stc-knob) + var(--stc-pad) * 2);
  border-radius: 999px;
  /* a solid, owned colour: the track is the button */
  background: var(--tone);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .16),
    inset 0 -3px 8px rgb(0 0 0 / .14),
    0 1px 2px rgb(11 31 58 / .16),
    0 16px 30px -16px color-mix(in srgb, var(--tone) 75%, #0b1f3a);
  font-family: inherit;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  touch-action: pan-y;
  isolation: isolate;
  transition: background-color 360ms ease, box-shadow 360ms ease;
}

/* The label sits between the knob and the dock; it fades and drifts as the knob comes. */
.stc-label {
  position: absolute;
  inset: 0 calc(var(--stc-knob) + var(--stc-pad));
  display: grid;
  place-items: center;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  color: transparent;
  background: linear-gradient(100deg,
      rgb(255 255 255 / .74) 0 40%,
      #fff 50%,
      rgb(255 255 255 / .74) 60% 100%) 0 0 / 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  opacity: calc(1 - var(--p) * 2.2);
  transform: translateX(calc(var(--p) * 28px));
  animation: stc-shimmer 2.6s cubic-bezier(.45, 0, .55, 1) infinite;
}
@keyframes stc-shimmer { from { background-position: 100% 0; } to { background-position: 0% 0; } }

/* The dock: an empty slot at the far end, where the knob has to go. */
.stc-dock {
  position: absolute;
  top: var(--stc-pad);
  right: var(--stc-pad);
  width: var(--stc-knob);
  height: var(--stc-knob);
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: rgb(0 0 0 / .1);
  box-shadow: inset 0 0 0 1.5px rgb(255 255 255 / .2), inset 0 2px 4px rgb(0 0 0 / .12);
  color: rgb(255 255 255 / .55);
  opacity: calc(1 - var(--p) * 1.2);
}
.stc-dock svg { display: block; }

/* The fill: a lighter pill that always ends at the knob's right edge. */
.stc-fill {
  position: absolute;
  top: var(--stc-pad);
  bottom: var(--stc-pad);
  left: var(--stc-pad);
  width: calc(var(--x) + var(--stc-knob));
  min-width: var(--stc-knob);
  border-radius: 999px;
  background: color-mix(in srgb, var(--tone) 80%, #fff);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .22);
  transition: background-color 360ms ease;
}

.stc-status {
  position: absolute;
  inset: 0 calc(var(--stc-knob) + var(--stc-pad)) 0 0;
  display: grid;
  place-items: center;
  padding-left: 14px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  white-space: nowrap;
  pointer-events: none;
}
.stc:not([data-phase="busy"]):not([data-phase="done"]) .stc-status { opacity: 0; }
.stc[data-phase="busy"] .stc-status,
.stc[data-phase="done"] .stc-status { animation: stc-rise 380ms cubic-bezier(.2, .9, .3, 1.2) both; }
@keyframes stc-rise { from { opacity: 0; transform: translateY(8px); } }

.stc-knob {
  position: absolute;
  top: var(--stc-pad);
  left: var(--stc-pad);
  width: var(--stc-knob);
  height: var(--stc-knob);
  display: grid;
  place-items: center;
  border-radius: 999px;
  background: linear-gradient(#fff, #f6f4ef);
  color: var(--tone);
  transform: translateX(var(--x));
  box-shadow:
    0 1px 1px rgb(11 31 58 / .2),
    0 6px 14px -4px rgb(11 31 58 / .4),
    inset 0 -2px 0 rgb(11 31 58 / .06);
  cursor: grab;
  outline: none;
  touch-action: none;
  z-index: 2;
  transition: color 360ms ease, box-shadow 200ms ease;
}
.stc-knob > svg { grid-area: 1 / 1; display: block; }
.stc[data-phase="dragging"] .stc-knob { cursor: grabbing; }
.stc[data-phase="idle"] .stc-knob:hover .stc-arrow { transform: translateX(2px); }
.stc[data-phase="dragging"] .stc-knob .stc-arrow { transform: scale(.88); }
.stc-knob:focus-visible { box-shadow: 0 0 0 2px var(--tone), 0 0 0 4px #fff, 0 6px 14px -4px rgb(11 31 58 / .4); }

.stc-icon { transition: opacity 180ms ease, transform 320ms cubic-bezier(.3, 1.4, .5, 1); }
.stc-spin, .stc-check { opacity: 0; transform: scale(.6); }
.stc[data-phase="busy"] .stc-arrow,
.stc[data-phase="done"] .stc-arrow { opacity: 0; transform: translateX(8px) scale(.6); }
.stc[data-phase="busy"] .stc-spin { opacity: 1; transform: none; animation: stc-turn 700ms linear infinite; }
@keyframes stc-turn { to { rotate: 360deg; } }

.stc[data-phase="done"] { background: var(--ok); box-shadow: inset 0 1px 0 rgb(255 255 255 / .16), inset 0 -3px 8px rgb(0 0 0 / .14), 0 1px 2px rgb(11 31 58 / .16), 0 16px 30px -16px color-mix(in srgb, var(--ok) 75%, #0b1f3a); }
.stc[data-phase="done"] .stc-fill { background: var(--ok); }
.stc[data-phase="done"] .stc-knob { color: var(--ok); }
.stc[data-phase="done"] .stc-knob:focus-visible { box-shadow: 0 0 0 2px var(--ok), 0 0 0 4px #fff, 0 6px 14px -4px rgb(11 31 58 / .4); }
.stc[data-phase="done"] .stc-check { opacity: 1; transform: none; }
.stc-check path { stroke-dasharray: 24; stroke-dashoffset: 24; }
.stc[data-phase="done"] .stc-check path { animation: stc-draw 420ms 60ms cubic-bezier(.6, 0, .2, 1) forwards; }
@keyframes stc-draw { to { stroke-dashoffset: 0; } }

@media (prefers-reduced-motion: reduce) {
  .stc-label { animation: none; color: rgb(255 255 255 / .9); background: none; transform: none; }
  .stc-icon, .stc, .stc-fill, .stc-knob { transition-duration: 1ms; }
  .stc[data-phase="idle"] .stc-knob:hover .stc-arrow { transform: none; }
  .stc[data-phase="busy"] .stc-status, .stc[data-phase="done"] .stc-status { animation: none; }
  .stc[data-phase="busy"] .stc-spin { animation-duration: 2.4s; }
  .stc[data-phase="done"] .stc-check path { animation: none; stroke-dashoffset: 0; }
}
`;export{j as default};
