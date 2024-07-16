"use client";

import { delay } from "@/lib/utils";
import { Skeleton } from "@nextui-org/react";
import { file, heading1, heading2, image, text } from "@prisma/client";
import { useEffect, useState } from "react";
import Image from "next/image";

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
  const [data, setData] = useState<
    text | heading1 | heading2 | image | file | undefined
  >(undefined);
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
          setRenderContent(<Heading1Content data={result as heading1} />);
          break;
        case "heading2":
          setRenderContent(<Heading2Content data={result as heading2} />);
          break;
        case "image":
          setRenderContent(<ImageContent data={result as image} />);
          break;
        case "file":
          setRenderContent(<FileLinkContent data={result as file} />);
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

export function Heading1Content({ data }: { data: heading1 }) {
  return (
    <div className="">
      <div className="mt-10 mb-5 border-l-primaryYellow border-l-2 pl-5 hidden md:block">
        <h2 className="text-3xl font-semibold">{data.title}</h2>
        <p className="text-sm">{data.description}</p>
      </div>
      <div className="mt-2 mb-2 md:hidden">
        <h2 className="border-l-primaryYellow border-l-2 pl-5 text-2xl font-semibold">
          {data.title}
        </h2>
        <p className="text-xs mt-2">{data.description}</p>
      </div>
    </div>
  );
}

export function Heading2Content({ data }: { data: heading2 }) {
  return (
    <div className="flex flex-col mt-7 mb-4">
      <h3 className="md:text-2xl text-xl font-semibold">{data.title}</h3>
      <p className="text-sm">{data.description}</p>
      <div className="w-[10rem] mt-1 border-t-2 border-primaryYellow"></div>
    </div>
  );
}

export function ImageContent({ data }: { data: image }) {
  return (
    <div className="w-full md:py-8 py-4">
      <a
        href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${data.shadowId}`}
        target="_blank"
      >
        <div className="max-h-[70vh] flex justify-center items-center">
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${data.shadowId}`}
            alt={data.alt ? data.alt : "image"}
            width={2000}
            height={2000}
            className="hover:cursor-pointer hover:opacity-60 transition-transform duration-300 ease-in-out max-h-[70vh] w-full h-auto object-contain rounded-lg"
          />
        </div>
      </a>
    </div>
  );
}

export function FileLinkContent({ data }: { data: file }) {
  return (
    <div className="w-full pb-4">
      <a
        href={
          data.isFile
            ? `${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/${data.link}`
            : (data.link as string)
        }
        target="_blank"
        className="text-md underline font-semibold hover:text-primaryYellow transition-colors duration-200 ease-in-out"
      >
        {data.display}
      </a>
    </div>
  );
}
