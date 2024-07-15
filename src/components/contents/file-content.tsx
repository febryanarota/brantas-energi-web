import { file } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export const FileContent = ({
  content,
  editId,
}: {
  content: file;
  editId: number | null;
}) => {
  const [editData, setEditData] = useState<file>();

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
        setEditData(data as file);
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
      <p className="text-sm font-bold text-primaryBlue mb-2">Link/File</p>
      {content ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <p className="font-semibold text-slate-500">Display Text</p>
            <p>{content.display}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-slate-500">Link</p>
            <p>{content.link ? content.link : "-"}</p>
          </div>
        </div>
      ) : (
        <div className="invalid-feedback">something went wrong</div>
      )}
      {editId !== null && editData && (
        <div className="w-full bg-slate-100 rounded-md p-2 pb-5 mt-3">
          <p className="text-xs font-medium text-gray-500 mb-3">New Content</p>
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex flex-col">
              <p className="font-semibold text-slate-500">Display Text</p>
              <p>{editData.display}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold text-slate-500">Link</p>
              <p>{editData.link ? editData.link : "-"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
