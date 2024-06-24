import { getSession, login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Page() {
    // const session = await getSession();
    // if (session) redirect('/cms');

    return (
        <div>
            test
            {/* <form 
                action = {async (formData) => {
                    'use server';
                    await login(formData);
                    redirect('/dashboard/login');
                }}>
                    <input type="text" placeholder="username" name="username"/>
                    <br />
                    <input type="text" placeholder="password" name="password"/>
                    <br />
                    <button type="submit">Login</button>
            </form>
            <form 
                action={async () => {
                    'use server';  
                    await logout();
                    redirect('/dashboard/login');
                }}>
                    <button type="submit">Logout</button>
            </form> */}
            {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
        </div>
    )
    
};
