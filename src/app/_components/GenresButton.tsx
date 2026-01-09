"use client";

type GenreButtonProps = {
  open: boolean;
  onToggle: () => void;
};

export const GenresButton = ({ open, onToggle }: GenreButtonProps) => {
  return (
    <button
      onClick={onToggle}
      className="w-full flex justify-between items-center p-3 border rounded-lg"
    >
      <span className="text-lg font-semibold">Genre</span>
      <span>{open ? "▲" : "▼"}</span>
    </button>
  );
};
