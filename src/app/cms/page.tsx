import { getSession, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getSession();
    if (!session) {
        redirect('/cms/login');
    } else {
        redirect('/cms/profile');
    }
    
    return (
        <div>
            CMS Page
            <form 
                action={async () => {
                    'use server';  
                    await logout();
                    redirect('/cms');
                }}>
                    <button type="submit">Logout</button>
            </form>
        </div>
    )
};