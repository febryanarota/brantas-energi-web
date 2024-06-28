import { qna } from "@prisma/client";

export default function FaqContent({ content }: { content: qna}) {    
    return (
        <div>
            <p>{content.question}</p>
            <p>{content.answer}</p>
        </div>
    );
}
