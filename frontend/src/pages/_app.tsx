import "@/styles/globals.css";
import type { AppProps } from "next/app";
import MainLayout from "@/layouts/MainLayout";
import StaffLayout from "@/layouts/StaffLayout";
import { SessionProvider } from "next-auth/react";

type ComponentWithLayout = AppProps['Component'] & {
  layout?: 'main' | 'staff';
}

export default function App({ Component, pageProps }: AppProps) {
  const ComponentWithLayout = Component as ComponentWithLayout;

  const Layout = ComponentWithLayout.layout === 'staff' ? StaffLayout : MainLayout;

  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

