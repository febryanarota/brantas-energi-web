import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css"; // Import global styles
import { Providers } from "@/app/providers";
import Footer from "@/components/footer/footer";

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
    <div className={`${inter.className} min-w-screen w-full max-w-screen overflow-x-hidden`}>
        <Providers>
          {children}a
          <div>test layout</div>
        </Providers>
    </div>
  );
}
