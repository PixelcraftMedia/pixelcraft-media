/** @type {import("next").NextConfig} */

const nextConfig = {
	generateBuildId: async () => {
		return 'build_' + Date.now(); // Генерация уникального идентификатора сборки
	  },
	reactStrictMode: true,
	images: {
	  remotePatterns: [
		{
		  protocol: 'https',
		  hostname: 'images.ctfassets.net',
		  port: '', // оставьте пустым, если не требуется
		  pathname: '/**', // разрешаем все пути
		},
		{
		  protocol: 'https',
		  hostname: 'cdn.sanity.io', // Добавляем разрешение для cdn.sanity.io
		  port: '', // оставьте пустым, если не требуется
		  pathname: '/**', // разрешаем все пути
		},
		{
			protocol: 'https',
			hostname: 'assets.ctfassets.net', // Добавляем разрешение для cdn.sanity.io
			port: '', // оставьте пустым, если не требуется
			pathname: '/**', // разрешаем все пути
		  },
		  {
			protocol: 'https',
			hostname: 'ayushsingh.co.in', // Добавляем разрешение для cdn.sanity.io
			port: '', // оставьте пустым, если не требуется
			pathname: '/**', // разрешаем все пути
		  },
	  ],
	},

	i18n: {
	  locales: ['ro-RO'],
	  defaultLocale: 'ro-RO',
	},
	webpack(config) {
	  config.module.rules.push({
		test: /\.svg$/,
		use: [{ loader: "@svgr/webpack", options: { icon: true } }]
	  });
  
	  return config;
	}
  };
  
  module.exports = nextConfig;
  









/** const nextConfig = {
	
	reactStrictMode: true,
	images: {
		remotePatterns: [
		  {
			protocol: 'https',
			hostname: 'images.ctfassets.net',
			port: '', // оставьте пустым, если не требуется
			pathname: '/**', // разрешаем все пути
		  },
		],
	  },
	i18n: {
		locales: ["en", "ro", "kg"],
		defaultLocale: "ro",
		localeDetection: false
	},

	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [{ loader: "@svgr/webpack", options: { icon: true } }]
		});

		return config;
	}
};

module.exports = nextConfig;
*/