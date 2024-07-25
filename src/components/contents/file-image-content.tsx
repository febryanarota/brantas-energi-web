import { fileImage, fileImageBuffer } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export const FileImageContent = ({
  content,
  editId,
}: {
  content: fileImageBuffer;
  editId: number | null;
}) => {

  const [fileData, setFileData] = useState<fileImage[]>([]);

  useEffect(() => {
    const fileImageId = content.fileImageIds;
    for (let i = 0; i < fileImageId.length; i++) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/file-image/${fileImageId[i]}`, {
            method: "GET",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch data");
          }

          const data = await response.json();
          setFileData((prev) => [...prev, data as fileImage]);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, []);

  return (
    <div className="w-full text-sm">
      <p className="text-sm font-bold text-primaryBlue mb-2">File Image</p>
      {fileData.map((fileImage) => {
        return (
          <div
            key={fileImage.id}
            className="flex flex-row border border-gray-300 p-2 rounded-md mb-2"
          >
            <div className="w-[3rem] h-[3rem] rounded-md overflow-hidden">
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${fileImage.image}`}
                alt={fileImage.title}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="ml-2 font-medium">{fileImage.title}</p>
              <p className="ml-2 text-gray-400">{fileImage.link}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
