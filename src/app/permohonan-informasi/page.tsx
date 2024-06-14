import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import FormPermohonanInformasi from "./form-permohonan-informasi";

export default function Page() {
  return (
    <div className="pb-20">
      <Header title="Permohonan informasi" />
      <Container className="flex flex-col items-center">
        <div className="text-sm text-slate-700 mb-10 max-w-2xl">
          <p className="text-justify">
            Sebagai bagian dari Keterbukaan Informasi Publik (KIP), Brantas
            Abipraya menyediakan wadah khusus untuk memenuhi kebutuhan
            masyarakat akan permintaan data yang lebih komprehensif.{" "}
          </p>
          <p>
            <br />
            Berikut format khusus untuk mempermudah permintaan informasi publik.
          </p>
        </div>
        <FormPermohonanInformasi />
      </Container>
    </div>
  );
}
