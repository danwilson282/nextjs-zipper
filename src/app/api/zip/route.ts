import { NextRequest } from "next/server";
import archiver from "archiver";
import NodeCache from "node-cache";
import fetch from "node-fetch";
import crypto from "crypto";

const cache = new NodeCache({ stdTTL: 3600 }); // cache for 1 hour

export async function POST(req: NextRequest) {
    // const auth = req.headers.get("authorization");

    // if (!auth || auth !== `Bearer ${process.env.ZIP_API_TOKEN}`) {
    //   return new Response("Unauthorized", { status: 401 });
    // }
  const { files } = (await req.json()) as {
    files: { name: string; url: string }[];
  };

  if (!files || !Array.isArray(files)) {
    return new Response("No files provided", { status: 400 });
  }

  // Make a unique cache key based on file list
  const key = crypto
    .createHash("sha1")
    .update(JSON.stringify(files))
    .digest("hex");

  // If ZIP is cached, serve it directly
  const cachedZip = cache.get<Buffer>(key);
  if (cachedZip) {
    return new Response(cachedZip, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="my-files.zip"`,
        "X-Cache": "HIT",
      },
    });
  }

  // Otherwise, generate a new ZIP
  const archive = archiver("zip", { zlib: { level: 9 } });
  const chunks: Buffer[] = [];

  archive.on("data", (chunk) => chunks.push(chunk));
  archive.on("warning", (err) => console.warn(err));
  archive.on("error", (err) => {
    throw err;
  });

  for (const file of files) {
    const response = await fetch(file.url);
    if (!response.ok || !response.body) {
      throw new Error(`Failed to fetch ${file.url}`);
    }
    archive.append(response.body as any, { name: file.name });
  }

  await archive.finalize();

  const zipBuffer = Buffer.concat(chunks);

  // Save in cache
  cache.set(key, zipBuffer);

  return new Response(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="my-files.zip"`,
      "X-Cache": "MISS",
    },
  });
}