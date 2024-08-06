"use client";

import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { card, home } from "@prisma/client";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import CreateCardModal from "../../../../components/modals/createCardModal";
import { isArraysEq } from "@/lib/utils";
import { ListComponent } from "@/components/card/cardList";
import { useToast } from "@/components/ui/use-toast";

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
        <CardForm verified={verified} cards={verifiedCards} role={role} />
      )}
    </div>
  );
}

const CardForm = ({
  cards,
  verified,
  role,
}: {
  cards: card[];
  verified: home;
  role: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [heading3, setHeading3] = useState(verified.heading3);
  const [subHeading3, setSubHeading3] = useState(verified.subheading3);

  const cardsData : card[] = cards
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  const handleOpen = (event: any) => {
    event.preventDefault();
    onOpen();
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setIsSaving(true);

    if (!heading3 || !subHeading3) {
      setError("Please fill in all fields");
      setIsSaving(false);
      return;
    }

    const formData = new FormData();
    formData.append("heading3", heading3);
    formData.append("subheading3", subHeading3);

    const response = await fetch("/api/home/section3", {
      method: "PATCH",
      body: formData,
    });

    setIsSaving(false);
    if (response) {
      toast({
        title: "Success!",
        description: "Section 3 has been updated successfully",
      });
    } else {
      setError("Failed to save changes");
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to update Section 3",
      });
    }
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
          onChange={(e) => setHeading3(e.target.value)}
          value={heading3}
        />
      </div>
      <div className="flex flex-col justify-center w-full">
        <label htmlFor="Subheading3" className="label text-sm">
          Subheading
        </label>
        <input
          type="text"
          name="Subheading3"
          className="field"
          onChange={(e) => setSubHeading3(e.target.value)}
          value={subHeading3}
        />
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
            <ListComponent key={index} card={card} role={role} />
          ))}
        </div>

        <Button
          type="submit"
          className="submit-btn self-end mt-0 mr-2"
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
        {error && <p className="self-end mr-2 mt-2 text-gray-500">{error}</p>}
      </div>
    </form>
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleOpen = (event: any) => {
    event.preventDefault();
    onOpen();
  };

  const handleAccept = async (e: any) => {
    e.preventDefault();

    setIsAccepting(true);

    try {
      // POST request to create a new text block
      const response = await fetch("/api/home/section3/accept", {
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

  const handleCancel = async (e: any) => {
    e.preventDefault();

    setIsRejecting(true);

    try {
      // POST request to create a new text block
      const response = await fetch("/api/home/section3/reject", {
        method: "PUT",
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }

      setIsRejecting(false); // Set loading state to false
      window.location.reload();
    } catch (error) {
      console.error("Error:", error);
      setIsRejecting(false); // Set loading state to false
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
        {role === "user" && (
          <div>
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
        )}
      </div>
      <div className="text-sm space-y-5">
        {pendingCards.map((card, index) => (
          <ListComponent key={index} card={card} isRequest={true} role={role} />
        ))}
      </div>
      <div className="space-x-5 self-end place-self-end">
        <Button
          // disabled={isSaving || isAccepting || isRejecting}
          className="px-[1rem] py-[0.5rem] border-1 border-primaryBlue bg-transparent rounded-[0.5rem]"
          onClick={handleCancel}
        >
          {isRejecting
            ? "Processing..."
            : role === "admin"
              ? "Reject"
              : "Cancel"}
        </Button>
        {role === "admin" && (
          <Button
            disabled={isAccepting || isRejecting}
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
