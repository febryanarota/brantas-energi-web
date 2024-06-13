import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";

export default function Page() {
    return (
        <div>
            <Header title="Informasi Wajib Tersedia"/>
            <Container heading="Informasi Wajib Tersedia" >
                <p className="text-lg">
                    Informasi Wajib Tersedia
                </p>
            </Container>
        </div>
    )
};
