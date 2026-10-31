"use client";
/* Construct · Design library: the compiled preview of "Rolling counter". The source is for members. */
import{useEffect as A,useRef as u,useState as U}from"react";import{Fragment as fe,jsx as d,jsxs as E}from"react/jsx-runtime";var f=6,g=10**f-1,w=1.1,de=.2,y=l=>Math.min(g,Math.max(0,Math.round(Number.isFinite(l)?l:0))),Y=l=>l.toLocaleString("en-US"),W=(l,b)=>`of ${Y(b)} \xB7 ${Math.floor(l/b*100)}%`,se=l=>`${(l*74e-5).toFixed(1)} km`,oe=l=>`${Y(Math.round(l*.04))} kcal`;function P(l,b){if(b===0)return l;let L=10**b,S=Math.floor(l/L),x=Math.min(1,Math.max(0,l-S*L-(L-1)));return S+x*x*(3-2*x)}function me({value:l=8240,goal:b=1e4,tone:L="#3d3df5",label:S="Steps",autoplay:x=!0,onChange:j}){let m=y(l),T=Math.max(1,Math.round(b)),[H,ie]=U(m),D=u(T);D.current=T;let N=u(null),O=u(null),F=u([]),G=u([]),X=u(null),I=u(null),B=u(null),C=u(null),z=u(null),J=u(j);J.current=j;let p=u({raw:m,v:0,phase:"rest",goal:m,pos:Array.from({length:f},(t,e)=>P(m,e)),vel:Array.from({length:f},()=>0),blur:Array.from({length:f},()=>0),shownLen:String(m).length,subText:"",fillW:-1,demo:!1,reduced:!1,raf:0,last:0,drag:null}),_=()=>{let t=p.current,e=Math.floor(Math.max(0,t.raw)+1e-6),n=String(Math.min(g,e)).length;for(let o=0;o<f;o++){let c=G.current[o],$=F.current[o];if(!c||!$)continue;let R=(t.pos[o]%10+10)%10;c.style.transform=`translate3d(0, ${(-R*w).toFixed(4)}em, 0)`;let h=t.reduced?0:Math.min(2.2,Math.max(0,Math.abs(t.vel[o])-9)/26);(Math.abs(h-t.blur[o])>.08||h===0&&t.blur[o]!==0)&&(t.blur[o]=h,c.style.filter=h>.05?`blur(${h.toFixed(2)}px)`:"")}n!==t.shownLen&&(t.shownLen=n,F.current.forEach((o,c)=>o?.setAttribute("data-on",String(c<n))),X.current?.setAttribute("data-on",String(n>3)));let s=D.current,a=Math.round(Math.max(0,t.raw)),r=W(a,s);r!==t.subText&&(t.subText=r,I.current&&(I.current.textContent=r),C.current&&(C.current.textContent=se(a)),z.current&&(z.current.textContent=oe(a)));let i=Math.min(1,Math.max(0,t.raw/s));Math.abs(i-t.fillW)>5e-4&&(t.fillW=i,B.current?.style.setProperty("width",`${(i*100).toFixed(2)}%`))},q=t=>{ie(t),p.current.demo||J.current?.(t)},Q=t=>{let e=p.current,n=Math.min(.034,(t-e.last)/1e3);for(e.last=t;n>1e-6;){let a=Math.min(n,.004166666666666667);n-=a,e.phase==="coast"?(e.raw+=e.v*a,e.v*=Math.exp(-a/de),(e.raw<=0||e.raw>=g)&&(e.raw=Math.min(g,Math.max(0,e.raw)),e.v=0),Math.abs(e.v)<24&&(e.phase="settle",e.goal=y(e.raw))):e.phase==="settle"&&(e.v+=(-260*(e.raw-e.goal)-2*Math.sqrt(260)*e.v)*a,e.raw+=e.v*a,Math.abs(e.raw-e.goal)<.002&&Math.abs(e.v)<.05&&(e.raw=e.goal,e.v=0,e.phase="rest",q(e.goal)));for(let r=0;r<f;r++){let i=900/(1+r*.35),o=2*.62*Math.sqrt(i),c=P(e.raw,r);e.vel[r]+=(-i*(e.pos[r]-c)-o*e.vel[r])*a,e.pos[r]+=e.vel[r]*a}}if(_(),e.phase==="rest"&&e.pos.every((a,r)=>Math.abs(a-P(e.raw,r))<.001&&Math.abs(e.vel[r])<.01)){e.pos=e.pos.map((a,r)=>P(e.raw,r)),e.vel.fill(0),_(),e.raf=0;return}e.raf=requestAnimationFrame(Q)},v=()=>{let t=p.current;if(t.reduced){t.phase!=="drag"&&(t.raw=y(t.raw),t.phase!=="rest"&&q(t.raw),t.phase="rest"),t.v=0,t.pos=t.pos.map((e,n)=>P(t.raw,n)),t.vel.fill(0),_();return}t.raf||(t.last=performance.now(),t.raf=requestAnimationFrame(Q))},M=t=>{let e=p.current,n=y(t);if(e.v=0,e.goal=n,Math.abs(n-e.raw)>10&&!e.reduced){e.phase="settle",v();return}e.raw=n;let s=e.phase;e.phase="rest",s!=="drag"&&q(n),v()};A(()=>{let t=p.current,e=window.matchMedia("(prefers-reduced-motion: reduce)");t.reduced=e.matches;let n=()=>t.reduced=e.matches;return e.addEventListener("change",n),()=>{e.removeEventListener("change",n),cancelAnimationFrame(t.raf),t.raf=0}},[]);let V=u(!0);A(()=>{if(V.current){V.current=!1;return}M(m)},[m]);let Z=u(t=>{});Z.current=t=>{let e=p.current;if(e.phase==="drag")return;t.preventDefault(),e.demo=!1;let n=t.deltaMode===1?t.deltaY*16:t.deltaY;e.raw=Math.min(g,Math.max(0,e.raw-n*.35)),e.v=0,e.phase="settle",e.goal=y(e.raw),v()},A(()=>{let t=O.current;if(!t)return;let e=n=>Z.current(n);return t.addEventListener("wheel",e,{passive:!1}),()=>t.removeEventListener("wheel",e)},[]);let[ee,te]=U(!1);A(()=>{let t=N.current;if(!t||!x||typeof IntersectionObserver>"u")return;let e=window.matchMedia("(prefers-reduced-motion: reduce)"),n=!1,s=!1,a=!1,r=0,i=()=>te(n&&!s&&!a&&!e.matches),o=()=>{clearTimeout(r),r=window.setTimeout(i,1500)},c=new IntersectionObserver(([K])=>{n=K.isIntersecting,i()});c.observe(t);let $=()=>{s=!0,clearTimeout(r),i()},R=()=>{s=!1,o()},h=()=>{a=!0,clearTimeout(r),i()},ae=K=>{a=t.contains(K.relatedTarget),o()};return t.addEventListener("pointerenter",$),t.addEventListener("pointerleave",R),t.addEventListener("focusin",h),t.addEventListener("focusout",ae),e.addEventListener("change",i),()=>{c.disconnect(),clearTimeout(r),t.removeEventListener("pointerenter",$),t.removeEventListener("pointerleave",R),t.removeEventListener("focusin",h),t.removeEventListener("focusout",ae),e.removeEventListener("change",i),te(!1)}},[x]);let ne=u(M);ne.current=M,A(()=>{if(!ee)return;let t=7,e=()=>(t=t*16807%2147483647)%1e3/1e3,n=()=>{let r=p.current;if(r.phase==="drag")return;let i=D.current,c=(r.phase==="settle"?r.goal:Math.round(r.raw))+24+Math.round(e()*48);c>i*1.24&&(c=Math.round(i*.14)),r.demo=!0,ne.current(c)},s=window.setTimeout(n,700),a=window.setInterval(n,2200);return()=>{clearTimeout(s),clearInterval(a)}},[ee]);let le=t=>{if(t.button!==0)return;let e=p.current;t.currentTarget.setPointerCapture(t.pointerId),e.demo=!1,e.phase="drag",e.v=0,e.drag={id:t.pointerId,y:t.clientY,t:t.timeStamp,samples:[[t.timeStamp,e.raw]]},N.current?.setAttribute("data-grab","true"),v()},ce=t=>{let e=p.current,n=e.drag;if(!n||n.id!==t.pointerId)return;let s=n.y-t.clientY,a=Math.max(1,t.timeStamp-n.t),r=Math.abs(s)/a,i=Math.min(60,.5+16*r*r);n.y=t.clientY,n.t=t.timeStamp,e.raw=Math.min(g,Math.max(0,e.raw+s*i)),e.reduced&&(e.raw=Math.round(e.raw)),n.samples.push([t.timeStamp,e.raw]),n.samples.length>6&&n.samples.shift(),v()},re=t=>{let e=p.current,n=e.drag;if(!n||n.id!==t.pointerId)return;e.drag=null,N.current?.setAttribute("data-grab","false");let[s,a]=n.samples[0],[r,i]=n.samples[n.samples.length-1],o=r-s,c=t.timeStamp-r<80;if(e.v=o>0&&o<200&&c?(i-a)/o*1e3:0,e.v=Math.max(-6e4,Math.min(6e4,e.v)),e.phase=Math.abs(e.v)>5?"coast":"settle",e.goal=y(e.raw),e.reduced){e.phase="settle",v();return}v()},ue=t=>{let e=p.current;if(e.phase==="drag")return;e.demo=!1;let n=t.shiftKey?10:1,s={ArrowUp:n,ArrowRight:n,ArrowDown:-n,ArrowLeft:-n,PageUp:100,PageDown:-100},a=e.phase==="settle"?e.goal:Math.round(e.raw);if(t.key in s)M(a+s[t.key]);else if(t.key==="Home")M(0);else if(t.key==="End")M(g);else return;t.preventDefault()},[k]=U(()=>({len:String(m).length,digits:Array.from({length:f},(t,e)=>Math.floor(m/10**e)%10),sub:W(m,T),fill:Math.min(1,m/T)}));return E(fe,{children:[d("style",{children:pe}),E("div",{ref:N,className:"rco","data-grab":"false",style:{"--tone":L},children:[E("div",{className:"rco-top",children:[E("span",{className:"rco-label",children:[d("i",{"aria-hidden":!0}),S]}),d("span",{className:"rco-aside","aria-hidden":!0,children:"Today"})]}),d("div",{ref:O,className:"rco-num",role:"spinbutton",tabIndex:0,"aria-label":S,"aria-valuemin":0,"aria-valuemax":g,"aria-valuenow":H,"aria-valuetext":`${Y(H)} ${W(H,T)}`,onPointerDown:le,onPointerMove:ce,onPointerUp:re,onPointerCancel:re,onKeyDown:ue,children:d("span",{className:"rco-digits","aria-hidden":!0,children:Array.from({length:f},(t,e)=>{let n=f-1-e;return E("span",{className:"rco-group",children:[d("span",{ref:s=>{F.current[n]=s},className:"rco-reel","data-on":String(n<k.len),children:d("span",{ref:s=>{G.current[n]=s},className:"rco-col",style:{transform:`translate3d(0, ${(-k.digits[n]*w).toFixed(4)}em, 0)`},children:"01234567890".split("").map((s,a)=>d("span",{children:s},a))})}),n===3&&d("span",{ref:X,className:"rco-comma","data-on":String(k.len>3),children:","})]},n)})})}),d("span",{ref:I,className:"rco-sub","aria-hidden":!0,children:k.sub}),d("span",{className:"rco-line","aria-hidden":!0,children:d("span",{ref:B,style:{width:`${(k.fill*100).toFixed(2)}%`}})}),E("span",{className:"rco-small",children:[d("span",{ref:C,children:se(m)}),d("span",{ref:z,children:oe(m)})]})]})]})}var pe=`
.rco {
  --tone: #3d3df5;
  position: relative;
  box-sizing: border-box;
  width: 288px;
  padding: 18px 20px 20px;
  border-radius: 28px;
  background: #f8f8f6;
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
  display: block;
  width: .555em;
  height: ${w}em;
  overflow: hidden;
  text-align: center;
  -webkit-mask-image: linear-gradient(transparent, #000 14%, #000 86%, transparent);
  mask-image: linear-gradient(transparent, #000 14%, #000 86%, transparent);
  transition: width 320ms cubic-bezier(.3, 1.2, .5, 1), opacity 200ms ease;
}
.rco-reel[data-on="false"] { width: 0; opacity: 0; }
.rco-col { display: grid; will-change: transform; }
.rco-col > span { display: block; height: ${w}em; line-height: ${w}em; }
.rco-comma {
  display: block;
  width: .2em;
  height: ${w}em;
  line-height: ${w}em;
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
}
.rco-line {
  display: block;
  position: relative;
  height: 4px;
  margin-top: 20px;
  border-radius: 99px;
  background: #e6e6e3;
  overflow: hidden;
}
.rco-line span {
  position: absolute; left: 0; top: 0; bottom: 0;
  border-radius: inherit;
  background: var(--tone);
}

.rco-small {
  display: flex; justify-content: space-between;
  margin-top: 10px;
  font: 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: #8a8a8a;
}

@media (prefers-reduced-motion: reduce) {
  .rco-reel, .rco-comma { transition-duration: 1ms; }
}
`;export{me as default};
