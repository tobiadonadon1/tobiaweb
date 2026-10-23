"use client";
/* Construct · Design library: the compiled preview of "Dock". The source is for members. */
import{useCallback as T,useEffect as U,useId as ot,useRef as h,useState as k}from"react";import{Fragment as m,jsx as t,jsxs as r}from"react/jsx-runtime";var st=[{id:"files",name:"Harbor",icon:"files"},{id:"calendar",name:"Day",icon:"calendar"},{id:"music",name:"Tide",icon:"music"},{id:"maps",name:"Atlas",icon:"maps"},{id:"weather",name:"Sol",icon:"weather"},{id:"notes",name:"Kiln",icon:"notes"},{id:"terminal",name:"Shell",icon:"terminal"}],p=38,A=4,F=6,Q=980,J={dusk:{sky:["#c8402a","#f08a45","#fbd08c"],mid:"#e2643a",sun:"#fff1c2",hills:["#c4482f","#82202c","#3a0e18"]},lagoon:{sky:["#04545c","#4fb5a5","#d6edcf"],mid:"#178a86",sun:"#fff3c4",hills:["#0a7f7a","#065158","#022b33"]},graphite:{sky:["#18191b","#5a5f66","#a7adb3"],mid:"#36393e",sun:"#eef0f2",hills:["#585d64","#33363b","#141517"]}};function ct({apps:a=st,running:o=["files","music"],magnify:b=60,wallpaper:u="dusk",onLaunch:d}){let l=ot().replace(/:/g,""),f=J[u]??J.dusk,[x,S]=k(o),[I,O]=k(o[o.length-1]??a[0]?.id??""),[Z,v]=k(null),[tt,et]=k(0),[Y,D]=k([]),[nt,N]=k(""),P=h(null),$=h([]),V=h([]),W=h(null),M=h(0),E=h(0),z=h(!1),q=h([]),X=Math.max(p,Math.min(72,b));U(()=>{let n=window.matchMedia("(prefers-reduced-motion: reduce)");z.current=n.matches;let e=()=>z.current=n.matches;n.addEventListener("change",e);let i=q.current;return()=>{n.removeEventListener("change",e),cancelAnimationFrame(M.current),i.forEach(c=>clearTimeout(c))}},[]);let H=T(n=>{let e=P.current?.offsetWidth??0,i=a.length*p+(a.length-1)*A+F*2;return e/2-i/2+F+n*(p+A)+p/2},[a.length]),G=T(n=>{let e=Math.min(48,n-(E.current||n));E.current=n;let i=1-Math.exp(-e/55),c=W.current,s=z.current?p:X,y=(p+A)*1.1,w=!1;a.forEach((pt,C)=>{let _=c===null?1/0:c-H(C),L=p+(s-p)*Math.exp(-(_*_)/(2*y*y)),B=V.current[C]??p,R=Math.abs(L-B)<.05?L:B+(L-B)*i;R!==L&&(w=!0),V.current[C]=R;let j=$.current[C];j&&j.style.setProperty("--s",`${R.toFixed(2)}px`)}),M.current=w?requestAnimationFrame(G):0,w||(E.current=0)},[a,X,H]),g=T(n=>{W.current=n,M.current||(M.current=requestAnimationFrame(G))},[G]);U(()=>g(W.current),[g]);let it=n=>{let e=P.current,i=e.getBoundingClientRect(),c=i.width/(e.offsetWidth||1);return(n-i.left)/c},rt=(n,e)=>{q.current.push(window.setTimeout(n,e))},at=n=>{let e=a[n];if(!(!e||Y.includes(e.id))){if(x.includes(e.id)){S(i=>i.filter(c=>c!==e.id)),N(`${e.name} quit`),I===e.id&&O(x.filter(i=>i!==e.id).slice(-1)[0]??"");return}if(O(e.id),N(`Opening ${e.name}`),z.current){S(i=>[...i,e.id]),d?.(e);return}D(i=>[...i,e.id]),rt(()=>{D(i=>i.filter(c=>c!==e.id)),S(i=>[...i,e.id]),N(`${e.name} is open`),d?.(e)},Q)}},K=a.find(n=>n.id===I)?.name??"Harbor";return r(m,{children:[t("style",{children:ft}),r("div",{ref:P,className:"mdk",style:{"--sky0":f.sky[0],"--sky1":f.sky[1],"--sky2":f.sky[2],"--base":`${p}px`,"--gap":`${A}px`,"--pad":`${F}px`},children:[t(lt,{uid:l,wall:f}),r("div",{className:"mdk-menubar","aria-hidden":!0,children:[t("span",{className:"mdk-mark",children:r("svg",{width:"12",height:"12",viewBox:"0 0 24 24",children:[t("path",{d:"M12 2a10 10 0 1 0 0 20V2z",fill:"currentColor"}),t("circle",{cx:"12",cy:"12",r:"9",fill:"none",stroke:"currentColor",strokeWidth:"2"})]})}),t("b",{className:"mdk-front",children:K},K),t("span",{children:"File"}),t("span",{children:"Edit"}),t("span",{children:"View"}),t("span",{className:"mdk-clock",children:"Fri 23 Oct 9:41"})]}),t("div",{className:"mdk-bar",role:"toolbar","aria-label":"Dock",onPointerMove:n=>g(it(n.clientX)),onPointerLeave:()=>{v(null),g(null)},children:a.map((n,e)=>{let i=x.includes(n.id),c=Y.includes(n.id);return r("button",{ref:s=>{$.current[e]=s},type:"button",className:"mdk-app",tabIndex:e===tt?0:-1,"data-hover":Z===e,"data-bounce":c,"aria-label":`${n.name}${i?", running":""}`,onPointerEnter:()=>v(e),onClick:()=>at(e),onFocus:s=>{et(e),s.currentTarget.matches(":focus-visible")&&(v(e),g(H(e)))},onBlur:s=>{s.currentTarget.parentElement?.contains(s.relatedTarget)||(v(null),g(null))},onKeyDown:s=>{let y=s.key==="ArrowRight"?e+1:s.key==="ArrowLeft"?e-1:s.key==="Home"?0:s.key==="End"?a.length-1:null;if(y===null)return;s.preventDefault();let w=(y+a.length)%a.length;$.current[w]?.focus()},children:[t("span",{className:"mdk-lift",children:t(dt,{icon:n.icon,uid:`${l}${e}`})}),t("span",{className:"mdk-tip","aria-hidden":!0,children:n.name}),t("span",{className:"mdk-dot","data-on":i,"aria-hidden":!0})]},n.id)})}),t("span",{className:"mdk-sr","aria-live":"polite",children:nt})]})]})}function lt({uid:a,wall:o}){return r("svg",{className:"mdk-wall",viewBox:"0 0 400 260",preserveAspectRatio:"xMidYMid slice","aria-hidden":!0,children:[r("defs",{children:[r("linearGradient",{id:`${a}sky`,x1:"0",y1:"0",x2:"0",y2:"1",children:[t("stop",{offset:"0",stopColor:o.sky[0]}),t("stop",{offset:"0.34",stopColor:o.mid}),t("stop",{offset:"0.62",stopColor:o.sky[1]}),t("stop",{offset:"1",stopColor:o.sky[2]})]}),r("radialGradient",{id:`${a}glow`,cx:"0.5",cy:"0.5",r:"0.5",children:[t("stop",{offset:"0",stopColor:o.sun,stopOpacity:"0.55"}),t("stop",{offset:"1",stopColor:o.sun,stopOpacity:"0"})]})]}),t("rect",{width:"400",height:"260",fill:`url(#${a}sky)`}),t("circle",{cx:"262",cy:"150",r:"90",fill:`url(#${a}glow)`}),t("circle",{cx:"262",cy:"150",r:"34",fill:o.sun}),t("path",{d:"M0 168 C 60 140 110 150 170 162 S 300 128 400 146 V260 H0z",fill:o.hills[0]}),t("path",{d:"M0 196 C 70 170 150 176 220 190 S 340 170 400 182 V260 H0z",fill:o.hills[1]}),t("path",{d:"M0 222 C 90 206 170 212 250 222 S 360 210 400 214 V260 H0z",fill:o.hills[2]})]})}function dt({icon:a,uid:o}){let b=f=>`${o}${f}`,u=f=>`url(#${b(f)})`,d=(f,x)=>r(m,{children:[t("rect",{x:"4",y:"4",width:"92",height:"92",rx:"22",fill:f}),x,t("rect",{x:"4.5",y:"4.5",width:"91",height:"91",rx:"21.5",fill:"none",stroke:"rgba(255,255,255,.28)"})]}),l=null;switch(a){case"files":l=r(m,{children:[t("defs",{children:r("linearGradient",{id:b("f"),x1:"0",y1:"0",x2:"0",y2:"1",children:[t("stop",{offset:"0",stopColor:"#3fc1f0"}),t("stop",{offset:"1",stopColor:"#0a84c6"})]})}),d(u("f")),t("path",{d:"M22 34a6 6 0 0 1 6-6h16l7 7h21a6 6 0 0 1 6 6v4H22z",fill:"#d5f1ff"}),t("rect",{x:"22",y:"40",width:"56",height:"34",rx:"6",fill:"#fff"}),t("rect",{x:"22",y:"40",width:"56",height:"5",fill:"#e3f5ff"})]});break;case"calendar":l=r(m,{children:[d("#fff"),t("path",{d:"M4 26a22 22 0 0 1 22-22h48a22 22 0 0 1 22 22v8H4z",fill:"#f2433a"}),t("text",{x:"50",y:"27",textAnchor:"middle",fontSize:"15",fontWeight:"700",fill:"#fff",letterSpacing:"2",children:"OCT"}),t("text",{x:"50",y:"80",textAnchor:"middle",fontSize:"44",fontWeight:"600",fill:"#1d1d1f",letterSpacing:"-2",children:"23"})]});break;case"music":l=r(m,{children:[t("defs",{children:r("linearGradient",{id:b("m"),x1:"0",y1:"0",x2:"1",y2:"1",children:[t("stop",{offset:"0",stopColor:"#ff8a3d"}),t("stop",{offset:"1",stopColor:"#ff3d6e"})]})}),d("#141416"),t("circle",{cx:"50",cy:"50",r:"30",fill:"none",stroke:u("m"),strokeWidth:"5"}),t("circle",{cx:"50",cy:"50",r:"19",fill:"none",stroke:u("m"),strokeWidth:"5",opacity:".7"}),t("circle",{cx:"50",cy:"50",r:"8",fill:u("m")})]});break;case"maps":l=r(m,{children:[d("#9fdc8c"),t("path",{d:"M4 62 C 28 54 44 70 66 60 S 90 50 96 54 V74 a22 22 0 0 1-22 22H26A22 22 0 0 1 4 74z",fill:"#5ab4f2"}),t("path",{d:"M30 4 L 52 96",stroke:"#fff",strokeWidth:"7"}),t("path",{d:"M4 40 L 96 30",stroke:"#ffd34d",strokeWidth:"6"}),t("path",{d:"M66 20a13 13 0 0 1 13 13c0 10-13 22-13 22s-13-12-13-22a13 13 0 0 1 13-13z",fill:"#ff4f3f",stroke:"#fff",strokeWidth:"3"}),t("circle",{cx:"66",cy:"33",r:"4.5",fill:"#fff"})]});break;case"weather":l=r(m,{children:[t("defs",{children:r("linearGradient",{id:b("w"),x1:"0",y1:"0",x2:"0",y2:"1",children:[t("stop",{offset:"0",stopColor:"#2d8cff"}),t("stop",{offset:"1",stopColor:"#7cc6ff"})]})}),d(u("w")),t("circle",{cx:"60",cy:"38",r:"17",fill:"#ffd23f"}),t("path",{d:"M28 74a14 14 0 0 1 3-27.6A18 18 0 0 1 65 50a12 12 0 0 1 0 24z",fill:"#fff"})]});break;case"notes":l=r(m,{children:[d("#ffd23f"),t("path",{d:"M26 72 L 62 30 L 72 39 L 36 81 L 24 84z",fill:"#1d1d1f"}),t("path",{d:"M62 30 L 67 24 a5 5 0 0 1 7 0 l3 3 a5 5 0 0 1 0 7 L 72 39z",fill:"#ff6a3d"}),t("path",{d:"M26 72 L 36 81 L 24 84z",fill:"#ffd23f",opacity:".55"})]});break;case"terminal":l=r(m,{children:[t("defs",{children:t("clipPath",{id:b("t"),children:t("rect",{x:"4",y:"4",width:"92",height:"92",rx:"22"})})}),d("#1b1d20",t("rect",{x:"4",y:"4",width:"92",height:"19",fill:"#34383d",clipPath:u("t")})),t("circle",{cx:"19",cy:"13.5",r:"3.2",fill:"#ff5f57"}),t("circle",{cx:"29",cy:"13.5",r:"3.2",fill:"#febc2e"}),t("circle",{cx:"39",cy:"13.5",r:"3.2",fill:"#28c840"}),t("path",{d:"M26 44 L 40 54 L 26 64",fill:"none",stroke:"#3ef08a",strokeWidth:"7",strokeLinecap:"round",strokeLinejoin:"round"}),t("path",{d:"M48 66 H 70",stroke:"#3ef08a",strokeWidth:"7",strokeLinecap:"round"})]});break}return t("svg",{className:"mdk-icon",viewBox:"0 0 100 100","aria-hidden":!0,children:l})}var ft=`
.mdk {
  position: relative;
  width: 400px;
  height: 260px;
  border-radius: 18px;
  overflow: hidden;
  isolation: isolate;
  font-family: inherit;
  color: #fff;
  background: var(--sky1);
  box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 24px 48px -28px rgba(0,0,0,.55);
  -webkit-tap-highlight-color: transparent;
}
.mdk-wall { position: absolute; inset: 0; width: 100%; height: 100%; display: block; z-index: -1; }

.mdk-menubar {
  display: flex; align-items: center; gap: 13px;
  height: 24px; padding: 0 12px;
  font-size: 11.5px; line-height: 1; letter-spacing: -0.005em;
  background: rgba(0,0,0,.16);
  -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px);
  box-shadow: inset 0 -1px 0 rgba(255,255,255,.08);
  text-shadow: 0 1px 1px rgba(0,0,0,.18);
  white-space: nowrap;
}
.mdk-menubar span { opacity: .92; }
.mdk-mark { display: grid; place-items: center; }
.mdk-mark svg { display: block; }
.mdk-front { font-weight: 700; animation: mdk-in 260ms cubic-bezier(.3,1.3,.5,1); }
.mdk-clock { margin-left: auto; font-variant-numeric: tabular-nums; }
@keyframes mdk-in { from { opacity: 0; transform: translateY(5px); } }

/* The bar: a fixed height, icons sit on its floor and grow up out of it.
   Its width is just its icons, so it widens with them, from the centre. */
.mdk-bar {
  position: absolute; left: 50%; bottom: 8px;
  transform: translateX(-50%);
  display: flex; align-items: flex-end; gap: var(--gap);
  height: calc(var(--base) + 13px);
  padding: 0 var(--pad) 8px;
  box-sizing: border-box;
  border-radius: 16px;
  background: rgba(255,255,255,.26);
  -webkit-backdrop-filter: blur(18px) saturate(1.6); backdrop-filter: blur(18px) saturate(1.6);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.32),
    inset 0 1px 0 rgba(255,255,255,.4),
    0 0 0 1px rgba(0,0,0,.12),
    0 12px 28px -12px rgba(0,0,0,.55);
  touch-action: pan-y;
}
.mdk-bar::before { content: ""; position: absolute; left: 0; right: 0; bottom: 100%; height: 34px; } /* keeps the hover alive above the bar */

.mdk-app {
  --s: var(--base);
  position: relative;
  flex: none;
  width: var(--s); height: var(--s);
  padding: 0; margin: 0; border: 0;
  background: none; color: inherit; font: inherit;
  cursor: default;
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.mdk-lift { display: block; width: 100%; height: 100%; transform-origin: 50% 100%; transition: transform 160ms ease; }
.mdk-app:active .mdk-lift { transform: scale(.94); filter: brightness(.82); }
.mdk-icon { display: block; width: 100%; height: 100%; filter: drop-shadow(0 2px 2.5px rgba(0,0,0,.28)); }
.mdk-icon text { font-family: inherit; }
.mdk-app:focus-visible .mdk-lift::after {
  content: ""; position: absolute; inset: -3px; border-radius: 28%;
  box-shadow: 0 0 0 2px #fff, 0 0 0 4px rgba(0,0,0,.35);
}
.mdk-lift { position: relative; }

/* Launch: two bounces, the second lower, landing soft. */
.mdk-app[data-bounce="true"] .mdk-lift { animation: mdk-bounce ${Q}ms cubic-bezier(.3,0,.4,1); }
@keyframes mdk-bounce {
  0%   { transform: translateY(0); }
  22%  { transform: translateY(-24px); animation-timing-function: cubic-bezier(.5,0,.8,.4); }
  44%  { transform: translateY(0) scale(1.03, .96); animation-timing-function: cubic-bezier(.2,.6,.4,1); }
  64%  { transform: translateY(-13px); animation-timing-function: cubic-bezier(.5,0,.8,.4); }
  84%  { transform: translateY(0) scale(1.02, .98); }
  100% { transform: translateY(0); }
}

.mdk-tip {
  position: absolute; left: 50%; bottom: calc(100% + 10px);
  padding: 5px 9px 6px;
  border-radius: 7px;
  background: rgba(28,28,30,.86);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.1), 0 6px 16px -6px rgba(0,0,0,.5);
  font-size: 12px; font-weight: 500; line-height: 1; white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transform: translate(-50%, 4px);
  transition: opacity 90ms ease, transform 90ms ease;
}
.mdk-tip::after {
  content: ""; position: absolute; left: 50%; top: 100%;
  margin-left: -5px;
  border: 5px solid transparent; border-top-color: rgba(28,28,30,.86);
}
.mdk-app[data-hover="true"] .mdk-tip {
  opacity: 1; transform: translate(-50%, 0);
  transition: opacity 140ms ease 40ms, transform 220ms cubic-bezier(.3,1.4,.5,1) 40ms;
}

.mdk-dot {
  position: absolute; left: 50%; top: calc(100% + 3px);
  width: 4px; height: 4px; margin-left: -2px;
  border-radius: 50%;
  background: rgba(255,255,255,.95);
  box-shadow: 0 0 4px rgba(255,255,255,.6);
  opacity: 0; transform: scale(0);
  transition: opacity 160ms ease, transform 160ms ease;
}
.mdk-dot[data-on="true"] { opacity: 1; transform: scale(1); transition: opacity 200ms ease, transform 360ms cubic-bezier(.3,1.6,.5,1); }

.mdk-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .mdk-app[data-bounce="true"] .mdk-lift { animation: none; }
  .mdk-front { animation: none; }
  .mdk-tip, .mdk-app[data-hover="true"] .mdk-tip { transform: translate(-50%, 0); transition: opacity 120ms ease; }
  .mdk-dot, .mdk-dot[data-on="true"] { transform: none; transition: opacity 160ms ease; }
}
`;export{ct as default};
