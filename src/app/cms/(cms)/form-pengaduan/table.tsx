import React from "react";
import { pengaduan } from "@prisma/client";

// interface Pengaduan {
//   judul?: string;
//   uraian?: string;
//   nama_terduga?: string;
//   jabatan_terduga?: string;
//   nama_pelapor?: string;
//   email_pelapor?: string;
//   telepon_pelapor?: string;
//   link_lampiran?: string;
// }

export default function TablePengaduan({ data }: { data: pengaduan[] }) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Adjust the locale and options as needed
  };

  return (
    <div className="w-full">
      {data.length > 0 ? (
        <table className="bg-white w-full rounded-md shadow-md">
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Judul</th>
              <th>Uraian</th>
              <th>Nama Terduga</th>
              <th>Jabatan Terduga</th>
              <th>Lampiran</th>
              <th>Nama Pelapor</th>
              <th>Email Pelapor</th>
              <th>Telepon Pelapor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id}>
                <td>{item.created_at
                    ? new Intl.DateTimeFormat('en-GB').format(new Date(item.created_at))
                    : "-"}</td>
                <td>{item.judul}</td>
                <td>{item.uraian}</td>
                <td>{item.nama_terduga}</td>
                <td>{item.jabatan_terduga}</td>
                <td>
                  {item.link_lampiran ? (
                    <a
                      href={item.link_lampiran}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Lampiran
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td>{item.nama_pelapor ?? '-'}</td>
                <td>{item.email_pelapor ?? '-'}</td>
                <td>{item.telepon_pelapor ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Data</div>
      )}
    </div>
  );
}
