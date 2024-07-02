"use client";

import { useEffect, useState } from "react";
import { Editor } from "../editor/Editor";
import { Button } from "@nextui-org/button";
import { error } from "console";

export const TextForm = ({ openChange }: { openChange?: () => void }) => {
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => { 
    if (content === "" || content === "<p></p>") {
      console.log("Content is empty");
      setError("Content cannot be empty");
    } else {
      setError("");
    }
  }, [content]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    
    if (content === "") {
      e.preventDefault(); // Prevent the default form submission
      // TO DO: Add error message
      console.log("Content is empty");
      return;
    }

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

      console.log(response);
    } catch (error) {
      console.error(error);
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
          <Button type="submit" className="submit-btn self-end">
            Save
          </Button>
        </div>
        {
          error ? <p className="text-red-500 text-sm mt-4">{error}</p> : null
        }
      </form>
    </div>
  );
};
