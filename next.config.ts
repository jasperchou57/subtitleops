import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.subtitleops.com" }],
        destination: "https://subtitleops.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
