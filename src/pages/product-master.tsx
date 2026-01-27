// src/pages/product-master.tsx
import React from "react";
import { IframeWithLoading } from "@/components/IframeWithLoading";

export default function ProductMaster() {
  return (
    <div style={{ height: "calc(100vh - 60px)", width: "100%" }}>
      <IframeWithLoading
        src="https://master-edit-app-47228502594.europe-west1.run.app/masters"
        title="マスタ管理"
        height="100%"
      />
    </div>
  );
}
