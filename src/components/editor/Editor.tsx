'use client'

import React, { useState } from 'react'
import Tiptap from './TipTap'

export const Editor = () => {
  const [content, setContent] = useState<string>('')
  const handleContentChange = (reason: any) => {
    setContent(reason)
  }
  const handleSubmit = (e: any) => {
    e.preventDefault()
    const data = {
      content: content,
    }
    console.log(data)
  }
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl w-full grid place-items-center mx-auto pt-10 mb-10"
    >
      <Tiptap
        content={content}
        onChange={(newContent: string) => handleContentChange(newContent)}
      />
    </form>
  )
}
