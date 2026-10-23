"use client";
/* Construct · Design library: the compiled preview of "Password strength". The source is for members. */
import{useId as N,useState as b}from"react";import{Fragment as C,jsx as s,jsxs as r}from"react/jsx-runtime";var c=[{label:"8+ characters",test:a=>a.length>=8},{label:"A number",test:a=>/\d/.test(a)},{label:"A symbol",test:a=>/[^A-Za-z0-9\s]/.test(a)},{label:"Upper & lower case",test:a=>/[a-z]/.test(a)&&/[A-Z]/.test(a)}],w=[{word:"",colour:"transparent"},{word:"Weak",colour:"#d8452f"},{word:"Fair",colour:"#e09a2b"},{word:"Good",colour:"#4b9a52"},{word:"Strong",colour:"#1e6a48"}];function z({tone:a="#0b1f3a",label:x="Create a password",hint:m="You\u2019ll use it to sign in to Studio",onChange:h}){let[l,v]=b(""),[n,k]=b(!1),o=N(),p=c.map(e=>e.test(l)),f=p.filter(Boolean).length,i=l?Math.max(1,p[0]?f:Math.min(f,2)):0,d=w[i];return r(C,{children:[s("style",{children:S}),r("div",{className:"pws","data-score":i,style:{"--tone":a,"--level":d.colour},children:[r("div",{className:"pws-top",children:[s("span",{className:"pws-key","aria-hidden":!0,children:r("svg",{width:"18",height:"18",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[s("circle",{cx:"8",cy:"15",r:"4.5"}),s("path",{d:"M11.2 11.8L20 3M16.5 6.5l2.5 2.5M14 9l2 2"})]})}),r("span",{className:"pws-titles",children:[s("label",{className:"pws-label",htmlFor:`${o}-in`,children:x}),m?s("span",{className:"pws-hint",children:m}):null]}),s("div",{className:"pws-word","aria-hidden":!0,children:w.slice(1).map((e,t)=>s("span",{"data-show":i===t+1,"data-past":i>t+1,style:{color:e.colour},children:e.word},e.word))})]}),r("div",{className:"pws-field",children:[s("input",{id:`${o}-in`,className:"pws-input",type:n?"text":"password",value:l,onChange:e=>{let t=e.target.value;if(v(t),h){let g=c.map(y=>y.test(t)),u=g.filter(Boolean).length;h(t,t?Math.max(1,g[0]?u:Math.min(u,2)):0)}},autoComplete:"new-password",autoCapitalize:"off",autoCorrect:"off",spellCheck:!1,placeholder:"At least 8 characters","aria-describedby":`${o}-s ${o}-r`}),s("button",{type:"button",className:"pws-eye","data-shown":n,"aria-label":n?"Hide password":"Show password","aria-pressed":n,onClick:()=>k(e=>!e),children:r("svg",{width:"20",height:"20",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"1.8",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":!0,children:[s("path",{className:"pws-lid",d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"}),s("circle",{className:"pws-pupil",cx:"12",cy:"12",r:"3"}),s("path",{className:"pws-slash-gap",d:"M4 4l16 16"}),s("path",{className:"pws-slash",d:"M4 4l16 16"})]})})]}),r("div",{className:"pws-meter-row",children:[s("div",{className:"pws-meter","aria-hidden":!0,children:[1,2,3,4].map(e=>s("span",{className:"pws-seg","data-on":e<=i,style:{"--i":e,"--ghost":w[e].colour},children:s("span",{className:"pws-seg-fill"})},e))}),s("span",{className:"pws-sr",id:`${o}-s`,"aria-live":"polite",children:d.word?`Password strength: ${d.word}`:""})]}),s("ul",{className:"pws-rules",id:`${o}-r`,"aria-label":"Your password needs",children:c.map((e,t)=>r("li",{className:"pws-rule","data-met":p[t],children:[s("span",{className:"pws-tick","aria-hidden":!0,children:r("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:[s("circle",{className:"pws-ring",cx:"8",cy:"8",r:"7.25"}),s("circle",{className:"pws-dot",cx:"8",cy:"8",r:"8"}),s("path",{className:"pws-check",d:"M4.6 8.3l2.2 2.2 4.6-4.9"})]})}),e.label,s("span",{className:"pws-sr",children:p[t]?", done":", not yet"})]},e.label))})]})]})}var S=`
.pws {
  --ink: #0b1f3a;
  --muted: color-mix(in srgb, #0b1f3a 52%, transparent);
  --line: color-mix(in srgb, #0b1f3a 13%, transparent);
  --field: #f5f3ee;
  display: grid;
  gap: 0;
  box-sizing: border-box;
  width: 340px;
  max-width: 100%;
  padding: 18px 18px 20px;
  border-radius: 22px;
  background: #fff;
  color: var(--ink);
  font-family: inherit;
  text-align: left;
  box-shadow:
    0 0 0 1px color-mix(in srgb, #0b1f3a 7%, transparent),
    0 1px 2px color-mix(in srgb, #0b1f3a 6%, transparent),
    0 22px 44px -26px color-mix(in srgb, #0b1f3a 45%, transparent);
}
.pws-top { display: flex; align-items: center; gap: 12px; margin: 0 0 14px; }
.pws-key {
  display: grid;
  place-items: center;
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: var(--tone);
  color: #fff;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .18), 0 6px 12px -6px var(--tone);
}
.pws-key svg { display: block; }
.pws-titles { display: grid; gap: 1px; flex: 1; min-width: 0; }
.pws-label { font-size: 15px; font-weight: 650; letter-spacing: -0.012em; line-height: 20px; }
.pws-hint { font-size: 12.5px; line-height: 17px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.pws-field { position: relative; }
.pws-input {
  box-sizing: border-box;
  display: block;
  width: 100%;
  height: 50px;
  margin: 0;
  padding: 0 52px 0 16px;
  border: 0;
  border-radius: 14px;
  background: var(--field);
  color: var(--ink);
  font: inherit;
  font-size: 16px;
  letter-spacing: 0.01em;
  outline: none;
  box-shadow: inset 0 0 0 1px var(--line), inset 0 1px 2px color-mix(in srgb, #0b1f3a 6%, transparent);
  transition: box-shadow 200ms ease, background-color 200ms ease;
}
.pws-field:focus-within { --field: #fff; }
.pws-input[type="password"]:not(:placeholder-shown) { letter-spacing: 0.14em; }
.pws-input::placeholder { color: color-mix(in srgb, #0b1f3a 36%, transparent); letter-spacing: 0; }
.pws-input:focus {
  box-shadow:
    inset 0 0 0 1.5px var(--tone),
    0 0 0 4px color-mix(in srgb, var(--tone) 15%, transparent);
}
.pws-input::-ms-reveal { display: none; }

.pws-eye {
  position: absolute;
  top: 7px;
  right: 7px;
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease, transform 220ms cubic-bezier(.3, 1.4, .5, 1);
}
.pws-eye svg { display: block; overflow: visible; }
.pws-eye:hover { background: color-mix(in srgb, #0b1f3a 6%, transparent); color: var(--ink); }
.pws-eye:active { transform: scale(.92); }
.pws-eye:focus-visible { outline: 2px solid var(--tone); outline-offset: 1px; }
.pws-pupil { transform-origin: 12px 12px; transition: transform 340ms cubic-bezier(.3, 1.5, .5, 1); }
.pws-slash, .pws-slash-gap {
  stroke-dasharray: 23;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 300ms cubic-bezier(.6, 0, .2, 1);
}
.pws-slash-gap { stroke: var(--field); stroke-width: 4.5; transition: stroke 200ms ease, stroke-dashoffset 300ms cubic-bezier(.6, 0, .2, 1); }
/* hidden password: eye with a slash. shown: the slash pulls back and the pupil pops */
.pws-eye[data-shown="true"] .pws-slash,
.pws-eye[data-shown="true"] .pws-slash-gap { stroke-dashoffset: 23; transition-duration: 220ms; }
.pws-eye[data-shown="true"] .pws-pupil { transform: scale(1.15); }
.pws-eye[data-shown="false"] .pws-pupil { transform: scale(.8); }

/* meter */
.pws-meter-row { position: relative; margin: 14px 0 0; }
.pws-meter { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; }
/* empty, each segment shows its own level's colour faintly: the whole range, red to green */
.pws-seg {
  position: relative;
  height: 8px;
  border-radius: 99px;
  overflow: hidden;
  background: color-mix(in srgb, var(--ghost) 17%, #fff);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ghost) 12%, transparent);
}
.pws-seg-fill {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--level);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 220ms cubic-bezier(.5, 0, .8, .4), background-color 260ms ease;
}
.pws-seg[data-on="true"] .pws-seg-fill {
  transform: none;
  transition: transform 460ms calc((var(--i) - 1) * 40ms) cubic-bezier(.25, 1, .35, 1), background-color 260ms ease;
}
/* Strong: one sheen across the whole meter */
.pws-seg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, .75), transparent);
  transform: translateX(-120%);
}
.pws[data-score="4"] .pws-seg::after { animation: pws-sheen 700ms calc(260ms + var(--i) * 90ms) ease-out both; }
@keyframes pws-sheen { to { transform: translateX(120%); } }

.pws-word {
  position: relative;
  display: grid;
  width: 52px;
  height: 20px;
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  line-height: 20px;
  text-align: right;
}
.pws-word span {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(100%);
  transition: transform 340ms cubic-bezier(.2, .9, .3, 1.15), opacity 180ms ease;
}
.pws-word span[data-past="true"] { transform: translateY(-100%); }
.pws-word span[data-show="true"] { opacity: 1; transform: none; }

/* checklist */
.pws-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px 12px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.pws-rule {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  line-height: 18px;
  white-space: nowrap;
  color: var(--muted);
  transition: color 220ms ease;
}
.pws-rule[data-met="true"] { color: var(--ink); }
.pws-tick { display: grid; flex: none; }
.pws-tick svg { display: block; overflow: visible; }
.pws-ring { stroke: color-mix(in srgb, #0b1f3a 24%, transparent); stroke-width: 1.5; transition: opacity 200ms ease; }
.pws-dot {
  fill: var(--tone);
  transform-origin: 8px 8px;
  transform: scale(0);
  transition: transform 200ms ease;
}
.pws-check {
  stroke: #fff;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 11;
  stroke-dashoffset: 11;
  transition: stroke-dashoffset 120ms ease;
}
.pws-rule[data-met="true"] .pws-ring { opacity: 0; }
.pws-rule[data-met="true"] .pws-dot { transform: none; transition: transform 380ms cubic-bezier(.3, 1.6, .5, 1); }
.pws-rule[data-met="true"] .pws-check { stroke-dashoffset: 0; transition: stroke-dashoffset 300ms 120ms cubic-bezier(.6, 0, .2, 1); }

.pws-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); clip-path: inset(50%); white-space: nowrap; }

@media (prefers-reduced-motion: reduce) {
  .pws *, .pws *::after { transition-duration: 1ms !important; transition-delay: 0ms !important; }
  .pws[data-score="4"] .pws-seg::after { animation: none; }
  .pws-eye:active { transform: none; }
}
`;export{z as default};
