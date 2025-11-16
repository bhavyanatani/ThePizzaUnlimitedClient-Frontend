/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'example.com',           // the domain from your image URLs
      'res.cloudinary.com',    // if you ever use Cloudinary
      'localhost',             // for local dev images
      'your-image-domain.com'  // add any others you need
    ],
  },
};

export default nextConfig;
