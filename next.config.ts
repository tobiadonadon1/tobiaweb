import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev indicator ("N" badge, bottom-left).
  devIndicators: false,

  // Sole was renamed to Mynd. Keep the old path alive permanently so any
  // existing link or indexed result lands on the new page instead of a 404.
  async redirects() {
    return [
      { source: "/projects/sole", destination: "/projects/mynd", permanent: true },
      { source: "/projects/superhuman", destination: "/projects/construct", permanent: true },
      { source: "/projects/superhuman/:path*", destination: "/projects/construct/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
