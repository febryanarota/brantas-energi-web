import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import storage from "@/lib/storage";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import shortUUID from "short-uuid";
import fs from "fs";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.formData();
  if (!body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const length = parseInt(body.get("length") as string);

  const dir = path.join(process.cwd(), "public/fileImageBlock");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let dataId: number[] = [];
  for (let i = 0; i < length; i++) {
    const title = body.get(`title[${i}]`) as string;
    const isFile = body.get(`isFile[${i}]`) === "true" ? true : false;
    let link = body.get(`link[${i}]`)
      ? (body.get(`link[${i}]`) as string)
      : null;

    const file = body.get(`file[${i}]`)
      ? (body.get(`file[${i}]`) as File)
      : null;

    const image = body.get(`image[${i}]`) as File;
    const imageName = `${shortUUID.generate()}.${image.type.split("/")[1]}`; 
    const imagePath = path.join(dir, imageName); 

    // save the image to the local 
    const blob = await image.arrayBuffer(); 
    const buffer = Buffer.from(blob); 
    fs.writeFileSync(imagePath, buffer); 

    if (file) {
      // upload file
      const fileName = `${shortUUID.generate()}.${file.type.split("/")[1]}`;
      const filePath = path.join(dir, fileName);

      const blob = await file.arrayBuffer();
      const buffer = Buffer.from(blob);
      fs.writeFileSync(filePath, buffer)

      link = `/fileImageBlock/${fileName}`;
    }

    const response = await prisma.fileImage.create({
      data: {
        title: title,
        link: link || undefined,
        image: `/fileImageBlock/${imageName}`,
        isFile: isFile,
      },
    });


    dataId.push(response.id);
  }

  const createBuffer = await prisma.fileImageBuffer.create({
    data: {
      fileImageIds: dataId,
    },
  });

  return NextResponse.json(createBuffer);
}

export async function PUT(req: NextRequest) {
  const sessionExists = req.cookies.get("session");

  if (!sessionExists) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const session = await decrypt(sessionExists.value);
  const role = session.role;

  const body = await req.formData();
  if (!body) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // get the new array of fileImageIds
  const length = parseInt(body.get("length") as string);
  let newIds: number[] = [];
  for (let i = 0; i < length; i++) {
    newIds.push(parseInt(body.get(`order[${i}]`) as string));
  }
  console.log("\n\nnew ids", newIds);

  // get the old array of fileImageIds
  const contentBlock = await prisma.contentBlock.findFirst({
    where: {
      id: parseInt(body.get("blockId") as string),
    },
  });

  const bufferId = contentBlock?.fileImageId;
  const oldBuffer = await prisma.fileImageBuffer.findFirst({
    where: {
      id: bufferId as number,
    },
  });
  const oldIds = oldBuffer?.fileImageIds;
  console.log("\n\nold ids", oldIds);

  const addIds = newIds.filter((id) => !oldIds?.includes(id));
  console.log("\n\nadd ids", addIds);
  for (const id of addIds) {
    const isFile = body.get(`isFile[${id}]`) === "true" ? true : false;

    console.log("\n\ncurrent id", id);
    console.log("\n\nisFile", isFile);

    let file = null;
    let fileExtension = null;
    let link = null;

    if (isFile) {
      file = body.get(`file[${id}]`) as File;
      console.log("\n\nfile name", file.name);
      fileExtension = file.name.split(".").pop();
    } else {
      link = body.get(`link[${id}]`) as string;
    }

    const image = body.get(`image[${id}]`) as File;
    console.log("\n\nimage name", image.name);
    const imageExtension = image.name.split(".").pop();

    const title = body.get(`title[${id}]`) as string;

    const uuid = shortUUID.generate();

    // if isFile
    // upload file
    if (isFile && file) {
      const fileUpload = await storage.file.upload(
        `/public/file-image/${uuid}.${fileExtension}`,
        file,
      );

      if (!fileUpload) {
        return NextResponse.json(
          { error: "Error file upload" },
          { status: 500 },
        );
      }
      link = `public/file-image/${uuid}.${fileExtension}`;
    }

    // upload image
    const imageUpload = await storage.image.upload(
      `/public/file-image/${uuid}.${imageExtension}`,
      image,
    );

    if (!imageUpload) {
      return NextResponse.json(
        { error: "Error image upload" },
        { status: 500 },
      );
    }

    // create fileImage
    const response = await prisma.fileImage.create({
      data: {
        title: title,
        link: link as string,
        image: `public/file-image/${uuid}.${imageExtension}`,
        isFile: isFile,
      },
    });

    if (!response) {
      await storage.file.delete(`/public/file-image/${uuid}.${fileExtension}`);
      await storage.image.delete(
        `/public/file-image/${uuid}.${imageExtension}`,
      );
      return NextResponse.json({ error: "Error saving file" }, { status: 500 });
    }

    // Replace the temporary id with the newly created id
    newIds = newIds.map((nid) => (nid === id ? response.id : nid));
  }

  // conditional if admin or user

  // if admin
  if (role === "admin") {
    // delete = old - new
    const deleteIds = oldIds?.filter((id) => !newIds.includes(id));
    console.log("\n\ndelete ids", deleteIds);
    if (deleteIds) {
      for (const id of deleteIds) {
        // get the fileImage
        const fileImage = await prisma.fileImage.findFirst({
          where: {
            id: id,
          },
        });

        if (fileImage?.link) {
          // if isFile
          if (fileImage.isFile) {
            const deleteFile =
              "public/file-image/" + fileImage.link.split("/").pop();
            await storage.file.delete(deleteFile).catch((error) => {
              console.error("Error deleting file:", error);
              throw new Error("Error deleting file");
            });
          }
        }

        // delete image
        const deleteImage =
          "public/file-image/" + fileImage?.image.split("/").pop();

        await storage.image.delete(deleteImage).catch((error) => {
          console.error("Error deleting image:", error);
          throw new Error("Error deleting image");
        });

        await prisma.fileImage.delete({
          where: {
            id: id,
          },
        });
      }
    }

    // add = new - old

    // update new array in fileImafeBuffer
    const result = await prisma.fileImageBuffer.update({
      where: {
        id: bufferId as number,
      },
      data: {
        fileImageIds: newIds,
      },
    });
    console.log("\n\nresult ids", newIds);

    return NextResponse.json(result);
  }

  // if user
  else {
    const result = await prisma.fileImageBuffer.create({
      data: {
        fileImageIds: newIds,
      },
    });

    return NextResponse.json(result);
  }

  // add = new - old
  // update new array in fileImafeBuffer

  // return NextResponse.json(response);
}
