import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";

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
  const editId = body.editId;

  const oldBufferRes = await prisma.fileImageBuffer.delete({
    where: {
      id: parseInt(id),
    },
  });

  const newBufferRes = await prisma.fileImageBuffer.findFirst({
    where: {
      id: editId,
    }
  })
    

  const oldIds = oldBufferRes.fileImageIds;
  const newIds = newBufferRes?.fileImageIds;

  // deleteIds = oldIds - newIds
  const deleteIds = oldIds.filter((id) => !newIds?.includes(id));
  console.log(deleteIds);
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
          const file = "public/file-image/" + fileImage.link.split("/").pop();
          await storage.file.delete(file as string).catch((error) => {
            console.error("Error deleting file:", error);
            throw new Error("Error deleting file");
          });
        } 

        if (fileImage.image) {
          const image = "public/file-image/" + fileImage.image.split("/").pop();
          await storage.image.delete(image as string).catch((error) => {
            console.error("Error deleting image:", error);
            throw new Error("Error deleting image");
          });
        }
      }

      await prisma.fileImage.delete({
        where: {
          id: id,
        },
      });


    });
  };

  //return newBuffer
  return NextResponse.json(newBufferRes);
}
