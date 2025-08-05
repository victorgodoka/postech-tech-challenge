import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta name="description" content="Modern banking dashboard with Redux Toolkit and microfrontends" />
        <meta name="keywords" content="banking, dashboard, react, redux, microfrontends" />
        <meta name="author" content="Postech Team" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
