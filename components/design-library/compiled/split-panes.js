"use client";
/* Construct · Design library: the compiled preview of "Split view". The source is for members. */
import{useCallback as L,useEffect as Q,useId as ne,useRef as h,useState as v}from"react";import{Fragment as de,jsx as e,jsxs as s}from"react/jsx-runtime";var x=404,D=90,V=180,te=60,P=120,z=92,m=n=>["k",n],C=n=>["f",n],H=n=>["s",n],i=n=>["p",n],l=n=>["v",n],Y=n=>["t",n],ae=[[m("import"),i(" { "),l("useState"),i(" } "),m("from"),H(' "react"'),i(";")],[],[m("export function "),C("Player"),i("({ "),l("track"),i(" }) {")],[i("  "),m("const"),i(" ["),l("on"),i(", "),l("setOn"),i("] = "),C("useState"),i("("),m("false"),i(");")],[i("  "),m("return"),i(" (")],[i("    <"),Y("button"),i(" "),l("onClick"),i("={() => "),C("setOn"),i("(!"),l("on"),i(")}>")],[i("      {"),l("on"),i(" ? "),H('"Pause"'),i(" : "),H('"Play"'),i("} {"),l("track"),i("."),l("title"),i("}")],[i("    </"),Y("button"),i(">")],[i("  );")],[i("}")]],ie=[{name:"src",kind:"dir",depth:0},{name:"App.tsx",kind:"tsx",depth:1},{name:"Player.tsx",kind:"tsx",depth:1,active:!0},{name:"Queue.tsx",kind:"tsx",depth:1},{name:"wave.ts",kind:"ts",depth:1},{name:"theme.css",kind:"css",depth:1},{name:"package.json",kind:"json",depth:0},{name:"README.md",kind:"md",depth:0}],se={tsx:"#4cc2ff",ts:"#3d8bfd",css:"#ff6b9a",json:"#ffb224",md:"#9ba1aa"};function oe({accent:n="#ffb224",sidebar:f=112,preview:$=128,onResize:I}){let u=ne(),[K,N]=v(f),[p,R]=v($),[o,k]=v(!1),[w,U]=v(null),[Z,A]=v(!1),F=h(null),g=h({x:0,side:0,prev:0,scale:1}),E=h(0),T=h(!1);Q(()=>{let t=window.matchMedia("(prefers-reduced-motion: reduce)");T.current=t.matches;let a=()=>T.current=t.matches;return t.addEventListener("change",a),()=>{t.removeEventListener("change",a),clearTimeout(E.current)}},[]);let d=o?0:K,S=Math.min(V,x-2-p-P),W=x-2-d-P,b=L(()=>{T.current||(A(!0),clearTimeout(E.current),E.current=window.setTimeout(()=>A(!1),320))},[]),j=h(I);j.current=I,Q(()=>{j.current?.({sidebar:d,preview:p})},[d,p]);let y=L((t,a)=>{let r=Math.min(V,x-2-p-P);if(t<(a?te:D)){o||b(),k(!0);return}o&&b(),k(!1),N(Math.round(Math.max(D,Math.min(r,t))))},[o,p,b]),M=L(t=>R(Math.round(Math.max(z,Math.min(x-2-d-P,t)))),[d]),B=t=>a=>{if(a.button!==0)return;a.preventDefault(),a.currentTarget.setPointerCapture(a.pointerId),a.currentTarget.focus({preventScroll:!0});let r=F.current,c=r.getBoundingClientRect().width/(r.offsetWidth||1);g.current={x:a.clientX,side:d,prev:p,scale:c},U(t)},O=t=>a=>{if(w!==t)return;let r=(a.clientX-g.current.x)/g.current.scale;t==="a"?y(g.current.side+r,!0):M(g.current.prev-r)},_=()=>U(null),X=t=>a=>{let r=a.shiftKey?32:8,c=a.key==="ArrowRight"?1:a.key==="ArrowLeft"?-1:0;if(t==="a")if(c)y((o?0:K)+c*r,!1);else if(a.key==="Home")y(0,!1);else if(a.key==="End")y(S,!1);else if(a.key==="Enter")q();else return;else if(c)M(p-c*r);else if(a.key==="Home")M(W);else if(a.key==="End")M(z);else return;a.preventDefault()},q=()=>{b(),o&&N(t=>Math.max(D,Math.min(S,t))),k(t=>!t)},G=t=>()=>{b(),t==="a"?(k(!1),N(f)):R($)};return s(de,{children:[e("style",{children:pe}),s("div",{ref:F,className:"spn","data-anim":Z,"data-drag":w??"none",style:{"--side":`${d}px`,"--prev":`${p}px`,"--accent":n},children:[s("div",{className:"spn-bar",children:[s("span",{className:"spn-lights","aria-hidden":!0,children:[e("i",{}),e("i",{}),e("i",{})]}),e("button",{type:"button",className:"spn-toggle","aria-label":o?"Show sidebar":"Hide sidebar","aria-expanded":!o,"aria-controls":`${u}side`,onClick:q,children:s("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8","aria-hidden":!0,children:[e("rect",{x:"3.5",y:"5",width:"17",height:"14",rx:"3"}),e("path",{d:"M9.5 5v14"}),e("path",{d:"M5.8 9h1.6M5.8 12h1.6",strokeLinecap:"round","data-fill":!o})]})}),s("span",{className:"spn-title",children:["Player.tsx ",e("span",{children:"\u2014 tide"})]})]}),s("div",{className:"spn-body",children:[e("aside",{className:"spn-side",id:`${u}side`,"aria-label":"Files","aria-hidden":o,children:s("div",{className:"spn-side-in",children:[e("p",{className:"spn-head",children:"Tide"}),e("ul",{className:"spn-files",children:ie.map(t=>s("li",{"data-active":!!t.active,style:{paddingLeft:10+t.depth*12},children:[e(re,{kind:t.kind}),e("span",{children:t.name})]},t.name))})]})}),e(J,{label:"Resize sidebar",controls:`${u}side`,now:d,max:S,text:o?"Sidebar collapsed":`Sidebar ${d} pixels`,readout:o?"Hidden":`${d}`,active:w==="a",onPointerDown:B("a"),onPointerMove:O("a"),onPointerUp:_,onKeyDown:X("a"),onDoubleClick:G("a")}),e("section",{className:"spn-edit","aria-label":"Editor",children:e("ol",{className:"spn-code","aria-hidden":!0,children:ae.map((t,a)=>s("li",{"data-cur":a===6,children:[e("span",{className:"spn-ln",children:a+1}),s("code",{children:[t.map(([r,c],ee)=>e("span",{className:`spn-${r}`,children:c},ee)),a===6?e("span",{className:"spn-caret"}):null]})]},a))})}),e(J,{label:"Resize preview",controls:`${u}prev`,now:p,max:W,min:z,text:`Preview ${p} pixels`,readout:`${p}`,active:w==="b",onPointerDown:B("b"),onPointerMove:O("b"),onPointerUp:_,onKeyDown:X("b"),onDoubleClick:G("b")}),s("section",{className:"spn-prev",id:`${u}prev`,"aria-label":"Preview",children:[s("div",{className:"spn-url","aria-hidden":!0,children:[e("i",{})," localhost:5173"]}),e("div",{className:"spn-stage",children:s("div",{className:"spn-card","aria-hidden":!0,children:[e("div",{className:"spn-art"}),s("div",{className:"spn-meta",children:[e("b",{children:"Night Drive"}),e("span",{children:"Kilo"})]}),s("span",{className:"spn-play",children:[e("svg",{width:"9",height:"10",viewBox:"0 0 9 10",children:e("path",{d:"M1 1.2v7.6a.6.6 0 0 0 .9.5l6.3-3.8a.6.6 0 0 0 0-1L1.9.7a.6.6 0 0 0-.9.5z",fill:"currentColor"})}),"Play"]})]})})]})]})]})]})}function J(n){return e("div",{className:"spn-div",role:"separator",tabIndex:0,"aria-orientation":"vertical","aria-label":n.label,"aria-controls":n.controls,"aria-valuenow":n.now,"aria-valuemin":n.min??0,"aria-valuemax":n.max,"aria-valuetext":n.text,"data-active":n.active,onPointerDown:n.onPointerDown,onPointerMove:n.onPointerMove,onPointerUp:n.onPointerUp,onPointerCancel:n.onPointerUp,onLostPointerCapture:n.onPointerUp,onKeyDown:n.onKeyDown,onDoubleClick:n.onDoubleClick,children:e("span",{className:"spn-read","aria-hidden":!0,children:n.readout})})}function re({kind:n}){if(n==="dir")return e("svg",{className:"spn-glyph",width:"12",height:"12",viewBox:"0 0 12 12","aria-hidden":!0,children:e("path",{d:"M3 4.5l3 3 3-3",fill:"none",stroke:"#7b7f88",strokeWidth:"1.4",strokeLinecap:"round",strokeLinejoin:"round"})});let f=se[n]??"#9ba1aa";return s("svg",{className:"spn-glyph",width:"12",height:"12",viewBox:"0 0 12 12","aria-hidden":!0,children:[e("path",{d:"M2.5 1.5h4.6L9.5 4v6.5H2.5z",fill:f,opacity:".18"}),e("path",{d:"M2.5 1.5h4.6L9.5 4v6.5H2.5z",fill:"none",stroke:f,strokeWidth:"1.1",strokeLinejoin:"round"}),e("path",{d:"M4.3 6.2h3.4M4.3 8.2h2.2",stroke:f,strokeWidth:"1.1",strokeLinecap:"round"})]})}var pe=`
.spn {
  --bg: #16171a;
  --bar: #1d1e22;
  --line: rgba(255,255,255,.075);
  --ink: #d6d8dd;
  --mute: #737882;
  position: relative;
  width: ${x}px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg);
  color: var(--ink);
  font-family: inherit;
  font-size: 12px;
  line-height: 1.2;
  box-shadow:
    0 0 0 1px rgba(0,0,0,.55),
    inset 0 0 0 1px rgba(255,255,255,.06),
    0 2px 4px rgba(0,0,0,.08),
    0 28px 56px -24px rgba(0,0,0,.6);
  user-select: none;
  -webkit-user-select: none;
}
.spn[data-drag="a"], .spn[data-drag="b"] { cursor: col-resize; }

.spn-bar {
  position: relative;
  display: flex; align-items: center; gap: 10px;
  height: 36px; padding: 0 10px 0 13px;
  background: var(--bar);
  box-shadow: inset 0 -1px 0 var(--line);
}
.spn-lights { display: flex; gap: 7px; }
.spn-lights i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; box-shadow: inset 0 0 0 .5px rgba(0,0,0,.25); }
.spn-lights i:nth-child(2) { background: #febc2e; }
.spn-lights i:nth-child(3) { background: #28c840; }
.spn-toggle {
  display: grid; place-items: center;
  width: 26px; height: 22px; margin-left: 4px;
  padding: 0; border: 0; border-radius: 6px;
  background: transparent; color: var(--mute);
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease, transform 180ms cubic-bezier(.3,1.4,.5,1);
}
.spn-toggle:hover { background: rgba(255,255,255,.07); color: var(--ink); }
.spn-toggle:active { transform: scale(.92); }
.spn-toggle:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.spn-toggle svg { display: block; }
.spn-toggle [data-fill="false"] { opacity: 0; }
.spn-title {
  position: absolute; left: 50%; transform: translateX(-50%);
  font-size: 12px; font-weight: 600; white-space: nowrap; color: #e9eaee;
}
.spn-title span { color: var(--mute); font-weight: 500; }

.spn-body {
  display: grid;
  grid-template-columns: var(--side) 1px minmax(0, 1fr) 1px var(--prev);
  height: 236px;
}
.spn[data-anim="true"] .spn-body { transition: grid-template-columns 300ms cubic-bezier(.3,1.15,.5,1); }

/* Sidebar: the content keeps its width and gets cut off as it folds,
   so the names slide away instead of squashing. */
.spn-side { min-width: 0; overflow: hidden; background: #1a1b1f; }
.spn-side-in { min-width: ${D}px; padding: 10px 0; }
.spn-head {
  margin: 0 0 6px; padding: 0 12px;
  font-size: 10px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--mute);
}
.spn-files { list-style: none; margin: 0; padding: 0 6px; }
.spn-files li {
  display: flex; align-items: center; gap: 6px;
  height: 22px; padding-right: 6px;
  border-radius: 5px;
  color: #b4b8c0; white-space: nowrap;
}
.spn-files li > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; }
.spn-files li[data-active="true"] { background: rgba(255,255,255,.07); color: #fff; }
.spn-files li:first-child { color: var(--ink); font-weight: 600; }
.spn-glyph { display: block; flex: none; }

/* Dividers: a 1px hairline with a 13px grip around it. */
.spn-div {
  position: relative; z-index: 2;
  background: var(--line);
  cursor: col-resize;
  touch-action: none;
  outline: none;
  transition: background 120ms ease;
}
.spn-div::before { content: ""; position: absolute; top: 0; bottom: 0; left: -6px; right: -6px; }
.spn-div::after {
  content: ""; position: absolute; top: 0; bottom: 0; left: -1px; right: -1px;
  background: var(--accent);
  opacity: 0; transform: scaleY(.4);
  transition: opacity 120ms ease, transform 220ms cubic-bezier(.3,1.3,.5,1);
}
.spn-div:hover::after, .spn-div:focus-visible::after, .spn-div[data-active="true"]::after { opacity: 1; transform: none; }
.spn-div:first-of-type::before { left: 0; right: -8px; }
.spn-read {
  position: absolute; z-index: 1; top: 10px; left: 50%;
  padding: 3px 6px;
  border-radius: 5px;
  background: var(--accent); color: #111;
  font: 600 10px/1 ui-monospace, "SF Mono", Menlo, monospace;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, -4px) scale(.9);
  transition: opacity 100ms ease, transform 160ms ease;
}
.spn-div[data-active="true"] .spn-read, .spn-div:focus-visible .spn-read {
  opacity: 1; transform: translate(-50%, 0) scale(1);
  transition: opacity 140ms ease, transform 260ms cubic-bezier(.3,1.5,.5,1);
}
.spn-div:first-of-type .spn-read { left: 7px; transform: translate(0, -4px) scale(.9); transform-origin: left center; }
.spn-div:first-of-type[data-active="true"] .spn-read, .spn-div:first-of-type:focus-visible .spn-read { transform: none; }

/* Editor */
.spn-edit { position: relative; min-width: 0; overflow: hidden; padding-top: 10px; }
.spn-edit::after {
  content: ""; position: absolute; top: 0; right: 0; bottom: 0; width: 18px;
  background: linear-gradient(to right, transparent, var(--bg));
  pointer-events: none;
}
.spn-code {
  list-style: none; margin: 0; padding: 0;
  font: 10.5px/18px ui-monospace, "SF Mono", Menlo, monospace;
  color: #c3c7cf;
}
.spn-code li { display: flex; white-space: pre; }
.spn-code li[data-cur="true"] { background: rgba(255,255,255,.04); }
.spn-ln { flex: none; width: 26px; padding-right: 10px; text-align: right; color: #4c5059; font-variant-numeric: tabular-nums; }
.spn-code li[data-cur="true"] .spn-ln { color: #a3a8b2; }
.spn-code code { font: inherit; }
.spn-k { color: #ff7b72; }
.spn-f { color: #5ccfe6; }
.spn-s { color: #b5e07f; }
.spn-v { color: #e6e8ec; }
.spn-t { color: #ffb86b; }
.spn-p { color: #8b9099; }
.spn-caret {
  display: inline-block; width: 1.5px; height: 13px; margin-left: 1px;
  vertical-align: -2px;
  background: var(--accent);
  animation: spn-blink 1.1s steps(1) infinite;
}
@keyframes spn-blink { 50% { opacity: 0; } }

/* Preview: a light page, so it reads as the thing the code makes. */
.spn-prev {
  min-width: 0; overflow: hidden;
  display: flex; flex-direction: column;
  background: #f4f4f1;
  color: #16171a;
  container-type: inline-size;
}
.spn-url {
  flex: none;
  display: flex; align-items: center; gap: 5px;
  height: 26px; padding: 0 9px;
  font: 500 9.5px/1 ui-monospace, "SF Mono", Menlo, monospace;
  color: #7b7f88; white-space: nowrap;
  border-bottom: 1px solid #e3e3df;
  background: #fbfbf9;
}
.spn-url i { flex: none; width: 6px; height: 6px; border-radius: 50%; background: #28c840; }
.spn-stage { flex: 1; display: grid; place-items: center; padding: 10px; }
.spn-card {
  width: 100%; max-width: 108px;
  padding: 8px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(0,0,0,.05), 0 8px 18px -10px rgba(0,0,0,.3);
}
.spn-art {
  aspect-ratio: 1;
  border-radius: 7px;
  background:
    radial-gradient(circle at 70% 30%, #ffe45c 0 16%, transparent 17%),
    linear-gradient(160deg, #00b3a4, #0a5c63 70%, #08343a);
}
.spn-meta { display: grid; gap: 2px; margin: 7px 2px 8px; min-width: 0; }
.spn-meta b, .spn-meta span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spn-meta b { font-size: 11.5px; font-weight: 650; letter-spacing: -0.01em; }
.spn-meta span { font-size: 10.5px; color: #80848c; }
.spn-play {
  display: flex; align-items: center; justify-content: center; gap: 5px;
  height: 24px; border-radius: 999px;
  background: #16171a; color: #fff;
  font-size: 11px; font-weight: 600;
}
.spn-play svg { display: block; }
/* Wide preview: the card lays out in a row. */
@container (min-width: 150px) {
  .spn-card { max-width: 210px; display: grid; grid-template-columns: 48px minmax(0, 1fr); column-gap: 9px; align-items: center; }
  .spn-meta { margin: 0; }
  .spn-play { grid-column: 1 / -1; margin-top: 8px; }
}

@media (prefers-reduced-motion: reduce) {
  .spn[data-anim="true"] .spn-body { transition: none; }
  .spn-caret { animation: none; }
  .spn-div::after, .spn-read { transition: opacity 120ms ease; transform: none; }
}
`;export{oe as default};
