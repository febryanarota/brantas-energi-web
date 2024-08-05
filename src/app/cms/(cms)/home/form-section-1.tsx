"use client";

import { Editor } from "@/components/editor/Editor";
import { Skeleton } from "@/components/ui/skeleton";
import { ALLOWED_MIME_TYPES, imageData, MAX_FILE_SIZE } from "@/lib/dataType";
import { Button } from "@nextui-org/button";
import { home } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FormSection1({
  verified,
  pending,
  role,
}: {
  verified: home;
  pending: home;
  role: string;
}) {
  const [description1, setDescription1] = useState<string>(
    verified.description1 || "",
  );
  const [heading1, setHeading1] = useState<string>(verified.heading1 || "");
  const [image, setImage] = useState<imageData>();

  const [descriptionPending, setDescriptionPending] = useState<string>(
    pending.description1 || "",
  );
  const [headingPending, setHeadingPending] = useState<string>(
    pending.heading1 || "",
  );
  const [imagePending, setImagePending] = useState<imageData>();
  const [isPending, setIsPending] = useState<boolean>(false);

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isAccepting, setIsAccepting] = useState<boolean>(false);
  const [isRejecting, setIsRejecting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    if (verified) {
      const fetchImage = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${verified.image1}`,
          );
          const blob = await response.blob();
          const file = new File([blob], verified.image1, { type: blob.type });

          setImage({
            image: file,
            name: verified.image1,
            display: `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${verified.image1}`,
          });

          const resPending = await fetch(
            `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${pending.image1}`,
          );
          const blobPending = await resPending.blob();
          const filePending = new File([blob], pending.image1, {
            type: blobPending.type,
          });

          setImagePending({
            image: filePending,
            name: pending.image1,
            display: `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${pending.image1}`,
          });

          if (verified.image1 !== pending.image1) {
            setIsPending(true);
          }

          if (verified.description1 !== pending.description1) {
            setIsPending(true);
          }

          if (verified.heading1 !== pending.heading1) {
            setIsPending(true);
          }
        } catch (error) {
          console.error("Error fetching image:", error);
          setError("Failed to fetch image");
        } finally {
          setIsFetching(false);
        }
      };

      fetchImage();
    }
  }, [verified]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSaving(true);

    const formData = new FormData();
    const heading1 = e.currentTarget.heading1.value;
    if (!heading1) {
      setError("Heading is required");
    }

    if (!image?.image) {
      setError("Image is required");
    }

    formData.append("heading1", e.currentTarget.heading1.value);
    formData.append("image1", image?.image as File);
    formData.append("description1", description1);

    try {
      // POST request to create a new text block
      const response = await fetch("/api/home/section1", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }

      setIsSaving(false); 
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setIsSaving(false);
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
      setImage((prevImage) => ({
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

  const handleAccept = async () => {
    setIsAccepting(true);

    const formData = new FormData();
    formData.append("heading1", headingPending);
    formData.append("description1", descriptionPending);
    if (imagePending?.image) {
      formData.append("image1", imagePending.image);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/home/section1`,
        {
          method: "PATCH",
          body: formData,
        },
      );
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/home/section1`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="flex flex-col p-5 bg-white rounded-md shadow-sm">
      <p className="font-bold text-primaryBlue mb-4">Section 1</p>

      {isPending ? (
        <div className="w-full border-b-2 border-slate-300 mb-7 pb-7">
          <div className="flex flex-col w-full bg-slate-100 rounded-md p-5 mt-3">
            <p className="text-xs font-medium text-gray-500">Content Request</p>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Heading</p>
                <p>{headingPending}</p>
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">
                  Description
                </p>
                <div
                  className="ProseMirror whitespace-pre-line text-sm text-justify"
                  style={{ whiteSpace: "pre-line" }}
                  dangerouslySetInnerHTML={{ __html: descriptionPending }}
                />
              </div>
              <div className="flex flex-col">
                <p className="font-semibold text-slate-500 text-sm">Image</p>
                {imagePending?.display && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${imagePending.name}`}
                    target="_blank"
                    className="w-fit h-fit"
                  >
                    <Image
                      src={imagePending?.display}
                      alt=""
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </a>
                )}
              </div>
            </div>
            <div className="space-x-5 self-end place-self-end ">
              <Button
                disabled={isSaving || isAccepting || isRejecting}
                className="px-[1rem] py-[0.5rem] border-1 border-primaryBlue bg-transparent rounded-[0.5rem]"
                onClick={handleReject}
              >
                {isRejecting
                  ? "Processing.."
                  : role === "admin"
                    ? "Reject"
                    : "Cancel"}
              </Button>
              {role === "admin" && (
                <Button
                  disabled={isSaving || isAccepting || isRejecting}
                  className="submit-btn"
                  onClick={handleAccept}
                >
                  {isAccepting ? "Accepting.." : "Accept"}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {!isFetching ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col justify-center w-full">
                <label htmlFor="heading1" className="label text-sm">
                  Heading
                </label>
                <input
                  type="text"
                  name="heading1"
                  className="field"
                  onChange={(e) => setHeading1(e.target.value)}
                  value={heading1}
                />
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
                  <span className="grow">
                    {image?.name ? image.name : "No image chosen"}
                  </span>
                  <input
                    type="file"
                    id="image1"
                    className="absolute opacity-0 cursor-pointer hidden"
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
              {image?.display && (
                <div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${image.name}`}
                    target="_blank"
                    className="w-fit h-fit"
                  >
                    <Image
                      src={image?.display}
                      alt=""
                      width={200}
                      height={200}
                      className="rounded-md"
                    />
                  </a>
                </div>
              )}
              <Button
                type="submit"
                className="submit-btn self-end mt-0 mr-2"
                disabled={isSaving || isAccepting || isRejecting}
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
              {error ? (
                <p className="text-slate-500 text-sm mt-2 self-end pr-3">
                  {error}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="space-y-5">
              <Skeleton className="w-full h-10 rounded-lg bg-slate-200" />
              <Skeleton className="w-full h-28 rounded-lg bg-slate-200" />
              <Skeleton className="w-full h-10 rounded-lg bg-slate-200" />
            </div>
          )}
        </form>
      )}
    </div>
  );
}
