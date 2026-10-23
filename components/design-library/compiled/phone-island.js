"use client";
/* Construct · Design library: the compiled preview of "Island". The source is for members. */
import{useEffect as w,useRef as y,useState as f}from"react";import{Fragment as g,jsx as i,jsxs as e}from"react/jsx-runtime";var A={music:{compact:172,open:152},ride:{compact:178,open:156},call:{compact:176,open:84}},d={title:"Golden Hour",artist:"Lune",length:223};function W({activity:t="ride",wall:o="#ff5a36",expanded:n=!1}){let a=t in A?t:"ride",[s,r]=f(n),[c,b]=f(!0),[$,N]=f(72),[m,z]=f(42),[p,C]=f(!1),[M,S]=f(!1),v=y(null);w(()=>r(n),[n]),w(()=>{let l=setInterval(()=>{N(h=>B.current?(h+1)%d.length:h),z(h=>P.current?h:h+1)},1e3);return()=>clearInterval(l)},[]);let B=y(c);B.current=c;let P=y(p);P.current=p,w(()=>{if(!p)return;let l=setTimeout(()=>{C(!1),z(0),S(!1)},2e3);return()=>clearTimeout(l)},[p]);let L=A[a],Y=s?300:p&&a==="call"?150:L.compact,R=s?L.open:34,I=a==="music"?`${c?"Playing":"Paused"}: ${d.title} by ${d.artist}`:a==="ride"?"Your ride arrives in 3 minutes":p?"Call ended":`Call with Ana L\xF3pez, ${u(m)}`;return e(g,{children:[i("style",{children:F}),e("div",{className:"isl",style:{"--wall":o},children:[i("div",{className:"isl-phone","aria-hidden":!0}),i("i",{className:"isl-key","data-k":"action","aria-hidden":!0}),i("i",{className:"isl-key","data-k":"up","aria-hidden":!0}),i("i",{className:"isl-key","data-k":"down","aria-hidden":!0}),i("i",{className:"isl-key","data-k":"power","aria-hidden":!0}),e("div",{className:"isl-screen",children:[i("div",{className:"isl-wall","aria-hidden":!0}),e("div",{className:"isl-status","aria-hidden":!0,children:[e("span",{className:"isl-st-left",children:[i(V,{}),i(q,{})]}),i("span",{className:"isl-st-right",children:i("span",{className:"isl-batt",children:i("i",{})})})]}),e("div",{className:"isl-lock","aria-hidden":!0,children:[i("span",{className:"isl-date",children:"Thursday 23 October"}),i("span",{className:"isl-time",children:"9:41"})]}),e("div",{className:"isl-pill","data-open":s,"data-kind":a,"data-ended":p,style:{width:Y,height:R},onKeyDown:l=>{l.key==="Escape"&&s&&(l.preventDefault(),r(!1),v.current?.focus())},children:[i("button",{ref:v,type:"button",className:"isl-hit","aria-expanded":s,"aria-label":`${I}. ${s?"Show less":"Show more"}`,onClick:()=>r(l=>!l)}),e("div",{className:"isl-compact","aria-hidden":!0,children:[a==="music"&&e(g,{children:[i("span",{className:"isl-art","data-s":"sm"}),i(k,{on:c,tone:"#ffd23f"})]}),a==="ride"&&e(g,{children:[i("span",{className:"isl-carmini",children:i(G,{})}),i("span",{className:"isl-eta",children:"3 min"})]}),a==="call"&&(p?e(g,{children:[i("span",{className:"isl-phoneic","data-end":"true",children:i(E,{})}),i("span",{className:"isl-ended",children:"Ended"})]}):e(g,{children:[e("span",{className:"isl-calltime",children:[i("span",{className:"isl-phoneic",children:i(E,{})}),u(m)]}),i(k,{on:!M,tone:"#30d158",voice:!0})]}))]}),e("div",{className:"isl-full","aria-hidden":!s,children:[a==="music"&&i(D,{playing:c,pos:$,open:s,onPlay:()=>b(l=>!l),onSkip:l=>N(h=>l<0?0:Math.min(d.length-1,h+15))}),a==="ride"&&i(H,{open:s}),a==="call"&&i(T,{open:s,t:m,muted:M,onMute:()=>S(l=>!l),onEnd:()=>{C(!0),r(!1),v.current?.focus()}})]})]})]})]})]})}function D({playing:t,pos:o,open:n,onPlay:a,onSkip:s}){let r=n?0:-1;return e("div",{className:"isl-music",children:[e("div",{className:"isl-row",children:[i("span",{className:"isl-art","data-s":"lg"}),e("span",{className:"isl-meta",children:[i("b",{children:d.title}),i("span",{children:d.artist})]}),i(k,{on:t,tone:"#ffd23f"})]}),e("div",{className:"isl-prog",children:[i("span",{children:u(o)}),i("span",{className:"isl-track",children:i("i",{style:{width:`${o/d.length*100}%`}})}),e("span",{children:["-",u(d.length-o)]})]}),e("div",{className:"isl-ctrls",children:[i(x,{tab:r,label:"Previous",onClick:()=>s(-1),children:i("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"currentColor",children:i("path",{d:"M11 12l8.5-5.5v11zM2.5 12L11 6.5v11z"})})}),i(x,{tab:r,label:t?"Pause":"Play",onClick:a,big:!0,children:t?e("svg",{width:"30",height:"30",viewBox:"0 0 24 24",fill:"currentColor",children:[i("rect",{x:"6",y:"4.5",width:"4",height:"15",rx:"1.2"}),i("rect",{x:"14",y:"4.5",width:"4",height:"15",rx:"1.2"})]}):i("svg",{width:"30",height:"30",viewBox:"0 0 24 24",fill:"currentColor",children:i("path",{d:"M7 4.8v14.4c0 .8.9 1.3 1.6.9l11.3-7.2c.6-.4.6-1.4 0-1.8L8.6 3.9C7.9 3.5 7 4 7 4.8z"})})}),i(x,{tab:r,label:"Skip ahead",onClick:()=>s(1),children:i("svg",{width:"26",height:"26",viewBox:"0 0 24 24",fill:"currentColor",children:i("path",{d:"M13 12L4.5 6.5v11zM21.5 12L13 6.5v11z"})})})]})]})}function H({open:t}){return e("div",{className:"isl-ride","data-open":t,children:[e("div",{className:"isl-row",children:[e("span",{className:"isl-big",children:[i("small",{children:"Pickup in"}),"3 min"]}),i("span",{className:"isl-car",children:i(j,{})})]}),e("div",{className:"isl-route",children:[i("i",{className:"isl-from"}),i("span",{className:"isl-line",children:i("i",{className:"isl-done"})}),i("span",{className:"isl-dot"}),i("i",{className:"isl-pin"})]}),e("div",{className:"isl-row isl-driver",children:[i("span",{className:"isl-ini",children:"DM"}),e("span",{className:"isl-meta",children:[i("b",{children:"Daniel"}),e("span",{children:[i(O,{})," 4.9 \xB7 White Prius"]})]}),i("span",{className:"isl-plate",children:"KX 482 B"})]})]})}function T({open:t,t:o,muted:n,onMute:a,onEnd:s}){let r=t?0:-1;return e("div",{className:"isl-call",children:[i("span",{className:"isl-ini","data-k":"call",children:"AL"}),e("span",{className:"isl-meta",children:[i("b",{children:"Ana L\xF3pez"}),i("span",{className:"isl-tick",children:u(o)})]}),i(x,{tab:r,label:n?"Unmute":"Mute",onClick:a,round:!0,"data-on":n,children:e("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",children:[i("rect",{x:"9",y:"3",width:"6",height:"11",rx:"3",fill:"currentColor",stroke:"none"}),i("path",{d:"M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"}),n&&i("path",{d:"M4 4l16 16",strokeWidth:"2.2"})]})}),i(x,{tab:r,label:"End call",onClick:s,round:!0,end:!0,children:i("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"currentColor",children:i("path",{d:"M12 9c-3.4 0-6.6 1-9 2.9-.6.5-.7 1.4-.3 2l1.4 1.9c.4.6 1.2.8 1.9.5l2.6-1.2c.6-.3.9-.9.9-1.5V12c1-.3 1.9-.4 2.5-.4s1.5.1 2.5.4v1.6c0 .6.3 1.2.9 1.5l2.6 1.2c.7.3 1.5.1 1.9-.5l1.4-1.9c.4-.6.3-1.5-.3-2C18.6 10 15.4 9 12 9z"})})})]})}function x({children:t,label:o,onClick:n,tab:a,big:s,round:r,end:c,...b}){return i("button",{type:"button",className:"isl-btn","data-big":s,"data-round":r,"data-end":c,tabIndex:a,"aria-label":o,onClick:n,...b,children:t})}function k({on:t,tone:o,voice:n}){return i("span",{className:"isl-bars","data-on":t,"data-voice":n,style:{"--bar":o},"aria-hidden":!0,children:[0,1,2,3,4].map(a=>i("i",{style:{"--i":a}},a))})}function u(t){return`${Math.floor(t/60)}:${String(t%60).padStart(2,"0")}`}var j=()=>e("svg",{width:"104",height:"44",viewBox:"0 0 96 40",children:[i("ellipse",{cx:"48",cy:"36.5",rx:"42",ry:"2.4",fill:"#000",opacity:".5"}),i("path",{d:"M8 31c-2.5 0-4-1.6-4-3.6v-4.6c0-2 1.4-3.6 3.4-4l14.6-3 8.6-6.6c1.9-1.4 4-2.2 6.4-2.2h21.8c2.6 0 5 1 6.8 2.8l7.4 7.2 9 1.5c2.9.5 5 3 5 5.9v3.4c0 1.8-1.4 3.2-3.2 3.2z",fill:"#f2f2f5"}),i("path",{d:"M33 14.6l5.6-4.6c1-.8 2.2-1.2 3.4-1.2h9v5.8zM54.4 8.8h8.6c1.7 0 3.3.7 4.4 1.9l3.6 3.9H54.4z",fill:"#1c2230"}),i("path",{d:"M8 23.5h80",stroke:"#30d158",strokeWidth:"2"}),i("rect",{x:"85.5",y:"19",width:"6",height:"3",rx:"1.5",fill:"#ffd60a"}),i("rect",{x:"4",y:"20",width:"4",height:"3",rx:"1.5",fill:"#ff453a"}),i("circle",{cx:"24",cy:"31",r:"7.2",fill:"#0b0b0c"}),i("circle",{cx:"24",cy:"31",r:"3.2",fill:"#9a9aa0"}),i("circle",{cx:"73",cy:"31",r:"7.2",fill:"#0b0b0c"}),i("circle",{cx:"73",cy:"31",r:"3.2",fill:"#9a9aa0"})]}),G=()=>e("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"currentColor",children:[i("path",{d:"M6.2 5.8C6.6 4.7 7.6 4 8.8 4h6.4c1.2 0 2.2.7 2.6 1.8L19.3 10H4.7z",opacity:".55"}),i("rect",{x:"3",y:"9.5",width:"18",height:"7.5",rx:"2.6"}),i("rect",{x:"4.5",y:"16",width:"3.6",height:"4",rx:"1.4"}),i("rect",{x:"15.9",y:"16",width:"3.6",height:"4",rx:"1.4"}),i("circle",{cx:"7.3",cy:"13.2",r:"1.4",fill:"#000"}),i("circle",{cx:"16.7",cy:"13.2",r:"1.4",fill:"#000"})]}),E=()=>i("svg",{width:"14",height:"14",viewBox:"0 0 24 24",fill:"currentColor",children:i("path",{d:"M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z"})}),O=()=>i("svg",{width:"11",height:"11",viewBox:"0 0 24 24",fill:"#ffd60a","aria-hidden":!0,children:i("path",{d:"M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z"})}),V=()=>e("svg",{width:"18",height:"12",viewBox:"0 0 18 12",fill:"#fff",children:[i("rect",{x:"0",y:"8",width:"3",height:"4",rx:"1"}),i("rect",{x:"5",y:"5.5",width:"3",height:"6.5",rx:"1"}),i("rect",{x:"10",y:"3",width:"3",height:"9",rx:"1"}),i("rect",{x:"15",y:"0",width:"3",height:"12",rx:"1"})]}),q=()=>i("svg",{width:"16",height:"12",viewBox:"0 0 16 12",fill:"#fff",children:i("path",{d:"M8 2.2c2.4 0 4.6.9 6.3 2.5l1.2-1.3A10.8 10.8 0 0 0 8 .4C5.1.4 2.5 1.5.5 3.4l1.2 1.3A9 9 0 0 1 8 2.2zM8 5.6c1.5 0 2.9.6 4 1.6l1.2-1.3A7.6 7.6 0 0 0 8 3.8c-2 0-3.8.8-5.2 2.1L4 7.2c1-1 2.5-1.6 4-1.6zM8 9l2.3-2.4a3.3 3.3 0 0 0-4.6 0z",transform:"translate(0 2.4)"})}),F=`
.isl {
  --wall: #ff5a36;
  position: relative;
  width: 356px; /* the phone is 340; the rest is room for its side keys */
  height: 300px;
  max-width: 100%;
  font-family: inherit;
  color: #fff;
  /* the phone continues below; the block shows its top */
  -webkit-mask-image: linear-gradient(#000 74%, transparent 99%);
  mask-image: linear-gradient(#000 74%, transparent 99%);
}
.isl-phone {
  position: absolute;
  inset: 0 8px -60px;
  border-radius: 58px 58px 0 0;
  background: #0c0c0e;
  box-shadow:
    0 0 0 1.5px #8d8f96,
    0 0 0 3px #3b3c41,
    inset 0 0 0 1.5px #2a2b2f,
    0 26px 50px -20px rgb(0 0 0 / .45);
}
.isl-key {
  position: absolute;
  width: 4px;
  border-radius: 2px;
  background: linear-gradient(90deg, #6d6f76, #b8bac1 50%, #6d6f76);
}
.isl-key[data-k="action"] { left: 2px; top: 82px; height: 26px; }
.isl-key[data-k="up"] { left: 2px; top: 128px; height: 46px; }
.isl-key[data-k="down"] { left: 2px; top: 186px; height: 46px; }
.isl-key[data-k="power"] { right: 2px; top: 148px; height: 72px; }
.isl-screen {
  position: absolute;
  inset: 10px 18px -60px;
  border-radius: 48px 48px 0 0;
  overflow: hidden;
  isolation: isolate;
}
.isl-wall {
  position: absolute;
  inset: 0;
  /* a bold, flat wallpaper: two big discs in tints of the colour */
  background:
    radial-gradient(circle at 92% 64%, color-mix(in srgb, var(--wall) 55%, #ffd23f) 0 104px, transparent 105px),
    radial-gradient(circle at 92% 64%, color-mix(in srgb, var(--wall) 78%, #ffd23f) 0 168px, transparent 169px),
    radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--wall) 82%, #000) 0 150px, transparent 151px),
    linear-gradient(color-mix(in srgb, var(--wall) 80%, #fff), var(--wall) 60%);
}
.isl-status {
  position: absolute;
  top: 19px;
  left: 30px;
  right: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 16px;
}
.isl-status svg { display: block; }
.isl-st-left { display: inline-flex; gap: 6px; align-items: center; }
.isl-batt {
  position: relative;
  display: block;
  width: 25px;
  height: 12px;
  padding: 2px;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1.2px rgb(255 255 255 / .55);
}
.isl-batt::after { content: ""; position: absolute; right: -3px; top: 4px; width: 1.6px; height: 4px; border-radius: 0 1px 1px 0; background: rgb(255 255 255 / .55); }
.isl-batt i { display: block; width: 80%; height: 100%; border-radius: 2px; background: #fff; }

.isl-lock {
  position: absolute;
  top: 178px;
  left: 0;
  right: 0;
  display: grid;
  justify-items: center;
  text-shadow: 0 1px 12px rgb(0 0 0 / .08);
}
.isl-date { font-size: 15px; font-weight: 600; opacity: .9; }
.isl-time { font-size: 76px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; margin-top: 2px; font-variant-numeric: tabular-nums; }

/* ------------------------------------------------ the island */
.isl-pill {
  position: absolute;
  z-index: 2;
  top: 11px;
  left: 50%;
  translate: -50% 0;
  border-radius: 20px;
  background: #000;
  overflow: hidden;
  box-shadow: 0 0 0 .5px rgb(255 255 255 / .04);
  transition:
    width 420ms cubic-bezier(.3, 1.2, .4, 1),
    height 380ms cubic-bezier(.3, 1.15, .4, 1),
    border-radius 380ms ease,
    box-shadow 300ms ease;
}
.isl-pill[data-open="true"] {
  border-radius: 40px;
  box-shadow: 0 18px 40px -12px rgb(0 0 0 / .55);
  transition:
    width 560ms cubic-bezier(.3, 1.35, .4, 1),
    height 600ms cubic-bezier(.3, 1.4, .4, 1),
    border-radius 420ms ease,
    box-shadow 300ms ease;
}
.isl-hit {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  border: 0;
  padding: 0;
  margin: 0;
  background: transparent;
  border-radius: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.isl-hit:focus-visible { outline: 2px solid #fff; outline-offset: -2px; }

.isl-compact, .isl-full { position: absolute; pointer-events: none; }
.isl-compact {
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 13px 0 7px;
  opacity: 1;
  filter: blur(0);
  transition: opacity 220ms ease 120ms, filter 260ms ease 120ms;
}
.isl-pill[data-open="true"] .isl-compact { opacity: 0; filter: blur(4px); transition: opacity 90ms ease, filter 90ms ease; }
.isl-full {
  top: 0;
  left: 50%;
  width: 300px;
  translate: -50% 0;
  opacity: 0;
  scale: .9;
  filter: blur(6px);
  transform-origin: 50% 0;
  transition: opacity 100ms ease, scale 200ms ease, filter 120ms ease;
}
.isl-pill[data-open="true"] .isl-full {
  opacity: 1;
  scale: 1;
  filter: blur(0);
  transition: opacity 260ms ease 110ms, scale 520ms cubic-bezier(.3, 1.3, .4, 1) 60ms, filter 280ms ease 110ms;
}
.isl-pill[data-open="true"] .isl-full .isl-btn { pointer-events: auto; }

/* ------------------------------------------------ compact pieces */
.isl-art {
  display: block;
  flex: none;
  border-radius: 7px;
  background:
    radial-gradient(circle at 34% 42%, #ffd23f 0 17%, transparent 18%),
    linear-gradient(transparent 62%, #0a3d62 62% 70%, #0b6e8f 70%),
    linear-gradient(170deg, #ff8a3d, #ff3d71);
}
.isl-art[data-s="sm"] { width: 22px; height: 22px; border-radius: 6px; }
.isl-art[data-s="lg"] { width: 52px; height: 52px; border-radius: 12px; }

.isl-bars { display: inline-flex; align-items: center; gap: 2.4px; height: 16px; }
.isl-bars i {
  display: block;
  width: 2.6px;
  height: 100%;
  border-radius: 2px;
  background: var(--bar);
  transform-origin: 50% 50%;
  transform: scaleY(.25);
  transition: transform 260ms ease;
}
.isl-bars[data-on="true"] i { animation: isl-eq 900ms ease-in-out calc(var(--i) * -170ms) infinite alternate; }
.isl-bars[data-voice="true"][data-on="true"] i { animation-duration: 520ms; }
@keyframes isl-eq {
  0% { transform: scaleY(.25); }
  35% { transform: scaleY(.9); }
  60% { transform: scaleY(.45); }
  100% { transform: scaleY(1); }
}

.isl-carmini { display: grid; place-items: center; width: 22px; height: 22px; color: #30d158; }
.isl-carmini svg { display: block; }
.isl-eta, .isl-calltime, .isl-ended { font-size: 13.5px; font-weight: 650; color: #30d158; font-variant-numeric: tabular-nums; letter-spacing: -0.01em; }
.isl-calltime { display: inline-flex; align-items: center; gap: 6px; padding-left: 5px; }
.isl-phoneic { display: grid; place-items: center; width: 20px; height: 20px; border-radius: 99px; background: #30d158; color: #000; }
.isl-phoneic svg { display: block; width: 11px; height: 11px; }
.isl-phoneic[data-end="true"] { background: #ff453a; margin-left: 2px; }
.isl-phoneic[data-end="true"] svg { transform: rotate(135deg); }
.isl-ended { color: #ff453a; }

/* ------------------------------------------------ expanded pieces */
.isl-row { display: flex; align-items: center; gap: 12px; }
.isl-meta { display: grid; gap: 2px; min-width: 0; flex: 1; }
.isl-meta b { font-size: 15.5px; font-weight: 650; letter-spacing: -0.015em; white-space: nowrap; }
.isl-meta span { display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: rgb(255 255 255 / .55); white-space: nowrap; }
.isl-meta svg { display: block; }

.isl-music { padding: 20px 22px 0; }
.isl-music .isl-bars { align-self: flex-start; margin-top: 6px; }
.isl-prog { display: flex; align-items: center; gap: 10px; margin-top: 14px; font: 500 11px/1 ui-monospace, "SF Mono", Menlo, monospace; color: rgb(255 255 255 / .5); font-variant-numeric: tabular-nums; }
.isl-prog > span:first-child, .isl-prog > span:last-child { width: 34px; }
.isl-prog > span:last-child { text-align: right; }
.isl-track { flex: 1; height: 5px; border-radius: 9px; background: rgb(255 255 255 / .18); overflow: hidden; }
.isl-track i { display: block; height: 100%; border-radius: inherit; background: #fff; transition: width 1s linear; }
.isl-ctrls { display: flex; justify-content: center; align-items: center; gap: 30px; margin-top: 6px; }

.isl-btn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 220ms cubic-bezier(.3, 1.5, .5, 1), background 160ms ease;
}
.isl-btn svg { display: block; }
.isl-btn:hover { background: rgb(255 255 255 / .08); }
.isl-btn:active { transform: scale(.88); }
.isl-btn:focus-visible { outline: 2px solid #fff; outline-offset: 0; }
.isl-btn[data-round="true"] { flex: none; background: rgb(255 255 255 / .16); }
.isl-btn[data-round="true"][data-on="true"] { background: #fff; color: #000; }
.isl-btn[data-end="true"] { background: #ff3b30; }
.isl-btn[data-end="true"]:hover { background: #ff5147; }

.isl-ride { padding: 18px 22px 0; }
.isl-big { display: grid; flex: 1; font-size: 30px; font-weight: 700; letter-spacing: -0.03em; line-height: 1; color: #30d158; font-variant-numeric: tabular-nums; }
.isl-big small { font-size: 12.5px; font-weight: 550; letter-spacing: 0; color: rgb(255 255 255 / .55); margin-bottom: 4px; }
.isl-car svg { display: block; }
.isl-ride[data-open="true"] .isl-car { animation: isl-idle 1.2s ease-in-out infinite; }
@keyframes isl-idle { 50% { transform: translateY(-.8px); } }
.isl-route { position: relative; display: flex; align-items: center; height: 14px; margin-top: 12px; }
.isl-from { width: 8px; height: 8px; border-radius: 99px; background: #fff; flex: none; }
.isl-line {
  position: relative;
  flex: 1;
  height: 3px;
  margin: 0 4px;
  background: repeating-linear-gradient(90deg, rgb(255 255 255 / .28) 0 5px, transparent 5px 9px);
}
.isl-done { position: absolute; left: 0; top: 0; bottom: 0; width: 46%; border-radius: 3px; background: #30d158; transition: width 6s cubic-bezier(.2, 0, .2, 1); }
.isl-ride[data-open="true"] .isl-done { width: 68%; }
.isl-dot {
  position: absolute;
  left: calc(12px + (100% - 28px) * .46);
  top: 50%;
  width: 14px;
  height: 14px;
  margin: -7px 0 0 -7px;
  border-radius: 99px;
  background: #30d158;
  box-shadow: 0 0 0 4px rgb(48 209 88 / .25);
  transition: left 6s cubic-bezier(.2, 0, .2, 1);
}
.isl-ride[data-open="true"] .isl-dot { left: calc(12px + (100% - 28px) * .68); }
.isl-pin { width: 12px; height: 12px; flex: none; border-radius: 3px; background: #fff; box-shadow: inset 0 0 0 3.5px #fff, inset 0 0 0 8px #000; }
.isl-driver { margin-top: 14px; }
.isl-ini {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  border-radius: 999px;
  background: #30d158;
  color: #04210e;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: .02em;
}
.isl-ini[data-k="call"] { width: 46px; height: 46px; font-size: 16px; background: linear-gradient(#a5a9b3, #6e737d); color: #fff; }
.isl-plate {
  padding: 5px 8px;
  border-radius: 6px;
  background: #fff;
  color: #000;
  font: 700 12px/1 ui-monospace, "SF Mono", Menlo, monospace;
  letter-spacing: .06em;
  box-shadow: inset 0 0 0 1.5px #000, inset 0 0 0 3px #fff, inset 0 0 0 3.6px rgb(0 0 0 / .25);
  white-space: nowrap;
}

.isl-call { display: flex; align-items: center; gap: 12px; height: 84px; padding: 0 18px; }
.isl-tick { font-variant-numeric: tabular-nums; color: #30d158 !important; }

@media (prefers-reduced-motion: reduce) {
  .isl-pill, .isl-pill[data-open="true"] { transition: width 1ms, height 1ms, border-radius 1ms; }
  .isl-full, .isl-pill[data-open="true"] .isl-full { scale: 1; filter: none; transition: opacity 200ms ease; }
  .isl-compact, .isl-pill[data-open="true"] .isl-compact { filter: none; }
  .isl-bars[data-on="true"] i { animation: none; transform: scaleY(.6); }
  .isl-ride[data-open="true"] .isl-car { animation: none; }
  .isl-done, .isl-dot { transition: none; }
}
`;export{W as default};
