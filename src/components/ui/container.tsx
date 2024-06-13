import React, { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
    className?: string;
    heading?: string;
    description?: string;
    [x: string]: any; // Allow other props
}

export function Container({ children, className = '', heading = '', description, ...props }: ContainerProps) {
    return (
        <div className='w-full flex flex-col items-center py-10'>
            <div className={`w-full max-w-5xl px-[24px] ${className}`} {...props}>
                {
                    heading && 
                    <div className='mb-10 border-l-3 border-primaryYellow p-2 mt-10 '>
                        <h1 className='text-3xl font-bold tracking-wider '>{heading}</h1>
                            
                        {
                            description && (
                                <p className='text-gray-700 max-w-3xl'>{description}</p>
                            )
                        }
                    </div>
                }
                {children}
            </div>
        </div>
    );
}