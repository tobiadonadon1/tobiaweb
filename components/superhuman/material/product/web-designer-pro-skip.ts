/**
 * When Web Designer Pro's opening does not play (web-designer-pro-intro.tsx):
 * only on the way back from Stripe (?checkout=). Every other visit plays it.
 * Plain module: app/layout.tsx inlines SKIP_SCRIPT in <head> (a <script>
 * rendered by the page itself makes React complain on a client-side visit).
 */
import { WEB_DESIGNER_PRO } from "@/lib/shop/products";

export const SKIP_CSS = ".wdp-intro{display:none!important}body:has(.wdp-intro) [data-site-nav]{animation:none!important}";

/** Runs before the first paint on a full load of the page; adds <style id="wdp-skip"> when the opening should not play. */
export const SKIP_SCRIPT = `(function(){try{if(location.pathname!==${JSON.stringify(WEB_DESIGNER_PRO.href)})return;if(location.search.indexOf("checkout=")>-1){var s=document.createElement("style");s.id="wdp-skip";s.textContent=${JSON.stringify(SKIP_CSS)};document.head.appendChild(s)}}catch(e){}})();`;
