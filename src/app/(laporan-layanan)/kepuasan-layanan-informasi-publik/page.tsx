import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import FormKepuasanLayanan from "./form-kepuasan-layanan";

export default function Page() {
  return (
    <div className="pb-20">
      <Header title="Survei Kepuasan Layanan Informasi" />
      <Container className="flex flex-col items-center">
        <div className="text-sm text-slate-700 mb-10 max-w-2xl">
          <p className="text-justify">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Et aut
            placeat exercitationem.
          </p>
          <p>
            <br />
            Berikut form untuk survei kepuasan layanan informasi.
          </p>
        </div>
        <FormKepuasanLayanan />
      </Container>
    </div>
  );
}
