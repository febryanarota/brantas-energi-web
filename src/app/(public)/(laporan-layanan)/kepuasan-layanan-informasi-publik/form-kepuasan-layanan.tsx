"use client";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export default function FormKepuasanLayanan() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex flex-col items-center w-full">
      <form
        action=""
        className="max-w-2xl w-full gap-5 flex flex-col text-sm items-center"
      >
        <div className="w-full flex flex-col">
          <label className="" htmlFor="nama">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="nama"
            id="nama"
            className="border-2 rounded-sm p-2 w-full"
          />
        </div>

        <div className="flex md:flex-row flex-col gap-5 w-full">
          <div className="flex flex-col">
            <label className="" htmlFor="jenisKelamin">
              Jenis Kelamin
            </label>
            <select
              name="jenisKelamin"
              id="jenisKelamin"
              className="border-2 rounded-sm p-2"
            >
              <option value="">-none-</option>
              <option value="">Perempuan</option>
              <option value="">Laki-laki</option>
            </select>
          </div>

          <div className="flex flex-col grow">
            <label className="" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="border-2 rounded-sm p-2"
            />
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="" htmlFor="pendidikan">
            Pendidikan Terakhir
          </label>
          <select
            name="pendidikan"
            id="pendidikan"
            className="border-2 rounded-sm p-2"
          >
            <option value="">-none-</option>
            <option value="">SMA</option>
            <option value="">S1</option>
            <option value="">S2</option>
            <option value="">S3</option>
            <option value="">Lainnya</option>
          </select>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <div className="w-full">
              <p>Tanggal Lahir</p>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal border-2 rounded-sm p-2",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="flex flex-col w-full">
          <label className="" htmlFor="pekerjaan">
            Pekerjaan
          </label>
          <select
            name="pekerjaan"
            id="pekerjaan"
            className="border-2 rounded-sm p-2"
          >
            <option value="">-none-</option>
            <option value="">PNS</option>
            <option value="">Swasta</option>
            <option value="">Profesional</option>
            <option value="">Lainnya</option>
          </select>
        </div>

        <div className="flex flex-col w-full">
          <label className="" htmlFor="pengajuan">
            Sudah pernah mengajukan permohonan PPID?
          </label>
          <select
            name="pengajuan"
            id="pengajuan"
            className="border-2 rounded-sm p-2"
          >
            <option value="">Sudah pernah</option>
            <option value="">Belum pernah</option>
          </select>
        </div>

        <div className="flex flex-col gap-5">
          <div className="w-full bg-slate-100 rounded-md p-2">
            <p className="text-justify">
              Bagaimana tentang persyaratan yang harus dipenuhi dalam mengajukan
              permohonan informasi di PPID Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input type="radio" id="a1q1" name="q1" value="4" />
                <label htmlFor="a1q1">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a2q1" name="q1" value="3" />
                <label htmlFor="a2q1">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a3q1" name="q1" value="2" />
                <label htmlFor="a3q1">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a4q1" name="q1" value="1" />
                <label htmlFor="a4q1">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-md p-2">
            <p className="text-justify">
              Bagaimana tentang tata cara / alur pelayanan informasi publik di
              Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input type="radio" id="a1q2" name="q2" value="4" />
                <label htmlFor="a1q2">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a2q2" name="q2" value="3" />
                <label htmlFor="a2q2">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a3q2" name="q2" value="2" />
                <label htmlFor="a3q2">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a4q2" name="q2" value="1" />
                <label htmlFor="a4q2">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-md p-2">
            <p className="text-justify">
              Bagaimana ketepatan waktu PPID Brantas Energi dalam memberikan
              pelayanan informasi publik?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input type="radio" id="a1q3" name="q3" value="4" />
                <label htmlFor="a1q3">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a2q3" name="q3" value="3" />
                <label htmlFor="a2q3">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a3q3" name="q3" value="2" />
                <label htmlFor="a3q3">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a4q3" name="q3" value="1" />
                <label htmlFor="a4q3">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-md p-2">
            <p className="text-justify">
              Bagaimana tentang kesesuaian informasi yang diberikan oleh PPID
              Abipraya dengan permohonan informasi yang diajukan?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input type="radio" id="a1q4" name="q4" value="4" />
                <label htmlFor="a1q4">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a2q4" name="q4" value="3" />
                <label htmlFor="a2q4">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a3q4" name="q4" value="2" />
                <label htmlFor="a3q4">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a4q4" name="q4" value="1" />
                <label htmlFor="a4q4">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-md p-2">
            <p className="text-justify">
              Bagaimana tentang pelayanan petugas dalam melayani permohonan
              informasi publik di Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input type="radio" id="a1q5" name="q5" value="4" />
                <label htmlFor="a1q5">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a2q5" name="q5" value="3" />
                <label htmlFor="a2q5">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a3q5" name="q5" value="2" />
                <label htmlFor="a3q5">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a4q5" name="q5" value="1" />
                <label htmlFor="a4q5">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-md p-2">
            <p className="text-justify">
              Bagaimana tentang kenyamanan fasilitas meja/desk pelayanan
              permohonan informasi publik di Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input type="radio" id="a1q6" name="q6" value="4" />
                <label htmlFor="a1q6">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a2q6" name="q6" value="3" />
                <label htmlFor="a2q6">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a3q6" name="q6" value="2" />
                <label htmlFor="a3q6">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a4q6" name="q6" value="1" />
                <label htmlFor="a4q6">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-md p-2">
            <p className="text-justify">
              Bagaimana tentang kemudahan dalam mengakses informasi pada website
              PPID Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input type="radio" id="a1q7" name="q7" value="4" />
                <label htmlFor="a1q7">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a2q7" name="q7" value="3" />
                <label htmlFor="a2q7">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a3q7" name="q7" value="2" />
                <label htmlFor="a3q7">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a4q7" name="q7" value="1" />
                <label htmlFor="a4q7">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-md p-2">
            <p className="text-justify">
              Bagaimana tentang kualitas informasi yang tersedia pada website
              PPID Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input type="radio" id="a1q8" name="q8" value="4" />
                <label htmlFor="a1q8">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a2q8" name="q8" value="3" />
                <label htmlFor="a2q8">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a3q8" name="q8" value="2" />
                <label htmlFor="a3q8">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input type="radio" id="a4q8" name="q8" value="1" />
                <label htmlFor="a4q8">Tidak Baik</label>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="saran">
            Saran Terhadap Pengembangan Layanan Informasi Publik Melalui PPID
            Brantas Energi
          </label>
          <textarea
            name="saran"
            id="saran"
            className="border-2 rounded-sm p-2 w-full"
          />
        </div>

        <Button className="w-fit bg-primaryYellow font-semibold px-20 shadow-sm mt-10">
          Submit
        </Button>
      </form>
    </div>
  );
}
