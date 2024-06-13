import Header from "@/components/header/header";
import Image from "next/image";

export default function Page() {
    return (
        <div className="min-h-screen flex flex-col items-center pb-10">
            <Header title={'STRUKTUR PPID'}/>

            <div className="w-full max-w-5xl px-[24px]">
                <Image src="/images/struktur.png" width={1000} height={1000} alt="Struktur PPID" className="w-full h-fit"/>
            </div>
        </div>
    )
};
