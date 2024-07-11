"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { Plus } from "lucide-react";
import { TextForm } from "./text-form";
import { Heading1Form } from "./heading1-form";
import { Heading2Form } from "./heading2-form";
import { ImageForm } from "./image-form";

export default function FormTrigger({
  page,
  session,
}: {
  page: string;
  session: any;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [type, setType] = useState("text");
  const [formBody, setFormBody] = useState<JSX.Element | null>(null);

  useEffect(() => {
    switch (type) {
      case "text":
        setFormBody(
          <TextForm openChange={onOpenChange} page={page} session={session} />,
        );
        break;
      case "heading1":
        setFormBody(
          <Heading1Form
            openChange={onOpenChange}
            page={page}
            session={session}
          />,
        );
        break;
      case "heading2":
        setFormBody(
          <Heading2Form
            openChange={onOpenChange}
            page={page}
            session={session}
          />,
        );
        break;
      case "image":
        setFormBody(
          <ImageForm openChange={onOpenChange} page={page} session={session} />,
        );
        break;
      default:
        setFormBody(
          <TextForm openChange={onOpenChange} page={page} session={session} />,
        );
    }
  }, [type, onOpenChange, page, session]);

  const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };

  return (
    <>
      <button className="bg-primaryYellow rounded-full p-1.5" onClick={onOpen}>
        <Plus />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent className="">
          {(onClose) => (
            <ModalBody className="py-10 px-7 flex flex-col items-center max-h-[80vh] overflow-auto">
              <div className="w-full flex flex-col max-w-2xl">
                <label htmlFor="type" className="label">
                  Block Type
                </label>
                <select
                  name="type"
                  id="type"
                  onChange={handleSelection}
                  className="field"
                >
                  <option value="text" defaultChecked>
                    Text
                  </option>
                  <option value="heading1">Heading 1</option>
                  <option value="heading2">Heading 2</option>
                  <option value="image">Image</option>
                </select>
              </div>
              {formBody}
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
