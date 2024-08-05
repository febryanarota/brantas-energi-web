"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { heading1, image } from "@prisma/client";
import { delay } from "@/lib/utils";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/dataType";
import Image from "next/image";

export const ImageEditModal = ({
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
  const [content, setContent] = useState<image>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const startTime = Date.now();
      const timeout = 20000;
      const retryDelay = 1000;

      try {
        const response = await fetch(`/api/image/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: image = await response.json();
        setContent(data);
        setImagePreview(
          `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${data.shadowId}`,
        );
        setFileName(data.shadowId);
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
    formData.append("blockId", blockId.toString());

    const role = session.role;
    try {
      if (role !== "admin") {
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
        const response = await fetch(`/api/image/${content?.id}`, {
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
        </div>

        {imagePreview && (
          <div className="w-full max-w-[80%] h-[20rem] self-center flex flex-col items-center ">
            <div className="rounded-md overflow-hidden h-full w-fit shadow-md">
              <Image src={imagePreview} alt="Preview" className="h-full w-fit" width={100} height={100}/>
            </div>
          </div>
        )}

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
