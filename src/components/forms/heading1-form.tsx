"use client";

import React from "react";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { blockType } from "@prisma/client";

export const Heading1Form = ({
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
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission

    if (formData.title === "") {
      setError("Title is required");
      return;
    }
    setIsLoading(true); // Set loading state to true while the form is submitting

    try {
      // POST request to create a new text block
      const response = await fetch("/api/heading1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("API Response Error:", errorResponse);
        throw new Error(
          `Network response was not ok: ${response.status} ${response.statusText}`,
        );
      }

      const result = await response.json();

      // POST request to create a new content block
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
          blockType: "heading1" as blockType,
          heading1Id: result.id,
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

      setIsLoading(false); // Set loading state to false after successful submission
      window.location.reload(); // Reload the page to see the changes
      if (openChange) {
        openChange(); // Close the form
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false); // Set loading state to false in case of error
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl w-full grid place-items-center mx-auto pt-4 mb-10 px-5"
      >
        <div className="flex flex-col w-full gap-5">
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              type="text"
              placeholder="required"
              name="title"
              className="field"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              placeholder="optional"
              name="description"
              className="field h-[10rem] resize-none"
              onChange={handleChange}
            />
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
