import { Button } from "@nextui-org/button";
import { useEffect, useState } from "react";
import { Editor } from "../editor/Editor";

// get current data and display it on the form

export const FaqEditModal = ({
  openChange,
  session,
  id,
  blockId,
}: {
  openChange?: () => void;
  session: any;
  id: number;
  blockId: number;
}) => {
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        setAnswer(data.answer);
        setQuestion(data.question);
      } catch (error) {
        console.error("Error fetching data:", error);
        // TO DO: Handle error appropriately (e.g. show error message)
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (question === "") {
      setError("Question must not be empty");
      setIsLoading(false);
      return;
    }

    if (answer === "") {
      setError("Answer must not be empty");
      setIsLoading(false);
      return;
    }

    const role = session.role;

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);

    try {
      if (role !== "admin") {
        const response = await fetch(`/api/faq`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }

        let editId = await response.json();
        editId = editId.id;

        const response2 = await fetch(`/api/content/${blockId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            editId: editId,
            status: "updatePending",
          }),
        });

        if (!response2.ok) {
          const errorResponse = await response2.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${response2.status} ${response2.statusText}`,
          );
        }
      } else {
        const response = await fetch(`/api/faq/${id}`, {
          method: "PUT",
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.text();
          console.error("API Response Error:", errorResponse);
          throw new Error(
            `Network response was not ok: ${response.status} ${response.statusText}`,
          );
        }
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      if (openChange) {
        openChange();
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full grid place-items-center mx-auto pt-4 mb-10 px-5"
      >
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="question" className="label">
              Question
            </label>
            <input
              type="text"
              className="field"
              name="question"
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="answer" className="label">
              Answer
            </label>
            <Editor content={answer} setContent={setAnswer} />
          </div>
        </div>

        <div className="flex flex-row items-center justify-center gap-5">
          <Button
            type="button"
            className="cancel-btn"
            onClick={() => {
              if (openChange) {
                openChange();
              }
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="submit-btn self-end"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        {error ? <p className="text-slate-500 text-sm mt-4">{error}</p> : null}
      </form>
    </div>
  );
};
