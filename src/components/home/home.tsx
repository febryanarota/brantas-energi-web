"use client";

import Image from "next/image";
import { EmblaOptionsType } from "embla-carousel";
import Layanan from "@/components/carousel/layanan-carousel";
import { Container } from "@/components/ui/container";
import { card, home } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home({ data }: { data: home }) {
  const OPTIONS: EmblaOptionsType = {
    loop: true,
  };
  const [isFetchingCard, setIsFetchingCard] = useState(true);

  const [slides, setSlides] = useState<card[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/card`, {
        method: "GET",
        headers: {
          "Cache-Control": "no-store",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data: card[] = await response.json();
      setSlides(data);
    };

    fetchData();
    setIsFetchingCard(false);
  }, []);

  return (
    <div className="flex flex-col">
      {/* Landing image */}
      <div className="w-full h-screen relative">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <Image
          src={`${data.image1}`}
          width={2000}
          height={1000}
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Container className="text-white sm:border-l-5 sm:border-primaryYellow py-10">
            <div className="flex flex-col gap-4 border-b-5 border-primaryYellow pb-2 sm:border-none sm:pb-0">
              <span className="text-4xl sm:text-6xl font-bold">
                {data.heading1}
              </span>
            </div>
            <div
              className="ProseMirror whitespace-pre-line text-sm text-justify py-5"
              style={{ whiteSpace: "pre-line" }}
              dangerouslySetInnerHTML={{ __html: data.description1 as string }}
            />
          </Container>
        </div>
      </div>

      {/* Tentang Kami */}
      <div className="flex flex-col items-center pb-24">
        <Container className="flex flex-col sm:flex-row sm:mt-20 mt-10 items-center">
          <div className="relative sm:w-1/2 h-fit">
            <div className="relative w-[90%] h-[200px] sm:h-[350px] rounded-md overflow-hidden">
              <Image
                src={`${data.image2}`}
                width={500}
                height={500}
                alt=""
                className="w-full h-full object-cover mb-10"
              />
              <div className="absolute w-full h-full bg-primaryYellow inset-0 bg-opacity-30"></div>
            </div>
            <Image
              src={`${data.image2}`}
              width={500}
              height={500}
              alt=""
              className="absolute top-0 w-[90%] right-0 z-10 translate-y-10 border-3 border-white rounded-md"
            />
          </div>

          <div className="sm:w-1/2 sm:pl-10 flex flex-col">
            <p className="border-b-2 border-primaryYellow font-semibold my-10 text-slate-700">
              {data.subheading2}
            </p>
            <p className="text-4xl font-semibold mb-5">{data.heading2}</p>
            <div className="flex flex-col gap-5">
              <div
                className="ProseMirror whitespace-pre-line text-sm text-justify py-5"
                style={{ whiteSpace: "pre-line" }}
                dangerouslySetInnerHTML={{
                  __html: data.description2 as string,
                }}
              />
            </div>
          </div>
        </Container>
      </div>

      <div className="bg-gray-100 flex justify-center py-10">
        <Container className="flex flex-col">
          <div className="flex flex-col items-center">
            <p className="border-b-2 border-primaryYellow font-semibold mt-10 text-slate-800">
              {data.subheading3}
            </p>
            <p className="text-4xl font-semibold my-5 mb-10 md:text-left text-center">
              {data.heading3}
            </p>
          </div>
          { !isFetchingCard ?
            <Layanan slides={slides} options={OPTIONS} />
            : 
            <div className="w-full bg-slate-200 h-[25rem] rounded-md shadow-sm animate-pulse">

            </div>

          }
        </Container>
      </div>
    </div>
  );
}
