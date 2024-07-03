"use client";

import { useEffect, useState } from "react";
import { Editor } from "../editor/Editor";
import { Button } from "@nextui-org/button";
import { blockType } from "@prisma/client";

export const TextForm = ({ openChange, page, session }: { openChange?: () => void, page : string, session : any }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => { 
    if (content === "" || content === "<p></p>") {
      console.log("Content is empty");
      setError("Content cannot be empty");
    } else {
      setError("");
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    if (content === "" || content === "<p></p>") {
      console.log("Content is empty");
      setError("Content cannot be empty");
      return;
    }

    setIsLoading(true); // Set loading state to true

    const formData = {
      content: content,
    };

    console.log(formData);

    try {
      const response = await fetch("/api/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      let status = "createPending";
      if (session.role === "admin") {
        status = "verified";
      }

      console.log(status)

      const contentResponse = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockType: "text" as blockType,
          textId: result.id,
          position: result.id,
          page: page,
          status: status,
        }),
      });

      if (!contentResponse.ok) {
        const errorResponse = await contentResponse.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(`Network response was not ok: ${contentResponse.status} ${contentResponse.statusText}`);
      }

      setIsLoading(false); // Set loading state to false after successful submission
      window.location.reload(); // Reload the page to see the changes
      if (openChange) {
        openChange(); // Close the form
      }

    } catch (error) {
      console.error(error);
      setIsLoading(false); // Set loading state to false in case of error
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
          <Button type="submit" className="submit-btn self-end" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        {
          error ? <p className="text-red-500 text-sm mt-4">{error}</p> : null
        }
      </form>
    </div>
  );
};
