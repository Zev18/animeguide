"use client";

import { atom } from "jotai";
import User from "./types/user";

const userAtom = atom<User | null>(null);

export { userAtom };
