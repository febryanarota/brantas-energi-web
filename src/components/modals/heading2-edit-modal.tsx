"use client";

import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { heading2 } from "@prisma/client";
import { delay } from "@/lib/utils";

export const Heading2EditModal = ({
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
  const [content, setContent] = useState<heading2>();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const startTime = Date.now();
      const timeout = 20000;
      const retryDelay = 1000;

      try {
        const response = await fetch(`/api/heading2/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }

        const data: heading2 = await response.json();
        setContent(data);
        setIsFetching(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (Date.now() - startTime < timeout) {
          await delay(retryDelay);
          return fetchData();
        }
      }
    };

    fetchData();
  }, [id, session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setContent(
      (prevContent) =>
        ({
          ...prevContent,
          [name]: value,
        }) as heading2,
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (content?.title === "") {
      setError("Title must not be empty");
      setIsLoading(false);
      return;
    }

    const role = session.role;
    try {
      if (role !== "admin") {
        const response = await fetch(`/api/heading2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
          body: JSON.stringify({
            title: content?.title,
            description: content?.description,
          }),
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
        const response = await fetch(`/api/heading2/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Cookie: `session=${session}`,
          },
          credentials: "include",
          body: JSON.stringify({
            title: content?.title,
            description: content?.description,
          }),
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
              placeholder={isFetching ? "fetching..." : "required"}
              disabled={isFetching}
              name="title"
              className="field"
              value={content?.title || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col justify-center w-full">
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              placeholder={isFetching ? "fetching..." : "optional"}
              disabled={isFetching}
              name="description"
              className="field h-[10rem] resize-none"
              value={content?.description || ""}
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
            disabled={isLoading || isFetching}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
        {error ? <p className="text-slate-500 text-sm mt-4">{error}</p> : null}
      </form>
    </div>
  );
};
