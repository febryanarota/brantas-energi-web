"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { Trash, Check, X, Pencil } from "lucide-react";
import { FaqEditModal } from "../modals/faq-edit-modal";
import { useEffect, useState } from "react";
import { TextEditModal } from "../modals/text-edit-modal";
import { contentBlock } from "@prisma/client";
import { Heading1EditModal } from "../modals/heading1-edit-modal";
import { Heading2EditModal } from "../modals/heading2-edit-modal";
import { ImageEditModal } from "../modals/image-edit-modal";
import { FileEditModal } from "../modals/file-edit-modal";
import { FileImageEditModal } from "../modals/file-image-edit-modal";
``
export const DeleteButton = ({
  id,
  setStatus,
  type,
  session,
  blockId,
}: {
  id: number;
  setStatus: Function;
  type: string;
  session: any;
  blockId: number;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = async () => {
    setIsLoading(true); // Set loading state to true

    const role = session.role;

    try {
      if (role === "admin") {
        const res = await fetch(`/api/${type}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
          credentials: "include",
          body: JSON.stringify({
            id: id,
          }),
        });

        if (!res.ok) {
          const errorResponse = await res.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${res.status} ${res.statusText}`,
          );
        }
      } else {
        const res2 = await fetch(`/api/content/${blockId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            id: id,
            status: "deletePending",
          }),
        });

        if (!res2.ok) {
          throw new Error("Network response was not ok");
        }
      }

      window.location.reload();
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
                <Button
                  className="w-md"
                  onClick={onOpenChange}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  className="w-md bg-red-300"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
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
  session,
  blockId,
}: {
  id: number;
  setStatus: Function;
  type: string;
  session: any;
  blockId: number;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modal, setModal] = useState<JSX.Element | null>(null);

  useEffect(() => {
    switch (type) {
      case "faq":
        setModal(
          <FaqEditModal
            openChange={onOpenChange}
            session={session}
            id={id}
            blockId={blockId}
          />,
        );
        break;
      case "text":
        setModal(
          <TextEditModal
            openChange={onOpenChange}
            session={session}
            id={id}
            blockId={blockId}
          />,
        );
        break;
      case "heading1":
        setModal(
          <Heading1EditModal
            openChange={onOpenChange}
            session={session}
            id={id}
            blockId={blockId}
          />,
        );
        break;
      case "heading2":
        setModal(
          <Heading2EditModal
            openChange={onOpenChange}
            session={session}
            id={id}
            blockId={blockId}
          />,
        );
        break;
      case "image":
        setModal(
          <ImageEditModal
            openChange={onOpenChange}
            session={session}
            id={id}
            blockId={blockId}
          />,
        );
        break;
      case "file":
        setModal(
          <FileEditModal
            openChange={onOpenChange}
            session={session}
            id={id}
            blockId={blockId}
          />,
        );
        break;
      case "fileImageBuffer":
        setModal(
          <FileImageEditModal
            openChange={onOpenChange}
            session={session}
            id={id}
            blockId={blockId}
          />,
        );
        break;
      default:
        setModal(null);
    }
  }, [type, blockId, id, onOpenChange, session]);

  return (
    <>
      <button onClick={onOpen}>
        <Pencil
          className="mt-1 hover:bg-yellow-100 rounded-full p-1"
          width={30}
          height={30}
        />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <ModalBody className="max-h-[80vh] overflow-auto">
              {modal}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export const ConfirmButton = ({
  setStatus,
  type,
  session,
  blockId,
}: {
  setStatus: Function;
  type: string;
  session: any;
  blockId: number;
}) => {
  const handleUpdate = async () => {
    const res = await fetch(`/api/content/${blockId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
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
};

export const ConfirmEditButton = ({
  id,
  setStatus,
  session,
  block,
}: {
  id: number;
  setStatus: Function;
  session: any;
  block: contentBlock;
}) => {
  const handleUpdate = async () => {
    let editIdKey;

    switch (block.blockType) {
      case "faq":
        editIdKey = "faqId";
        break;
      case "text":
        editIdKey = "textId";
        break;
      case "heading1":
        editIdKey = "heading1Id";
        break;
      case "heading2":
        editIdKey = "heading2Id";
        break;
      case "image":
        editIdKey = "imageId";
        break;
      case "file":
        editIdKey = "fileId";
        break;
      default:
        editIdKey = "editId";
    }

    let requestBody: { status: string; [key: string]: any } = {
      status: "verified",
      editId: null,
    };
    requestBody[editIdKey] = block.editId;

    const res = await fetch(`/api/content/${block.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    

    const res2 = await fetch(`/api/${block.blockType}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`,
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
      }),
    });

    const result = await res2.json();
    if (result) window.location.reload();
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
};

export const CancelButton = ({
  id,
  setStatus,
  type,
  session,
  blockId,
}: {
  id: number;
  setStatus: Function;
  type: string;
  session: any;
  blockId: number;
}) => {
  const handleCancel = async () => {
    const res = await fetch(`/api/${type}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`,
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await res.json();
    if (result) window.location.reload();
  };

  return (
    <button onClick={handleCancel}>
      <X
        className="mt-1 hover:bg-gray-100 rounded-full p-1"
        width={30}
        height={30}
      />
    </button>
  );
};

export const CancelDeleteButton = ({
  id,
  setStatus,
  type,
  session,
  blockId,
}: {
  id: number;
  setStatus: Function;
  type: string;
  session: any;
  blockId: number;
}) => {
  const handleCancel = async () => {
    const res = await fetch(`/api/content/${blockId}`, {
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
    <button onClick={handleCancel}>
      <X
        className="mt-1 hover:bg-gray-100 rounded-full p-1"
        width={30}
        height={30}
      />
    </button>
  );
};

export const CancelEditButton = ({
  id,
  setStatus,
  session,
  block,
}: {
  id: number;
  setStatus: Function;
  session: any;
  block: contentBlock;
}) => {
  const handleCancel = async () => {
    const res = await fetch(`/api/content/${block.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        status: "verified",
        editId: null,
      }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const res2 = await fetch(`/api/${block.blockType}/${block.editId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`,
      },
      credentials: "include",
      body: JSON.stringify({
        id: id,
      }),
    });

    const result = await res2.json();
    if (result) window.location.reload();
  };

  return (
    <button onClick={handleCancel}>
      <X
        className="mt-1 hover:bg-gray-100 rounded-full p-1"
        width={30}
        height={30}
      />
    </button>
  );
};
