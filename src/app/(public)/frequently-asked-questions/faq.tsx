'use client'

import Header from "@/components/header/header"
import { Container } from "@/components/ui/container"
import { qna } from "@/lib/dataType"
import { Accordion, AccordionItem } from "@nextui-org/react"

export default function Faq({data} : {data: qna[]}) {

    return (
        <div className="mb-10">
            <Header title="Frequently Asked Questions"/>
            <Container>
                <Accordion variant="light">
                    {
                        data.map((item, index) => (
                            <AccordionItem key={index} title={item.question} className="font-medium text-md">
                                <p className="font-normal text-sm pb-10 text-justify">{item.answer}</p>
                            </AccordionItem>
                        ))
                    }
                    

                </Accordion>

            </Container>
        </div>
    )
};
