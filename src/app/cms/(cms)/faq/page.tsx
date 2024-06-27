import DraggableList from "@/components/draggableList/draggableList";
import { CMSContainer } from "@/components/ui/container";
import { getSession } from "@/lib/auth";
import { qna } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// import { useEffect, useState } from "react";

async function getData(): Promise<qna[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/faq?status=all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie' : cookies().get('session')?.value || ''
      },
      credentials: 'include'
    });
    
    if (!res.ok) {
      throw new Error('Network response was not ok');
    }

    const result : qna[] = await res.json();
    return result
  } catch (error) {
    console.error("Error fetching data:", error);
    return []; // Return an empty array in case of error
  }
}

export default async function Page() {

  const session = await getSession();
  if (!session) redirect('/cms/login');

  const data : qna[] = await getData()
  

  return (
    <div>
      <CMSContainer heading="Frequently Asked Questions">
        {/* TO DO: pass contentBlocks not the typeBlocks and its data */}
        <DraggableList type="faq" data={data}/>
      </CMSContainer>
    </div>
  );
}
