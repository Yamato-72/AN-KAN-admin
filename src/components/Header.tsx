export function Header() {
  return (
    <header style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: 60,
    background: "#0b8f5a",
    color: "#fff",
    padding: "0 16px"
    }}>
    <strong style={{fontSize: 35}}>AN-KAN-admin</strong>
    <div style={{ marginRight: 150, opacity: 0.8 }}>🔍 検索…</div>
    </header>

  );
}
