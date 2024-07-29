import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";

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

    const response = await storage.file.upload(
      `/public/lampiran-pengaduan/${uuid}.${fileExt}`,
      file,
    );

    if (!response) {
      return NextResponse.json({ error: "Error file upload" }, { status: 500 });
    }
    link = `public/lampiran-pengaduan/${uuid}.${fileExt}`;
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
    return NextResponse.json({ error: "Error create pengaduan" }, { status: 500 });
  }

  return NextResponse.json(response);
}
