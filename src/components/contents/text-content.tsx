import { text } from "@prisma/client";

export const TextContent = ({ content }: { content: text }) => {
  return (
    <div>
      {content.content ? (
        <div
          className="ProseMirror whitespace-pre-line text-sm text-justify"
          style={{ whiteSpace: "pre-line" }}
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      ) : (
        <div className="invalid-feedback">something went wrong</div>
      )}
    </div>
  );
};
