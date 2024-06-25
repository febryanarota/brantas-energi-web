
import { qna } from "@/lib/dataType";
import prisma from "@/lib/prisma";
import Faq from "./faq";

export default async function Page() {
    const data : qna[] = await prisma.qna.findMany();
    return (
        <Faq data={data}/>
    )
};
