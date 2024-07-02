"use client";

import React, { useState } from "react";
import Tiptap from "./TipTap";

export const Editor = ({ setContent, content } : { setContent: Function, content: string}) => {
  const handleContentChange = (reason: any) => {
    setContent(reason);
  };

  return (
    <>
      <Tiptap
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
      
    </>
  );
};
