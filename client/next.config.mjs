/** @type {import('next').NextConfig} */
const nextConfig = {
  // Images and SVGs are imported as plain URL strings / React components
  // (matching the previous Vite behavior), so Next's static image imports
  // are disabled and handled by explicit webpack rules below.
  images: {
    disableStaticImages: true,
  },
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.(png|jpe?g|gif|webp|avif|ico)$/i,
        type: "asset/resource",
        generator: {
          filename: "static/media/[name].[hash:8][ext]",
        },
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              exportType: "named",
              namedExport: "ReactComponent",
            },
          },
        ],
      }
    );
    return config;
  },
};

export default nextConfig;
