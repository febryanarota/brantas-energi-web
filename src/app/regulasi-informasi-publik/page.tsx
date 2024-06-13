import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { DataItem } from "@/lib/dataType";

export default function Page() {
  const data: DataItem[] = [
    {
      title: "Pedoman KIP PPID",
      filePath: "/regulasi-informasi-publik",
    },
    {
      title:
        "Peraturan Komisi Informasi Nomor 1 Tahun 2021 Tentang Standar Layanan Informasi Publik",
      filePath: "/regulasi-informasi-publik",
    },
    {
      title:
        "Peraturan Komisi Informasi Nomor 2 Tahun 2016 Tentang Tata Cara Pemeriksaan Setempat",
      filePath: "/regulasi-informasi-publik",
    },
    {
      title:
        "Peraturan Komisi Informasi Nomor 1 Tahun 2013 Tentang Penyelesaian Sengketa Informasi Publik",
      filePath: "/regulasi-informasi-publik",
    },
    {
      title:
        "Peraturan Pemerintah Republik Indonesia Nomor 61 Tahun 2010 Tentang Pelaksanaan Undang-Undang Nomor 14 Tahun 2008 Tentang Keterbukaan Informasi Publik",
      filePath: "/regulasi-informasi-publik",
    },
  ];

  return (
    <div className="pb-20 min-h-screen">
      <Header title={"Regulasi Informasi Publik"} />
      <div className="flex flex-col items-center">
        <Container>
          <h2 className="text-3xl">
            Peraturan Mengenai <br />
            Keterbukaan Informasi Publik
          </h2>
          <div className="w-[10rem] mb-10 mt-5 border-t-2 border-primaryYellow"></div>

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
  );
}
