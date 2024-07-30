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
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFormsOpen, setIsFormsOpen] = useState(false);
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

  const handleOpenProfile = () => {
    closeAll();
    setIsProfileOpen(!isProfileOpen);
  };

  const handleOpenForms = () => {
    closeAll();
    setIsFormsOpen(!isFormsOpen);
  }

  const closeAll = () => {
    setIsInformasiPulbikOpen(false);
    setIsLaporanLayananOpen(false);
    setIsProfileOpen(false);
    setIsFormsOpen(false);
  };

  return (
    <div className="text-white">
      {isOpen ? (
        <div className="w-[250px] h-full max-h-screen overflow-auto bg-sky-800 py-5 flex flex-col justify-between">
          <div className="flex flex-col">
            <button onClick={handleTrigger} className="self-end px-5">
              <X />
            </button>
            <a href="/cms/home" className="sidebar-item ">
              Home
            </a>
            <a
              className="sidebar-item flex flex-row justify-between"
              onClick={handleOpenProfile}
            >
              Profile
              {isProfileOpen ? <ChevronUp /> : <ChevronDown />}
            </a>
            {isProfileOpen && (
              <div className="flex flex-col">
                <a href="/cms/struktur-ppid" className="sidebar-item-child">
                  Struktur PPID
                </a>
                <a href="/cms/visi-misi-ppid" className="sidebar-item-child">
                  Visi & Misi PPID
                </a>
                <a
                  href="/cms/tugas-fungsi-wewenang"
                  className="sidebar-item-child"
                >
                  Tugas, Fungsi, dan Wewenang
                </a>
              </div>
            )}
            <a href="/cms/regulasi" className="sidebar-item">
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
                <a href="/cms/informasi-publik" className="sidebar-item-child">
                  Informasi Publik
                </a>
                <a
                  href="/cms/informasi-serta-merta"
                  className="sidebar-item-child"
                >
                  Informasi Serta Merta
                </a>
                <a href="/cms/informasi-berkala" className="sidebar-item-child">
                  Informasi Berkala
                </a>
                <a
                  href="/cms/informasi-wajib-tersedia"
                  className="sidebar-item-child"
                >
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
                <a
                  href="/cms/laporan-layanan-informasi"
                  className="sidebar-item-child"
                >
                  Laporan Layanan Informasi
                </a>
                <a
                  href="/cms/permohonan-informasi"
                  className="sidebar-item-child"
                >
                  Permohonan Informasi
                </a>
                <a href="/cms/laporan-tahunan" className="sidebar-item-child">
                  Laporan Tahunan
                </a>
                <a
                  href="/cms/laporan-berkelanjutan"
                  className="sidebar-item-child"
                >
                  Laporan Keberlanjutan
                </a>
                <a
                  href="/cms/kepuasan-layanan-informasi-publik"
                  className="sidebar-item-child"
                >
                  Kepuasan Layanan Informasi Publik
                </a>
              </div>
            )}
            <a href="/cms/prosedur" className="sidebar-item">
              Prosedur
            </a>
            <a href="/cms/pengaduan" className="sidebar-item">
              Pengaduan
            </a>
            <a href="/cms/faq" className="sidebar-item">
              FAQ
            </a>
            <a
              className="sidebar-item flex flex-row justify-between"
              onClick={handleOpenForms}
            >
              Forms
              {isFormsOpen ? <ChevronUp /> : <ChevronDown />}
            </a>
            {isFormsOpen && (
              <div className="flex flex-col">
                <a href="/cms/form-pengaduan" className="sidebar-item-child">
                  Form Pengaduan
                </a>
                <a href="/cms/form-kepuasan-layanan" className="sidebar-item-child">
                  Form Kepuasan Layanan
                </a>
                <a
                  href="/cms/form-permohonan-informasi"
                  className="sidebar-item-child"
                >
                  Form Permohonan Informasi
                </a>
              </div>
            )}
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
