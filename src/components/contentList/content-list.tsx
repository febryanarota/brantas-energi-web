"use client";

import { contentBlock, page } from "@prisma/client";
import { useEffect, useState } from "react";
import { ContentComponent } from "./content-component";

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

    console.log(result);
    console.log(position);

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
  }, []);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        data?.map((content) => {
          let id;
          switch (content.blockType) {
            case "text":
              id = content.textId;
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
