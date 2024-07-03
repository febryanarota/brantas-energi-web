"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useCallback, useState } from "react";
import Content from "../contents/content";
import { GripVertical } from "lucide-react";
import { contentBlock } from "@prisma/client";

export default function DraggableList({
  data,
}: {
  data: contentBlock[];
}) {
  const [items, setItems] = useState(data);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
    console.log(newItems);
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
