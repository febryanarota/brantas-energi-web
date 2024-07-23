import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./dot-button";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import Image from "next/image";
import { Button } from "@nextui-org/button";
import { card } from "@prisma/client";

type PropType = {
  slides: card[];
  options?: EmblaOptionsType;
};

const Layanan: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [
    // Autoplay({ playOnInit: true, delay: 3000 })
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  return (
    <section className="embla w-full">
      <div className="">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {slides.map((slide, index) => (
              <div className="embla__slide py-2" key={index}>
                <div className="relative w-full h-[500px]  items-center justify-center flex px-2">
                  <div className="w-full h-[90%] py-5">
                    <div className="w-[75%] h-full rounded-md overflow-hidden md:block hidden max-w-[75%]">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${slide.image}`}
                        width={1000}
                        height={1000}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute md:w-1/2 w-full h-[90%] bg-white z-[100] right-0 rounded-lg shadow-md p-10">
                    <div className="flex flex-col w-full h-full">
                      <a
                        href={slide.link || "#"}
                        className="line-clamp-2 text-3xl font-semibold hover:text-primaryYellow transition-colors duration-500 ease-in-out"
                      >
                        {slide.title}
                      </a>
                      <div
                        className="ProseMirror whitespace-pre-line text-sm text-justify line-clamp-[10] mt-5"
                        style={{ whiteSpace: "pre-line" }}
                        dangerouslySetInnerHTML={{
                          __html: slide.description as string,
                        }}
                      />
                      <div className="flex-grow"></div>
                      <a href={slide.link || "#"} className="self-end mt-10">
                        <Button className="bg-primaryYellow font-semibold text-slate-800 w-fit">
                          Read More
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center">
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={"embla__dot".concat(
                index === selectedIndex ? " embla__dot--selected" : "",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Layanan;
