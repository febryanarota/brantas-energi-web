import { qna } from "@prisma/client";
import { Check, Pencil, Trash, X } from "lucide-react";

export function deleteButton(id:number) {
    return (
        <button><Trash className="mt-1 hover:bg-red-100 rounded-full  p-1" width={30} height={30}/></button>
    )
}

export function createButton(id:number) {
    return (
        <button><Check className="mt-1 hover:bg-green-100 rounded-full  p-1" width={30} height={30}/></button>
    )
}

export function cancelButton(id:number) {
    return (
        <button><X className="mt-1 hover:bg-gray-100 rounded-full  p-1" width={30} height={30}/></button>
    )
}

export function updateButton(id:number) {
    return (
        <button><Pencil className="mt-1 hover:bg-yellow-100 rounded-full  p-1" width={30} height={30}/></button>
    )
}

export default function FaqContent({content} : {content: qna}) {
    let button;
    switch (content.status) {
        case 'createPending':
            button = 
                <div className="flex flex-row">
                    <div>
                        {createButton(content.id)}
                    </div>
                    <div>
                        {cancelButton(content.id)}
                    </div>
                </div>
            break;
        case 'deletePending':
            button = 
                <div className="flex flex-row">
                    <div>
                        {deleteButton(content.id)}
                    </div>
                    <div>
                        {cancelButton(content.id)}
                    </div>
                </div>
            break;
        case 'updatePending':
            button = 
                <div className="flex flex-row">
                    <div>
                        {updateButton(content.id)}
                    </div>
                    <div>
                        {cancelButton(content.id)}
                    </div>
                </div>
            break;
        default :
            button = deleteButton(content.id)
    }

    return (
        <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col">
                <p>{content.question}</p>
                <p>{content.answer}</p>
            </div>
            {
                button
            }
        </div>
    )
};
