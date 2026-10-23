"use client";
/* Construct · Design library: the compiled preview of "Card fan". The source is for members. */
import{useEffect as C,useId as D,useRef as H,useState as h}from"react";import{Fragment as Y,jsx as t,jsxs as r}from"react/jsx-runtime";var O=[{id:"metal",name:"Metal",last4:"4821",tone:"#141518",ink:"#f4f4f2"},{id:"debit",name:"Debit",last4:"0937",tone:"#0c5b54",ink:"#ecfffb"},{id:"travel",name:"Travel",last4:"6150",tone:"#ff6a2b",ink:"#2b0f02"},{id:"savings",name:"Savings",last4:"7302",tone:"#cfe6ff",ink:"#0a2540"}];function $({cards:N=O,count:z=4,spread:E=8,onSelect:S}){let o=N.slice(0,Math.min(4,Math.max(2,z))),c=o.length,T=o.map(e=>e.id).join("|"),[g,v]=h(()=>o.map((e,a)=>a)),[n,l]=h(!1),[x,f]=h(0),[u,k]=h(-1),d=H([]),w=D();C(()=>{v(o.map((e,a)=>a)),l(!1)},[T]),C(()=>{if(u<0)return;let e=setTimeout(()=>k(-1),560);return()=>clearTimeout(e)},[u]);let m=g.length===c?g:o.map((e,a)=>a),b=m[0],P=e=>{f(b),l(!0),e&&d.current[b]?.focus()},y=e=>{v([e,...m.filter(a=>a!==e)]),l(!1),k(e),d.current[e]?.focus(),S?.(o[e])},A=(e,a)=>{if(!n)return;let s=e.key==="ArrowRight"||e.key==="ArrowDown"?1:e.key==="ArrowLeft"||e.key==="ArrowUp"?-1:0;if(s){e.preventDefault();let i=(x+s+c)%c;f(i),d.current[i]?.focus()}else if(e.key==="Home"||e.key==="End"){e.preventDefault();let i=e.key==="Home"?0:c-1;f(i),d.current[i]?.focus()}else e.key==="Escape"?(e.preventDefault(),l(!1),d.current[b]?.focus()):(e.key==="Enter"||e.key===" ")&&(e.preventDefault(),y(a))};return r(Y,{children:[t("style",{children:R}),r("div",{className:"cfn","data-open":n,role:"group","aria-labelledby":w,style:{"--cfn-n":c},onPointerDown:e=>{n&&e.target===e.currentTarget&&l(!1)},onBlur:e=>{n&&!e.currentTarget.contains(e.relatedTarget)&&l(!1)},children:[t("span",{id:w,className:"cfn-sr",children:"Your cards"}),o.map((e,a)=>{let s=m.indexOf(a),i=a-(c-1)/2,M=n&&x===a;return t("button",{ref:p=>{d.current[a]=p},type:"button",className:"cfn-card","data-pos":s,"data-active":M,"data-picked":u===a,tabIndex:n?M?0:-1:s===0?0:-1,"aria-hidden":!n&&s!==0?!0:void 0,"aria-expanded":!n&&s===0?!1:void 0,"aria-current":s===0?"true":void 0,"aria-label":n?`${e.name} card ending ${e.last4}${s===0?", in use":""}`:`${e.name} card ending ${e.last4}. Show all ${c} cards`,style:{"--pos":s,"--slot":i,"--spread":`${E}deg`,"--tone":e.tone,"--ink":e.ink,zIndex:n?10+a:10-s},onClick:()=>n?y(a):P(!1),onPointerEnter:p=>{n&&p.pointerType==="mouse"&&f(a)},onKeyDown:p=>A(p,a),children:r("span",{className:"cfn-face","aria-hidden":!0,children:[r("span",{className:"cfn-top",children:[t("span",{className:"cfn-name",children:e.name}),t(L,{})]}),t(B,{}),r("span",{className:"cfn-bottom",children:[r("span",{className:"cfn-num",children:[t("span",{className:"cfn-dots",children:"\u2022\u2022\u2022\u2022"})," ",e.last4]}),t(K,{})]})]})},e.id)})]})]})}var B=()=>t("span",{className:"cfn-chip",children:t("svg",{width:"34",height:"26",viewBox:"0 0 34 26",fill:"none",children:t("path",{d:"M0 9h10.5M0 17h10.5M23.5 9H34M23.5 17H34M10.5 0v26M23.5 0v26M10.5 13h13",stroke:"rgba(90,60,0,.42)",strokeWidth:"1"})})}),L=()=>r("svg",{className:"cfn-wave",width:"16",height:"18",viewBox:"0 0 16 18",fill:"none",stroke:"currentColor",strokeWidth:"1.7",strokeLinecap:"round",children:[t("path",{d:"M2 6.2a4.6 4.6 0 0 1 0 5.6"}),t("path",{d:"M6 3.8a8.6 8.6 0 0 1 0 10.4"}),t("path",{d:"M10 1.4a12.6 12.6 0 0 1 0 15.2"})]}),K=()=>r("svg",{className:"cfn-net",width:"34",height:"20",viewBox:"0 0 34 20",fill:"currentColor",children:[t("path",{d:"M7 3h6l-4 14H3z",fillOpacity:".9"}),t("path",{d:"M17 3h6l-4 14h-6z",fillOpacity:".65"}),t("path",{d:"M27 3h6l-4 14h-6z",fillOpacity:".4"})]}),R=`
.cfn {
  --w: 196px;
  --h: 124px;
  position: relative;
  width: 340px;
  max-width: 100%;
  height: 250px;
  -webkit-tap-highlight-color: transparent;
}
.cfn-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.cfn-card {
  position: absolute;
  left: calc(50% - var(--w) / 2);
  top: 86px;
  width: var(--w);
  height: var(--h);
  padding: 0;
  border: 0;
  border-radius: 14px;
  background: var(--tone);
  color: var(--ink);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  /* every card turns and shrinks about its bottom edge, like a hand of cards */
  transform-origin: 50% 100%;
  /* the stack: each card behind sits a little higher and a little smaller */
  transform:
    translateY(calc(var(--pos) * -19px))
    scale(calc(1 - var(--pos) * 0.06));
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.18),
    0 1px 2px rgba(0, 0, 0, 0.18),
    0 18px 30px -16px rgba(10, 20, 30, 0.5);
  transition:
    transform 560ms cubic-bezier(.3, 1.32, .45, 1),
    box-shadow 300ms ease,
    filter 300ms ease;
  filter: brightness(calc(1 - var(--pos) * 0.06));
  overflow: hidden;
  isolation: isolate;
}
/* Cards behind the front one are only there to be seen while stacked. */
.cfn[data-open="false"] .cfn-card:not([data-pos="0"]) { pointer-events: none; }
/* A hint that the stack opens: on hover it breathes apart a little. */
@media (hover: hover) {
  .cfn[data-open="false"]:hover .cfn-card {
    transform:
      translateY(calc(var(--pos) * -23px))
      rotate(calc(var(--slot) * 1.5deg))
      scale(calc(1 - var(--pos) * 0.06));
  }
}
.cfn[data-open="false"] .cfn-card[data-pos="0"]:active { transform: scale(0.97); transition-duration: 140ms; }

/* The fan: each card slides out to its slot, dips a little toward the ends
   (slot squared, so the row arcs) and turns about its bottom edge. */
.cfn[data-open="true"] .cfn-card {
  filter: none;
  transform:
    translate(calc(var(--slot) * 50px), calc(var(--slot) * var(--slot) * 4px - 4px))
    rotate(calc(var(--slot) * var(--spread)));
  transition:
    transform 620ms cubic-bezier(.3, 1.45, .45, 1) calc((var(--slot) + 2) * 22ms),
    box-shadow 300ms ease,
    filter 300ms ease;
}
.cfn[data-open="true"] .cfn-card[data-active="true"] {
  transform:
    translate(calc(var(--slot) * 50px), calc(var(--slot) * var(--slot) * 4px - 30px))
    rotate(calc(var(--slot) * var(--spread)));
  transition: transform 380ms cubic-bezier(.3, 1.5, .5, 1), box-shadow 300ms ease;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    0 2px 4px rgba(0, 0, 0, 0.16),
    0 26px 36px -16px rgba(10, 20, 30, 0.55);
}
/* Picked: it springs up as it comes to the front, then settles. */
.cfn-card[data-picked="true"] { animation: cfn-lift 520ms cubic-bezier(.3, 1.2, .5, 1); }
@keyframes cfn-lift {
  0% { translate: 0 0; scale: 1; }
  35% { translate: 0 -16px; scale: 1.05; }
  100% { translate: 0 0; scale: 1; }
}

.cfn-card:focus-visible { outline: 2px solid #0a0a0a; outline-offset: 3px; }
/* From the keyboard the focused card comes all the way up, so its ring shows. */
.cfn[data-open="true"] .cfn-card:focus-visible { z-index: 30 !important; }

.cfn-face {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; justify-content: space-between;
  padding: 14px 16px 13px;
  /* a soft light across the face, and a little grain of depth */
  background:
    radial-gradient(120% 90% at 0% 0%, rgba(255,255,255,0.16), rgba(255,255,255,0) 55%),
    linear-gradient(160deg, rgba(255,255,255,0) 40%, rgba(0,0,0,0.12));
}
.cfn-top, .cfn-bottom { display: flex; align-items: center; justify-content: space-between; }
.cfn-name { font-size: 13px; font-weight: 650; letter-spacing: -0.005em; line-height: 1; }
.cfn-wave { display: block; opacity: 0.8; }
.cfn-chip {
  display: block; width: 34px; height: 26px; margin-top: 2px;
  border-radius: 5px; overflow: hidden;
  background: linear-gradient(135deg, #f3dc9a, #d5ad55 55%, #b48a34);
  box-shadow: inset 0 0 0 1px rgba(90, 60, 0, 0.35);
}
.cfn-chip svg { display: block; }
.cfn-num {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  line-height: 1;
  white-space: nowrap;
}
.cfn-dots { letter-spacing: 0.12em; opacity: 0.75; }
.cfn-net { display: block; }

@media (prefers-reduced-motion: reduce) {
  .cfn-card,
  .cfn[data-open="true"] .cfn-card,
  .cfn[data-open="true"] .cfn-card[data-active="true"] { transition: box-shadow 200ms ease, filter 200ms ease; }
  .cfn[data-open="false"]:hover .cfn-card { transform: translateY(calc(var(--pos) * -19px)) scale(calc(1 - var(--pos) * 0.06)); }
  .cfn-card[data-picked="true"] { animation: none; }
}
`;export{$ as default};
