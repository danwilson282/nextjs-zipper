"use client";
import React from "react";

export default function DownloadHybridZip() {
  const files = [
    { name: "report.pdf", url: "https://pdfobject.com/pdf/sample.pdf" },
    { name: "image.jpg", url: "https://upload.wikimedia.org/wikipedia/en/thumb/6/60/ArnoldRimmer1.jpg/250px-ArnoldRimmer1.jpg" },
  ];

  const download = async () => {
    const res = await fetch("/api/zip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files }),
    });

    if (!res.ok) {
      alert("Failed to generate ZIP");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-files.zip";
    a.click();
    window.URL.revokeObjectURL(url);

    console.log("Cache status:", res.headers.get("X-Cache")); // HIT or MISS
  };

  return (
    <button
      onClick={download}
      className="px-4 py-2 bg-indigo-600 text-white rounded"
    >
      Download Hybrid ZIP
    </button>
  );
}