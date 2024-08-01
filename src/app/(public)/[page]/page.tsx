import ContentList from "@/components/contentList/content-list";
import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { CMS_PAGES, DataItem } from "@/lib/dataType";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "PPID Brantas Energi",
};

export default function Page(context: { params: { page: string } }) {

  const page = context.params.page as string;
  const title = page.replace(/-/g, " ").toUpperCase();
  if (!CMS_PAGES.includes(page)) {
    redirect("/")
  }

  return (
    <div className="pb-20 min-h-screen">
      <Header title={title} />
      <div className="flex flex-col items-center">
        <Container>
          <ContentList page={page} />
        </Container>
      </div>
    </div>
  );
}
