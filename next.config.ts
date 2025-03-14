/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['image.tmdb.org', 'm.media-amazon.com'], // 🔹 أضف m.media-amazon.com هنا
  },
};

module.exports = nextConfig;