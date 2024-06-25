import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '../globals.css'
import Footer from "@/components/footer/footer";
import NavigationBar from "@/components/navbar/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PPID Brantas Energi",
};

export default function publicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        <NavigationBar />
        <div>{children}</div>
        <Footer />
    </>
  );
}
