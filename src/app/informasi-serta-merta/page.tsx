import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { DataItem } from "@/lib/dataType";

const dataItem : DataItem [] = [
    {
        title: "Rilis berita",
        filePath: "/informasi-serta-merta"
    },
    {
        title: "Twitter",
        filePath: "https://x.com"
    },
    {
        title: "Instagram",
        filePath: "https://instagram.com"
    },
    {
        title: "Facebook",
        filePath: "https://facebook.com"
    },
    {
        title: "Youtube",
        filePath: "https://youtube.com"
    },

]

export default function Page() {
    return (
        <div className="pb-20">
            <Header title="Informasi Serta Merta"/>
            <Container 
                heading="Informasi Serta Merta"
                description=" Molestias aliquid suscipit odit! Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias aliquid suscipit odit!"
                >
                <div>
                    <table className="text-left w-full">
                        <thead>
                            <tr className="border-b-2">
                                <th className="w-[3rem]">No</th>
                                <th className="">Title</th>
                                <th>Link</th>
                            </tr>
                        </thead>
                        <tbody >
                            {
                                dataItem.map((item, index) => (
                                    <tr className="border-b-1 border-slate-100 " key={index}>
                                        <td>{index + 1}</td>
                                        <td>{item.title}</td>
                                        <td><a href={item.filePath} target="_blank" className="hover:text-primaryYellow hover:underline transition-colors duration-400 ease-in-out">Selengkapnya</a></td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </Container>
        </div>
    )
};
