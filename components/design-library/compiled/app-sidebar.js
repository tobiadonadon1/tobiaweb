"use client";
/* Construct · Design library: the compiled preview of "Sidebar". The source is for members. */
import{useEffect as M,useId as O,useLayoutEffect as R,useRef as y,useState as b}from"react";import{Fragment as D,jsx as e,jsxs as s}from"react/jsx-runtime";var B=[{id:"inbox",label:"Inbox",count:3,unread:!0,icon:e("path",{d:"M4 13.5 6.2 6.3A2 2 0 0 1 8.1 5h7.8a2 2 0 0 1 1.9 1.3L20 13.5V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 13.5h4.5l1.2 2h4.6l1.2-2H20"}),rows:[["FLD-148","Checkout copy","todo"],["FLD-146","Safari date picker","doing"],["FLD-139","Invite flow QA","done"]]},{id:"issues",label:"My issues",count:12,icon:s(D,{children:[e("circle",{cx:"12",cy:"12",r:"7.5"}),e("circle",{cx:"12",cy:"12",r:"2.2",fill:"currentColor"})]}),rows:[["FLD-151","Search empty state","doing"],["FLD-144","Export rate limit","todo"],["FLD-140","Dark mode tokens","done"]]},{id:"cycles",label:"Cycles",icon:e("path",{d:"M19 12a7 7 0 0 1-12.2 4.7M5 12a7 7 0 0 1 12.2-4.7M17.5 3.8v3.6h-3.6M6.5 20.2v-3.6h3.6"}),rows:[["C-14","Oct 20 \u2013 Nov 2","doing"],["C-15","Nov 3 \u2013 Nov 16","todo"],["C-13","Oct 6 \u2013 Oct 19","done"]]},{id:"drafts",label:"Drafts",count:2,icon:e("path",{d:"M14.5 5.5l4 4M5 19l1-4.5L15.8 4.7a1.5 1.5 0 0 1 2.1 0l1.4 1.4a1.5 1.5 0 0 1 0 2.1L9.5 18z"}),rows:[["FLD-153","Onboarding list","todo"],["FLD-152","Team billing","todo"]]}],C=[{id:"web",label:"Website",dot:"#ff5a36",icon:null,rows:[["WEB-31","New pricing page","doing"],["WEB-28","Hero illustration","todo"],["WEB-25","Cookie banner","done"]]},{id:"ios",label:"iOS app",dot:"#16a3f5",icon:null,rows:[["IOS-77","Today widget","doing"],["IOS-74","Haptics on save","todo"],["IOS-70","TestFlight 2.3","done"]]},{id:"billing",label:"Billing",dot:"#2fbf71",icon:null,rows:[["BIL-12","Upgrade proration","doing"],["BIL-10","Invoice footer","todo"],["BIL-9","Webhook retries","done"]]}],m=[...B,...C],S=[{name:"Fieldwork",colour:"#c8f031",ink:"#14210a"},{name:"Northwind",colour:"#ff5a36",ink:"#fff"}];function $({tone:p="#18181b",collapsed:h=!1,onSelect:E}){let k=O(),[i,x]=b(h),[u,I]=b("inbox"),[w,T]=b(0),[g,l]=b(null),f=y(null),N=y(null),d=y(new Map),[F,W]=b(!1);M(()=>x(h),[h]),R(()=>{let a=d.current.get(u),t=N.current;!a||!t||(t.style.setProperty("--hy",`${a.offsetTop}px`),t.style.setProperty("--hh",`${a.offsetHeight}px`))},[u]),M(()=>{let a=requestAnimationFrame(()=>W(!0));return()=>cancelAnimationFrame(a)},[]);let A=a=>{I(a),E?.(a)},L=a=>{let t=d.current.get(a);if(!t||!f.current)return;let n=f.current.getBoundingClientRect(),r=t.getBoundingClientRect(),P=n.height/(f.current.offsetHeight||1);l({id:a,top:(r.top-n.top+r.height/2)/P})},H=a=>{if(a.key!=="ArrowDown"&&a.key!=="ArrowUp")return;let t=m.map(r=>d.current.get(r.id)).filter(Boolean),n=t.indexOf(document.activeElement);n<0||(a.preventDefault(),t[(n+(a.key==="ArrowDown"?1:-1)+t.length)%t.length].focus())},o=m.find(a=>a.id===u)??m[0],c=S[w],v=g?m.find(a=>a.id===g.id):null,z=a=>s("button",{ref:t=>{t?d.current.set(a.id,t):d.current.delete(a.id)},type:"button",className:"asb-item","aria-current":u===a.id?"page":void 0,"aria-label":i?`${a.label}${a.count?`, ${a.count}`:""}`:void 0,onClick:()=>A(a.id),onPointerEnter:()=>i&&L(a.id),onPointerLeave:()=>l(null),onFocus:t=>i&&t.currentTarget.matches(":focus-visible")&&L(a.id),onBlur:()=>l(null),children:[s("span",{className:"asb-icon",children:[a.dot?e("i",{className:"asb-dot",style:{background:a.dot}}):e("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:a.icon}),a.unread?e("i",{className:"asb-badge","aria-hidden":!0}):null]}),e("span",{className:"asb-label",children:a.label}),a.count?e("span",{className:"asb-count",children:a.count}):null]},a.id);return s(D,{children:[e("style",{children:j}),s("div",{ref:f,className:"asb","data-rail":i,"data-glide":F,style:{"--tone":p},onKeyDown:a=>{a.key==="["&&!a.metaKey&&!a.ctrlKey&&(a.preventDefault(),l(null),x(t=>!t))},children:[s("aside",{className:"asb-side",id:`${k}side`,children:[s("button",{type:"button",className:"asb-ws","aria-label":`Workspace: ${c.name}. Switch workspace`,onClick:()=>T(a=>(a+1)%S.length),children:[e("span",{className:"asb-logo",style:{background:c.colour,color:c.ink},"aria-hidden":!0,children:c.name[0]},w),e("span",{className:"asb-label asb-wsname",children:c.name},`n${w}`),e("svg",{className:"asb-label asb-chev",width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:e("path",{d:"M8 9.5l4-4 4 4M8 14.5l4 4 4-4"})})]}),s("div",{className:"asb-nav",ref:N,role:"navigation","aria-label":"Main",onKeyDown:H,children:[e("span",{className:"asb-hl","aria-hidden":!0}),B.map(z),e("p",{className:"asb-sec",children:e("span",{className:"asb-label",children:"Projects"})}),C.map(z)]})]}),s("section",{className:"asb-main","aria-label":o.label,children:[s("header",{className:"asb-head",children:[e("button",{type:"button",className:"asb-toggle","aria-label":i?"Expand sidebar":"Collapse sidebar","aria-expanded":!i,"aria-controls":`${k}side`,onClick:()=>{l(null),x(a=>!a)},children:s("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[e("rect",{x:"3.5",y:"5",width:"17",height:"14",rx:"3"}),e("path",{d:"M9.5 5v14"}),e("path",{className:"asb-arrow",d:"M15.5 10l-2 2 2 2"})]})}),s("h3",{className:"asb-title",children:[o.dot?e("i",{className:"asb-dot",style:{background:o.dot}}):null,o.label]},o.id),e("span",{className:"asb-total",children:o.rows.length})]}),e("ul",{className:"asb-rows",children:o.rows.map(([a,t,n],r)=>s("li",{style:{"--i":r},children:[e(K,{status:n}),e("span",{className:"asb-id",children:a}),e("span",{className:"asb-row-title",children:t})]},a))},o.id)]}),s("div",{className:"asb-tip","data-show":!!(i&&g),style:{top:g?.top??0},"aria-hidden":!0,children:[v?.label,v?.count?e("span",{children:v.count}):null]})]})]})}function K({status:p}){return p==="done"?s("svg",{className:"asb-st",width:"14",height:"14",viewBox:"0 0 14 14","aria-label":"Done",children:[e("circle",{cx:"7",cy:"7",r:"6",fill:"#2fbf71"}),e("path",{d:"M4.3 7.2l1.8 1.8 3.6-3.8",fill:"none",stroke:"#fff",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})]}):p==="doing"?s("svg",{className:"asb-st",width:"14",height:"14",viewBox:"0 0 14 14","aria-label":"In progress",children:[e("circle",{cx:"7",cy:"7",r:"5.5",fill:"none",stroke:"#f0a020",strokeWidth:"1.5"}),e("path",{d:"M7 3.5A3.5 3.5 0 0 1 7 10.5z",fill:"#f0a020"})]}):e("svg",{className:"asb-st",width:"14",height:"14",viewBox:"0 0 14 14","aria-label":"To do",children:e("circle",{cx:"7",cy:"7",r:"5.5",fill:"none",stroke:"#b4b4ad",strokeWidth:"1.5",strokeDasharray:"2.4 1.9"})})}var j=`
.asb {
  --side: 172px;
  --railw: 52px;
  --line: #ececea;
  position: relative;
  display: flex;
  width: 404px; height: 284px;
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  color: #1c1c1a;
  font-family: inherit;
  font-size: 13px;
  line-height: 1.2;
  box-shadow: 0 0 0 1px rgba(20,20,18,.07), 0 1px 2px rgba(20,20,18,.05), 0 22px 44px -26px rgba(20,20,18,.35);
}

/* The sidebar: its width animates; everything inside keeps its own width
   and is simply cut off, so icons never move and labels never squash. */
.asb-side {
  flex: none;
  width: var(--side);
  overflow: hidden;
  background: #f7f7f5;
  box-shadow: inset -1px 0 0 var(--line);
  transition: width 360ms cubic-bezier(.32,.72,0,1);
}
.asb[data-rail="true"] .asb-side { width: var(--railw); }

.asb-label {
  white-space: nowrap;
  transition: opacity 160ms ease 140ms, transform 260ms cubic-bezier(.3,1.2,.5,1) 120ms;
}
.asb[data-rail="true"] .asb-label { opacity: 0; transform: translateX(-4px); transition: opacity 80ms ease, transform 80ms ease; }

.asb-ws {
  display: flex; align-items: center; gap: 9px;
  width: calc(var(--side) - 12px);
  height: 34px; margin: 8px 6px 4px; padding: 0 8px 0 9px;
  border: 0; border-radius: 9px;
  background: transparent; color: inherit; font: inherit;
  cursor: pointer;
  transition: background 140ms ease;
}
.asb-ws:hover { background: rgba(20,20,18,.05); }
.asb-ws:active .asb-logo { transform: scale(.9); }
.asb-ws:focus-visible { outline: 2px solid var(--tone); outline-offset: -2px; }
.asb-logo {
  flex: none;
  display: grid; place-items: center;
  width: 22px; height: 22px; border-radius: 6px;
  font-size: 12px; font-weight: 800; line-height: 1;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.4);
  transition: transform 200ms cubic-bezier(.3,1.5,.5,1);
  animation: asb-pop 340ms cubic-bezier(.3,1.5,.5,1);
}
@keyframes asb-pop { from { transform: scale(.6) rotate(-12deg); } }
.asb-wsname { font-weight: 650; letter-spacing: -0.01em; animation: asb-fade 260ms ease; }
.asb-chev { flex: none; margin-left: auto; color: #8d8d86; display: block; }

.asb-nav { position: relative; padding: 0 6px; }
.asb-item {
  position: relative; z-index: 1;
  display: flex; align-items: center; gap: 10px;
  width: calc(var(--side) - 12px);
  height: 28px; padding: 0 9px 0 12px;
  border: 0; border-radius: 8px;
  background: transparent; color: #4a4a45; font: inherit; font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: color 180ms ease, background 140ms ease;
}
.asb-item:hover { background: rgba(20,20,18,.045); }
.asb-item[aria-current="page"] { color: #fff; background: transparent; }
.asb-item:active .asb-icon { transform: scale(.88); }
.asb-item:focus-visible { outline: 2px solid var(--tone); outline-offset: -2px; }
.asb-icon { position: relative; flex: none; display: grid; place-items: center; width: 16px; height: 16px; transition: transform 160ms ease; }
.asb-icon svg { display: block; }
.asb-dot { display: block; width: 9px; height: 9px; border-radius: 3px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.08); }
.asb-item[aria-current="page"] .asb-dot { box-shadow: 0 0 0 1.5px rgba(255,255,255,.9); }
.asb-count {
  margin-left: auto;
  font-size: 11.5px; font-weight: 600; color: #8d8d86;
  font-variant-numeric: tabular-nums;
  transition: opacity 160ms ease 140ms, color 180ms ease;
}
.asb-item[aria-current="page"] .asb-count { color: rgba(255,255,255,.7); }
.asb[data-rail="true"] .asb-count { opacity: 0; transition: opacity 80ms ease; }
.asb-badge {
  position: absolute; top: -3px; right: -4px;
  width: 7px; height: 7px; border-radius: 50%;
  background: #ff5a36; box-shadow: 0 0 0 2px #f7f7f5;
  opacity: 0; transform: scale(0);
  transition: opacity 120ms ease, transform 120ms ease;
}
.asb[data-rail="true"] .asb-badge { opacity: 1; transform: scale(1); transition: opacity 160ms ease 160ms, transform 360ms cubic-bezier(.3,1.8,.5,1) 160ms; }
.asb-item[aria-current="page"] .asb-badge { box-shadow: 0 0 0 2px var(--tone); }

.asb-sec { position: relative; margin: 0; height: 28px; padding: 12px 11px 0; box-sizing: border-box; font-size: 11px; font-weight: 600; color: #9a9a93; }
.asb-sec::before {
  content: ""; position: absolute; left: 11px; right: 11px; top: 17px; height: 1px; background: #e2e2de;
  opacity: 0; transition: opacity 120ms ease;
}
.asb[data-rail="true"] .asb-sec::before { opacity: 1; right: auto; width: 18px; transition: opacity 160ms ease 160ms; }

/* The highlight: one element, moved to the active item. */
.asb-hl {
  position: absolute; left: 6px; top: 0;
  width: calc(var(--side) - 12px); height: var(--hh, 28px);
  border-radius: 8px;
  background: var(--tone);
  box-shadow: 0 1px 2px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.12);
  transform: translateY(var(--hy, 0px));
}
.asb[data-glide="true"] .asb-hl { transition: transform 380ms cubic-bezier(.3,1.25,.45,1), width 360ms cubic-bezier(.32,.72,0,1); }
.asb[data-rail="true"] .asb-hl, .asb[data-rail="true"] .asb-item, .asb[data-rail="true"] .asb-ws { width: calc(var(--railw) - 12px); }
.asb[data-rail="true"] .asb-item, .asb[data-rail="true"] .asb-ws { transition: color 180ms ease, background 140ms ease, width 360ms cubic-bezier(.32,.72,0,1); }
.asb[data-rail="false"] .asb-item, .asb[data-rail="false"] .asb-ws { transition: color 180ms ease, background 140ms ease, width 360ms cubic-bezier(.32,.72,0,1); }

/* Main */
.asb-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.asb-head {
  display: flex; align-items: center; gap: 8px;
  height: 50px; padding: 0 14px 0 10px;
  box-shadow: inset 0 -1px 0 var(--line);
}
.asb-toggle {
  flex: none; display: grid; place-items: center;
  width: 28px; height: 28px; padding: 0;
  border: 0; border-radius: 7px;
  background: transparent; color: #6d6d66;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease, transform 200ms cubic-bezier(.3,1.5,.5,1);
}
.asb-toggle:hover { background: rgba(20,20,18,.06); color: #1c1c1a; }
.asb-toggle:active { transform: scale(.9); }
.asb-toggle:focus-visible { outline: 2px solid var(--tone); outline-offset: 1px; }
.asb-toggle svg { display: block; }
.asb-arrow { transform-origin: 14.5px 12px; transition: transform 300ms cubic-bezier(.3,1.3,.5,1); }
.asb[data-rail="true"] .asb-arrow { transform: scaleX(-1); }
.asb-title {
  display: flex; align-items: center; gap: 8px;
  margin: 0; min-width: 0;
  font-size: 14px; font-weight: 650; letter-spacing: -0.01em; white-space: nowrap;
  animation: asb-fade 240ms ease;
}
.asb-total {
  padding: 2px 6px; border-radius: 5px;
  background: #f1f1ee; color: #7a7a73;
  font-size: 11px; font-weight: 600; font-variant-numeric: tabular-nums;
}
.asb-rows { list-style: none; margin: 0; padding: 4px 0; }
.asb-rows li {
  display: flex; align-items: center; gap: 9px;
  height: 38px; padding: 0 16px;
  box-shadow: inset 0 -1px 0 #f3f3f1;
  white-space: nowrap;
  animation: asb-row 300ms cubic-bezier(.3,1.2,.5,1) backwards;
  animation-delay: calc(var(--i) * 35ms);
}
.asb-st { flex: none; display: block; }
.asb-id { flex: none; width: 48px; font: 500 11px/1 ui-monospace, "SF Mono", Menlo, monospace; color: #9a9a93; }
.asb-row-title { min-width: 0; overflow: hidden; text-overflow: ellipsis; font-weight: 500; color: #2a2a27; }
@keyframes asb-row { from { opacity: 0; transform: translateY(6px); } }
@keyframes asb-fade { from { opacity: 0; } }

/* Rail tooltips live in the window, so the folded sidebar can't clip them. */
.asb-tip {
  position: absolute; left: calc(var(--railw) + 6px); z-index: 3;
  display: flex; align-items: center; gap: 7px;
  height: 26px; margin-top: -13px; padding: 0 9px;
  border-radius: 7px;
  background: #1c1c1a; color: #fff;
  font-size: 12px; font-weight: 550; white-space: nowrap;
  box-shadow: 0 6px 16px -6px rgba(0,0,0,.4);
  pointer-events: none;
  opacity: 0; transform: translateX(-4px);
  transition: opacity 90ms ease, transform 90ms ease;
}
.asb-tip span { color: rgba(255,255,255,.55); font-variant-numeric: tabular-nums; }
.asb-tip[data-show="true"] { opacity: 1; transform: none; transition: opacity 140ms ease, transform 240ms cubic-bezier(.3,1.5,.5,1), top 0s; }

@media (prefers-reduced-motion: reduce) {
  .asb-side, .asb[data-glide="true"] .asb-hl, .asb[data-rail] .asb-item, .asb[data-rail] .asb-ws, .asb-arrow { transition: none; }
  .asb-label, .asb[data-rail="true"] .asb-label { transform: none; transition: opacity 120ms ease; }
  .asb-logo, .asb-wsname, .asb-title, .asb-rows li { animation: none; }
  .asb-badge, .asb[data-rail="true"] .asb-badge, .asb-tip, .asb-tip[data-show="true"] { transform: none; transition: opacity 120ms ease; }
}
`;export{$ as default};
