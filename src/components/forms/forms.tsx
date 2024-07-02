"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { Button, Modal, ModalBody, ModalContent, useDisclosure } from "@nextui-org/react";
import { Plus } from "lucide-react";
import { TextForm } from "./text-form";

export default function FormTrigger() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [type, setType] = useState("text");
  const [formBody, setFormBody] = useState<JSX.Element | null>(null);

  useEffect(() => {
    switch (type) {
      case "text":
        setFormBody(<TextForm openChange={onOpenChange} />);
        break;
      case "header":
        setFormBody(<Header />);
        break;
      default:
        setFormBody(<TextForm openChange={onOpenChange} />);
    }
  }, [type, onOpenChange]);

  const handleSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
  };

  return (
    <>
      <button className="bg-primaryYellow rounded-full p-1.5" onClick={onOpen}>
        <Plus />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <ModalBody className="py-10 px-7 flex flex-col items-center">
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
                  <option value="header">Header</option>
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

const Header = () => {
  return <div>Header Form</div>;
};
