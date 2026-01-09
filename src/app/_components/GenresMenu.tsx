"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

type Genre = {
  id: number;
  name: string;
};

export const GenresMenu = () => {
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
      setGenres(data.genres || []);
    };

    fetchGenres();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm w-full">
      {/* Title Section */}
      <h1 className="text-4xl font-bold mb-1">Genres</h1>
      <p className="text-lg text-gray-600 mb-6">See lists of movies by genre</p>

      <hr className="mb-6" />

      {/* Genre Buttons */}
      <div className="flex flex-wrap gap-3">
        {genres.map((g) => (
          <button
            key={g.id}
            className="flex items-center gap-1 px-4 py-2 bg-gray-100 
                       rounded-full border hover:bg-gray-200 transition"
          >
            {g.name}
            <ChevronRight className="size-4" />
          </button>
        ))}
      </div>
    </div>
  );
};
