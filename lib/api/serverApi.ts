import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import api from "./api";
import type { Note } from "@/types/note";
import type { User } from "@/types/user";
import type { FetchNotesParams, FetchNotesResponse } from "./clientApi";

async function getCookieHeader() {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export async function fetchNotes({
  tag,
  ...params
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const cookie = await getCookieHeader();

  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      ...params,
      ...(tag && tag !== "all" ? { tag } : {}),
    },
    headers: {
      Cookie: cookie,
    },
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookie = await getCookieHeader();

  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookie,
    },
  });

  return data;
}

export async function getMe(): Promise<User> {
  const cookie = await getCookieHeader();

  const { data } = await api.get<User>("/users/me", {
    headers: {
      Cookie: cookie,
    },
  });

  return data;
}

export async function checkSession(): Promise<
  AxiosResponse<{ success: boolean }>
> {
  const cookie = await getCookieHeader();

  return api.get<{ success: boolean }>("/auth/session", {
    headers: {
      Cookie: cookie,
    },
  });
}
