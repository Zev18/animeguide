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

  const deleteAnime = (anime: Record<string, any>) => {
    const index = animes.findIndex((item) => item.id === anime.id);
    if (index !== -1) {
      const newAnimes = [...animes];
      newAnimes.splice(index, 1);
      callback(newAnimes);
    }
  };

  return animes.length > 0 ? (
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
                    <AnimeCard anime={anime} callback={deleteAnime} />
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  ) : (
    <p className="m-12 text-sm text-foreground-400">
      No animes yet. Click the button above to add some.
    </p>
  );
}
