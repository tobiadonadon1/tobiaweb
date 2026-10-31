"use client";
/* Construct · Design library: the compiled preview of "Day agenda". The source is for members. */
import{useEffect as T,useRef as M,useState as L}from"react";import{Fragment as D,jsx as a,jsxs as l}from"react/jsx-runtime";var A=[{start:"09:30",title:"Team standup",where:"Zoom \xB7 15 min",details:"Marta, Joan, Priya +4",minutes:15},{start:"11:00",title:"Design critique",where:"Room 4B \xB7 45 min",details:"Bring the onboarding flows",minutes:45},{start:"13:30",title:"Lunch with Leo",where:"Taberna Sal \xB7 1 h",details:"Table for two, by the window",minutes:60},{start:"16:00",title:"Release review",where:"Video call \xB7 30 min",details:"Version 4.2, ship or wait",minutes:30}],b=g=>{let[c,r]=g.split(":").map(Number);return c*60+r};function R({weekday:g="Thursday",day:c=30,month:r="October",events:i=A,accent:o="#3d3df5",autoplay:y=!0}){let N=M(null),h=M([]),f=I(N,y),s=i.length,m=Math.min(1,s-1),[p,E]=L(()=>b(i[m]?.start??"10:00")-20),[t,x]=L(m),[w,v]=L(0),d=(()=>{let e=i.findIndex(n=>b(n.start)+n.minutes>p);return e===-1?0:e})();T(()=>{if(!f||s===0)return;let e=window.setInterval(()=>{if(t!==d){x(d);return}let n=b(i[t].start)-p;if(n>0){E(p+Math.min(5,n));return}if(w<1){v(w+1);return}let u=(t+1)%s;v(0),E(b(i[u].start)-20),x(u)},2e3);return()=>window.clearInterval(e)},[f,s,i,d,p,t,w]);let k=(e,n=!1)=>{let u=(e+s)%s;x(u),v(0),n&&h.current[u]?.focus()},$=e=>{let n={ArrowDown:t+1,ArrowUp:t-1,Home:0,End:s-1};e.key in n&&(e.preventDefault(),k(n[e.key],!0))};return l(D,{children:[a("style",{children:P}),a("div",{className:"ag-wrap",children:l("div",{ref:N,className:"ag",style:{"--ag-accent":o,"--ag-i":t},children:[l("div",{className:"ag-date",children:[l("div",{className:"ag-head",children:[a("span",{className:"ag-dot","aria-hidden":!0}),g]}),a("div",{className:"ag-day",children:c}),l("div",{className:"ag-month",children:[a("span",{children:r}),l("span",{className:"ag-count",children:[s," ",s===1?"event":"events"," today"]})]})]}),a("div",{className:"ag-rule","aria-hidden":!0}),l("div",{className:"ag-listwrap",children:[l("div",{className:"ag-hl","aria-hidden":!0,children:[a("span",{className:"ag-hl-time"}),a("span",{className:"ag-hl-bar"}),a("span",{className:"ag-hl-gap"}),a("span",{className:"ag-pill",children:a("span",{className:"ag-pilltext",children:z(i[t],p)},`${t}-${z(i[t],p)}`)})]}),a("ul",{className:"ag-list","aria-label":`${g} ${c} ${r}`,onKeyDown:$,children:i.map((e,n)=>{let u=b(e.start)+e.minutes<=p;return a("li",{children:l("button",{ref:S=>{h.current[n]=S},type:"button",className:"ag-row",tabIndex:n===t?0:-1,"aria-current":n===t?"true":void 0,"aria-label":`${e.start}, ${e.title}, ${e.where}. ${e.details}. ${z(e,p)}`,"data-past":u||void 0,"data-on":n===t||void 0,onClick:()=>k(n),children:[a("span",{className:"ag-time",children:e.start}),a("span",{className:"ag-bar"}),l("span",{className:"ag-text",children:[a("span",{className:"ag-title",children:e.title}),l("span",{className:"ag-sub",children:[l("span",{className:"ag-where",children:[l("span",{className:"ag-tinline",children:[a("span",{className:"ag-tmono",children:e.start})," \xB7"," "]}),e.where]}),a("span",{className:"ag-details",children:e.details})]})]})]})},e.start+e.title)})})]})]})})]})}function z(g,c){if(!g)return"";let r=b(g.start)-c;if(r>0){if(r<60)return`in ${r} min`;let i=r%60;return i?`in ${Math.floor(r/60)}h ${i}m`:`in ${r/60}h`}return r>-g.minutes?"now":"done"}function I(g,c){let[r,i]=L(!1);return T(()=>{let o=g.current;if(!o)return;let y=window.matchMedia("(prefers-reduced-motion: reduce)"),N=!1,h=!1,f=!1,s=0,m=(d=0)=>{window.clearTimeout(s);let k=c&&N&&!h&&!f&&!y.matches;!k||!d?i(k):s=window.setTimeout(()=>i(!0),d)},p=new IntersectionObserver(([d])=>{N=d.isIntersecting,m()});p.observe(o);let E=()=>{h=!0,m()},t=()=>{h=!1,m(1500)},x=()=>{f=!0,m()},w=d=>{d.relatedTarget instanceof Node&&o.contains(d.relatedTarget)||(f=!1,m(1500))},v=()=>m();return o.addEventListener("pointerenter",E),o.addEventListener("pointerleave",t),o.addEventListener("focusin",x),o.addEventListener("focusout",w),y.addEventListener("change",v),()=>{window.clearTimeout(s),p.disconnect(),o.removeEventListener("pointerenter",E),o.removeEventListener("pointerleave",t),o.removeEventListener("focusin",x),o.removeEventListener("focusout",w),y.removeEventListener("change",v)}},[g,c]),r}var P=`
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
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 158px 1px 1fr;
  gap: 0 26px;
  padding: 22px 24px 22px 24px;
  border-radius: 28px;
  background: #f8f8f6;
  color: var(--ag-ink);
  font-family: inherit;
  box-shadow:
    0 0 0 1px rgb(0 0 0 / .04),
    0 1px 2px rgb(0 0 0 / .04),
    0 10px 30px -14px rgb(0 0 0 / .14);
}

/* Left: the date. */
.ag-date { display: flex; flex-direction: column; min-width: 0; }
.ag-head {
  display: flex; align-items: center; gap: 9px;
  font-size: 13px; line-height: 1; color: #6b6b6b;
}
.ag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ag-accent); flex: none; }
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
.ag-row:focus-visible { outline: 2px solid var(--ag-accent); outline-offset: -2px; }

.ag-time {
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; color: var(--ag-grey);
  font-variant-numeric: tabular-nums;
  transition: color 300ms ease;
}
.ag-row[data-on] .ag-time { color: var(--ag-ink); }
.ag-bar { align-self: center; height: 30px; border-radius: 2px; background: #e0e0dd; }
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

/* The sliding highlight, laid over the rows with the same columns. */
.ag-hl {
  position: absolute; left: 0; right: 0; top: 0;
  z-index: 1;
  pointer-events: none;
  transform: translateY(calc(var(--ag-i) * var(--ag-row)));
  transition: transform 520ms var(--ag-spring);
}
.ag-hl-bar { height: 30px; border-radius: 2px; background: var(--ag-accent); }
.ag-pill {
  justify-self: end;
  display: inline-grid; place-items: center;
  height: 22px; padding: 0 9px;
  border-radius: 99px;
  background: var(--ag-accent);
  color: #fff;
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
  .ag-hl, .ag-where, .ag-details { transition: none; }
  .ag-pilltext { animation: none; }
}
`;export{R as default};
