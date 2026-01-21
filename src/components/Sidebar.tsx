type SidebarItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

const items: SidebarItem[] = [
  { key: "dashboard", label: "ダッシュボード", icon: <span className="sb-ico">🏠</span> },
  { key: "zaiko", label: "在庫管理", icon: <span className="sb-ico">👥</span> },
  { key: "products", label: "製品マスタ", icon: <span className="sb-ico">📦</span> },
  { key: "schemes", label: "支払いスキーム", icon: <span className="sb-ico">🧾</span> },
  { key: "settings", label: "設定", icon: <span className="sb-ico">⚙️</span> },
];

export function Sidebar({
  activeKey = "dashboard",
  onSelect,
}: {
  activeKey?: string;
  onSelect?: (key: string) => void;
}) {
  return (
    <aside className="sb">
      {/* 上の小さい戻る矢印 */}
      <div className="sb-top">
        <button
          className="sb-back"
          type="button"
          aria-label="戻る"
          onClick={() => onSelect?.("back")}
        >
          ‹
        </button>
      </div>

      <nav className="sb-nav" aria-label="サイドメニュー">
        {items.map((item) => {
          const active = item.key === activeKey;
          return (
            <button
              key={item.key}
              type="button"
              className={`sb-item ${active ? "is-active" : ""}`}
              onClick={() => onSelect?.(item.key)}
            >
              <span className="sb-item-icon">{item.icon}</span>
              <span className="sb-item-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
