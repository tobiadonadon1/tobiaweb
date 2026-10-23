"use client";
/* Construct · Design library: the compiled preview of "Reorder list". The source is for members. */
import{useEffect as j,useId as G,useLayoutEffect as J,useRef as k,useState as B}from"react";import{Fragment as tt,jsx as a,jsxs as b}from"react/jsx-runtime";var Q=[{id:"pricing",title:"Ship the pricing page",tag:"Design",colour:"#2b44c4"},{id:"marta",title:"Reply to Marta\u2019s notes",tag:"Inbox",colour:"#e09a2b"},{id:"video",title:"Record the launch video",tag:"Video",colour:"#d8452f"},{id:"android",title:"Fix Android sign-in",tag:"Bug",colour:"#0b1f3a"},{id:"studio",title:"Book the studio for Friday",tag:"Admin",colour:"#1e6a48"}];function W({items:p=Q,title:h="This week",tone:N="#2b44c4",onReorder:E}){let[o,M]=B(p),[I,x]=B(null),[f,m]=B(null),[Y,y]=B(""),c=k(new Map),$=k(new Map),R=k(null),g=k(null),d=k(null),L=k(!1),z=G();j(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");L.current=t.matches;let r=()=>L.current=t.matches;return t.addEventListener("change",r),()=>t.removeEventListener("change",r)},[]);let K=()=>{let t=new Map;c.current.forEach((r,e)=>t.set(e,r.getBoundingClientRect().top)),R.current=t};J(()=>{let t=R.current;if(!t)return;R.current=null,c.current.forEach(e=>{e.style.transition="none",e.style.removeProperty("--dy")}),c.current.forEach((e,n)=>{let s=t.get(n);if(s===void 0)return;let i=s-e.getBoundingClientRect().top;if(Math.abs(i)<.5||L.current){e.style.transition="";return}let u=e.dataset.landing==="true",S=u||e.getAttribute("data-lifted")==="true";e.style.transform=`translateY(${i}px)${u?" scale(1.02) rotate(-.6deg)":S?" scale(1.02)":""}`,e.offsetHeight,e.style.transition=u?"transform 420ms cubic-bezier(.3, 1.35, .5, 1), box-shadow 300ms ease":"transform 260ms cubic-bezier(.2, .8, .3, 1)",e.style.transform="";let P=()=>{e.style.transition="",e.removeEventListener("transitionend",P)};e.addEventListener("transitionend",P)});let r=d.current;r&&document.activeElement!==$.current.get(r.id)&&$.current.get(r.id)?.focus({preventScroll:!0})},[o]);let T=(t,r)=>{K(),c.current.forEach((e,n)=>e.dataset.landing=String(n===r)),M(t)},C=(t,r,e)=>{let n=t.slice(),[s]=n.splice(r,1);return n.splice(e,0,s),n},l=o.length,A=t=>Math.max(0,Math.min(l-1,t)),U=(t,r)=>{if(t.button!==0||d.current)return;let e=o.findIndex(S=>S.id===r),n=c.current.get(r),s=c.current.get(o[Math.min(l-1,e+1)].id),i=c.current.get(o[Math.max(0,e-1)].id);if(!n)return;let u=l>1?Math.abs((s??n).offsetTop-(i??n).offsetTop)/(e>0&&e<l-1?2:1):n.offsetHeight;t.currentTarget.setPointerCapture(t.pointerId),g.current={id:r,pointer:t.pointerId,from:e,y0:t.clientY,slot:u,samples:[[t.timeStamp,0]]},n.style.transition="",n.style.setProperty("--dy","0px"),x(r),m(e)},q=t=>{let r=g.current;if(!r||r.pointer!==t.pointerId)return;let e=t.clientY-r.y0,n=-r.from*r.slot,s=(l-1-r.from)*r.slot;e<n?e=n-H(n-e,22):e>s&&(e=s+H(e-s,22)),r.samples.push([t.timeStamp,e]),r.samples.length>6&&r.samples.shift(),c.current.get(r.id)?.style.setProperty("--dy",`${e.toFixed(2)}px`);let i=A(Math.round(r.from+e/r.slot));i!==f&&m(i)},D=t=>{let r=g.current;if(!r||r.pointer!==t.pointerId)return;g.current=null;let e=r.samples[r.samples.length-1][1],n=X(r.samples),s=r.from+e/r.slot,i=Math.abs(n)>.6?Math.max(-1,Math.min(1,n*70/r.slot)):0,u=A(Math.round(s+i)),S=o[r.from];if(x(null),m(null),u===r.from){let w=c.current.get(r.id);if(w&&!L.current){w.style.transition="transform 380ms cubic-bezier(.3, 1.35, .5, 1), box-shadow 300ms ease";let F=()=>{w.style.transition="",w.removeEventListener("transitionend",F)};w.addEventListener("transitionend",F)}w?.style.setProperty("--dy","0px");return}let P=C(o,r.from,u);T(P,r.id),y(`${S.title}, moved to position ${u+1} of ${l}.`),E?.(P)},O=(t,r)=>{let e=o.findIndex(i=>i.id===r),n=o[e],s=d.current;if(t.key===" "||t.key==="Enter"){t.preventDefault(),s?(d.current=null,x(null),m(null),y(`Dropped ${n.title} at position ${e+1} of ${l}.`),s.from!==e&&E?.(o)):(d.current={id:r,from:e,original:o},x(r),m(e),y(`Picked up ${n.title}, position ${e+1} of ${l}. Use the arrow keys to move it, Space to drop, Escape to cancel.`));return}if(s)if(t.key==="ArrowUp"||t.key==="ArrowDown"){t.preventDefault();let i=A(e+(t.key==="ArrowUp"?-1:1));if(i===e){y(`${n.title} is already ${i===0?"first":"last"}.`);return}T(C(o,e,i),null),m(i),y(`${n.title}, position ${i+1} of ${l}.`)}else t.key==="Escape"&&(t.preventDefault(),d.current=null,T(s.original,null),x(null),m(null),y(`Cancelled. ${n.title} is back at position ${s.from+1} of ${l}.`))},V=t=>{let r=d.current;requestAnimationFrame(()=>{if(!d.current||d.current!==r||r.id!==t||document.activeElement===$.current.get(t))return;d.current=null,x(null),m(null);let e=o.findIndex(n=>n.id===t);r.from!==e&&E?.(o)})},v=I&&g.current?g.current.from:null,_=t=>v===null||f===null||t===v?0:v<f&&t>v&&t<=f?-1:f<v&&t>=f&&t<v?1:0;return b(tt,{children:[a("style",{children:Z}),b("div",{className:"rol",style:{"--tone":N},children:[b("div",{className:"rol-head",children:[a("strong",{id:z,children:h}),b("span",{children:[l," tasks"]})]}),b("div",{className:"rol-body",children:[a("ol",{className:"rol-ranks","aria-hidden":!0,children:o.map((t,r)=>a("li",{"data-aim":f===r,children:r+1},r))}),a("ul",{className:"rol-list","aria-labelledby":z,children:o.map((t,r)=>b("li",{ref:e=>{e?c.current.set(t.id,e):c.current.delete(t.id)},className:"rol-row","data-lifted":I===t.id,"data-kbd":I===t.id&&!g.current,style:{"--c":t.colour,"--s":_(r)},children:[a("span",{className:"rol-dot","aria-hidden":!0}),a("span",{className:"rol-title",children:t.title}),a("span",{className:"rol-tag",children:t.tag}),a("button",{ref:e=>{e?$.current.set(t.id,e):$.current.delete(t.id)},type:"button",className:"rol-handle","aria-label":`Reorder ${t.title}, position ${r+1} of ${l}`,"aria-pressed":I===t.id,"aria-describedby":`${z}-help`,onPointerDown:e=>U(e,t.id),onPointerMove:q,onPointerUp:D,onPointerCancel:D,onKeyDown:e=>O(e,t.id),onBlur:()=>V(t.id),children:a("svg",{width:"12",height:"18",viewBox:"0 0 12 18","aria-hidden":!0,children:[3,9,15].map(e=>b("g",{children:[a("circle",{cx:"3",cy:e,r:"1.6"}),a("circle",{cx:"9",cy:e,r:"1.6"})]},e))})})]},t.id))})]}),a("span",{id:`${z}-help`,className:"rol-sr",children:"Press Space to pick up, arrow keys to move, Space to drop."}),a("span",{className:"rol-sr","aria-live":"assertive",children:Y})]})]})}function H(p,h){return h*(1-1/(p/h+1))}function X(p){if(p.length<2)return 0;let[h,N]=p[0],[E,o]=p[p.length-1],M=E-h;return M>0&&M<160?(o-N)/M:0}var Z=`
.rol {
  width: 320px;
  max-width: 100%;
  box-sizing: border-box;
  padding: 6px 8px 8px;
  border-radius: 22px;
  background: #fdfbf6;
  color: #0b1f3a;
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(11 31 58 / .07),
    0 1px 2px rgb(11 31 58 / .06),
    0 24px 48px -28px rgb(11 31 58 / .45);
}
.rol-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 10px 10px 10px 12px;
}
.rol-head strong { font-size: 15px; font-weight: 650; letter-spacing: -0.015em; }
.rol-head span {
  font: 500 10.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: rgb(11 31 58 / .45);
}
.rol-body { display: grid; grid-template-columns: 22px minmax(0, 1fr); }
.rol-ranks, .rol-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 4px; }
.rol-ranks li {
  height: 44px;
  display: grid;
  place-items: center;
  font: 500 11px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  color: rgb(11 31 58 / .32);
  transition: color 160ms ease, transform 260ms cubic-bezier(.3, 1.4, .5, 1);
}
.rol-ranks li[data-aim="true"] { color: var(--tone); transform: scale(1.25); font-weight: 700; }

.rol-row {
  --s: 0;
  --dy: 0px;
  position: relative;
  height: 44px;
  box-sizing: border-box;
  display: grid;
  /* minmax(0, \u2026): a long title ellipsizes instead of pushing the row out of the card */
  grid-template-columns: 8px minmax(0, 1fr) auto 32px;
  align-items: center;
  gap: 10px;
  padding: 0 4px 0 12px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(11 31 58 / .07), 0 1px 1px rgb(11 31 58 / .04);
  transform: translateY(calc(var(--s) * 48px));
  transition: transform 240ms cubic-bezier(.2, .8, .3, 1), box-shadow 240ms ease;
  z-index: 1;
}
.rol-row[data-lifted="true"] {
  z-index: 3;
  transform: translateY(var(--dy)) scale(1.02);
  transition: box-shadow 200ms ease;
  box-shadow:
    0 0 0 1.5px var(--tone),
    0 2px 4px rgb(11 31 58 / .08),
    0 18px 32px -14px rgb(11 31 58 / .42);
}
.rol-row[data-lifted="true"]:not([data-kbd="true"]) { transform: translateY(var(--dy)) scale(1.02) rotate(-.6deg); }
.rol-row[data-kbd="true"] { transition: transform 240ms cubic-bezier(.2, .8, .3, 1), box-shadow 200ms ease; }
.rol-row[data-landing="true"] { z-index: 2; }
.rol-dot { width: 8px; height: 8px; border-radius: 3px; background: var(--c); }
.rol-title {
  font-size: 14px;
  font-weight: 550;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rol-tag {
  font: 500 10px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .04em;
  text-transform: uppercase;
  color: rgb(11 31 58 / .42);
}
.rol-handle {
  width: 32px;
  height: 36px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: rgb(11 31 58 / .32);
  cursor: grab;
  touch-action: none;
  transition: color 150ms ease, background-color 150ms ease;
}
.rol-handle svg { fill: currentColor; }
.rol-handle:hover, .rol-row[data-lifted="true"] .rol-handle {
  color: var(--tone);
  background: color-mix(in srgb, var(--tone) 9%, transparent);
}
.rol-row[data-lifted="true"] .rol-handle { cursor: grabbing; }
.rol-handle:focus-visible { outline: 2px solid var(--tone); outline-offset: -2px; }
.rol-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .rol-row, .rol-row[data-kbd="true"], .rol-ranks li { transition: none; }
  .rol-row[data-lifted="true"] { transform: translateY(var(--dy)); }
}
`;export{W as default};
