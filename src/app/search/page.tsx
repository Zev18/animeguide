"use client";

import ClientOnly from "@/components/ClientOnly";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import supabase from "@/utils/supabaseClient";
import { searchAnimeClient } from "@/utils/utils";
import { Input } from "@nextui-org/input";
import { Spinner } from "@nextui-org/spinner";
import { Tab, Tabs } from "@nextui-org/tabs";
import { debounce } from "lodash";
import { SearchIcon } from "lucide-react";
import { Key, useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import GuideCard from "../anime/[id]/GuideCard";
import AnimeCard from "./AnimeCard";
import UserCard from "./UserCard";
import { useRouter } from "next/navigation";

export default function Search() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<Record<string, any>[]>([]);
  const [animes, setAnimes] = useState<Record<string, any>[]>([]);
  const [guides, setGuides] = useState<Record<string, any>[]>([]);

  const [nextAnimes, setNextAnimes] = useState(false);
  const [nextGuides, setNextGuides] = useState(true);
  const [nextUsers, setNextUsers] = useState(true);

  const [loading, setLoading] = useState(false);

  const { isBelowSm } = useBreakpoint("sm");
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState<Key>("animes");

  const LIMIT = 10;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(
    debounce(async (text: string) => {
      if (text == "") {
        setUsers([]);
        setAnimes([]);
        setGuides([]);
      } else {
        const [newUsers, newGuides, newAnimes] = await Promise.all([
          supabase
            .rpc("search_users", { query: text })
            .range(users.length, LIMIT),
          supabase
            .rpc("search_guides", { query: text })
            .range(guides.length, LIMIT),
          text.length > 2
            ? searchAnimeClient(text, LIMIT, animes.length, "mean")
            : [],
        ]);
        newUsers.data && setUsers(newUsers.data);
        newAnimes.data && setAnimes(newAnimes.data);
        if (!newUsers.data || newUsers.data.length < LIMIT) setNextUsers(false);
        if (!newGuides.data || newGuides.data.length < LIMIT)
          setNextGuides(false);
        console.log(newAnimes);
        if (
          newAnimes.data &&
          newAnimes.data.length > 0 &&
          newAnimes.paging.next
        ) {
          setNextAnimes(!!newAnimes.paging.next);
        }
        newGuides.data && setGuides(newGuides.data);
      }
      setLoading(false);
    }, 300),
    [],
  );

  useEffect(() => {
    console.log(nextAnimes);
  }, [nextAnimes]);

  const fetchNextAnimes = async () => {
    const newAnimes = await searchAnimeClient(
      query,
      LIMIT,
      animes.length,
      "mean",
    );
    setNextAnimes(!!newAnimes.paging.next);
    const newAnimesUnique = newAnimes.data.filter(
      (result: Record<string, any>) =>
        !animes.some(
          (existingResult: Record<string, any>) =>
            existingResult.node.id === result.node.id,
        ),
    );
    setAnimes((prev) => [...prev, ...newAnimesUnique]);
  };

  const fetchNextGuides = async () => {
    const { data: newGuides } = await supabase
      .rpc("search_guides", { query: query })
      .range(guides.length, LIMIT);

    if (!newGuides) {
      setNextGuides(false);
      return;
    }
    if (newGuides.length < LIMIT) setNextGuides(false);
    setGuides((prev) => [...prev, ...newGuides]);
  };

  const fetchNextUsers = async () => {
    const { data: newUsers } = await supabase
      .rpc("search_users", { query: query })
      .range(guides.length, LIMIT);

    if (!newUsers) {
      setNextGuides(false);
      return;
    }
    if (newUsers.length < LIMIT) setNextUsers(false);
    setUsers((prev) => [...prev, ...newUsers]);
  };

  const handleChange = async (text: string) => {
    setLoading(true);
    setQuery(text);
    search(text);
  };

  return (
    <div className="flex w-full justify-center">
      <div
        className="flex w-full max-w-xl flex-col gap-4"
        suppressHydrationWarning
      >
        <div>
          <h1 className="text-2xl font-bold">Discover</h1>
          <h3 className="text-foreground-400">
            Search for an anime, guide, or user.
          </h3>
        </div>
        <Input
          placeholder="Search..."
          startContent={<SearchIcon />}
          value={query}
          onValueChange={handleChange}
          variant="bordered"
          isClearable
        />
        {query == "" ? (
          <div className="m-10 flex justify-center">
            <p className="text-sm text-foreground-400">
              Enter a query above to see results.
            </p>
          </div>
        ) : (
          <Tabs
            aria-label="results-tabs"
            fullWidth={isBelowSm}
            selectedKey={currentTab}
            onSelectionChange={setCurrentTab}
          >
            <Tab key="animes" title="Animes">
              <InfiniteScroll
                next={fetchNextAnimes}
                hasMore={nextAnimes}
                dataLength={animes.length}
                style={{ overflow: "visible" }}
                loader={
                  <div className="my-2 flex w-full justify-center">
                    <Spinner size="sm" />
                  </div>
                }
                className="grid grid-cols-1 gap-4"
              >
                {loading ? (
                  <div className="m-10 flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  animes.map((anime: Record<string, any>) => (
                    <AnimeCard key={anime.node.id} anime={anime} />
                  ))
                )}
              </InfiniteScroll>
            </Tab>
            <Tab key="guides" title="Guides">
              <InfiniteScroll
                next={fetchNextGuides}
                hasMore={nextGuides}
                dataLength={guides.length}
                className="flex flex-col gap-4"
                style={{ overflow: "visible" }}
                loader={
                  <div className="my-2 flex w-full justify-center">
                    <Spinner size="sm" />
                  </div>
                }
              >
                {loading ? (
                  <div className="m-10 flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  guides.map((guide: Record<string, any>) => (
                    <GuideCard guide={guide} key={guide.id} />
                  ))
                )}
              </InfiniteScroll>
            </Tab>
            <Tab key="users" title="Users">
              <InfiniteScroll
                next={fetchNextUsers}
                hasMore={nextUsers}
                dataLength={users.length}
                className="flex flex-col gap-4"
                style={{ overflow: "visible" }}
                loader={
                  <div className="my-2 flex w-full justify-center">
                    <Spinner size="sm" />
                  </div>
                }
              >
                {loading ? (
                  <div className="m-10 flex justify-center">
                    <Spinner />
                  </div>
                ) : (
                  users.map((user: Record<string, any>) => (
                    <UserCard router={router} key={user.id} user={user} />
                  ))
                )}
              </InfiniteScroll>
            </Tab>
          </Tabs>
        )}
      </div>
    </div>
  );
}
