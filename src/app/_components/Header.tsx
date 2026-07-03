"use client";

import { Film, ChevronDown, Search, ImageOff, X, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import Link from "next/link";

type Genre = { id: number; name: string };
type MovieResult = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
};

export const Header = () => {
  const router = useRouter();

  const [openGenre, setOpenGenre] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<Genre | null>(null);
  const [q, setQ] = useState("");

  const [results, setResults] = useState<MovieResult[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const genreRef = useRef<HTMLDivElement>(null);

  // Fetch genres
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

  // Search as user types
  useEffect(() => {
    const text = q.trim();
    if (!text) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const t = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(text)}&language=en-US&page=1`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
              accept: "application/json",
            },
          },
        );
        const data = await res.json();
        setResults((data.results || []).slice(0, 6));
        setShowDropdown(true);
      } catch {
        setResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);

    return () => clearTimeout(t);
  }, [q]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setOpenGenre(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pickGenre = (g: Genre | null) => {
    setSelected(g);
    setOpenGenre(false);
    setQ("");
    setShowDropdown(false);

    if (!g) router.push("/discover");
    else
      router.push(`/discover?genre=${g.id}&name=${encodeURIComponent(g.name)}`);
  };

  const handleMovieClick = () => {
    setShowDropdown(false);
    setQ("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && q.trim()) {
      setShowDropdown(false);
      router.push(`/discover?q=${encodeURIComponent(q.trim())}`);
    }
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-muted border-b">
      <div className="h-[59px] flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Film className="text-indigo-700" />
          <p className="text-indigo-700 font-semibold">MovieZ</p>
        </Link>

        {/* Center: Genre + Search */}
        <div className="flex items-center gap-3">
          {/* Genre dropdown */}
          <div className="relative" ref={genreRef}>
            <button
              onClick={() => setOpenGenre((v) => !v)}
              className="h-10 px-3 rounded-md border flex items-center gap-2 text-sm bg-muted"
            >
              <span>{selected ? selected.name : "Genre"}</span>
              <ChevronDown className="size-4 opacity-70" />
            </button>

            {openGenre && (
              <div className="absolute mt-2 w-64 rounded-xl border bg-muted shadow-lg p-2 z-50">
                <button
                  onClick={() => pickGenre(null)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-sm"
                >
                  All
                </button>
                <div className="max-h-72 overflow-auto">
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => pickGenre(g)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-accent text-sm"
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search input + dropdown */}
          <div className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (results.length > 0) setShowDropdown(true);
                }}
                placeholder="Search movies..."
                className="h-10 w-[380px] max-w-[50vw] rounded-md border pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-indigo-200 bg-background"
              />
              {q && (
                <button
                  onClick={() => {
                    setQ("");
                    setResults([]);
                    setShowDropdown(false);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            {/* Results dropdown */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 w-full rounded-xl border bg-background shadow-xl z-50 overflow-hidden"
              >
                {loadingSearch ? (
                  <div className="flex flex-col gap-1 p-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg"
                      >
                        <div className="w-8 h-12 rounded bg-muted animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                          <div className="h-3 w-3/4 bg-muted rounded animate-pulse" />
                          <div className="h-3 w-1/2 bg-muted rounded animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No results found
                  </div>
                ) : (
                  <ul className="p-2">
                    {results.map((movie) => (
                      <li key={movie.id}>
                        <Link
                          href={`/movie/${movie.id}`}
                          onClick={handleMovieClick}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition"
                        >
                          {/* Poster */}
                          <div className="w-8 h-12 rounded overflow-hidden shrink-0 bg-muted">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full grid place-items-center">
                                <ImageOff className="size-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {movie.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <span className="inline-flex items-center gap-1">
                                <Star className="size-3.5 text-yellow-500" aria-hidden="true" />
                                {movie.vote_average.toFixed(1)}
                              </span>
                              {movie.release_date && (
                                <>
                                  <span>·</span>
                                  <span>{movie.release_date.slice(0, 4)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}

                    {/* See all results */}
                    <li className="border-t mt-1 pt-1">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          router.push(
                            `/discover?q=${encodeURIComponent(q.trim())}`,
                          );
                        }}
                        className="w-full text-left px-2 py-2 text-sm text-indigo-600 hover:bg-muted rounded-lg transition flex items-center gap-2"
                      >
                        <Search className="size-4" />
                        See all results for &quot;{q}&quot;
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>

        <ModeToggle />
      </div>
    </header>
  );
};
