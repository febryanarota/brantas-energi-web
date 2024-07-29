import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    let answers: number[] = [];

    for (let i = 1; i <= 8; i++) {
      answers.push(parseInt(body[`q${i}`] as string));
    }

    const pengajuan = "true" ? true : false;
    const tanggalLahir = body.tanggalLahir ? new Date(body.tanggalLahir) : null;

    const response = await prisma.kepuasan.create({
      data: {
        nama: body.nama,
        jenisKelamin: body.jenisKelamin,
        email: body.email,
        pendidikan: body.pendidikan,
        tanggalLahir: tanggalLahir,
        pekerjaan: body.pekerjaan,
        pengajuan: pengajuan,
        answers: answers,
        saran: body.saran,
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
