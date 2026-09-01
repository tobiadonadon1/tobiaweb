import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev indicator ("N" badge, bottom-left).
  devIndicators: false,

  // Sole was renamed to Mynd. Keep the old path alive permanently so any
  // existing link or indexed result lands on the new page instead of a 404.
  async redirects() {
    return [
      { source: "/projects/sole", destination: "/projects/mynd", statusCode: 301 },
      { source: "/projects/superhuman", destination: "/projects/construct", statusCode: 301 },
      { source: "/projects/superhuman/materials", destination: "/projects/construct/material", statusCode: 301 },
      { source: "/projects/superhuman/materials/:path*", destination: "/projects/construct/material/:path*", statusCode: 301 },
      { source: "/projects/superhuman/:path*", destination: "/projects/construct/:path*", statusCode: 301 },
      { source: "/projects/construct/materials", destination: "/projects/construct/material", statusCode: 301 },
      { source: "/projects/construct/materials/:path*", destination: "/projects/construct/material/:path*", statusCode: 301 },
    ];
  },
};

export default nextConfig;
