import { CMSContainer } from "@/components/ui/container";
import FormTrigger from "@/components/forms/forms";

export default function Page() {
    return (
        <div>
            <CMSContainer>
            <div className="flex flex-row justify-between items-center border-b-3 pb-2">
                <h1 className="text-3xl font-bold tracking-widerfle">Regulasi</h1>
                <FormTrigger/>
                {/* the button supposed to be here */}
            </div>
            </CMSContainer>
        </div>
    )
};
