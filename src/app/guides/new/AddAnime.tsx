import AnimeResult from "@/app/reviews/new/AnimeResult";
import { searchAnimeClient } from "@/utils/utils";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { debounce } from "lodash";
import { useEffect, useState } from "react";
import { Plus } from "react-feather";
import InfiniteScroll from "react-infinite-scroll-component";

export default function AddAnime({
  animes,
  callback,
}: {
  animes: Record<string, any>[];
  callback: (animes: Record<string, any>[]) => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [animeQuery, setAnimeQuery] = useState("");
  const [animeResults, setAnimeResults] = useState<Record<string, any>[]>([]);
  const [nextResults, setNextResults] = useState<string | null>(null);
  const [selectedAnimes, setSelectedAnimes] = useState(animes);

  const debouncedApiCall = debounce(async (text: string) => {
    const results = await searchAnimeClient(text);
    setAnimeResults(results.data);
    results.paging?.next !== undefined
      ? setNextResults(results.paging.next)
      : setNextResults(null);
  }, 500);

  const handleAnimeQueryChange = async (text: string) => {
    setAnimeQuery(text);
    debouncedApiCall(text);
  };

  const fetchNextAnimeResults = async () => {
    if (!nextResults) return;
    const params = new URLSearchParams(new URL(nextResults).search);
    const results = await searchAnimeClient(
      params.get("q")!,
      Number(params.get("limit")),
      Number(params.get("offset")),
      params.get("fields") || undefined,
    );

    // Remove duplicates based on a unique identifier (e.g., 'id')
    const uniqueResults = results.data.filter(
      (result: Record<string, any>) =>
        !animeResults.some((existingResult) => existingResult.id === result.id),
    );

    setAnimeResults([...animeResults, ...uniqueResults]);
    setNextResults(results.paging.next || null);
  };

  const toggleSelectedAnime = (anime: Record<string, any>) => {
    const index = selectedAnimes.findIndex((item) => item.id === anime.id);

    if (index !== -1) {
      // Anime is in the array, remove it
      const newArray = [...selectedAnimes];
      newArray.splice(index, 1);
      setSelectedAnimes(newArray);
    } else {
      // Anime is not in the array, add it
      setSelectedAnimes([...selectedAnimes, anime]);
    }
  };

  useEffect(() => {
    setSelectedAnimes(animes);
  }, [animes]);

  return (
    <>
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">Animes</h2>
        <p className="text-foreground-400">Drag items to reorder them.</p>
      </div>
      <Button
        variant="shadow"
        startContent={<Plus size={16} />}
        onPress={onOpen}
      >
        Add anime
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Add animes</ModalHeader>
              <ModalBody>
                <Input
                  autoComplete="off"
                  isClearable
                  label="Search anime"
                  value={animeQuery}
                  onValueChange={handleAnimeQueryChange}
                  variant="faded"
                />
                <div className="mt-4 h-fit rounded-lg border-2 border-default-200 bg-default-100">
                  {animeQuery.length > 2 ? (
                    <>
                      {animeResults?.length > 0 ? (
                        <InfiniteScroll
                          next={fetchNextAnimeResults}
                          hasMore={!!nextResults && animeResults.length < 19}
                          endMessage={
                            animeResults.length > 19 ? (
                              <p className="w-full p-4 text-center text-sm text-default-500">
                                Still can&apos;t find it? Try a more specific
                                search.
                              </p>
                            ) : (
                              <p className="w-full p-4 text-center text-sm text-default-500">
                                No more results.
                              </p>
                            )
                          }
                          loader={
                            <div className="my-2 flex w-full justify-center">
                              <Spinner size="sm" />
                            </div>
                          }
                          height={300}
                          dataLength={animeResults.length}
                        >
                          {animeResults.map((anime) => {
                            return (
                              <AnimeResult
                                key={anime.node.id}
                                anime={anime.node}
                                selectedAnimes={selectedAnimes}
                                callback={(anime) => {
                                  toggleSelectedAnime(anime);
                                }}
                              />
                            );
                          })}
                        </InfiniteScroll>
                      ) : (
                        <div className="flex w-full justify-center py-10">
                          <Spinner />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="p-6 py-10 text-sm text-default-500">
                      Search for an anime to see results.
                    </p>
                  )}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button onPress={onClose} variant="flat">
                  Cancel
                </Button>
                <Button
                  color="primary"
                  variant="shadow"
                  onPress={() => {
                    onClose();
                    callback(selectedAnimes);
                  }}
                >
                  Add selected
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
