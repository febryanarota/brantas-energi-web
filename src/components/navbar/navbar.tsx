"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
  const [isInformasiPublikOpen, setIsInformasiPublikOpen] =
    React.useState(false);
  const [isLaporanLayananOpen, setIsLaporanLayananOpen] = React.useState(false);

  const toggleDropdownProfile = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleDropdownInformasi = () => {
    setIsInformasiPublikOpen(!isInformasiPublikOpen);
  };

  const toggleDropdownLaporanLayanan = () => {
    setIsLaporanLayananOpen(!isLaporanLayananOpen);
  };

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="md:py-3"
    >

      <NavbarContent className="lg:hidden" justify="start">
        <NavbarBrand>
          <a href="/">
            <Image
              src={"/images/logo.png"}
              width={40}
              height={40}
              alt="Logo PT Brantas Energi "
            />
          </a>
        </NavbarBrand>
      </NavbarContent>
      <NavbarContent className="lg:hidden" justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      

      <NavbarContent className="hidden lg:flex gap-4" justify="center">
        <NavbarBrand>
          <a href="/">
            <Image
              src={"/images/logo.png"}
              width={75}
              height={75}
              alt="Logo PT Brantas Energi "
              className="p-2"
            />
          </a>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden lg:flex gap-4" justify="end">
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 gap-0 bg-transparent data-[hover=true]:bg-transparent"
                radius="sm"
              >
                PROFIL PPID
                <ChevronDown />
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem key="struktur" href="/struktur-ppid">
              Struktur PPID
            </DropdownItem>
            <DropdownItem key="visiMisi" href="/visi-misi-ppid">
              Visi & Misi PPID
            </DropdownItem>
            <DropdownItem
              key="tugasFungsiWewenang"
              href="/tugas-fungsi-wewenang"
            >
              Tugas, Fungsi, & Wewenang
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <NavbarItem>
          <Link
            href="/regulasi-informasi-publik"
            color="foreground"
            className="text-sm"
          >
            REGULASI
          </Link>
        </NavbarItem>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 gap-0 bg-transparent data-[hover=true]:bg-transparent"
                radius="sm"
              >
                INFORMASI PUBLIK
                <ChevronDown />
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem key="informasi-publik" href="/informasi-publik">
              Informasi Publik
            </DropdownItem>
            <DropdownItem
              key="informasi-serta-merta"
              href="/informasi-serta-merta"
            >
              Informasi Serta Merta
            </DropdownItem>
            <DropdownItem key="informasi-berkala" href="/informasi-berkala">
              Informasi Berkala
            </DropdownItem>
            <DropdownItem
              key="informasi-wajib-tersedia"
              href="/informasi-wajib-tersedia"
            >
              Informasi Wajib Tersedia
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 gap-0 bg-transparent data-[hover=true]:bg-transparent"
                radius="sm"
              >
                LAPORAN LAYANAN
                <ChevronDown />
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu
            aria-label="ACME features"
            className="w-[340px]"
            itemClasses={{
              base: "gap-4",
            }}
          >
            <DropdownItem
              key="laporan-layanan-informasi"
              href="/laporan-layanan-informasi"
            >
              Laporan Layanan Informasi
            </DropdownItem>
            <DropdownItem
              key="permohonan-informasi"
              href="/permohonan-informasi"
            >
              Permohonan Informasi
            </DropdownItem>
            <DropdownItem key="laporan-tahunan" href="/laporan-tahunan">
              Laporan Tahunan
            </DropdownItem>
            <DropdownItem
              key="laporan-keberlanjutan"
              href="/laporan-keberlanjutan"
            >
              Laporan Keberlanjutan
            </DropdownItem>
            <DropdownItem
              key="kepuasan-layanan-informasi-publik"
              href="/kepuasan-layanan-informasi-publik"
            >
              Kepuasan Layanan Informasi Publik
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <NavbarItem>
          <Link href="/prosedur" color="foreground" className="text-sm">
            PROSEDUR
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link href="/whistle-blowing-system" color="foreground" className="text-sm">
            PENGADUAN
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link href="/frequently-asked-questions" color="foreground" className="text-sm">
            FAQ
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu className="pb-20 pt-10 bg-white bg-opacity-90 flex flex-col gap-5">
        <NavbarMenuItem>
          <button
            className="w-full flex flex-row justify-between cursor-pointer "
            onClick={toggleDropdownProfile}
          >
            <p className="uppercase font-medium">Profil PPID</p>
            {isProfileMenuOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          <div
            className={`dropdown-content flex flex-col gap-3 pl-2 text-sm ${isProfileMenuOpen ? "open" : ""}`}
          >
            <a href="/struktur-ppid">Struktur PPID</a>
            <a href="/visi-misi-ppid">Visi & Misi PPID</a>
            <a href="/tugas-fungsi-wewenang">Tugas, Fungsi & Wewenang</a>
          </div>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <div className="">
            <a
              href="/regulasi-informasi-publik"
              className="uppercase font-medium w-full "
            >
              Regulasi
            </a>
          </div>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <button
            className="w-full flex flex-row justify-between cursor-pointer "
            onClick={toggleDropdownInformasi}
          >
            <p className="uppercase font-medium">Informasi Publik</p>
            {isInformasiPublikOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          <div
            className={`dropdown-content flex flex-col gap-3 pl-2 text-sm ${isInformasiPublikOpen ? "open" : ""}`}
          >
            <a href="/informasi-wajib-tersedia">Informasi Wajib Tersedia</a>
            <a href="/informasi-berkala">Informasi Berkala</a>
            <a href="/informasi-publik">Informasi Publik</a>
            <a href="/informasi-serta-merta">Informasi Serta Merta</a>
          </div>
        </NavbarMenuItem>

        <NavbarMenuItem>
          <button
            className="w-full flex flex-row justify-between cursor-pointer "
            onClick={toggleDropdownLaporanLayanan}
          >
            <p className="uppercase font-medium">Laporan Layanan</p>
            {isLaporanLayananOpen ? <ChevronUp /> : <ChevronDown />}
          </button>
          <div
            className={`dropdown-content flex flex-col gap-3 pl-2 text-sm ${isLaporanLayananOpen ? "open" : ""}`}
          >
            <a href="/informas-wajib-tersedia">Laporan Layanan Informasi</a>
            <a href="/informasi-berkala">Permohonan Informasi</a>
            <a href="/informasi-publik">Laporan Tahunan</a>
            <a href="/informasi-serta-merta">Laporan Keberlanjutan</a>
            <a href="/informasi-serta-merta">
              Kepuasan Layanan Informasi Publik
            </a>
          </div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <a
            href="/prosedur"
            className="uppercase font-medium"
          >
            Prosedur
          </a>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <a
            href="/whistle-blowing-system"
            className="uppercase font-medium"
          >
            Pengaduan
          </a>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <a
            href="/frequently-asked-questions"
            className="uppercase font-medium"
          >
            FAQ
          </a>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
