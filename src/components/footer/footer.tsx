"use client";

import {
  Facebook,
  Instagram,
  Mails,
  Map,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { Container } from "../ui/container";
import { home } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Footer({data} : {data : home}) {
  // const [data, setData] = useState<home | null>(null);
  // const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/home`, {
  //         method: "GET",
  //         headers: {
  //           "Cache-Control": "no-store",
  //         },
  //         cache: "no-store",
  //       });

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }

  //       const data: { verified: home; pending: home } = await response.json();

  //       console.log(data.verified)
  //       setData(data.verified);
  //     } catch (error) {
  //       setError(error as string);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (error) {
  //   return <div className="text-red-500">Error: {error}</div>;
  // }

  // if (!data) {
  //   return <div>Loading...</div>;
  // }

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
                className="p-2 rounded-full hover:bg-primaryYellow transition-colors duration-400 ease-in-out"
              >
                <Instagram width={20} height={20} />
              </a>
            )}
            {data.youtube && (
              <a
                href={data.youtube}
                className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
              >
                <Youtube width={20} height={20} />
              </a>
            )}
            {data.twitter && (
              <a
                href={data.twitter}
                className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
              >
                <Twitter width={20} height={20} />
              </a>
            )}
            {data.facebook && (
              <a
                href={data.facebook}
                className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
              >
                <Facebook width={20} height={20} />
              </a>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
