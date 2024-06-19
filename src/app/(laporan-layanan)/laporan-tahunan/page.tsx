import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { laporan } from "@/lib/dataType";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laporan Tahunan | PPID Brantas Energi",
};

export default function Page() {
  const dataItem: laporan[] = [
    {
      title: "Laporan Tahunan 2022",
      filePath: "/laporan-tahunan-2022.pdf",
      thumbnail: "/images/thumbnail.jpg",
    },
    {
      title: "Laporan Tahunan 2023",
      filePath: "/laporan-tahunan-2023.pdf",
      thumbnail: "/images/thumbnail.jpg",
    },
    {
      title: "Laporan Tahunan 2024",
      filePath: "/laporan-tahunan-2024.pdf",
      thumbnail: "/images/thumbnail.jpg",
    },
    {
      title: "Laporan Tahunan 2020",
      filePath: "/laporan-tahunan-20220.pdf",
      thumbnail: "/images/thumbnail.jpg",
    },
    {
      title: "Laporan Tahunan 2020",
      filePath: "/laporan-tahunan-20220.pdf",
      thumbnail: "/images/thumbnail.jpg",
    },
    {
      title: "Laporan Tahunan 2020",
      filePath: "/laporan-tahunan-20220.pdf",
      thumbnail: "/images/thumbnail.jpg",
    },
  ];

  return (
    <div className="pb-20">
      <Header title="Laporan Tahunan" />
      <Container>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-10">
          {dataItem.map((item, index) => (
            <div
              className="flex flex-col w-full h-fit items-center"
              key={index}
            >
              <div className="w-full grow aspect-[3/4] hover:cursor-pointer hover:scale-105 transition-transform duration-300">
                <Image
                  src={item.thumbnail}
                  width={300}
                  height={300}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-center">{item.title}</p>
              <Button className="text-white w-fit p-5 bg-sky-900 mt-1">
                Download
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
