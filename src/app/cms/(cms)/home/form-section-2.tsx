"use client";

import { Editor } from "@/components/editor/Editor";
import { Skeleton } from "@/components/ui/skeleton";
import { ALLOWED_MIME_TYPES, imageData, MAX_FILE_SIZE } from "@/lib/dataType";
import { Button } from "@nextui-org/button";
import { home } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function FormSection2({
  verified,
  pending,
  role,
}: {
  verified: home;
  pending: home;
  role: string;
}) {
  const [description2, setDescription2] = useState<string>(
    verified.description2 || "",
  );
  const [heading2, setHeading2] = useState<string>(verified.heading2 || "");
  const [subHeading2, setSubHeading2] = useState<string>(verified.subheading2 || "");
  const [image, setImage] = useState<imageData>();

  const [descriptionPending, setDescriptionPending] = useState<string>(
    pending.description2 || "",
  );
  const [headingPending, setHeadingPending] = useState<string>(
    pending.heading2 || "",
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
            `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${verified.image2}`,
          );
          const blob = await response.blob();
          const file = new File([blob], verified.image2, { type: blob.type });

          setImage({
            image: file,
            name: verified.image2,
            display: `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${verified.image2}`,
          });

          const resPending = await fetch(
            `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${pending.image2}`,
          );
          const blobPending = await resPending.blob();
          const filePending = new File([blob], pending.image2, {
            type: blobPending.type,
          });

          setImagePending({
            image: filePending,
            name: pending.image2,
            display: `${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${pending.image2}`,
          });

          if (verified.image2 !== pending.image2) {
            setIsPending(true);
          }

          if (verified.description2 !== pending.description2) {
            setIsPending(true);
          }

          if (verified.heading2 !== pending.heading2) {
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
    if (!heading2) {
      setError("Heading is required");
    }

    if (!image?.image) {
      setError("Image is required");
    }

    formData.append("heading2", heading2);
    formData.append("image2", image?.image as File);
    formData.append("description2", description2);

    try {
      // POST request to create a new text block
      const response = await fetch("/api/home/section2", {
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

      setIsSaving(false); // Set loading state to false
      window.location.reload();
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
    formData.append("heading2", headingPending);
    formData.append("description2", descriptionPending);
    if (imagePending?.image) {
      formData.append("image2", imagePending.image);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/home/section2`,
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
        `${process.env.NEXT_PUBLIC_URL}/api/home/section2`,
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
      <p className="font-bold text-primaryBlue mb-4">Section 2</p>

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
                <label htmlFor="heading2" className="label text-sm">
                  Heading
                </label>
                <input
                  type="text"
                  name="heading2"
                  className="field"
                  onChange={(e) => setHeading2(e.target.value)}
                  value={heading2}
                />
              </div>
              <div className="flex flex-col justify-center w-full">
                <label htmlFor="subHeading2" className="label text-sm">
                  Sub-heading
                </label>
                <input
                  type="text"
                  name="subHeading2"
                  className="field"
                  onChange={(e) => setSubHeading2(e.target.value)}
                  value={subHeading2}
                />
              </div>
              <div className="flex flex-col justify-center w-full">
                <label htmlFor="description2" className="label text-sm">
                  Description
                </label>
                <Editor content={description2} setContent={setDescription2} />
              </div>
              <div>
                <label htmlFor="image2" className="label text-sm">
                  Image
                </label>
                <div className="field w-full flex flex-row items-center">
                  <span className="grow">
                    {image?.name ? image.name : "No image chosen"}
                  </span>
                  <input
                    type="file"
                    id="image2"
                    className="absolute opacity-0 cursor-pointer hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="image2"
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
