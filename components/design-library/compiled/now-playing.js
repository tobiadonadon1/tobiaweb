"use client";
/* Construct · Design library: the compiled preview of "Now playing". The source is for members. */
import{useCallback as A,useEffect as N,useRef as z,useState as x}from"react";import{Fragment as C,jsx as e,jsxs as a}from"react/jsx-runtime";var f=[{title:"Slow Water",artist:"Ines Calder",length:228,code:"SW\u201301",bg:"#3d3df5",ink:"#ffffff",art:"water"},{title:"Night Ferry",artist:"Teo Marsh",length:252,code:"NF\u201302",bg:"#16168c",ink:"#ffffff",art:"ferry"},{title:"Paper Sun",artist:"Ada Rhee",length:185,code:"PS\u201303",bg:"#f8b98a",ink:"#14141a",art:"paper"}],T=r=>{let c=Math.max(0,Math.floor(r));return`${Math.floor(c/60)}:${String(c%60).padStart(2,"0")}`};function I({accent:r="#3d3df5",autoplay:c=!0}){let{ref:M,running:y,visible:P}=R(c),[s,m]=x({i:0,e:75}),[g,n]=x(!1),[o,d]=x(!1),u=z(!1),w=z(null),l=f[s.i],E=Math.min(1,s.e/l.length),b=A(()=>m(t=>({i:(t.i+1)%f.length,e:0})),[]),L=A(()=>m(t=>t.e>3?{i:t.i,e:0}:{i:(t.i+f.length-1)%f.length,e:0}),[]);N(()=>{if(!g||!P)return;let t=0,i=performance.now(),p=h=>{let q=Math.min(100,h-i)/1e3;i=h,u.current||m(S=>{let F=S.e+q;return F>=f[S.i].length?{i:(S.i+1)%f.length,e:0}:{i:S.i,e:F}}),t=requestAnimationFrame(p)};return t=requestAnimationFrame(p),()=>cancelAnimationFrame(t)},[g,P]),N(()=>{if(!y)return;let t=window.setTimeout(()=>n(!0),300),i=window.setInterval(b,9e3);return()=>{clearTimeout(t),clearInterval(i)}},[y,b]);let k=t=>{let i=w.current?.getBoundingClientRect();if(!i||i.width===0)return;let p=Math.min(1,Math.max(0,(t.clientX-i.left)/i.width));m(h=>({i:h.i,e:Math.min(f[h.i].length-.5,p*f[h.i].length)}))},v=()=>{u.current=!1,d(!1)};return a(C,{children:[e("style",{children:B}),a("div",{ref:M,className:"np","data-playing":g,style:{"--np-accent":r},children:[e("div",{className:"np-cover","aria-hidden":!0,children:f.map((t,i)=>e(D,{track:t,active:i===s.i},t.code))}),a("div",{className:"np-side",children:[a("div",{className:"np-head",children:[e("span",{className:"np-dot","aria-hidden":!0}),e("span",{children:g?"Now playing":"Paused"}),a("span",{className:"np-eq","aria-hidden":!0,children:[e("i",{}),e("i",{}),e("i",{}),e("i",{}),e("i",{})]})]}),e("div",{className:"np-meta","aria-live":"polite",children:a("div",{className:"np-meta-in",children:[e("div",{className:"np-title",children:l.title}),e("div",{className:"np-artist",children:l.artist})]},l.code)}),a("div",{ref:w,className:"np-scrub","data-dragging":o,role:"slider",tabIndex:0,"aria-label":"Seek","aria-valuemin":0,"aria-valuemax":l.length,"aria-valuenow":Math.floor(s.e),"aria-valuetext":`${T(s.e)} of ${T(l.length)}`,style:{"--np-p":E},onPointerDown:t=>{t.button===0&&(t.currentTarget.setPointerCapture(t.pointerId),u.current=!0,d(!0),k(t))},onPointerMove:t=>{u.current&&k(t)},onPointerUp:v,onPointerCancel:v,onKeyDown:t=>{let i=l.length,p=null;if(t.key==="ArrowRight"||t.key==="ArrowUp"?p=s.e+5:t.key==="ArrowLeft"||t.key==="ArrowDown"?p=s.e-5:t.key==="Home"?p=0:t.key==="End"&&(p=i-1),p===null)return;t.preventDefault();let h=Math.min(i-.5,Math.max(0,p));m(q=>({i:q.i,e:h}))},children:[e("span",{className:"np-track"}),e("span",{className:"np-fill"}),e("span",{className:"np-thumb"})]}),a("div",{className:"np-times","aria-hidden":!0,children:[e("span",{children:T(s.e)}),e("span",{children:T(l.length)})]}),a("div",{className:"np-controls",children:[e("button",{type:"button",className:"np-skip","aria-label":"Previous track",onClick:L,children:a("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,children:[e("rect",{x:"2",y:"2.5",width:"1.6",height:"9",rx:".6"}),e("path",{d:"M11.6 2.9v8.2a.6.6 0 0 1-.92.5L4.9 7.5a.6.6 0 0 1 0-1l5.78-4.1a.6.6 0 0 1 .92.5Z"})]})}),a("button",{type:"button",className:"np-play","aria-label":g?"Pause":"Play",onClick:()=>n(t=>!t),children:[a("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,className:"np-ico-pause",children:[e("rect",{x:"3",y:"2.2",width:"2.6",height:"9.6",rx:".9"}),e("rect",{x:"8.4",y:"2.2",width:"2.6",height:"9.6",rx:".9"})]}),e("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,className:"np-ico-play",children:e("path",{d:"M4 2.6v8.8a.8.8 0 0 0 1.2.7l7-4.4a.8.8 0 0 0 0-1.4l-7-4.4a.8.8 0 0 0-1.2.7Z"})})]}),e("button",{type:"button",className:"np-skip","aria-label":"Next track",onClick:b,children:a("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,children:[e("rect",{x:"10.4",y:"2.5",width:"1.6",height:"9",rx:".6"}),e("path",{d:"M2.4 2.9v8.2a.6.6 0 0 0 .92.5L9.1 7.5a.6.6 0 0 0 0-1L3.32 2.4a.6.6 0 0 0-.92.5Z"})]})})]})]})]})]})}function D({track:r,active:c}){return a("div",{className:"np-art","data-active":c,style:{background:r.bg,color:r.ink},children:[a("svg",{viewBox:"0 0 100 100",width:"100%",height:"100%",className:"np-shapes",children:[r.art==="water"&&a(C,{children:[e("rect",{x:"0",y:"66",width:"100",height:"34",fill:"#2c2cd6"}),e("path",{d:"M24 66a26 26 0 0 1 52 0Z",fill:"#f8b98a"}),e("rect",{x:"30",y:"72",width:"40",height:"2.4",rx:"1.2",fill:"#f8b98a"}),e("rect",{x:"37",y:"78.5",width:"26",height:"2.4",rx:"1.2",fill:"#f8b98a",opacity:".8"}),e("rect",{x:"43",y:"85",width:"14",height:"2.4",rx:"1.2",fill:"#f8b98a",opacity:".6"})]}),r.art==="ferry"&&a(C,{children:[e("circle",{cx:"72",cy:"30",r:"11",fill:"#f4efe6"}),e("circle",{cx:"22",cy:"112",r:"58",fill:"#3d3df5"}),e("circle",{cx:"90",cy:"118",r:"40",fill:"#6f7bff"})]}),r.art==="paper"&&a(C,{children:[e("circle",{cx:"62",cy:"58",r:"30",fill:"#e79c68"}),e("circle",{cx:"54",cy:"50",r:"30",fill:"#3d3df5"})]})]}),e("span",{className:"np-code",children:r.code}),e("span",{className:"np-rule"})]})}function R(r){let c=z(null),[M,y]=x(!1),[P,s]=x(!0),[m,g]=x(!0);return N(()=>{let n=window.matchMedia("(prefers-reduced-motion: reduce)"),o=()=>g(n.matches);return o(),n.addEventListener("change",o),()=>n.removeEventListener("change",o)},[]),N(()=>{let n=c.current;if(!n)return;if(typeof IntersectionObserver>"u"){y(!0);return}let o=new IntersectionObserver(([d])=>y(d.isIntersecting),{threshold:.25});return o.observe(n),()=>o.disconnect()},[]),N(()=>{let n=c.current;if(!n)return;let o=!1,d=!1,u=0,w=()=>{clearTimeout(u),s(!1)},l=()=>{clearTimeout(u),!(o||d)&&(u=window.setTimeout(()=>s(!0),1500))},E=()=>{o=!0,w()},b=()=>{o=!1,l()},L=v=>{let t=v.target,i=!0;try{i=!!t?.matches(":focus-visible")}catch{i=!0}i&&(d=!0,w())},k=v=>{v.relatedTarget instanceof Node&&n.contains(v.relatedTarget)||d&&(d=!1,l())};return n.addEventListener("pointerenter",E),n.addEventListener("pointerleave",b),n.addEventListener("focusin",L),n.addEventListener("focusout",k),()=>{clearTimeout(u),n.removeEventListener("pointerenter",E),n.removeEventListener("pointerleave",b),n.removeEventListener("focusin",L),n.removeEventListener("focusout",k)}},[]),{ref:c,visible:M,running:r&&M&&P&&!m}}var B=`
.np {
  --np-accent: #3d3df5;
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 164px 1fr;
  gap: 22px;
  width: 404px;
  height: 196px;
  padding: 16px 20px 16px 16px;
  border-radius: 28px;
  background: #f8f8f6;
  color: #111;
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14);
}
.np *, .np *::before, .np *::after { box-sizing: border-box; }

/* Cover: three stacked layers, the active one fades in and its shapes settle. */
.np-cover { position: relative; width: 164px; height: 164px; border-radius: 16px; overflow: hidden; isolation: isolate; }
.np-art {
  position: absolute; inset: 0;
  opacity: 0;
  transition: opacity 260ms ease;
}
.np-art[data-active="true"] { opacity: 1; z-index: 1; transition: opacity 420ms ease; }
.np-shapes { display: block; transform: translateY(6%) scale(1.04); transition: transform 200ms ease; }
.np-art[data-active="true"] .np-shapes { transform: none; transition: transform 620ms cubic-bezier(.25, 1.25, .45, 1); }
.np-code {
  position: absolute; left: 13px; bottom: 22px;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 9px; letter-spacing: .06em; line-height: 1;
}
.np-rule { position: absolute; left: 13px; bottom: 14px; width: 68px; height: 1px; background: currentColor; opacity: .85; }

.np-side { display: flex; flex-direction: column; min-width: 0; padding-top: 4px; }

.np-head { display: flex; align-items: center; gap: 8px; height: 16px; font-size: 13px; line-height: 1; color: #6b6b6b; }
.np-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--np-accent); flex: none; }
.np-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 12px; margin-left: 6px; }
.np-eq i { display: block; width: 2px; height: 12px; border-radius: 1px; background: var(--np-accent); transform-origin: 50% 100%; transform: scaleY(var(--r, .5)); transition: transform 300ms ease; }
.np-eq i:nth-child(1) { --r: .55; --d: 540ms; --dl: -120ms; }
.np-eq i:nth-child(2) { --r: 1;   --d: 700ms; --dl: -380ms; }
.np-eq i:nth-child(3) { --r: .7;  --d: 460ms; --dl: -60ms; }
.np-eq i:nth-child(4) { --r: .85; --d: 780ms; --dl: -500ms; }
.np-eq i:nth-child(5) { --r: .45; --d: 610ms; --dl: -240ms; }
.np[data-playing="true"] .np-eq i { animation: np-eq var(--d) ease-in-out var(--dl) infinite alternate; }
@keyframes np-eq { from { transform: scaleY(.22); } to { transform: scaleY(1); } }

.np-meta { margin-top: 16px; height: 44px; overflow: hidden; }
.np-meta-in { animation: np-in 420ms cubic-bezier(.3, 1.3, .5, 1) both; }
@keyframes np-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.np-title { font-size: 20px; font-weight: 500; line-height: 24px; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.np-artist { margin-top: 2px; font-size: 13px; line-height: 16px; color: #8a8a8a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.np-scrub {
  --np-p: 0;
  position: relative;
  margin-top: auto;
  height: 16px;
  cursor: pointer;
  touch-action: none;
  outline: none;
  border-radius: 8px;
}
.np-scrub:focus-visible { box-shadow: 0 0 0 2px #f8f8f6, 0 0 0 4px var(--np-accent); }
.np-track, .np-fill { position: absolute; left: 0; top: 50%; height: 3px; margin-top: -1.5px; border-radius: 2px; }
.np-track { right: 0; background: #e6e6e3; }
.np-fill { width: calc(var(--np-p) * 100%); background: #111; }
.np-thumb {
  position: absolute; top: 50%; left: calc(var(--np-p) * 100%);
  width: 12px; height: 12px; margin: -6px 0 0 -6px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 0 0 / .16), 0 1px 3px rgb(0 0 0 / .18);
  transition: transform 260ms cubic-bezier(.3, 1.4, .5, 1);
}
.np-scrub:hover .np-thumb, .np-scrub:focus-visible .np-thumb { transform: scale(1.15); }
.np-scrub[data-dragging="true"] .np-thumb { transform: scale(1.35); }

.np-times {
  display: flex; justify-content: space-between;
  margin-top: 3px;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; line-height: 1;
  color: #8a8a8a;
  font-variant-numeric: tabular-nums;
}

.np-controls { display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 8px; }
.np-controls button {
  display: grid; place-items: center;
  padding: 0; border: 0; margin: 0;
  font: inherit; color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 220ms cubic-bezier(.3, 1.4, .5, 1), background-color 160ms ease;
}
.np-controls button:active { transform: scale(.92); }
.np-controls button:focus-visible { outline: 2px solid var(--np-accent); outline-offset: 2px; }
.np-controls svg { display: block; fill: currentColor; }
.np-skip { width: 32px; height: 32px; border-radius: 50%; background: transparent; color: #111; }
.np-skip:hover { background: rgb(0 0 0 / .05); }
.np-controls .np-play { position: relative; width: 40px; height: 40px; border-radius: 50%; background: #111; color: #fff; }
.np-play svg { grid-area: 1 / 1; transition: opacity 160ms ease, transform 260ms cubic-bezier(.3, 1.4, .5, 1); }
.np-ico-play { transform: translateX(1px); }
.np[data-playing="true"] .np-ico-play { opacity: 0; transform: translateX(1px) scale(.6); }
.np[data-playing="false"] .np-ico-pause { opacity: 0; transform: scale(.6); }

@media (prefers-reduced-motion: reduce) {
  .np[data-playing="true"] .np-eq i { animation: none; }
  .np-meta-in { animation: none; }
  .np-shapes, .np-art[data-active="true"] .np-shapes { transform: none; transition: none; }
  .np-thumb, .np-play svg, .np-controls button { transition: none; }
}
`;export{I as default};
