"use client";
/* Construct · Design library: the compiled preview of "Rolling counter". The source is for members. */
import{useEffect as L,useRef as d,useState as Y}from"react";import{Fragment as xe,jsx as c,jsxs as f}from"react/jsx-runtime";var g=6,v=10**g-1,F=1.1,N=1.4,he=.2,k=l=>Math.min(v,Math.max(0,Math.round(Number.isFinite(l)?l:0))),C=l=>l.toLocaleString("en-US"),j=(l,h)=>`${Math.floor(l/h*100)}%`,ce=(l,h)=>`of ${C(h)} \xB7 ${j(l,h)}`,ge=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1.6 -.45'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='.06'/%3E%3C/svg%3E")`,le=l=>`${(l*74e-5).toFixed(1)} km`,pe=l=>`${C(Math.round(l*.04))} kcal`;function T(l,h){if(h===0)return l;let S=10**h,A=Math.floor(l/S),w=Math.min(1,Math.max(0,l-A*S-(S-1)));return A+w*w*(3-2*w)}function be({value:l=8240,streak:h=12,goal:S=1e4,tone:A="#3d3df5",label:w="Steps",autoplay:G=!0,onChange:Z}){let u=k(l),M=Math.max(1,Math.round(S)),[H,de]=Y(u),I=d(M);I.current=M;let $=d(null),B=d(null),D=d([]),X=d([]),J=d(null),z=d(null),q=d(null),Q=d(null),W=d(null),_=d(null),V=d(Z);V.current=Z;let m=d({raw:u,v:0,phase:"rest",goal:u,pos:Array.from({length:g},(t,e)=>T(u,e)),vel:Array.from({length:g},()=>0),blur:Array.from({length:g},()=>0),shownLen:String(u).length,subText:"",fillW:-1,demo:!1,reduced:!1,raf:0,last:0,drag:null}),K=()=>{let t=m.current,e=Math.floor(Math.max(0,t.raw)+1e-6),n=String(Math.min(v,e)).length;for(let o=0;o<g;o++){let p=X.current[o],P=D.current[o];if(!p||!P)continue;let R=(t.pos[o]%10+10)%10;p.style.transform=`translate3d(0, ${(-R*N).toFixed(4)}em, 0)`;let b=t.reduced?0:Math.min(2.2,Math.max(0,Math.abs(t.vel[o])-9)/26);(Math.abs(b-t.blur[o])>.08||b===0&&t.blur[o]!==0)&&(t.blur[o]=b,p.style.filter=b>.05?`blur(${b.toFixed(2)}px)`:"")}n!==t.shownLen&&(t.shownLen=n,D.current.forEach((o,p)=>o?.setAttribute("data-on",String(p<n))),J.current?.setAttribute("data-on",String(n>3)));let s=I.current,a=Math.round(Math.max(0,t.raw)),r=ce(a,s);r!==t.subText&&(t.subText=r,z.current&&(z.current.textContent=`of ${C(s)} \xB7 `),q.current&&(q.current.textContent=j(a,s)),W.current&&(W.current.textContent=le(a)),_.current&&(_.current.textContent=pe(a)));let i=Math.min(1,Math.max(0,t.raw/s));Math.abs(i-t.fillW)>5e-4&&(t.fillW=i,Q.current?.style.setProperty("--w",`${(i*100).toFixed(2)}%`))},U=t=>{de(t),m.current.demo||V.current?.(t)},ee=t=>{let e=m.current,n=Math.min(.034,(t-e.last)/1e3);for(e.last=t;n>1e-6;){let a=Math.min(n,.004166666666666667);n-=a,e.phase==="coast"?(e.raw+=e.v*a,e.v*=Math.exp(-a/he),(e.raw<=0||e.raw>=v)&&(e.raw=Math.min(v,Math.max(0,e.raw)),e.v=0),Math.abs(e.v)<24&&(e.phase="settle",e.goal=k(e.raw))):e.phase==="settle"&&(e.v+=(-260*(e.raw-e.goal)-2*Math.sqrt(260)*e.v)*a,e.raw+=e.v*a,Math.abs(e.raw-e.goal)<.002&&Math.abs(e.v)<.05&&(e.raw=e.goal,e.v=0,e.phase="rest",U(e.goal)));for(let r=0;r<g;r++){let i=900/(1+r*.35),o=2*.62*Math.sqrt(i),p=T(e.raw,r);e.vel[r]+=(-i*(e.pos[r]-p)-o*e.vel[r])*a,e.pos[r]+=e.vel[r]*a}}if(K(),e.phase==="rest"&&e.pos.every((a,r)=>Math.abs(a-T(e.raw,r))<.001&&Math.abs(e.vel[r])<.01)){e.pos=e.pos.map((a,r)=>T(e.raw,r)),e.vel.fill(0),K(),e.raf=0;return}e.raf=requestAnimationFrame(ee)},x=()=>{let t=m.current;if(t.reduced){t.phase!=="drag"&&(t.raw=k(t.raw),t.phase!=="rest"&&U(t.raw),t.phase="rest"),t.v=0,t.pos=t.pos.map((e,n)=>T(t.raw,n)),t.vel.fill(0),K();return}t.raf||(t.last=performance.now(),t.raf=requestAnimationFrame(ee))},y=t=>{let e=m.current,n=k(t);if(e.v=0,e.goal=n,Math.abs(n-e.raw)>10&&!e.reduced){e.phase="settle",x();return}e.raw=n;let s=e.phase;e.phase="rest",s!=="drag"&&U(n),x()};L(()=>{let t=m.current,e=window.matchMedia("(prefers-reduced-motion: reduce)");t.reduced=e.matches;let n=()=>t.reduced=e.matches;return e.addEventListener("change",n),()=>{e.removeEventListener("change",n),cancelAnimationFrame(t.raf),t.raf=0}},[]);let te=d(!0);L(()=>{if(te.current){te.current=!1;return}y(u)},[u]);let ne=d(t=>{});ne.current=t=>{let e=m.current;if(e.phase==="drag")return;t.preventDefault(),e.demo=!1;let n=t.deltaMode===1?t.deltaY*16:t.deltaY;e.raw=Math.min(v,Math.max(0,e.raw-n*.35)),e.v=0,e.phase="settle",e.goal=k(e.raw),x()},L(()=>{let t=B.current;if(!t)return;let e=n=>ne.current(n);return t.addEventListener("wheel",e,{passive:!1}),()=>t.removeEventListener("wheel",e)},[]);let[re,ae]=Y(!1);L(()=>{let t=$.current;if(!t||!G||typeof IntersectionObserver>"u")return;let e=window.matchMedia("(prefers-reduced-motion: reduce)"),n=!1,s=!1,a=!1,r=0,i=()=>ae(n&&!s&&!a&&!e.matches),o=()=>{clearTimeout(r),r=window.setTimeout(i,1500)},p=new IntersectionObserver(([O])=>{n=O.isIntersecting,i()});p.observe(t);let P=()=>{s=!0,clearTimeout(r),i()},R=()=>{s=!1,o()},b=()=>{a=!0,clearTimeout(r),i()},ie=O=>{a=t.contains(O.relatedTarget),o()};return t.addEventListener("pointerenter",P),t.addEventListener("pointerleave",R),t.addEventListener("focusin",b),t.addEventListener("focusout",ie),e.addEventListener("change",i),()=>{p.disconnect(),clearTimeout(r),t.removeEventListener("pointerenter",P),t.removeEventListener("pointerleave",R),t.removeEventListener("focusin",b),t.removeEventListener("focusout",ie),e.removeEventListener("change",i),ae(!1)}},[G]);let se=d(y);se.current=y,L(()=>{if(!re)return;let t=7,e=()=>(t=t*16807%2147483647)%1e3/1e3,n=()=>{let r=m.current;if(r.phase==="drag")return;let i=I.current,p=(r.phase==="settle"?r.goal:Math.round(r.raw))+24+Math.round(e()*48);p>i*1.24&&(p=Math.round(i*.14)),r.demo=!0,se.current(p)},s=window.setTimeout(n,700),a=window.setInterval(n,2200);return()=>{clearTimeout(s),clearInterval(a)}},[re]);let ue=t=>{if(t.button!==0)return;let e=m.current;t.currentTarget.setPointerCapture(t.pointerId),e.demo=!1,e.phase="drag",e.v=0,e.drag={id:t.pointerId,y:t.clientY,t:t.timeStamp,samples:[[t.timeStamp,e.raw]]},$.current?.setAttribute("data-grab","true"),x()},me=t=>{let e=m.current,n=e.drag;if(!n||n.id!==t.pointerId)return;let s=n.y-t.clientY,a=Math.max(1,t.timeStamp-n.t),r=Math.abs(s)/a,i=Math.min(60,.5+16*r*r);n.y=t.clientY,n.t=t.timeStamp,e.raw=Math.min(v,Math.max(0,e.raw+s*i)),e.reduced&&(e.raw=Math.round(e.raw)),n.samples.push([t.timeStamp,e.raw]),n.samples.length>6&&n.samples.shift(),x()},oe=t=>{let e=m.current,n=e.drag;if(!n||n.id!==t.pointerId)return;e.drag=null,$.current?.setAttribute("data-grab","false");let[s,a]=n.samples[0],[r,i]=n.samples[n.samples.length-1],o=r-s,p=t.timeStamp-r<80;if(e.v=o>0&&o<200&&p?(i-a)/o*1e3:0,e.v=Math.max(-6e4,Math.min(6e4,e.v)),e.phase=Math.abs(e.v)>5?"coast":"settle",e.goal=k(e.raw),e.reduced){e.phase="settle",x();return}x()},fe=t=>{let e=m.current;if(e.phase==="drag")return;e.demo=!1;let n=t.shiftKey?10:1,s={ArrowUp:n,ArrowRight:n,ArrowDown:-n,ArrowLeft:-n,PageUp:100,PageDown:-100},a=e.phase==="settle"?e.goal:Math.round(e.raw);if(t.key in s)y(a+s[t.key]);else if(t.key==="Home")y(0);else if(t.key==="End")y(v);else return;t.preventDefault()},[E]=Y(()=>({len:String(u).length,digits:Array.from({length:g},(t,e)=>Math.floor(u/10**e)%10),sub:`of ${C(M)} \xB7 `,pct:j(u,M),fill:Math.min(1,u/M)}));return f(xe,{children:[c("style",{children:ve}),f("div",{ref:$,className:"rco","data-grab":"false",style:{"--tone":A,"--grain":ge},children:[f("div",{className:"rco-top",children:[f("span",{className:"rco-label",children:[c("i",{"aria-hidden":!0}),w]}),h>0?f("span",{className:"rco-streak",children:[f("svg",{viewBox:"0 0 12 14","aria-hidden":!0,children:[c("path",{d:"M6.4.6c.3 2.2 1.5 3.4 2.7 4.7C10.3 6.6 11 8 11 9.4 11 12 8.8 13.6 6 13.6S1 12 1 9.4c0-1.7.8-3 1.9-3.9.2 1.2.8 2 1.7 2.4C4.2 5.6 4.9 2.6 6.4.6Z"}),c("path",{className:"rco-core",d:"M6 13.6c-1.4 0-2.4-.9-2.4-2.2 0-1.1.7-1.8 1.5-2.5.1.8.5 1.3 1.1 1.5.1-1 .6-1.8 1.3-2.4.3 1 1 1.7 1 3 0 1.5-1.1 2.6-2.5 2.6Z"})]}),h,"-day streak"]}):c("span",{className:"rco-aside","aria-hidden":!0,children:"Today"})]}),c("div",{ref:B,className:"rco-num",role:"spinbutton",tabIndex:0,"aria-label":w,"aria-valuemin":0,"aria-valuemax":v,"aria-valuenow":H,"aria-valuetext":`${C(H)} ${ce(H,M)}`,onPointerDown:ue,onPointerMove:me,onPointerUp:oe,onPointerCancel:oe,onKeyDown:fe,children:c("span",{className:"rco-digits","aria-hidden":!0,children:Array.from({length:g},(t,e)=>{let n=g-1-e;return f("span",{className:"rco-group",children:[c("span",{ref:s=>{D.current[n]=s},className:"rco-reel","data-on":String(n<E.len),children:c("span",{ref:s=>{X.current[n]=s},className:"rco-col",style:{transform:`translate3d(0, ${(-E.digits[n]*N).toFixed(4)}em, 0)`},children:"01234567890".split("").map((s,a)=>c("span",{children:s},a))})}),n===3&&c("span",{ref:J,className:"rco-comma","data-on":String(E.len>3),children:","})]},n)})})}),f("span",{className:"rco-sub","aria-hidden":!0,children:[c("span",{ref:z,children:E.sub}),c("b",{ref:q,children:E.pct})]}),f("span",{ref:Q,className:"rco-line","aria-hidden":!0,style:{"--w":`${(E.fill*100).toFixed(2)}%`},children:[c("span",{className:"rco-fill"}),c("span",{className:"rco-head"})]}),f("span",{className:"rco-small",children:[f("span",{className:"rco-km",children:[c("i",{"aria-hidden":!0}),c("span",{ref:W,children:le(u)})]}),f("span",{className:"rco-kcal",children:[c("i",{"aria-hidden":!0}),c("span",{ref:_,children:pe(u)})]})]})]})]})}var ve=`
.rco {
  --tone: #3d3df5;
  position: relative;
  box-sizing: border-box;
  width: 288px;
  padding: 18px 20px 20px;
  border-radius: 28px;
  background:
    var(--grain),
    radial-gradient(80% 50% at 18% 100%, rgb(46 207 143 / .09), rgb(46 207 143 / 0) 70%),
    radial-gradient(60% 45% at 92% 100%, rgb(76 194 255 / .08), rgb(76 194 255 / 0) 70%),
    #f8f8f6;
  color: #111;
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14);
  user-select: none;
  -webkit-user-select: none;
}
.rco-top { display: flex; align-items: center; justify-content: space-between; height: 18px; }
.rco-label { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; line-height: 1; color: #6b6b6b; }
.rco-label i { width: 6px; height: 6px; border-radius: 99px; background: var(--tone); flex: none; }
.rco-aside { font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace; color: #8a8a8a; }
.rco-streak {
  display: inline-flex; align-items: center; gap: 5px;
  height: 20px;
  margin-right: -6px;
  padding: 0 8px 0 7px;
  border-radius: 99px;
  background: rgb(255 79 123 / .1);
  font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: #c92f58;
  white-space: nowrap;
}
.rco-streak svg { width: 10px; height: 12px; flex: none; fill: #ff4f7b; overflow: visible; filter: drop-shadow(0 1px 3px rgb(255 79 123 / .45)); }
.rco-streak .rco-core { fill: #ffb020; }

.rco-num {
  position: relative;
  display: flex;
  margin: 26px -8px 0;
  padding: 0 8px;
  border-radius: 14px;
  cursor: ns-resize;
  touch-action: none;
  outline: none;
}
.rco-num:focus-visible { box-shadow: 0 0 0 2px var(--tone); }
.rco-digits {
  display: inline-flex;
  font-size: 68px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.045em;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
.rco-group { display: inline-flex; }
.rco-reel {
  /* Wider than the digit's advance (padding in, margin out): a wide glyph keeps its sides. */
  display: block;
  box-sizing: content-box;
  width: .555em;
  padding: 0 .14em;
  margin: 0 -.14em;
  height: ${F}em;
  overflow: hidden;
  text-align: center;
  -webkit-mask-image: linear-gradient(transparent, #000 14%, #000 86%, transparent);
  mask-image: linear-gradient(transparent, #000 14%, #000 86%, transparent);
  transition: width 320ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.rco-reel[data-on="false"] { width: 0; opacity: 0; }
.rco-col { display: grid; margin-top: ${(F-N)/2}em; will-change: transform; }
.rco-col > span { display: block; height: ${N}em; line-height: ${N}em; }
.rco-comma {
  display: block;
  width: .2em;
  height: ${F}em;
  line-height: ${F}em;
  text-align: center;
  overflow: hidden;
  transition: width 320ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.rco-comma[data-on="false"] { width: 0; opacity: 0; }

.rco-sub {
  display: block;
  margin-top: 4px;
  font-size: 13px;
  line-height: 18px;
  color: #8a8a8a;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.rco-sub b { font-weight: 500; color: #0f9a62; }
/* the line: one gradient as wide as the track, uncovered up to --w, so each
   colour stays where it is on the way to the goal */
.rco-line {
  --w: 0%;
  display: block;
  position: relative;
  height: 6px;
  margin-top: 19px;
  border-radius: 99px;
  background: #e8e8e4;
  box-shadow: inset 0 1px 1px rgb(0 0 0 / .04);
}
.rco-fill {
  position: absolute; inset: 0;
  border-radius: inherit;
  background: linear-gradient(90deg, #2ecf8f, #4cc2ff);
  clip-path: inset(0 calc(100% - var(--w)) 0 0 round 99px);
}
.rco-head {
  --hc: color-mix(in srgb, #4cc2ff var(--w), #2ecf8f);
  position: absolute;
  top: 50%; left: var(--w);
  box-sizing: border-box;
  width: 10px; height: 10px;
  margin: -5px 0 0 -5px;
  border-radius: 99px;
  background: var(--hc);
  /* the tip of the line glows softly in its own colour */
  box-shadow:
    0 0 0 2.5px #f8f8f6,
    0 0 10px 3px color-mix(in srgb, var(--hc) 50%, transparent),
    0 0 22px 6px color-mix(in srgb, var(--hc) 18%, transparent);
}

.rco-small {
  display: flex; justify-content: space-between;
  margin-top: 12px;
  font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: #8a8a8a;
}

.rco-km, .rco-kcal { display: inline-flex; align-items: center; gap: 6px; }
.rco-small i { width: 5px; height: 5px; border-radius: 99px; flex: none; }
.rco-km i { background: #4cc2ff; }
.rco-kcal i { background: #ff4f7b; }

@media (prefers-reduced-motion: reduce) {
  .rco-reel, .rco-comma { transition-duration: 1ms; }
}
`;export{be as default};
