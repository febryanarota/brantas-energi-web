import { CMSContainer } from "@/components/ui/container";
import TableComponent from "./kepuasan-table";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/cms/login");
  
  return (
    <div className="w-full">
      <CMSContainer>
        <div>
          <h1 className="text-3xl font-bold mb-3">Form Kepuasan Layanan</h1>
          <TableComponent />
        </div>
      </CMSContainer>
    </div>
  );
}
