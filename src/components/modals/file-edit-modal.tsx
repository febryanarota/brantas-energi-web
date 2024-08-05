"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { file } from "@prisma/client";
import { delay } from "@/lib/utils";
import { X } from "lucide-react";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "@/lib/dataType";

export const FileEditModal = ({
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
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [fileName, setFileName] = useState("No file chosen");
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState<string>("");
  const [display, setDisplay] = useState<string>("");

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const startTime = Date.now();
      const timeout = 20000;
      const retryDelay = 1000;

      try {
        const response = await fetch(`/api/file/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: file = await response.json();

        if (!data.isFile) {
          setLink(data.link as string);
        }

        setDisplay(data.display);

        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (Date.now() - startTime < timeout) {
          await delay(retryDelay);
          return fetchData();
        }
      }
    };

    fetchData();
  }, [id, session]);

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

  const handleDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplay(e.target.value);
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

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

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append("isFile", "true");
    } else {
      formData.append("link", link as string);
      formData.append("isFile", "false");
    }
    formData.append("display", display as string);
    formData.append("blockId", blockId.toString());

    const role = session.role;
    try {
      if (role !== "admin") {
        const response = await fetch(`/api/file`, {
          method: "POST",
          headers: {
            Cookie: `session=${session}`,
          },
          body: formData,
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
          const errorResponse = await response2.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${response2.status} ${response2.statusText}`,
          );
        }
      } else {
        const response = await fetch(`/api/file/${id}`, {
          method: "PUT",
          headers: {
            Cookie: `session=${session}`,
          },
          credentials: "include",
          body: formData,
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
        className="max-w-3xl w-full grid place-items-center mx-auto pt-4 mb-10 px-5"
      >
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="display" className="label">
              Display Text
            </label>
            <input
              type="text"
              placeholder={isFetching ? "fetching..." : "required"}
              disabled={isFetching}
              name="display"
              className="field"
              onChange={handleDisplayChange}
              value={display as string}
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
              {fileName === "No file chosen" ? (
                <label
                  htmlFor="file"
                  className="hover:bg-sky-900 hover:cursor-pointer hover:text-white border-1 border-slate-400 px-3 text-sm rounded-lg items-center justify-center py-2  transition-all duration-300 ease-in-out"
                >
                  choose a file
                </label>
              ) : (
                <button
                  onClick={(e: any) => {
                    e.preventDefault();
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
              placeholder={isFetching ? "fetching..." : "Attachment link"}
              name="link"
              className="field"
              disabled={isFetching}
              onChange={handleLinkChange}
              value={link as string}
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
            disabled={isLoading || isFetching}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        {error ? <p className="text-slate-500 text-sm mt-4">{error}</p> : null}
      </form>
    </div>
  );
};
