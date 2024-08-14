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

  // create image folder if not existed
  const imagesDir = path.join(process.cwd(), "public/fileImageBlock");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

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

  const addIds = newIds.filter((id) => !oldIds?.includes(id));
  for (const id of addIds) {
    const isFile = body.get(`isFile[${id}]`) === "true" ? true : false;

    let file = null;
    // let fileExtension = null;
    let link = null;

    if (isFile) {
      file = body.get(`file[${id}]`) as File;
    } else {
      link = body.get(`link[${id}]`) as string;
    }

    const image = body.get(`image[${id}]`) as File;

    const title = body.get(`title[${id}]`) as string;



    // if isFile
    // upload file
    if (isFile && file) {
      const fileName = `${shortUUID.generate()}.${file.type.split("/")[1]}`;
      const filePath = path.join(imagesDir, fileName);

      const blob = await file.arrayBuffer();
      const buffer = Buffer.from(blob);
      fs.writeFileSync(filePath, buffer);

      link = `/fileImageBlock/${fileName}`;
    }

    // upload image
    const imageName = `${shortUUID.generate()}.${image.type.split("/")[1]}`;
    const imagePath = path.join(imagesDir, imageName);

    const blob = await image.arrayBuffer();
    const buffer = Buffer.from(blob);
    fs.writeFileSync(imagePath, buffer);

    // create fileImage
    const response = await prisma.fileImage.create({
      data: {
        title: title,
        link: link as string,
        image: `/fileImageBlock/${imageName}`,
        isFile: isFile,
      },
    });

    // Replace the temporary id with the newly created id
    newIds = newIds.map((nid) => (nid === id ? response.id : nid));
  }

  // conditional if admin or user

  // if admin
  if (role === "admin") {
    // delete = old - new
    const deleteIds = oldIds?.filter((id) => !newIds.includes(id));
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
            const deletePath = path.join(process.cwd(), "public", fileImage.link);
            if (fs.existsSync(deletePath)) {
              fs.unlinkSync(deletePath);
            }
          }
        }

        // delete image
        if (fileImage) {
          const deleteImagePath = path.join(process.cwd(), "public", fileImage.image);
          if (fs.existsSync(deleteImagePath)) {
            fs.unlinkSync(deleteImagePath);
          }
        }

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
}
