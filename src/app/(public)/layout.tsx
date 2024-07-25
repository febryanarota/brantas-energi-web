import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Footer from "@/components/footer/footer";
import NavigationBar from "@/components/navbar/navbar";
import { home } from "@prisma/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PPID Brantas Energi",
};

export default async function publicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/home`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-store",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }

  const data: { verified: home; pending: home } = await response.json();
  return (
    <>
      <NavigationBar data={data.verified} />
      <div>{children}</div>
      <Footer data={data.verified} />
    </>
  );
}
