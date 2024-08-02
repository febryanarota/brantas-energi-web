import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = new URL(req.url).searchParams;
  const sortDate = searchParams.get("sortDate")?.toLowerCase() || "desc";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "3");

  const result = await prisma.permohonan_informasi.findMany({
    orderBy: {
      created_at: sortDate === "asc" ? "asc" : "desc",
    },
    take: limit > 0 ? limit : undefined, // If limit is 0, do not limit the number of records
    skip: limit > 0 ? (page - 1) * limit : 0, // Skip is only applied if limit is greater than 0
  });

  const count = await prisma.permohonan_informasi.count();

  const totalPage = Math.ceil(count / limit) || 1;

  if (page > totalPage) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  let previousPage = null;
  let nextPage = null;

  if (page > 1) {
    previousPage =
      "/api/permohonan-informasi?" +
      new URLSearchParams({
        sortDate,
        page: (page - 1).toString(),
        limit: limit.toString(),
      }).toString();
  }

  if (page < totalPage) {
    nextPage =
      "/api/permohonan-informasi?" +
      new URLSearchParams({
        sortDate,
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
  const body = await req.json();

  try {
    const response = await prisma.permohonan_informasi.create({
      data: {
        nama: body.nama,
        tipe_identitas: body.tipeIdentitas,
        nomor_identitas: body.nomorIdentitas,
        instansi: body.instansi,
        email: body.email,
        telepon: body.telepon,
        jenis_informasi: body.jenisInformasi,
        alasan: body.alasan,
      },
    });

    if (!response) {
      return NextResponse.json(
        { error: "Error saving image" },
        { status: 500 },
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
