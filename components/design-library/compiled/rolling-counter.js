"use client";
/* Construct · Design library: the compiled preview of "Rolling counter". The source is for members. */
import{useEffect as H,useRef as l,useState as j}from"react";import{Fragment as ee,jsx as c,jsxs as h}from"react/jsx-runtime";var m=6,g=10**m-1,b=1.1,Q=.2,x=u=>Math.min(g,Math.max(0,Math.round(Number.isFinite(u)?u:0)));function E(u,S){if(S===0)return u;let v=10**S,w=Math.floor(u/v),i=Math.min(1,Math.max(0,u-w*v-(v-1)));return w+i*i*(3-2*i)}function V({value:u=12480,tone:S="#c6f135",label:v="Followers",onChange:w}){let i=x(u),[z,B]=j(i),L=Math.max(1,Math.round(i/1.105)),F=l(L);F.current=L;let T=l(null),C=l(null),N=l([]),$=l([]),I=l(null),U=l(null),P=l(null),_=l(w);_.current=w;let d=l({raw:i,v:0,phase:"rest",goal:i,pos:Array.from({length:m},(t,e)=>E(i,e)),vel:Array.from({length:m},()=>0),blur:Array.from({length:m},()=>0),shownLen:String(i).length,pctText:"",reduced:!1,raf:0,last:0,drag:null}),R=()=>{let t=d.current,e=Math.floor(Math.max(0,t.raw)+1e-6),r=String(Math.min(g,e)).length;for(let s=0;s<m;s++){let p=$.current[s],y=N.current[s];if(!p||!y)continue;let J=(t.pos[s]%10+10)%10;p.style.transform=`translate3d(0, ${(-J*b).toFixed(4)}em, 0)`;let k=t.reduced?0:Math.min(2.2,Math.max(0,Math.abs(t.vel[s])-9)/26);(Math.abs(k-t.blur[s])>.08||k===0&&t.blur[s]!==0)&&(t.blur[s]=k,p.style.filter=k>.05?`blur(${k.toFixed(2)}px)`:"")}r!==t.shownLen&&(t.shownLen=r,N.current.forEach((s,p)=>s?.setAttribute("data-on",String(p<r))),I.current?.setAttribute("data-on",String(r>3)));let o=F.current,a=(Math.round(t.raw)-o)/o*100,n=`${Math.abs(a)<.05?"0.0":Math.abs(a)>=1e3?Math.round(Math.abs(a)).toLocaleString("en-US"):Math.abs(a).toFixed(1)}%`;n!==t.pctText&&(t.pctText=n,P.current&&(P.current.textContent=n),U.current?.setAttribute("data-dir",a<-.05?"down":"up"))},D=t=>{B(t),_.current?.(t)},K=t=>{let e=d.current,r=Math.min(.034,(t-e.last)/1e3);for(e.last=t;r>1e-6;){let a=Math.min(r,.004166666666666667);r-=a,e.phase==="coast"?(e.raw+=e.v*a,e.v*=Math.exp(-a/Q),(e.raw<=0||e.raw>=g)&&(e.raw=Math.min(g,Math.max(0,e.raw)),e.v=0),Math.abs(e.v)<24&&(e.phase="settle",e.goal=x(e.raw))):e.phase==="settle"&&(e.v+=(-260*(e.raw-e.goal)-2*Math.sqrt(260)*e.v)*a,e.raw+=e.v*a,Math.abs(e.raw-e.goal)<.002&&Math.abs(e.v)<.05&&(e.raw=e.goal,e.v=0,e.phase="rest",D(e.goal)));for(let n=0;n<m;n++){let s=900/(1+n*.35),p=2*.62*Math.sqrt(s),y=E(e.raw,n);e.vel[n]+=(-s*(e.pos[n]-y)-p*e.vel[n])*a,e.pos[n]+=e.vel[n]*a}}if(R(),e.phase==="rest"&&e.pos.every((a,n)=>Math.abs(a-E(e.raw,n))<.001&&Math.abs(e.vel[n])<.01)){e.pos=e.pos.map((a,n)=>E(e.raw,n)),e.vel.fill(0),R(),e.raf=0;return}e.raf=requestAnimationFrame(K)},f=()=>{let t=d.current;if(t.reduced){t.phase!=="drag"&&(t.raw=x(t.raw),t.phase!=="rest"&&D(t.raw),t.phase="rest"),t.v=0,t.pos=t.pos.map((e,r)=>E(t.raw,r)),t.vel.fill(0),R();return}t.raf||(t.last=performance.now(),t.raf=requestAnimationFrame(K))},A=t=>{let e=d.current,r=x(t);if(e.v=0,e.goal=r,Math.abs(r-e.raw)>10&&!e.reduced){e.phase="settle",f();return}e.raw=r;let o=e.phase;e.phase="rest",o!=="drag"&&D(r),f()};H(()=>{let t=d.current,e=window.matchMedia("(prefers-reduced-motion: reduce)");t.reduced=e.matches;let r=()=>t.reduced=e.matches;return e.addEventListener("change",r),()=>{e.removeEventListener("change",r),cancelAnimationFrame(t.raf),t.raf=0}},[]);let Y=l(!0);H(()=>{if(Y.current){Y.current=!1;return}A(i)},[i]);let q=l(t=>{});q.current=t=>{let e=d.current;if(e.phase==="drag")return;t.preventDefault();let r=t.deltaMode===1?t.deltaY*16:t.deltaY;e.raw=Math.min(g,Math.max(0,e.raw-r*.35)),e.v=0,e.phase="settle",e.goal=x(e.raw),f()},H(()=>{let t=C.current;if(!t)return;let e=r=>q.current(r);return t.addEventListener("wheel",e,{passive:!1}),()=>t.removeEventListener("wheel",e)},[]);let O=t=>{if(t.button!==0)return;let e=d.current;t.currentTarget.setPointerCapture(t.pointerId),e.phase="drag",e.v=0,e.drag={id:t.pointerId,y:t.clientY,t:t.timeStamp,samples:[[t.timeStamp,e.raw]]},T.current?.setAttribute("data-grab","true"),f()},X=t=>{let e=d.current,r=e.drag;if(!r||r.id!==t.pointerId)return;let o=r.y-t.clientY,a=Math.max(1,t.timeStamp-r.t),n=Math.abs(o)/a,s=Math.min(60,.5+16*n*n);r.y=t.clientY,r.t=t.timeStamp,e.raw=Math.min(g,Math.max(0,e.raw+o*s)),e.reduced&&(e.raw=Math.round(e.raw)),r.samples.push([t.timeStamp,e.raw]),r.samples.length>6&&r.samples.shift(),f()},W=t=>{let e=d.current,r=e.drag;if(!r||r.id!==t.pointerId)return;e.drag=null,T.current?.setAttribute("data-grab","false");let[o,a]=r.samples[0],[n,s]=r.samples[r.samples.length-1],p=n-o,y=t.timeStamp-n<80;if(e.v=p>0&&p<200&&y?(s-a)/p*1e3:0,e.v=Math.max(-6e4,Math.min(6e4,e.v)),e.phase=Math.abs(e.v)>5?"coast":"settle",e.goal=x(e.raw),e.reduced){e.phase="settle",f();return}f()},G=t=>{let e=d.current;if(e.phase==="drag")return;let r=t.shiftKey?10:1,o={ArrowUp:r,ArrowRight:r,ArrowDown:-r,ArrowLeft:-r,PageUp:100,PageDown:-100},a=e.phase==="settle"?e.goal:Math.round(e.raw);if(t.key in o)A(a+o[t.key]);else if(t.key==="Home")A(0);else if(t.key==="End")A(g);else return;t.preventDefault()},[M]=j(()=>{let t=String(i).length,e=(i-L)/L*100;return{len:t,digits:Array.from({length:m},(r,o)=>Math.floor(i/10**o)%10),pct:`${Math.abs(e).toFixed(1)}%`,dir:e<-.05?"down":"up"}});return h(ee,{children:[c("style",{children:Z}),h("div",{ref:T,className:"rco","data-grab":"false",style:{"--tone":S},children:[h("div",{className:"rco-top",children:[c("span",{className:"rco-label",children:v}),h("span",{className:"rco-live","aria-hidden":!0,children:[c("i",{}),"Live"]})]}),h("div",{ref:C,className:"rco-num",role:"spinbutton",tabIndex:0,"aria-label":v,"aria-valuemin":0,"aria-valuemax":g,"aria-valuenow":z,"aria-valuetext":z.toLocaleString("en-US"),onPointerDown:O,onPointerMove:X,onPointerUp:W,onPointerCancel:W,onKeyDown:G,children:[c("span",{className:"rco-digits","aria-hidden":!0,children:Array.from({length:m},(t,e)=>{let r=m-1-e;return h("span",{className:"rco-group",children:[c("span",{ref:o=>{N.current[r]=o},className:"rco-reel","data-on":String(r<M.len),children:c("span",{ref:o=>{$.current[r]=o},className:"rco-col",style:{transform:`translate3d(0, ${(-M.digits[r]*b).toFixed(4)}em, 0)`},children:"01234567890".split("").map((o,a)=>c("span",{children:o},a))})}),r===3&&c("span",{ref:I,className:"rco-comma","data-on":String(M.len>3),children:","})]},r)})}),c("svg",{className:"rco-grip",width:"12",height:"22",viewBox:"0 0 12 22","aria-hidden":!0,children:c("path",{d:"M2.5 7.5 6 4l3.5 3.5M2.5 14.5 6 18l3.5-3.5",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round"})})]}),h("div",{className:"rco-foot",children:[h("span",{ref:U,className:"rco-pill","data-dir":M.dir,children:[c("svg",{width:"9",height:"9",viewBox:"0 0 10 10","aria-hidden":!0,children:c("path",{d:"M5 1.5 9 8.5H1z",fill:"currentColor"})}),c("span",{ref:P,children:M.pct})]}),c("span",{className:"rco-vs",children:"vs last week"})]})]})]})}var Z=`
.rco {
  --tone: #c6f135;
  position: relative;
  box-sizing: border-box;
  width: 300px;
  padding: 20px 22px 20px 24px;
  border-radius: 24px;
  background:
    radial-gradient(120% 80% at 0% 0%, rgb(255 255 255 / .05), transparent 60%),
    #141516;
  color: #f4f5f0;
  font-family: inherit;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .07),
    inset 0 0 0 1px rgb(255 255 255 / .04),
    0 1px 2px rgb(0 0 0 / .18),
    0 24px 40px -22px rgb(0 0 0 / .55);
  user-select: none;
  -webkit-user-select: none;
}
.rco-top { display: flex; align-items: center; justify-content: space-between; height: 20px; }
.rco-label { font-size: 13.5px; font-weight: 500; letter-spacing: -.005em; color: rgb(244 245 240 / .62); }
.rco-live {
  display: inline-flex; align-items: center; gap: 6px;
  font: 600 10px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .08em; text-transform: uppercase;
  color: rgb(244 245 240 / .45);
}
.rco-live i {
  width: 6px; height: 6px; border-radius: 99px; background: var(--tone);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--tone) 50%, transparent);
  animation: rco-pulse 2.4s ease-out infinite;
}
@keyframes rco-pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--tone) 55%, transparent); }
  70%, 100% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--tone) 0%, transparent); }
}

.rco-num {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px -8px 12px;
  padding: 0 8px;
  border-radius: 14px;
  cursor: ns-resize;
  touch-action: none;
  outline: none;
}
.rco-num:focus-visible { box-shadow: 0 0 0 2px var(--tone); }
.rco-digits {
  display: inline-flex;
  font-size: 62px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
.rco-group { display: inline-flex; }
.rco-reel {
  display: block;
  width: .64em;
  height: ${b}em;
  overflow: hidden;
  text-align: center;
  -webkit-mask-image: linear-gradient(transparent, #000 16%, #000 84%, transparent);
  mask-image: linear-gradient(transparent, #000 16%, #000 84%, transparent);
  transition: width 320ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.rco-reel[data-on="false"] { width: 0; opacity: 0; }
.rco-col { display: grid; will-change: transform; }
.rco-col > span { display: block; height: ${b}em; line-height: ${b}em; }
.rco-comma {
  display: block;
  width: .26em;
  height: ${b}em;
  line-height: ${b}em;
  color: rgb(244 245 240 / .5);
  overflow: hidden;
  transition: width 320ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.rco-comma[data-on="false"] { width: 0; opacity: 0; }
.rco-grip {
  display: block;
  flex: none;
  margin-left: auto;
  color: rgb(244 245 240 / .26);
  transition: color 160ms ease, transform 260ms cubic-bezier(.3, 1.4, .5, 1);
}
.rco-num:hover .rco-grip, .rco-num:focus-visible .rco-grip { color: var(--tone); }
.rco[data-grab="true"] .rco-grip { color: var(--tone); transform: scaleY(1.18); }

.rco-foot { display: flex; align-items: center; gap: 10px; }
.rco-pill {
  display: inline-flex; align-items: center; gap: 5px;
  height: 24px; padding: 0 9px 0 8px;
  border-radius: 99px;
  background: var(--tone);
  color: #141516;
  font-size: 12.5px; font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -.01em;
  transition: background-color 200ms ease;
}
.rco-pill svg { display: block; flex: none; transition: transform 300ms cubic-bezier(.3, 1.4, .5, 1); }
.rco-pill[data-dir="down"] { background: #ff6a55; }
.rco-pill[data-dir="down"] svg { transform: rotate(180deg); }
.rco-vs { font-size: 12.5px; font-weight: 500; color: rgb(244 245 240 / .45); }

@media (prefers-reduced-motion: reduce) {
  .rco-live i { animation: none; }
  .rco-reel, .rco-comma, .rco-pill svg, .rco-grip { transition-duration: 1ms; }
}
`;export{V as default};
