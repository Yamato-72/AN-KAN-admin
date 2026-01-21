// src/pages/zaiko.tsx
import React from "react";

export default function Zaiko() {
  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100%" }}>
      {/* ↑ 64pxはヘッダー高さに合わせて調整 */}
      <iframe
        src="https://zaiko-47228502594.europe-west1.run.app/PC/dashboard"
        style={{
          border: "none",
          width: "100%",
          height: "100%",
          borderRadius: 12,
          background: "white",
        }}
        // sandboxは必要に応じて。最初は外して動作確認でもOK
        // sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        referrerPolicy="no-referrer-when-downgrade"
        loading="lazy"
      />
    </div>
  );
}