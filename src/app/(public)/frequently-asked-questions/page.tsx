import { qna } from "@prisma/client";
import Faq from "./faq";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/faq`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().get("session")?.value || "",
    },
    credentials: "include",
  });

  const data: qna[] = await res.json();
  return <Faq data={data} />;
}
