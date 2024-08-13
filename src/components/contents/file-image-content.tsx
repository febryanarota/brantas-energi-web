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
  const [fileEdit, setFileEdit] = useState<fileImage[]>([]);
  const isEdit = editId !== null;

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

    if (isEdit) {
      const fetchData = async () => {
        const bufferEdit = await fetch(`/api/fileImageBuffer/${editId}`, {
          method: "GET",
        });
        const data: fileImageBuffer = await bufferEdit.json();
        for (let i = 0; i < data.fileImageIds.length; i++) {
          const response = await fetch(
            `/api/file-image/${data.fileImageIds[i]}`,
            {
              method: "GET",
            },
          );
          const fileImage: fileImage = await response.json();
          setFileEdit((prev) => [...prev, fileImage]);
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
                src={fileImage.image}
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
      {editId !== null && fileEdit && (
        <div className="w-full bg-slate-100 rounded-md p-2 pb-5 mt-3">
          <p className="text-xs font-medium text-gray-500 mb-3">New Content</p>
          {fileEdit.map((fileImage) => {
            return (
              <div
                key={fileImage.id}
                className="flex flex-row border border-gray-300 p-2 rounded-md mb-2"
              >
                <div className="w-[3rem] h-[3rem] rounded-md overflow-hidden">
                  <Image
                    src={fileImage.image}
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
      )}
    </div>
  );
};
