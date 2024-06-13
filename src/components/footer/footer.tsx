import {
  Facebook,
  Instagram,
  Mails,
  MapPinned,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import { Container } from "../ui/container";

export default function Footer() {
  return (
    <div className="text-white  bg-gradient-to-b from-sky-800 to-sky-900 flex  justify-center">
      <Container className="flex flex-col">
        <p className="text-lg font-bold my-5">BRANTAS ENERGI</p>
        <div>
          <ul className="flex flex-col gap-5">
            <li className="flex flex-row items-center gap-5">
              <MapPinned width={20} height={20} />
              <p className="text-sm">
                Gedung Sapta Taruna, Jl. DI. Panjaitan No.Kav. 12, Jakarta Timur
                13340
              </p>
            </li>
            <li className="flex flex-row items-center gap-5">
              <Phone width={20} height={20} />
              <p className="text-sm">(021) 29613918</p>
            </li>
            <li className="flex flex-row items-center gap-5">
              <Mails width={20} height={20} />
              <p className="text-sm">corporate@brantasenergi.co.id</p>
            </li>
          </ul>
        </div>
        <div className="w-full flex flex-row justify-between border-t-2 border-primaryYellow mt-20 pt-5 items-center">
          <p className="text-sm">
            © Copyright PT Brantas Energi (Persero) 2024. All Rights Reserved.
          </p>
          <div className="flex flex-row gap-5">
            <a
              href=""
              className="p-2 rounded-full hover:bg-primaryYellow transition-colors duration-400 ease-in-out"
            >
              <Instagram width={20} height={20} />
            </a>
            <a
              href=""
              className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
            >
              <Youtube width={20} height={20} />
            </a>
            <a
              href=""
              className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
            >
              <Twitter width={20} height={20} />
            </a>
            <a
              href=""
              className="hover:bg-primaryYellow p-2 rounded-full transition-colors duration-400 ease-in-out"
            >
              <Facebook width={20} height={20} />
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
