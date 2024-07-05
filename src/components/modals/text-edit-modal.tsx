"use client";

import { useEffect, useState } from "react";
import { Editor } from "../editor/Editor";
import { Button } from "@nextui-org/button";
import { status } from "@prisma/client";

export const TextEditModal = ({
  openChange,
  session,
  id,
  blockId,
}: {
  openChange?: () => void;
  session: any;
  id: number;
  blockId: number;
}) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/text/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setContent(data.content);
      } catch (error) {
        console.error("Error fetching data:", error);
        // TO DO: Handle error appropriately (e.g. show error message)
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (content === "" || content === "<p></p>") {
      setError("Content cannot be empty");
    } else {
      setError("");
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // prevent empty content
    if (content === "" || content === "<p></p>") {
      setError("Content cannot be empty");
      setIsLoading(false);
      return;
    }

    const role = session.role;
    try {
      if (role !== "admin") {
        const response = await fetch(`/api/text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
          body: JSON.stringify({
            content: content,
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }

        let editId = await response.json();
        editId = editId.id;

        const response2 = await fetch(`/api/content/${blockId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            editId: editId,
            status: "updatePending",
          }),
        });

        if (!response2.ok) {
          const errorResponse = await response.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }
      } else {
        const response = await fetch(`/api/text/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
          credentials: "include",
          body: JSON.stringify({
            content: content,
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      if (openChange) {
        openChange();
      }
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10"
      >
        <Editor content={content} setContent={setContent} />
        <div className="flex flex-row items-center justify-center gap-5">
          <Button
            type="button"
            className="cancel-btn"
            onClick={() => {
              if (openChange) {
                openChange();
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="submit-btn self-end"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        {error ? <p className="text-slate-500 text-sm mt-4">{error}</p> : null}
      </form>
    </div>
  );
};
