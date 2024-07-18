import { CMSContainer } from "@/components/ui/container";
import { Button } from "@nextui-org/button";
import FormSection1 from "./form-section-1";
import FormSection2 from "./form-section-2";
import FormSection3 from "./form-section-3";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { home } from "@prisma/client";

async function getData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/home`, {
    method: "GET",
  });
  
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  
  const data: { verified: home; pending: home } = await response.json();
  return data;
}

export default async function Page() {

  const session = await getSession();
  const role = session?.role;

  if (!session) redirect("/cms/login");
  const data = await getData();

  return (
    <div className="w-full">
      <CMSContainer>
        <div className="flex flex-row justify-between items-center border-b-3 pb-2 mb-5">
          <h1 className="text-3xl font-bold tracking-widerfle">Home</h1>
        </div>

        <div className="flex flex-col mb-5 rounded-md">
          <div className="flex flex-col gap-5 ">
            
            <FormSection1 verified={data.verified} pending={data.pending} role={role}/>
            
            <FormSection2/>

            <FormSection3/>
            
          </div>
        </div>
      </CMSContainer>
    </div>
  );
}
