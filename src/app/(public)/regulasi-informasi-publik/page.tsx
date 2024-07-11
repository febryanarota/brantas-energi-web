import ContentList from "@/components/contentList/content-list";
import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { DataItem } from "@/lib/dataType";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regulasi | PPID Brantas Energi",
};

export default function Page() {
  return (
    <div className="pb-20 min-h-screen">
      <Header title={"Regulasi Informasi Publik"} />
      <div className="flex flex-col items-center">
        <Container>
          <ContentList page="regulasi" />
        </Container>
      </div>
    </div>
  );
}
