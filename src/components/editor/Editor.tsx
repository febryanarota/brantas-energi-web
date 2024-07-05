"use client";

import Tiptap from "./TipTap";

export const Editor = ({
  setContent,
  content,
}: {
  setContent: Function;
  content: string;
}) => {
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };

  return <Tiptap content={content} onChange={handleContentChange} />;
};
