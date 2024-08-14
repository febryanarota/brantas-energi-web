"use client";

import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import {
  contentBlock,
  fileImage,
  fileImageBuffer,
} from "@prisma/client";
import { delay } from "@/lib/utils";
import { GripVertical, X } from "lucide-react";
import {
  ALLOWED_FILE_TYPES,
  ALLOWED_MIME_TYPES,
  createFileImage,
  MAX_FILE_SIZE,
} from "@/lib/dataType";
import Image from "next/image";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import FileImageList from "../list/FileImageList";

export const FileImageEditModal = ({
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
  const [items, setItems] = useState<createFileImage[]>([]);
  const [tempId, setTempId] = useState(0);
  const [errorAdd, setErrorAdd] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string>();

  const [fileName, setFileName] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState<string>("");
  const [link, setLink] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    // get the block id -> get the file image ids
    setIsFetching(true);
    const fetchData = async () => {
      const startTime = Date.now();
      const timeout = 20000;
      const retryDelay = 1000;

      try {
        const responseContentBlock = await fetch(`/api/content/${blockId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
        });

        if (!responseContentBlock.ok) {
          throw new Error("Failed to fetch data");
        }

        const block: contentBlock = await responseContentBlock.json();
        console.log(block);
        console.log(block.fileImageId);
        const responseBuffer = await fetch(
          `/api/fileImageBuffer/${block.fileImageId}`,
          {
            method: "GET",
          },
        );

        const buffer: fileImageBuffer = await responseBuffer.json();
        const fileImageId = buffer.fileImageIds;

        // loop through the file image ids and get the file image data
        for (let i = 0; i < fileImageId.length; i++) {
          const responseFileImage = await fetch(
            `/api/file-image/${fileImageId[i]}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Cookie: `session=${session}`,
              },
            },
          );

          if (!responseFileImage.ok) {
            throw new Error("Failed to fetch data");
          }

          const fileImage: fileImage = await responseFileImage.json();

          const newFileImage: createFileImage = {
            link: fileImage.link,
            file: null,
            image: null,
            title: fileImage.title,
            id: fileImage.id,
            fileName: null,
            imageName: null,
            imagePreview: fileImage.image,
          };

          console.log(newFileImage);

          setItems((prevItems) => [...prevItems, newFileImage]);
        }
        // setTempId to the length of items
        setTempId(items.length);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (Date.now() - startTime < timeout) {
          await delay(retryDelay);
        }
      }
      setIsFetching(false);
    };

    fetchData();
  }, []);

  const handleAddCard = () => {
    if (title === "") {
      setErrorAdd("Please fill in the title");
      return;
    }

    if (!image) {
      setErrorAdd("Please choose an image");
      return;
    }

    if (file === null && link === null) {
      setErrorAdd("Please insert a file or link");
      return;
    }

    if (file && link) {
      setErrorAdd(
        "Please fill only one field between file or link as attachment",
      );
      return;
    }

    const newFileImage: createFileImage = {
      id: tempId,
      title: title,
      image: image,
      link: link,
      file: file,
      fileName: fileName,
      imageName: imageName,
      imagePreview: imagePreview,
    };

    setItems([...items, newFileImage]);
    setTempId(tempId + 1);
    clearForm();
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Validate MIME type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrorAdd("Invalid file type");
        setFileName(null);
        setFile(null);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrorAdd("File size exceeds the maximum limit of 5MB.");
        setFileName(null);
        setFile(null);
        return;
      }

      setFile(file);
      setErrorAdd("");
      setFileName(file.name);
    } else {
      setFileName(null);
    }
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        setErrorAdd("Invalid file type. Only JPEG, JPG, and PNG are allowed.");
        setImageName(null);
        setImage(null);
        setImagePreview(undefined);
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrorAdd("File size exceeds the maximum limit of 5MB.");
        setImageName(null);
        setImage(null);
        setImagePreview(undefined);
        return;
      }

      setImage(file);
      setErrorAdd("");
      setImageName(file.name);
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
    } else {
      setImageName(null);
    }
  };

  const handleSubmit = async () => {
    setError("");
    setIsSaving(true);
    if (items.length === 0) {
      setError("Please add at least one content");
      setIsSaving(false);
      return;
    }

    const formData = new FormData();

    items.forEach((item, index) => {
      formData.append(`link[${item.id}]`, item.link ?? "");
      formData.append(`file[${item.id}]`, item.file ?? "");
      formData.append(`image[${item.id}]`, item.image ?? "");
      formData.append(`title[${item.id}]`, item.title);
      formData.append(`isFile[${item.id}]`, item.file ? "true" : "false");
      formData.append(`id[${item.id}]`, item.id.toString());
      formData.append(`order[${index}]`, item.id.toString());
    });

    formData.append("length", items.length.toString());
    formData.append("blockId", blockId.toString());

    try {
      const res = await fetch(`/api/file-image`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errorResponse = await res.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${res.status} ${res.statusText}`,
        );
      }

      const result = await res.json();
      const role = session.role;

      if (role !== "admin") {
        const response = await fetch(`/api/content/${blockId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
          body: JSON.stringify({
            editId: result.id,
            status: "updatePending",
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }
      }

      setIsSaving(false);
      window.location.reload();
    } catch (error) {
      setError("Failed to save the content");
    } finally {
      setIsSaving(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setFile(null);
    setImage(null);
    setLink(null);
    setFileName(null);
    setImageName(null);
    setImagePreview(undefined);
  };

  return (
    <div className="w-full py-10">
      {!isFetching ? (
        <div className="max-w-3xl w-full grid mb-10 px-5">
          {/* form */}
          <div className="border-2 bordet-slate-200 rounded-md p-2">
            <div>
              <div className="flex flex-col w-full gap-5">
                <div className="flex flex-col justify-center w-full">
                  <label htmlFor="display" className="label">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="required"
                    name="title"
                    className="field"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="image" className="label">
                    Image
                  </label>
                  <div className="field w-full flex flex-row items-center">
                    <span className="grow">
                      {imageName ? imageName : "No image chosen"}
                    </span>
                    <input
                      type="file"
                      id="image"
                      className="absolute opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                    {image === null ? (
                      <label
                        htmlFor="image"
                        className="hover:bg-sky-900 hover:cursor-pointer hover:text-white border-1 border-slate-400 px-3 text-sm rounded-lg items-center justify-center py-2  transition-all duration-300 ease-in-out"
                      >
                        choose an image
                      </label>
                    ) : (
                      <button
                        onClick={() => {
                          setImage(null);
                          setImageName(null);
                          setImagePreview(undefined);
                        }}
                      >
                        <X />
                      </button>
                    )}
                  </div>
                  {imagePreview && (
                    <Image
                      src={imagePreview}
                      alt=""
                      width={200}
                      height={200}
                      className="rounded-md mt-2"
                    />
                  )}
                </div>
                <div>
                  <label htmlFor="file" className="label">
                    File
                  </label>
                  <div className="field w-full flex flex-row items-center">
                    <span className="grow">
                      {fileName ? fileName : "No file chosen"}
                    </span>
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
                          setFileName(null);
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
                    value={link ? link : ""}
                    onChange={(e) => setLink(e.target.value)}
                  />
                </div>
              </div>
            </div>
            {errorAdd ? (
              <p className="text-slate-500 text-sm mt-4">{errorAdd}</p>
            ) : null}
            <Button onClick={handleAddCard} className="submit-btn">
              <p>Add</p>
            </Button>
          </div>
          <div className="w-full bg-slate-100 mt-5 px-2 pr-5 py-5 pb-10 rounded-md">
            {items.length > 0 ? (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {items.map((item, index) => (
                        <Draggable
                          key={index}
                          draggableId={index.toString()}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="my-5 rounded-md flex flex-row w-full"
                            >
                              <GripVertical className="mt-5 text-slate-500" />
                              <FileImageList data={item} setItems={setItems} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            ) : (
              <div className="text-center text-gray-700">
                Empty content
                <br />
                <span className="text-gray-500 text-sm">
                  insert an image file content
                </span>
              </div>
            )}
          </div>

          <div className="w-full flex flex-col justify-end">
            <Button className="submit-btn" onClick={handleSubmit}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
            {error ? (
              <p className="text-slate-500 text-sm mt-4 text-center">{error}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <div>Fetching...</div>
      )}
    </div>
  );
};
