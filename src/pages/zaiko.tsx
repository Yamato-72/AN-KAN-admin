// src/pages/zaiko.tsx
import React from "react";
import { IframeWithLoading } from "@/components/IframeWithLoading";

export default function Zaiko() {
  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100%" }}>
      <IframeWithLoading
        src="https://zaiko-47228502594.europe-west1.run.app/PC/dashboard"
        title="在庫管理"
        height="100%"
      />
    </div>
  );
}
