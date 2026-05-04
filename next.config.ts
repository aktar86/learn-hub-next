/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // গুগল ইমেজের জন্য
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // গিটহাবের জন্য
      },
    ],
  },
};

export default nextConfig;
