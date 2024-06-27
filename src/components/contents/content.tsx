import { qna } from "@prisma/client"
import FaqContent from "./faq-content"

export default function Content({type, content} : {type:string, content:any}) {

    const renderContent = (type: string) => {
        switch (type) {
            case 'faq':
                return <FaqContent content={content as qna} />
            // case 'image':
            //     return <Image content={content} />
            // case 'video':
            //     return <Video content={content} />
            default:
                return <div>hi</div>
        }
    }

    let background;
    switch (content.status) {
        case 'createPending':
            background = 'border-emerald-400'
            break;
        case 'updatePending':
            background = 'border-yellow-400'
            break;
        case 'deletePending':
            background = 'border-red-400'
            break;
        default:
            background = 'border-white'
    }

    return (
        <div className={`${background} bg-white shadow-sm w-full h-full border-2 p-5 rounded-md `}>
            {renderContent(type)}
        </div>
    )
};
