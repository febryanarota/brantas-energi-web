"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import { Button } from "@nextui-org/button";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isInformasiPublikOpen, setIsInformasiPulbikOpen] = useState(false);
  const [isLaporanLayananOpen, setIsLaporanLayananOpen] = useState(false);
  const router = useRouter();

  const handleTrigger = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/logout", {
      method: "POST",
    });

    if (response.ok) {
      router.push("/cms/login");
    } else {
      console.error("Failed to logout");
    }
    setIsLoading(false);
  };

  const handleOpenInformasiPublik = () => {
    closeAll();
    setIsInformasiPulbikOpen(!isInformasiPublikOpen);
  };

  const handleOpenLaporanLayanan = () => {
    closeAll();
    setIsLaporanLayananOpen(!isLaporanLayananOpen);
  };

  const closeAll = () => {
    setIsInformasiPulbikOpen(false);
    setIsLaporanLayananOpen(false);
  };

  return (
    <div className="text-white">
      {isOpen ? (
        <div className="w-[250px] h-full max-h-screen overflow-auto bg-sky-800 py-5 flex flex-col justify-between">
          <div className="flex flex-col">
            <button onClick={handleTrigger} className="self-end px-5">
              <X />
            </button>
            <a href="#" className="sidebar-item ">
              Home
            </a>
            <a href="#" className="sidebar-item">
              Profil
            </a>
            <a href="#" className="sidebar-item">
              Regulasi
            </a>
            <a
              onClick={handleOpenInformasiPublik}
              className="sidebar-item flex flex-row justify-between"
            >
              Informasi Publik
              {isInformasiPublikOpen ? <ChevronUp /> : <ChevronDown />}
            </a>
            {isInformasiPublikOpen && (
              <div className="flex flex-col">
                <a href="#" className="sidebar-item-child">
                  Informasi Publik
                </a>
                <a href="#" className="sidebar-item-child">
                  Informasi Serta Merta
                </a>
                <a href="#" className="sidebar-item-child">
                  Informasi Berkala
                </a>
                <a href="#" className="sidebar-item-child">
                  Informasi Wajib Tersedia
                </a>
              </div>
            )}
            <a
              onClick={handleOpenLaporanLayanan}
              className="sidebar-item flex flex-row justify-between"
            >
              Laporan Layanan
              {isLaporanLayananOpen ? <ChevronUp /> : <ChevronDown />}
            </a>
            {isLaporanLayananOpen && (
              <div className="flex flex-col">
                <a href="#" className="sidebar-item-child">
                  Laporan Layanan Informasi
                </a>
                <a href="#" className="sidebar-item-child">
                  Permohonan Informasi
                </a>
                <a href="#" className="sidebar-item-child">
                  Laporan Tahunan
                </a>
                <a href="#" className="sidebar-item-child">
                  Laporan Keberlanjutan
                </a>
                <a href="#" className="sidebar-item-child">
                  Kepuasan Layanan Informasi Publik
                </a>
              </div>
            )}
            <a href="#" className="sidebar-item">
              Prosedur
            </a>
            <a href="#" className="sidebar-item">
              Pengaduan
            </a>
            <a href="/cms/faq" className="sidebar-item">
              FAQ
            </a>
          </div>

          <form onSubmit={handleLogout}>
            <Button
              type="submit"
              className="bg-sky-900 w-full px-5 rounded-none py-1 text-white font-bold"
              disabled={isLoading ? true : false}
            >
              {isLoading ? "Loading" : "Logout"}
            </Button>
          </form>
        </div>
      ) : (
        <div className="fixed p-5">
          <button onClick={handleTrigger}>
            <Menu className="text-sky-700" />
          </button>
        </div>
      )}
    </div>
  );
}
