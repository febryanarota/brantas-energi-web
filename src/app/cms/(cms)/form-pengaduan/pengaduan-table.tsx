"use client";

import { exportToExcel } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Button,
} from "@nextui-org/react";
import { pengaduan } from "@prisma/client";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function TableComponent() {
  const [data, setData] = useState<pengaduan[]>([]);
  const [sortDateAscending, setSortDateAscending] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPage, setTotalPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(
      `/api/pengaduan?page=${page}&limit=${limit}&sortDate=${sortDateAscending ? "asc" : "desc"}&searchName=${searchName}`,
    )
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        setData(res.data);
        setTotalPage(res.pagination.totalPage);
        setIsLoading(false);
      });
  }, [page, limit, sortDateAscending, searchName]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1); // Start from the current page minus one
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1); // End at the current page plus max visible

    // Adjust the start page if the end page is at the limit
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - (maxVisiblePages - 1));
    }

    return { startPage, endPage };
  };

  const handleExport = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_URL}/api/pengaduan?limit=0`).then(
      async (res) => {
        const exportData = await res.json();
        exportToExcel(exportData.data);
      },
    );
  };

  return (
    <div>
      <div className="flex flex-row space-x-5 my-4 justify-between">
        <div className="grow flex flex-row items-center space-x-2">
          <button
            className="py-1 px-2 rounded-md bg-sky-800 text-white text-sm"
            onClick={handleExport}
          >
            Export
          </button>
          <input
            type="text"
            className="bg-white grow max-w-xl px-5 py-1 rounded-md shadow-sm"
            placeholder="Search by name.."
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button>
            <Search className="text-sky-900 font-bold" />
          </button>
        </div>
        <div className="flex flex-row space-x-3 items-center">
          <label htmlFor="limit">Limit per page</label>
          <select
            name="limit"
            className="rounded-md shadow-sm w-[4rem] px-2 py-1"
            id="limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
              setSearchName("");
            }}
          >
            <option value="3">3</option>
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableColumn className="bg-sky-800"> </TableColumn>
          <TableColumn
            className="bg-sky-800 text-white flex flex-row items-center justify-between hover:cursor-pointer"
            onClick={() => setSortDateAscending(!sortDateAscending)}
          >
            Tanggal
            {sortDateAscending ? <ChevronUp /> : <ChevronDown />}
          </TableColumn>
          <TableColumn className="bg-sky-800 text-white">Judul</TableColumn>
          <TableColumn className="bg-sky-800 text-white">Uraian</TableColumn>
          <TableColumn className="bg-sky-800 text-white">
            Nama Terduga
          </TableColumn>
          <TableColumn className="bg-sky-800 text-white">
            Jabatan Terduga
          </TableColumn>
          <TableColumn className="bg-sky-800 text-white">Lampiran</TableColumn>
          <TableColumn className="bg-sky-800 text-white">
            Nama Pelapor
          </TableColumn>
          <TableColumn className="bg-sky-800 text-white">
            Email Pelapor
          </TableColumn>
          <TableColumn className="bg-sky-800 text-white">
            Telepon Pelapor
          </TableColumn>
        </TableHeader>

        {isLoading ? (
          <TableBody emptyContent={"Loading..."}>{[]}</TableBody>
        ) : data.length > 0 ? (
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="align-text-top">
                  {index + 1 + (page - 1) * limit}
                </TableCell>
                <TableCell className="align-text-top min-w-[10rem]">
                  {new Date(row.created_at).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell className="align-text-top min-w-[10rem]">
                  {row.judul}
                </TableCell>
                <TableCell className="align-text-top">
                  <div className="min-w-[25rem] max-h-[10rem] h-fit overflow-auto">
                    {row.uraian}
                  </div>
                </TableCell>
                <TableCell className="align-text-top">
                  {row.nama_terduga}
                </TableCell>
                <TableCell className="align-text-top">
                  {row.jabatan_terduga}
                </TableCell>
                <TableCell className="align-text-top">
                  <div className=" max-w-[10rem] overflow-clip">
                    <a
                      href={`${process.env.NEXT_PUBLIC_FILE_STORAGE_URL}/${row.link_lampiran}`}
                      target="_blank"
                    >
                      {row.link_lampiran ?? "-"}
                    </a>
                  </div>
                </TableCell>
                <TableCell className="align-text-top">
                  {!row.nama_pelapor || row.nama_pelapor === ""
                    ? "-"
                    : row.nama_pelapor}
                </TableCell>
                <TableCell className="align-text-top">
                  {!row.email_pelapor || row.email_pelapor === ""
                    ? "-"
                    : row.email_pelapor}
                </TableCell>
                <TableCell className="align-text-top">
                  {!row.telepon_pelapor || row.telepon_pelapor === ""
                    ? "-"
                    : row.telepon_pelapor}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody emptyContent={"Empty data."}>{[]}</TableBody>
        )}
      </Table>

      {/* Pagination */}
      <div className="flex mt-4 flex-row justify-between">
        <div>
          {(() => {
            const { startPage, endPage } = getPaginationRange(page, totalPage);
            return Array.from(
              { length: endPage - startPage + 1 },
              (_, i) => startPage + i,
            ).map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`px-4 py-2 mx-1 rounded-md ${
                  pageNumber === page
                    ? "bg-sky-800 text-white"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                {pageNumber}
              </button>
            ));
          })()}
        </div>

        <div>
          <Button
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
            className="px-4 py-2 mx-1 bg-sky-800 hover:bg-sky-900 disabled:opacity-50 text-white"
          >
            Prev
          </Button>
          <Button
            disabled={page >= totalPage}
            onClick={() => handlePageChange(page + 1)}
            className="px-4 py-2 mx-1 bg-sky-800 hover:bg-sky-900 disabled:opacity-50 text-white"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
