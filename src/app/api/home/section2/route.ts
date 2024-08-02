import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import shortUUID from "short-uuid";

export const maxDuration = 60;

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

  const image = body.get("image2") as File;
  const fileExtension = image.name.split(".").pop();

  const heading2 = body.get("heading2") as string;
  const description2 = body.get("description2") as string;

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
        const deleteImage = "public/" + currData?.image2.split("/").pop();
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
            image2: `/public/${uuid}.${fileExtension}`,
            heading2: heading2,
            description2: description2,
          },
        });
      } else {
        result = await prisma.home.updateMany({
          where: {
            status: "updatePending",
          },
          data: {
            image2: `/public/${uuid}.${fileExtension}`,
            heading2: heading2,
            description2: description2,
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
      { error: "Error updating section 1" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: NextRequest) {
  // handle session
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const pending = await prisma.home.findFirst({
      where: {
        status: "updatePending",
      },
    });

    const verified = await prisma.home.findFirst({
      where: {
        status: "verified",
      },
    });

    if (pending?.image2 !== verified?.image2) {
      const deleteImage = "public/" + verified?.image2.split("/").pop();
      await storage.image.delete(deleteImage).catch((error) => {
        console.error("Error deleting old image:", error);
        throw new Error("Error deleting old image");
      });
    }

    const update = await prisma.home.updateMany({
      where: {
        status: "verified",
      },
      data: {
        image2: pending?.image2,
        heading2: pending?.heading2,
        description2: pending?.description2,
      },
    });

    if (!update) {
      return NextResponse.json(
        { error: "Error updating image" },
        { status: 500 },
      );
    }

    return NextResponse.json(update);
  } catch (error) {
    return NextResponse.json(
      { error: "Error acception request section 1" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const verified = await prisma.home.findFirst({
    where: {
      status: "verified",
    },
  });

  const pending = await prisma.home.findFirst({
    where: {
      status: "updatePending",
    },
  });

  const deleteImage = "public/" + pending?.image2.split("/").pop();
  await storage.image.delete(deleteImage).catch((error) => {
    console.error("Error deleting image:", error);
    throw new Error("Error deleting image");
  });

  const update = await prisma.home.updateMany({
    where: {
      status: "updatePending",
    },
    data: {
      heading2: verified?.heading2,
      description2: verified?.description2,
      image2: verified?.image2,
    },
  });

  if (!update) {
    return NextResponse.json(
      { error: "Error deleting request section 1" },
      { status: 500 },
    );
  }
  return NextResponse.json(update);
}
