"use client";
/* Construct · Design library: the compiled preview of "Thinking shimmer". The source is for members. */
import{useEffect as v,useId as z,useRef as S,useState as g}from"react";import{Fragment as T,jsx as t,jsxs as s}from"react/jsx-runtime";var M=["Reading your files","Planning the change","Writing code","Checking it"];function P({tone:w="#0b1f3a",speed:n=1800,steps:p=M,active:d}){let[i,y]=g(-1),[b,x]=g(0),[l,N]=g(!1),h=S(0),u=z(),r=p.length,o=d??i,c=o>=r;v(()=>{if(d!==void 0)return;let a=setTimeout(()=>y(e=>e>=r?-1:e+1),i>=r?2200:i===-1?Math.max(900,n*.8):n);return()=>clearTimeout(a)},[i,n,r,d]),v(()=>{if((o===-1||h.current===0)&&(h.current=performance.now(),x(0)),c)return;let a=setInterval(()=>x(Math.floor((performance.now()-h.current)/1e3)),250);return()=>clearInterval(a)},[o,c]);let k=["Thinking",...p,"Done"],m=Math.min(r+1,o+1);return s(T,{children:[t("style",{children:C}),s("div",{className:"tsh","data-done":c,style:{"--tone":w,"--speed":`${n}ms`},children:[s("div",{className:"tsh-head",children:[s("span",{className:"tsh-icon","aria-hidden":!0,children:[s("svg",{className:"tsh-spin",width:"18",height:"18",viewBox:"0 0 18 18",children:[t("circle",{cx:"9",cy:"9",r:"7"}),t("circle",{className:"tsh-arc",cx:"9",cy:"9",r:"7"})]}),s("svg",{className:"tsh-ok",width:"18",height:"18",viewBox:"0 0 18 18",children:[t("circle",{cx:"9",cy:"9",r:"9"}),t("path",{d:"M5.2 9.3l2.5 2.5 5.1-5.4"})]})]}),t("span",{className:"tsh-roll","aria-hidden":!0,children:k.map((a,e)=>t("span",{className:"tsh-label","data-state":e===m?"in":e<m?"out":"wait",children:a},e))}),s("span",{className:"tsh-time","aria-hidden":!0,children:[b,"s"]})]}),t("span",{className:"tsh-sr",role:"status","aria-live":"polite",children:c?`Done in ${b} seconds`:k[m]}),s("button",{type:"button",className:"tsh-toggle","aria-expanded":l,"aria-controls":`${u}-list`,onClick:()=>N(a=>!a),children:[l?"Hide steps":"Show steps",t("svg",{width:"12",height:"12",viewBox:"0 0 12 12","aria-hidden":!0,children:t("path",{d:"M3 4.5l3 3 3-3"})})]}),t("div",{className:"tsh-drawer","data-open":l,children:t("ol",{className:"tsh-steps",id:`${u}-list`,"aria-label":"Steps","aria-hidden":!l,children:p.map((a,e)=>{let f=e<o?"done":e===o?"now":"next";return s("li",{className:"tsh-step","data-state":f,style:{"--i":e},children:[t("span",{className:"tsh-dot","aria-hidden":!0,children:s("svg",{width:"16",height:"16",viewBox:"0 0 16 16",children:[t("circle",{className:"tsh-dot-ring",cx:"8",cy:"8",r:"6.5"}),t("circle",{className:"tsh-dot-arc",cx:"8",cy:"8",r:"6.5"}),t("circle",{className:"tsh-dot-fill",cx:"8",cy:"8",r:"8"}),t("path",{className:"tsh-dot-check",d:"M4.7 8.2l2.2 2.2 4.4-4.7"})]})}),t("span",{className:"tsh-step-text",children:a}),t("span",{className:"tsh-sr",children:f==="done"?", done":f==="now"?", in progress":", to do"})]},e)})})})]})]})}var C=`
.tsh {
  --ink: #0b1f3a;
  --base: color-mix(in srgb, var(--tone) 82%, #fff);
  --shine: color-mix(in srgb, var(--tone) 18%, #fff);
  --line: color-mix(in srgb, #0b1f3a 10%, transparent);
  position: relative;
  box-sizing: border-box;
  width: 300px;
  max-width: 100%;
  padding: 14px 16px 10px;
  border-radius: 18px;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  text-align: left;
  box-shadow:
    0 0 0 1px var(--line),
    0 1px 2px color-mix(in srgb, #0b1f3a 6%, transparent),
    0 14px 30px -16px color-mix(in srgb, #0b1f3a 30%, transparent);
}

.tsh-head { display: flex; align-items: center; gap: 10px; height: 24px; }

/* spinner \u2194 check */
.tsh-icon { position: relative; display: grid; flex: none; width: 18px; height: 18px; }
.tsh-icon svg { grid-area: 1 / 1; display: block; overflow: visible; }
.tsh-spin circle { fill: none; stroke: color-mix(in srgb, var(--tone) 16%, transparent); stroke-width: 2; }
.tsh-spin .tsh-arc {
  stroke: var(--tone);
  stroke-linecap: round;
  stroke-dasharray: 12 44;
  transform-origin: 9px 9px;
  animation: tsh-turn 900ms linear infinite;
}
.tsh-spin { transition: opacity 200ms ease, transform 260ms ease; }
@keyframes tsh-turn { to { transform: rotate(360deg); } }
.tsh-ok { opacity: 0; transform: scale(.4); transition: opacity 120ms ease, transform 200ms ease; }
.tsh-ok circle { fill: var(--tone); }
.tsh-ok path { fill: none; stroke: #fff; stroke-width: 1.9; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 12; stroke-dashoffset: 12; }
.tsh[data-done="true"] .tsh-spin { opacity: 0; transform: scale(.6); }
.tsh[data-done="true"] .tsh-ok { opacity: 1; transform: none; transition: opacity 160ms ease, transform 420ms cubic-bezier(.3, 1.6, .5, 1); }
.tsh[data-done="true"] .tsh-ok path { stroke-dashoffset: 0; transition: stroke-dashoffset 320ms 140ms cubic-bezier(.6, 0, .2, 1); }

/* the rolling label, with a sweep of light through it */
.tsh-roll { position: relative; flex: 1; min-width: 0; height: 24px; overflow: hidden; }
.tsh-label {
  position: absolute;
  inset: 0;
  overflow: hidden;
  font-size: 15px;
  font-weight: 560;
  letter-spacing: -0.01em;
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: transparent;
  background: linear-gradient(90deg, var(--base) 0%, var(--base) 36%, var(--shine) 50%, var(--base) 64%, var(--base) 100%) 0 0 / 280% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  animation: tsh-sweep 1.9s cubic-bezier(.45, .05, .55, .95) infinite;
  opacity: 0;
  transform: translateY(100%);
  filter: blur(2px);
  transition: transform 180ms cubic-bezier(.5, 0, .9, .5), opacity 140ms ease, filter 180ms ease;
}
/* the old step leaves fast; the new one rises in just after it, with a little overshoot */
.tsh-label[data-state="in"] {
  opacity: 1;
  transform: none;
  filter: none;
  transition: transform 520ms 110ms cubic-bezier(.2, .9, .3, 1.15), opacity 320ms 110ms ease, filter 320ms 110ms ease;
}
.tsh-label[data-state="out"] { transform: translateY(-100%); }
@keyframes tsh-sweep { from { background-position: 100% 0; } to { background-position: 0% 0; } }
.tsh[data-done="true"] .tsh-label { animation: none; color: var(--ink); background: none; }

.tsh-time {
  flex: none;
  min-width: 30px;
  padding: 2px 6px;
  border-radius: 6px;
  background: color-mix(in srgb, #0b1f3a 5%, transparent);
  font: 500 12px/16px ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: color-mix(in srgb, #0b1f3a 55%, transparent);
  box-sizing: border-box;
}

/* show / hide */
.tsh-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  margin: 6px 0 0 22px;
  padding: 0 6px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: color-mix(in srgb, #0b1f3a 55%, transparent);
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}
.tsh-toggle:hover { background: color-mix(in srgb, #0b1f3a 5%, transparent); color: var(--ink); }
.tsh-toggle:focus-visible { outline: 2px solid var(--tone); outline-offset: 1px; }
.tsh-toggle svg { display: block; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; transition: transform 300ms cubic-bezier(.3, 1.4, .5, 1); }
.tsh-toggle[aria-expanded="true"] svg { transform: rotate(180deg); }

.tsh-drawer { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 340ms cubic-bezier(.2, .9, .3, 1); }
.tsh-drawer[data-open="true"] { grid-template-rows: 1fr; }
.tsh-steps { min-height: 0; overflow: hidden; margin: 0; padding: 0; list-style: none; }
.tsh-steps::before { content: ""; display: block; height: 6px; margin: 0 0 6px; border-bottom: 1px solid var(--line); }

.tsh-step {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 30px;
  padding-left: 1px;
  font-size: 14px;
  white-space: nowrap;
  color: color-mix(in srgb, #0b1f3a 45%, transparent);
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 200ms ease, transform 200ms ease, color 240ms ease;
}
.tsh-drawer[data-open="true"] .tsh-step {
  opacity: 1;
  transform: none;
  transition: opacity 300ms calc(60ms + var(--i) * 45ms) ease, transform 420ms calc(60ms + var(--i) * 45ms) cubic-bezier(.3, 1.3, .5, 1), color 240ms ease;
}
.tsh-step[data-state="done"] { color: color-mix(in srgb, #0b1f3a 72%, transparent); }
.tsh-step[data-state="now"] { color: var(--ink); font-weight: 560; }
.tsh-step-text { overflow: hidden; text-overflow: ellipsis; }

.tsh-dot { display: grid; flex: none; }
.tsh-dot svg { display: block; overflow: visible; }
.tsh-dot-ring { fill: none; stroke: color-mix(in srgb, #0b1f3a 22%, transparent); stroke-width: 1.5; stroke-dasharray: 2.2 2.9; transition: opacity 200ms ease; }
.tsh-dot-arc { fill: none; stroke: var(--tone); stroke-width: 1.8; stroke-linecap: round; stroke-dasharray: 10 31; transform-origin: 8px 8px; opacity: 0; transition: opacity 160ms ease; }
.tsh-dot-fill { fill: var(--tone); transform-origin: 8px 8px; transform: scale(0); transition: transform 180ms ease; }
.tsh-dot-check { fill: none; stroke: #fff; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; stroke-dasharray: 11; stroke-dashoffset: 11; transition: stroke-dashoffset 120ms ease; }

.tsh-step[data-state="now"] .tsh-dot-ring { stroke-dasharray: none; stroke: color-mix(in srgb, var(--tone) 16%, transparent); }
.tsh-step[data-state="now"] .tsh-dot-arc { opacity: 1; animation: tsh-turn 900ms linear infinite; }
.tsh-step[data-state="done"] .tsh-dot-ring { opacity: 0; }
.tsh-step[data-state="done"] .tsh-dot-fill { transform: none; transition: transform 380ms cubic-bezier(.3, 1.6, .5, 1); }
.tsh-step[data-state="done"] .tsh-dot-check { stroke-dashoffset: 0; transition: stroke-dashoffset 300ms 120ms cubic-bezier(.6, 0, .2, 1); }

.tsh-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .tsh-label { animation: none; color: var(--tone); background: none; transform: none !important; filter: none !important; transition: opacity 200ms ease; }
  .tsh-spin .tsh-arc, .tsh-step[data-state="now"] .tsh-dot-arc { animation-duration: 2.4s; }
  .tsh-drawer, .tsh-step, .tsh-toggle svg, .tsh-ok, .tsh-dot-fill { transition-duration: 1ms !important; transition-delay: 0ms !important; }
}
`;export{P as default};
