import { text } from "@prisma/client";
import { useEffect, useState } from "react";

export const TextContent = ({
  content,
  editId,
}: {
  content: text;
  editId: number | null;
}) => {
  const [editData, setEditData] = useState<text | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/text/${editId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setEditData(data.content);
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
    <div className="w-full">
      {content.content ? (
        <div
          className="ProseMirror whitespace-pre-line text-sm text-justify"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      ) : (
        <div className="invalid-feedback">something went wrong</div>
      )}
      {editData !== null && (
        <div className="w-full bg-slate-100 rounded-md p-2 pb-5 mt-3">
          <p className="text-xs font-medium text-gray-500 mb-3">New Content</p>
          <div
            className="ProseMirror whitespace-pre-line text-sm text-justify"
            style={{ whiteSpace: "pre-line" }}
            dangerouslySetInnerHTML={{ __html: editData }}
          />
        </div>
      )}
    </div>
  );
};
