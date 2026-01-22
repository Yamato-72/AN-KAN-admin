// src/components/IframeWithLoading.tsx
import { useState } from "react";

type Props = {
  src: string;
  title?: string;
  height?: string | number;
};

export function IframeWithLoading({ src, title = "iframe", height = "100%" }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height,              // ✅ ここが効く
        borderRadius: 12,
        overflow: "hidden",
        background: "#f3f4f6",
      }}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            zIndex: 10,
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 36,
                height: 36,
                border: "4px solid #ddd",
                borderTop: "4px solid #4f46e5",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto",
              }}
            />
            <p style={{ marginTop: 8, color: "#555" }}>読み込み中…</p>
          </div>
        </div>
      )}

      <iframe
        src={src}
        title={title}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.2s ease",
          background: "white",
        }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
