'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter for redirection

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const router = useRouter();

    const handleTrigger = () => {
        setIsOpen(!isOpen);
    }

    const handleLogout = async (event : React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const response = await fetch('/api/logout', {
            method: 'POST',
        });

        if (response.ok) {
            router.push('/cms/login'); // Redirect to /cms on successful logout
        } else {
            console.error('Failed to logout');
        }
    }

    return (
        <div>
            {isOpen ? (
                <div className="w-[250px]">
                    <button onClick={handleTrigger}>Close</button>
                    <form onSubmit={handleLogout}>
                        <button type="submit">Logout</button>
                    </form>
                </div>
            ) : (
                <div>
                    <button onClick={handleTrigger}>Open</button>
                </div>
            )}
        </div>
    );
}
