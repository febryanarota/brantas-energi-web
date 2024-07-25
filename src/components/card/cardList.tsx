import { card } from "@prisma/client";
import { Trash } from "lucide-react";
import Image from "next/image";

export const ListComponent = ({
  card,
  isRequest,
  role,
}: {
  card: card;
  isRequest?: boolean;
  role: string;
}) => {
  const handleDelete = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_URL}/api/card/${card.id}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

  return (
    <div className="w-full bg-slate-100 rounded-md p-2 flex flex-row">
      <div className="w-[5rem] h-[5rem] bg-slate-300 rounded-md overflow-hidden">
        <a
          href={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${card.image}`}
          target="_blank"
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_STORAGE_URL}/${card.image}`}
            width={100}
            height={100}
            alt=""
            className="w-full h-full object-cover"
          />
        </a>
      </div>
      <div className="flex flex-col text-sm ml-3 flex-1">
        <a className="font-semibold" href={card.link as string}>
          {card.title}
        </a>
        {/* make description elipsis... */}
        <div
          className="ProseMirror whitespace-pre-line text-sm text-justify"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: card.description as string }}
        />
      </div>
      <div className="ml-auto">
        {!(role === "admin" && isRequest) && (
          <button>
            <Trash
              className="mt-1 hover:bg-red-100 rounded-full p-1"
              width={30}
              height={30}
              onClick={handleDelete}
            />
          </button>
        )}
      </div>
    </div>
  );
};
