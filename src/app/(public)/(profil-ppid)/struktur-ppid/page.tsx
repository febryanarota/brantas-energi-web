import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Struktur PPID | PPID Brantas Energi",
};

export default function Page() {
  const image = "/images/struktur.png";

  return (
    <div className="min-h-screen flex flex-col items-center pb-10">
      <Header title={"STRUKTUR PPID"} />

      <Container>
        <Image
          src={image}
          width={1000}
          height={1000}
          alt="Struktur PPID"
          className="w-full h-fit"
        />
      </Container>
    </div>
  );
}
