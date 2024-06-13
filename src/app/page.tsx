"use client";

import Image from "next/image";
import { EmblaOptionsType } from "embla-carousel";
import Layanan from "@/components/carousel/layanan-carousel";

export default function Home() {
  const OPTIONS: EmblaOptionsType = {
    loop: true,
  };

  const SLIDES = Array.from(Array(5).keys());
  return (
    <div className="flex flex-col">
      {/* Landing image */}
      <div className="w-full h-screen ">
        <div className="relative w-full h-full">
          <Image
            src="/images/tol-cisumdawu.jpg"
            width={2000}
            height={1000}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10">
            <div className="w-full max-w-5xl px-[24px] text-white sm:border-l-5 sm:border-primaryYellow py-10">
              <div className="flex flex-col gap-4 border-b-5 border-primaryYellow pb-2 sm:border-none sm:pb-0">
                <span className="text-4xl sm:text-6xl font-bold">
                  Layanan PPID
                </span>
                <span className="text-4xl sm:text-6xl font-bold">
                  PT Brantas Energi
                </span>
              </div>
              <p className="py-5">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Labore
                ad nihil qui alias possimus ex! Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Cumque sapiente quos voluptates.
                Lorem, ipsum.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tentang Kami */}
      <div className="flex flex-col items-center pb-24">
        <div className="w-full max-w-5xl px-[24px] flex flex-col sm:flex-row sm:mt-20 mt-10">
          <div className="relative sm:w-1/2 h-fit">
            <div className="relative w-[90%] h-[200px] sm:h-[350px] rounded-md overflow-hidden">
              <Image
                src="/images/tol-cisumdawu.jpg"
                width={500}
                height={500}
                alt=""
                className="w-full h-full object-cover mb-10"
              />
              <div className="absolute w-full h-full bg-primaryYellow inset-0 bg-opacity-30"></div>
            </div>
            <Image
              src="/images/tol-cisumdawu.jpg"
              width={500}
              height={500}
              alt=""
              className="absolute top-0 w-[90%] right-0 z-10 translate-y-10 border-3 border-white rounded-md"
            />
          </div>

          <div className="sm:w-1/2 sm:pl-10 flex flex-col">
            <p className="border-b-2 border-primaryYellow font-semibold my-10 text-slate-700">
              TENTANG KAMI
            </p>
            <p className="text-4xl font-semibold mb-5">
              PPID PT BRANTAS ENERGI
            </p>
            <div className="flex flex-col gap-5">
              <p className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore, veniam? Ullam in ex nulla consectetur optio doloribus
                mollitia ipsam recusandae, assumenda fuga natus nam! Numquam,
                voluptatibus?
              </p>
              <p className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore, veniam? Ullam in ex nulla consectetur optio doloribus
                mollitia ipsam recusandae, assumenda fuga natus nam! Numquam,
                voluptatibus?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 flex justify-center py-10">
        <div className="w-full max-w-5xl px-[24px] flex flex-col">
          <div className="flex flex-col items-center">
            <p className="border-b-2 border-primaryYellow font-semibold mt-10 text-slate-800">
              LAYANAN KAMI
            </p>
            <p className="text-4xl font-semibold my-5 mb-10">
              Daftar Informasi Publik Brantas Energi
            </p>
          </div>
          <Layanan slides={SLIDES} options={OPTIONS} />
        </div>
      </div>

      
    </div>
  );
}
