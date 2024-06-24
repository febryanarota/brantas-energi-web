import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Page() {
    // const session = await getSession();
    // if (!session) redirect('/cms/login');
    
    return (
        <div>
            CMS Page
        </div>
    )
};
