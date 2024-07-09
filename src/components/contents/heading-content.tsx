import { heading1, text } from "@prisma/client";
import { useEffect, useState } from "react";

export const Heading1Content = ({
  content,
  editId,
}: {
  content: heading1;
  editId: number | null;
}) => {
  const [editData, setEditData] = useState<heading1 | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/heading1/${editId}`, {
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
    <div className="w-full text-sm">
      <p className="text-sm font-bold text-primaryBlue mb-2">Heading 1</p>
      {content.title ? (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col">
                <p className="font-semibold text-slate-500">Title</p>
                <p>{content.title}</p>
            </div>
            <div className="flex flex-col">
                <p className="font-semibold text-slate-500">Description</p>
                <p>{content.description ? content.description : "-"}</p>
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



export const Heading2Content = ({
    content,
    editId,
  }: {
    content: heading1;
    editId: number | null;
  }) => {
    const [editData, setEditData] = useState<heading1 | null>(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/heading2/${editId}`, {
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
      <div className="w-full text-sm">
        <p className="text-sm font-bold text-primaryBlue mb-2">Heading 2</p>
        {content.title ? (
          <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                  <p className="font-semibold text-slate-500">Title</p>
                  <p>{content.title}</p>
              </div>
              <div className="flex flex-col">
                  <p className="font-semibold text-slate-500">Description</p>
                  <p>{content.description ? content.description : "-"}</p>
              </div>
          </div>
          
        ) : (
          <div className="invalid-feedback">something went wrong</div>
        )}
        {/* {editData !== null && (
          <div className="w-full bg-slate-100 rounded-md p-2 pb-5 mt-3">
            <p className="text-xs font-medium text-gray-500 mb-3">New Content</p>
            <div
              className="ProseMirror whitespace-pre-line text-sm text-justify"
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: editData }}
            />
          </div>
        )} */}
      </div>
    );
  };
  