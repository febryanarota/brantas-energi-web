import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import FormKepuasanLayanan from "./form-kepuasan-layanan";
import { Metadata } from "next";
import ContentList from "@/components/contentList/content-list";

export const metadata: Metadata = {
  title: "Survei Kepuasan Layanan | PPID Brantas Energi",
};

export default function Page() {
  return (
    <div className="pb-20">
      <Header title="Survei Kepuasan Layanan Informasi" />
      <Container className="flex flex-col items-center">
        <div className="max-w-2xl">
          <ContentList page={"kepuasan-layanan-informasi-publik"} />
        </div>
        <FormKepuasanLayanan />
      </Container>
    </div>
  );
}
