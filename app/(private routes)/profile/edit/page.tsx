"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState(user?.username ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  if (!user) {
    return null;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const updatedUser = await updateMe({ username });
      setUser(updatedUser);
      router.push("/profile");
    } catch {
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.profileCard} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Edit profile</h1>

        <Image
          src={user.avatar}
          alt="User avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <div className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              className={css.input}
              type="text"
              name="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <p>Email: {user.email}</p>
        </div>

        {errorMessage && <p role="alert">{errorMessage}</p>}

        <div className={css.actions}>
          <button className={css.saveButton} type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            className={css.cancelButton}
            type="button"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>
      </form>
    </main>
  );
}
