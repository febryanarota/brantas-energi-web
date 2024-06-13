import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";

export default function Page() {
  const texts = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita architecto quam tempore nemo odit ullam, corrupti facere fugiat?",
    "dolor Lorem ipsum dolor, sit amet consectetur adipisicing elit. Earum iure quia facilis! sit amet.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto id soluta illo distinctio deserunt tenetur, aspernatur quam eos eius ex omnis reiciendis!",
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, asperiores.",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto id soluta illo distinctio deserunt tenetur, aspernatur quam eos eius ex omnis reiciendis!",
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita architecto quam tempore nemo odit ullam, corrupti facere fugiat?",
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Cum, asperiores.",
  ];
  return (
    <div className="min-h-screen flex flex-col items-center pb-32">
      <Header title="Tugas, Fungsi & Wewenang" />
      <Container className="flex flex-col gap-10 items-center">
        <div className="max-w-3xl">
          <h2 className="font-bold">PPID</h2>
          <ul>
            {texts.map((item, index) => (
              <li key={index} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="max-w-3xl">
          <h2 className="font-bold">PPID Pelaksana</h2>
          <ul>
            {texts.map((item, index) => (
              <li key={index} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </div>
  );
}
