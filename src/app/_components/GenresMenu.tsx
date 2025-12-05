"use client";

import { useEffect, useState } from "react";

type Genre = {
  id: number;
  name: string;
};

export default function GenresMenu() {
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?language=en`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_KEY}`,
          },
        }
      );

      const data = await res.json();
      setGenres(data.genres);
    };

    fetchGenres();
  }, []);

  return (
    <div className="w-full p-6">
      <h1 className="text-4xl font-bold mb-1">Genres</h1>
      <p className="text-lg text-gray-600 mb-4">See lists of movies by genre</p>

      <div className="flex flex-wrap gap-3 mt-4">
        {genres.map((g) => (
          <button
            key={g.id}
            className="px-4 py-2 bg-gray-100 rounded-full border hover:bg-gray-200 transition"
          >
            {g.name}
          </button>
        ))}
      </div>
    </div>
  );
}
