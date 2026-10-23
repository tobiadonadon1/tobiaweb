"use client";
/* Construct · Design library: the compiled preview of "Dot field". The source is for members. */
import{useEffect as at,useRef as Y}from"react";import{Fragment as bt,jsx as J,jsxs as gt}from"react/jsx-runtime";function pt({tone:v="#e09a2b",radius:P=96,ground:S="#0a1630",gap:q=12,label:ct="A sunset over water, printed in dots. The dots swell under the pointer; arrow keys move the lens."}){let H=Y(null),Q=Y(null),V=Y({tone:v,radius:P,gap:q});V.current={tone:v,radius:P,gap:q};let f=Y({px:0,py:0,tx:0,ty:0,lens:0,lensT:0,ripples:[],still:!1,redraw:()=>{},wake:()=>{}});at(()=>{let e=H.current,n=Q.current,r=n?.getContext("2d");if(!e||!n||!r)return;let t=f.current,m=0,d=0,C=1,u=0,N=performance.now(),E=0,_=!0,D=window.matchMedia("(prefers-reduced-motion: reduce)");t.still=D.matches;let F=()=>{let{tone:s,radius:T,gap:I}=V.current,a=Math.max(8,I);r.setTransform(C,0,0,C,0,0),r.clearRect(0,0,m,d),r.fillStyle=s;let rt=Math.floor((m-a)/a)+1,ot=Math.floor((d-a)/a)+1,lt=(m-(rt-1)*a)/2,O=(d-(ot-1)*a)/2,U=t.still?1.4:E,K=t.lens,st=Math.PI*2,ut=a*.44,k=O+Math.round((d*.6-O)/a)*a,A=Math.min(m,d)*.3,z=m/2,X=k-A*.2,G=(o,i)=>{let c=Math.hypot(o-z,i-X)/A;return c<1?(1-Math.min(1,Math.max(0,(i-(X-A))/(A*1.2)))*.4)*Math.min(1,(1-c)*9+.4):.38*Math.exp(-(c-1)*3.6)},ht=[1,3],dt=(o,i,c,l)=>{let R=Math.round((k-i)/a);if(R>0){let w=ft(c,l),h=w>.965&&i<X-A*.3?.3+.22*Math.sin(U*1.7+w*90):0,p=ht.includes(R)&&Math.hypot(o-z,i-X)<A?.08:G(o,i);return Math.max(p,h,.05)}if(R===0)return Math.max(.42,G(o,i));let g=(i-k)/Math.max(1,d-k),M=1+.4*Math.sin(l*2.3+U*1.1)+g*.5,x=Math.sin(l*1.7-U*1.4)*(2+g*10),y=G(z+(o-z)/M+x,k-(i-k)*1.25);return Math.max(y*(.62-g*.42),.06+.04*Math.sin(o*.03+U+l))},b=[];for(let o=0;o<ot;o++)for(let i=0;i<rt;i++){let c=lt+i*a,l=O+o*a,R=dt(c,l,i,o),g=.7+R*(ut-.7),M=.16+R*.84;if(K>.001){let x=c-t.px,y=l-t.py,w=Math.hypot(x,y);if(w<T){let h=1-w/T,p=h*h*(3-2*h)*K,it=1+.5*K*h*h;c=t.px+x*it,l=t.py+y*it,g+=p*3.4,M+=(1-M)*Math.min(1,p*1.4),p>.35&&b.push(c,l,g,p)}}for(let x of t.ripples){let y=E-x.t0,w=Math.hypot(c-x.x,l-x.y),h=1-Math.abs(w-y*300)/30;if(h>0){let p=h*Math.max(0,1-y/1.3);g+=p*2.6,M+=(1-M)*p}}r.globalAlpha=Math.min(1,M),r.beginPath(),r.arc(c,l,g,0,st),r.fill()}r.fillStyle="#fff";for(let o=0;o<b.length;o+=4)r.globalAlpha=(b[o+3]-.35)*.55,r.beginPath(),r.arc(b[o]-b[o+2]*.28,b[o+1]-b[o+2]*.28,b[o+2]*.36,0,st),r.fill();r.globalAlpha=1},$=s=>{let T=Math.min(.05,(s-N)/1e3);N=s,E+=T;let I=1-Math.exp(-T*14);t.px+=(t.tx-t.px)*I,t.py+=(t.ty-t.py)*I,t.lens+=(t.lensT-t.lens)*(1-Math.exp(-T*(t.lensT>t.lens?9:6))),t.ripples=t.ripples.filter(a=>E-a.t0<1.6),F(),u=requestAnimationFrame($)},L=()=>{let s=_&&!document.hidden&&!t.still;s&&!u?(N=performance.now(),u=requestAnimationFrame($)):!s&&u&&(cancelAnimationFrame(u),u=0),u||F()};t.redraw=()=>{u||(t.px=t.tx,t.py=t.ty,t.lens=t.lensT,F())},t.wake=()=>{t.ripples.forEach(s=>s.t0<0&&(s.t0=E))};let j=()=>{let s=e.getBoundingClientRect();C=Math.min(2,window.devicePixelRatio||1),m=s.width,d=s.height,n.width=Math.max(1,Math.round(m*C)),n.height=Math.max(1,Math.round(d*C)),t.lensT||(t.tx=t.px=m/2,t.ty=t.py=d/2),u||F()},tt=new ResizeObserver(j);tt.observe(e);let et=new IntersectionObserver(([s])=>{_=s.isIntersecting,L()});et.observe(e);let nt=()=>{t.still=D.matches,L()};return D.addEventListener("change",nt),document.addEventListener("visibilitychange",L),j(),L(),()=>{cancelAnimationFrame(u),tt.disconnect(),et.disconnect(),D.removeEventListener("change",nt),document.removeEventListener("visibilitychange",L)}},[]),at(()=>f.current.redraw(),[v,P,q]);let W=(e,n)=>{let r=H.current?.getBoundingClientRect();if(!r)return;let t=f.current;t.tx=e-r.left,t.ty=n-r.top,t.lensT=1,t.redraw()},B=()=>{f.current.lensT=0,f.current.redraw()},Z=(e,n)=>{let r=f.current;r.still||(r.ripples.push({x:e,y:n,t0:-1}),r.wake())};return gt(bt,{children:[J("style",{children:mt}),J("div",{ref:H,className:"df",style:{"--ground":S,"--tone":v},tabIndex:0,role:"img","aria-label":ct,onPointerMove:e=>{e.pointerType==="touch"&&e.buttons===0||W(e.clientX,e.clientY)},onPointerDown:e=>{W(e.clientX,e.clientY);let n=e.currentTarget.getBoundingClientRect();Z(e.clientX-n.left,e.clientY-n.top)},onPointerUp:e=>e.pointerType==="touch"&&B(),onPointerCancel:B,onPointerLeave:B,onFocus:e=>{if(!e.currentTarget.matches(":focus-visible"))return;let n=f.current,r=e.currentTarget.getBoundingClientRect();n.tx=r.width/2,n.ty=r.height/2,n.lensT=1,n.redraw()},onBlur:B,onKeyDown:e=>{let n=f.current,r=e.currentTarget.getBoundingClientRect(),t=24;if(e.key==="ArrowLeft")n.tx=Math.max(0,n.tx-t);else if(e.key==="ArrowRight")n.tx=Math.min(r.width,n.tx+t);else if(e.key==="ArrowUp")n.ty=Math.max(0,n.ty-t);else if(e.key==="ArrowDown")n.ty=Math.min(r.height,n.ty+t);else if(e.key==="Enter"||e.key===" ")Z(n.tx,n.ty);else return;e.preventDefault(),n.lensT=1,n.redraw()},children:J("canvas",{ref:Q,className:"df-canvas","aria-hidden":!0})})]})}function ft(v,P){let S=Math.sin(v*127.1+P*311.7)*43758.5453;return S-Math.floor(S)}var mt=`
.df {
  --ground: #0a1630;
  --tone: #e09a2b;
  position: relative;
  width: clamp(280px, 88%, 560px);
  aspect-ratio: 4 / 3;
  border-radius: 22px;
  background:
    radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,.05), transparent 60%),
    var(--ground);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.07),
    inset 0 1px 0 rgba(255,255,255,.08),
    0 24px 48px -28px rgba(0,0,0,.7);
  overflow: hidden;
  touch-action: pan-y;
  cursor: crosshair;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.df:focus-visible { box-shadow: 0 0 0 2px var(--ground), 0 0 0 4px var(--tone), inset 0 0 0 1px rgba(255,255,255,.07); }
.df-canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
/* A soft vignette, so the field fades into the panel's edge. */
.df::after {
  content: "";
  position: absolute; inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: radial-gradient(130% 100% at 50% 50%, transparent 55%, color-mix(in srgb, var(--ground) 85%, transparent));
}
`;export{pt as default};
