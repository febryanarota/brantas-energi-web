'use client'
import { qna } from "@prisma/client"
import FaqContent from "./faq-content"
import { useEffect, useState } from "react"
import { cancelButton, createButton, deleteButton, updateButton } from "./buttons"

export default function Content({type, content, deleteHandler} : {type:string, content:any, deleteHandler:Function}) {
    const [status, setStatus] = useState(content.status);
    const [border, setBorder] = useState('border-white');
    const [button, setButton] = useState<JSX.Element | null>(null);


    const [renderContent, setRenderContent] = useState<JSX.Element | null>(null);
    useEffect(() => {
        switch (status) {
            case 'createPending':
                setBorder('border-emerald-400');
                setButton(
                    <div className="flex flex-row">
                        <div>
                            {createButton(content.id, setStatus)}
                        </div>
                        <div>
                            {cancelButton(content.id)}
                        </div>
                    </div>
                )
                break;
            case 'updatePending':
                setBorder('border-yellow-400');
                setButton(
                    <div className="flex flex-row">
                        <div>
                            {updateButton(content.id, setStatus)}
                        </div>
                        <div>
                            {cancelButton(content.id)}
                        </div>
                    </div>
                )
                break;
            case 'deletePending':
                setBorder('border-red-400');
                setButton(
                    <div className="flex flex-row">
                        <div>
                            {deleteButton(content.id, setStatus)}
                        </div>
                        <div>
                            {cancelButton(content.id)}
                        </div>
                    </div>
                );
                break;
            case 'deleted':
                deleteHandler(content.id);
                break;
            default:
                setBorder('border-white');
                setButton(deleteButton(content.id, setStatus))
        }

        switch (type) {
            case 'faq':
                setRenderContent(<FaqContent content={content as qna}/>)
                break;
            default:
                setRenderContent(<div>hi</div>)
        }
    }, [status, type, content, deleteHandler]);

    return (
        <div className={`${border} bg-white shadow-sm w-full h-full border-2 p-5 rounded-md `}>
            <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col">
                {renderContent}
            </div>
            {button}
        </div>
        </div>
    )
};
