"use client";

import { useEffect, useState } from "react";

type Genre = {
  id: number;
  name: string;
};

export const GenreList = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGenres = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      setGenres(data.genres || []);
    } catch (err) {
      console.error("Genre fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="mt-4 border rounded-lg p-4">
      <h2 className="text-2xl font-bold">Genres</h2>
      <p className="text-gray-600 mb-3">See lists of movies by genre</p>

      <div className="flex flex-wrap gap-3">
        {genres.map((g) => (
          <span
            key={g.id}
            className="px-4 py-2 border rounded-full cursor-pointer hover:bg-gray-100"
          >
            {g.name}
          </span>
        ))}
      </div>
    </div>
  );
};
