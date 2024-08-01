import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import FormPengaduan from "./form-pengaduan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Whistle Blowing System | PPID Brantas Energi",
};

export default function Page() {
  return (
    <div className="pb-20">
      <Header title="Whistle Blowing System" />
      <Container className="flex flex-col items-center">
        <div className="text-sm text-slate-700 mb-10">
          <p className="text-justify max-w-2xl">
            Whistle Blowing System adalah sarana untuk menyampaikan, mengelola
            dan menindaklanjuti laporan mengenai dugaan terjadinya pelanggaran
            yang dilakukan oleh pihak Internal Brantas Energi dan External .
            <br />
            <br />
            Dalam rangka terwujudnya penerapan Tata Kelola yang baik, maka PT
            Brantas Enrgi baik pihak Internal maupun pihak External untuk
            menggunakan jalur pelaporan dugaan pelanggaran di PT Brantas Energi
            melaui Whistle Blowing Sistem (WBS) Sarana Penyampaian Laporan WBS
            yang Independent dan rahasia, meliputi :
            <br />
            <br />
            Telepon/whatsapp/sms : 0811 9922322
            <br />
            Email : wbs@brantas-energi.co.id
            <br />
            Surat : PT Brantas Energi, Jln D.I Panjaitan Kav 14, Cipinang
            Cimpedak, Jatinegara, Cawang, Jakarta Timur 13340
          </p>
        </div>

        <div className="max-w-2xl">
          <div className="text-sm text-slate-700 w-full py-2">
            <p className="text-black font-medium">Kriteria Pelaporan: </p>
            <ol className="list-decimal text-justify ml-10">
              <li>
                Pelanggaran yang dilakukan oleh pihak internal PT Brantas
                Abipraya (Persero) maupun pihak External PT Brantas Abipraya
                (Persero)
              </li>
              <li>
                Jenis Pelanggaran yang dilaporkan adalah Korupsi, Kolusi dan
                Nepotisme,Kecurangan (fraud), termasuk penipuan, penggelapan
                aset, pembocoran informasi,pencurian pembiaran melakukan
                pelanggaran,benturan kepentingan, serta perbuatan melanggar
                hukum dan peraturan Internal PT Brantas Abipraya (Persero)
              </li>
              <li>
                Pelapor merupakan dari pihak Internal PT Brantas Abipraya
                (Persero) dan pihak External PT Brantas Abipraya (Persero)
                (dapat diperbolehkan menggunakan anonim).
              </li>
              <li>Unit,tempat, kejadian dan waktu kejadian.</li>
              <li>Dokumen pendukung dan bukti lainya (bila ada)</li>
            </ol>
          </div>

          <div className="text-sm text-slate-700 w-full py-2">
            <p className="text-black font-medium">
              Jaminan Kerahasianan dan Perlindungan Pelapor:{" "}
            </p>
            <ol className="list-decimal text-justify ml-10">
              <li>PT Brantas Abipraya (Persero) menjamin anonimitas anda.</li>
              <li>
                Penyampaian Identitas Pelapor bersifat opsional dan tidak wajib
                semata- mata untuk keperluan komunikasi pendalaman laporan (bila
                diperlukan).
              </li>
              <li>
                Seluruh Identitas Pribadi dan Substansi Laporan diproteksi oleh
                Mekanisme Enskripsi Data.
              </li>
              <li>
                PT Brantas Abipraya memberikan perlindungan kepada pelapor dari
                segala bentuk ancaman,intimidasi,hukuman atau tindakan tidak
                menyenangkan dari pihak manapun
              </li>
            </ol>
          </div>
        </div>

        <div className="w-full text-sm mt-4">
          <FormPengaduan />
        </div>
      </Container>
    </div>
  );
}
