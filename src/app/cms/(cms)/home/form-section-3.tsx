"use client";

import { Editor } from "@/components/editor/Editor";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { card, home } from "@prisma/client";
import { Pencil, Plus, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import CreateCardModal from "./modal/createCardModal";

export default function FormSection3({
  verified,
  pending,
  role,
  cards,
}: {
  verified: home;
  pending: home;
  role: string;
  cards: card[];
}) {
  const [isPending, setIsPending] = useState(false);

  console.log(cards);

  return (
    <div className="flex flex-col p-5 bg-white rounded-md shadow-sm">
      <p className="font-bold text-primaryBlue mb-4">Section 3</p>

      {isPending ? <RequestPending /> : <CardForm cards={cards} />}
    </div>
  );
}

const CardForm = ({ cards }: { cards: card[] }) => {
  const [description3, setDescription3] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [cardsData, setCardsData] = useState<card[]>(cards);

  const handleOpen = (event: any) => {
    event.preventDefault();
    onOpen();
  };

  return (
    <form className="flex flex-col gap-3">
      <div className="flex flex-col justify-center w-full">
        <label htmlFor="Heading3" className="label text-sm">
          Heading
        </label>
        <input
          type="text"
          name="heading3"
          className="field"
          // onChange={(e) => setSubHeading3(e.target.value)}
          // value={heading3}
        />
      </div>
      <div className="flex flex-col justify-center w-full">
        <label htmlFor="description3" className="label text-sm">
          Description
        </label>
        <Editor content={description3} setContent={setDescription3} />
      </div>
      <div className="flex flex-col justify-center w-full">
        <div className="flex flex-row justify-between items-center py-2">
          <p className="label text-sm">Carousel</p>
          <button
            className="hover:bg-slate-300 rounded-full p-1 bg-slate-200"
            onClick={handleOpen}
          >
            <Plus width={20} height={20} />
          </button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
              {(onClose) => (
                <ModalBody>
                  <CreateCardModal />
                </ModalBody>
              )}
            </ModalContent>
          </Modal>
        </div>
        <div className="w-full border-1 border-slate-200 rounded-md p-2 space-y-2">
          {cardsData.map((card, index) => (
            <ListComponent key={index} card={card} />
          ))}
        </div>

        <Button
          // type="submit"
          className="submit-btn self-end mt-0 mr-2"
          // disabled={isSaving || isAccepting || isRejecting}
        >
          {/* {isSaving ? "Saving..." : "Save"} */}
          Save
        </Button>
      </div>
    </form>
  );
};

const ListComponent = ({ card }: { card: card }) => {
  return (
    <div className="w-full bg-slate-100 rounded-md p-2 flex flex-row">
      <div className="w-[5rem] h-[5rem] bg-slate-300 rounded-md overflow-hidden">
        <a href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${card.image}`} target="_blank">
          <Image src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${card.image}`} width={100} height={100} alt="" className="w-full h-full object-cover"/>
        </a>
      </div>
      <div className="flex flex-col text-sm ml-3 flex-1">
        <a className="font-semibold" href={card.link as string}>{card.title}</a>
        {/* make description elipsis... */}
        <div
          className="ProseMirror whitespace-pre-line text-sm text-justify"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: card.description as string }}
        />
      </div>
      <div className="ml-auto">
        <button>
          <Pencil
            className="mt-1 hover:bg-yellow-100 rounded-full p-1"
            width={30}
            height={30}
          />
        </button>
        <button>
          <Trash
            className="mt-1 hover:bg-red-100 rounded-full p-1"
            width={30}
            height={30}
          />
        </button>
      </div>
    </div>
  );
};

const RequestPending = () => {
  return <div>pending</div>;
};
