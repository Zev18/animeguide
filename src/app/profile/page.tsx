"use client";

import { userAtom } from "@/atoms";
import supabase from "@/utils/supabaseClient";
import { Button, Input } from "@nextui-org/react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import UsernameCheck from "./UsernameCheck";

export default function Profile() {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const [submitting, setSubmitting] = React.useState(false);
  const [username, setUsername] = useState("");
  const [usernameValid, setUsernameValid] = useState("");
  const [displayName, setDisplayName] = useState(user?.displayName);
  const [malId, setMalId] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      await checkUsername();
    }, 200);

    const checkUsername = async () => {
      const { count } = await supabase
        .from("users")
        .select("*", { count: "estimated", head: true })
        .eq("username", username);

      setUsernameValid(count === 0 ? "true" : "false");
    };

    setUsernameValid("loading");
    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const usernameSchema = z
    .string({ required_error: "Username is required" })
    .max(30, "Username is too long.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores.",
    );

  const displayNameSchema = z
    .string()
    .max(30, "Display name is too long.")
    .optional();

  const malIdSchema = z
    .string()
    .max(16, "MAL ID is too long.")
    .regex(
      /^[a-zA-Z0-9\-._~:/?#\[\]@!$&'()*+,;=]*$/,
      "Invalid character detected",
    )
    .optional();

  const userSchema = z.object({
    username: usernameSchema,
    displayName: displayNameSchema.optional(),
    malId: malIdSchema.optional(),
  });

  const isUsernameValid = useMemo(() => {
    if (!username) {
      return true;
    }
    return usernameSchema.safeParse(username).success;
  }, [username, usernameSchema]);

  const isDisplayNameValid = useMemo(() => {
    return displayNameSchema.safeParse(displayName).success;
  }, [displayName, displayNameSchema]);

  const isMalIdValid = useMemo(() => {
    if (!malId) {
      return true;
    }
    return malIdSchema.safeParse(malId).success;
  }, [malId, malIdSchema]);

  const usernameErrorMessage = useMemo(() => {
    const errors = usernameSchema.safeParse(username);
    if (!errors.success && username != "") {
      return errors.error.issues[0].message;
    }
  }, [username, usernameSchema]);

  const displayNameErrorMessage = useMemo(() => {
    const errors = displayNameSchema.safeParse(displayName);
    if (!errors.success && displayName != "") {
      return errors.error.issues[0].message;
    }
  }, [displayName, displayNameSchema]);

  const malIdErrorMessage = useMemo(() => {
    const errors = malIdSchema.safeParse(malId);
    if (!errors.success && malId != "") {
      return errors.error.issues[0].message;
    }
  }, [malId, malIdSchema]);

  const handleSubmit = async (e: React.FormEvent) => {
    setSubmitting(true);
    try {
      userSchema.parse({ username, displayName, malId });

      const { data, error } = await supabase
        .from("users")
        .update({
          username: username,
          display_name: displayName,
          mal_id: malId,
        })
        .eq("id", user!.id);
      console.log(error);

      if (error) {
        console.error(error);
      } else {
        console.log(data);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold">Finish setting up your profile</h1>
        <p className="text-lg text-slate-500">
          You need to finish setting up your profile first.
        </p>
      </div>
      <form
        className="my-10 flex max-w-sm flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <Input
          isRequired
          value={username}
          onValueChange={setUsername}
          color={
            isUsernameValid && usernameValid !== "false"
              ? usernameValid !== "true"
                ? "default"
                : "success"
              : "danger"
          }
          errorMessage={
            usernameErrorMessage
              ? usernameErrorMessage
              : usernameValid === "false"
              ? "Username already taken."
              : undefined
          }
          type="text"
          label="Username"
          variant="bordered"
          description="Your unique account username."
          classNames={{
            description: "text-sm",
            errorMessage: "text-sm",
          }}
          endContent={<UsernameCheck status={usernameValid} />}
        />
        <Input
          value={displayName}
          onValueChange={setDisplayName}
          color={isDisplayNameValid ? "default" : "danger"}
          errorMessage={
            displayNameErrorMessage ? displayNameErrorMessage : undefined
          }
          type="text"
          label="Display name"
          variant="bordered"
          defaultValue={user?.displayName}
          description="The name that other people will see. Can be anything."
          classNames={{
            description: "text-sm",
            errorMessage: "text-sm",
          }}
        />
        <Input
          value={malId}
          onValueChange={setMalId}
          color={isMalIdValid ? "default" : "danger"}
          errorMessage={malIdErrorMessage ? malIdErrorMessage : undefined}
          type="text"
          label="MAL ID"
          variant="bordered"
          description="Connect your MyAnimeList account to sync your watchlist."
          startContent={
            <div className="pointer-events-none flex items-center">
              <span className="text-small text-foreground-500">
                https://myanimelist.net/profile/
              </span>
            </div>
          }
          classNames={{
            description: "text-sm",
            errorMessage: "text-sm",
          }}
        />
        <Button
          className="my-10 max-w-min self-end p-6"
          color="primary"
          variant="shadow"
          type="submit"
          isDisabled={
            !isUsernameValid ||
            !isDisplayNameValid ||
            !isMalIdValid ||
            usernameValid === "false"
          }
          isLoading={submitting}
        >
          Done
        </Button>
      </form>
    </div>
  );
}
