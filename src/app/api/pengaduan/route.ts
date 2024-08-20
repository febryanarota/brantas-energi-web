import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import shortUUID from "short-uuid";
import fs from "fs";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(req.url).searchParams;
  const sortDate = searchParams.get("sortDate")?.toLowerCase() || "desc";
  const searchName = searchParams.get("searchName") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "3");

  const result = await prisma.pengaduan.findMany({
    where: {
      nama_terduga: {
        contains: searchName,
      },
    },
    orderBy: {
      created_at: sortDate === "asc" ? "asc" : "desc",
    },
    take: limit > 0 ? limit : undefined, // If limit is 0, do not limit the number of records
    skip: limit > 0 ? (page - 1) * limit : 0, // Skip is only applied if limit is greater than 0
  });

  const count = await prisma.pengaduan.count({
    where: {
      nama_terduga: {
        contains: searchName,
      },
    },
  });

  const totalPage = Math.ceil(count / limit) || 1;

  if (page > totalPage) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  let previousPage = null;
  let nextPage = null;

  if (page > 1) {
    previousPage =
      "/api/pengaduan?" +
      new URLSearchParams({
        sortDate,
        searchName,
        page: (page - 1).toString(),
        limit: limit.toString(),
      }).toString();
  }

  if (page < totalPage) {
    nextPage =
      "/api/pengaduan?" +
      new URLSearchParams({
        sortDate,
        searchName,
        page: (page + 1).toString(),
        limit: limit.toString(),
      }).toString();
  }

  return NextResponse.json({
    data: result,
    pagination: {
      totalPage,
      previousPage,
      nextPage,
    },
  });
}

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const judul = body.get("judul");
  const uraian = body.get("uraian");
  const namaTerduga = body.get("namaTerduga");
  const jabatanTerduga = body.get("jabatanTerduga");
  const namaPelapor = body.get("namaPelapor");
  const emailPelapor = body.get("emailPelapor");
  const teleponPelapor = body.get("teleponPelapor");
  const lampiran = body.get("lampiran");

  let link = null;
  if (lampiran) {
    const uuid = shortUUID.generate();
    const file = lampiran as File;
    const fileExt = file.name.split(".").pop();

    const dir = path.join(process.cwd(), "public/pengaduan");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${uuid}.${fileExt}`;
    const filePath = path.join(dir, fileName);

    const blob = await file.arrayBuffer();
    const buffer = Buffer.from(blob);
    fs.writeFileSync(filePath, buffer);

    link = `/pengaduan/${fileName}`;
  }

  const response = await prisma.pengaduan.create({
    data: {
      judul: judul as string,
      uraian: uraian as string,
      nama_terduga: namaTerduga as string,
      jabatan_terduga: jabatanTerduga as string,
      nama_pelapor: namaPelapor as string,
      email_pelapor: emailPelapor as string,
      telepon_pelapor: teleponPelapor as string,
      link_lampiran: link,
    },
  });

  if (!response) {
    return NextResponse.json(
      { error: "Error create pengaduan" },
      { status: 500 },
    );
  }

  return NextResponse.json(response);
}
