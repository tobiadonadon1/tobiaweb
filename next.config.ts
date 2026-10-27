import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev indicator ("N" badge, bottom-left).
  devIndicators: false,
  skipTrailingSlashRedirect: true,

  // The shop's sealed product files are read at runtime by path, which the
  // file tracer cannot see, so they are listed here or they would be missing
  // from the deployed functions. See lib/shop/file.ts.
  outputFileTracingIncludes: {
    "/api/download": ["./private/**/*"],
    "/api/shop/health": ["./private/**/*"],
    // The webhook attaches the zip to the delivery email.
    "/api/stripe/webhook": ["./private/**/*"],
    // A free product that is a PDF goes out attached, read from here.
    "/api/free": ["./private/**/*"],
    // Copycat Detective reads video frames with the ffmpeg binary that
    // ffmpeg-static downloads at install; it's spawned by path, so list it.
    "/api/copycat/check": ["./node_modules/ffmpeg-static/ffmpeg"],
    // The Design library's sealed sources and the training sheets (lib/design/files.ts, lib/training).
    "/api/design/source": ["./private/design/**/*"],
    "/api/membership/file": ["./private/training/**/*"],
    // The members' Telegram link and QR code (lib/membership/contact.ts).
    "/api/membership/perks": ["./private/members/**/*"],
    // The Drive copies of the Masterclass lessons, for buyers without a plan
    // (lib/masterclass/drive.ts): the delivery email (above) and the thank-you page.
    "/projects/construct/\\[shelf\\]/\\[folder\\]/\\[entry\\]/thanks": ["./private/masterclass/**/*"],
  },
  // Required at runtime from node_modules (it resolves its binary's path).
  serverExternalPackages: ["ffmpeg-static"],

  // Sole was renamed to Mynd. Keep the old path alive permanently so any
  // existing link or indexed result lands on the new page instead of a 404.
  async redirects() {
    return [
      /* The short link for posts. Temporary on purpose: it is a campaign
         address that may point somewhere else later, and a 301 would be
         cached by every browser that ever followed it. */
      { source: "/98c", destination: "/projects/construct/material/setups/the-98c-trade", permanent: false },
      { source: "/projects/sole", destination: "/projects/mynd", statusCode: 301 },
      /* Viral Machine went free and moved to Skills on its launch day. */
      { source: "/projects/construct/material/setups/viral-machine", destination: "/projects/construct/material/skills/viral-machine", statusCode: 301 },
      /* Video Machine was renamed Video Editor the day after it launched. */
      { source: "/projects/construct/material/skills/video-machine", destination: "/projects/construct/material/skills/video-editor", statusCode: 301 },
      // Motion Designer took Motion Director's place on the shelf (2026-10-23).
      { source: "/projects/construct/material/skills/motion-director", destination: "/projects/construct/material/skills/motion-designer", statusCode: 301 },
      { source: "/projects/superhuman", destination: "/projects/construct", statusCode: 301 },
      { source: "/projects/superhuman/", destination: "/projects/construct", statusCode: 301 },
      { source: "/projects/superhuman/materials", destination: "/projects/construct/material", statusCode: 301 },
      { source: "/projects/superhuman/materials/:path*", destination: "/projects/construct/material/:path*", statusCode: 301 },
      { source: "/projects/superhuman/atelier", destination: "/projects/construct/material/skills/art-director", statusCode: 301 },
      { source: "/projects/superhuman/the-spec", destination: "/projects/construct/material/skills/product-manager", statusCode: 301 },
      /* These four sit ABOVE the catch-all below, which is evaluated first
         and would otherwise swallow them into a second hop. */
      { source: "/projects/superhuman/page-copy", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/projects/superhuman/motion-scale", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/projects/superhuman/tester", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/projects/superhuman/ship-check", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/projects/superhuman/:path*", destination: "/projects/construct/:path*", statusCode: 301 },
      { source: "/projects/construct/materials", destination: "/projects/construct/material", statusCode: 301 },
      { source: "/projects/construct/materials/:path*", destination: "/projects/construct/material/:path*", statusCode: 301 },
      { source: "/projects/construct/atelier", destination: "/projects/construct/material/skills/art-director", statusCode: 301 },
      { source: "/projects/construct/the-spec", destination: "/projects/construct/material/skills/product-manager", statusCode: 301 },
      { source: "/construct/atelier", destination: "/projects/construct/material/skills/art-director", statusCode: 301 },
      { source: "/construct/the-spec", destination: "/projects/construct/material/skills/product-manager", statusCode: 301 },
      /* The four skills that were retired when the folder went from six
         thin files to three deep ones. They have no file any more, so they
         land on the folder that replaced them rather than 404ing. */
      { source: "/projects/construct/page-copy", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/construct/page-copy", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/projects/construct/motion-scale", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/construct/motion-scale", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/projects/construct/tester", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/construct/tester", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/projects/construct/ship-check", destination: "/projects/construct/material/skills", statusCode: 301 },
      { source: "/construct/ship-check", destination: "/projects/construct/material/skills", statusCode: 301 },
      /* Masterclass and Design both have their own pages again (the
         screening room, the library); the old short addresses go there. */
      { source: "/construct/masterclass", destination: "/projects/construct/masterclass", statusCode: 301 },
      { source: "/construct/design", destination: "/projects/construct/design", statusCode: 301 },
      /* The-sweep absorbed Tester and Ship check. */
      { source: "/projects/construct/the-sweep", destination: "/projects/construct/material/skills/code-reviewer", statusCode: 301 },
      { source: "/construct/the-sweep", destination: "/projects/construct/material/skills/code-reviewer", statusCode: 301 },
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
};

export default nextConfig;
