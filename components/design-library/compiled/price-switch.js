"use client";
/* Construct · Design library: the compiled preview of "Price switch". The source is for members. */
import{useRef as P,useState as S}from"react";import{Fragment as T,jsx as a,jsxs as i}from"react/jsx-runtime";var $=[["monthly","Monthly"],["yearly","Yearly"]];function E({monthly:n=25,yearly:r=20,currency:o="$",plan:l="Pro",tone:d="#ffe14d",onChange:x}){let[s,b]=S("monthly"),w=P([]),f=s==="yearly"?r:n,h=n>0?Math.round((1-r/n)*100):0,g=p(r*12),y=p(n),u=p(r),v=Math.max(y.length,u.length),k=p(f).padStart(v," "),m=(e,t=!1)=>{t&&w.current[e==="monthly"?0:1]?.focus(),e!==s&&(b(e),x?.(e))},N=e=>{let t=e.key;t==="ArrowRight"||t==="ArrowDown"||t==="ArrowLeft"||t==="ArrowUp"?(e.preventDefault(),m(s==="monthly"?"yearly":"monthly",!0)):(t==="Home"||t==="End")&&(e.preventDefault(),m(t==="Home"?"monthly":"yearly",!0))};return i(T,{children:[a("style",{children:M}),i("div",{className:"psw","data-period":s,style:{"--psw-tone":d},children:[i("div",{className:"psw-top",children:[a("span",{className:"psw-plan",children:l}),i("div",{className:"psw-toggle",role:"radiogroup","aria-label":"Billing period",children:[a("span",{className:"psw-pill","aria-hidden":!0}),$.map(([e,t],c)=>a("button",{ref:z=>{w.current[c]=z},type:"button",role:"radio","aria-checked":s===e,tabIndex:s===e?0:-1,className:"psw-opt",onClick:()=>m(e),onKeyDown:N,children:t},e))]})]}),i("div",{className:"psw-price",children:[a("span",{className:"psw-sr","aria-live":"polite",children:`${o}${p(f)} per month, ${s==="yearly"?`billed ${o}${g} yearly`:"billed monthly"}`}),a("span",{className:"psw-cur","aria-hidden":!0,children:o}),a("span",{className:"psw-digits","aria-hidden":!0,children:k.split("").map((e,t)=>/\d/.test(e)||e===" "?a("span",{className:"psw-reel","data-blank":e===" ",style:{"--d":(e===" "?0:Number(e))+(s==="yearly"?10:0),"--i":t},children:a("span",{className:"psw-strip",children:D.map(c=>a("span",{children:c[0]},c))})},t):a("span",{className:"psw-sep",children:e},t))}),a("span",{className:"psw-per","aria-hidden":!0,children:"/mo"}),h>0&&i("span",{className:"psw-save","aria-hidden":!0,children:["Save ",h,"%"]})]}),i("div",{className:"psw-note","aria-hidden":!0,children:[a("span",{"data-show":s==="monthly",children:"Billed monthly, cancel any time"}),i("span",{"data-show":s==="yearly",children:[i("b",{children:[o,g]})," ","billed once a year"]})]})]})]})}var D="01234567890123456789".split("").map((n,r)=>`${n}-${r}`);function p(n){let r=Math.round(n*100)%100!==0,[o,l]=n.toFixed(r?2:0).split("."),d=o.replace(/\B(?=(\d{3})+(?!\d))/g,",");return l?`${d}.${l}`:d}var M=`
.psw {
  --ink: #0d0f12;
  --mute: #6b7079;
  position: relative;
  width: 310px;
  max-width: 100%;
  box-sizing: border-box;
  padding: 20px 22px 22px;
  border-radius: 24px;
  background: #ffffff;
  color: var(--ink);
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgba(13, 15, 18, 0.06),
    0 1px 2px rgba(13, 15, 18, 0.06),
    0 18px 40px -22px rgba(13, 15, 18, 0.35);
}
.psw-sr {
  position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0;
  overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0;
}

.psw-top { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.psw-plan { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; }

/* The switch: two equal halves and one black pill that slides between them. */
.psw-toggle {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 3px;
  border-radius: 999px;
  background: #eef0f2;
  box-shadow: inset 0 1px 2px rgba(13, 15, 18, 0.08);
}
.psw-pill {
  position: absolute; top: 3px; bottom: 3px; left: 3px;
  width: calc(50% - 3px);
  border-radius: 999px;
  background: var(--ink);
  box-shadow: 0 1px 2px rgba(0,0,0,.2), 0 4px 10px -4px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.14);
  transition: transform 420ms cubic-bezier(.3, 1.35, .5, 1);
}
.psw[data-period="yearly"] .psw-pill { transform: translateX(100%); }
.psw-opt {
  position: relative;
  z-index: 1;
  height: 30px;
  padding: 0 13px;
  border: 0;
  border-radius: 999px;
  background: none;
  color: var(--mute);
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  cursor: pointer;
  transition: color 220ms ease;
  -webkit-tap-highlight-color: transparent;
}
.psw-opt[aria-checked="true"] { color: #fff; }
.psw-opt:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.psw-opt:active { transform: scale(0.96); }

/* The price: a currency sign, the reels, and "/mo", all on one baseline. */
.psw-price {
  position: relative;
  display: flex;
  align-items: flex-start;
  margin-top: 22px;
  height: 64px;
}
.psw-cur { font-size: 26px; font-weight: 700; line-height: 1; margin: 7px 3px 0 0; }
.psw-digits {
  display: inline-flex;
  font-size: 64px;
  font-weight: 750;
  letter-spacing: -0.04em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
/* One reel: a window 1em tall over a strip of 0\u20139 0\u20139; --d slides the strip.
   Each reel starts a beat after the one on its left. */
.psw-reel {
  position: relative;
  display: inline-block;
  height: 1em;
  width: 0.62em;
  overflow: hidden;
  transition: width 420ms cubic-bezier(.3, 1.2, .5, 1), opacity 240ms ease;
  -webkit-mask: linear-gradient(transparent, #000 12%, #000 88%, transparent);
  mask: linear-gradient(transparent, #000 12%, #000 88%, transparent);
}
.psw-reel[data-blank="true"] { width: 0; opacity: 0; }
.psw-strip {
  display: flex;
  flex-direction: column;
  transform: translateY(calc(var(--d) * -1em));
  transition: transform 760ms cubic-bezier(.25, 1.2, .4, 1) calc(var(--i) * 70ms);
}
.psw-strip span { display: block; height: 1em; text-align: center; }
.psw-sep { display: inline-block; }
.psw-per { align-self: flex-end; margin: 0 0 9px 4px; font-size: 15px; font-weight: 600; color: var(--mute); }

/* The sticker: off and small until yearly, then it springs on, a little tilted. */
.psw-save {
  position: absolute;
  right: -4px;
  top: 4px;
  padding: 7px 10px 6px;
  border-radius: 10px;
  background: var(--psw-tone);
  color: #0d0f12;
  font-size: 12.5px;
  font-weight: 750;
  letter-spacing: -0.005em;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 1px 1px rgba(0,0,0,.08), 0 6px 14px -6px color-mix(in srgb, var(--psw-tone) 70%, #000);
  transform: rotate(-14deg) scale(0.3);
  opacity: 0;
  transition: transform 180ms cubic-bezier(.5, 0, .9, .5), opacity 140ms ease;
}
.psw[data-period="yearly"] .psw-save {
  transform: rotate(-6deg) scale(1);
  opacity: 1;
  transition: transform 520ms cubic-bezier(.3, 1.8, .45, 1) 260ms, opacity 160ms ease 260ms;
}

.psw-note {
  display: grid;
  margin-top: 12px;
  padding-top: 13px;
  border-top: 1px solid rgba(13, 15, 18, 0.08);
  font-size: 13px;
  color: var(--mute);
  line-height: 1.2;
}
.psw-note b { color: var(--ink); font-weight: 650; font-variant-numeric: tabular-nums; }
.psw-note span {
  grid-area: 1 / 1;
  white-space: nowrap;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 140ms ease, transform 180ms ease;
}
.psw-note span[data-show="true"] {
  opacity: 1;
  transform: none;
  transition: opacity 240ms ease 140ms, transform 380ms cubic-bezier(.3, 1.3, .5, 1) 140ms;
}

@media (prefers-reduced-motion: reduce) {
  .psw-pill, .psw-strip, .psw-reel { transition: none; }
  .psw-save, .psw[data-period="yearly"] .psw-save { transform: rotate(-6deg); transition: opacity 180ms ease; }
  .psw-note span, .psw-note span[data-show="true"] { transform: none; transition: opacity 180ms ease; }
  .psw-opt:active { transform: none; }
}
`;export{E as default};
