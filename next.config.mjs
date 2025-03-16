/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config) => {
      config.devServer = {
        ...config.devServer,
        host: '0.0.0.0', // 외부에서 접속 허용
      };
      return config;
    },
  };
  
  export default nextConfig;
  