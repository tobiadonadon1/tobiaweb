import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev indicator ("N" badge, bottom-left).
  devIndicators: false,

  // Sole was renamed to Mynd. Keep the old path alive permanently so any
  // existing link or indexed result lands on the new page instead of a 404.
  async redirects() {
    return [
      { source: "/projects/sole", destination: "/projects/mynd", permanent: true },
    ];
  },
};

export default nextConfig;
