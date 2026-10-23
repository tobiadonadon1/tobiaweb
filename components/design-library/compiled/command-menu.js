"use client";
/* Construct · Design library: the compiled preview of "Command menu". The source is for members. */
import{useEffect as E,useId as W,useLayoutEffect as F,useMemo as j,useRef as k,useState as N}from"react";import{Fragment as y,jsx as t,jsxs as a}from"react/jsx-runtime";var _=[{id:"inbox",group:"Navigation",label:"Go to Inbox",keys:["G","I"],done:"Opened Inbox",icon:"inbox",tint:"#4aa8ff"},{id:"projects",group:"Navigation",label:"Go to Projects",keys:["G","P"],done:"Opened Projects",icon:"folder",tint:"#ffb340"},{id:"settings",group:"Navigation",label:"Open Settings",keys:["\u2318",","],done:"Opened Settings",icon:"gear",tint:"#a1a1aa"},{id:"workspace",group:"Navigation",label:"Switch workspace",keys:["\u2318","O"],done:"Switched to Northwind",icon:"swap",tint:"#ff7a59"},{id:"new",group:"Actions",label:"New issue",keys:["C"],done:"Issue FLD-154 created",icon:"plus",tint:"#3ddc97"},{id:"assign",group:"Actions",label:"Assign to me",keys:["I"],done:"Assigned to you",icon:"user",tint:"#4aa8ff"},{id:"status",group:"Actions",label:"Change status",keys:["S"],done:"Moved to In progress",icon:"status",tint:"#ffb340"},{id:"link",group:"Actions",label:"Copy link",keys:["\u2318","\u21E7","C"],done:"Link copied",icon:"link",tint:"#a1a1aa"},{id:"theme",group:"Actions",label:"Toggle dark mode",keys:["\u2318","\u21E7","L"],done:"Dark mode on",icon:"moon",tint:"#ff7a59"}];function q(d,m){if(!m)return{at:[],score:0};let b=d.toLowerCase(),s=[],r=0,u=0;for(let c of m.toLowerCase()){if(c===" ")continue;let o=b.indexOf(c,u);if(o<0)return null;let x=s[s.length-1];r+=x===o-1?3:1,(o===0||b[o-1]===" ")&&(r+=2),s.push(o),u=o+1}return{at:s,score:r-s[0]*.1}}var Q=1600,H=260;function U({accent:d="#d4f53c",commands:m=_,onRun:b}){let s=W(),[r,u]=N(!0),[c,o]=N(""),[x,h]=N(0),[g,z]=N("idle"),[A,B]=N(null),Y=k(null),P=k(null),$=k(null),D=k(null),I=k(new Map),R=k([]),v=k(!1),C=k(null);E(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");v.current=e.matches;let n=()=>v.current=e.matches;e.addEventListener("change",n);let i=R.current;return()=>{e.removeEventListener("change",n),i.forEach(l=>clearTimeout(l))}},[]);let w=j(()=>{let e=[];for(let n of m){let i=q(n.label,c.trim());if(!i)continue;let l=e.find(p=>p.name===n.group);l||e.push(l={name:n.group,items:[]}),l.items.push({cmd:n,at:i.at,score:i.score})}if(c.trim())for(let n of e)n.items.sort((i,l)=>l.score-i.score);return e},[m,c]),L=j(()=>w.flatMap(e=>e.items),[w]),f=L[Math.min(x,L.length-1)];E(()=>h(0),[c]),F(()=>{let e=D.current,n=f?I.current.get(f.cmd.id):null;if(!e)return;if(!n){e.style.setProperty("--hl-o","0");return}e.style.setProperty("--hl-o","1"),e.style.setProperty("--hl-y",`${n.offsetTop}px`);let i=n.offsetTop,l=i+n.offsetHeight,S=w.some(G=>G.items[0]?.cmd.id===f.cmd.id)?i-30:i-4;S<e.scrollTop?e.scrollTo({top:Math.max(0,S),behavior:v.current?"auto":"smooth"}):l+22>e.scrollTop+e.clientHeight&&e.scrollTo({top:l+22-e.clientHeight,behavior:v.current?"auto":"smooth"})},[f,w]),E(()=>{let e=C.current==="input"?P.current:C.current==="pill"?$.current:null;C.current=null,e?.focus({preventScroll:!0})},[r]);let O=(e,n)=>{R.current.push(window.setTimeout(e,n))},K=e=>{!e||g!=="idle"||(B(e),z("flash"),b?.(e),O(()=>z("done"),v.current?0:H),O(()=>{z("idle"),o(""),h(0)},H+Q))},T=(e,n)=>{n&&(C.current=e?"input":"pill"),u(e)},M=L.length;return a(y,{children:[t("style",{children:X}),a("div",{ref:Y,className:"cmk","data-open":r,"data-phase":g,style:{"--accent":d},onKeyDown:e=>{(e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"&&(e.preventDefault(),T(!r,!0))},children:[a("div",{className:"cmk-panel","aria-hidden":!r,children:[a("div",{className:"cmk-field",children:[a("svg",{className:"cmk-glass",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round","aria-hidden":!0,children:[t("circle",{cx:"11",cy:"11",r:"6.5"}),t("path",{d:"M16 16l4 4"})]}),t("input",{ref:P,className:"cmk-input",tabIndex:r?0:-1,value:c,onChange:e=>o(e.target.value),placeholder:"Type a command or search\u2026",spellCheck:!1,autoComplete:"off",role:"combobox","aria-label":"Command","aria-expanded":M>0,"aria-controls":`${s}list`,"aria-autocomplete":"list","aria-activedescendant":f?`${s}${f.cmd.id}`:void 0,onKeyDown:e=>{let n=Math.max(1,M);if(e.key==="ArrowDown")h(i=>(i+1)%n);else if(e.key==="ArrowUp")h(i=>(i-1+n)%n);else if(e.key==="Home"&&(!c||e.ctrlKey))h(0);else if(e.key==="End"&&(!c||e.ctrlKey))h(n-1);else if(e.key==="Enter")K(f?.cmd);else if(e.key==="Escape")c?o(""):T(!1,!0);else return;e.preventDefault()}}),t("kbd",{className:"cmk-esc","aria-hidden":!0,children:"esc"})]}),a("div",{ref:D,className:"cmk-list",id:`${s}list`,role:"listbox","aria-label":"Commands",children:[t("span",{className:"cmk-hl","aria-hidden":!0}),w.map(e=>a("div",{role:"group","aria-labelledby":`${s}g${e.name}`,children:[t("p",{className:"cmk-group",id:`${s}g${e.name}`,children:e.name}),e.items.map(({cmd:n,at:i})=>{let l=f?.cmd.id===n.id;return a("div",{ref:p=>{p?I.current.set(n.id,p):I.current.delete(n.id)},id:`${s}${n.id}`,className:"cmk-row",role:"option","aria-selected":l,"data-on":l,"data-ran":g==="flash"&&A?.id===n.id,onPointerMove:()=>!l&&g==="idle"&&h(L.findIndex(p=>p.cmd.id===n.id)),onPointerDown:p=>p.preventDefault(),onClick:()=>K(n),children:[t("span",{className:"cmk-tile",style:{"--tint":n.tint},children:t(J,{name:n.icon})}),t("span",{className:"cmk-label",children:t(V,{text:n.label,at:i})}),t("span",{className:"cmk-keys","aria-label":`Shortcut ${n.keys.join(" ")}`,children:n.keys.map((p,S)=>t("kbd",{children:p},S))})]},n.id)})]},e.name)),M===0?a("p",{className:"cmk-empty",children:["No commands for \u201C",t("b",{children:c.trim()}),"\u201D"]}):null]}),a("div",{className:"cmk-foot",children:[a("span",{className:"cmk-status","aria-live":"polite",children:[a("span",{className:"cmk-count","data-show":g!=="done",children:[M," ",M===1?"result":"results"]}),a("span",{className:"cmk-done","data-show":g==="done",children:[t("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.8",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:t("path",{d:"M5 12.5l4.5 4.5L19 7.5"})}),g==="done"?A?.done:""]})]}),a("span",{className:"cmk-run","aria-hidden":!0,children:["Run",t("kbd",{children:"\u21B5"})]})]})]}),a("button",{ref:$,type:"button",className:"cmk-pill","aria-hidden":r,tabIndex:r?-1:0,onClick:()=>T(!0,!0),children:[a("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round","aria-hidden":!0,children:[t("circle",{cx:"11",cy:"11",r:"6.5"}),t("path",{d:"M16 16l4 4"})]}),"Search",a("span",{className:"cmk-pill-keys","aria-hidden":!0,children:[t("kbd",{children:"\u2318"}),t("kbd",{children:"K"})]})]})]})]})}function V({text:d,at:m}){if(!m.length)return t(y,{children:d});let b=new Set(m),s=[],r="",u=!1,c=o=>{r&&s.push(u?t("mark",{className:"cmk-hit",children:r},o):t("span",{children:r},o)),r=""};for(let o=0;o<d.length;o++){let x=b.has(o);x!==u&&(c(o),u=x),r+=d[o]}return c(d.length),t(y,{children:s})}function J({name:d}){return t("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:{inbox:t("path",{d:"M4 13.5 6.2 6.3A2 2 0 0 1 8.1 5h7.8a2 2 0 0 1 1.9 1.3L20 13.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 13.5h4.5l1.2 2h4.6l1.2-2H20"}),folder:t("path",{d:"M4 8a2 2 0 0 1 2-2h3.6l2 2H18a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"}),gear:a(y,{children:[t("circle",{cx:"12",cy:"12",r:"3"}),t("path",{d:"M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6"})]}),swap:t("path",{d:"M7 7.5h11l-3-3M17 16.5H6l3 3"}),plus:t("path",{d:"M12 5.5v13M5.5 12h13"}),user:a(y,{children:[t("circle",{cx:"12",cy:"9",r:"3.5"}),t("path",{d:"M5.5 19.5a6.5 6.5 0 0 1 13 0"})]}),status:a(y,{children:[t("circle",{cx:"12",cy:"12",r:"7.5"}),t("path",{d:"M12 4.5a7.5 7.5 0 0 1 0 15z",fill:"currentColor"})]}),link:t("path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}),moon:t("path",{d:"M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z"})}[d]})}var X=`
.cmk {
  --bg: #1a1a1d;
  --line: rgba(255,255,255,.075);
  --ink: #ececef;
  --mute: #85858d;
  display: grid;
  place-items: center;
  font-family: inherit;
  color: var(--ink);
}
.cmk > * { grid-area: 1 / 1; }

.cmk-panel {
  width: 380px;
  border-radius: 14px;
  background: var(--bg);
  box-shadow:
    0 0 0 1px rgba(0,0,0,.6),
    inset 0 0 0 1px rgba(255,255,255,.08),
    inset 0 1px 0 rgba(255,255,255,.06),
    0 30px 60px -20px rgba(0,0,0,.7),
    0 12px 24px -12px rgba(0,0,0,.5);
  overflow: hidden;
  transform-origin: 50% 0;
  transition: opacity 200ms ease, transform 340ms cubic-bezier(.3,1.25,.5,1), filter 200ms ease;
}
.cmk[data-open="false"] .cmk-panel {
  opacity: 0; pointer-events: none;
  transform: scale(.94) translateY(-10px);
  filter: blur(2px);
  transition: opacity 140ms ease, transform 180ms cubic-bezier(.4,0,1,1), filter 140ms ease;
}

.cmk-field { display: flex; align-items: center; gap: 10px; height: 50px; padding: 0 12px 0 16px; box-shadow: inset 0 -1px 0 var(--line); }
.cmk-glass { flex: none; display: block; color: var(--mute); }
.cmk-input {
  flex: 1; min-width: 0; height: 100%;
  padding: 0; margin: 0; border: 0; outline: 0;
  background: transparent; color: var(--ink);
  font: inherit; font-size: 14.5px; letter-spacing: -0.005em;
  caret-color: var(--accent);
}
.cmk-input::placeholder { color: #6a6a72; }
.cmk kbd {
  display: inline-grid; place-items: center;
  min-width: 18px; height: 18px; padding: 0 5px;
  border-radius: 5px;
  background: rgba(255,255,255,.07);
  box-shadow: inset 0 -1px 0 rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.05);
  color: #a6a6ae;
  font-family: inherit; font-size: 10.5px; font-weight: 500; line-height: 1;
}
.cmk-esc { flex: none; }

.cmk-list {
  --hl-y: 0px; --hl-o: 0;
  position: relative;
  height: 196px;
  padding: 0 6px 18px;
  overflow-y: auto;
  scrollbar-width: none;
  overscroll-behavior: contain;
  -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 22px), transparent);
  mask-image: linear-gradient(to bottom, #000 calc(100% - 22px), transparent);
}
.cmk-list::-webkit-scrollbar { display: none; }
.cmk-hl {
  position: absolute; left: 6px; right: 6px; top: 0;
  height: 36px;
  border-radius: 9px;
  background: rgba(255,255,255,.075);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.04);
  opacity: var(--hl-o);
  transform: translateY(var(--hl-y));
  transition: transform 220ms cubic-bezier(.3,1.25,.5,1), opacity 120ms ease;
  pointer-events: none;
}
.cmk[data-phase="flash"] .cmk-hl { animation: cmk-flash ${H}ms steps(1) both; }
@keyframes cmk-flash {
  0% { background: var(--accent); }
  33% { background: rgba(255,255,255,.075); }
  66% { background: var(--accent); }
}
.cmk-group { margin: 0; padding: 12px 10px 6px; font-size: 11px; font-weight: 600; color: var(--mute); letter-spacing: .01em; }
.cmk-row {
  position: relative;
  display: flex; align-items: center; gap: 10px;
  height: 36px; padding: 0 8px;
  border-radius: 9px;
  font-size: 13.5px; font-weight: 500;
  color: #d4d4d9;
  cursor: default;
  user-select: none; -webkit-user-select: none;
  transition: color 120ms ease;
}
.cmk-row[data-on="true"] { color: #fff; }
.cmk-row[data-ran="true"] { color: #121212; animation: cmk-ink ${H}ms steps(1) both; }
@keyframes cmk-ink { 33% { color: #fff; } 66% { color: #121212; } }
.cmk-tile {
  flex: none; display: grid; place-items: center;
  width: 24px; height: 24px; border-radius: 7px;
  background: color-mix(in srgb, var(--tint) 18%, transparent);
  color: var(--tint);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--tint) 22%, transparent);
}
.cmk-tile svg { display: block; }
.cmk-label { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cmk-hit { background: none; color: var(--accent); font-weight: 650; }
.cmk-row[data-ran="true"] .cmk-hit { color: inherit; }
.cmk-row[data-ran="true"] kbd { background: rgba(0,0,0,.12); box-shadow: none; color: inherit; }
.cmk-keys { flex: none; display: flex; gap: 3px; }

.cmk-empty { margin: 0; padding: 64px 0 0; text-align: center; font-size: 13px; color: var(--mute); }
.cmk-empty b { color: var(--ink); font-weight: 600; }

.cmk-foot {
  display: flex; align-items: center; justify-content: space-between;
  height: 38px; padding: 0 10px 0 16px;
  background: rgba(255,255,255,.02);
  box-shadow: inset 0 1px 0 var(--line);
  font-size: 12px; color: var(--mute);
}
.cmk-status { position: relative; display: grid; align-items: center; height: 100%; min-width: 0; }
.cmk-status > * { grid-area: 1 / 1; white-space: nowrap; }
.cmk-count { font-variant-numeric: tabular-nums; transition: opacity 120ms ease, transform 160ms ease; }
.cmk-count[data-show="false"] { opacity: 0; transform: translateY(-8px); }
.cmk-done {
  display: inline-flex; align-items: center; gap: 6px;
  color: var(--accent); font-weight: 600;
  opacity: 0; transform: translateY(10px);
  transition: opacity 120ms ease, transform 160ms ease;
}
.cmk-done svg { display: block; flex: none; }
.cmk-done[data-show="true"] { opacity: 1; transform: none; transition: opacity 180ms ease, transform 380ms cubic-bezier(.3,1.5,.5,1); }
.cmk-run { display: inline-flex; align-items: center; gap: 7px; color: #c4c4ca; font-weight: 500; }

.cmk-pill {
  display: inline-flex; align-items: center; gap: 8px;
  height: 38px; padding: 0 8px 0 14px;
  border: 0; border-radius: 999px;
  background: var(--bg); color: #c4c4ca;
  font: inherit; font-size: 13px; font-weight: 500;
  cursor: pointer;
  box-shadow: 0 0 0 1px rgba(0,0,0,.6), inset 0 0 0 1px rgba(255,255,255,.09), 0 12px 24px -12px rgba(0,0,0,.6);
  opacity: 0; pointer-events: none;
  transform: scale(.7) translateY(20px);
  transition: opacity 120ms ease, transform 160ms ease, background 140ms ease;
}
.cmk-pill svg { display: block; }
.cmk-pill-keys { display: flex; gap: 3px; margin-left: 4px; }
.cmk[data-open="false"] .cmk-pill {
  opacity: 1; pointer-events: auto; transform: none;
  transition: opacity 200ms ease 80ms, transform 420ms cubic-bezier(.3,1.5,.5,1) 60ms, background 140ms ease;
}
.cmk-pill:hover { background: #222226; color: #fff; }
.cmk[data-open="false"] .cmk-pill:active { transform: scale(.95); }
.cmk-pill:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

@media (prefers-reduced-motion: reduce) {
  .cmk-panel, .cmk[data-open="false"] .cmk-panel { transform: none; filter: none; transition: opacity 140ms ease; }
  .cmk-pill, .cmk[data-open="false"] .cmk-pill { transform: none; transition: opacity 140ms ease; }
  .cmk-hl { transition: none; }
  .cmk[data-phase="flash"] .cmk-hl, .cmk-row[data-ran="true"] { animation: none; }
  .cmk-count, .cmk-done, .cmk-done[data-show="true"], .cmk-count[data-show="false"] { transform: none; transition: opacity 120ms ease; }
}
`;export{U as default};
