"use client"

import { Editor } from "@/components/editor/Editor";
import { ALLOWED_FILE_TYPES, ALLOWED_MIME_TYPES, imageData, MAX_FILE_SIZE } from "@/lib/dataType";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useState } from "react";



export default function FormSection1() {
  const [description1, setDescription1] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [image, setImage] = useState<imageData>();
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSaving(true);

    const formData = new FormData();
    const heading1 = e.currentTarget.heading1.value;
    if (!heading1) {
      setError("Heading is required")
    }

    if (!image?.image) {
      setError("Image is required")
    }

    formData.append("heading1", e.currentTarget.heading1.value);
    formData.append("image1", image?.image as File);
    formData.append("description1", description1);

    try {
      // POST request to create a new text block
      const response = await fetch("/api/home/section1", {
        method: "PUT",
        body: formData
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`
        );
      }

      setIsSaving(false); // Set loading state to false
    } catch (error) {
      console.error("Error:", error);
      setIsSaving(false); // Set loading state to false
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError("Invalid image type");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the maximum limit of 5MB.");
        return;
      }
      setImage(prevImage => ({
        ...prevImage,
        image: file,
        name: file.name,
        display: URL.createObjectURL(file),
      }));
      setError("");

    } else {
      setError("No image chosen");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col p-5  gap-2 bg-white rounded-md shadow-sm"
    >
      <p className="font-bold text-primaryBlue mb-2">Section 1</p>
      <div className="flex flex-col justify-center w-full">
        <label htmlFor="heading1" className="label text-sm">
          Heading
        </label>
        <input type="text" name="heading1" className="field" />
      </div>
      <div className="flex flex-col justify-center w-full">
        <label htmlFor="description1" className="label text-sm">
          Description
        </label>
        <Editor content={description1} setContent={setDescription1} />
      </div>
      <div>
        <label htmlFor="image1" className="label text-sm">
          Image
        </label>
        <div className="field w-full flex flex-row items-center">
          <span className="grow">{image?.name ? image.name : "No image chosen" }</span>
          <input
            type="file"
            id="image1"
            className="absolute opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          <label
            htmlFor="image1"
            className="hover:bg-sky-900 hover:cursor-pointer hover:text-white border-1 border-slate-400 px-3 text-sm rounded-lg items-center justify-center py-2  transition-all duration-300 ease-in-out"
          >
            choose a file
          </label>
        </div>
      </div>
      { image?.display &&
        <div>
          <Image src={image?.display} alt="" width={200} height={200}/>
        </div>
      }
      <Button
        type="submit"
        className="submit-btn self-end mt-0 mr-2"
        // disabled={isLoading || isFetching}
      >
        {isSaving ? "Saving..." : "Save"}
      </Button>
      {error ? <p className="text-slate-500 text-sm mt-2 self-end pr-3">{error}</p> : null}
    </form>
  );
}
