import React from "react";
import { EmblaOptionsType } from "embla-carousel";
import { DotButton, useDotButton } from "./dot-button";
import useEmblaCarousel from "embla-carousel-react";
import "./embla.css";
import Image from "next/image";
import { Button } from "@nextui-org/button";

type PropType = {
  slides: number[];
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
            {slides.map((index) => (
              <div className="embla__slide py-2" key={index}>
                <div className="relative w-full h-[500px]  items-center justify-center flex ">
                  <div className="w-full ">
                    <div className="w-[90%] rounded-md overflow-hidden">
                      <Image
                        src="/images/tol-cisumdawu.jpg"
                        width={1000}
                        height={1000}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute w-1/2 h-[90%] bg-white z-[100] right-0 rounded-lg shadow-md p-10">
                    <div className="flex flex-col w-full h-full">
                      <a
                        href="#"
                        className="text-3xl font-semibold pb-7 hover:text-primaryYellow transition-colors duration-500 ease-in-out"
                      >
                        Informasi Serta Merta
                      </a>
                      <p className="text-justify">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Mollitia blanditiis reiciendis doloribus minus enim.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Non cupiditate exercitationem magni commodi omnis
                        assumenda dicta possimus fugit, vitae provident, dolore
                        error consectetur. Illo.
                      </p>
                      <Button className="bg-primaryYellow font-semibold text-slate-800 w-fit self-end mt-10">
                        Read More
                      </Button>
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
