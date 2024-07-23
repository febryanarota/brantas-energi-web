import { faq } from "@prisma/client";
import { useEffect, useState } from "react";

export const FaqContent = ({
  content,
  editId,
}: {
  content: faq;
  editId: number | null;
}) => {
  const [editData, setEditData] = useState<faq | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/faq/${editId}`, {
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
      }
    };

    if (editId !== null) {
      fetchData();
    }
  }, [editId]);

  return (
    <div className="w-full">
      <p className="text-sm font-bold text-primaryBlue mb-2">QnA</p>
      {content ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <p className="font-semibold text-slate-500">Question</p>
            <p>{content.question}</p>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-slate-500">Answer</p>
            <div
              className="ProseMirror whitespace-pre-line text-md text-justify"
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: content.answer }}
            />
          </div>
        </div>
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
