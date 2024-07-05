"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useCallback, useState } from "react";
import Content from "../contents/content";
import { GripVertical } from "lucide-react";
import { contentBlock } from "@prisma/client";
import { set } from "date-fns";

export default function DraggableList({
  data,
  session,
}: {
  data: contentBlock[];
  session : any;
}) {
  const [items, setItems] = useState(data);
  const [position, setPosition] = useState(data.map((item) => item.id));  

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);

    // PATCH request to update the order of the blocks to page API
    try {
      const newPosition = newItems.map((item) => item.id)

      if (JSON.stringify(position) !== JSON.stringify(newPosition) && items.length !== 0) {
        setPosition(newPosition)

        const res = await fetch(`/api/page/${items[0].page}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Cookie": `session=${session}`,
          },
          credentials: "include",
          body: JSON.stringify({
            positions: newPosition,
          }),
        });

        if (!res.ok) {
          throw new Error(res.statusText);
        }
      };

    } catch (error) {
      console.error("Error updating data:", error);
    }


  };

  const handleDelete = useCallback((id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {items.map((item, index) => (
              <Draggable
                key={item.id}
                draggableId={item.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="my-5 rounded-md flex flex-row"
                  >
                    <GripVertical className="mt-2 text-slate-500" />
                    <Content
                      block={item}
                      type={item.blockType}
                      deleteHandler={handleDelete}
                      session={session}
                    ></Content>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
