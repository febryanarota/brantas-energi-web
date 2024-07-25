import { createFileImage } from "@/lib/dataType";
import { X } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function FileImageList({
  data,
  setItems,
}: {
  data: createFileImage;
  setItems: Dispatch<SetStateAction<createFileImage[]>>;
}) {
  const handleDelete = () => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== data.id));
  };

  return (
    <div className={`bg-white shadow-sm w-full h-full p-3 rounded-md `}>
      <div className="flex flex-row items-start">
        {data.imagePreview && (
          <div className="w-[5rem] h-[5rem] rounded-md overflow-hidden">
            <Image
              src={data.imagePreview}
              alt={data.title}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div className="grow mx-3 ">
          <p>{data.title}</p>
          {data.fileName && (
            <p className="text-sm text-gray-600">{data.fileName}</p>
          )}
          {data.link && <p className="text-sm text-gray-600">{data.link}</p>}
        </div>
        <button onClick={handleDelete}>
          <X className="text-slate-300 hover:text-slate-600" />
        </button>
      </div>
    </div>
  );
}
