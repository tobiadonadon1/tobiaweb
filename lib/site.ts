/**
 * THE CANONICAL HOST, WRITTEN ONCE.
 *
 * It was `https://tobiadonadon.com` typed into seven files, and the site does
 * not serve on that host: the apex 308s to `www.tobiadonadon.com`. So every
 * canonical link, every Open Graph url, every JSON-LD `@id` and every sitemap
 * entry pointed at a redirect. That costs a hop on every crawl, weakens the
 * canonical signal, and as far as a search engine's entity graph is concerned
 * splits one person across two hostnames.
 *
 * The host lives here now, and if the primary domain ever changes this is the
 * one line that changes with it.
 */
export const SITE = "https://www.tobiadonadon.com";

/** An absolute URL for a site-root-relative path. */
export const abs = (path: string) => `${SITE}${path}`;

/**
 * The host without its scheme, for the places that print it as words rather
 * than link to it (the share card, mostly).
 */
export const SITE_LABEL = "tobiadonadon.com";
