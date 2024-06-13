import React, { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
    className?: string;
    [x: string]: any; // Allow other props
}

export function Container({ children, className = '', ...props }: ContainerProps) {
    return (
        <div className={`w-full max-w-5xl px-[24px] ${className}`} {...props}>
            {children}
        </div>
    );
}
