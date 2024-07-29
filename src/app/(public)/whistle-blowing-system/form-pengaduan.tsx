"use client";

import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ALLOWED_FILE_TYPES } from "@/lib/dataType";
import { sanitizeInput } from "@/lib/utils";
import { Button } from "@nextui-org/button";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function FormPengaduan() {
  const { toast } = useToast();

  const formik = useFormik({
    initialValues: {
      judul: "",
      uraian: "",
      namaTerduga: "",
      jabatanTerduga: "",
      namaPelapor: "",
      emailPelapor: "",
      teleponPelapor: "",
      lampiran: undefined,
    },
    validationSchema: Yup.object({
      judul: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      uraian: Yup.string()
        .max(200, "Must be 200 characters or less")
        .test("sanitize-input", "Please input a valid character", (value) => {
          const sanitizedValue = sanitizeInput(value as string);
          return sanitizedValue === value;
        })
        .required("Required"),
      namaTerduga: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      jabatanTerduga: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      lampiran: Yup.mixed()
        .test("fileSize", "The file is too large (max 10MB)", (value) => {
          if (!value) return true; // allow empty values
          return (value as File).size <= 10 * 1024 * 1024;
        })
        .test("fileType", "File format not supported", (value) => {
          if (!value) return true; // allow empty values
          return ALLOWED_FILE_TYPES.includes((value as File).type);
        }),
      namaPelapor: Yup.string().max(50, "Must be 50 characters or less"),
      emailPelapor: Yup.string().email("Email not valid"),
      teleponPelapor: Yup.string().max(50, "Must be 50 characters or less"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const formData = new FormData();
      formData.append("judul", values.judul);
      formData.append("uraian", values.uraian);
      formData.append("namaTerduga", values.namaTerduga);
      formData.append("jabatanTerduga", values.jabatanTerduga);
      formData.append("namaPelapor", values.namaPelapor);
      formData.append("emailPelapor", values.emailPelapor);
      formData.append("teleponPelapor", values.teleponPelapor);
      if (values.lampiran) {
        formData.append("lampiran", values.lampiran as File);
      }

      try {
        const response = await fetch("/api/pengaduan", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          // handle error
          throw new Error("Network response was not ok");
        }
        resetForm();
        toast({
          title: "Success!",
          description: "Form successfully submitted",
        });
      } catch (error) {
        toast({
          title: "Error!",
          description: "Form submission error",
          variant: "destructive",
        });
        console.error("Form submission error:", error);
      }
    },
  });

  return (
    <div className="flex flex-col items-center w-full mt-5">
      <p className="text-black font-medium max-w-2xl w-full mb-2">
        Pengisian Formulir Informasi data
      </p>
      <form
        onSubmit={formik.handleSubmit}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.judul}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.judul && formik.errors.judul ? "border-red-300" : ""}`}
          />
          {formik.touched.judul && formik.errors.judul ? (
            <p className="invalid-feedback">{formik.errors.judul}</p>
          ) : null}
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="uraian">
            Uraian Pengaduan
          </label>
          <textarea
            name="uraian"
            id="uraian"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.uraian}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.uraian && formik.errors.uraian ? "border-red-300" : ""}`}
          />
          {formik.touched.uraian && formik.errors.uraian ? (
            <p className="invalid-feedback">{formik.errors.uraian}</p>
          ) : null}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.namaTerduga}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.namaTerduga && formik.errors.namaTerduga ? "border-red-300" : ""}`}
          />
          {formik.touched.namaTerduga && formik.errors.namaTerduga ? (
            <p className="invalid-feedback">{formik.errors.namaTerduga}</p>
          ) : null}
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="jabatanTerduga">
            Jabatan
          </label>
          <input
            type="text"
            name="jabatanTerduga"
            id="jabatanTerduga"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.jabatanTerduga}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.jabatanTerduga && formik.errors.jabatanTerduga ? "border-red-300" : ""}`}
          />
          {formik.touched.jabatanTerduga && formik.errors.jabatanTerduga ? (
            <p className="invalid-feedback">{formik.errors.jabatanTerduga}</p>
          ) : null}
        </div>

        <div className="w-full flex flex-col text-gray-600">
          <label htmlFor="lampiran">Upload Lampiran</label>
          <Input
            id="lampiran"
            name="lampiran"
            type="file"
            onChange={(event) => {
              const file = event.currentTarget.files?.[0]; // Get the first selected file
              formik.setFieldValue("lampiran", file); // Update Formik's state
            }}
            onBlur={formik.handleBlur}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.lampiran && formik.errors.lampiran ? "border-red-300" : ""}`}
          />
          {formik.touched.lampiran && formik.errors.lampiran ? (
            <p className="invalid-feedback">{formik.errors.lampiran}</p>
          ) : null}
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
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.namaPelapor}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.namaPelapor && formik.errors.namaPelapor ? "border-red-300" : ""}`}
          />
          {formik.touched.namaPelapor && formik.errors.namaPelapor ? (
            <p className="invalid-feedback">{formik.errors.namaPelapor}</p>
          ) : null}
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="emailPelapor">
            Email Pelapor (Opsional)
          </label>
          <input
            type="text"
            name="emailPelapor"
            id="emailPelapor"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.emailPelapor}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.emailPelapor && formik.errors.emailPelapor ? "border-red-300" : ""}`}
          />
          {formik.touched.emailPelapor && formik.errors.emailPelapor ? (
            <p className="invalid-feedback">{formik.errors.emailPelapor}</p>
          ) : null}
        </div>

        <div className="w-full flex flex-col">
          <label className="" htmlFor="teleponPelapor">
            Telepon Pelapor (Opsional)
          </label>
          <input
            type="text"
            name="teleponPelapor"
            id="teleponPelapor"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.teleponPelapor}
            className={`border-2 rounded-sm p-2 w-full ${formik.touched.teleponPelapor && formik.errors.teleponPelapor ? "border-red-300" : ""}`}
          />
          {formik.touched.teleponPelapor && formik.errors.teleponPelapor ? (
            <p className="invalid-feedback">{formik.errors.teleponPelapor}</p>
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
}
