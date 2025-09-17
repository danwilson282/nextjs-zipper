"use client";
import React from "react";
type Props = {
    files: { name: string; url: string }[];
    downloadFilename: string;
};

export function DownloadZipButton({ files, downloadFilename }: Props) {
  const handleDownload = async () => {
    const res = await fetch("/api/zip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files }),
    });

    if (!res.ok) {
      console.error("Failed to generate ZIP");
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${downloadFilename}.zip`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return <button onClick={handleDownload}>Download ZIP</button>;

}