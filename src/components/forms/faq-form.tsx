"use client";

import { useEffect, useState } from "react";
import { Editor } from "../editor/Editor";
import { Button } from "@nextui-org/button";
import { blockType } from "@prisma/client";

export const FaqForm = ({
  openChange,
  page,
  session,
}: {
  openChange?: () => void;
  page: string;
  session: any;
}) => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (question === "") {
      setError("Question is required");
      setIsLoading(false);
      return;
    }

    if (answer === "") {
      setError("Answer is required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("question", question);
    formData.append("answer", answer);

    try {
      const response = await fetch("/api/faq", {
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

      const result = await response.json();

      let status = "createPending";
      if (session.role === "admin") {
        status = "verified";
      }

      const contentResponse = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blockType: "faq" as blockType,
          faqId: result.id,
          position: result.id,
          page: page,
          status: status,
        }),
      });

      if (!contentResponse.ok) {
        const errorResponse = await contentResponse.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${contentResponse.status} ${contentResponse.statusText}`,
        );
      }

      const contentResult = await contentResponse.json();

      await fetch(`/api/page/${page}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Cookie: `session=${session}`,
        },
        credentials: "include",
        body: JSON.stringify({
          positions: [contentResult.id],
        }),
      });

      setIsLoading(false);
      window.location.reload();
      if (openChange) {
        openChange();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
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
