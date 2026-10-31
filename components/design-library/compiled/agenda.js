"use client";
/* Construct · Design library: the compiled preview of "Day agenda". The source is for members. */
import{useEffect as A,useRef as S,useState as L}from"react";import{Fragment as j,jsx as t,jsxs as l}from"react/jsx-runtime";var R="#3d3df5",O="#7b5cff",P="#ff4f7b",H="#2ecf8f",D=[{start:"09:30",title:"Team standup",where:"Zoom \xB7 15 min",details:"Marta, Joan, Priya +4",minutes:15,color:R},{start:"11:00",title:"Design critique",where:"Room 4B \xB7 45 min",details:"Bring the onboarding flows",minutes:45,color:O},{start:"13:30",title:"Lunch with Leo",where:"Taberna Sal \xB7 1 h",details:"Table for two, by the window",minutes:60,color:P},{start:"18:00",title:"Evening run",where:"Riverside \xB7 45 min",details:"Easy 6 km, meet at the bridge",minutes:45,color:H}];function Y(o){let g=/^#?([0-9a-f]{6})$/i.exec(o.trim());if(!g)return"#fff";let n=parseInt(g[1],16),a=u=>{let f=u/255;return f<=.04045?f/12.92:((f+.055)/1.055)**2.4};return .2126*a(n>>16&255)+.7152*a(n>>8&255)+.0722*a(n&255)>.3?`color-mix(in oklab, ${o} 26%, #000)`:"#fff"}var v=o=>{let[g,n]=o.split(":").map(Number);return g*60+n};function F({weekday:o="Thursday",day:g=30,month:n="October",events:a=D,colors:s="calendar",accent:u="#3d3df5",today:f="#ff4f7b",autoplay:y=!0}){let h=e=>s==="calendar"&&e?.color||u,w=S(null),m=S([]),E=K(w,y),c=a.length,N=Math.min(1,c-1),[d,k]=L(()=>v(a[N]?.start??"10:00")-20),[r,p]=L(N),[b,T]=L(0),z=(()=>{let e=a.findIndex(i=>v(i.start)+i.minutes>d);return e===-1?0:e})();A(()=>{if(!E||c===0)return;let e=window.setInterval(()=>{if(r!==z){p(z);return}let i=v(a[r].start)-d;if(i>0){k(d+Math.min(5,i));return}if(b<1){T(b+1);return}let x=(r+1)%c;T(0),k(v(a[x].start)-20),p(x)},2e3);return()=>window.clearInterval(e)},[E,c,a,z,d,r,b]);let $=(e,i=!1)=>{let x=(e+c)%c;p(x),T(0),i&&m.current[x]?.focus()},C=e=>{let i={ArrowDown:r+1,ArrowUp:r-1,Home:0,End:c-1};e.key in i&&(e.preventDefault(),$(i[e.key],!0))};return l(j,{children:[t("style",{children:B}),t("div",{className:"ag-wrap",children:l("div",{ref:w,className:"ag",style:{"--ag-accent":u,"--ag-today":f,"--ag-sel":h(a[r]),"--ag-on":Y(h(a[r])),"--ag-i":r},children:[l("div",{className:"ag-date",children:[l("div",{className:"ag-head",children:[t("span",{className:"ag-dot","aria-hidden":!0}),o]}),t("div",{className:"ag-day",children:g}),l("div",{className:"ag-month",children:[t("span",{children:n}),l("span",{className:"ag-count",children:[c," ",c===1?"event":"events"," today"]})]})]}),t("div",{className:"ag-rule","aria-hidden":!0}),l("div",{className:"ag-listwrap",children:[t("span",{className:"ag-wash","aria-hidden":!0}),l("div",{className:"ag-hl","aria-hidden":!0,children:[t("span",{className:"ag-hl-time"}),t("span",{className:"ag-hl-bar"}),t("span",{className:"ag-hl-gap"}),t("span",{className:"ag-pill",children:t("span",{className:"ag-pilltext",children:M(a[r],d)},`${r}-${M(a[r],d)}`)})]}),t("ul",{className:"ag-list","aria-label":`${o} ${g} ${n}`,onKeyDown:C,children:a.map((e,i)=>{let x=v(e.start)+e.minutes<=d;return t("li",{children:l("button",{ref:I=>{m.current[i]=I},type:"button",className:"ag-row",tabIndex:i===r?0:-1,"aria-current":i===r?"true":void 0,"aria-label":`${e.start}, ${e.title}, ${e.where}. ${e.details}. ${M(e,d)}`,"data-past":x||void 0,"data-on":i===r||void 0,style:{"--ag-c":h(e)},onClick:()=>$(i),children:[t("span",{className:"ag-time",children:e.start}),t("span",{className:"ag-bar"}),l("span",{className:"ag-text",children:[t("span",{className:"ag-title",children:e.title}),l("span",{className:"ag-sub",children:[l("span",{className:"ag-where",children:[l("span",{className:"ag-tinline",children:[t("span",{className:"ag-tmono",children:e.start})," \xB7"," "]}),e.where]}),t("span",{className:"ag-details",children:e.details})]})]})]})},e.start+e.title)})})]})]})})]})}function M(o,g){if(!o)return"";let n=v(o.start)-g;if(n>0){if(n<60)return`in ${n} min`;let a=n%60;return a?`in ${Math.floor(n/60)}h ${a}m`:`in ${n/60}h`}return n>-o.minutes?"now":"done"}function K(o,g){let[n,a]=L(!1);return A(()=>{let s=o.current;if(!s)return;let u=window.matchMedia("(prefers-reduced-motion: reduce)"),f=!1,y=!1,h=!1,w=0,m=(p=0)=>{window.clearTimeout(w);let b=g&&f&&!y&&!h&&!u.matches;!b||!p?a(b):w=window.setTimeout(()=>a(!0),p)},E=new IntersectionObserver(([p])=>{f=p.isIntersecting,m()});E.observe(s);let c=()=>{y=!0,m()},N=()=>{y=!1,m(1500)},d=()=>{h=!0,m()},k=p=>{p.relatedTarget instanceof Node&&s.contains(p.relatedTarget)||(h=!1,m(1500))},r=()=>m();return s.addEventListener("pointerenter",c),s.addEventListener("pointerleave",N),s.addEventListener("focusin",d),s.addEventListener("focusout",k),u.addEventListener("change",r),()=>{window.clearTimeout(w),E.disconnect(),s.removeEventListener("pointerenter",c),s.removeEventListener("pointerleave",N),s.removeEventListener("focusin",d),s.removeEventListener("focusout",k),u.removeEventListener("change",r)}},[o,g]),n}var q=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2.2 0 0 0 -.7'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,B=`
.ag-wrap {
  container: ag / inline-size;
  box-sizing: border-box;
  width: 100%;
  max-width: 636px;
  margin: 0 auto;
  padding: 0 18px;
}
.ag {
  --ag-ink: #111;
  --ag-grey: #8a8a8a;
  --ag-row: 60px;
  --ag-cols: 44px 2px 1fr 78px;
  --ag-spring: cubic-bezier(.3, 1.3, .5, 1);
  position: relative;
  isolation: isolate;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 158px 1px 1fr;
  gap: 0 26px;
  padding: 22px 24px 22px 24px;
  border-radius: 28px;
  /* soft light from the top left onto a warm off-white */
  background:
    radial-gradient(90% 120% at 0% 0%, #ffffff 0%, rgb(255 255 255 / 0) 60%),
    #f5f5f1;
  color: var(--ag-ink);
  font-family: inherit;
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / .9),
    0 0 0 1px rgb(0 0 0 / .045),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .16);
}
.ag::before {
  content: "";
  position: absolute; inset: 0; z-index: -1;
  border-radius: inherit;
  background-image: ${q};
  background-size: 160px 160px;
  opacity: .045;
  pointer-events: none;
}

/* Left: the date. */
.ag-date { display: flex; flex-direction: column; min-width: 0; }
.ag-head {
  display: flex; align-items: center; gap: 9px;
  font-size: 13px; line-height: 1; color: #6b6b6b;
}
.ag-dot {
  width: 6px; height: 6px; border-radius: 50%; flex: none;
  background: var(--ag-today);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ag-today) 16%, transparent);
}
.ag-day {
  margin: auto 0 0;
  padding-top: 18px;
  font-size: 118px; font-weight: 400; line-height: .8;
  letter-spacing: -0.06em;
  margin-left: -0.04em;
  font-variant-numeric: tabular-nums;
}
.ag-month {
  display: grid; gap: 6px;
  margin-top: 24px;
  font-size: 17px; font-weight: 500; line-height: 1; letter-spacing: -0.015em;
}
.ag-count { font-size: 12.5px; font-weight: 400; color: var(--ag-grey); letter-spacing: 0; }
.ag-rule { background: rgb(0 0 0 / .07); }

/* Right: the list. Rows are a fixed height so the highlight can slide by
   exactly one row: translateY(index * row). */
.ag-listwrap { position: relative; min-width: 0; align-self: center; }
.ag-list { list-style: none; margin: 0; padding: 0; position: relative; }
.ag-list > li { margin: 0; padding: 0; }
.ag-row, .ag-hl {
  display: grid;
  grid-template-columns: var(--ag-cols);
  align-items: center;
  column-gap: 14px;
  height: var(--ag-row);
}
.ag-row {
  position: relative;
  width: calc(100% + 16px);
  margin: 0 -8px;
  padding: 0 8px;
  box-sizing: border-box;
  border: 0; border-radius: 14px;
  background: transparent;
  color: inherit; font: inherit; text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background-color 200ms ease;
}
.ag-row:hover { background: rgb(0 0 0 / .025); }
.ag-row:focus-visible { outline: 2px solid var(--ag-sel); outline-offset: -2px; }

.ag-time {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; color: var(--ag-grey);
  font-variant-numeric: tabular-nums;
  transition: color 300ms ease;
}
.ag-row[data-on] .ag-time { color: var(--ag-ink); }
/* Every event shows its calendar colour, quietly; the selected one in full. */
.ag-bar {
  align-self: center; height: 30px; border-radius: 2px;
  background: color-mix(in srgb, var(--ag-c) 48%, #ecece8);
  transition: opacity 300ms ease;
}
.ag-row[data-past] .ag-bar { opacity: .55; }
.ag-text { display: grid; gap: 6px; min-width: 0; }
.ag-title {
  font-size: 15px; font-weight: 500; line-height: 1.1; letter-spacing: -0.012em;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: color 300ms ease;
}
.ag-row[data-past] .ag-title { color: #9a9a98; }

/* The secondary line: where + how long, rolling over to the details on hover. */
.ag-sub {
  display: grid; height: 15px; overflow: hidden;
  font-size: 12.5px; line-height: 15px; color: var(--ag-grey);
}
.ag-where, .ag-details {
  grid-area: 1 / 1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: transform 380ms var(--ag-spring), opacity 200ms ease;
}
.ag-details { transform: translateY(100%); opacity: 0; color: #5d5d5d; }
.ag-row:hover .ag-where, .ag-row:focus-visible .ag-where { transform: translateY(-100%); opacity: 0; }
.ag-row:hover .ag-details, .ag-row:focus-visible .ag-details { transform: none; opacity: 1; }
.ag-tinline { display: none; }
.ag-tmono { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11px; font-variant-numeric: tabular-nums; }

/* The selected row's wash: its colour, strongest by the bar, fading out.
   It sits under the rows (the list paints over it). */
.ag-wash {
  position: absolute; left: -8px; right: -8px; top: 0;
  height: var(--ag-row);
  border-radius: 14px;
  background: linear-gradient(90deg,
    color-mix(in srgb, var(--ag-sel) 15%, transparent),
    color-mix(in srgb, var(--ag-sel) 7%, transparent) 45%,
    color-mix(in srgb, var(--ag-sel) 2%, transparent));
  transform: translateY(calc(var(--ag-i) * var(--ag-row)));
  transition: transform 520ms var(--ag-spring), background 400ms ease;
  pointer-events: none;
}

/* The sliding highlight, laid over the rows with the same columns. */
.ag-hl {
  position: absolute; left: 0; right: 0; top: 0;
  z-index: 1;
  pointer-events: none;
  transform: translateY(calc(var(--ag-i) * var(--ag-row)));
  transition: transform 520ms var(--ag-spring);
}
.ag-hl-bar {
  height: 30px; border-radius: 2px;
  background: var(--ag-sel);
  box-shadow: 0 0 10px -1px color-mix(in srgb, var(--ag-sel) 55%, transparent);
  transition: background-color 400ms ease, box-shadow 400ms ease;
}
.ag-pill {
  justify-self: end;
  display: inline-grid; place-items: center;
  height: 22px; padding: 0 9px;
  border-radius: 99px;
  background: var(--ag-sel);
  color: var(--ag-on);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / .22), 0 4px 10px -4px color-mix(in srgb, var(--ag-sel) 70%, transparent);
  transition: background-color 400ms ease, color 400ms ease;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 10.5px; line-height: 1;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  overflow: hidden;
}
.ag-pilltext { display: block; animation: ag-roll 360ms var(--ag-spring) both; }
@keyframes ag-roll { from { transform: translateY(9px); opacity: 0; } }

/* Narrow card (the gallery tile): the time column folds into the line below. */
@container ag (max-width: 500px) {
  .ag { grid-template-columns: 104px 1px 1fr; gap: 0 18px; padding: 20px 18px 20px 20px; --ag-cols: 2px 1fr 70px; --ag-row: 58px; }
  .ag-day { font-size: 84px; }
  .ag-month { margin-top: 18px; font-size: 16px; }
  .ag-time, .ag-hl-time { display: none; }
  .ag-tinline { display: inline; }
  .ag-row { column-gap: 12px; }
  .ag-hl { column-gap: 12px; }
  /* The pill sits on the title's line, so the line below can use the full width. */
  .ag-text { grid-column: 2 / -1; }
  .ag-title { max-width: calc(100% - 78px); }
  .ag-pill { align-self: start; margin-top: 7px; }
}

@media (prefers-reduced-motion: reduce) {
  .ag-hl, .ag-wash, .ag-where, .ag-details { transition: none; }
  .ag-pilltext { animation: none; }
}
`;export{F as default};
