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
import { useFormik } from "formik";
import { useToast } from "@/components/ui/use-toast";
import * as Yup from "yup";

export default function FormKepuasanLayanan() {
  // let date;

  const { toast } = useToast();
  const formik = useFormik({
    initialValues: {
      nama: "",
      jenisKelamin: "none",
      email: "",
      pendidikan: "none",
      pekerjaan: "none",
      pengajuan: "false",
      tanggalLahir: null,
      q1: "",
      q2: "",
      q3: "",
      q4: "",
      q5: "",
      q6: "",
      q7: "",
      q8: "",
      saran: "",
    },
    validationSchema: Yup.object({
      nama: Yup.string()
        .max(25, "Must be 25 characters or less")
        .required("Required"),
      email: Yup.string()
        .email("Email not valid")
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      tanggalLahir: Yup.date()
        .max(new Date(), "Birth date is not valid")
        .required("Required"),
      q1: Yup.string().required("Required"),
      q2: Yup.string().required("Required"),
      q3: Yup.string().required("Required"),
      q4: Yup.string().required("Required"),
      q5: Yup.string().required("Required"),
      q6: Yup.string().required("Required"),
      q7: Yup.string().required("Required"),
      q8: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const response = await fetch("/api/kepuasan-layanan", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response) {
          throw new Error("Network response was not ok");
        }

        resetForm();
        toast({
          title: "Success!",
          description: "Form successfully submitted",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem with your request.",
        });
        console.error("Form submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={formik.handleSubmit}
        className="max-w-2xl w-full gap-5 flex flex-col text-sm items-center"
      >
        <div className="w-full flex flex-col">
          <label className="" htmlFor="nama">
            Nama
          </label>
          <input
            type="text"
            name="nama"
            id="nama"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.nama}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.nama && formik.errors.nama ? "border-red-300" : ""}`}
          />
          {formik.touched.nama && formik.errors.nama ? (
            <p className="invalid-feedback">{formik.errors.nama}</p>
          ) : null}
        </div>

        <div className="flex md:flex-row flex-col gap-5 w-full">
          <div className="flex flex-col">
            <label className="" htmlFor="jenisKelamin">
              Jenis Kelamin
            </label>
            <select
              name="jenisKelamin"
              id="jenisKelamin"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.jenisKelamin}
              className={`border-2 rounded-sm p-2 w-full ${formik.touched.jenisKelamin && formik.errors.jenisKelamin ? "border-red-300" : ""}`}
            >
              <option value="none">-none-</option>
              <option value="perempuan">Perempuan</option>
              <option value="laki-laki">Laki-laki</option>
            </select>
            {formik.touched.jenisKelamin && formik.errors.jenisKelamin ? (
              <p className="invalid-feedback">{formik.errors.jenisKelamin}</p>
            ) : null}
          </div>

          <div className="flex flex-col grow">
            <label className="" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={`border-2 rounded-sm p-2 w-full ${formik.touched.email && formik.errors.email ? "border-red-300" : ""}`}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="invalid-feedback">{formik.errors.email}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col w-full">
          <label className="" htmlFor="pendidikan">
            Pendidikan Terakhir
          </label>
          <select
            name="pendidikan"
            id="pendidikan"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pendidikan}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.pendidikan && formik.errors.pendidikan ? "border-red-300" : ""}`}
          >
            <option value="none">-none-</option>
            <option value="SMA">SMA</option>
            <option value="S1">S1</option>
            <option value="S2">S2</option>
            <option value="S3">S3</option>
            <option value="other">Lainnya</option>
          </select>

          {formik.touched.pendidikan && formik.errors.pendidikan ? (
            <p className="invalid-feedback">{formik.errors.pendidikan}</p>
          ) : null}
        </div>

        <div className="flex flex-col w-full">
          <Popover>
            <PopoverTrigger asChild>
              <div className="w-full">
                <p>Tanggal Lahir</p>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal border-2 rounded-sm p-2",
                    formik.touched.tanggalLahir &&
                      formik.errors.tanggalLahir &&
                      "border-red-300",
                    !formik.values.tanggalLahir && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formik.values.tanggalLahir ? (
                    format(formik.values.tanggalLahir, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                onSelect={(date) => formik.setFieldValue("tanggalLahir", date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {formik.touched.tanggalLahir && formik.errors.tanggalLahir ? (
            <div className="invalid-feedback">{formik.errors.tanggalLahir}</div>
          ) : null}
        </div>

        <div className="flex flex-col w-full">
          <label className="" htmlFor="pekerjaan">
            Pekerjaan
          </label>
          <select
            name="pekerjaan"
            id="pekerjaan"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pekerjaan}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.pekerjaan && formik.errors.pekerjaan ? "border-red-300" : ""}`}
          >
            <option value="none">-none-</option>
            <option value="PNS">PNS</option>
            <option value="swasta">Swasta</option>
            <option value="profesional">Profesional</option>
            <option value="other">Lainnya</option>
          </select>
          {formik.touched.pekerjaan && formik.errors.pekerjaan ? (
            <p className="invalid-feedback">{formik.errors.pekerjaan}</p>
          ) : null}
        </div>

        <div className="flex flex-col w-full">
          <label className="" htmlFor="pengajuan">
            Sudah pernah mengajukan permohonan PPID?
          </label>
          <select
            name="pengajuan"
            id="pengajuan"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pengajuan}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.pengajuan && formik.errors.pengajuan ? "border-red-300" : ""}`}
          >
            <option value="true">Sudah pernah</option>
            <option value="false">Belum pernah</option>
          </select>
          {formik.touched.pengajuan && formik.errors.pengajuan ? (
            <p className="invalid-feedback">{formik.errors.pengajuan}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-5">
          <div
            className={`w-full bg-slate-100 rounded-md p-2 ${formik.errors.q1 && formik.touched.q1 ? "border-red-300 border-2" : ""}`}
          >
            <p className="text-justify">
              Bagaimana tentang persyaratan yang harus dipenuhi dalam mengajukan
              permohonan informasi di PPID Brantas Energi?
            </p>
            <div
              className={
                "w-full grid grid-cols-4 mt-3 text-slate-700 text-center"
              }
            >
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  id="a1q1"
                  name="q1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q1 === "4"}
                  value="4"
                />
                <label htmlFor="a1q1">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a2q1"
                  name="q1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q1 === "3"}
                  value="3"
                />
                <label htmlFor="a2q1">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a3q1"
                  name="q1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q1 === "2"}
                  value="2"
                />
                <label htmlFor="a3q1">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a4q1"
                  name="q1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q1 === "1"}
                  value="1"
                />
                <label htmlFor="a4q1">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div
            className={`w-full bg-slate-100 rounded-md p-2 ${formik.errors.q2 && formik.touched.q2 ? "border-red-300 border-2" : ""}`}
          >
            <p className="text-justify">
              Bagaimana tentang tata cara / alur pelayanan informasi publik di
              Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  id="a1q2"
                  name="q2"
                  value="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q2 === "4"}
                />
                <label htmlFor="a1q2">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a2q2"
                  name="q2"
                  value="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q2 === "3"}
                />
                <label htmlFor="a2q2">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a3q2"
                  name="q2"
                  value="2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q2 === "2"}
                />
                <label htmlFor="a3q2">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a4q2"
                  name="q2"
                  value="1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q2 === "1"}
                />
                <label htmlFor="a4q2">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div
            className={`w-full bg-slate-100 rounded-md p-2 ${formik.errors.q3 && formik.touched.q3 ? "border-red-300 border-2" : ""}`}
          >
            <p className="text-justify">
              Bagaimana ketepatan waktu PPID Brantas Energi dalam memberikan
              pelayanan informasi publik?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  id="a1q3"
                  name="q3"
                  value="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q3 === "4"}
                />
                <label htmlFor="a1q3">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a2q3"
                  name="q3"
                  value="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q3 === "3"}
                />
                <label htmlFor="a2q3">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a3q3"
                  name="q3"
                  value="2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q3 === "2"}
                />
                <label htmlFor="a3q3">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a4q3"
                  name="q3"
                  value="1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q3 === "1"}
                />
                <label htmlFor="a4q3">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div
            className={`w-full bg-slate-100 rounded-md p-2 ${formik.errors.q4 && formik.touched.q4 ? "border-red-300 border-2" : ""}`}
          >
            <p className="text-justify">
              Bagaimana tentang kesesuaian informasi yang diberikan oleh PPID
              Abipraya dengan permohonan informasi yang diajukan?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  id="a1q4"
                  name="q4"
                  value="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q4 === "4"}
                />
                <label htmlFor="a1q4">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a2q4"
                  name="q4"
                  value="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q4 === "3"}
                />
                <label htmlFor="a2q4">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a3q4"
                  name="q4"
                  value="2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q4 === "2"}
                />
                <label htmlFor="a3q4">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a4q4"
                  name="q4"
                  value="1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q4 === "1"}
                />
                <label htmlFor="a4q4">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div
            className={`w-full bg-slate-100 rounded-md p-2 ${formik.errors.q5 && formik.touched.q5 ? "border-red-300 border-2" : ""}`}
          >
            <p className="text-justify">
              Bagaimana tentang pelayanan petugas dalam melayani permohonan
              informasi publik di Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  id="a1q5"
                  name="q5"
                  value="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q5 === "4"}
                />
                <label htmlFor="a1q5">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a2q5"
                  name="q5"
                  value="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q5 === "3"}
                />
                <label htmlFor="a2q5">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a3q5"
                  name="q5"
                  value="2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q5 === "2"}
                />
                <label htmlFor="a3q5">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a4q5"
                  name="q5"
                  value="1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q5 === "1"}
                />
                <label htmlFor="a4q5">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div
            className={`w-full bg-slate-100 rounded-md p-2 ${formik.errors.q6 && formik.touched.q6 ? "border-red-300 border-2" : ""}`}
          >
            <p className="text-justify">
              Bagaimana tentang kenyamanan fasilitas meja/desk pelayanan
              permohonan informasi publik di Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  id="a1q6"
                  name="q6"
                  value="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q6 === "4"}
                />
                <label htmlFor="a1q6">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a2q6"
                  name="q6"
                  value="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q6 === "3"}
                />
                <label htmlFor="a2q6">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a3q6"
                  name="q6"
                  value="2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q6 === "2"}
                />
                <label htmlFor="a3q6">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a4q6"
                  name="q6"
                  value="1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q6 === "1"}
                />
                <label htmlFor="a4q6">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div
            className={`w-full bg-slate-100 rounded-md p-2 ${formik.errors.q7 && formik.touched.q7 ? "border-red-300 border-2" : ""}`}
          >
            <p className="text-justify">
              Bagaimana tentang kemudahan dalam mengakses informasi pada website
              PPID Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  id="a1q7"
                  name="q7"
                  value="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q7 === "4"}
                />
                <label htmlFor="a1q7">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a2q7"
                  name="q7"
                  value="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q7 === "3"}
                />
                <label htmlFor="a2q7">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a3q7"
                  name="q7"
                  value="2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q7 === "2"}
                />
                <label htmlFor="a3q7">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a4q7"
                  name="q7"
                  value="1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q7 === "1"}
                />
                <label htmlFor="a4q7">Tidak Baik</label>
              </div>
            </div>
          </div>

          <div
            className={`w-full bg-slate-100 rounded-md p-2 ${formik.errors.q8 && formik.touched.q8 ? "border-red-300 border-2" : ""}`}
          >
            <p className="text-justify">
              Bagaimana tentang kualitas informasi yang tersedia pada website
              PPID Brantas Energi?
            </p>
            <div className="w-full grid grid-cols-4 mt-3 text-slate-700 text-center">
              <div className="flex flex-col items-center">
                <input
                  type="radio"
                  id="a1q8"
                  name="q8"
                  value="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q8 === "4"}
                />
                <label htmlFor="a1q8">Sangat Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a2q8"
                  name="q8"
                  value="3"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q8 === "3"}
                />
                <label htmlFor="a2q8">Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a3q8"
                  name="q8"
                  value="2"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q8 === "2"}
                />
                <label htmlFor="a3q8">Cukup Baik</label>
              </div>
              <div className="flex flex-col  items-center">
                <input
                  type="radio"
                  id="a4q8"
                  name="q8"
                  value="1"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.q8 === "1"}
                />
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.saran}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.saran && formik.errors.saran ? "border-red-300" : ""}`}
          />
        </div>
        {formik.touched.saran && formik.errors.saran ? (
          <p className="invalid-feedback">{formik.errors.saran}</p>
        ) : null}
        <Button
          className="w-fit bg-primaryYellow font-semibold px-20 shadow-sm mt-10"
          type="submit"
        >
          Submit
        </Button>
      </form>
    </div>
  );
}
