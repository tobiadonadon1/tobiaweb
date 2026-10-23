"use client";
/* Construct · Design library: the compiled preview of "Picker wheel". The source is for members. */
import{useCallback as oe,useEffect as D,useRef as l,useState as S}from"react";import{Fragment as le,jsx as p,jsxs as z}from"react/jsx-runtime";var x=34,Z=20,Q=x/2/Math.tan(Z/2*Math.PI/180),te=5,ne=u=>String(u).padStart(2,"0"),N=(u,i)=>(u%i+i)%i;function ie(u){let i=/^\s*(\d{1,2}):(\d{2})\s*(AM|PM)?\s*$/i.exec(u),c=i?Math.min(12,Math.max(1,Number(i[1])%12||12)):7,v=i?Math.min(59,Number(i[2])):30,y=i&&i[3]?.toUpperCase()==="PM"?"PM":"AM";return{hour:c,minute:v,period:y}}function se({defaultTime:u="7:30 AM",minuteStep:i=1,tone:c="#ff9f0a",onChange:v,onSave:y}){let r=[1,5,15].includes(i)?i:1,b=ie(u),L=Array.from({length:60/r},(a,d)=>ne(d*r)),X=Array.from({length:12},(a,d)=>String(d+1)),[n,j]=S(b.hour-1),[A,s]=S(Math.round(b.minute/r)%L.length),[m,E]=S(b.period==="PM"?1:0),[g,M]=S({n:0,h:b.hour-1,m:Math.round(b.minute/r)%L.length,p:b.period==="PM"?1:0}),[w,U]=S(!1),[K,$]=S(null),h=()=>{let a=n+1,d=m?"PM":"AM";return{hour:a,minute:A*r,period:d,hours24:a%12+(m?12:0)}},C=l(r);D(()=>{if(C.current===r)return;let a=A*C.current;C.current=r;let d=Math.round(a/r)%(60/r);s(d),M(q=>({n:q.n+1,h:n,m:d,p:m}))},[r]);let F=l(v);F.current=v;let H=l(!0);D(()=>{if(H.current){H.current=!1;return}F.current?.(h())},[n,A,m]),D(()=>{let a=h(),d=()=>{let W=new Date,R=new Date(W);R.setHours(a.hours24,a.minute,0,0),R<=W&&R.setDate(R.getDate()+1);let B=Math.round((R.getTime()-W.getTime())/6e4),T=Math.floor(B/60),Y=B%60;$(T&&Y?`${T} hr ${Y} min`:T?`${T} hr`:`${Math.max(1,Y)} min`)};d();let q=setInterval(d,2e4);return()=>clearInterval(q)},[n,A,m,r]),D(()=>{if(!w)return;let a=setTimeout(()=>U(!1),2e3);return()=>clearTimeout(a)},[w]);let I=h();return z(le,{children:[p("style",{children:ue}),z("div",{className:"pkw",style:{"--tone":c},children:[z("div",{className:"pkw-head",children:[p("button",{type:"button",className:"pkw-link",onClick:()=>M(a=>({n:a.n+1,h:b.hour-1,m:Math.round(b.minute/r)%L.length,p:b.period==="PM"?1:0})),children:"Cancel"}),p("span",{className:"pkw-title",children:"Add Alarm"}),p("button",{type:"button",className:"pkw-link pkw-save",onClick:()=>{U(!0),y?.(I)},children:"Save"})]}),z("div",{className:"pkw-wheels",children:[p("span",{className:"pkw-band","aria-hidden":!0}),p(J,{label:"Hour",items:X,loop:!0,value:n,onSettle:j,goto:{n:g.n,i:g.h},align:"end",spoken:a=>`${a+1} o'clock`,page:3}),p(J,{label:"Minute",items:L,loop:!0,value:A,onSettle:s,goto:{n:g.n,i:g.m},align:"center",spoken:a=>`${a*r} minutes`,page:5}),p(J,{label:"AM or PM",items:["AM","PM"],value:m,onSettle:E,goto:{n:g.n,i:g.p},align:"start",spoken:a=>a?"PM":"AM",page:1})]}),z("p",{className:"pkw-foot","aria-live":"polite","data-saved":w,children:[p("span",{className:"pkw-line","data-show":!w,"aria-hidden":w,children:K?`Rings in ${K}`:" "}),z("span",{className:"pkw-line pkw-ok","data-show":w,"aria-hidden":!w,children:[p("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:p("path",{d:"M5 12.5l4.5 4.5L19 7.5"})}),w?`Alarm set for ${I.hour}:${ne(I.minute)} ${I.period}`:""]})]})]})]})}function J({label:u,items:i,loop:c=!1,value:v,onSettle:y,goto:r,align:b,spoken:L,page:X}){let n=i.length,[j,A]=S(v),s=l(v),m=l(0),E=l(null),g=l(!1),M=l(null),w=l(y);w.current=y;let U=l(v),K=oe(e=>c?N(e,n):Math.min(n-1,Math.max(0,e)),[c,n]),$=e=>{s.current=e,A(e);let t=K(Math.round(e));t!==U.current&&(U.current=t,w.current(t))};D(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");g.current=e.matches;let t=()=>g.current=e.matches;return e.addEventListener("change",t),()=>{e.removeEventListener("change",t),cancelAnimationFrame(m.current)}},[]);let h=(e,t=0,o=16)=>{if(cancelAnimationFrame(m.current),c||(e=Math.min(n-1,Math.max(0,e))),g.current){$(c?N(e,n):e);return}let k=s.current,f=t,P=performance.now(),_=o*o,ae=2*o,V=ee=>{let O=Math.min(.05,(ee-P)/1e3);for(P=ee;O>0;){let G=Math.min(O,.004166666666666667);f+=(-_*(k-e)-ae*f)*G,k+=f*G,O-=G}if(Math.abs(k-e)<.002&&Math.abs(f)<.02){$(c?N(e,n):e);return}$(k),m.current=requestAnimationFrame(V)};m.current=requestAnimationFrame(V)},C=l(r.n);D(()=>{if(C.current===r.n)return;C.current=r.n;let e=s.current,t=r.i;c&&(t=Math.round(e)-N(Math.round(e),n)+r.i,t-e>n/2&&(t-=n),e-t>n/2&&(t+=n)),h(t,0,9)},[r.n]);let F=e=>{let t=Math.round((M.current,s.current));h(c?t+e:Math.min(n-1,Math.max(0,t+e)),0,18)},H=l(!1),I=l(F);I.current=F;let a=l(h);a.current=h,D(()=>{let e=E.current;if(!e)return;let t=0,o=0,k=f=>{if(!H.current)return;f.preventDefault(),cancelAnimationFrame(m.current),t=(f.deltaMode===1?f.deltaY*16:f.deltaY)/x;let P=s.current+t*.8;c||(P=Math.min(n-1+.3,Math.max(-.3,P))),$(P),clearTimeout(o),o=window.setTimeout(()=>a.current(Math.round(s.current),0,14),110)};return e.addEventListener("wheel",k,{passive:!1}),()=>{e.removeEventListener("wheel",k),clearTimeout(o)}},[c,n]);let d=e=>{e.button===0&&(cancelAnimationFrame(m.current),e.currentTarget.setPointerCapture(e.pointerId),M.current={id:e.pointerId,y0:e.clientY,p0:s.current,moved:0,samples:[[e.timeStamp,s.current]]},E.current?.setAttribute("data-grab","true"))},q=e=>{(e.movementX||e.movementY)&&(H.current=!0);let t=M.current;if(!t||t.id!==e.pointerId)return;t.moved=Math.max(t.moved,Math.abs(e.clientY-t.y0));let o=t.p0+(t.y0-e.clientY)/x;c||(o<0&&(o=-re(-o)),o>n-1&&(o=n-1+re(o-(n-1)))),t.samples.push([e.timeStamp,o]),t.samples.length>6&&t.samples.shift(),$(o)},W=e=>{let t=M.current;if(!t||t.id!==e.pointerId)return;if(M.current=null,E.current?.setAttribute("data-grab","false"),t.moved<4){let f=E.current.getBoundingClientRect(),P=e.clientY-(f.top+f.height/2),_=Math.asin(Math.max(-1,Math.min(1,P/Q)))*180/Math.PI;h(Math.round(s.current)+Math.round(_/Z),0,14);return}let o=g.current?0:Math.max(-60,Math.min(60,ce(t.samples))),k=.26;h(Math.round(s.current+o*k),o,1/k)},R=e=>{let t={ArrowUp:1,ArrowDown:-1,PageUp:X,PageDown:-X};if(e.key in t)F(t[e.key]);else if(e.key==="Home")h(Math.round(s.current)-N(Math.round(s.current),n),0,14);else if(e.key==="End")h(Math.round(s.current)-N(Math.round(s.current),n)+n-1,0,14);else return;e.preventDefault()},B=Math.floor(j),T=[];for(let e=B-te;e<=B+te+1;e++){if(!c&&(e<0||e>n-1))continue;let t=e-j;Math.abs(t*Z)>92||T.push({k:e,d:t})}let Y=K(Math.round(j));return p("div",{ref:E,className:"pkw-wheel","data-align":b,"data-grab":"false",role:"spinbutton",tabIndex:0,"aria-label":u,"aria-valuenow":Y,"aria-valuemin":0,"aria-valuemax":n-1,"aria-valuetext":L(Y),onPointerDown:d,onPointerMove:q,onPointerUp:W,onPointerCancel:W,onPointerLeave:()=>{M.current||(H.current=!1)},onKeyDown:R,children:p("div",{className:"pkw-drum","aria-hidden":!0,children:T.map(({k:e,d:t})=>p("span",{className:"pkw-row","data-on":Math.abs(t)<.5,style:{transform:`rotateX(${(-t*Z).toFixed(3)}deg) translateZ(${Q.toFixed(2)}px)`,opacity:Math.max(0,1-Math.abs(t)*.13).toFixed(3)},children:i[N(e,n)]},e))})})}function re(u){return .6*(1-1/(u/.6+1))}function ce(u){if(u.length<2)return 0;let[i,c]=u[0],[v,y]=u[u.length-1],r=v-i;return r>0&&r<160?(y-c)/r*1e3:0}var ue=`
.pkw {
  --tone: #ff9f0a;
  width: 320px;
  max-width: 100%;
  padding-bottom: 6px;
  border-radius: 24px;
  background: #1c1c1e;
  color: #fff;
  font-family: inherit;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .06), 0 0 0 1px rgb(255 255 255 / .04), 0 30px 60px -20px rgb(0 0 0 / .8);
  user-select: none;
  -webkit-user-select: none;
}
.pkw-head {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  height: 54px;
  padding: 0 8px;
}
.pkw-title { font-size: 16px; font-weight: 650; letter-spacing: -0.01em; }
.pkw-link {
  justify-self: start;
  height: 36px;
  padding: 0 10px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--tone);
  font: inherit;
  font-size: 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity 120ms ease, transform 200ms cubic-bezier(.3, 1.5, .5, 1);
}
.pkw-link:active { opacity: .55; transform: scale(.96); }
.pkw-link:focus-visible { outline: 2px solid var(--tone); outline-offset: 0; }
.pkw-save { justify-self: end; font-weight: 650; }

.pkw-wheels {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 76px 1fr;
  height: 200px;
  padding: 0 12px;
  /* rows fade out as they turn away */
  -webkit-mask-image: linear-gradient(transparent 2%, #000 34%, #000 66%, transparent 98%);
  mask-image: linear-gradient(transparent 2%, #000 34%, #000 66%, transparent 98%);
}
.pkw-band {
  position: absolute;
  left: 12px;
  right: 12px;
  top: 50%;
  height: ${x}px;
  margin-top: -${x/2}px;
  border-radius: 9px;
  background: rgb(118 118 128 / .26);
  pointer-events: none;
}
.pkw-wheel {
  position: relative;
  height: 100%;
  perspective: 620px;
  touch-action: none;
  cursor: grab;
  outline: none;
}
.pkw-wheel[data-grab="true"] { cursor: grabbing; }
/* focus: a ring around this drum's part of the band */
.pkw-wheel::after {
  content: "";
  position: absolute;
  left: 2px;
  right: 2px;
  top: 50%;
  height: ${x}px;
  margin-top: -${x/2}px;
  border-radius: 8px;
  box-shadow: 0 0 0 2px var(--tone);
  opacity: 0;
  pointer-events: none;
}
.pkw-wheel:focus-visible::after { opacity: 1; }
.pkw-drum {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: translateZ(-${Q.toFixed(2)}px);
}
.pkw-row {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: ${x}px;
  margin-top: -${x/2}px;
  display: flex;
  align-items: center;
  padding: 0 14px;
  font-size: 22px;
  font-weight: 400;
  letter-spacing: -0.01em;
  font-variant-numeric: tabular-nums;
  backface-visibility: hidden;
  color: rgb(255 255 255 / .92);
}
.pkw-row[data-on="true"] { color: #fff; }
.pkw-wheel[data-align="end"] .pkw-row { justify-content: flex-end; }
.pkw-wheel[data-align="center"] .pkw-row { justify-content: center; }
.pkw-wheel[data-align="start"] .pkw-row { justify-content: flex-start; }

.pkw-foot {
  position: relative;
  display: grid;
  height: 34px;
  margin: 2px 0 0;
  font-size: 13.5px;
  color: rgb(235 235 245 / .6);
  font-variant-numeric: tabular-nums;
}
.pkw-line {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 140ms ease, transform 180ms cubic-bezier(.4, 0, 1, 1);
}
.pkw-line[data-show="true"] { opacity: 1; transform: none; transition: opacity 220ms ease 60ms, transform 420ms cubic-bezier(.3, 1.4, .5, 1) 60ms; }
.pkw-ok { color: var(--tone); font-weight: 600; }
.pkw-ok svg { display: block; flex: none; }

@media (prefers-reduced-motion: reduce) {
  .pkw-line, .pkw-line[data-show="true"] { transform: none; transition: opacity 160ms ease; }
}
`;export{se as default};
