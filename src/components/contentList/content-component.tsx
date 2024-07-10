"use client";

import { delay } from "@/lib/utils";
import { Skeleton } from "@nextui-org/react";
import { heading1, heading2, text } from "@prisma/client";
import { useEffect, useState } from "react";

async function getContent({
  type,
  contentID,
  timeout = 20000,
  retryDelay = 1000,
}: {
  type: string;
  contentID: number;
  timeout?: number;
  retryDelay?: number;
}) {
  const startTime = Date.now();

  async function fetchData() {
    try {
      const response = await fetch(`/api/${type}/${contentID}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      if (Date.now() - startTime < timeout) {
        await delay(retryDelay);
        return fetchData();
      } else {
        return null;
      }
    }
  }

  return fetchData();
}

export function ContentComponent({
  type,
  contentID,
}: {
  type: string;
  contentID: number;
}) {
  const [data, setData] = useState<text | heading1 | heading2 | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [renderContent, setRenderContent] = useState<JSX.Element | null>(null);

  useEffect(() => {
    getContent({ type, contentID }).then((result) => {

      if (!result) {
        setData(undefined);
        setLoading(false);
        return;
      }

      switch (type) {
        case "text":
          setRenderContent(<TextContent data={result as text} />);
          break;
        case "heading1":
          setRenderContent(<Heading1 data={result as heading1}/>);
          break;
        case "heading2":
          setRenderContent(<Heading2 data={result as heading2}/>);
          break;
        default:
          setRenderContent(null);
      }

      setData(result);
      setLoading(false);
    });
  }, [type, contentID]);

  return (
    <div>
      {loading ? (
        <div className="space-y-3 mt-5">
          <Skeleton className="w-full rounded-lg">
            <div className="h-3 w-full rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-full rounded-lg">
            <div className="h-3 w-full rounded-lg bg-default-200"></div>
          </Skeleton>
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-300"></div>
          </Skeleton>
        </div>
      ) : !data ? (
        <div className="my-10 text-gray-600">
          something went wrong, please refresh
        </div>
      ) : (
        renderContent
      )}
    </div>
  );
}

export function TextContent({ data }: { data: text }) {
  return (
    <div className="w-full">
      {data.content ? (
        <div
          className="ProseMirror whitespace-pre-line text-sm text-justify mb-3"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: data.content }}
        />
      ) : (
        <div className="invalid-feedback">something went wrong</div>
      )}
    </div>
  );
}

export function Heading1({data}:{data : heading1}) {
  return (
    <div className="mt-10 mb-5">
      <div className="border-l-primaryYellow border-l-2 pl-5 ">

        <h2 className="text-3xl font-medium">
          {
            data.title
          }
        </h2>
        <p className="text-sm">{data.description}</p>
      </div>
    </div>
  );
}

export function Heading2({data}:{data : heading2}) {
  return (
    <div className="flex flex-col mt-7 mb-4">
      <h3 className="text-2xl font-medium">{data.title}</h3>
      <p className="text-sm">{data.description}</p>
      <div className="w-[10rem] mt-1 border-t-2 border-primaryYellow"></div>
    </div>
  )
}
