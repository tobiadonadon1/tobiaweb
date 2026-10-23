"use client";
/* Construct · Design library: the compiled preview of "Assignees". The source is for members. */
import{useEffect as N,useId as ee,useMemo as V,useRef as d,useState as $}from"react";import{Fragment as re,jsx as a,jsxs as r}from"react/jsx-runtime";var te=[{id:"maya",name:"Maya Chen",role:"Design",color:"#ff6b4a"},{id:"jonas",name:"Jonas Weber",role:"Frontend",color:"#1f2937"},{id:"priya",name:"Priya Nair",role:"Backend",color:"#ffb21e"},{id:"kwame",name:"Kwame Mensah",role:"QA",color:"#2f80ff"},{id:"elena",name:"Elena Rossi",role:"Product",color:"#ff7ab6"},{id:"tom",name:"Tom Becker",role:"iOS",color:"#16b8a6"}],I=22,x=26;function ae({people:s=te,defaultValue:u=["maya","jonas"],tone:p="#00a86b",onChange:f}){let m=ee(),b=d(null),y=d(null),w=d(null),L=d(null),k=d(null),[n,S]=$(!1),[g,M]=$(""),[v,h]=$(0),[T,z]=$(()=>u.filter(e=>s.some(t=>t.id===e)).map((e,t)=>({id:e,out:!1,at:t,wait:null}))),[X,O]=$([]),Y=d(0),H=d(!1);N(()=>{let e=window.matchMedia("(prefers-reduced-motion: reduce)");H.current=e.matches;let t=()=>H.current=e.matches;return e.addEventListener("change",t),()=>e.removeEventListener("change",t)},[]);let A=V(()=>new Map(s.map(e=>[e.id,e])),[s]),C=T.filter(e=>!e.out).map(e=>e.id),E=V(()=>{let e=g.trim().toLowerCase();return e?s.filter(t=>`${t.name} ${t.role??""}`.toLowerCase().includes(e)):s},[s,g]),P=e=>{S(!1),M(""),e&&y.current?.focus()},F=()=>{S(!0),h(0)};N(()=>{n&&L.current?.focus()},[n]),N(()=>{if(!n)return;let e=t=>{b.current?.contains(t.target)||P(!1)};return document.addEventListener("pointerdown",e),()=>document.removeEventListener("pointerdown",e)},[n]),N(()=>{let e=k.current,t=e?.querySelector(`[data-i="${v}"]`);!e||!t||(t.offsetTop<e.scrollTop?e.scrollTop=t.offsetTop-4:t.offsetTop+t.offsetHeight>e.scrollTop+e.clientHeight&&(e.scrollTop=t.offsetTop+t.offsetHeight-e.clientHeight+4))},[v,n]);let K=d([]);N(()=>()=>K.current.forEach(clearTimeout),[]);let Z=(e,t)=>K.current.push(window.setTimeout(t,e)),q=(e,t)=>{if(C.includes(e)){let l=T.map(o=>o.id===e&&!o.out?{...o,out:!0}:o),D=0;for(let o of l)o.out||(o.at=D++);z(l),Z(240,()=>z(o=>o.filter(J=>!(J.id===e&&J.out)))),f?.(l.filter(o=>!o.out).map(o=>o.id));return}let c=C.length,U=!H.current&&t&&w.current&&b.current,Q=[...T.filter(l=>l.id!==e),{id:e,out:!1,at:c,wait:!!U}];if(z(Q),f?.(Q.filter(l=>!l.out).map(l=>l.id)),U){let l=w.current.getBoundingClientRect(),D=++Y.current;O(o=>[...o,{key:D,id:e,from:t.getBoundingClientRect(),to:{x:l.left+c*I,y:l.top+(l.height-x)/2},root:b.current.getBoundingClientRect()}])}},G=(e,t)=>{O(i=>i.filter(c=>c.key!==e)),z(i=>i.map(c=>c.id===t?{...c,wait:!1}:c))},_=e=>{let t=E.length;if(e.key==="ArrowDown")h(i=>t?(i+1)%t:0);else if(e.key==="ArrowUp")h(i=>t?(i-1+t)%t:0);else if(e.key==="Home"&&!g)h(0);else if(e.key==="End"&&!g)h(Math.max(0,t-1));else if(e.key==="Enter"){let i=E[v];i&&q(i.id,k.current?.querySelector(`[data-i="${v}"] .asg-av`)??null)}else if(e.key==="Escape")g?(M(""),h(0)):P(!0);else if(e.key==="Tab"){P(!1);return}else return;e.preventDefault()},B=T.filter(e=>!e.out).length,W=C.map(e=>A.get(e)?.name.split(" ")[0]).filter(Boolean),j=`${m}-list`;return r(re,{children:[a("style",{children:oe}),r("div",{ref:b,className:"asg",style:{"--tone":p},children:[r("article",{className:"asg-task",children:[r("div",{className:"asg-head",children:[r("button",{ref:y,type:"button",className:"asg-ctl","data-empty":B===0,"aria-haspopup":"listbox","aria-expanded":n,"aria-controls":n?`${m}-pop`:void 0,"aria-label":W.length?`Assignees: ${W.join(", ")}. Change`:"Assign",onClick:()=>n?P(!1):F(),onKeyDown:e=>{e.key==="ArrowDown"&&!n&&(e.preventDefault(),F())},children:[a("span",{ref:w,className:"asg-stack",style:{width:B?(B-1)*I+x:0},"aria-hidden":!0,children:T.map(e=>{let t=A.get(e.id);return t?a("span",{className:"asg-slot","data-out":e.out,"data-wait":e.wait??void 0,style:{"--x":`${e.at*I}px`,zIndex:10+e.at},children:a(R,{p:t})},e.id+(e.out?"-out":"")):null})}),a("span",{className:"asg-plus","aria-hidden":!0,children:a("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.6",strokeLinecap:"round",children:a("path",{d:"M12 5v14M5 12h14"})})}),a("span",{className:"asg-word","aria-hidden":!0,children:"Assign"})]}),a("span",{className:"asg-id",children:"WEB-214"})]}),a("h3",{className:"asg-title",children:"Safari checkout drops the coupon code"}),a("p",{className:"asg-desc",children:"Applying a code on step 2 clears it again when the page reloads on iOS."}),r("div",{className:"asg-foot",children:[r("span",{className:"asg-status",children:[a("i",{"aria-hidden":!0}),"In progress"]}),a("span",{className:"asg-label","data-k":"bug",children:"Bug"}),r("span",{className:"asg-due",children:[r("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round","aria-hidden":!0,children:[a("rect",{x:"4",y:"5.5",width:"16",height:"14.5",rx:"3"}),a("path",{d:"M4 10h16M8.5 3.5v4M15.5 3.5v4"})]}),"Oct 31"]})]})]}),r("div",{id:`${m}-pop`,className:"asg-pop","data-open":n,role:"dialog","aria-label":"Assign people",children:[r("label",{className:"asg-search",children:[r("svg",{width:"15",height:"15",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.2",strokeLinecap:"round","aria-hidden":!0,children:[a("circle",{cx:"11",cy:"11",r:"6.5"}),a("path",{d:"M16 16l4 4"})]}),a("input",{ref:L,className:"asg-input",type:"text",placeholder:"Assign to\u2026",value:g,tabIndex:n?0:-1,role:"combobox","aria-expanded":n,"aria-controls":j,"aria-autocomplete":"list","aria-activedescendant":n&&E[v]?`${m}-o-${E[v].id}`:void 0,autoComplete:"off",spellCheck:!1,onChange:e=>{M(e.target.value),h(0)},onKeyDown:_})]}),r("ul",{ref:k,id:j,className:"asg-list",role:"listbox","aria-multiselectable":"true","aria-label":"Teammates",children:[E.map((e,t)=>{let i=C.includes(e.id);return r("li",{id:`${m}-o-${e.id}`,"data-i":t,role:"option","aria-selected":i,className:"asg-opt","data-active":t===v,onPointerMove:()=>h(t),onPointerDown:c=>c.preventDefault(),onClick:c=>q(e.id,c.currentTarget.querySelector(".asg-av")),children:[a(R,{p:e}),a("span",{className:"asg-name",children:e.name}),e.role&&a("span",{className:"asg-role",children:e.role}),a("span",{className:"asg-check","data-on":i,"aria-hidden":!0,children:a("svg",{width:"12",height:"12",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3.4",strokeLinecap:"round",strokeLinejoin:"round",children:a("path",{d:"M5 12.5l4.5 4.5L19 7.5"})})})]},e.id)}),E.length===0&&r("li",{className:"asg-none",role:"presentation",children:["No one matches \u201C",g.trim(),"\u201D"]})]})]}),X.map(e=>{let t=A.get(e.id);return t?a(se,{f:e,p:t,onDone:()=>G(e.key,e.id)},e.key):null})]})]})}function se({f:s,p:u,onDone:p}){let f=d(null),m=d(p);return m.current=p,N(()=>{let b=f.current;if(!b)return;let y=s.from.left-s.root.left,w=s.from.top-s.root.top,L=s.from.width/x,k=s.to.x-s.root.left,n=s.to.y-s.root.top,S=y+(k-y)*.55,g=Math.min(w,n)-34,M=b.animate([{transform:`translate(${y}px, ${w}px) scale(${L})`},{transform:`translate(${S}px, ${g}px) scale(1.18)`,offset:.55},{transform:`translate(${k}px, ${n}px) scale(1)`}],{duration:520,easing:"cubic-bezier(.45, 0, .25, 1)",fill:"forwards"});return M.onfinish=()=>m.current(),()=>M.cancel()},[s]),a("span",{ref:f,className:"asg-flyer","aria-hidden":!0,children:a(R,{p:u})})}function R({p:s}){let u=s.name.split(/\s+/).filter(Boolean).map(f=>f[0]).slice(0,2).join("").toUpperCase(),p=s.color??"#1f2937";return a("span",{className:"asg-av",style:{"--bg":p,"--fg":ne(p)},children:u})}function ne(s){let u=/^#?([\da-f]{6})$/i.exec(s);if(!u)return"#fff";let p=parseInt(u[1],16);return(.299*(p>>16)+.587*(p>>8&255)+.114*(p&255))/255>.62?"#1b1d21":"#fff"}var oe=`
.asg {
  --ink: #18191c;
  --mute: #6c7078;
  --line: rgb(24 25 28 / .09);
  position: relative;
  width: 340px;
  max-width: 100%;
  font-family: inherit;
  color: var(--ink);
}
.asg-task {
  padding: 14px 16px 16px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 0 0 1px var(--line), 0 1px 2px rgb(24 25 28 / .04), 0 18px 40px -26px rgb(24 25 28 / .35);
}
.asg-head { display: flex; align-items: center; justify-content: space-between; height: 34px; }
.asg-id { font: 500 12px/1 ui-monospace, "SF Mono", Menlo, monospace; color: var(--mute); letter-spacing: .02em; }

/* ------------------------------------------------ the control */
.asg-ctl {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  height: 34px;
  margin-left: -6px;
  padding: 0 11px 0 4px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 160ms ease, transform 200ms cubic-bezier(.3, 1.4, .5, 1);
}
.asg-ctl:hover, .asg-ctl[aria-expanded="true"] { background: rgb(24 25 28 / .05); }
.asg-ctl:active { transform: scale(.97); }
.asg-ctl:focus-visible { outline: 2px solid var(--tone); outline-offset: 2px; }
.asg-ctl[data-empty="true"] { padding-left: 4px; }
.asg-stack {
  position: relative;
  display: block;
  height: ${x}px;
  flex: none;
  transition: width 380ms cubic-bezier(.3, 1.25, .5, 1);
}
.asg-ctl[data-empty="true"] .asg-stack { margin-right: -7px; }
.asg-slot {
  position: absolute;
  left: 0;
  top: 0;
  transform: translateX(var(--x));
  transition: transform 380ms cubic-bezier(.3, 1.3, .5, 1);
}
.asg-slot .asg-av { box-shadow: 0 0 0 2px #fff; }
.asg-slot[data-wait="true"] { visibility: hidden; }
.asg-slot[data-wait="false"] .asg-av { animation: asg-land 360ms cubic-bezier(.3, 1.6, .5, 1); }
.asg-slot[data-out="true"] .asg-av { animation: asg-out 220ms cubic-bezier(.5, 0, .9, .4) forwards; }
@keyframes asg-land { 0% { scale: .82; } 55% { scale: 1.1; } 100% { scale: 1; } }
@keyframes asg-out { to { scale: .2; opacity: 0; } }
.asg-plus {
  display: grid;
  place-items: center;
  width: ${x}px;
  height: ${x}px;
  flex: none;
  border-radius: 999px;
  color: var(--mute);
  box-shadow: inset 0 0 0 1.5px rgb(24 25 28 / .22);
  background: #fff;
}
.asg-ctl:not([data-empty="true"]) .asg-plus { margin-left: -2px; }
.asg-plus svg { display: block; }
.asg-ctl[data-empty="true"] .asg-plus { box-shadow: none; outline: 1.5px dashed rgb(24 25 28 / .3); outline-offset: -1.5px; }
.asg-word { line-height: 1; }

.asg-av {
  display: grid;
  place-items: center;
  width: ${x}px;
  height: ${x}px;
  border-radius: 999px;
  background: var(--bg);
  color: var(--fg);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .02em;
  line-height: 1;
  flex: none;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / .06);
}

/* ------------------------------------------------ the task */
.asg-title { margin: 12px 0 0; font-size: 16.5px; font-weight: 650; letter-spacing: -0.015em; line-height: 1.3; text-wrap: balance; }
.asg-desc { margin: 6px 0 0; font-size: 13.5px; line-height: 1.45; color: var(--mute); text-wrap: pretty; }
.asg-foot { display: flex; align-items: center; gap: 8px; margin-top: 16px; font-size: 12.5px; font-weight: 550; }
.asg-status, .asg-label, .asg-due { display: inline-flex; align-items: center; gap: 6px; height: 24px; padding: 0 9px; border-radius: 7px; box-shadow: inset 0 0 0 1px var(--line); }
.asg-status i { width: 10px; height: 10px; border-radius: 99px; border: 2px solid #f5a524; background: conic-gradient(#f5a524 0 50%, transparent 0); }
.asg-label[data-k="bug"] { color: #d93a3f; background: #fff1f1; box-shadow: none; }
.asg-due { margin-left: auto; color: var(--mute); }
.asg-due svg { display: block; }

/* ------------------------------------------------ the list */
.asg-pop {
  position: absolute;
  z-index: 20;
  top: 44px;
  left: 6px;
  width: 256px;
  padding: 6px;
  border-radius: 14px;
  background: #fff;
  box-shadow:
    0 0 0 1px rgb(24 25 28 / .08),
    0 2px 4px rgb(24 25 28 / .06),
    0 22px 44px -14px rgb(24 25 28 / .36);
  transform-origin: 30px -6px;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-6px) scale(.96);
  transition: opacity 120ms ease, transform 160ms cubic-bezier(.4, 0, 1, 1), visibility 0s linear 160ms;
}
.asg-pop[data-open="true"] {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition: opacity 140ms ease, transform 340ms cubic-bezier(.3, 1.3, .5, 1), visibility 0s;
}
.asg-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px;
  margin-bottom: 4px;
  border-bottom: 1px solid var(--line);
  color: var(--mute);
}
.asg-search svg { display: block; flex: none; }
.asg-input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 14px;
}
.asg-input::placeholder { color: rgb(24 25 28 / .4); }
.asg-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 154px;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.asg-opt {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 36px;
  padding: 0 8px;
  border-radius: 9px;
  cursor: pointer;
  font-size: 13.5px;
  user-select: none;
  -webkit-user-select: none;
}
.asg-opt[data-active="true"] { background: color-mix(in srgb, var(--tone) 9%, #fff); }
.asg-opt .asg-av { width: 24px; height: 24px; font-size: 9.5px; }
.asg-name { font-weight: 600; white-space: nowrap; }
.asg-role { color: var(--mute); font-size: 12.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.asg-check {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  margin-left: auto;
  flex: none;
  border-radius: 6px;
  color: #fff;
  box-shadow: inset 0 0 0 1.5px rgb(24 25 28 / .2);
  transition: background 140ms ease, box-shadow 140ms ease, transform 260ms cubic-bezier(.3, 1.6, .5, 1);
}
.asg-check svg { display: block; opacity: 0; transform: scale(.4); transition: opacity 100ms ease, transform 260ms cubic-bezier(.3, 1.6, .5, 1); }
.asg-check[data-on="true"] { background: var(--tone); box-shadow: none; }
.asg-check[data-on="true"] svg { opacity: 1; transform: none; }
.asg-opt:active .asg-check { transform: scale(.88); }
.asg-none { padding: 12px 8px; font-size: 13px; color: var(--mute); }

.asg-flyer { position: absolute; left: 0; top: 0; z-index: 40; pointer-events: none; will-change: transform; }
.asg-flyer .asg-av { box-shadow: 0 0 0 2px #fff, 0 8px 16px -6px rgb(24 25 28 / .45); }

@media (prefers-reduced-motion: reduce) {
  .asg-pop, .asg-pop[data-open="true"] { transform: none; }
  .asg-stack, .asg-slot { transition: none; }
  .asg-slot[data-wait="false"] .asg-av { animation: none; }
  .asg-slot[data-out="true"] .asg-av { animation-duration: 1ms; }
  .asg-check, .asg-check svg { transition-duration: 1ms; }
}
`;export{ae as default};
