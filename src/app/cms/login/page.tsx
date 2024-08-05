"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    setLoading(true);
    const response = await fetch("/api/login", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    if (result.success) {
      router.push("/cms/profile");
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-sky-800">
      <form
        className="flex flex-col items-center bg-white p-10 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="username"
          name="username"
          className="px-3 py-2 border-b-2"
        />
        <br />
        <input
          type="password"
          placeholder="password"
          name="password"
          className="px-3 py-2 border-b-2"
        />
        <br />
        <Button
          type="submit"
          className={`bg-primaryYellow font-extrabold px-10 mt-5`}
          disabled={loading ? true : false}
        >
          {loading ? "Loading" : "Login"}
        </Button>
        {error && !loading && (
          <p className="text-red-500 mt-2 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}
