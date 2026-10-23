"use client";
/* Construct · Design library: the compiled preview of "Folder". The source is for members. */
import{useState as u}from"react";import{Fragment as v,jsx as o,jsxs as p}from"react/jsx-runtime";var w=["photo","pdf","doc"];function m({tone:e="#3d9cf0",name:r="Launch kit",files:i=["Hero.jpg","Brief.pdf","Notes.txt"],onOpenFile:c}){let[t,n]=u(-1),[s,l]=u(!1),h=q(e)>.55,b=()=>{n(-1),l(!1)};return p(v,{children:[o("style",{children:x}),p("div",{className:"ffo","data-open":s,"data-picked":t>=0,style:{"--tone":e,"--back":g(e,"#000000",.14),"--front-top":g(e,"#ffffff",.22),"--pill-ink":h?"#1d1d1f":"#ffffff"},onPointerDown:a=>{a.pointerType!=="mouse"&&(a.target.closest(".ffo-file")?l(!0):l(f=>!f))},onPointerLeave:a=>{a.pointerType==="mouse"&&!a.currentTarget.contains(document.activeElement)&&b()},onBlur:a=>{a.currentTarget.contains(a.relatedTarget)||b()},children:[p("div",{className:"ffo-box",children:[o("div",{className:"ffo-back","aria-hidden":!0}),w.map((a,f)=>o("button",{type:"button",className:"ffo-file","data-kind":a,"data-picked":t===f,style:{"--i":f},"aria-pressed":t===f,"aria-label":i[f],onClick:()=>{n(t===f?-1:f),t!==f&&c?.(i[f])},children:o(k,{kind:a})},a)),o("div",{className:"ffo-front","aria-hidden":!0})]}),o("div",{className:"ffo-name","aria-live":"polite",children:o("span",{className:"ffo-pill",children:t>=0?i[t]:r})})]})]})}function k({kind:e}){return e==="photo"?o("span",{className:"ffo-paper ffo-photo",children:p("span",{className:"ffo-scene",children:[o("span",{className:"ffo-sun"}),o("span",{className:"ffo-far"}),o("span",{className:"ffo-near"})]})}):e==="pdf"?p("span",{className:"ffo-paper ffo-page",children:[o("span",{className:"ffo-rule"}),o("span",{className:"ffo-lines"}),o("span",{className:"ffo-badge",children:"PDF"})]}):p("span",{className:"ffo-paper ffo-page ffo-doc",children:[o("span",{className:"ffo-title"}),o("span",{className:"ffo-lines"})]})}function d(e){return/^#[0-9a-f]{6}$/i.test(e.trim())?[1,3,5].map(r=>parseInt(e.trim().slice(r,r+2),16)):null}function g(e,r,i){let c=d(e),t=d(r);return!c||!t?e:`#${c.map((n,s)=>Math.round(n+(t[s]-n)*i).toString(16).padStart(2,"0")).join("")}`}function q(e){let r=d(e);if(!r)return 0;let[i,c,t]=r.map(n=>{let s=n/255;return s<=.03928?s/12.92:((s+.055)/1.055)**2.4});return .2126*i+.7152*c+.0722*t}var x=`
.ffo {
  --tone: #3d9cf0;
  position: relative;
  width: clamp(190px, 44%, 270px);
  padding-top: 16%;
  container-type: inline-size;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
.ffo-box { position: relative; height: 74cqw; perspective: 1100px; }

/* The back panel with its tab. */
.ffo-back {
  position: absolute; inset: 0;
  border-radius: 4cqw;
  border-top-left-radius: 0;
  background: var(--back);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.25);
  transform-origin: 50% 100%;
  transition: transform 380ms cubic-bezier(.3, 1.35, .5, 1);
}
.ffo-back::before {
  content: "";
  position: absolute;
  left: 0; bottom: 100%;
  width: 40%; height: 9cqw;
  border-radius: 3.6cqw 3.6cqw 0 0;
  background: var(--back);
}
.ffo-back::after {
  /* the slanted shoulder from the tab down to the panel */
  content: "";
  position: absolute;
  left: calc(40% - 1px); bottom: 100%;
  width: 7cqw; height: 9cqw;
  background: var(--back);
  clip-path: polygon(0 0, 18% 0, 100% 100%, 0 100%);
}

/* The front flap: tips toward you from its bottom edge. */
.ffo-front {
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 84%;
  border-radius: 4cqw;
  background: linear-gradient(180deg, var(--front-top), var(--tone) 70%);
  box-shadow:
    inset 0 1.2cqw 0 rgba(255,255,255,.35),
    inset 0 -1px 0 rgba(0,0,0,.08),
    0 1px 1px rgba(0,0,0,.06),
    0 18px 30px -18px rgba(10, 30, 60, .55);
  z-index: 5;
  transform-origin: 50% 100%;
  transition: transform 380ms cubic-bezier(.3, 1.35, .5, 1);
  pointer-events: none;
}

/* The files sit between the panels, peeking over the flap. */
.ffo-file {
  --i: 0;
  position: absolute;
  left: 29%; bottom: 8%;
  width: 42%; height: 78%;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  cursor: pointer;
  transform-origin: 50% 100%;
  transform: translate(calc((var(--i) - 1) * 7cqw), calc(var(--i) * -1.4cqw)) rotate(calc((var(--i) - 1) * 4deg));
  transition: transform 300ms cubic-bezier(.4, 0, .2, 1);
  outline: none;
  -webkit-tap-highlight-color: transparent;
}
.ffo-file[data-kind="pdf"] { z-index: 1; }
.ffo-paper {
  position: absolute; inset: 0;
  display: block;
  border-radius: 2.2cqw;
  background: #fff;
  box-shadow: 0 0 0 1px rgba(0,0,0,.06), 0 6px 14px -8px rgba(0,0,0,.35);
  overflow: hidden;
  transition: box-shadow 260ms ease;
}
.ffo-file:focus-visible .ffo-paper { box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--tone), 0 10px 18px -8px rgba(0,0,0,.35); }

/* Open: the flap tips, the files rise and fan, left to right. */
.ffo:hover .ffo-front, .ffo:focus-within .ffo-front, .ffo[data-open="true"] .ffo-front { transform: rotateX(-24deg); }
.ffo:hover .ffo-back, .ffo:focus-within .ffo-back, .ffo[data-open="true"] .ffo-back { transform: rotateX(12deg); }
.ffo:hover .ffo-file, .ffo:focus-within .ffo-file, .ffo[data-open="true"] .ffo-file {
  transform: translate(calc((var(--i) - 1) * 23cqw), calc(-40cqw + (1 - (var(--i) - 1) * (var(--i) - 1)) * -7cqw)) rotate(calc((var(--i) - 1) * 11deg));
  transition: transform 520ms cubic-bezier(.3, 1.45, .5, 1) calc(var(--i) * 45ms);
}
/* A picked file lifts a little further and casts a longer shadow. */
.ffo .ffo-file[data-picked="true"] {
  transform: translate(calc((var(--i) - 1) * 24cqw), calc(-45cqw + (1 - (var(--i) - 1) * (var(--i) - 1)) * -7cqw)) rotate(calc((var(--i) - 1) * 7deg)) scale(1.05);
  transition: transform 360ms cubic-bezier(.3, 1.5, .5, 1);
  z-index: 2;
}
.ffo-file[data-picked="true"] .ffo-paper { box-shadow: 0 0 0 1px rgba(0,0,0,.05), 0 18px 28px -12px rgba(0,0,0,.45); }
.ffo-file:active .ffo-paper { box-shadow: 0 0 0 1px rgba(0,0,0,.08), 0 3px 8px -4px rgba(0,0,0,.4); }

/* The photo: a print with a white border, a sunset over hills. */
.ffo-photo { padding: 2.6cqw; }
.ffo-scene {
  position: absolute; inset: 2.6cqw 2.6cqw 9cqw;
  border-radius: 1cqw;
  overflow: hidden;
  background: linear-gradient(180deg, #ff6b5a 0%, #ff9a4d 52%, #ffd27a 100%);
}
.ffo-sun { position: absolute; left: 50%; top: 34%; width: 16cqw; height: 16cqw; margin-left: -8cqw; border-radius: 50%; background: #fff4c9; }
.ffo-far { position: absolute; inset: 46% -10% 0; background: #c2366b; clip-path: polygon(0 100%, 0 46%, 22% 18%, 40% 52%, 62% 6%, 84% 44%, 100% 26%, 100% 100%); }
.ffo-near { position: absolute; inset: 66% -10% 0; background: #5b1d5e; clip-path: polygon(0 100%, 0 30%, 30% 60%, 58% 8%, 100% 52%, 100% 100%); }

/* Pages: a dog-eared corner and grey text lines. */
.ffo-page::before {
  content: "";
  position: absolute; right: 0; top: 0;
  width: 11cqw; height: 11cqw;
  background: linear-gradient(225deg, #f1f1f0 50%, #dcdcdc 50%);
  border-bottom-left-radius: 1.6cqw;
}
.ffo-rule { position: absolute; left: 5cqw; right: 15cqw; top: 6cqw; height: 2.4cqw; border-radius: 1cqw; background: #e8443a; }
.ffo-title { position: absolute; left: 5cqw; right: 17cqw; top: 6cqw; height: 3.4cqw; border-radius: 1cqw; background: #2f6fec; }
.ffo-lines {
  position: absolute; left: 5cqw; right: 5cqw; top: 14cqw; bottom: 16cqw;
  background: repeating-linear-gradient(180deg, #dfe1e5 0 1.6cqw, transparent 1.6cqw 4.4cqw);
  -webkit-mask: linear-gradient(90deg, #000 70%, rgba(0,0,0,.55));
  mask: linear-gradient(90deg, #000 70%, rgba(0,0,0,.55));
}
.ffo-doc .ffo-lines { top: 13cqw; bottom: 7cqw; }
.ffo-badge {
  position: absolute; left: 5cqw; bottom: 5cqw;
  padding: 1cqw 2.4cqw;
  border-radius: 1.4cqw;
  background: #e8443a;
  color: #fff;
  font-size: 5.2cqw;
  font-weight: 700;
  letter-spacing: .02em;
  line-height: 1.1;
}

/* The name under it; a picked file's name shows in a selection pill. */
.ffo-name { display: flex; justify-content: center; margin-top: 4.5cqw; }
.ffo-pill {
  max-width: 100%;
  padding: 2px 8px;
  border-radius: 6px;
  color: #1d1d1f;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: -0.005em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background-color 160ms ease, color 160ms ease;
}
.ffo[data-picked="true"] .ffo-pill { background: var(--tone); color: var(--pill-ink); }

@media (prefers-reduced-motion: reduce) {
  .ffo-front, .ffo-file, .ffo:hover .ffo-file, .ffo:focus-within .ffo-file, .ffo[data-open="true"] .ffo-file, .ffo .ffo-file[data-picked="true"] { transition: none; }
  .ffo-back { transition: none; }
  .ffo:hover .ffo-front, .ffo:focus-within .ffo-front, .ffo[data-open="true"] .ffo-front,
  .ffo:hover .ffo-back, .ffo:focus-within .ffo-back, .ffo[data-open="true"] .ffo-back { transform: none; }
}
`;export{m as default};
