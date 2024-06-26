"use client";
import DraggableList from "@/components/draggableList/draggableList";
import { CMSContainer } from "@/components/ui/container";

export default function Page() {
  return (
    <div>
      <CMSContainer heading="Frequently Asked Questions">
        <DraggableList />
      </CMSContainer>
    </div>
  );
}
