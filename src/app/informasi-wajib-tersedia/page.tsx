import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { DataItem } from "@/lib/dataType";

export default function Page() {
  const dataItem : DataItem[] = [
    {
      title: "Harga Perkiraan Sendiri (HPS)",
      filePath: ""
    },
    {
      title: "Tahapan Proses Tender/Seleksi Umum",
      filePath: ""
    },
    {
      title: "Rencana Umum Pengadaan (RUP) tender/seleksi umum status belum dimulai",
      filePath: ""
    },
    {
      title: "Registrasi Rekanan",
      filePath: ""
    }
  ]


  return (
    <div className="pb-20">
      <Header title="Informasi Wajib Tersedia" />
      <Container
        heading="Informasi Wajib Tersedia"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nobis ducimus officiis voluptatibus explicabo praesentium doloribus. Nisi assumenda iusto illo ex quidem?"
      >
        <table className="text-left w-full text-slate-700 text-sm">
            <thead>
              <tr className="border-b-2">
                <th className="w-[3rem]">No</th>
                <th className="">Title</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>
              {dataItem.map((item, index) => (
                <tr className="border-b-1 border-slate-100 " key={index}>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>
                    <a
                      href={item.filePath}
                      target="_blank"
                      className="hover:text-primaryYellow hover:underline transition-colors duration-400 ease-in-out"
                    >
                      Selengkapnya
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </Container>
    </div>
  );
}
