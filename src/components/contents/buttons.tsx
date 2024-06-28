import { qna } from "@prisma/client";
import { Trash, Check, X, Pencil } from "lucide-react";

export function deleteButton(id: number, setStatus: Function) {
    const handleDelete = async () => {
        console.log('delete');
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/faq`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                id: id
            })
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const result: qna = await res.json();
        if (result) setStatus('deleted');
    }

    return (
        <button onClick={handleDelete}><Trash className="mt-1 hover:bg-red-100 rounded-full p-1" width={30} height={30} /></button>
    );
}

export function createButton(id: number, setStatus: Function) {
    const handleUpdate = async () => {
        console.log('create');
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/faq`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                id: id,
                status: 'verified'
            })
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const result: qna = await res.json();
        if (result && result.status) setStatus(result.status);
    };
    return (
        <button onClick={handleUpdate}><Check className="mt-1 hover:bg-green-100 rounded-full p-1" width={30} height={30} /></button>
    );
}

export function cancelButton(id: number) {
    return (
        <button><X className="mt-1 hover:bg-gray-100 rounded-full p-1" width={30} height={30} /></button>
    );
}

export function updateButton(id: number, setStatus:Function) {
    const handleUpdate = async () => {
        console.log('update');
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/faq`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                id: id,
                status: 'verified'
            })
        });

        if (!res.ok) {
            throw new Error('Network response was not ok');
        }

        const result: qna = await res.json();
        if (result && result.status) setStatus(result.status);
    };

    return (
        <button onClick={handleUpdate}><Check className="mt-1 hover:bg-yellow-100 rounded-full p-1" width={30} height={30} /></button>
    );
}
