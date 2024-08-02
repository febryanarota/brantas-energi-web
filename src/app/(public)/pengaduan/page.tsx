import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import FormPengaduan from "./form-pengaduan";
import { Metadata } from "next";
import ContentList from "@/components/contentList/content-list";

export const metadata: Metadata = {
  title: "Whistle Blowing System | PPID Brantas Energi",
};

export default function Page() {
  return (
    <div className="pb-20">
      <Header title="Whistle Blowing System" />
      <Container className="flex flex-col items-center">
        <div className="max-w-2xl">
          <ContentList page={"pengaduan"} />
        </div>

        <div className="w-full text-sm mt-4">
          <FormPengaduan />
        </div>
      </Container>
    </div>
  );
}
