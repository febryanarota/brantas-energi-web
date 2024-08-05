import { Editor } from "@/components/editor/Editor";
import { ALLOWED_MIME_TYPES, imageData, MAX_FILE_SIZE } from "@/lib/dataType";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useState } from "react";

export default function CreateCardModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<imageData>();
  const [error, setError] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);

    // Validate input fields
    if (!title || !link || !description || !image) {
      setError("All fields are required");
      setIsSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("link", link);
    formData.append("description", description);
    formData.append("image", image?.image as File);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/card`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "An error occurred while submitting the form",
        );
      } else {
        window.location.reload();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting new card: ", error);
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

  return (
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="title" className="label text-sm">
              Title
            </label>
            <input
              type="text"
              name="title"
              className="field"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="link" className="label text-sm">
              Link
            </label>
            <input
              type="text"
              name="link"
              className="field"
              onChange={(e) => setLink(e.target.value)}
              value={link}
            />
          </div>
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="description1" className="label text-sm">
              Description
            </label>
            <Editor content={description} setContent={setDescription} />
          </div>
          <div>
            <label htmlFor="image" className="label text-sm">
              Image
            </label>
            <div className="field w-full flex flex-row items-center">
              <span className="grow">
                {image?.name ? image.name : "No image chosen"}
              </span>
              <input
                type="file"
                id="image"
                className="absolute opacity-0 cursor-pointer hidden"
                onChange={handleFileChange}
              />
              <label
                htmlFor="image"
                className="hover:bg-sky-900 hover:cursor-pointer hover:text-white border-1 border-slate-400 px-3 text-sm rounded-lg items-center justify-center py-2  transition-all duration-300 ease-in-out"
              >
                choose a file
              </label>
            </div>
          </div>
          {image?.display && (
            <div>
              <Image
                src={image?.display}
                alt=""
                width={200}
                height={200}
                className="rounded-md"
              />
            </div>
          )}
          <Button
            type="submit"
            className="submit-btn self-center mt-0 mr-2"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
          {error ? (
            <p className="text-slate-500 text-sm self-center">{error}</p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
