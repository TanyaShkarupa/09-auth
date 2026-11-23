"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";

import { fetchNoteById } from "@/lib/api/clientApi";
import type { Note } from "@/types/note";

import Modal from "@/components/Modal/Modal";

import css from "./NotePreview.module.css";

export default function NotePreview() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal onClose={() => router.back()}>
      <div className={css.container}>
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Close note preview"
          className={css.closeButton}
        >
          ✕
        </button>

        {isLoading && <p>Loading note...</p>}

        {isError && <p>Something went wrong. Please try again.</p>}

        {note && (
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
        )}
      </div>
    </Modal>
  );
}
