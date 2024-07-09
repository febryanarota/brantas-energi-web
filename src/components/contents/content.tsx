"use client";
import { contentBlock, heading1, heading2, qna, text } from "@prisma/client";
import FaqContent from "./faq-content";
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

async function getData(content: contentBlock) {
  let response;
  let result;
  switch (content.blockType) {
    case "faq":
      response = await fetch(`/api/faq/${content.faqId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await response.json();
      return result as qna;
    case "text":
      response = await fetch(`/api/text/${content.textId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await response.json();
      return result as text;
    case "heading1":
      response = await fetch(`/api/heading1/${content.heading1Id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await response.json();
      return result as heading1; 
    case "heading2":
      response = await fetch(`/api/heading2/${content.heading2Id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      result = await response.json();
      return result as heading2; 
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
            setRenderContent(<FaqContent content={data as qna} />);
            break;
          case "text":
            setRenderContent(
              <TextContent content={data as text} editId={block.editId} />,
            );
            break;
          case "heading1":
            setRenderContent(<Heading1Content content={data as heading1} editId={block.editId}/>);
            break;
          case "heading2":
            setRenderContent(<Heading2Content content={data as heading2} editId={block.editId}/>);
            break;
          default:
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
                    id={data.id}
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
                      id={data.id}
                      setStatus={setStatus}
                      session={session}
                      block={block}
                    />
                  ) : null}
                </div>
                <div>
                  <CancelEditButton
                    id={data.id}
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
                      id={data.id}
                      setStatus={setStatus}
                      type={type}
                      session={session}
                      blockId={block.id}
                    />
                  ) : null}
                </div>
                <div>
                  <CancelDeleteButton
                    id={data.id}
                    setStatus={setStatus}
                    type={type}
                    session={session}
                    blockId={block.id}
                  />
                </div>
              </div>,
            );
            break;
          // case "deleted":
          //   deleteHandler(block.id);
          //   break;
          default:
            setBorder("border-white");
            setButton(
              <div className="flex flex-row">
                <div>
                  <EditButton
                    id={data.id}
                    setStatus={setStatus}
                    type={type}
                    session={session}
                    blockId={block.id}
                  />
                </div>
                <div>
                  <DeleteButton
                    id={data.id}
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
  }, [status, type, block, deleteHandler]);

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
