"use client";
import { contentBlock, qna, text } from "@prisma/client";
import FaqContent from "./faq-content";
import { useEffect, useState } from "react";
import {
  cancelButton,
  createButton,
  DeleteButton,
  EditButton,
  updateButton,
} from "./buttons";
import {TextContent} from "./text-content";

async function getData(content : contentBlock) {
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
  }
}


export default function Content({
  type,
  block,
  deleteHandler,
}: {
  type: string;
  block: contentBlock;
  deleteHandler: Function;
}) {
  const [status, setStatus] = useState(block.status);
  const [border, setBorder] = useState("border-white");
  const [button, setButton] = useState<JSX.Element | null>(null);
  const [renderContent, setRenderContent] = useState<JSX.Element | null>(null);


  useEffect(() => {
    // switch (status) {
    //   case "createPending":
    //     setBorder("border-emerald-400");
    //     setButton(
    //       <div className="flex flex-row">
    //         <div>
    //           {createButton(
    //             block.id,
    //             setStatus,
    //             `${process.env.NEXT_PUBLIC_URL}/api/faq`,
    //           )}
    //         </div>
    //         <div>{cancelButton(block.id)}</div>
    //       </div>,
    //     );
    //     break;
    //   case "updatePending":
    //     setBorder("border-yellow-400");
    //     setButton(
    //       <div className="flex flex-row">
    //         <div>{updateButton(block.id, setStatus)}</div>
    //         <div>{cancelButton(block.id)}</div>
    //       </div>,
    //     );
    //     break;
    //   case "deletePending":
    //     setBorder("border-red-400");
    //     setButton(
    //       <div className="flex flex-row">
    //         <div>
    //           <DeleteButton
    //             id={block.id}
    //             setStatus={setStatus}
    //             api={`${process.env.NEXT_PUBLIC_URL}/api/faq`}
    //           />
    //         </div>
    //         <div>{cancelButton(block.id)}</div>
    //       </div>,
    //     );
    //     break;
    //   case "deleted":
    //     deleteHandler(block.id);
    //     break;
    //   default:
    //     setBorder("border-white");
    //     setButton(
    //       <div className="flex flex-row">
    //         <div>
    //           <EditButton id={block.id} setStatus={setStatus} type={type} />
    //         </div>
    //         <div>
    //           <DeleteButton
    //             id={block.id}
    //             setStatus={setStatus}
    //             api={`${process.env.NEXT_PUBLIC_URL}/api/faq`}
    //           />
    //         </div>
    //       </div>,
    //     );
    // }

    const fetchData = async () => {
      try {
        const data = await getData(block);
        switch (type) {
          case "faq":
            setRenderContent(<FaqContent content={data as qna} />);
            break;
          case "text":
            setRenderContent(<TextContent content={data as text} />);
            break;
          default:
            setRenderContent(<div>Content</div>);
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
        <div className="flex flex-col">{renderContent}</div>
        {button}
      </div>
    </div>
  );
}
