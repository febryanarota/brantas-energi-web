"use client";
import {
  contentBlock,
  faq,
  file,
  fileImageBuffer,
  heading1,
  heading2,
  image,
  text,
} from "@prisma/client";
import { useEffect, useState } from "react";
import {
  CancelButton,
  CancelDeleteButton,
  CancelEditButton,
  ConfirmButton,
  ConfirmEditButton,
  DeleteButton,
  EditButton,
} from "./buttons";
import { TextContent } from "./text-content";
import { Heading1Content, Heading2Content } from "./heading-content";
import { delay } from "@/lib/utils";
import { ImageContent } from "./image-content";
import { FileContent } from "./file-content";
import { FaqContent } from "./faq-content";
import { FileImageContent } from "./file-image-content";

async function fetchData(url: string) {
  const startTime = Date.now();
  const timeout = 20000;
  const retryDelay = 1000;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    if (Date.now() - startTime < timeout) {
      await delay(retryDelay);
      return fetchData(url);
    } else {
      throw new Error("Request timed out");
    }
  }
}

async function getData(content: contentBlock) {
  let result;
  switch (content.blockType) {
    case "faq":
      result = await fetchData(`/api/faq/${content.faqId}`);
      return result as faq;
    case "text":
      result = await fetchData(`/api/text/${content.textId}`);
      return result as text;
    case "heading1":
      result = await fetchData(`/api/heading1/${content.heading1Id}`);
      return result as heading1;
    case "heading2":
      result = await fetchData(`/api/heading2/${content.heading2Id}`);
      return result as heading2;
    case "image":
      result = await fetchData(`/api/image/${content.imageId}`);
      return result as image;
    case "file":
      result = await fetchData(`/api/file/${content.fileId}`);
      return result as file;
    case "fileImage":
      result = await fetchData(`/api/file-image-buffer/${content.fileImageId}`);
      return result as fileImageBuffer;
  }
}

export default function Content({
  type,
  block,
  deleteHandler,
  session,
}: {
  type: string;
  block: contentBlock;
  deleteHandler: Function;
  session: any;
}) {
  const [status, setStatus] = useState(block.status);
  const [border, setBorder] = useState("border-white");
  const [button, setButton] = useState<JSX.Element | null>(null);
  const [renderContent, setRenderContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const role = session.role ? session.role : "user";

      try {
        const data = await getData(block);

        if (!data) {
          throw new Error("Failed to fetch data");
        }

        switch (type) {
          case "faq":
            setRenderContent(<FaqContent content={data as faq} editId={block.editId}/>);
            break;
          case "text":
            setRenderContent(
              <TextContent content={data as text} editId={block.editId} />,
            );
            break;
          case "heading1":
            setRenderContent(
              <Heading1Content
                content={data as heading1}
                editId={block.editId}
              />,
            );
            break;
          case "heading2":
            setRenderContent(
              <Heading2Content
                content={data as heading2}
                editId={block.editId}
              />,
            );
            break;
          case "image":
            setRenderContent(
              <ImageContent content={data as image} editId={block.editId} />,
            );
            break;
          case "file":
            setRenderContent(
              <FileContent content={data as file} editId={block.editId} />,
            );
            break;
          case "fileImage":
            setRenderContent(
              <FileImageContent content={data as fileImageBuffer} editId={block.editId} />,
            );
            break;
          default:
            // make sure to use break on every case
            setRenderContent(<div>Content</div>);
        }


        switch (status) {
          case "createPending":
            setBorder("border-emerald-400");
            setButton(
              <div className="flex flex-row">
                <div>
                  {role === "admin" ? (
                    <ConfirmButton
                      setStatus={setStatus}
                      type={type}
                      session={session}
                      blockId={block.id}
                    />
                  ) : null}
                </div>
                <div>
                  <CancelButton
                    id={data?.id as number}
                    setStatus={setStatus}
                    type={type}
                    session={session}
                    blockId={block.id}
                  />
                </div>
              </div>,
            );
            break;
          case "updatePending":
            setBorder("border-yellow-400");
            setButton(
              <div className="flex flex-row">
                <div>
                  {role === "admin" ? (
                    <ConfirmEditButton
                      id={data?.id as number}
                      setStatus={setStatus}
                      session={session}
                      block={block}
                    />
                  ) : null}
                </div>
                <div>
                  <CancelEditButton
                    id={data?.id as number}
                    setStatus={setStatus}
                    session={session}
                    block={block}
                  />
                </div>
              </div>,
            );
            break;
          case "deletePending":
            setBorder("border-red-400");
            setButton(
              <div className="flex flex-row">
                <div>
                  {role === "admin" ? (
                    <DeleteButton
                      id={data?.id as number}
                      setStatus={setStatus}
                      type={type}
                      session={session}
                      blockId={block.id}
                    />
                  ) : null}
                </div>
                <div>
                  <CancelDeleteButton
                    id={data?.id as number}
                    setStatus={setStatus}
                    type={type}
                    session={session}
                    blockId={block.id}
                  />
                </div>
              </div>,
            );
            break;
          default:
            setBorder("border-white");
            setButton(
              <div className="flex flex-row">
                <div>
                  <EditButton
                    id={data?.id as number}
                    setStatus={setStatus}
                    type={type}
                    session={session}
                    blockId={block.id}
                  />
                </div>
                <div>
                  <DeleteButton
                    id={data?.id as number}
                    setStatus={setStatus}
                    type={type}
                    session={session}
                    blockId={block.id}
                  />
                </div>
              </div>,
            );
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [status, type, block, deleteHandler, session]);

  return (
    <div
      className={`${border} bg-white shadow-sm w-full h-full border-2 p-5 rounded-md `}
    >
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col grow mr-2">{renderContent}</div>
        {button}
      </div>
    </div>
  );
}
