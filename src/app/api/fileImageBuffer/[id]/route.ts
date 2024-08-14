import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const maxDuration = 60;

export async function GET(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const id = context.params.id;
  const fileImage = await prisma.fileImageBuffer.findUnique({
    where: {
      id: parseInt(id),
    },
  });

  if (!fileImage) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(fileImage);
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } },
) {
  const body = await req.json();
  const id = context.params.id;

  if (body.editId) {
    const editId = body.editId;

    const oldBufferRes = await prisma.fileImageBuffer.delete({
      where: {
        id: parseInt(id),
      },
    });

    const newBufferRes = await prisma.fileImageBuffer.findFirst({
      where: {
        id: editId,
      },
    });

    const oldIds = oldBufferRes.fileImageIds;
    const newIds = newBufferRes?.fileImageIds;

    // deleteIds = oldIds - newIds
    const deleteIds = oldIds.filter((id) => !newIds?.includes(id));
    if (deleteIds.length > 0) {
      // loop through deleteIds and delete the image and file in storage
      deleteIds.forEach(async (id) => {
        const fileImage = await prisma.fileImage.findFirst({
          where: {
            id: id,
          },
        });

        if (fileImage) {
          if (fileImage.link && fileImage.isFile) {
            const deleteFile = path.join(process.cwd(), "public", fileImage.link);
            if (fs.existsSync(deleteFile)) {
              fs.unlinkSync(deleteFile);
            } else {
              console.warn("File not found:", deleteFile);
            }
          }

          if (fileImage.image) {
            const deleteImage = path.join(process.cwd(), "public", fileImage.image);
            if (fs.existsSync(deleteImage)) {
              fs.unlinkSync(deleteImage);
            } else {
              console.warn("Image not found:", deleteImage);
            }
          }
        }

        await prisma.fileImage.delete({
          where: {
            id: id,
          },
        });
      });
    }

    //return newBuffer
    return NextResponse.json(newBufferRes);
  }

  if (body.fileImageId) {
    const fileImageId = body.fileImageId;

    const newBufferRes = await prisma.fileImageBuffer.delete({
      where: {
        id: parseInt(id),
      },
    });

    const oldBufferRes = await prisma.fileImageBuffer.findFirst({
      where: {
        id: fileImageId,
      },
    });

    const oldIds = oldBufferRes?.fileImageIds;
    const newIds = newBufferRes.fileImageIds;

    // deleteIds = newIds - oldIds
    const deleteIds = newIds?.filter((id) => !oldIds?.includes(id)) as number[];

    if (deleteIds.length > 0) {
      // loop through deleteIds and delete the image and file in storage
      deleteIds.forEach(async (id) => {
        console.log(id);
        const fileImage = await prisma.fileImage.findFirst({
          where: {
            id: id,
          },
        });

        if (fileImage) {
          if (fileImage.link && fileImage.isFile) {
            const deleteFile = path.join(process.cwd(), "public", fileImage.link);
            if (fs.existsSync(deleteFile)) {
              fs.unlinkSync(deleteFile);
            }
          }

          if (fileImage.image) {
            const deleteImage = path.join(process.cwd(), "public", fileImage.image);
            if (fs.existsSync(deleteImage)) {
              fs.unlinkSync(deleteImage);
            }
          }
        }

        await prisma.fileImage.delete({
          where: {
            id: id,
          },
        });
      });
    }

    //return newBuffer
    return NextResponse.json(oldBufferRes);
  }

  const fileImage = await prisma.fileImageBuffer.delete({
    where: {
      id: parseInt(id),
    },
  });

  const fileImageIds = fileImage.fileImageIds;
  // loop through fileImageIds and delete the image and file in storage
  fileImageIds.forEach(async (id) => {
    const fileImage = await prisma.fileImage.findFirst({
      where: {
        id: id,
      },
    });

    if (fileImage) {
      if (fileImage.link && fileImage.isFile) {
        const deleteFile = path.join(process.cwd(), "public", fileImage.link);
        if (fs.existsSync(deleteFile)) {
          fs.unlinkSync(deleteFile);
        }
      }

      if (fileImage.image) {
        const deleteImage = path.join(process.cwd(), "public", fileImage.image);
        if (fs.existsSync(deleteImage)) {
          fs.unlinkSync(deleteImage);
        }
      }
    }

    await prisma.fileImage.delete({
      where: {
        id: id,
      },
    });
  });

  return NextResponse.json(fileImage);
}
