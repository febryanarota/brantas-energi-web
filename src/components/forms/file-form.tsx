"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { blockType } from "@prisma/client";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/dataType";
import { X } from "lucide-react";

export const FileForm = ({
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
  const [fileName, setFileName] = useState("No file chosen");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const [display, setDisplay] = useState<string | null>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (display === "") {
      setError("Required display text");
      setIsLoading(false);
      return;
    }

    if (!file && !link) {
      setError("Required file or link as attachment");
      setIsLoading(false);
      return;
    }

    if (file && link) {
      setError("Please fill only one field between file or link as attachment");
      setIsLoading(false);
      return;
    }

    if (file) {
      submitFile(file, e.currentTarget.display.value);
    } else if (link) {
      submitLink(link, e.currentTarget.display.value);
    }
  };

  const submitFile = async (file: File, display: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("display", display);
    formData.append("isFile", "true");

    try {
      const response = await fetch("/api/file", {
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
          blockType: "file" as blockType,
          fileId: result.id,
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
  const submitLink = async (link: string, display: string) => {
    const formData = new FormData();
    formData.append("link", link);
    formData.append("display", display);
    formData.append("isFile", "false");

    try {
      const response = await fetch("/api/file", {
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
          blockType: "file" as blockType,
          fileId: result.id,
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
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setError("Invalid file type");
        setFileName("No file chosen");
        setFile(null);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setError("File size exceeds the maximum limit of 5MB.");
        setFileName("No file chosen");
        setFile(null);
        return;
      }

      setFile(file);
      setError("");
      setFileName(file.name);
    } else {
      setFileName("No file chosen");
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(e.target.value);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full grid place-items-center mx-auto pt-4 mb-10 px-5"
      >
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="display" className="label">
              Display Text
            </label>
            <input
              type="text"
              placeholder="required"
              name="display"
              className="field"
              onChange={handleDisplayChange}
            />
          </div>
          <div>
            <label htmlFor="file" className="label">
              File
            </label>
            <div className="field w-full flex flex-row items-center">
              <span className="grow">{fileName}</span>
              <input
                type="file"
                id="file"
                className="absolute opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
              {file === null ? (
                <label
                  htmlFor="file"
                  className="hover:bg-sky-900 hover:cursor-pointer hover:text-white border-1 border-slate-400 px-3 text-sm rounded-lg items-center justify-center py-2  transition-all duration-300 ease-in-out"
                >
                  choose a file
                </label>
              ) : (
                <button
                  onClick={() => {
                    setFile(null);
                    setFileName("No file chosen");
                  }}
                >
                  <X />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="display" className="label">
              Link
            </label>
            <input
              type="text"
              placeholder="Attachment link"
              name="link"
              className="field"
              onChange={handleLinkChange}
            />
          </div>
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
