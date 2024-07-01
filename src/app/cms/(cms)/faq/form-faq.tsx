"use client";

import { FaqSchema } from "@/lib/validation";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from "@nextui-org/react";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { Plus } from "lucide-react";

// Define the form values interface
interface FormValues {
  question: string;
  answer: string;
}

export default function FormFaq() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>
  ) => {
    try {
      // Sanitize inputs

      // Prepare form data
      const formData = {
        question: values.question,
        answer: values.answer,
      };

      // Send POST request
      const response = await fetch("/api/faq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 200) {
        // refresh the page
        window.location.reload();
      } else {
        throw new Error("Failed to submit the form");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      // Show error message
      alert("Failed to submit the form");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button className="bg-primaryYellow rounded-full p-1.5" onClick={onOpen}>
        <Plus />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <ModalBody className="py-10 px-7">
              <Formik<FormValues>
                initialValues={{
                  question: "",
                  answer: "",
                }}
                validationSchema={FaqSchema}
                onSubmit={handleSubmit}
              >
                {(props) => (
                  <div>
                    <Form className="flex flex-col items-center gap-3">
                      <div className="form-group">
                        <label htmlFor="question" className="label">Question</label>
                        <Field as="textarea"
                          name="question"
                          placeholder="Enter Question"
                          autoComplete="off"
                          className="field"
                        />
                        <ErrorMessage
                          component="div"
                          name="question"
                          className="invalid-feedback"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="answer" className="label">
                          Answer
                        </label>
                        <Field as="textarea"
                          name="answer"
                          placeholder="Enter answer"
                          className="field"
                        />
                        <ErrorMessage
                          component="div"
                          name="answer"
                          className="invalid-feedback"
                        />
                      </div>

                      <Button
                        type="submit"
                        className="submit-btn"
                        disabled={props.isSubmitting}
                      >
                        {props.isSubmitting ? "Submitting..." : "Submit"}
                      </Button>
                    </Form>
                  </div>
                )}
              </Formik>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
