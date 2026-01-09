"use client";

import { useState } from "react";
import { GenresButton } from "./GenresButton";
import { GenreList } from "./GenreList";

export const GenreSection = () => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen(!open);

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <GenresButton open={open} onToggle={handleToggle} />

      {open && <GenreList />}
    </div>
  );
};
