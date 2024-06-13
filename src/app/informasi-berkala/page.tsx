import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";

export default function Page() {
  return (
    <div>
      <Header title="Informasi Berkala" />
      <Container
        heading="Informasi Berkala"
        description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nobis ducimus officiis voluptatibus explicabo praesentium doloribus. Nisi assumenda iusto illo ex quidem?"
      >
        <p className="text-lg">Informasi Berkala</p>
      </Container>
    </div>
  );
}
