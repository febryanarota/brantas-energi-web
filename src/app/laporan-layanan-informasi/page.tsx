import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { DataItem } from "@/lib/dataType";

export default function Page() {
    const data: DataItem[] = [
        {
          title: "Aplikasi PPID Brantas Energi",
          filePath: "/laporan-layanan-informasi",
        },
        {
          title:
            "Form Permohonan Informasi Publik",
          filePath: "/laporan-layanan-informasi",
        },
        {
          title:
            "Ringkasan Laporan Tahun 2023",
          filePath: "/laporan-layanan-informasi",
        },
        {
          title:
            "Alasan Pemohon Publik Mengajukan Keberatan",
          filePath: "/laporan-layanan-informasi",
        },
        {
          title:
            "Alasan Penolakan Informasi Publik",
          filePath: "/laporan-layanan-informasi",
        },
        {
          title:
            "Alur Permohonan Informasi",
          filePath: "/laporan-layanan-informasi",
        },
      ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header title="Laporan Layanan Informasi" />
            <div className="mt-20">
                <Container>
                    <ul className="gap-4 flex flex-col">
                        {data.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.filePath}
                                    className="hover:underline font-semibold hover:text-primaryYellow transition-colors duration-200 ease-in-out"
                                >
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </Container>
            </div>
        </div>
    )
};
