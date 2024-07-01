import { qna } from "@prisma/client";
import Faq from "./faq";

export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/faq`, {
    method : 'GET',
    headers : {
      'Content-Type' : 'application/json',
    },
    credentials : 'include'
  });

  const data : qna[] = await res.json();
  console.log(data);
  return (
    <Faq data={data} />
  )
}
