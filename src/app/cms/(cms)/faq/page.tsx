import DraggableList from "@/components/draggableList/draggableList";
import { CMSContainer } from "@/components/ui/container";
import { getSession } from "@/lib/auth";
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { qna } from "@prisma/client";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FormFaq from "./form-faq";

async function getData(): Promise<qna[]> {
  try {
    
    // TO DO: retrive from content table
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
      <CMSContainer>
        <div className="flex flex-row justify-between items-center border-b-3 pb-2">
          <h1 className="text-3xl font-bold tracking-widerfle">Frequently Asked Questions</h1>
          <FormFaq/>
          {/* the button supposed to be here */}
        </div>
        {
          data.length > 0 ?
            <DraggableList type="faq" data={data}/>
          :
          <div className="flex justify-center items-center w-full mt-10">
            <p className="text-2xl text-gray-400">No data found</p>
          </div>

        }
      </CMSContainer>
    </div>
  );
}
