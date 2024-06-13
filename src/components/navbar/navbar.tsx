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
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar
      isBordered
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="md:py-3"
    >
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
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

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
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

        <NavbarItem>
          <Link href="/" color="foreground" className="text-sm">
            LAPORAN LAYANAN
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link href="/" color="foreground" className="text-sm">
            PROSEDUR
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link href="/" color="foreground" className="text-sm">
            PENGADUAN
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
