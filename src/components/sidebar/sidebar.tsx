'use client'

import { useState } from "react";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const handleTrigger = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div>
            {
                isOpen ? 
                <div className="w-[250px]">
                    <button onClick={handleTrigger}>Close</button>
                </div> :
                <div>
                    <button onClick={handleTrigger}>Open</button>
                </div>
            }
        </div>
    )
};
