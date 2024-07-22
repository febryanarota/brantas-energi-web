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
import { useEffect, useState } from "react";
import CreateCardModal from "./modal/createCardModal";
import { openSync } from "fs";
import { isArraysEq } from "@/lib/utils";
import Home from "@/components/home/home";

export default function FormSection3({
  verified,
  pending,
  role,
  verifiedCards,
  pendingCards,
}: {
  verified: home;
  pending: home;
  role: string;
  verifiedCards: card[];
  pendingCards: card[];
}) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isArraysEq(verified.cards, pending.cards)) {
      setIsPending(true);
    }

    if (verified.heading3 !== pending.heading3) {
      setIsPending(true);
    }

    if (verified.subheading3 !== pending.subheading3) {
      setIsPending(true);
    }
  }, [verified]);

  return (
    <div className="flex flex-col p-5 bg-white rounded-md shadow-sm">
      <p className="font-bold text-primaryBlue mb-4">Section 3</p>

      {isPending ? (
        <RequestPending
          pending={pending}
          pendingCards={pendingCards}
          role={role}
        />
      ) : (
        <CardForm cards={verifiedCards} />
      )}
    </div>
  );
}

const CardForm = ({ cards }: { cards: card[] }) => {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [description, setDescription] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [cardsData, setCardsData] = useState<card[]>(cards);

  const handleOpen = (event: any) => {
    event.preventDefault();
    onOpen();
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(cardsData);
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
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
        <Editor content={description} setContent={setDescription} />
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
                <ModalBody className="max-h-[80vh] overflow-auto pt-5 pb-16">
                  <CreateCardModal onClose={onClose} />
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
          type="submit"
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

const ListComponent = ({
  card,
  isRequest,
}: {
  card: card;
  isRequest?: boolean;
}) => {
  return (
    <div className="w-full bg-slate-100 rounded-md p-2 flex flex-row">
      <div className="w-[5rem] h-[5rem] bg-slate-300 rounded-md overflow-hidden">
        <a
          href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${card.image}`}
          target="_blank"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${card.image}`}
            width={100}
            height={100}
            alt=""
            className="w-full h-full object-cover"
          />
        </a>
      </div>
      <div className="flex flex-col text-sm ml-3 flex-1">
        <a className="font-semibold" href={card.link as string}>
          {card.title}
        </a>
        {/* make description elipsis... */}
        <div
          className="ProseMirror whitespace-pre-line text-sm text-justify"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: card.description as string }}
        />
      </div>
      <div className="ml-auto">
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

const RequestPending = ({
  pending,
  pendingCards,
  role,
}: {
  pending: home;
  pendingCards: card[];
  role: string;
}) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const handleOpen = (event: any) => {
    event.preventDefault();
    onOpen();
  };

  const handleAccept = async (e: any) => {
    e.preventDefault();

    setIsAccepting(true);

    try {
      // POST request to create a new text block
      const response = await fetch("/api/home/section3", {
        method: "PUT",
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }

      setIsAccepting(false); // Set loading state to false
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setIsAccepting(false); // Set loading state to false
    }
  };

  return (
    <div className="space-y-4 border-2 p-2 rounded-md flex flex-col">
      <p className="text-sm  text-gray-500">Request Content</p>
      <div className="text-sm">
        <p className="font-semibold">Heading</p>
        <p>{pending.heading3}</p>
      </div>
      <div className="text-sm">
        <p className="font-semibold">Subheading</p>
        <p>{pending.subheading3}</p>
      </div>
      <div className="flex flex-row justify-between items-center text-sm">
        <p className="font-semibold">Carousel</p>
        <button
          className="hover:bg-slate-300 rounded-full p-1 bg-slate-200"
          onClick={handleOpen}
        >
          <Plus width={20} height={20} />
        </button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
          <ModalContent>
            {(onClose) => (
              <ModalBody className="max-h-[80vh] overflow-auto pt-5 pb-16">
                <CreateCardModal onClose={onClose} />
              </ModalBody>
            )}
          </ModalContent>
        </Modal>
      </div>
      <div className="text-sm space-y-5">
        {pendingCards.map((card, index) => (
          <ListComponent key={index} card={card} isRequest={true} />
        ))}
      </div>
      <div className="space-x-5 self-end place-self-end">
        <Button
          // disabled={isSaving || isAccepting || isRejecting}
          className="px-[1rem] py-[0.5rem] border-1 border-primaryBlue bg-transparent rounded-[0.5rem]"
          // onClick={handleReject}
        >
          {isRejecting
            ? "Processing..."
            : role === "admin"
              ? "Reject"
              : "Cancel"}
        </Button>
        {role === "admin" && (
          <Button
            // disabled={isSaving || isAccepting || isRejecting}
            className="submit-btn"
            onClick={handleAccept}
          >
            {isAccepting ? "Accepting..." : "Accept"}
          </Button>
        )}
      </div>
    </div>
  );
};
