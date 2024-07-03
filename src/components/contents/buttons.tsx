"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { qna } from "@prisma/client";
import { Trash, Check, X, Pencil } from "lucide-react";
import { FaqEditModal } from "../modals/faq-edit-modal";
import { useEffect, useState } from "react";

export const DeleteButton = ({
  id,
  type,
}: {
  id: number;
  type: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true); // Set loading state to true

    try {
      const res = await fetch(`/api/${type}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: id,
        }),
      });

      if (!res.ok) {
        const errorResponse = await res.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(`Network response was not ok: ${res.status} ${res.statusText}`);
      }

      const result = await res.json();
      if (result) window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Set loading state to false
      onOpenChange(); // Close the modal
    }
  };

  return (
    <>
      <button onClick={onOpen}>
        <Trash
          className="mt-1 hover:bg-red-100 rounded-full p-1"
          width={30}
          height={30}
        />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
        <ModalContent>
          {(onClose) => (
            <ModalBody className="flex flex-col items-center justify-center py-10">
              <p>Are you sure want to delete this?</p>
              <div className="flex flex-row w-full items-center justify-center gap-5 mt-4">
                <Button className="w-md" onClick={onOpenChange} disabled={isLoading}>
                  Cancel
                </Button>
                <Button className="w-md bg-red-300" onClick={handleDelete} disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export const EditButton = ({
  id,
  setStatus,
  type,
}: {
  id: number;
  setStatus: Function;
  type: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modal, setModal] = useState<JSX.Element | null>(null);

  useEffect(() => {
    switch (type) {
      case "faq":
        setModal(<FaqEditModal id={id} />);
        break;
      default:
        setModal(null);
    }
  }, [type]);

  return (
    <>
      <button onClick={onOpen}>
        <Pencil
          className="mt-1 hover:bg-yellow-100 rounded-full p-1"
          width={30}
          height={30}
        />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => <ModalBody>{modal}</ModalBody>}
        </ModalContent>
      </Modal>
    </>
  );
};

export function createButton(id: number, setStatus: Function, api: string) {
  const handleUpdate = async () => {
    console.log("create");
    const res = await fetch(api, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
        status: "verified",
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();
    if (result && result.status) setStatus(result.status);
  };
  return (
    <button onClick={handleUpdate}>
      <Check
        className="mt-1 hover:bg-green-100 rounded-full p-1"
        width={30}
        height={30}
      />
    </button>
  );
}

export function cancelButton(id: number) {
  return (
    <button>
      <X
        className="mt-1 hover:bg-gray-100 rounded-full p-1"
        width={30}
        height={30}
      />
    </button>
  );
}

export function updateButton(id: number, setStatus: Function) {
  const handleUpdate = async () => {
    console.log("update");
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/faq`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
        status: "verified",
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result: qna = await res.json();
    if (result && result.status) setStatus(result.status);
  };

  return (
    <button onClick={handleUpdate}>
      <Check
        className="mt-1 hover:bg-yellow-100 rounded-full p-1"
        width={30}
        height={30}
      />
    </button>
  );
}
