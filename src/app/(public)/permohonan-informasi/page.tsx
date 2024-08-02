import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { Metadata } from "next";
import { FormPermohonanInformasi } from "./form-permohonan-informasi";
import ContentList from "@/components/contentList/content-list";

export const metadata: Metadata = {
  title: "Permohonan Informasi | PPID Brantas Energi",
};

export default function Page() {
  return (
    <div className="pb-20">
      <Header title="Permohonan informasi" />
      <Container className="flex flex-col items-center">
        <div className="max-w-2xl">
          <ContentList page={"permohonan-informasi"} />

        </div>
        <FormPermohonanInformasi />
      </Container>
    </div>
  );
}
