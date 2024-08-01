import { CMSContainer } from "@/components/ui/container";
import TableComponent from "./pengaduan-table";


export default async function Page() {

  return (
    <div className="w-full">
      <CMSContainer>
        <div>
          <h1 className="text-3xl font-bold mb-3">Form Pengaduan</h1>
          <TableComponent/>
        </div>
      </CMSContainer>
    </div>
  );
}
