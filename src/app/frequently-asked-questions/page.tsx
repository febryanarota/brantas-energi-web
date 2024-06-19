'use client'

import Header from "@/components/header/header";
import { Container } from "@/components/ui/container";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { qna } from "@/lib/dataType";

export default function Page() {
    const data : qna[] = [
        {
            a: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet obcaecati nobis asperiores velit totam suscipit numquam?",
            q: "ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet "
        },
        {
            a: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet obcaecati nobis asperiores velit totam suscipit numquam?",
            q: "ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet "
        },
        {
            a: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet obcaecati nobis asperiores velit totam suscipit numquam?",
            q: "ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet "
        },
        {
            a: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet obcaecati nobis asperiores velit totam suscipit numquam?",
            q: "ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet "
        },
        {
            a: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet obcaecati nobis asperiores velit totam suscipit numquam?",
            q: "ipsum dolor sit, amet consectetur adipisicing elit. Provident quaerat placeat consequuntur modi? Assumenda earum est amet "
        },
    ]


    return (
        <div className="mb-10">
            <Header title="Frequently Asked Questions"/>
            <Container>
                <Accordion variant="light">
                    {
                        data.map((item, index) => (
                            <AccordionItem key={index} title={item.q} className="font-medium text-md">
                                <p className="font-normal text-sm pb-10 text-justify">{item.a}</p>
                            </AccordionItem>
                        ))
                    }
                    

                </Accordion>

            </Container>
        </div>
    )
    
};
