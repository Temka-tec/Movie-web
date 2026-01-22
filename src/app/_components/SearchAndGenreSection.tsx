"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

type Genre = { id: number; name: string };

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

type TMDBListResponse = {
  page: number;
  total_pages: number;
  total_results: number;
  results: Movie[];
};

export const SearchAndGenreSection = ({
  query,
}: {
  query: string; // Header-ээс ирэх search текст
}) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);

  // query хоосон эсэхийг цэвэрхэн шалгах
  const q = useMemo(() => query.trim(), [query]);
  const isSearching = q.length > 0;

  // 1) Genres татах
  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            accept: "application/json",
          },
        },
      );
      const data = await res.json();
      setGenres(data.genres || []);
    };

    fetchGenres();
  }, []);

  // 2) query эсвэл genre солигдоход page-г 1 болгох
  useEffect(() => {
    setPage(1);
  }, [q, selectedGenre?.id]);

  // 3) Movies татах (Search байвал Search API, үгүй бол Genre API)
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = "";

        if (isSearching) {
          // ✅ Search: Wicked гэх мэт
          url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            q,
          )}&language=en-US&page=${page}`;
        } else if (selectedGenre) {
          // ✅ Genre: Action гэх мэт
          url = `https://api.themoviedb.org/3/discover/movie?with_genres=${
            selectedGenre.id
          }&language=en-US&page=${page}&sort_by=popularity.desc`;
        } else {
          // ✅ Default (жишээ: popular)
          url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            accept: "application/json",
          },
        });

        const data: TMDBListResponse = await res.json();
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 1, 500)); // TMDB max 500
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [isSearching, q, selectedGenre?.id, page]);

  // Genre дархад: search байвал search-ийг дарж genre харуулах уу?
  // Энэ компонент дээр бол: genre дархад query-г өөр газар хадгалж байвал
  // чи query-г хоосолж болно. Одоохондоо логик нь:
  // query байвал search priority хэвээр байна.
  // Хэрвээ genre дархад шууд genre харуулахыг хүсвэл доорхи comment-г уншаарай.

  const headingTitle = isSearching
    ? `Search results`
    : selectedGenre
      ? selectedGenre.name
      : "Popular";

  const subTitle = isSearching
    ? `${movies.length} results for “${q}”`
    : selectedGenre
      ? `Movies in “${selectedGenre.name}”`
      : "Trending / popular movies";

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10">
        {/* LEFT: RESULTS */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{headingTitle}</h1>
          <p className="text-gray-600 mb-6">{subTitle}</p>

          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : movies.length === 0 ? (
            <div className="text-gray-600">No results</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {movies.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border bg-white overflow-hidden"
                >
                  <div className="aspect-[2/3] bg-gray-100">
                    {m.poster_path ? (
                      <img
                        className="w-full h-full object-cover"
                        src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                        alt={m.title}
                      />
                    ) : null}
                  </div>

                  <div className="p-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <span>⭐</span>
                      <span>{(m.vote_average ?? 0).toFixed(1)}/10</span>
                    </div>
                    <p className="font-medium text-sm line-clamp-2">
                      {m.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              className="px-3 py-2 rounded-md border disabled:opacity-40"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Previous
            </button>

            <div className="px-3 py-2 rounded-md border bg-white">{page}</div>

            <button
              className="px-3 py-2 rounded-md border disabled:opacity-40"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next ›
            </button>
          </div>
        </div>

        {/* RIGHT: GENRE */}
        <aside className="border-l pl-6">
          <h2 className="text-xl font-bold mb-1">Search by genre</h2>
          <p className="text-gray-600 mb-4">See lists of movies by genre</p>

          <div className="flex flex-wrap gap-2">
            {genres.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedGenre(g)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm transition
                  ${
                    selectedGenre?.id === g.id
                      ? "bg-black text-white"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
              >
                {g.name}
                <ChevronRight className="size-4" />
              </button>
            ))}
          </div>

          {selectedGenre && !isSearching && (
            <button
              onClick={() => setSelectedGenre(null)}
              className="mt-4 text-sm underline text-gray-600"
            >
              Clear genre
            </button>
          )}

          {/* Хэрвээ Search бичсэн үед genre дархад жанр шууд ажиллахыг хүсвэл:
              - Header дээр query-г set хийх state-г энэ компонент руу өргөж,
              - Genre дархад query-г "" болгоод genre-г ажиллуулна.
          */}
        </aside>
      </div>
    </div>
  );
};
