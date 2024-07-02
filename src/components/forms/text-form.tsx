"use client"

import { useState } from "react";
import { Editor } from "../editor/Editor";
import { Button } from "@nextui-org/button";

export const TextForm = ({ openChange }: { openChange: Function}) => {
  const [content, setContent] = useState<string>("");

  const handleSubmit = () => {
    console.log(content);
  };
  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10"
      >
        <Editor
          content={content}
          setContent={setContent}
        />
        <div className="flex flex-row items-center justify-center gap-5">
          <button className="cancel-btn" onClick={openChange as () => void}>
            Cancel
          </button>
          <Button type="submit" className="submit-btn self-end">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};
