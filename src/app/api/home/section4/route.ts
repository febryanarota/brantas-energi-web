import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";

export async function PUT(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.formData();
  if (!body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const uuid = shortUUID.generate();

  const image = body.get("logo") as File;
  const fileExtension = image.name.split(".").pop();

  const name = body.get("name") as string;
  const address = body.get("address") as string;
  const phone = body.get("phone") as string;
  const email = body.get("email") as string;

  const youtube = body.get("youtube") as string;
  const facebook = body.get("facebook") as string;
  const instagram = body.get("instagram") as string;
  const twitter = body.get("twitter") as string;
  const linkedin = body.get("linkedin") as string;

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  try {
    if (role === "admin") {
      const currData = await prisma.home.findFirst({
        where: {
          status: "verified",
        },
      });
      let path = "public/logo/" + (currData?.logo as string).split("/").pop();
      await storage.image.delete(path).catch((error) => {
        console.error("Error deleting image:", error);
        throw new Error("Error deleting image");
      });
    }

    await storage.image
      .upload(`public/logo/${uuid}.${fileExtension}`, image)
      .catch((error) => {
        console.error("Error uploading image:", error);
        throw new Error("Error uploading image");
      });

    let result;
    if (role === "admin") {
      result = await prisma.home.updateMany({
        where: {
          status: {
            in: ["verified", "updatePending"],
          },
        },
        data: {
          logo: `public/logo/${uuid}.${fileExtension}`,
          name: name,
          address: address,
          email: email,
          phone: phone,
          youtube: youtube,
          facebook: facebook,
          instagram: instagram,
          twitter: twitter,
          linkedin: linkedin,
        },
      });
    } else {
      result = await prisma.home.updateMany({
        where: {
          status: "updatePending",
        },
        data: {
          logo: `public/logo/${uuid}.${fileExtension}`,
          name: name,
          address: address,
          email: email,
          phone: phone,
          youtube: youtube,
          facebook: facebook,
          instagram: instagram,
          twitter: twitter,
          linkedin: linkedin,
        },
      });
    }

    if (!result) {
      return NextResponse.json(
        { error: "Error updating image" },
        { status: 500 },
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating section 1" },
      { status: 500 },
    );
  }
}
