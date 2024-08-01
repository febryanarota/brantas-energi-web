import { CMSContainer } from "@/components/ui/container";
import FormTrigger from "@/components/forms/forms";
import DraggableList from "@/components/draggableList/draggableList";
import { contentBlock } from "@prisma/client";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { delay } from "@/lib/utils";
import { CMS_PAGES } from "@/lib/dataType";

async function getData(page: string): Promise<contentBlock[]> {
  const sessionCookie = cookies().get("session")?.value || "";
  const timeout = 20000;
  const retryDelay = 1000;
  const startTime = Date.now();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/page/${page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${sessionCookie}`,
        },
        credentials: "include",
      },
    );

    const posResp = await response.json();
    const positions = posResp.positions;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/content?page=${page}&status=all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${sessionCookie}`,
        },
        credentials: "include",
      },
    );

    if (!res.ok) {
      const errorResponse = await res.text();
      console.error("API Response Error:", errorResponse);
      throw new Error(
        `Network response was not ok: ${res.status} ${res.statusText}`,
      );
    }

    let result: contentBlock[] = await res.json();

    // Sort the data based on the positions
    result.sort((a, b) => {
      return positions.indexOf(a.id) - positions.indexOf(b.id);
    });

    return result;
  } catch (error) {
    if (Date.now() - startTime < timeout) {
      await delay(retryDelay);
      return getData(page);
    } else {
      console.error("Error fetching data:", error);
      return []; // Return an empty array in case of error
    }
  }
}

export default async function Page(context: { params: { page: string } }) {
  // Get the session and redirect to login if not found
  const session = await getSession();
  if (!session) redirect("/cms/login");
  const page = context.params.page as string;
  // if page not in CMS_PAGES, redirect to 404
  if (!CMS_PAGES.includes(page)) redirect("/404");

  const data: contentBlock[] = await getData(page);
  return (
    <div className="w-full">
      <CMSContainer>
        <div className="flex flex-row justify-between items-center border-b-3 pb-2">
          <h1 className="text-3xl font-bold tracking-widerfle">{page}</h1>
          <FormTrigger page={page} session={session} />
        </div>
        <DraggableList data={data} session={session} />
        {data.length < 1 && (
          <div>Empty content, refresh or insert some new contents.</div>
        )}
      </CMSContainer>
    </div>
  );
}
