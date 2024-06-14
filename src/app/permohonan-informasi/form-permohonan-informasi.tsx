import { Button } from "@nextui-org/button";

export default function FormPermohonanInformasi() {
    return (
        <div className="flex flex-col items-center w-full">
            <form action="" className="max-w-2xl w-full gap-3 flex flex-col text-sm items-center">
                <div className="w-full flex flex-col">
                    <label className="" htmlFor="nama" >Nama Pemohon</label>
                    <input type="text" name="nama" id="nama" className="border-2 rounded-sm p-2 w-full"/>
                </div>

                <div className="flex md:flex-row flex-col gap-5 w-full">
                    <div className="flex flex-col">
                        <label className="" htmlFor="tipeIdentitas">Tipe Identitas</label>
                        <select name="tipeIdentitas" id="tipeIdentitas" className="border-2 rounded-sm p-2">
                            <option value="">KTP</option>
                            <option value="">SIM</option>
                            <option value="">Passport</option>
                        </select>
                    </div>

                    <div className="flex flex-col grow">
                        <label className="" htmlFor="nomorIdentitas">Nomor Identitas</label>
                        <input type="text" name="nomorIdentitas" id="nomorIdentitas" className="border-2 rounded-sm p-2"/>
                    </div>
                </div>

                <div className="w-full flex flex-col">
                    <label className="" htmlFor="instansi" >Instansi/Lembaga</label>
                    <input type="text" name="instansi" id="instansi" className="border-2 rounded-sm p-2 w-full"/>
                </div>
                <div className="w-full flex flex-col">
                    <label className="" htmlFor="email" >Email</label>
                    <input type="text" name="email" id="email" className="border-2 rounded-sm p-2 w-full"/>
                </div>
                <div className="w-full flex flex-col">
                    <label className="" htmlFor="telepon" >Telepon</label>
                    <input type="text" name="telepon" id="telepon" className="border-2 rounded-sm p-2 w-full"/>
                </div>
                <div className="w-full flex flex-col">
                    <label className="" htmlFor="jenis" >Jenis Permohonan Informasi Publik</label>
                    <input type="text" name="jenis" id="jenis" className="border-2 rounded-sm p-2 w-full"/>
                </div>
                <div className="w-full flex flex-col">
                    <label className="" htmlFor="alasan" >Alasan Penggunaan Informasi</label>
                    <textarea  name="alasan" id="alasan" className="border-2 rounded-sm p-2 w-full"/>
                </div>

                <Button className="w-fit bg-primaryYellow font-semibold px-20 shadow-sm mt-10">
                    Submit
                </Button>
            </form>
        </div>
    )
    
};
