"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createNote } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";

import css from "./NoteForm.module.css";

const NoteForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (formData: FormData) => {
    const values = {
      title: String(formData.get("title") ?? ""),
      content: String(formData.get("content") ?? ""),
      tag: String(formData.get("tag") ?? "Todo") as NoteTag,
    };

    createMutation.mutate(values);
  };

  return (
    <form action={handleSubmit} className={css.form}>
      <label>
        Title
        <input
          className={css.input}
          name="title"
          defaultValue={draft.title}
          minLength={3}
          maxLength={50}
          required
          onChange={(event) => setDraft({ title: event.target.value })}
        />
      </label>

      <label>
        Content
        <textarea
          className={css.textarea}
          name="content"
          defaultValue={draft.content}
          maxLength={500}
          onChange={(event) => setDraft({ content: event.target.value })}
        />
      </label>

      <label>
        Tag
        <select
          className={css.select}
          name="tag"
          defaultValue={draft.tag}
          required
          onChange={(event) => setDraft({ tag: event.target.value as NoteTag })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </label>

      {createMutation.isError && (
        <p>Failed to create note. Please try again.</p>
      )}

      <div className={css.actions}>
        <button
          className={css.cancelButton}
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </button>

        <button
          className={css.submitButton}
          type="submit"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
