"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

import css from "./NoteDetails.module.css";

const NoteDetails = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading note...</p>;
  if (isError) return <p>Something went wrong. Please try again.</p>;
  if (!note) return <p>Note not found.</p>;

  return (
    <main className={css.page}>
      <article className={css.card}>
        <h1 className={css.title}>{note.title}</h1>

        <div className={css.divider} />

        <span className={css.tag}>{note.tag}</span>

        <p className={css.content}>{note.content}</p>

        <div className={css.dates}>
          <span>
            Created: {new Date(note.createdAt).toLocaleDateString("uk-UA")}
          </span>
          <span>
            Updated: {new Date(note.updatedAt).toLocaleDateString("uk-UA")}
          </span>
        </div>
      </article>
    </main>
  );
};

export default NoteDetails;
