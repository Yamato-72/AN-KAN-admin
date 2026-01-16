// src/pages/_app.tsx
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

import "@/styles/globals.css";
import "@/styles/header.css";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

// Sidebar key → URL の対応表
const ROUTE_MAP: Record<string, string> = {
  dashboard: "/",
  suppliers: "/suppliers",
  products: "/product-master",
  schemes: "/schemes",
  settings: "/settings",
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // 現在のURLから activeKey を判定
  const activeKey =
    Object.entries(ROUTE_MAP).find(([, path]) => path === router.pathname)?.[0] ??
    "dashboard";

  const handleSelect = (key: string) => {
    if (key === "back") {
      router.back();
      return;
    }

    const path = ROUTE_MAP[key];
    if (path && path !== router.pathname) {
      router.push(path);
    }
  };

  return (
    <div className="layout">
      <Header />

      <div className="layout-body">
        <Sidebar activeKey={activeKey} onSelect={handleSelect} />

        <main className="layout-content">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
}
