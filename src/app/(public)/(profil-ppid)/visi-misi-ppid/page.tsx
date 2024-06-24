import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Visi & Misi | PPID Brantas Energi",
};

export default function Page() {
  const visi =
    "Lorem ipsum dolor sit amet consectetur adipisicing Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, adipisci molestiae! Culpa.elit. Ipsum eum sapiente beatae harum numquam aspernatur facere maiores. Velit asperiores sapiente vero in doloribus nam fugit! Ex?";
  const misi = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita architecto quam tempore nemo odit ullam, corrupti facere fugiat?",
    "dolor Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum iure quia facilis! sit amet.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto id soluta illo distinctio deserunt tenetur, aspernatur quam eos eius ex omnis reiciendis!",
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, asperiores.",
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={"Visi & Misi PPID"} />
      <div className="w-full flex flex-col items-center py-10">
        <Container>
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="text-3xl font-bold tracking-wider border-l-3 border-primaryYellow p-2 mb-5">
                Visi
              </h2>
              <p className="text-justify">{visi}</p>
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-wider border-l-3 border-primaryYellow p-2 mb-5">
                Misi
              </h2>
              <ul className="ml-5 text-justify">
                {misi.map((item, index) => (
                  <li key={index} className="mb-1 list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
