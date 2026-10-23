"use client";
/* Construct · Design library: the compiled preview of "Profile card". The source is for members. */
import{useEffect as z,useId as F,useLayoutEffect as B,useRef as i,useState as w}from"react";import{Fragment as j,jsx as e,jsxs as a}from"react/jsx-runtime";function E({handle:o="maya.codes",name:r="Maya Chen",bio:s="Design engineer at Loop. Fewer screens, happier people.",followers:c=18642,following:p=412,cover:h="#c6f135",delay:d=250,onFollow:u}){let l=F(),b=i(null),m=i(null),n=i(0),g=i(!1),y=i(!1),[f,x]=w(!1),[k,S]=w(!1),[T,L]=w(!1),v=(t,N)=>{clearTimeout(n.current),n.current=window.setTimeout(()=>x(t),N)};z(()=>()=>clearTimeout(n.current),[]),z(()=>{if(!f||!g.current)return;let t=N=>{b.current?.contains(N.target)||x(!1)};return document.addEventListener("pointerdown",t),()=>document.removeEventListener("pointerdown",t)},[f]);let C=()=>{let t=!k;S(t),L(t),u?.(t)};return a(j,{children:[e("style",{children:Y}),e("div",{className:"pfc",style:{"--cover":h},children:a("article",{className:"pfc-post",children:[a("header",{className:"pfc-head",children:[a("span",{ref:b,className:"pfc-anchor",onPointerEnter:t=>{t.pointerType!=="touch"&&(g.current=!1,v(!0,f?0:d))},onPointerLeave:t=>{t.pointerType!=="touch"&&v(!1,220)},onBlur:t=>{t.currentTarget.contains(t.relatedTarget)||v(!1,0)},onKeyDown:t=>{t.key==="Escape"&&f&&(t.preventDefault(),clearTimeout(n.current),x(!1),y.current=!0,m.current?.focus(),y.current=!1)},children:[a("button",{ref:m,type:"button",className:"pfc-who","aria-expanded":f,"aria-controls":l,"aria-label":`${r}, @${o}`,onPointerDown:t=>g.current=t.pointerType==="touch",onFocus:t=>{!y.current&&t.currentTarget.matches(":focus-visible")&&v(!0,0)},onClick:()=>{clearTimeout(n.current),x(t=>g.current?!t:!0)},children:[e(M,{size:30}),a("span",{className:"pfc-handle",children:["@",o]})]}),a("div",{id:l,className:"pfc-card","data-open":f,role:"group","aria-label":`${r}'s profile`,children:[e("div",{className:"pfc-cover","aria-hidden":!0}),a("div",{className:"pfc-body",children:[a("div",{className:"pfc-top",children:[e("span",{className:"pfc-big",children:e(M,{size:60})}),e(P,{on:k,fresh:T,onToggle:C,onLeave:()=>L(!1),name:r})]}),a("div",{className:"pfc-name",children:[r,e(H,{})]}),a("div",{className:"pfc-sub",children:["@",o]}),e("p",{className:"pfc-bio",children:s}),a("div",{className:"pfc-counts",children:[a("span",{children:[e("b",{children:p.toLocaleString("en-US")})," Following"]}),a("span",{children:[e("b",{children:e(W,{value:c+(k?1:0)})})," ","Followers"]})]})]})]})]}),e("span",{className:"pfc-time",children:"\xB7 2h"}),e("span",{className:"pfc-more","aria-hidden":!0,children:a("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"currentColor",children:[e("circle",{cx:"5",cy:"12",r:"1.7"}),e("circle",{cx:"12",cy:"12",r:"1.7"}),e("circle",{cx:"19",cy:"12",r:"1.7"})]})})]}),e("p",{className:"pfc-text",children:"Onboarding v2 is live: three screens instead of nine."}),a("div",{className:"pfc-shot","aria-hidden":!0,children:[a("span",{className:"pfc-phone","data-k":"1",children:[e("i",{className:"pfc-bar"}),e("i",{className:"pfc-blob"}),e("i",{className:"pfc-btn"})]}),a("span",{className:"pfc-phone","data-k":"2",children:[e("i",{className:"pfc-bar"}),e("i",{className:"pfc-blob"}),e("i",{className:"pfc-btn"})]}),a("span",{className:"pfc-phone","data-k":"3",children:[e("i",{className:"pfc-bar"}),e("i",{className:"pfc-blob"}),e("i",{className:"pfc-btn"})]})]}),a("footer",{className:"pfc-acts","aria-hidden":!0,children:[a("span",{children:[e("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.9",strokeLinejoin:"round",children:e("path",{d:"M4 5.5h16v10H10l-4.5 3.5V15.5H4z"})}),"24"]}),a("span",{children:[e("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",strokeLinejoin:"round",children:e("path",{d:"M7 4 4 7l3 3M4 7h12a3 3 0 0 1 3 3v1M17 20l3-3-3-3M20 17H8a3 3 0 0 1-3-3v-1"})}),"9"]}),a("span",{children:[e("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.9",strokeLinejoin:"round",children:e("path",{d:"M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10z"})}),"312"]})]})]})})]})}function P({on:o,fresh:r,onToggle:s,onLeave:c,name:p}){let h=i(null),d=i(null),u=i(null),[l,b]=w(null);B(()=>{let n=()=>{d.current&&u.current&&b([d.current.offsetWidth,u.current.offsetWidth])};n(),document.fonts?.ready.then(n).catch(()=>{})},[]);let m=i(!0);return z(()=>{if(m.current){m.current=!1;return}let n=h.current;n&&(n.removeAttribute("data-pop"),n.offsetWidth,n.setAttribute("data-pop","true"))},[o]),e("button",{ref:h,type:"button",className:"pfc-follow","data-on":o,"data-fresh":r,"aria-pressed":o,"aria-label":o?`Following ${p}`:`Follow ${p}`,onClick:s,onPointerLeave:c,onBlur:c,style:l?{"--w":`${o?l[1]:l[0]}px`}:void 0,children:a("span",{className:"pfc-fw","aria-hidden":!0,children:[e("span",{ref:d,className:"pfc-fl","data-show":!o,children:"Follow"}),a("span",{ref:u,className:"pfc-fl pfc-ing","data-show":o,children:[e("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"3",strokeLinecap:"round",strokeLinejoin:"round",children:e("path",{d:"M5 12.5l4.5 4.5L19 7.5"})}),"Following"]}),e("span",{className:"pfc-fl pfc-un","data-show":o,children:"Unfollow"})]})})}function W({value:o}){let r=o.toLocaleString("en-US").split("");return e("span",{className:"pfc-num","aria-label":o.toLocaleString("en-US"),children:r.map((s,c)=>/\d/.test(s)?e("span",{className:"pfc-slot","aria-hidden":!0,children:e("span",{className:"pfc-col",style:{"--n":Number(s)},children:"0123456789".split("").map(p=>e("span",{children:p},p))})},r.length-c):e("span",{"aria-hidden":!0,children:s},r.length-c))})}function M({size:o}){return e("span",{className:"pfc-face",style:{width:o,height:o},"aria-hidden":!0,children:a("svg",{viewBox:"7 7 50 50",width:o,height:o,children:[e("rect",{x:"0",y:"0",width:"64",height:"64",fill:"#ff7a2f"}),e("path",{d:"M13 36c0-14 8.5-23 19-23s19 9 19 23v12c0 3.5-2.5 6-6 6H19c-3.5 0-6-2.5-6-6z",fill:"#2a1b14"}),e("path",{d:"M27 42h10v11H27z",fill:"#e2a47c"}),e("path",{d:"M8 66c2-10 11.5-15 24-15s22 5 24 15z",fill:"#111214"}),e("path",{d:"M24 51.5c2.2 2 4.9 3 8 3s5.8-1 8-3",stroke:"#c6f135",strokeWidth:"2.4",fill:"none",strokeLinecap:"round"}),e("ellipse",{cx:"32",cy:"34",rx:"12.5",ry:"14",fill:"#f4c6a3"}),e("path",{d:"M19.2 32c.6-10 6.4-16 13.6-16 7 0 12.4 5.4 12.4 13-6.4-.4-11.6-2.8-14.6-7-2 4.6-6.4 8.4-11.4 10z",fill:"#2a1b14"}),e("ellipse",{cx:"27",cy:"35",rx:"1.5",ry:"1.8",fill:"#2a1b14"}),e("ellipse",{cx:"37",cy:"35",rx:"1.5",ry:"1.8",fill:"#2a1b14"}),e("path",{d:"M28.6 41c2 1.8 4.8 1.8 6.8 0",stroke:"#2a1b14",strokeWidth:"1.6",fill:"none",strokeLinecap:"round"}),e("circle",{cx:"24",cy:"39.5",r:"2.2",fill:"#ff7a6b",opacity:".4"}),e("circle",{cx:"40",cy:"39.5",r:"2.2",fill:"#ff7a6b",opacity:".4"})]})})}var H=()=>a("svg",{className:"pfc-tick",width:"16",height:"16",viewBox:"0 0 24 24","aria-label":"Verified",children:[e("path",{d:"M12 2.5l2.3 1.7 2.8-.2.9 2.7 2.4 1.5-.6 2.8 1.2 2.6-2 2 .1 2.8-2.7.7-1.5 2.4-2.7-.8-2.6 1.3-2-2-2.8.1-.7-2.7-2.4-1.5.8-2.7L2.6 12l2-2-.1-2.8 2.7-.7 1.5-2.4 2.7.8z",fill:"#111214"}),e("path",{d:"M8.3 12.3l2.5 2.5 4.9-5",stroke:"var(--cover)",strokeWidth:"2.2",fill:"none",strokeLinecap:"round",strokeLinejoin:"round"})]}),Y=`
.pfc {
  --ink: #111214;
  --mute: #6b6f76;
  --line: rgb(17 18 20 / .08);
  font-family: inherit;
  color: var(--ink);
  width: 340px;
  max-width: 100%;
}
.pfc-post {
  position: relative;
  padding: 16px 16px 14px;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 0 0 1px var(--line), 0 1px 2px rgb(17 18 20 / .04), 0 18px 40px -26px rgb(17 18 20 / .35);
}
.pfc-head { display: flex; align-items: center; gap: 4px; height: 32px; }
.pfc-anchor { position: relative; display: inline-flex; z-index: 2; }
.pfc-who {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: -3px;
  padding: 3px 8px 3px 3px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background 160ms ease;
}
.pfc-who:hover, .pfc-who[aria-expanded="true"] { background: rgb(17 18 20 / .05); }
.pfc-who:focus-visible { outline: 2px solid var(--ink); outline-offset: 1px; }
.pfc-handle { font-size: 14.5px; font-weight: 650; letter-spacing: -0.01em; }
.pfc-who:hover .pfc-handle { text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1.5px; }
.pfc-time { font-size: 14px; color: var(--mute); }
.pfc-more { margin-left: auto; color: var(--mute); display: inline-flex; }
.pfc-more svg, .pfc-acts svg { display: block; flex: none; }

.pfc-face { display: inline-block; flex: none; border-radius: 999px; overflow: hidden; }
.pfc-face svg { display: block; }

.pfc-text { margin: 8px 0 0; font-size: 15px; line-height: 1.45; letter-spacing: -0.005em; text-wrap: pretty; }

/* the attachment: three little onboarding screens, drawn */
.pfc-shot {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 10px;
  height: 104px;
  margin-top: 12px;
  border-radius: 14px;
  background: #f4f6ef;
  box-shadow: inset 0 0 0 1px var(--line);
  overflow: hidden;
}
.pfc-phone {
  position: relative;
  width: 62px;
  height: 92px;
  margin-bottom: -10px;
  border-radius: 14px;
  box-shadow: 0 0 0 3px var(--ink), 0 10px 18px -10px rgb(17 18 20 / .6);
}
.pfc-phone[data-k="1"] { background: var(--cover); transform: rotate(-6deg) translateY(4px); }
.pfc-phone[data-k="2"] { background: var(--ink); transform: translateY(-4px); }
.pfc-phone[data-k="3"] { background: #ff7a2f; transform: rotate(6deg) translateY(4px); }
.pfc-phone i { position: absolute; left: 9px; right: 9px; border-radius: 99px; }
.pfc-bar { top: 12px; height: 5px; right: 26px !important; background: rgb(17 18 20 / .5); }
.pfc-blob { top: 26px; height: 24px; width: 24px; border-radius: 999px !important; background: #fff; }
.pfc-btn { bottom: 18px; height: 11px; background: var(--ink); }
.pfc-phone[data-k="2"] .pfc-bar { background: rgb(255 255 255 / .5); }
.pfc-phone[data-k="2"] .pfc-blob { background: var(--cover); left: 19px; }
.pfc-phone[data-k="2"] .pfc-btn { background: #fff; }
.pfc-phone[data-k="3"] .pfc-blob { width: auto; right: 9px; height: 18px; border-radius: 6px !important; background: rgb(255 255 255 / .9); }

.pfc-acts { display: flex; gap: 22px; margin-top: 12px; font-size: 13px; color: var(--mute); font-variant-numeric: tabular-nums; }
.pfc-acts span { display: inline-flex; align-items: center; gap: 6px; }

/* ------------------------------------------------ the card */
.pfc-card {
  position: absolute;
  top: calc(100% + 10px);
  left: -8px;
  width: 314px;
  max-width: calc(100vw - 32px);
  border-radius: 18px;
  background: #fff;
  overflow: hidden;
  box-shadow:
    0 0 0 1px rgb(17 18 20 / .07),
    0 2px 4px rgb(17 18 20 / .06),
    0 24px 48px -16px rgb(17 18 20 / .38);
  transform-origin: 26px -10px;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-8px) scale(.9);
  transition: opacity 140ms ease, transform 180ms cubic-bezier(.4, 0, 1, 1), visibility 0s linear 180ms;
}
.pfc-card[data-open="true"] {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: none;
  transition: opacity 160ms ease, transform 460ms cubic-bezier(.3, 1.35, .5, 1), visibility 0s;
}
/* an invisible bridge over the gap, so moving into the card never "leaves" */
.pfc-card::before { content: ""; position: absolute; left: 0; right: 0; top: -12px; height: 12px; }
.pfc-cover {
  height: 52px;
  background:
    radial-gradient(circle at center, rgb(17 18 20 / .9) 1.1px, transparent 1.6px) 0 0 / 7px 7px,
    var(--cover);
  position: relative;
}
/* fade the dot screen out towards the left, so it reads as a print, not a pattern */
.pfc-cover::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, var(--cover) 34%, transparent 96%);
}
.pfc-body { padding: 0 14px 14px; }
.pfc-top { display: flex; justify-content: space-between; align-items: flex-end; margin-top: -30px; position: relative; }
.pfc-big { display: inline-flex; border-radius: 999px; box-shadow: 0 0 0 3px #fff; }
.pfc-card .pfc-big, .pfc-card .pfc-follow, .pfc-card .pfc-name, .pfc-card .pfc-sub, .pfc-card .pfc-bio, .pfc-card .pfc-counts {
  transition: transform 160ms ease, opacity 120ms ease;
}
.pfc-card[data-open="false"] .pfc-big { transform: scale(.7); }
.pfc-card[data-open="false"] .pfc-follow { transform: translateY(6px); opacity: 0; }
.pfc-card[data-open="false"] .pfc-name,
.pfc-card[data-open="false"] .pfc-sub,
.pfc-card[data-open="false"] .pfc-bio,
.pfc-card[data-open="false"] .pfc-counts { transform: translateY(6px); opacity: 0; }
.pfc-card[data-open="true"] .pfc-big { transition: transform 520ms cubic-bezier(.3, 1.6, .5, 1) 50ms; }
.pfc-card[data-open="true"] .pfc-follow { transition: transform 420ms cubic-bezier(.3, 1.4, .5, 1) 110ms, opacity 200ms ease 110ms, width 360ms cubic-bezier(.3, 1.3, .5, 1), background 180ms ease, color 180ms ease, box-shadow 180ms ease; }
.pfc-card[data-open="true"] .pfc-name { transition: transform 380ms cubic-bezier(.3, 1.3, .5, 1) 70ms, opacity 200ms ease 70ms; }
.pfc-card[data-open="true"] .pfc-sub { transition: transform 380ms cubic-bezier(.3, 1.3, .5, 1) 95ms, opacity 200ms ease 95ms; }
.pfc-card[data-open="true"] .pfc-bio { transition: transform 380ms cubic-bezier(.3, 1.3, .5, 1) 120ms, opacity 200ms ease 120ms; }
.pfc-card[data-open="true"] .pfc-counts { transition: transform 380ms cubic-bezier(.3, 1.3, .5, 1) 145ms, opacity 200ms ease 145ms; }

.pfc-name { display: flex; align-items: center; gap: 5px; margin-top: 8px; font-size: 16.5px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.2; }
.pfc-tick { display: block; flex: none; }
.pfc-sub { font-size: 13.5px; color: var(--mute); line-height: 1.3; }
.pfc-bio { margin: 8px 0 0; font-size: 13.5px; line-height: 1.4; text-wrap: pretty; }
.pfc-counts { display: flex; gap: 14px; margin-top: 10px; font-size: 13px; color: var(--mute); }
.pfc-counts b { color: var(--ink); font-weight: 700; font-variant-numeric: tabular-nums; }

/* ------------------------------------------------ follow */
.pfc-follow {
  --w: 3.6em;
  position: relative;
  height: 34px;
  padding: 0 16px;
  margin-bottom: 2px;
  border: 0;
  border-radius: 999px;
  background: var(--ink);
  color: #fff;
  font: inherit;
  font-size: 13.5px;
  font-weight: 700;
  letter-spacing: -0.005em;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .14);
}
.pfc-follow:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.pfc-follow:active { transform: scale(.96) !important; }
.pfc-follow[data-on="true"] { background: #fff; color: var(--ink); box-shadow: inset 0 0 0 1.5px rgb(17 18 20 / .16); }
.pfc-follow[data-on="true"][data-fresh="false"]:hover { background: #fff1f1; color: #e5484d; box-shadow: inset 0 0 0 1.5px rgb(229 72 77 / .35); }
.pfc-follow[data-pop="true"] { animation: pfc-pop 420ms cubic-bezier(.3, 1.4, .5, 1); }
@keyframes pfc-pop { 0% { scale: 1; } 30% { scale: .9 1.06; } 65% { scale: 1.04 .97; } 100% { scale: 1; } }
.pfc-fw { position: relative; display: block; width: var(--w); height: 100%; transition: width 360ms cubic-bezier(.3, 1.3, .5, 1); }
.pfc-fl {
  position: absolute;
  left: 50%;
  top: 50%;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: max-content;
  white-space: nowrap;
  opacity: 0;
  transform: translate(-50%, calc(-50% + 12px));
  transition: transform 160ms cubic-bezier(.4, 0, 1, 1), opacity 100ms ease;
}
.pfc-fl[data-show="true"] {
  opacity: 1;
  transform: translate(-50%, -50%);
  transition: transform 380ms cubic-bezier(.3, 1.4, .5, 1) 60ms, opacity 180ms ease 60ms;
}
.pfc-fl svg { display: block; flex: none; }
.pfc-ing path { stroke-dasharray: 24; stroke-dashoffset: 24; transition: stroke-dashoffset 0s; }
.pfc-ing[data-show="true"] path { stroke-dashoffset: 0; transition: stroke-dashoffset 340ms cubic-bezier(.6, 0, .2, 1) 160ms; }
/* "Unfollow" takes Following's place on hover, but only after you've left it once */
.pfc-un { visibility: hidden; }
.pfc-follow[data-on="true"][data-fresh="false"]:hover .pfc-ing { opacity: 0; }
.pfc-follow[data-on="true"][data-fresh="false"]:hover .pfc-un { visibility: visible; }
.pfc-follow:not(:hover) .pfc-un, .pfc-follow[data-fresh="true"] .pfc-un { opacity: 0; }

.pfc-num { display: inline-flex; }
.pfc-slot {
  display: inline-block;
  height: 1.2em;
  line-height: 1.2em;
  overflow: hidden;
  vertical-align: bottom;
}
.pfc-col {
  display: grid;
  transform: translateY(calc(var(--n) * -1.2em));
  transition: transform 520ms cubic-bezier(.3, 1.3, .5, 1);
}
.pfc-col > span { height: 1.2em; text-align: center; }

@media (prefers-reduced-motion: reduce) {
  .pfc-card, .pfc-card[data-open="true"] { transform: none; transition: opacity 160ms ease, visibility 0s linear 160ms; }
  .pfc-card[data-open="true"] { transition: opacity 160ms ease, visibility 0s; }
  .pfc-card .pfc-big, .pfc-card .pfc-follow, .pfc-card .pfc-name, .pfc-card .pfc-sub, .pfc-card .pfc-bio, .pfc-card .pfc-counts { transform: none !important; transition: opacity 160ms ease !important; }
  .pfc-follow[data-pop="true"] { animation: none; }
  .pfc-fl, .pfc-fl[data-show="true"] { transform: translate(-50%, -50%); transition: opacity 120ms ease; }
  .pfc-fw, .pfc-col { transition: none; }
}
`;export{E as default};
