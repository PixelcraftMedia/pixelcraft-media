
import "@/pages/globals.scss";
import "@/pages/theme.scss";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { IntlProvider } from "react-intl";
import { ThemeProvider } from "next-themes";
import { DefaultSeo } from "next-seo"; // Импортируем DefaultSeo
import SEO from "../../next-seo.config"; // Импортируем глобальную конфигурацию SEO

function getDirection(locale: any): "ltr" {
	return "ltr";
}

export default function App({ Component, pageProps }: AppProps) {
	const { locale }: any = useRouter();


  return (
    <IntlProvider locale={locale}>
      <ThemeProvider>
        {/* Добавляем глобальные настройки SEO */}
        <DefaultSeo {...SEO} />
        {/* Передаем направление текста как пропс */}
        <Component {...pageProps} dir={getDirection(locale)} />
      </ThemeProvider>
    </IntlProvider>
  );
}
