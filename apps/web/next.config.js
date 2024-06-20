/** @type {import('next').NextConfig} */
const nextConfig = {
  redirects: async () => {
    return [
      {
        source: "/feedback",
        destination: "https://r1qh6wkrbp3.feishu.cn/share/base/form/shrcnepZuUcUkRvahgXj0eF6Zdc",
        permanent: true,
      },
      {
        source: "/docs",
        destination: "https://r1qh6wkrbp3.feishu.cn/docx/ROtddQ5SZoMaAxxLg2lc79SZn5g?from=from_copylink",
        permanent: true,
      },
    ];
  },
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;