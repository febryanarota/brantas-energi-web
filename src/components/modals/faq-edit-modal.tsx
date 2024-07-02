import { FormValues } from "@/lib/dataType";
import { FaqSchema } from "@/lib/validation";
import { Button } from "@nextui-org/button";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { useEffect, useState } from "react";

// get current data and display it on the form

export const FaqEditModal = ({ id }: { id: number }) => {
  const [initialValues, setInitialValues] = useState<FormValues>({
    question: "",
    answer: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/faq/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await response.json();
        setInitialValues({
          question: data.question,
          answer: data.answer,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        // TO DO: Handle error appropriately (e.g. show error message)
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      // Prepare form data
      const formData = {
        question: values.question,
        answer: values.answer,
      };

      // Send PUT request
      const response = await fetch(`/api/faq/${id}`, {
        method: "PUT",
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
    <div>
      <Formik<FormValues>
        initialValues={initialValues}
        validationSchema={FaqSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {(props) => (
          <div>
            <Form className="flex flex-col items-center gap-3">
              <div className="form-group">
                <label htmlFor="question" className="label">
                  Question
                </label>
                <Field
                  as="textarea"
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
                <Field
                  as="textarea"
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
    </div>
  );
};
