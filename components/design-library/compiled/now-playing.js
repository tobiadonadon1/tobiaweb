"use client";
/* Construct · Design library: the compiled preview of "Now playing". The source is for members. */
import{useCallback as $,useEffect as T,useId as _,useRef as q,useState as G}from"react";import{Fragment as w,jsx as t,jsxs as i}from"react/jsx-runtime";var m=[{title:"Slow Water",artist:"Ines Calder",length:228,bg:"#b23a6e",tint:"#ff7a45",art:"water"},{title:"Night Ferry",artist:"Teo Marsh",length:252,bg:"#062430",tint:"#2ecf8f",art:"ferry"},{title:"Paper Sun",artist:"Ada Rhee",length:185,bg:"#7b5cff",tint:"#ff4f7b",art:"paper"}],L=n=>{let e=Math.max(0,Math.floor(n));return`${Math.floor(e/60)}:${String(e%60).padStart(2,"0")}`};function B({accent:n="#3d3df5",autoplay:e=!0}){let{ref:s,running:l,visible:a}=j(e),r=_().replace(/[^a-zA-Z0-9_-]/g,""),[p,k]=G({i:0,e:75}),[f,y]=G(!1),[b,C]=G(!1),M=q(!1),P=q(null),u=m[p.i],A=Math.min(1,p.e/u.length),E=$(()=>k(o=>({i:(o.i+1)%m.length,e:0})),[]),O=$(()=>k(o=>o.e>3?{i:o.i,e:0}:{i:(o.i+m.length-1)%m.length,e:0}),[]);T(()=>{if(!f||!a)return;let o=0,g=performance.now(),x=v=>{let F=Math.min(100,v-g)/1e3;g=v,M.current||k(z=>{let R=z.e+F;return R>=m[z.i].length?{i:(z.i+1)%m.length,e:0}:{i:z.i,e:R}}),o=requestAnimationFrame(x)};return o=requestAnimationFrame(x),()=>cancelAnimationFrame(o)},[f,a]),T(()=>{if(!l)return;let o=window.setTimeout(()=>y(!0),300),g=window.setInterval(E,9e3);return()=>{clearTimeout(o),clearInterval(g)}},[l,E]);let N=o=>{let g=P.current?.getBoundingClientRect();if(!g||g.width===0)return;let x=Math.min(1,Math.max(0,(o.clientX-g.left)/g.width));k(v=>({i:v.i,e:Math.min(m[v.i].length-.5,x*m[v.i].length)}))},S=()=>{M.current=!1,C(!1)};return i(w,{children:[t("style",{children:J}),i("div",{ref:s,className:"np","data-playing":f,style:{"--np-accent":n,"--np-tint":u.tint},children:[t("span",{className:"np-glow","aria-hidden":!0}),t("div",{className:"np-cover","aria-hidden":!0,children:m.map((o,g)=>t(X,{track:o,active:g===p.i,uid:r},o.title))}),i("div",{className:"np-side",children:[i("div",{className:"np-head",children:[t("span",{className:"np-dot","aria-hidden":!0}),t("span",{children:f?"Now playing":"Paused"}),i("span",{className:"np-eq","aria-hidden":!0,children:[t("i",{}),t("i",{}),t("i",{}),t("i",{}),t("i",{})]})]}),t("div",{className:"np-meta","aria-live":"polite",children:i("div",{className:"np-meta-in",children:[t("div",{className:"np-title",children:u.title}),t("div",{className:"np-artist",children:u.artist})]},u.title)}),i("div",{ref:P,className:"np-scrub","data-dragging":b,role:"slider",tabIndex:0,"aria-label":"Seek","aria-valuemin":0,"aria-valuemax":u.length,"aria-valuenow":Math.floor(p.e),"aria-valuetext":`${L(p.e)} of ${L(u.length)}`,style:{"--np-p":A},onPointerDown:o=>{o.button===0&&(o.currentTarget.setPointerCapture(o.pointerId),M.current=!0,C(!0),N(o))},onPointerMove:o=>{M.current&&N(o)},onPointerUp:S,onPointerCancel:S,onKeyDown:o=>{let g=u.length,x=null;if(o.key==="ArrowRight"||o.key==="ArrowUp"?x=p.e+5:o.key==="ArrowLeft"||o.key==="ArrowDown"?x=p.e-5:o.key==="Home"?x=0:o.key==="End"&&(x=g-1),x===null)return;o.preventDefault();let v=Math.min(g-.5,Math.max(0,x));k(F=>({i:F.i,e:v}))},children:[t("span",{className:"np-track"}),t("span",{className:"np-fill"}),t("span",{className:"np-thumb"})]}),i("div",{className:"np-times","aria-hidden":!0,children:[t("span",{children:L(p.e)}),t("span",{children:L(u.length)})]}),i("div",{className:"np-controls",children:[t("button",{type:"button",className:"np-skip","aria-label":"Previous track",onClick:O,children:i("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,children:[t("rect",{x:"2",y:"2.5",width:"1.6",height:"9",rx:".6"}),t("path",{d:"M11.6 2.9v8.2a.6.6 0 0 1-.92.5L4.9 7.5a.6.6 0 0 1 0-1l5.78-4.1a.6.6 0 0 1 .92.5Z"})]})}),i("button",{type:"button",className:"np-play","aria-label":f?"Pause":"Play",onClick:()=>y(o=>!o),children:[i("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,className:"np-ico-pause",children:[t("rect",{x:"3",y:"2.2",width:"2.6",height:"9.6",rx:".9"}),t("rect",{x:"8.4",y:"2.2",width:"2.6",height:"9.6",rx:".9"})]}),t("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,className:"np-ico-play",children:t("path",{d:"M4 2.6v8.8a.8.8 0 0 0 1.2.7l7-4.4a.8.8 0 0 0 0-1.4l-7-4.4a.8.8 0 0 0-1.2.7Z"})})]}),t("button",{type:"button",className:"np-skip","aria-label":"Next track",onClick:E,children:i("svg",{width:"14",height:"14",viewBox:"0 0 14 14","aria-hidden":!0,children:[t("rect",{x:"10.4",y:"2.5",width:"1.6",height:"9",rx:".6"}),t("path",{d:"M2.4 2.9v8.2a.6.6 0 0 0 .92.5L9.1 7.5a.6.6 0 0 0 0-1L3.32 2.4a.6.6 0 0 0-.92.5Z"})]})})]})]})]})]})}var c=n=>+n.toFixed(2),h=(n,e)=>{let s=Math.sin(n*12.9898+e*78.233)*43758.5453;return s-Math.floor(s)},D=(n,e,s)=>`M${c(n-s)} ${c(e)}a${c(s)} ${c(s)} 0 1 0 ${c(2*s)} 0a${c(s)} ${c(s)} 0 1 0 ${c(-2*s)} 0`,H=Array.from({length:26},(n,e)=>{let s=(15-e*.42)*(.35+h(e,1)*.9);return{x:c(50-s/2+(h(e,2)-.5)*4),y:c(65+e*1.32+h(e,3)*.5),w:c(s),h:c(.4+h(e,16)*.5),o:c((.95-e*.032)*(.55+h(e,17)*.45))}}),Z=Array.from({length:26},(n,e)=>({x:c(h(e,4)*100),y:c(h(e,5)*50),r:c(.16+h(e,6)*.3),o:c(.35+h(e,7)*.6)})).filter(n=>Math.hypot(n.x-74,n.y-22)>13),I=Array.from({length:22},(n,e)=>({x:c(58+e*1.9+h(e,8)*1.2),y:c(63.7+h(e,9)*.5),r:c(.18+h(e,10)*.22),warm:h(e,11)>.35})),W=Array.from({length:24},(n,e)=>{let s=(1.2+h(e,12)*6)*(1+e*.04);return{x:c(74-s/2+(h(e,13)-.5)*3.4),y:c(67.2+e*1.36+h(e,18)*.4),w:c(s),h:c(.3+h(e,19)*.4),o:c((.85-e*.03)*(.4+h(e,20)*.6))}}),d={x:57,y:42,r:22},U=(()=>{let n="";for(let e=d.y-d.r;e<=d.y+d.r;e+=2.3)for(let s=d.x-d.r;s<=d.x+d.r;s+=2.3){let l=((s-d.x)*.55+(e-d.y)*.84)/d.r,a=Math.min(1.12,(l-.08)*1.25);a>.1&&(n+=D(s,e,a))}return n})(),Y=(()=>{let n="",e=0;for(let s=67.4;s<101;s+=2.6,e++)for(let l=e%2?1.3:0;l<101;l+=2.6){let a=Math.pow((s-66)/34,1.1),r=.62+.38*Math.exp(-Math.pow((l-50)/20,2)),p=Math.min(1.26,(.18+1.1*a)*r);n+=D(l,s,p)}return n})();function V({id:n,opacity:e}){return t(w,{children:i("filter",{id:n,x:"0",y:"0",width:"100%",height:"100%",colorInterpolationFilters:"sRGB",children:[t("feTurbulence",{type:"fractalNoise",baseFrequency:"1.9",numOctaves:"2",stitchTiles:"stitch"}),t("feColorMatrix",{type:"saturate",values:"0"}),i("feComponentTransfer",{children:[t("feFuncR",{type:"linear",slope:"2.4",intercept:"-.7"}),t("feFuncG",{type:"linear",slope:"2.4",intercept:"-.7"}),t("feFuncB",{type:"linear",slope:"2.4",intercept:"-.7"}),t("feFuncA",{type:"linear",slope:"0",intercept:e})]})]})})}function X({track:n,active:e,uid:s}){let l=r=>`${s}-${n.art}-${r}`,a=r=>`url(#${l(r)})`;return t("div",{className:"np-art","data-active":e,style:{background:n.bg},children:i("svg",{viewBox:"0 0 100 100",width:"100%",height:"100%",className:"np-shapes",preserveAspectRatio:"xMidYMid slice",children:[i("defs",{children:[t(V,{id:l("grain"),opacity:n.art==="paper"?.3:.22}),t("filter",{id:l("soft"),x:"-20%",y:"-20%",width:"140%",height:"140%",children:t("feGaussianBlur",{stdDeviation:".45"})}),t("filter",{id:l("haze"),x:"-30%",y:"-30%",width:"160%",height:"160%",children:t("feGaussianBlur",{stdDeviation:"1.6"})}),i("radialGradient",{id:l("vignette"),cx:".5",cy:".46",r:".75",children:[t("stop",{offset:".55",stopColor:"#0a0414",stopOpacity:"0"}),t("stop",{offset:"1",stopColor:"#0a0414",stopOpacity:".5"})]}),n.art==="water"&&i(w,{children:[i("linearGradient",{id:l("sky"),x1:"0",y1:"0",x2:"0",y2:"1",children:[t("stop",{offset:"0",stopColor:"#3a1d5c"}),t("stop",{offset:".4",stopColor:"#b23a6e"}),t("stop",{offset:".74",stopColor:"#ff7a45"}),t("stop",{offset:"1",stopColor:"#ffd08e"})]}),i("linearGradient",{id:l("sea"),x1:"0",y1:"0",x2:"0",y2:"1",children:[t("stop",{offset:"0",stopColor:"#f08060"}),t("stop",{offset:".14",stopColor:"#a8405e"}),t("stop",{offset:".55",stopColor:"#4a1f4f"}),t("stop",{offset:"1",stopColor:"#170b26"})]}),i("radialGradient",{id:l("sun"),cx:".45",cy:".42",r:".6",children:[t("stop",{offset:"0",stopColor:"#fffbf0"}),t("stop",{offset:".55",stopColor:"#ffe7b4"}),t("stop",{offset:"1",stopColor:"#ffb468"})]}),i("radialGradient",{id:l("glow"),children:[t("stop",{offset:"0",stopColor:"#ffe0a8",stopOpacity:".95"}),t("stop",{offset:".3",stopColor:"#ff9f5c",stopOpacity:".5"}),t("stop",{offset:"1",stopColor:"#ff7a45",stopOpacity:"0"})]}),t("clipPath",{id:l("above"),children:t("rect",{width:"100",height:"64"})})]}),n.art==="ferry"&&i(w,{children:[i("linearGradient",{id:l("sky"),x1:"0",y1:"0",x2:"0",y2:"1",children:[t("stop",{offset:"0",stopColor:"#020a12"}),t("stop",{offset:".6",stopColor:"#062430"}),t("stop",{offset:"1",stopColor:"#0f4a4c"})]}),i("linearGradient",{id:l("sea"),x1:"0",y1:"0",x2:"0",y2:"1",children:[t("stop",{offset:"0",stopColor:"#0f4d4a"}),t("stop",{offset:".35",stopColor:"#08302f"}),t("stop",{offset:"1",stopColor:"#021312"})]}),i("radialGradient",{id:l("moon"),cx:".4",cy:".38",r:".7",children:[t("stop",{offset:"0",stopColor:"#fffdf6"}),t("stop",{offset:"1",stopColor:"#e6dcc2"})]}),i("radialGradient",{id:l("glow"),children:[t("stop",{offset:"0",stopColor:"#e9fff6",stopOpacity:".55"}),t("stop",{offset:".35",stopColor:"#7fe0c4",stopOpacity:".16"}),t("stop",{offset:"1",stopColor:"#2ecf8f",stopOpacity:"0"})]}),i("linearGradient",{id:l("trail"),x1:"0",y1:"0",x2:"1",y2:"0",children:[t("stop",{offset:"0",stopColor:"#ffb020",stopOpacity:"0"}),t("stop",{offset:".55",stopColor:"#ffb020",stopOpacity:".75"}),t("stop",{offset:".9",stopColor:"#ff7a45"}),t("stop",{offset:"1",stopColor:"#fff2d6"})]}),i("linearGradient",{id:l("trail2"),x1:"0",y1:"0",x2:"1",y2:"0",children:[t("stop",{offset:"0",stopColor:"#bff7e4",stopOpacity:"0"}),t("stop",{offset:"1",stopColor:"#f2fffa",stopOpacity:".9"})]})]}),n.art==="paper"&&i(w,{children:[i("radialGradient",{id:l("light"),cx:".2",cy:".1",r:".9",children:[t("stop",{offset:"0",stopColor:"#fff",stopOpacity:".22"}),t("stop",{offset:"1",stopColor:"#fff",stopOpacity:"0"})]}),t("clipPath",{id:l("disc"),children:t("circle",{cx:d.x,cy:d.y,r:d.r})})]})]}),n.art==="water"&&i(w,{children:[t("rect",{width:"100",height:"64",fill:a("sky")}),t("circle",{cx:"50",cy:"58",r:"40",fill:a("glow")}),t("circle",{cx:"50",cy:"57.5",r:"12.5",fill:a("sun"),clipPath:a("above")}),i("g",{filter:a("soft"),children:[t("ellipse",{cx:"26",cy:"49",rx:"30",ry:".9",fill:"#ffb08a",opacity:".45"}),t("ellipse",{cx:"62",cy:"53.2",rx:"30",ry:".75",fill:"#c8466e",opacity:".55"}),t("ellipse",{cx:"44",cy:"56.6",rx:"26",ry:".55",fill:"#d65a6a",opacity:".45"}),t("ellipse",{cx:"54",cy:"60.6",rx:"44",ry:"1",fill:"#ffd6a0",opacity:".55"}),t("ellipse",{cx:"78",cy:"44",rx:"22",ry:".6",fill:"#ff9a7a",opacity:".4"})]}),t("path",{d:"M0 64V60.6c6-.9 10-1.2 15-.3 4 .7 7 1.5 12 2.1l6 1.6Z",fill:"#6e2c56",opacity:".8",filter:a("soft")}),t("path",{d:"M100 64v-2.6c-5-.4-9 .5-14 1.3l-7 1.3Z",fill:"#5a2550",opacity:".85",filter:a("soft")}),t("rect",{y:"64",width:"100",height:"36",fill:a("sea")}),t("ellipse",{cx:"50",cy:"73",rx:"12",ry:"11",fill:"#ff9a5a",opacity:".35",filter:a("haze")}),i("g",{filter:a("soft"),children:[H.map((r,p)=>t("rect",{x:r.x,y:r.y,width:r.w,height:r.h,rx:r.h/2,fill:"#ffdcaa",opacity:r.o},p)),t("rect",{x:"10",y:"70.5",width:"22",height:".35",fill:"#ff9a6b",opacity:".35"}),t("rect",{x:"66",y:"76",width:"26",height:".35",fill:"#ff9a6b",opacity:".28"}),t("rect",{x:"4",y:"84",width:"30",height:".4",fill:"#c8466e",opacity:".35"}),t("rect",{x:"62",y:"91",width:"34",height:".4",fill:"#c8466e",opacity:".3"})]}),t("rect",{y:"63.5",width:"100",height:".9",fill:"#ffe4b8",opacity:".7",filter:a("soft")})]}),n.art==="ferry"&&i(w,{children:[t("rect",{width:"100",height:"66",fill:a("sky")}),Z.map((r,p)=>t("circle",{cx:r.x,cy:r.y,r:r.r,fill:"#eafff8",opacity:r.o},p)),t("circle",{cx:"74",cy:"22",r:"28",fill:a("glow")}),t("circle",{cx:"74",cy:"22",r:"7",fill:a("moon")}),t("circle",{cx:"72",cy:"20",r:"1.5",fill:"#d9cdae",opacity:".55"}),t("circle",{cx:"76.6",cy:"24.4",r:"1.05",fill:"#d9cdae",opacity:".5"}),t("circle",{cx:"71.2",cy:"25",r:".7",fill:"#d9cdae",opacity:".45"}),t("path",{d:"M0 66v-2.2c9-.6 20-.3 32 .3l20 .5 20-.6c10-.3 20-.4 28 0V66Z",fill:"#020c0c"}),t("g",{filter:a("soft"),children:I.map((r,p)=>t("circle",{cx:r.x,cy:r.y,r:r.r*1.6,fill:r.warm?"#ffb020":"#e8fff6",opacity:".55"},p))}),I.map((r,p)=>t("circle",{cx:r.x,cy:r.y,r:r.r,fill:r.warm?"#ffd27a":"#ffffff"},p)),t("rect",{y:"66",width:"100",height:"34",fill:a("sea")}),t("ellipse",{cx:"74",cy:"80",rx:"7",ry:"14",fill:"#9ff0d6",opacity:".12",filter:a("haze")}),i("g",{filter:a("soft"),children:[W.map((r,p)=>t("rect",{x:r.x,y:r.y,width:r.w,height:r.h,rx:r.h/2,fill:"#dffff2",opacity:r.o},p)),t("rect",{x:"6",y:"74",width:"20",height:".3",fill:"#2ecf8f",opacity:".3"}),t("rect",{x:"40",y:"81",width:"22",height:".3",fill:"#2ecf8f",opacity:".22"}),t("rect",{x:"10",y:"90",width:"28",height:".35",fill:"#2ecf8f",opacity:".2"})]}),i("g",{transform:"translate(44 66.6) scale(1.45) translate(-44 -66.6)",children:[i("g",{filter:a("haze"),opacity:".9",children:[t("path",{d:"M-2 65.1C10 64.7 22 64.5 33 64.6",stroke:a("trail"),strokeWidth:"2",fill:"none"}),t("rect",{x:"0",y:"67.2",width:"34",height:"2",fill:"#ff9a45",opacity:".35"})]}),t("path",{d:"M-2 65.1C10 64.7 22 64.5 33 64.6",stroke:a("trail"),strokeWidth:".62",fill:"none"}),t("path",{d:"M-2 64C11 63.7 22 63.4 33 63.3",stroke:a("trail2"),strokeWidth:".3",fill:"none"}),t("path",{d:"M8 66C17 65.9 25 65.8 33 65.6",stroke:a("trail"),strokeWidth:".32",fill:"none",opacity:".8"}),i("g",{fill:"#010505",children:[t("path",{d:"M31 66.6h26l-2.2-2.5H32.4Z"}),t("rect",{x:"36",y:"62",width:"15",height:"2.2",rx:".3"}),t("rect",{x:"41.2",y:"60.4",width:"6",height:"1.7",rx:".3"}),t("rect",{x:"44.6",y:"58.6",width:"1.5",height:"1.9"})]}),i("g",{fill:"#ffcf70",children:[Array.from({length:11},(r,p)=>t("rect",{x:37.1+p*1.25,y:"62.8",width:".7",height:".55",opacity:h(p,14)>.2?1:.3},p)),Array.from({length:13},(r,p)=>t("rect",{x:33.4+p*1.6,y:"64.9",width:".9",height:".5",fill:"#ffb020",opacity:h(p,15)>.25?.95:.25},p))]}),t("circle",{cx:"45.35",cy:"58.3",r:"1.2",fill:"#ffffff",opacity:".35",filter:a("soft")}),t("circle",{cx:"45.35",cy:"58.3",r:".3",fill:"#ffffff"}),i("g",{filter:a("soft"),fill:"#ffb020",opacity:".5",children:[t("rect",{x:"36",y:"67.4",width:".6",height:"4.2"}),t("rect",{x:"40",y:"67.6",width:".6",height:"3.4"}),t("rect",{x:"44.6",y:"67.4",width:".6",height:"4.8"}),t("rect",{x:"49",y:"67.6",width:".6",height:"3"}),t("rect",{x:"53",y:"67.4",width:".6",height:"3.8"})]})]})]}),n.art==="paper"&&i(w,{children:[t("rect",{width:"100",height:"100",fill:"#7b5cff"}),t("rect",{y:"66",width:"100",height:"34",fill:"#2a1c8f"}),t("circle",{cx:d.x-2.6,cy:d.y-2.4,r:d.r,fill:"#ffb020"}),t("circle",{cx:d.x,cy:d.y,r:d.r,fill:"#ff4f7b"}),t("path",{d:U,fill:"#4a2fd0",opacity:".85",clipPath:a("disc")}),t("rect",{y:"65.2",width:"100",height:"1.2",fill:"#ffb020"}),t("path",{d:Y,fill:"#ff4f7b"}),t("rect",{width:"100",height:"100",fill:a("light")}),t("text",{x:"8",y:"12.5",className:"np-art-type",fill:"#fff4e6",children:"ADA RHEE"}),t("text",{x:"8",y:"18.2",className:"np-art-type np-art-type-2",fill:"#fff4e6",children:"PAPER SUN"})]}),t("rect",{width:"100",height:"100",fill:a("vignette"),opacity:n.art==="paper"?.5:1}),t("rect",{width:"100",height:"100",filter:a("grain"),className:"np-grain"})]})})}function j(n){let e=q(null),[s,l]=G(!1),[a,r]=G(!0),[p,k]=G(!0);return T(()=>{let f=window.matchMedia("(prefers-reduced-motion: reduce)"),y=()=>k(f.matches);return y(),f.addEventListener("change",y),()=>f.removeEventListener("change",y)},[]),T(()=>{let f=e.current;if(!f)return;if(typeof IntersectionObserver>"u"){l(!0);return}let y=new IntersectionObserver(([b])=>l(b.isIntersecting),{threshold:.25});return y.observe(f),()=>y.disconnect()},[]),T(()=>{let f=e.current;if(!f)return;let y=!1,b=!1,C=0,M=()=>{clearTimeout(C),r(!1)},P=()=>{clearTimeout(C),!(y||b)&&(C=window.setTimeout(()=>r(!0),1500))},u=()=>{y=!0,M()},A=()=>{y=!1,P()},E=N=>{let S=N.target,o=!0;try{o=!!S?.matches(":focus-visible")}catch{o=!0}o&&(b=!0,M())},O=N=>{N.relatedTarget instanceof Node&&f.contains(N.relatedTarget)||b&&(b=!1,P())};return f.addEventListener("pointerenter",u),f.addEventListener("pointerleave",A),f.addEventListener("focusin",E),f.addEventListener("focusout",O),()=>{clearTimeout(C),f.removeEventListener("pointerenter",u),f.removeEventListener("pointerleave",A),f.removeEventListener("focusin",E),f.removeEventListener("focusout",O)}},[]),{ref:e,visible:s,running:n&&s&&a&&!p}}var K=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 3 0 0 0 -1.2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23g)'/%3E%3C/svg%3E")`,J=`
.np {
  --np-accent: #3d3df5;
  --np-tint: #ff7a45;
  position: relative;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 164px 1fr;
  gap: 22px;
  width: 404px;
  height: 196px;
  padding: 16px 20px 16px 16px;
  border-radius: 28px;
  background: #f9f9f7;
  color: #111;
  font-family: inherit;
  overflow: hidden;
  isolation: isolate;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14),
    0 22px 48px -22px color-mix(in srgb, var(--np-tint) 55%, transparent),
    inset 0 1px 0 rgb(255 255 255 / .9);
  transition: box-shadow 700ms ease;
}
.np *, .np *::before, .np *::after { box-sizing: border-box; }
/* matte paper: a whisper of grain over everything, never catching the pointer */
.np::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background-image: ${K};
  background-size: 160px 160px;
  opacity: .045;
  pointer-events: none;
  z-index: 3;
}
/* the cover's colour, spilling softly onto the card */
.np-glow {
  position: absolute;
  inset: 0;
  background-color: var(--np-tint);
  opacity: .1;
  -webkit-mask-image: radial-gradient(70% 120% at 18% 50%, #000, transparent 72%);
  mask-image: radial-gradient(70% 120% at 18% 50%, #000, transparent 72%);
  transition: background-color 700ms ease;
  pointer-events: none;
}

/* Cover: three stacked paintings, the active one fades in and settles. */
.np-cover {
  position: relative; width: 164px; height: 164px; border-radius: 16px; overflow: hidden; isolation: isolate;
  box-shadow: 0 1px 2px rgb(0 0 0 / .12), 0 12px 24px -14px color-mix(in srgb, var(--np-tint) 80%, #000);
  transition: box-shadow 700ms ease;
}
/* a sleeve's sheen and edge, over the art */
.np-cover::after {
  content: ""; position: absolute; inset: 0; z-index: 2; border-radius: inherit; pointer-events: none;
  background: linear-gradient(150deg, rgb(255 255 255 / .16), rgb(255 255 255 / 0) 38%);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / .1), inset 0 -1px 0 rgb(0 0 0 / .12);
}
.np-art {
  position: absolute; inset: 0;
  opacity: 0;
  transition: opacity 260ms ease;
}
.np-art[data-active="true"] { opacity: 1; z-index: 1; transition: opacity 420ms ease; }
.np-shapes { display: block; transform: scale(1.08); transition: transform 200ms ease; }
.np-grain { mix-blend-mode: overlay; }
.np-art-type { font-family: inherit; font-size: 4.3px; font-weight: 600; letter-spacing: .32em; }
.np-art-type-2 { font-weight: 400; opacity: .8; }
.np-art[data-active="true"] .np-shapes { transform: none; transition: transform 620ms cubic-bezier(.25, 1.25, .45, 1); }

.np-side { position: relative; display: flex; flex-direction: column; min-width: 0; padding-top: 4px; }

.np-head { display: flex; align-items: center; gap: 8px; height: 16px; font-size: 13px; line-height: 1; color: #6b6b6b; }
.np-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--np-accent); flex: none; }
.np-eq { display: inline-flex; align-items: flex-end; gap: 2px; height: 12px; margin-left: 6px; }
.np-eq i { display: block; width: 2px; height: 12px; border-radius: 1px; background: var(--np-tint); transform-origin: 50% 100%; transform: scaleY(var(--r, .5)); transition: transform 300ms ease, background-color 700ms ease; }
.np-eq i:nth-child(1) { --r: .55; --d: 540ms; --dl: -120ms; }
.np-eq i:nth-child(2) { --r: 1;   --d: 700ms; --dl: -380ms; }
.np-eq i:nth-child(3) { --r: .7;  --d: 460ms; --dl: -60ms; }
.np-eq i:nth-child(4) { --r: .85; --d: 780ms; --dl: -500ms; }
.np-eq i:nth-child(5) { --r: .45; --d: 610ms; --dl: -240ms; }
.np[data-playing="true"] .np-eq i { animation: np-eq var(--d) ease-in-out var(--dl) infinite alternate; }
@keyframes np-eq { from { transform: scaleY(.22); } to { transform: scaleY(1); } }

.np-meta { margin-top: 16px; height: 44px; overflow: hidden; }
.np-meta-in { animation: np-in 420ms cubic-bezier(.3, 1.3, .5, 1) both; }
@keyframes np-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
.np-title { font-size: 20px; font-weight: 500; line-height: 24px; letter-spacing: -0.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.np-artist { margin-top: 2px; font-size: 13px; line-height: 16px; color: #8a8a8a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.np-scrub {
  --np-p: 0;
  position: relative;
  margin-top: auto;
  height: 16px;
  cursor: pointer;
  touch-action: none;
  outline: none;
  border-radius: 8px;
}
.np-scrub:focus-visible { box-shadow: 0 0 0 2px #f8f8f6, 0 0 0 4px var(--np-accent); }
.np-track, .np-fill { position: absolute; left: 0; top: 50%; height: 3px; margin-top: -1.5px; border-radius: 2px; }
.np-track { right: 0; background: #e6e6e3; }
.np-fill { width: calc(var(--np-p) * 100%); background: var(--np-tint); transition: background-color 700ms ease; }
.np-thumb {
  position: absolute; top: 50%; left: calc(var(--np-p) * 100%);
  width: 12px; height: 12px; margin: -6px 0 0 -6px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 1px rgb(0 0 0 / .16), 0 1px 3px rgb(0 0 0 / .18);
  transition: transform 260ms cubic-bezier(.3, 1.4, .5, 1);
}
.np-scrub:hover .np-thumb, .np-scrub:focus-visible .np-thumb { transform: scale(1.15); }
.np-scrub[data-dragging="true"] .np-thumb { transform: scale(1.35); }

.np-times {
  display: flex; justify-content: space-between;
  margin-top: 3px;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; line-height: 1;
  color: #8a8a8a;
  font-variant-numeric: tabular-nums;
}

.np-controls { display: flex; align-items: center; justify-content: center; gap: 22px; margin-top: 8px; }
.np-controls button {
  display: grid; place-items: center;
  padding: 0; border: 0; margin: 0;
  font: inherit; color: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform 220ms cubic-bezier(.3, 1.4, .5, 1), background-color 160ms ease;
}
.np-controls button:active { transform: scale(.92); }
.np-controls button:focus-visible { outline: 2px solid var(--np-accent); outline-offset: 2px; }
.np-controls svg { display: block; fill: currentColor; }
.np-skip { width: 32px; height: 32px; border-radius: 50%; background: transparent; color: #111; }
.np-skip:hover { background: rgb(0 0 0 / .05); }
.np-controls .np-play { position: relative; width: 40px; height: 40px; border-radius: 50%; background: #111; color: #fff; }
.np-play svg { grid-area: 1 / 1; transition: opacity 160ms ease, transform 260ms cubic-bezier(.3, 1.4, .5, 1); }
.np-ico-play { transform: translateX(1px); }
.np[data-playing="true"] .np-ico-play { opacity: 0; transform: translateX(1px) scale(.6); }
.np[data-playing="false"] .np-ico-pause { opacity: 0; transform: scale(.6); }

@media (prefers-reduced-motion: reduce) {
  .np[data-playing="true"] .np-eq i { animation: none; }
  .np-meta-in { animation: none; }
  .np-shapes, .np-art[data-active="true"] .np-shapes { transform: none; transition: none; }
  .np-thumb, .np-play svg, .np-controls button { transition: none; }
  .np, .np-glow, .np-cover, .np-fill, .np-eq i { transition: none; }
}
`;export{B as default};
