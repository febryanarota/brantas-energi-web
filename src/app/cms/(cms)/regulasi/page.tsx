import { CMSContainer } from "@/components/ui/container";
import FormTrigger from "@/components/forms/forms";
import DraggableList from "@/components/draggableList/draggableList";
import { contentBlock } from "@prisma/client";
import { cookies } from "next/headers";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";


async function getData(): Promise<contentBlock[]> {
  const sessionCookie = cookies().get("session")?.value || "";
  console.log("Session Cookie:", sessionCookie);

  try {
    // TO DO: retrive from content table
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/content?page=regulasi&status=all`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cookie": `session=${sessionCookie}`,
        },
        credentials: "include",
      },
    );

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorResponse = await res.text();
      console.error("API Response Error:", errorResponse);
      throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
    }

    const result: contentBlock[] = await res.json();
    return result;
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array in case of error
  }
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/cms/login");

  const data: contentBlock[] = await getData();
  return (
    <div className="w-full">
      <CMSContainer>
        <div className="flex flex-row justify-between items-center border-b-3 pb-2">
          <h1 className="text-3xl font-bold tracking-widerfle">Regulasi</h1>
          <FormTrigger page={"regulasi"} session={session}/>
        </div>
        <DraggableList data={data} session={session}/>
      </CMSContainer>
    </div>
  );
}
