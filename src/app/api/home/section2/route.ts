import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import shortUUID from "short-uuid";
import fs from "fs";

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


  const image = body.get("image2") as File;

  const heading2 = body.get("heading2") as string;
  const description2 = body.get("description2") as string;
  const subHeading2 = body.get("subHeading2") as string;

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  const imagesDir = path.join(process.cwd(), "public/homeBlock");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  const extension = image.name.split(".").pop();
  const fileName = `${shortUUID.generate()}.${extension}`;
  const filePath = path.join(imagesDir, fileName);

  try {
    if (image) {
      if (role === "admin") {
        const currData = await prisma.home.findFirst({
          where: {
            status: "verified",
          },
        });
        if (currData?.image1) {
          const deleteImage = path.join(
            process.cwd(),
            "public",
            currData.image1,
          );
          if (fs.existsSync(deleteImage)) {
            fs.unlinkSync(deleteImage);
          } else {
            console.warn("File not found:", deleteImage);
          }
        }
      }

      const blob = await image.arrayBuffer();
      const buffer = Buffer.from(blob);
      fs.writeFileSync(filePath, buffer);

      // Save the file path to the database (relative to the public folder)
      const relativeFilePath = `/homeBlock/${fileName}`;

      let result;
      if (role === "admin") {
        result = await prisma.home.updateMany({
          where: {
            status: {
              in: ["verified", "updatePending"],
            },
          },
          data: {
            image2: relativeFilePath,
            heading2: heading2,
            description2: description2,
            subheading2: subHeading2
          },
        });
      } else {
        result = await prisma.home.updateMany({
          where: {
            status: "updatePending",
          },
          data: {
            image2: relativeFilePath,
            heading2: heading2,
            description2: description2,
            subheading2: subHeading2
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

    if (pending?.image2 !== verified?.image2 && verified?.image2) {
      const deleteImage = path.join(process.cwd(), "public", verified.image2);
      if (fs.existsSync(deleteImage)) {
        fs.unlinkSync(deleteImage);
      } else {
        console.warn("File not found:", deleteImage);
      }
    }

    const update = await prisma.home.updateMany({
      where: {
        status: "verified",
      },
      data: {
        image2: pending?.image2,
        heading2: pending?.heading2,
        description2: pending?.description2,
        subheading2: pending?.subheading2
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
      { error: "Error acception request section 2" },
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

  if (pending?.image2) {
    const deleteImage = path.join(process.cwd(), "public", pending.image2);
    if (fs.existsSync(deleteImage)) {
      fs.unlinkSync(deleteImage);
    } else {
      console.warn("File not found:", deleteImage);
    }
  }

  const update = await prisma.home.updateMany({
    where: {
      status: "updatePending",
    },
    data: {
      heading2: verified?.heading2,
      description2: verified?.description2,
      image2: verified?.image2,
      subheading2: verified?.subheading2
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
