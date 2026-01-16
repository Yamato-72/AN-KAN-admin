import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

export default function Home() {
  return (
    <>
      <Header />
      <div style={{ display: "flex" }}>
        <Sidebar activeKey="dashboard" />
        <main style={{ padding: 16, flex: 1 }}>Hello</main>
      </div>
    </>
  );
}

