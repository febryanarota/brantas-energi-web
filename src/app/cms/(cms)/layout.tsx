import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css"; // Import global styles
import Footer from "@/components/footer/footer";
import Sidebar from "@/components/sidebar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CMS | PPID Brantas Energi",
};

export default function CmsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={`${inter.className} min-w-screen w-full max-w-screen  flex flex-row relative`}
    >
      <Sidebar />
      <div className="bg-slate-200 grow h-full min-h-screen max-h-screen overflow-auto py-10 px-5">
        {children}
      </div>
    </div>
  );
}
