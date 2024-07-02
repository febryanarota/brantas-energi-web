import DraggableList from "@/components/draggableList/draggableList";
import { CMSContainer } from "@/components/ui/container";
import { getSession } from "@/lib/auth";
import { profile } from "@prisma/client";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function getData(): Promise<profile[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().get("session")?.value || "",
      },
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result: profile[] = await res.json();
    return result;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/cms/login");

  const data: profile[] = await getData();
  return (
    <div>
      <CMSContainer>
        <div className="flex flex-row justify-between items-center border-b-3 pb-2">
          <h1 className="text-3xl font-bold tracking-widerfle">
            Company Profile
          </h1>
        </div>
        <p>{data[0].facebook}</p>
        <p>{data[0].instagram}</p>
      </CMSContainer>
    </div>
  );
}
