import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { DataItem } from "@/lib/dataType";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prosedur | PPID Brantas Energi",
};

export default function Page() {
  const data: DataItem[] = [
    {
      title: "Jalur dan waktu layanan",
      filePath: "/prosedur",
    },
    {
      title: "Maklumat pelayanan",
      filePath: "/prosedur",
    },
    {
      title: "Penetapan standar biaya",
      filePath: "/prosedur",
    },
    {
      title: "Pengajuan sengketa informasi",
      filePath: "/prosedur",
    },
  ];

  return (
    <div className="">
      <Header title="Prosedur" />
      <Container
        heading="Prosedur"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias aliquid suscipit odit!"
      >
        <ul className="gap-4 flex flex-col mb-[10rem]">
          {data.map((item, index) => (
            <li key={index}>
              <a
                href={item.filePath}
                className="text-lg hover:underline font-semibold hover:text-primaryYellow transition-colors duration-200 ease-in-out"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
