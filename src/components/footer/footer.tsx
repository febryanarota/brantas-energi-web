"use client";

import {
  Mails,
  Map,
  Phone,
} from "lucide-react";
import { Container } from "../ui/container";
import { home } from "@prisma/client";
import { FaInstagram, FaYoutube, FaFacebook, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer({ data }: { data: home }) {

  return (
    <div className="w-full text-white bg-gradient-to-b from-sky-800 to-sky-900 flex justify-center">
      <Container className="flex flex-col">
        <p className="text-lg font-bold my-5">{data.name}</p>
        <div>
          <ul className="flex flex-col gap-5">
            <li className="flex flex-row items-center gap-5">
              <div className="flex-none">
                <Map width={20} height={20} />
              </div>
              <p className="text-sm">{data.address}</p>
            </li>
            <li className="flex flex-row items-center gap-5">
              <div className="flex-none">
                <Phone width={20} height={20} />
              </div>
              <p className="text-sm">{data.phone}</p>
            </li>
            <li className="flex flex-row items-center gap-5">
              <div className="flex-none">
                <Mails width={20} height={20} />
              </div>
              <p className="text-sm">{data.email}</p>
            </li>
          </ul>
        </div>
        <div className="w-full flex md:flex-row flex-col-reverse md:justify-between border-t-2 border-primaryYellow mt-20 pt-5 items-center ">
          <p className="text-sm mt-5 md:mt-0">
            © Copyright PT Brantas Energi (Persero) 2024. All Rights Reserved.
          </p>
          <div className="flex flex-row gap-5 ">
            {data.instagram && (
              <a
                href={data.instagram}
                className="rounded-full p-2 hover:bg-primaryYellow transition-colors duration-400 ease-in-out"
              >
                <FaInstagram/>
              </a>
            )}
            {data.youtube && (
              <a
                href={data.youtube}
                className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
              >
                <FaYoutube/>
              </a>
            )}
            {data.twitter && (
              <a
                href={data.twitter}
                className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
              >
                <FaXTwitter/>
              </a>
            )}
            {data.facebook && (
              <a
                href={data.facebook}
                className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
              >
                <FaFacebook />
              </a>
            )}
            {data.linkedin && (
              <a
                href={data.linkedin}
                className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
              >
                <FaLinkedin />
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
