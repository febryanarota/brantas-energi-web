import { Input } from "@/components/ui/input";
import { Button } from "@nextui-org/button";

export default function FormPengaduan() {
  return (
    <div className="flex flex-col items-center w-full mt-5">
      <p className="text-black font-medium max-w-2xl w-full mb-2">
        Pengisian Formulir Informasi data
      </p>
      <form
        action=""
        className="max-w-2xl w-full gap-3 flex flex-col text-sm items-center"
      >
        <div className="w-full flex flex-col">
          <label className="" htmlFor="judul">
            Judul Pengaduan
          </label>
          <input
            type="text"
            name="judul"
            id="judul"
            className="border-2 rounded-sm p-2 w-full"
          />
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="uraian">
            Uraian Pengaduan
          </label>
          <textarea
            name="uraian"
            id="uraian"
            className="border-2 rounded-sm p-2 w-full"
          />
        </div>

        <p className="w-full font-medium underline mt-5">
          Pihak yang Diduga Terlibat
        </p>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="namaTerduga">
            Nama
          </label>
          <input
            type="text"
            name="namaTerduga"
            id="namaTerduga"
            className="border-2 rounded-sm p-2 w-full"
          />
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="jabatanTerduga">
            Jabatan
          </label>
          <input
            type="text"
            name="jabatanTerduga"
            id="jabatanTerduga"
            className="border-2 rounded-sm p-2 w-full"
          />
        </div>

        <div className="w-full flex flex-col text-gray-600">
          <label htmlFor="lampiran">Upload Lampiran</label>
          <Input id="lampiran" type="file" className="border-2 rounded-sm" />
          <div className="flex flex-col gap-3 py-2">
            <p>Only one file</p>
            <p>10 MB limit</p>
          </div>
        </div>

        <p className="w-full font-medium underline mt-5">Data Pelapor</p>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="namaPelapor">
            Nama Pelapor (Opsional)
          </label>
          <input
            type="text"
            name="namaPelapor"
            id="namaPelapor"
            className="border-2 rounded-sm p-2 w-full"
          />
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="emailPelapor">
            Email Pelapor (Opsional)
          </label>
          <input
            type="text"
            name="emailPelapor"
            id="emailPelapor"
            className="border-2 rounded-sm p-2 w-full"
          />
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="teleponPelapor">
            Telepon Pelapor (Opsional)
          </label>
          <input
            type="text"
            name="teleponPelapor"
            id="teleponPelapor"
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
