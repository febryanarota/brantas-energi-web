import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { DataItem } from "@/lib/dataType";

export default function Page() {
  const data: DataItem[] = [
    {
      title: "Informasi Dikecualikan",
      filePath: "/informasi-publik",
    },
    {
      title: "Daftar Informasi Publik",
      filePath: "/informasi-publik",
    },
  ];

  return (
    <div className="">
      <Header title="Informasi Publik" />
      <Container
        heading="Informasi Publik"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias aliquid suscipit odit!"
      >
        <ul className="gap-4 flex flex-col mb-[10rem]">
          {data.map((item, index) => (
            <li key={index}>
              <a
                href={item.filePath}
                className="text-lg hover:underline font-semibold hover:text-primaryYellow transition-colors duration-200 ease-in-out"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
