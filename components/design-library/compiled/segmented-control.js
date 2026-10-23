"use client";
/* Construct · Design library: the compiled preview of "Segmented control". The source is for members. */
import{useEffect as B,useLayoutEffect as I,useRef as x,useState as q}from"react";import{Fragment as J,jsx as i,jsxs as $}from"react/jsx-runtime";var U=typeof window>"u"?B:I;function V({options:r=["Day","Week","Month","Year"],value:l,defaultValue:g="Week",onChange:f,tone:k="#e09a2b",variant:v="pill",label:h="Time range"}){let[M,K]=q(g),o=r.includes(l??M)?l??M:r[0],w=x(null),c=x([]),A=(e,s=!1)=>{l===void 0&&K(e),e!==o&&f?.(e),s&&c.current[r.indexOf(e)]?.focus()},m=x(null),b=x(0);U(()=>{let e=w.current,s=c.current[r.indexOf(o)];if(!e||!s)return;let n=s.offsetLeft,a=n+s.offsetWidth,d=c.current[0],p=c.current[r.length-1],O=d?d.offsetLeft:n,P=p?p.offsetLeft+p.offsetWidth:a,L=(y,u)=>{e.style.setProperty("--seg-l",`${y.toFixed(2)}px`),e.style.setProperty("--seg-r",`${u.toFixed(2)}px`)};cancelAnimationFrame(b.current);let t=m.current;if(!t){m.current={l:n,r:a,vl:0,vr:0},L(n,a),e.dataset.ready="true";return}let T=window.matchMedia("(prefers-reduced-motion: reduce)").matches,W=n>t.l,F={k:520,c:30},D={k:300,c:26},N={k:1400,c:75},R=T?N:W?D:F,S=T?N:W?F:D,z=performance.now(),C=y=>{let u=Math.min(.024,(y-z)/1e3);z=y,t.vl+=(-R.k*(t.l-n)-R.c*t.vl)*u,t.vr+=(-S.k*(t.r-a)-S.c*t.vr)*u,t.l+=t.vl*u,t.r+=t.vr*u,t.l<O&&(t.l=O,t.vl=Math.max(0,t.vl)),t.r>P&&(t.r=P,t.vr=Math.min(0,t.vr)),L(t.l,t.r),Math.abs(t.l-n)+Math.abs(t.r-a)>.1||Math.abs(t.vl)+Math.abs(t.vr)>2?b.current=requestAnimationFrame(C):(Object.assign(t,{l:n,r:a,vl:0,vr:0}),L(n,a))};return b.current=requestAnimationFrame(C),()=>cancelAnimationFrame(b.current)},[o,r.join("|"),v]);let E=x(0);E.current=Math.max(0,r.indexOf(o)),B(()=>{let e=w.current;if(!e||typeof ResizeObserver>"u")return;let s=e.offsetWidth,n=new ResizeObserver(()=>{let a=c.current[E.current];if(e.offsetWidth===s||!a||!m.current)return;s=e.offsetWidth,cancelAnimationFrame(b.current);let d=a.offsetLeft,p=d+a.offsetWidth;Object.assign(m.current,{l:d,r:p,vl:0,vr:0}),e.style.setProperty("--seg-l",`${d}px`),e.style.setProperty("--seg-r",`${p}px`)});return n.observe(e),()=>n.disconnect()},[r.join("|")]);let j=e=>{let s=r.indexOf(o),n=r.length,a=e.key==="ArrowRight"||e.key==="ArrowDown"?(s+1)%n:e.key==="ArrowLeft"||e.key==="ArrowUp"?(s-1+n)%n:e.key==="Home"?0:e.key==="End"?n-1:-1;a<0||(e.preventDefault(),A(r[a],!0))};return $(J,{children:[i("style",{children:G}),$("div",{ref:w,className:"seg",role:"radiogroup","aria-label":h,"data-variant":v,style:{"--tone":k,"--on-tone":Y(k)},children:[i("span",{className:"seg-pill","aria-hidden":!0}),r.map((e,s)=>i("button",{ref:n=>{c.current[s]=n},type:"button",role:"radio","aria-checked":e===o,tabIndex:e===o?0:-1,className:"seg-opt",onClick:()=>A(e),onKeyDown:j,children:i(H,{children:e})},e)),i("span",{className:"seg-top","aria-hidden":!0,children:r.map(e=>i("span",{className:"seg-opt",children:i(H,{children:e})},e))})]})]})}function H({children:r}){return i("span",{className:"seg-txt","data-label":r,children:i("span",{children:r})})}function Y(r){let l=/^#?([0-9a-f]{6})$/i.exec(r.trim());if(!l)return"#fff";let g=parseInt(l[1],16),f=v=>{let h=v/255;return h<=.03928?h/12.92:((h+.055)/1.055)**2.4};return .2126*f(g>>16&255)+.7152*f(g>>8&255)+.0722*f(g&255)>.3?"#0b1f3a":"#fff"}var G=`
.seg {
  --ink: #0b1f3a;
  --seg-l: 0px;
  --seg-r: 0px;
  position: relative;
  display: inline-flex;
  padding: 4px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ink) 6%, #f8f2e6);
  box-shadow: inset 0 0 0 1px rgba(11, 31, 58, 0.07), inset 0 1px 2px rgba(11, 31, 58, 0.06);
  color: var(--ink);
  font-family: inherit;
  isolation: isolate;
}
.seg-opt {
  position: relative;
  display: inline-grid;
  place-items: center;
  height: 40px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: color-mix(in srgb, var(--ink) 60%, transparent);
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  letter-spacing: -0.005em;
  white-space: nowrap;
  cursor: pointer;
  transition: color 160ms ease;
  -webkit-tap-highlight-color: transparent;
}
.seg-opt:hover { color: var(--ink); }
.seg-opt:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }

.seg-txt { display: inline-grid; }
.seg-txt > span, .seg-txt::after { grid-area: 1 / 1; text-align: center; }
.seg-txt::after { content: attr(data-label); font-weight: 650; visibility: hidden; height: 0; overflow: hidden; }

.seg-pill {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  top: 4px;
  bottom: 4px;
  left: var(--seg-l);
  width: calc(var(--seg-r) - var(--seg-l));
  border-radius: 999px;
  background: var(--tone);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    0 1px 2px rgba(11, 31, 58, 0.18),
    0 6px 14px -8px color-mix(in srgb, var(--tone) 80%, #000);
}
.seg-top {
  position: absolute;
  z-index: 2;
  inset: 0;
  display: flex;
  padding: 4px;
  pointer-events: none;
  clip-path: inset(4px calc(100% - var(--seg-r)) 4px var(--seg-l) round 999px);
}
.seg-top .seg-opt { color: var(--on-tone); font-weight: 650; }

/* Before the first measurement (server HTML, first paint): style the chosen option directly. */
.seg:not([data-ready]) .seg-top { visibility: hidden; }
.seg:not([data-ready]) .seg-pill { visibility: hidden; }
.seg:not([data-ready]) .seg-opt[aria-checked="true"] { background: var(--tone); color: var(--on-tone); font-weight: 650; }

/* Underline: no track, a hairline, and a short bar under the chosen label. */
.seg[data-variant="underline"] {
  padding: 0 4px;
  border-radius: 0;
  background: transparent;
  box-shadow: inset 0 -1px 0 rgba(11, 31, 58, 0.14);
}
.seg[data-variant="underline"] .seg-opt { height: 46px; padding: 0 16px; border-radius: 10px; }
.seg[data-variant="underline"] .seg-pill {
  top: auto;
  bottom: 0;
  height: 3px;
  left: calc(var(--seg-l) + 12px);
  width: calc(var(--seg-r) - var(--seg-l) - 24px);
  border-radius: 3px 3px 0 0;
  box-shadow: none;
}
/* the bar is thin, so the chosen label simply takes the weight (its width is reserved) */
.seg[data-variant="underline"] .seg-top { display: none; }
.seg[data-variant="underline"] .seg-opt[aria-checked="true"] { color: var(--ink); font-weight: 650; }
.seg[data-variant="underline"]:not([data-ready]) .seg-opt[aria-checked="true"] { background: transparent; box-shadow: inset 0 -3px 0 var(--tone); }
`;export{V as default};
