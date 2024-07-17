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

  const image = body.get("image1") as File;
  const fileExtension = image.name.split(".").pop();

  const heading1 = body.get("heading1") as string;
  const description1 = body.get("description1") as string;

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  try {

    if (image) {
      if (role === "admin") {
        const currData = await prisma.home.findFirst({
          where: {
            status: "verified",
          },
        });
        const deleteImage = "public/" + currData?.image1.split("/").pop();
        await storage.image.delete(deleteImage).catch((error) => {
          console.error("Error deleting image:", error);
          throw new Error("Error deleting image");
        });
      }

      await storage.image
        .upload(`/public/${uuid}.${fileExtension}`, image)
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
          image1: `/public/${uuid}.${fileExtension}`,
          heading1: heading1,
          description1: description1,
        },
      });

      } else {
        result = await prisma.home.updateMany({
          where: {
            status: "updatePending",
          },
          data: {
            image1: `/public/${uuid}.${fileExtension}`,
            heading1: heading1,
            description1: description1,
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
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating image" },
      { status: 500 },
    );
  }
}
