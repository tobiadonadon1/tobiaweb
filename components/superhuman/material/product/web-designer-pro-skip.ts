/**
 * When Web Designer Pro's opening does not play (web-designer-pro-intro.tsx):
 * a return visit in the same tab, or a return from Stripe (?checkout=). A
 * refresh plays it again. Plain module: app/layout.tsx inlines SKIP_SCRIPT in
 * <head> (a <script> rendered by the page itself makes React complain on a
 * client-side visit), and the client component shares KEY.
 */
import { WEB_DESIGNER_PRO } from "@/lib/shop/products";

export const KEY = "wdp-intro";
export const SKIP_CSS = ".wdp-intro{display:none!important}body:has(.wdp-intro) [data-site-nav]{animation:none!important}";

/** Runs before the first paint on a full load of the page; adds <style id="wdp-skip"> when the opening should not play. */
export const SKIP_SCRIPT = `(function(){try{if(location.pathname!==${JSON.stringify(WEB_DESIGNER_PRO.href)})return;var n=performance.getEntriesByType("navigation")[0];var p=sessionStorage.getItem("${KEY}")==="1";if(location.search.indexOf("checkout=")>-1||(p&&!(n&&n.type==="reload"))){var s=document.createElement("style");s.id="wdp-skip";s.textContent=${JSON.stringify(SKIP_CSS)};document.head.appendChild(s)}}catch(e){}})();`;
