"use client";
/* Construct · Design library: the compiled preview of "Avatar stack". The source is for members. */
import{useEffect as C,useRef as L,useState as g}from"react";import{Fragment as Y,jsx as i,jsxs as m}from"react/jsx-runtime";var A=[{name:"Maya Chen",role:"Design"},{name:"Jonas Weber",role:"Engineering"},{name:"Sofia Ruiz",role:"Product"},{name:"Kwame Mensah",role:"Growth"},{name:"Elena Rossi",role:"Support"}],s="#0b1f3a",n="#faf8f2";function D(e){return e.toLowerCase()==="#d8452f"?[["#d8452f",n],["#2b44c4",n],["#e09a2b",s],["#1e6a48",n],[s,n]]:[[e,n],[`color-mix(in srgb, ${e} 58%, ${s})`,n],[`color-mix(in srgb, ${e} 30%, ${n})`,s],[`color-mix(in srgb, ${e} 34%, ${s})`,n],[`color-mix(in srgb, ${e} 62%, ${n})`,s]]}var R=e=>e.split(/\s+/).filter(Boolean).map(r=>r[0]).slice(0,2).join("").toUpperCase(),y={sm:34,md:44,lg:56};function F({people:e=A,more:r=12,caption:h="Maya, Jonas and 15 others are here",tone:k="#d8452f",size:$="md",ring:z="#f3eee6"}){let f=L(null),[d,P]=g(null),[b,S]=g(0),[l,x]=g(!1),w=D(k),E=y[$]??y.md,p=e.length+(r>0?1:0),N=(p-1)/2,o=t=>{P(t),t!==null&&S(t)};C(()=>{if(!l)return;let t=a=>{f.current?.contains(a.target)||(x(!1),o(null))};return document.addEventListener("pointerdown",t),()=>document.removeEventListener("pointerdown",t)},[l]);let u=(t=>t<e.length?{name:e[t].name,role:e[t].role}:{name:`${r} more`,role:"View everyone"})(Math.min(b,p-1));return m(Y,{children:[i("style",{children:X}),m("div",{ref:f,className:"av","data-open":l||d!==null,style:{"--s":`${E}px`,"--n":p,"--mid":N,"--ring":z,"--hi":b},onPointerLeave:t=>{if(t.pointerType==="touch")return;let a=document.activeElement;a&&f.current?.contains(a)&&a.matches(":focus-visible")||o(null)},onBlur:t=>{!t.currentTarget.contains(t.relatedTarget)&&!l&&o(null)},children:[m("div",{className:"av-row",role:"group","aria-label":`${e.length+Math.max(0,r)} members`,children:[m("span",{className:"av-tip","data-show":d!==null,"aria-hidden":!0,children:[i("span",{className:"av-tip-name",children:u.name}),u.role&&i("span",{className:"av-tip-role",children:u.role})]}),Array.from({length:p},(t,a)=>{let v=a>=e.length,[M,T]=v?["",""]:w[a%w.length];return i("button",{type:"button",className:"av-face","data-more":v||void 0,"data-active":d===a,"aria-label":v?`${r} more members, view everyone`:`${e[a].name}${e[a].role?`, ${e[a].role}`:""}`,style:{"--i":a,"--bg":M,"--fg":T},onPointerEnter:c=>c.pointerType!=="touch"&&o(a),onPointerDown:c=>{c.pointerType==="touch"&&(x(!0),o(a))},onFocus:c=>c.currentTarget.matches(":focus-visible")&&o(a),children:i("span",{className:"av-in",children:v?`+${r}`:R(e[a].name)})},a)})]}),h&&i("p",{className:"av-cap",children:h})]})]})}var X=`
.av {
  --s: 44px;
  --ring: #f3eee6;
  --ink: #0b1f3a;
  --cream: #faf8f2;
  /* Distance between face centres, closed and open. */
  --step-closed: calc(var(--s) * .86);
  --step-open: calc(var(--s) * 1.16);
  --step: var(--step-closed);
  display: grid;
  justify-items: center;
  gap: 18px;
  -webkit-tap-highlight-color: transparent;
}
.av[data-open="true"] { --step: var(--step-open); }
@media (hover: hover) { .av:has(.av-row:hover) { --step: var(--step-open); } }

/* Wide enough for the open fan, so opening never shifts the layout. */
.av-row {
  position: relative;
  width: calc(var(--step-open) * (var(--n) - 1) + var(--s) + 12px);
  height: calc(var(--s) + 12px);
  margin-top: 46px;
}

.av-face {
  position: absolute; left: 50%; top: 6px;
  width: var(--s); height: var(--s);
  margin-left: calc(var(--s) / -2);
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  font: inherit;
  cursor: pointer;
  z-index: calc(10 - var(--i));
  transform: translateX(calc((var(--i) - var(--mid)) * var(--step)));
  /* Fan out left to right, one after another; tuck in all together, quicker. */
  transition: transform 420ms cubic-bezier(.3, 1.35, .5, 1) calc(var(--i) * 28ms);
}
.av:not([data-open="true"]) .av-face { transition: transform 260ms cubic-bezier(.4, 0, .2, 1); }
@media (hover: hover) { .av:has(.av-row:hover) .av-face { transition: transform 420ms cubic-bezier(.3, 1.35, .5, 1) calc(var(--i) * 28ms); } }

/* The face itself: the button above is only the hit area, so it can lift. */
.av-in {
  display: grid; place-items: center;
  width: 100%; height: 100%;
  border-radius: 50%;
  background: var(--bg);
  color: var(--fg);
  font-size: calc(var(--s) * .3);
  font-weight: 650;
  letter-spacing: .02em;
  font-variant-numeric: tabular-nums;
  box-shadow:
    0 0 0 3px var(--ring),
    inset 0 1px 0 rgba(255,255,255,.22),
    inset 0 -1px 0 rgba(0,0,0,.12),
    0 4px 10px -4px color-mix(in srgb, var(--ink) 45%, transparent);
  transition: transform 320ms cubic-bezier(.3, 1.5, .5, 1), box-shadow 240ms ease;
}
/* The face you're on lifts, on its own, inside the fanned row. */
.av-face[data-active="true"] { z-index: 20; }
.av-face[data-active="true"] .av-in {
  transform: translateY(-5px) scale(1.08);
  box-shadow:
    0 0 0 3px var(--ring),
    inset 0 1px 0 rgba(255,255,255,.22),
    inset 0 -1px 0 rgba(0,0,0,.12),
    0 14px 18px -8px color-mix(in srgb, var(--ink) 55%, transparent);
}

.av-face[data-more] .av-in {
  background: color-mix(in srgb, var(--ink) 12%, var(--ring));
  color: var(--ink);
  font-size: calc(var(--s) * .3);
  font-weight: 600;
  letter-spacing: 0;
}

.av-face:focus-visible { outline: none; }
.av-face:focus-visible .av-in { outline: 2px solid var(--ink); outline-offset: 5px; }

/* One tag that slides from face to face. */
.av-tip {
  position: absolute; left: 50%; bottom: calc(100% + 4px);
  z-index: 30;
  display: grid; justify-items: center;
  min-width: max-content;
  padding: 7px 11px 8px;
  border-radius: 10px;
  background: var(--ink);
  color: var(--cream);
  pointer-events: none;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(calc(-50% + (var(--hi) - var(--mid)) * var(--step-open))) translateY(6px) scale(.92);
  transform-origin: 50% 100%;
  transition: transform 380ms cubic-bezier(.3, 1.3, .5, 1), opacity 160ms ease;
  box-shadow: 0 8px 20px -10px color-mix(in srgb, var(--ink) 70%, transparent);
}
.av-tip::after {
  content: "";
  position: absolute; left: 50%; bottom: -4px;
  width: 9px; height: 9px;
  margin-left: -4.5px;
  border-radius: 2px;
  background: inherit;
  transform: rotate(45deg);
}
.av-tip[data-show="true"] {
  opacity: 1;
  transform: translateX(calc(-50% + (var(--hi) - var(--mid)) * var(--step-open))) translateY(-4px) scale(1);
  transition: transform 380ms cubic-bezier(.3, 1.3, .5, 1), opacity 140ms ease 60ms;
}
.av-tip-name { font-size: 13px; font-weight: 600; letter-spacing: -0.005em; line-height: 1.2; }
.av-tip-role {
  margin-top: 2px;
  font: 500 10px/1.2 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .06em;
  text-transform: uppercase;
  opacity: .6;
}

.av-cap {
  margin: 0;
  font-size: 13.5px;
  color: var(--ink);
  opacity: .62;
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .av .av-face, .av[data-open="true"] .av-face, .av-in, .av-tip, .av-tip[data-show="true"] { transition-duration: 1ms; transition-delay: 0ms; }
  .av:has(.av-row:hover) .av-face { transition-duration: 1ms; transition-delay: 0ms; }
}
`;export{F as default};
