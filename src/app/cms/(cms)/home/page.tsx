import { CMSContainer } from "@/components/ui/container";
import { Button } from "@nextui-org/button";
import FormSection1 from "./form-section-1";
import FormSection2 from "./form-section-2";
import FormSection3 from "./form-section-3";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { card, home } from "@prisma/client";
import FormSection4 from "./form-section-4";

async function getData() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/home`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: { verified: home; pending: home } = await response.json();
  return data;
}

async function getCardData({
  verifiedCardId,
  pendingCardId,
}: {
  verifiedCardId: number[];
  pendingCardId: number[];
}) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/card`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: card[] = await response.json();

  // Filter out the cards that are not in the verifiedCardId and pendingCardId
  const verified = data.filter((card) => verifiedCardId.includes(card.id));
  const pending = data.filter((card) => pendingCardId.includes(card.id));

  return { verified, pending };
}

export default async function Page() {
  const session = await getSession();
  const role = session?.role;

  if (!session) redirect("/cms/login");
  const data = await getData();
  const card = await getCardData({
    verifiedCardId: data.verified.cards,
    pendingCardId: data.pending.cards,
  });

  return (
    <div className="w-full">
      <CMSContainer>
        <div className="flex flex-row justify-between items-center border-b-3 pb-2 mb-5">
          <h1 className="text-3xl font-bold tracking-widerfle">Home</h1>
        </div>

        <div className="flex flex-col mb-5 rounded-md">
          <div className="flex flex-col gap-5 ">
            <FormSection1
              verified={data.verified}
              pending={data.pending}
              role={role}
            />

            <FormSection2
              verified={data.verified}
              pending={data.pending}
              role={role}
            />

            <FormSection3
              verified={data.verified}
              pending={data.pending}
              role={role}
              verifiedCards={card.verified}
              pendingCards={card.pending}
            />

            <FormSection4
              verified={data.verified}
              pending={data.pending}
              role={role}
            />
          </div>
        </div>
      </CMSContainer>
    </div>
  );
}
