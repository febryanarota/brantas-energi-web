import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
