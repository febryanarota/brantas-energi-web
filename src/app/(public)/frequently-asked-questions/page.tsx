// import { qna } from "@/lib/dataType";
import { qna } from "@prisma/client";
import Faq from "./faq";

export default async function Page() {
  // const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/faq`, {
  //   method : 'GET',
  //   headers : {
  //     'Content-Type' : 'application/json',
  //   },
  // });

  // const data : qna[] = await res.json();
  return (
    // <Faq data={data} />
    <div>
      p1
    </div>
  )
}
