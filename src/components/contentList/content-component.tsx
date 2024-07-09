'use client'

import { text } from "@prisma/client";
import { useEffect, useState } from "react";

async function delay(ms : number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getContent({
  type,
  contentID,
  timeout = 10000,
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
        throw new Error('Network response was not ok');
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
  const [data, setData] = useState<text | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getContent({ type, contentID }).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [type, contentID]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        !data ? (
          <div>Data Empty</div>
        ) : (
          type === 'text' ? (
            <TextContent data={data as text} />
          ) : (
            <div>Unknown content type</div>
          )
        )
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

export function Heading1() {
  return (
    <div className="mt-16 mb-5">
      <h2 className="text-3xl">
        Peraturan Mengenai <br />
        Keterbukaan Informasi Publik
      </h2>
      <div className="w-[10rem] mt-3 border-t-2 border-primaryYellow"></div>
    </div>
  );
}

export function Heading2() {}
