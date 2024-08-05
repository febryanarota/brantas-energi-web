"use client";

import { useToast } from "@/components/ui/use-toast";
import { sanitizeInput } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import { useFormik } from "formik";
import * as Yup from "yup";

export const FormPermohonanInformasi = () => {
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      nama: "",
      tipeIdentitas: "KTP",
      nomorIdentitas: "",
      instansi: "",
      email: "",
      telepon: "",
      jenisInformasi: "none",
      alasan: "",
    },
    validationSchema: Yup.object({
      nama: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      nomorIdentitas: Yup.string()
        .min(10, "Must be 10 characters or more")
        .max(20, "Must be 20 characters or less")
        .required("Required"),
      instansi: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      email: Yup.string()
        .email("Email not valid")
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      telepon: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      alasan: Yup.string()
        .test("sanitize-input", "Please input a valid character", (value) => {
          const sanitizedValue = sanitizeInput(value as string);
          return sanitizedValue === value;
        })
        .required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      try {
        const response = await fetch("/api/permohonan-informasi", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("Form successfully submitted:", result);
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
        className="max-w-2xl mt-5 w-full gap-3 flex flex-col text-sm items-center"
      >
        <div className="w-full flex flex-col">
          <label className="" htmlFor="nama">
            Nama Pemohon
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
            <label className="" htmlFor="tipeIdentitas">
              Tipe Identitas
            </label>
            <select
              name="tipeIdentitas"
              id="tipeIdentitas"
              className="border-2 rounded-sm p-2"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tipeIdentitas}
            >
              <option value="KTP">KTP</option>
              <option value="SIM">SIM</option>
              <option value="passport">Passport</option>
            </select>
          </div>

          <div className="flex flex-col grow">
            <label className="" htmlFor="nomorIdentitas">
              Nomor Identitas
            </label>
            <input
              type="text"
              name="nomorIdentitas"
              id="nomorIdentitas"
              className={`border-2 rounded-sm p-2 w-full ${formik.touched.nomorIdentitas && formik.errors.nomorIdentitas ? "border-red-300" : ""}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nomorIdentitas}
            />
            {formik.touched.nomorIdentitas && formik.errors.nomorIdentitas ? (
              <p className="invalid-feedback">{formik.errors.nomorIdentitas}</p>
            ) : null}
          </div>
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="instansi">
            Instansi/Lembaga
          </label>
          <input
            type="text"
            name="instansi"
            id="instansi"
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.instansi && formik.errors.instansi ? "border-red-300" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.instansi}
          />
          {formik.touched.instansi && formik.errors.instansi ? (
            <p className="invalid-feedback">{formik.errors.instansi}</p>
          ) : null}
        </div>
        <div className="w-full flex flex-col">
          <label className="" htmlFor="email">
            Email
          </label>
          <input
            type="text"
            name="email"
            id="email"
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.email && formik.errors.email ? "border-red-300" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <p className="invalid-feedback">{formik.errors.email}</p>
          ) : null}
        </div>
        <div className="w-full flex flex-col">
          <label className="" htmlFor="telepon">
            Telepon
          </label>
          <input
            type="text"
            name="telepon"
            id="telepon"
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.telepon && formik.errors.telepon ? "border-red-300" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.telepon}
          />
          {formik.touched.telepon && formik.errors.telepon ? (
            <p className="invalid-feedback">{formik.errors.telepon}</p>
          ) : null}
        </div>
        <div className="w-full flex flex-col">
          <label className="" htmlFor="jenisInformasi">
            Jenis Permohonan Informasi Publik
          </label>
          <select
            name="jenisInformasi"
            id="jenisInformasi"
            className="border-2 rounded-sm p-2"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.jenisInformasi}
          >
            <option value="none">-none-</option>
            <option value="keberatan">keberatan</option>
            <option value="baru">baru</option>
          </select>
        </div>
        <div className="w-full flex flex-col">
          <label className="" htmlFor="alasan">
            Alasan Penggunaan Informasi
          </label>
          <textarea
            name="alasan"
            id="alasan"
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.alasan && formik.errors.alasan ? "border-red-300" : ""}`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.alasan}
          />
          {formik.touched.alasan && formik.errors.alasan ? (
            <p className="invalid-feedback">{formik.errors.alasan}</p>
          ) : null}
        </div>

        <Button
          className="w-fit bg-primaryYellow font-semibold px-20 shadow-sm mt-10"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};
