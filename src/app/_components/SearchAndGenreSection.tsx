"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronRight, ImageOff } from "lucide-react";
import Link from "next/link";

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

const DiscoverCardSkeleton = () => {
  return (
    <div className="rounded-xl border bg-muted overflow-hidden block">
      <div className="aspect-[2/3] bg-gray-200 animate-pulse" />

      <div className="p-3">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

export const SearchAndGenreSection = () => {
  const sp = useSearchParams();

  const qFromUrl = (sp.get("q") ?? "").trim();
  const genreIdStr = sp.get("genre");
  const genreId = genreIdStr ? Number(genreIdStr) : null;
  const genreName = sp.get("name") ? decodeURIComponent(sp.get("name")!) : "";

  const [genres, setGenres] = useState<Genre[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const isSearching = qFromUrl.length > 0;

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

  useEffect(() => {
    setPage(1);
  }, [qFromUrl, genreId]);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        let url = "";

        if (isSearching) {
          url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
            qFromUrl,
          )}&language=en-US&page=${page}`;
        } else if (genreId) {
          url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}&sort_by=popularity.desc`;
        } else {
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
        setTotalPages(Math.min(data.total_pages || 1, 500));
      } catch (e) {
        console.error(e);
        setMovies([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [isSearching, qFromUrl, genreId, page]);

  const headingTitle = isSearching
    ? "Search results"
    : genreId
      ? genreName || "Genre"
      : "Popular";

  const subTitle = isSearching
    ? `Results for “${qFromUrl}”`
    : genreId
      ? `Movies in “${genreName || "this genre"}”`
      : "Trending / popular movies";

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">{headingTitle}</h1>
          <p className="text-gray-600 mb-6">{subTitle}</p>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <DiscoverCardSkeleton key={i} />
              ))}
            </div>
          ) : movies.length === 0 ? (
            <div className="text-gray-600">No results</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {movies.map((m) => (
                <Link
                  key={m.id}
                  href={`/movie/${m.id}`}
                  className="rounded-xl border bg-muted overflow-hidden block hover:shadow-md transition"
                >
                  <div className="aspect-[2/3] bg-gray-100">
                    {m.poster_path ? (
                      <img
                        className="w-full h-full object-cover"
                        src={`https://image.tmdb.org/t/p/w500${m.poster_path}`}
                        alt={m.title}
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-sm text-gray-500">
                        <ImageOff />
                      </div>
                    )}
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
                </Link>
              ))}
            </div>
          )}
        </div>

        <aside className="border-l pl-6">
          <h2 className="text-xl font-bold mb-1">Search by genre</h2>
          <p className="text-gray-600 mb-4">See lists of movies by genre</p>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/discover"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm bg-muted hover:bg-muted"
            >
              All <ChevronRight className="size-4" />
            </Link>

            {genres.map((g) => (
              <Link
                key={g.id}
                href={`/discover?genre=${g.id}&name=${encodeURIComponent(g.name)}`}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border text-sm transition ${
                  genreId === g.id
                    ? "bg-white text-black"
                    : "bg-muted hover:bg-muted"
                }`}
              >
                {g.name}
                <ChevronRight className="size-4" />
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};
