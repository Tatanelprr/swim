import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

import { db } from "~/server/db";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const folderId = formData.get("folderId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });
  
  const fileName = `${randomUUID()}-${file.name}`;
  const filePath = path.join(uploadDir, fileName);

  await writeFile(filePath, buffer);

  // Sauvegarde en DB
  const createdFile = await db.file.create({
    data: {
      name: file.name,
      size: file.size,
      type: file.type,
      s3Key: fileName,
      folderId: folderId || null,
      userId: "dev-user-id", // temporaire en dev
    },
  });

  return NextResponse.json(createdFile);
}