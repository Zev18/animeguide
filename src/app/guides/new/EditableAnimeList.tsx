import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AnimeCard from "./AnimeCard";

export default function EditableAnimeList({
  animes,
  callback,
}: {
  animes: Record<string, any>[];
  callback: (animes: Record<string, any>[]) => void;
}) {
  const handleOnDragEnd = (result: Record<string, any>) => {
    if (!result.destination) return;
    const newAnimes = [...animes];
    const [reorderedAnime] = newAnimes.splice(result.source.index, 1);
    newAnimes.splice(result.destination.index, 0, reorderedAnime);

    callback(newAnimes);
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="animes">
        {(provided) => (
          <ul
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="w-full max-w-3xl"
          >
            {animes.map((anime, index) => (
              <Draggable
                key={anime.id.toString()}
                index={index}
                draggableId={anime.id.toString()}
              >
                {(provided) => (
                  <li
                    className="mb-2"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <AnimeCard anime={anime} />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
