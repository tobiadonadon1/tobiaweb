import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev indicator ("N" badge, bottom-left).
  devIndicators: false,
  skipTrailingSlashRedirect: true,

  // Sole was renamed to Mynd. Keep the old path alive permanently so any
  // existing link or indexed result lands on the new page instead of a 404.
  async redirects() {
    return [
      { source: "/projects/sole", destination: "/projects/mynd", statusCode: 301 },
      { source: "/projects/superhuman", destination: "/projects/construct", statusCode: 301 },
      { source: "/projects/superhuman/", destination: "/projects/construct", statusCode: 301 },
      { source: "/projects/superhuman/materials", destination: "/projects/construct/material", statusCode: 301 },
      { source: "/projects/superhuman/materials/:path*", destination: "/projects/construct/material/:path*", statusCode: 301 },
      { source: "/projects/superhuman/:path*", destination: "/projects/construct/:path*", statusCode: 301 },
      { source: "/projects/construct/materials", destination: "/projects/construct/material", statusCode: 301 },
      { source: "/projects/construct/materials/:path*", destination: "/projects/construct/material/:path*", statusCode: 301 },
      { source: "/projects/construct/atelier", destination: "/construct/skills/atelier/SKILL.md", statusCode: 301 },
      { source: "/projects/construct/page-copy", destination: "/construct/skills/page-copy/SKILL.md", statusCode: 301 },
      { source: "/projects/construct/motion-scale", destination: "/construct/skills/motion-scale/SKILL.md", statusCode: 301 },
      { source: "/projects/construct/the-spec", destination: "/construct/skills/the-spec/SKILL.md", statusCode: 301 },
      { source: "/projects/construct/tester", destination: "/construct/skills/tester/SKILL.md", statusCode: 301 },
      { source: "/projects/construct/ship-check", destination: "/construct/skills/ship-check/SKILL.md", statusCode: 301 },
      { source: "/projects/superhuman/atelier", destination: "/construct/skills/atelier/SKILL.md", statusCode: 301 },
      { source: "/projects/superhuman/page-copy", destination: "/construct/skills/page-copy/SKILL.md", statusCode: 301 },
      { source: "/projects/superhuman/motion-scale", destination: "/construct/skills/motion-scale/SKILL.md", statusCode: 301 },
      { source: "/projects/superhuman/the-spec", destination: "/construct/skills/the-spec/SKILL.md", statusCode: 301 },
      { source: "/projects/superhuman/tester", destination: "/construct/skills/tester/SKILL.md", statusCode: 301 },
      { source: "/projects/superhuman/ship-check", destination: "/construct/skills/ship-check/SKILL.md", statusCode: 301 },
      { source: "/construct/atelier", destination: "/construct/skills/atelier/SKILL.md", statusCode: 301 },
      { source: "/construct/page-copy", destination: "/construct/skills/page-copy/SKILL.md", statusCode: 301 },
      { source: "/construct/motion-scale", destination: "/construct/skills/motion-scale/SKILL.md", statusCode: 301 },
      { source: "/construct/the-spec", destination: "/construct/skills/the-spec/SKILL.md", statusCode: 301 },
      { source: "/construct/tester", destination: "/construct/skills/tester/SKILL.md", statusCode: 301 },
      { source: "/construct/ship-check", destination: "/construct/skills/ship-check/SKILL.md", statusCode: 301 },
      { source: "/:path+/", destination: "/:path+", statusCode: 301 },
    ];
  },
};

export default nextConfig;
