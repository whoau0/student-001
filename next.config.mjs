/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["pptxgenjs", "docx"],
  },
};

export default nextConfig;
