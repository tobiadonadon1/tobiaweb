"use client";
/* Construct · Design library: the compiled preview of "Code boxes". The source is for members. */
import{useEffect as N,useId as Y,useRef as C,useState as b}from"react";import{Fragment as F,jsx as s,jsxs as i}from"react/jsx-runtime";function j({length:E=6,tone:z="#2b44c4",code:M="123456",title:S="Check your email",sentTo:L="ana@studio.co",onComplete:X}){let r=E===4?4:6,u=M.slice(0,r),[p,m]=b(()=>Array(r).fill("")),[n,d]=b("idle"),[y,w]=b(-1),[$,B]=b(0),D=C([]),v=C(null),g=Y();N(()=>{m(Array(r).fill("")),d("idle")},[r]);let l=e=>{let t=D.current[Math.max(0,Math.min(r-1,e))];t?.focus(),t?.select()},c=(e,t)=>{if(m(e),e.every(Boolean)){let a=e.join(""),o=a===u;d(o?"success":"error"),o||B(x=>x+1),X?.(a,o);return}n!=="idle"&&d("idle"),l(t)},T=(e,t)=>{let a=e.replace(/\D/g,"");if(!a)return;let o=a.length>=r?0:t,x=[...p];for(let f=0;f<a.length&&o+f<r;f++)x[o+f]=a[f];c(x,Math.min(r-1,o+a.length))};N(()=>{if(n==="error"){let e=setTimeout(()=>d("clearing"),820);return()=>clearTimeout(e)}if(n==="clearing"){let e=setTimeout(()=>{m(Array(r).fill("")),d("retry"),v.current?.contains(document.activeElement)&&l(0)},180);return()=>clearTimeout(e)}if(n==="success"){let e=setTimeout(()=>{let t=v.current?.contains(document.activeElement);m(Array(r).fill("")),d("idle"),t&&l(0)},1900);return()=>clearTimeout(e)}},[n,r]);let h=n==="success"||n==="error"||n==="clearing",A=y===-1&&!h?p.findIndex(e=>!e):-1,K=(e,t)=>{if(e.metaKey||e.ctrlKey||e.altKey)return;if(h){(e.key.length===1||e.key==="Backspace"||e.key==="Delete")&&e.preventDefault();return}let a=e.key;if(/^\d$/.test(a)){e.preventDefault();let o=[...p];o[t]=a,c(o,t+1)}else if(a==="Backspace"){e.preventDefault();let o=[...p];p[t]?(o[t]="",c(o,t)):t>0&&(o[t-1]="",c(o,t-1))}else if(a==="Delete"){e.preventDefault();let o=[...p];o[t]="",c(o,t)}else a==="ArrowLeft"?(e.preventDefault(),l(t-1)):a==="ArrowRight"?(e.preventDefault(),l(t+1)):a==="Home"?(e.preventDefault(),l(0)):a==="End"?(e.preventDefault(),l(r-1)):a.length===1&&e.preventDefault()},P=(e,t)=>{if(h)return;let a=e.target.value.replace(/\D/g,"");if(a)if(a.length===2&&p[t]){let o=[...p];o[t]=a.replace(p[t],"")||a[1],c(o,t+1)}else T(a,t);else{let o=[...p];o[t]="",c(o,t)}},H=(e,t)=>{e.preventDefault(),h||T(e.clipboardData.getData("text"),t)},I=n==="success"?"Verified":n==="idle"?`Try ${u}`:`That code didn't work. Try ${u}`,k=n==="success"?"ok":n==="idle"?"hint":"bad";return i(F,{children:[s("style",{children:W}),i("div",{className:"otp","data-status":n,style:{"--tone":z},children:[i("div",{className:"otp-head",children:[i("span",{className:"otp-mail","aria-hidden":!0,children:[i("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.9",strokeLinecap:"round",strokeLinejoin:"round",children:[s("rect",{x:"3",y:"5.5",width:"18",height:"13",rx:"2.5"}),s("path",{d:"M3.8 7l8.2 6 8.2-6"})]}),s("span",{className:"otp-ping"})]}),s("p",{className:"otp-title",id:`${g}-t`,children:S}),i("p",{className:"otp-sub",children:["We sent a ",r,"-digit code to ",s("b",{children:L})]})]}),s("div",{ref:v,role:"group","aria-labelledby":`${g}-t`,"aria-describedby":`${g}-m`,className:"otp-row",style:n==="error"?{animationName:$%2?"otp-shake-a":"otp-shake-b"}:void 0,children:p.map((e,t)=>i("span",{style:{display:"contents"},children:[r===6&&t===3&&s("span",{className:"otp-sep","aria-hidden":!0}),i("span",{className:"otp-cell","data-active":y===t,"data-next":A===t,"data-filled":!!e,style:{"--i":t},children:[s("input",{ref:a=>{D.current[t]=a},className:"otp-input",value:e,onChange:a=>P(a,t),onKeyDown:a=>K(a,t),onPaste:a=>H(a,t),onFocus:a=>{w(t),a.currentTarget.select()},onBlur:()=>w(a=>a===t?-1:a),inputMode:"numeric",pattern:"[0-9]*",autoComplete:t===0?"one-time-code":"off","aria-label":`Digit ${t+1} of ${r}`,"aria-invalid":n==="error"||n==="clearing"?!0:void 0,readOnly:n==="success"}),e&&s("span",{className:"otp-digit","aria-hidden":!0,children:e})]})]},t))}),i("div",{className:"otp-msg","aria-hidden":!0,children:[i("span",{className:"otp-line","data-show":k==="hint",children:["Try ",s("code",{children:u})]}),i("span",{className:"otp-line otp-bad","data-show":k==="bad",children:["That code didn't work. Try ",s("code",{children:u})]}),i("span",{className:"otp-line otp-ok","data-show":k==="ok",children:[s("svg",{width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.8",strokeLinecap:"round",strokeLinejoin:"round",children:s("path",{d:"M5 12.5l4.5 4.5L19 7.5"})}),"Verified"]})]}),s("span",{className:"otp-sr",id:`${g}-m`,"aria-live":"polite",children:I})]})]})}var W=`
.otp {
  --ink: #0b1f3a;
  --ok: #1e6a48;
  --bad: #d8452f;
  display: grid;
  justify-items: center;
  gap: 22px;
  color: var(--ink);
  font-family: inherit;
  text-align: center;
}
.otp-head { display: grid; justify-items: center; gap: 6px; }
.otp-mail {
  position: relative;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 8px;
  border-radius: 15px;
  background: var(--tone);
  color: #fff;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .2), 0 10px 20px -10px var(--tone);
  transform: rotate(-4deg);
}
.otp-mail svg { display: block; }
.otp-ping {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--bad);
  box-shadow: 0 0 0 2.5px #fff;
}
.otp-ping::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--bad);
  animation: otp-ping 2.4s cubic-bezier(.2, .7, .3, 1) infinite;
}
@keyframes otp-ping { 0% { opacity: .55; transform: scale(1); } 60%, 100% { opacity: 0; transform: scale(2.6); } }
.otp[data-status="success"] .otp-ping { background: var(--ok); }
.otp[data-status="success"] .otp-ping::after { animation: none; }
.otp-title { margin: 0; font-size: 19px; font-weight: 650; letter-spacing: -0.018em; line-height: 1.2; }
.otp-sub { margin: 0; font-size: 14px; line-height: 1.4; color: color-mix(in srgb, var(--ink) 58%, transparent); }
.otp-sub b { font-weight: 600; color: var(--ink); }

.otp-row {
  display: flex;
  align-items: center;
  gap: 8px;
  animation-duration: 440ms;
  animation-timing-function: cubic-bezier(.36, .07, .19, .97);
}
.otp-sep { width: 10px; height: 2px; margin: 0 3px; border-radius: 2px; background: color-mix(in srgb, var(--ink) 22%, transparent); }

.otp-cell {
  position: relative;
  width: 48px;
  height: 58px;
  border-radius: 14px;
  background: #fff;
  /* a keycap: hairline, a heavier bottom edge, a soft drop */
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--ink) 13%, transparent),
    inset 0 -2px 0 color-mix(in srgb, var(--ink) 7%, transparent),
    0 1px 2px color-mix(in srgb, var(--ink) 7%, transparent),
    0 6px 12px -8px color-mix(in srgb, var(--ink) 25%, transparent);
  transition:
    box-shadow 200ms ease,
    background-color 220ms ease,
    transform 300ms cubic-bezier(.3, 1.5, .5, 1);
}
.otp-cell[data-active="true"] {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px -10px var(--tone);
}

.otp-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: inherit;
  background: transparent;
  color: transparent;
  caret-color: transparent;
  font: inherit;
  font-size: 16px;
  text-align: center;
  outline: none;
  cursor: text;
  -webkit-tap-highlight-color: transparent;
  transition: box-shadow 200ms ease;
}
/* the focus ring lives on the input itself, which covers its box exactly */
.otp-input:focus {
  box-shadow:
    inset 0 0 0 1.5px var(--tone),
    0 0 0 4px color-mix(in srgb, var(--tone) 16%, transparent);
}
.otp:not([data-status="idle"]):not([data-status="retry"]) .otp-input:focus { box-shadow: none; }
.otp-input::selection { background: transparent; color: transparent; }

.otp-digit {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
  transition: color 200ms ease, opacity 160ms ease, transform 160ms ease;
  animation: otp-pop 380ms cubic-bezier(.3, 1.5, .5, 1) both;
}
@keyframes otp-pop {
  0% { opacity: 0; transform: translateY(7px) scale(.55); }
  45% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}

/* the next box, before anything has focus: a tinted edge and a slow caret */
.otp-cell[data-next="true"] {
  box-shadow:
    inset 0 0 0 1.5px color-mix(in srgb, var(--tone) 45%, transparent),
    0 0 0 4px color-mix(in srgb, var(--tone) 8%, transparent),
    0 6px 12px -8px color-mix(in srgb, var(--ink) 25%, transparent);
}
.otp-cell[data-next="true"]::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 24px;
  margin: -12px 0 0 -1px;
  border-radius: 2px;
  background: var(--tone);
  opacity: .45;
  animation: otp-breathe 2.2s ease-in-out infinite;
  pointer-events: none;
}
@keyframes otp-breathe { 0%, 100% { opacity: .5; } 50% { opacity: .1; } }

/* the caret: drawn, so it sits dead centre and blinks like the system one */
.otp-cell[data-active="true"][data-filled="false"]::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 2px;
  height: 24px;
  margin: -12px 0 0 -1px;
  border-radius: 2px;
  background: var(--tone);
  animation: otp-blink 1.1s steps(1, end) infinite;
}
@keyframes otp-blink { 0%, 55% { opacity: 1; } 56%, 100% { opacity: 0; } }

/* wrong */
.otp[data-status="error"] .otp-cell,
.otp[data-status="clearing"] .otp-cell {
  background: color-mix(in srgb, var(--bad) 7%, #fff);
  box-shadow: inset 0 0 0 1.5px var(--bad), 0 0 0 4px color-mix(in srgb, var(--bad) 13%, transparent);
  transform: none;
}
.otp[data-status="error"] .otp-digit,
.otp[data-status="clearing"] .otp-digit { color: var(--bad); }
.otp[data-status="clearing"] .otp-digit { opacity: 0; transform: translateY(5px) scale(.85); }
.otp[data-status="error"] .otp-cell::after,
.otp[data-status="clearing"] .otp-cell::after { display: none; }
@keyframes otp-shake-a { 0%, 100% { transform: none; } 15% { transform: translateX(-9px); } 30% { transform: translateX(8px); } 45% { transform: translateX(-6px); } 60% { transform: translateX(4px); } 75% { transform: translateX(-2px); } }
@keyframes otp-shake-b { 0%, 100% { transform: none; } 15% { transform: translateX(-9px); } 30% { transform: translateX(8px); } 45% { transform: translateX(-6px); } 60% { transform: translateX(4px); } 75% { transform: translateX(-2px); } }

/* right: green, one box after the other */
.otp[data-status="success"] .otp-cell {
  background: var(--ok);
  box-shadow: inset 0 0 0 1px var(--ok), 0 10px 18px -12px var(--ok);
  transform: none;
  transition-delay: calc(var(--i) * 70ms);
  animation: otp-bump 460ms calc(var(--i) * 70ms) cubic-bezier(.3, 1.5, .5, 1) both;
}
.otp[data-status="success"] .otp-digit { color: #fff; transition-delay: calc(var(--i) * 70ms); }
.otp[data-status="success"] .otp-cell::after { display: none; }
@keyframes otp-bump { 0% { transform: scale(1); } 40% { transform: scale(1.09) translateY(-3px); } 100% { transform: none; } }

/* the line under the boxes rolls between hint, error and success */
.otp-msg { display: grid; height: 20px; overflow: hidden; }
.otp-line {
  grid-area: 1 / 1;
  display: block;
  font-size: 14px;
  line-height: 20px;
  white-space: nowrap;
  color: color-mix(in srgb, var(--ink) 55%, transparent);
  opacity: 0;
  transform: translateY(100%);
  transition: transform 340ms cubic-bezier(.2, .9, .3, 1.15), opacity 200ms ease;
}
.otp-line[data-show="true"] { opacity: 1; transform: none; }
.otp-line[data-show="false"]:first-child { transform: translateY(-100%); }
.otp-line code {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 13px;
  letter-spacing: 0.06em;
  color: var(--ink);
  font-weight: 600;
}
.otp-bad { color: var(--bad); }
.otp-bad code { color: var(--bad); }
.otp-ok { color: var(--ok); font-weight: 600; }
.otp-ok svg { display: inline-block; vertical-align: -3px; margin-right: 6px; }
.otp-ok path { stroke-dasharray: 24; stroke-dashoffset: 24; }
.otp[data-status="success"] .otp-ok path { animation: otp-draw 420ms 260ms cubic-bezier(.6, 0, .2, 1) forwards; }
@keyframes otp-draw { to { stroke-dashoffset: 0; } }

.otp-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .otp-row { animation: none !important; }
  .otp-digit, .otp[data-status="success"] .otp-cell { animation: none; }
  .otp-cell, .otp-line, .otp-digit { transition-duration: 1ms; transition-delay: 0ms !important; }
  .otp-cell[data-active="true"] { transform: none; }
  .otp[data-status="success"] .otp-ok path { animation: none; stroke-dashoffset: 0; }
  .otp-cell[data-active="true"][data-filled="false"]::after, .otp-cell[data-next="true"]::after, .otp-ping::after { animation: none; }
}
`;export{j as default};
