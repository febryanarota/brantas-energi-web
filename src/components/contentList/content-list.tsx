"use client";

import { contentBlock, page } from "@prisma/client";
import { useEffect, useState } from "react";
import { ContentComponent } from "./content-component";
import { CircularProgress, Skeleton } from "@nextui-org/react";

async function getPosition(page: string) {
  try {
    const response = await fetch(`/api/page/${page}`);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
}

async function getData(page: string) {
  try {
    const response = await fetch(`/api/content?page=${page}`);
    const result: contentBlock[] = await response.json();

    const resPosition: page = await getPosition(page);
    const position = resPosition.positions;

    result.sort((a, b) => {
      return position.indexOf(a.id) - position.indexOf(b.id);
    });
    return result;
  } catch (error) {
    console.error(error);
  }
}

export default function ContentList({ page }: { page: string }) {
  //   const data : contentBlock[] | undefined = await getData(page);
  const [data, setData] = useState<contentBlock[] | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getData(page).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [page]);

  return (
    <div>
      {loading ? (
        <div className="flex w-full justify-center items-center gap-3">
          <CircularProgress aria-label="Loading..." color="primary" />
        </div>
      ) : (
        data?.map((content) => {
          let id;
          switch (content.blockType) {
            case "text":
              id = content.textId;
              break;
            case "heading1":
              id = content.heading1Id;
              break;
            case "heading2":
              id = content.heading2Id;
              break;
            case "image":
              id = content.imageId;
              break;
            case "file":
              id = content.fileId;
              break;
            case "faq":
              id = content.faqId;
              break;
            case "fileImageBuffer":
              id = content.fileImageId;
              break;
            // add more

            default:
              id = 0;
          }

          return (
            <div key={content.id}>
              <ContentComponent
                type={content.blockType}
                contentID={id === null ? 0 : id}
              />
            </div>
          );
        })
      )}

      {!data && !loading && <div>No data</div>}
    </div>
  );
}
