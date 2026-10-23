"use client";
/* Construct · Design library: the compiled preview of "Prompt input". The source is for members. */
import{useEffect as y,useId as _,useLayoutEffect as R,useRef as v,useState as c}from"react";import{Fragment as X,jsx as i,jsxs as o}from"react/jsx-runtime";var W=typeof window>"u"?y:R,j=["Summarise this thread in three bullets","Draft a reply to Marco, friendly but firm","Turn these notes into a launch checklist","Find the bug in my checkout flow"],T=["launch-notes.md","checkout.tsx","q3-numbers.csv"],r=24,k=6,q=1500;function O({tone:h="#2b44c4",surface:s="light",prompts:p=j,files:C=["launch-notes.md"],onSend:I,onStop:Y}){let[l,w]=c(""),[m,g]=c(()=>C.map(e=>({name:e}))),[a,u]=c(!1),[f,D]=c(null),[z,P]=c(0),[b,$]=c(r),N=v(null),x=v(null),M=v(null),S=_(),d=l.trim()==="";W(()=>{let e=N.current;e&&$(Math.min(r*k,Math.max(r,e.offsetHeight)))},[l]),y(()=>{if(!d||a||p.length<2)return;let e=setInterval(()=>P(t=>(t+1)%p.length),2800);return()=>clearInterval(e)},[d,a,p.length]),y(()=>{if(!a)return;let e=setTimeout(()=>u(!1),q);return()=>clearTimeout(e)},[a]);let L=()=>{if(a||d)return;let e=l.trim();I?.(e,m.filter(n=>!n.leaving).map(n=>n.name));let t=M.current?.offsetTop??12;D(n=>({text:l,n:(n?.n??0)+1,top:t})),w(""),u(!0)},A=()=>{u(!1),Y?.(),x.current?.focus()},H=e=>{e.key==="Enter"&&!e.shiftKey&&!e.nativeEvent.isComposing&&(e.preventDefault(),L())},F=()=>{let e=T.find(t=>!m.some(n=>n.name===t));e&&g(t=>[...t,{name:e}])},K=e=>{g(t=>t.map(n=>n.name===e?{...n,leaving:!0}:n)),setTimeout(()=>g(t=>t.filter(n=>n.name!==e)),170),x.current?.focus()},E=T.some(e=>!m.some(t=>t.name===e)),B=a?"stop":d?"empty":"ready";return o(X,{children:[i("style",{children:U}),o("div",{className:"pi","data-surface":s,"data-busy":a,style:{"--tone":h},children:[m.length>0&&i("ul",{className:"pi-chips","aria-label":"Attached files",children:m.map(e=>o("li",{className:"pi-chip","data-leaving":e.leaving||void 0,children:[i(V,{name:e.name}),i("span",{className:"pi-chip-name",children:e.name}),i("button",{type:"button",className:"pi-chip-x","aria-label":`Remove ${e.name}`,onClick:()=>K(e.name),children:i("svg",{width:"10",height:"10",viewBox:"0 0 10 10","aria-hidden":!0,children:i("path",{d:"M2 2l6 6M8 2l-6 6",stroke:"currentColor",strokeWidth:"1.6",strokeLinecap:"round"})})})]},e.name))}),o("div",{ref:M,className:"pi-field",style:{height:b},children:[i("textarea",{ref:x,className:"pi-area",rows:1,value:l,onChange:e=>w(e.target.value),onKeyDown:H,"aria-label":"Message","aria-describedby":`${S}-k`,style:{height:b,overflowY:b>=r*k?"auto":"hidden"}}),i("div",{ref:N,className:"pi-mirror","aria-hidden":!0,children:l+"\u200B"}),i("div",{className:"pi-ph","aria-hidden":!0,"data-hide":!d||a,children:p.map((e,t)=>i("span",{className:"pi-ph-line","data-state":t===z?"in":t===(z-1+p.length)%p.length?"out":"wait",children:e},e))})]}),f&&i("div",{className:"pi-ghost",style:{top:f.top},"aria-hidden":!0,children:f.text},f.n),o("div",{className:"pi-bar",children:[i("button",{type:"button",className:"pi-tool","aria-label":"Attach a file","aria-disabled":!E,onClick:E?F:void 0,children:i("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:i("path",{d:"M20.5 11.5l-8.2 8.2a5.2 5.2 0 0 1-7.4-7.4l8.6-8.6a3.5 3.5 0 0 1 4.9 4.9l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9"})})}),o("div",{className:"pi-status",children:[o("span",{className:"pi-keys",id:`${S}-k`,"data-show":!a,children:[i("kbd",{children:"Shift"}),i("kbd",{children:"\u21B5"})," new line"]}),i("span",{className:"pi-thinking","data-show":a,"aria-live":"polite",children:a?"Thinking":""})]}),o("button",{type:"button",className:"pi-send","data-state":B,"aria-label":a?"Stop":"Send message","aria-disabled":!a&&d,onClick:a?A:L,children:[i("span",{className:"pi-send-fill","aria-hidden":!0}),i("svg",{className:"pi-ring",viewBox:"0 0 48 48","aria-hidden":!0,children:i("circle",{cx:"24",cy:"24",r:"22"})}),i("svg",{className:"pi-arrow",width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.4",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:i("path",{d:"M12 19V5M5.5 11.5L12 5l6.5 6.5"})}),i("span",{className:"pi-stop","aria-hidden":!0})]})]})]})]})}function V({name:h}){let s=(h.split(".").pop()??"").toLowerCase();return i("span",{className:"pi-tag",style:{background:s==="md"?"#2b44c4":s==="csv"?"#1e6a48":s==="tsx"||s==="ts"?"#e09a2b":"#d8452f"},"aria-hidden":!0,children:s.slice(0,3)})}var U=`
.pi {
  --bg: #fff;
  --fg: #0b1f3a;
  --muted: color-mix(in srgb, #0b1f3a 42%, transparent);
  --line: color-mix(in srgb, #0b1f3a 11%, transparent);
  --chip: color-mix(in srgb, #0b1f3a 5%, transparent);
  --idle: color-mix(in srgb, #0b1f3a 7%, transparent);
  --idle-fg: color-mix(in srgb, #0b1f3a 32%, transparent);
  position: relative;
  box-sizing: border-box;
  width: 380px;
  max-width: 100%;
  padding: 12px 12px 10px;
  border-radius: 22px;
  background: var(--bg);
  color: var(--fg);
  font-family: inherit;
  text-align: left;
  box-shadow:
    0 0 0 1px var(--line),
    0 1px 2px color-mix(in srgb, #0b1f3a 6%, transparent),
    0 12px 32px -14px color-mix(in srgb, #0b1f3a 26%, transparent);
  transition: box-shadow 220ms ease;
}
.pi[data-surface="dark"] {
  --bg: #0b1f3a;
  --fg: #faf8f2;
  --muted: color-mix(in srgb, #faf8f2 46%, transparent);
  --line: color-mix(in srgb, #faf8f2 12%, transparent);
  --chip: color-mix(in srgb, #faf8f2 8%, transparent);
  --idle: color-mix(in srgb, #faf8f2 10%, transparent);
  --idle-fg: color-mix(in srgb, #faf8f2 38%, transparent);
  box-shadow:
    0 0 0 1px #0b1f3a,
    inset 0 1px 0 color-mix(in srgb, #faf8f2 10%, transparent),
    0 14px 34px -14px color-mix(in srgb, #0b1f3a 60%, transparent);
}
.pi:focus-within {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--tone) 55%, var(--line)),
    0 0 0 4px color-mix(in srgb, var(--tone) 13%, transparent),
    0 12px 32px -14px color-mix(in srgb, #0b1f3a 26%, transparent);
}

/* chips */
.pi-chips { position: relative; z-index: 1; display: flex; flex-wrap: wrap; gap: 6px; margin: 0 0 8px; padding: 0; list-style: none; }
.pi-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 30px;
  padding: 0 4px 0 5px;
  border-radius: 10px;
  background: linear-gradient(var(--chip), var(--chip)), var(--bg);
  box-shadow: inset 0 0 0 1px var(--line);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  animation: pi-chip-in 360ms cubic-bezier(.3, 1.4, .5, 1) both;
  transition: opacity 160ms ease, transform 160ms ease;
}
.pi-chip[data-leaving] { opacity: 0; transform: scale(.85); }
@keyframes pi-chip-in { from { opacity: 0; transform: scale(.7) translateY(4px); } }
.pi-tag {
  display: inline-grid;
  place-items: center;
  height: 20px;
  min-width: 26px;
  padding: 0 4px;
  border-radius: 5px;
  color: #fff;
  font: 700 9px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .04em;
  text-transform: uppercase;
  box-sizing: border-box;
}
.pi-chip-name { max-width: 150px; overflow: hidden; text-overflow: ellipsis; }
.pi-chip-x {
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}
.pi-chip-x svg { display: block; }
.pi-chip-x:hover { background: var(--idle); color: var(--fg); }
.pi-chip-x:focus-visible { outline: 2px solid var(--tone); outline-offset: 1px; }

/* the field */
.pi-field {
  position: relative;
  overflow: hidden;
  margin: 0 4px;
  transition: height 240ms cubic-bezier(.2, .9, .3, 1);
}
.pi-area, .pi-mirror {
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 0;
  font: inherit;
  font-size: 15px;
  line-height: ${r}px;
  letter-spacing: -0.005em;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.pi-area {
  display: block;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  color: var(--fg);
  caret-color: var(--tone);
  scrollbar-width: thin;
}
.pi-mirror { position: absolute; top: 0; left: 0; visibility: hidden; pointer-events: none; }

/* the rolling placeholder */
.pi-ph { position: absolute; inset: 0 0 auto 0; height: ${r}px; pointer-events: none; transition: opacity 120ms ease; }
.pi-ph[data-hide="true"] { opacity: 0; transition-duration: 60ms; }
.pi-ph-line {
  position: absolute;
  inset: 0;
  overflow: hidden;
  font-size: 15px;
  line-height: ${r}px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--muted);
  opacity: 0;
  transform: translateY(70%);
  filter: blur(2px);
  transition: transform 520ms cubic-bezier(.2, .9, .3, 1.1), opacity 420ms ease, filter 420ms ease;
}
.pi-ph-line[data-state="in"] { opacity: 1; transform: none; filter: none; transition-delay: 90ms; }
.pi-ph-line[data-state="out"] { transform: translateY(-70%); transition-duration: 300ms; transition-timing-function: cubic-bezier(.5, 0, .9, .5); }

/* the sent text lifting away */
.pi-ghost {
  position: absolute;
  left: 16px;
  right: 16px;
  max-height: ${r*k}px;
  overflow: hidden;
  font-size: 15px;
  line-height: ${r}px;
  white-space: pre-wrap;
  color: var(--fg);
  pointer-events: none;
  z-index: 0;
  animation: pi-lift 460ms cubic-bezier(.2, .7, .3, 1) forwards;
}
@keyframes pi-lift {
  0% { opacity: 1; transform: none; filter: none; }
  100% { opacity: 0; transform: translateY(-24px) scale(.97); filter: blur(4px); }
}

/* the bar */
.pi-bar { display: flex; align-items: center; gap: 8px; margin-top: 10px; }
.pi-tool {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease, transform 200ms cubic-bezier(.3, 1.4, .5, 1);
}
.pi-tool svg { display: block; }
.pi-tool:hover { background: var(--idle); color: var(--fg); }
.pi-tool:active { transform: scale(.94); }
.pi-tool[aria-disabled="true"] { opacity: .4; cursor: default; }
.pi-tool:focus-visible, .pi-send:focus-visible { outline: 2px solid var(--tone); outline-offset: 2px; }

.pi-status { position: relative; flex: 1; height: 20px; min-width: 0; }
.pi-keys, .pi-thinking {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  font-size: 12px;
  white-space: nowrap;
  color: var(--muted);
  transition: opacity 200ms ease, transform 260ms cubic-bezier(.2, .9, .3, 1);
}
.pi-keys { opacity: 0; transform: translateY(3px); }
.pi:focus-within .pi-keys[data-show="true"] { opacity: 1; transform: none; }
.pi-keys kbd {
  display: inline-grid;
  place-items: center;
  height: 18px;
  min-width: 18px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 5px;
  background: var(--chip);
  box-shadow: inset 0 0 0 1px var(--line);
  font: 500 10.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  color: var(--fg);
}
.pi-keys kbd + kbd { margin-right: 3px; }
.pi-thinking {
  opacity: 0;
  transform: translateY(4px);
  font-size: 13px;
  font-weight: 500;
  padding-right: 4px;
  color: transparent;
  background: linear-gradient(100deg, var(--muted) 35%, var(--fg) 50%, var(--muted) 65%) 0 0 / 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
}
.pi-thinking[data-show="true"] { opacity: 1; transform: none; animation: pi-sheen 1.3s linear infinite; }
@keyframes pi-sheen { from { background-position: 100% 0; } to { background-position: -50% 0; } }

/* the send button: idle \u2192 ready (fills) \u2192 stop (arrow flies, square lands) */
.pi-send {
  position: relative;
  display: grid;
  place-items: center;
  flex: none;
  width: 36px;
  height: 36px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--idle);
  color: var(--idle-fg);
  cursor: pointer;
  transition: transform 220ms cubic-bezier(.3, 1.4, .5, 1), color 200ms ease;
}
.pi-send[data-state="empty"] { cursor: default; }
.pi-send:not([data-state="empty"]):active { transform: scale(.92); }
.pi-send > * { grid-area: 1 / 1; }
.pi-send-fill {
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: var(--tone);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .22), 0 6px 14px -6px var(--tone);
  opacity: 0;
  transform: scale(.4);
  transition: transform 260ms cubic-bezier(.5, 0, .7, .4), opacity 160ms ease;
}
.pi-send:not([data-state="empty"]) { color: #fff; }
.pi-send:not([data-state="empty"]) .pi-send-fill {
  opacity: 1;
  transform: none;
  transition: transform 420ms cubic-bezier(.3, 1.5, .5, 1), opacity 120ms ease;
}
.pi-arrow {
  position: relative;
  display: block;
  transform: translateY(1px) scale(.92);
  transition: transform 380ms cubic-bezier(.3, 1.5, .5, 1), opacity 160ms ease;
}
.pi-send[data-state="ready"] .pi-arrow { transform: none; }
.pi-send[data-state="stop"] .pi-arrow {
  opacity: 0;
  transform: translateY(-22px);
  transition: transform 300ms cubic-bezier(.5, 0, .8, .3), opacity 220ms 60ms ease;
}
.pi-stop {
  position: relative;
  width: 11px;
  height: 11px;
  border-radius: 3px;
  background: #fff;
  opacity: 0;
  transform: scale(0) rotate(-45deg);
  transition: transform 160ms ease, opacity 120ms ease;
}
.pi-send[data-state="stop"] .pi-stop {
  opacity: 1;
  transform: none;
  transition: transform 460ms 140ms cubic-bezier(.3, 1.6, .5, 1), opacity 120ms 140ms ease;
}
.pi-ring {
  position: absolute;
  inset: -6px;
  width: 48px;
  height: 48px;
  overflow: visible;
  opacity: 0;
  transform: scale(.8);
  transition: opacity 160ms ease, transform 200ms ease;
}
.pi-ring circle {
  fill: none;
  stroke: var(--tone);
  stroke-width: 2.25;
  stroke-linecap: round;
  stroke-dasharray: 46 92;
  transform-origin: 24px 24px;
}
.pi-send[data-state="stop"] .pi-ring { opacity: 1; transform: none; transition: opacity 200ms 120ms ease, transform 420ms 120ms cubic-bezier(.3, 1.4, .5, 1); }
.pi-send[data-state="stop"] .pi-ring circle { animation: pi-spin 900ms linear infinite; }
@keyframes pi-spin { to { transform: rotate(360deg); } }

@media (prefers-reduced-motion: reduce) {
  .pi-ph-line { transform: none !important; filter: none !important; transition: opacity 300ms ease; }
  .pi-field { transition: none; }
  .pi-ghost { animation: pi-fade 200ms ease forwards; }
  @keyframes pi-fade { to { opacity: 0; } }
  .pi-chip { animation: none; }
  .pi-send, .pi-send *, .pi-tool, .pi-keys, .pi-thinking { transition-duration: 1ms !important; transition-delay: 0ms !important; }
  .pi-thinking[data-show="true"] { animation: none; color: var(--muted); }
  .pi-send[data-state="stop"] .pi-ring circle { animation-duration: 2.4s; }
}
`;export{O as default};
