import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { randomUUID } from "crypto";

import { db } from "~/server/db";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folderId = (formData.get("folderId") as string | null) ?? null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const fileName = `${randomUUID()}-${file.name}`;
  const blobPath = `uploads/${fileName}`;

  const blob = await put(blobPath, file, {
    access: "public",
    contentType: file.type || "application/octet-stream",
  });

  const createdFile = await db.file.create({
    data: {
      name: file.name,
      size: file.size,
      type: file.type,
      s3Key: blob.pathname, 
      url: blob.url,
      folderId,
      userId: "dev-user-id",
    },
  });

  return NextResponse.json(createdFile);
}
