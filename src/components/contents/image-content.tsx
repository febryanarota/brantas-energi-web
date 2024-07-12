import { image } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export const ImageContent = ({
  content,
  editId,
}: {
  content: image;
  editId: number | null;
}) => {
  const [editData, setEditData] = useState<image>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/image/${editId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setEditData(data as image);
      } catch (error) {
        console.error("Error fetching data:", error);
        // TO DO: Handle error appropriately (e.g. show error message)
      }
    };

    if (editId !== null) {
      fetchData();
    }
  }, [editId]);

  return (
    <div className="w-full text-sm">
      <p className="text-sm font-bold text-primaryBlue mb-2">Image</p>
      {content ? (
        <div className="flex flex-row space-x-5">
          <div className="flex flex-col">
            <p className="font-semibold text-slate-500">Image</p>
            <a
              href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${content.shadowId}`}
              target="_blank"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${content.shadowId}`}
                alt={content.alt ? content.alt : "image"}
                width={100}
                height={100}
                className="hover:cursor-pointer hover:opacity-60 transition-transform duration-300 ease-in-out"
              />
            </a>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-slate-500">Alt</p>
            <p>{content.alt ? content.alt : "-"}</p>
          </div>
        </div>
      ) : (
        <div className="invalid-feedback">something went wrong</div>
      )}
      {editId !== null && editData && (
        <div className="w-full bg-slate-100 rounded-md p-2 pb-5 mt-3">
          <div className="flex flex-row space-x-5">
            <div className="flex flex-col">
              <p className="font-semibold text-slate-500">Image</p>
              <a
                href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${editData.shadowId}`}
                target="_blank"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${editData.shadowId}`}
                  alt={editData.alt ? editData.alt : "image"}
                  width={100}
                  height={100}
                  className="hover:cursor-pointer hover:opacity-60 transition-transform duration-300 ease-in-out"
                />
              </a>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-slate-500">Alt</p>
              <p>{editData.alt ? editData.alt : "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
