"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { blockType } from "@prisma/client";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/dataType";
import Image from "next/image";

export const ImageForm = ({
  openChange,
  page,
  session,
}: {
  openChange?: () => void;
  page: string;
  session: any;
}) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileName, setFileName] = useState("no file chosen");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!file) {
      setError("No file selected");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("alt", e.currentTarget.alt.value);

    try {
      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();

      // POST request to create a new content block
      let status = "createPending";
      if (session.role === "admin") {
        status = "verified";
      }

      const contentResponse = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockType: "image" as blockType,
          imageId: result.id,
          position: result.id,
          page: page,
          status: status,
        }),
      });

      if (!contentResponse.ok) {
        const errorResponse = await contentResponse.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${contentResponse.status} ${contentResponse.statusText}`,
        );
      }

      const contentResult = await contentResponse.json();

      const pageResponse = await fetch(`/api/page/${page}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${session}`,
        },
        credentials: "include",
        body: JSON.stringify({
          positions: [contentResult.id],
        }),
      });

      if (!pageResponse.ok) {
        const errorResponse = await pageResponse.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${pageResponse.status} ${pageResponse.statusText}`,
        );
      }

      setIsLoading(false);
      window.location.reload();
      if (openChange) {
        openChange();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setError("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
        setFileName("No file chosen");
        setFile(null);
        setImagePreview(undefined);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the maximum limit of 5MB.");
        setFileName("No file chosen");
        setFile(null);
        setImagePreview(undefined);
        return;
      }

      setFile(file);
      setError("");
      setFileName(file.name);
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
    } else {
      setFileName("No file chosen");
    }
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full grid place-items-center mx-auto pt-4 mb-10 px-5"
      >
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="alt" className="label">
              Alt
            </label>
            <input
              type="text"
              placeholder="optional"
              name="alt"
              className="field"
            />
          </div>
          <div>
            <label htmlFor="file" className="label">
              Image
            </label>
            <div className="field w-full flex flex-row items-center">
              <span className="grow">{fileName}</span>
              <input
                type="file"
                id="file"
                className="absolute opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              <label
                htmlFor="file"
                className="hover:bg-sky-900 hover:cursor-pointer hover:text-white border-1 border-slate-400 px-3 text-sm rounded-lg items-center justify-center py-2  transition-all duration-300 ease-in-out"
              >
                choose a file
              </label>
            </div>
          </div>
          {imagePreview && (
            <div className="w-full max-w-[80%] h-[20rem] self-center flex flex-col items-center ">
              <div className="rounded-md overflow-hidden h-full w-fit shadow-md">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-fit"
                  height={100}
                  width={100}
                />
              </div>
            </div>
          )}
        </div>

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
