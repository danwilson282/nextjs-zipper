"use server"
import React from "react";
import { DownloadZipButton } from "@/components/zip";
export default async function Page() {
  const files = [
    { name: "report.pdf", url: "https://pdfobject.com/pdf/sample.pdf" },
    { name: "image.jpg", url: "https://upload.wikimedia.org/wikipedia/en/thumb/6/60/ArnoldRimmer1.jpg/250px-ArnoldRimmer1.jpg" },
  ];
  return (
    <>
    <DownloadZipButton files={files} downloadFilename="Dan"/>
    </>
    
  )
}