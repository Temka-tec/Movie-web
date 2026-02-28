"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MovieCard } from "./MovieCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type MovieSectionProps = {
  categoryName:
    | "popular"
    | "top_rated"
    | "upcoming"
    | "now_playing"
    | "trending_day"
    | "trending_week"
    | string;
  title?: string;
  showButton: boolean;
};

const SkeletonCard = () => (
  <div className="inline-block w-full">
    <div className="w-full aspect-[2/3] rounded-t-md bg-gray-200 animate-pulse" />
    <div className="w-full h-[100px] pl-3 bg-gray-100 rounded-b-lg">
      <div className="flex gap-2 items-center pt-4">
        <div className="size-4 rounded bg-gray-200 animate-pulse" />
        <div className="h-[16px] w-10 rounded bg-gray-200 animate-pulse" />
      </div>
      <div className="mt-2 h-[20px] w-3/4 rounded bg-gray-200 animate-pulse" />
      <div className="mt-2 h-[20px] w-1/2 rounded bg-gray-200 animate-pulse" />
    </div>
  </div>
);

export const MovieSection = (props: MovieSectionProps) => {
  const { categoryName, title = "", showButton } = props;

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
  const token = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

  const endpoint = useMemo(() => {
    const map: Record<string, string> = {
      popular: "/movie/popular",
      top_rated: "/movie/top_rated",
      upcoming: "/movie/upcoming",
      now_playing: "/movie/now_playing",
      trending_day: "/trending/movie/day",
      trending_week: "/trending/movie/week",
    };
    return map[categoryName] ?? "/movie/popular";
  }, [categoryName]);

  const sectionTitle = useMemo(() => {
    if (title.trim()) return title;
    return categoryName.replaceAll("_", " ");
  }, [title, categoryName]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setErrorText(null);

      try {
        if (!baseUrl) throw new Error("NEXT_PUBLIC_TMDB_BASE_URL is missing");
        if (!token) throw new Error("NEXT_PUBLIC_TMDB_API_TOKEN is missing");

        const url = `${baseUrl}${endpoint}?language=en-US&page=${currentPage}`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
          signal: controller.signal,
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`TMDB ${res.status}: ${text}`);
        }

        const data: MovieResponse = await res.json();

        setMovies(Array.isArray(data.results) ? data.results : []);
        setTotalPages(
          typeof data.total_pages === "number" ? data.total_pages : 1,
        );
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        console.error("Error fetching movies:", err);
        setMovies([]);
        setTotalPages(1);
        setErrorText(err?.message || "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [baseUrl, token, endpoint, currentPage]);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  console.log("BASE:", process.env.NEXT_PUBLIC_TMDB_BASE_URL);
  console.log("TOKEN:", process.env.NEXT_PUBLIC_TMDB_API_TOKEN);
  console.log("ENDPOINT:", endpoint);

  return (
    <div className="w-full flex flex-col items-center px-20 pb-8">
      <div className="w-full flex justify-between items-center mt-10 mb-5">
        <h2 className="text-4xl font-bold capitalize">{sectionTitle}</h2>

        {showButton && (
          <div className="flex gap-1 items-center cursor-pointer">
            <Link href={`/category/${categoryName}`}>
              <Button variant="link">See more</Button>
            </Link>
            <ArrowRight className="size-4" />
          </div>
        )}
      </div>

      {errorText && (
        <div className="w-full mb-4 text-sm text-red-600">{errorText}</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 items-start">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)
          : movies
              .slice(0, 10)
              .map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>

      <div className="flex justify-end mt-4 bg-muted">
        <Pagination className="w-fit m-0">
          <PaginationContent>
            <PaginationItem>
              <Button
                onClick={prevPage}
                disabled={currentPage === 1 || loading}
              >
                <ChevronLeft />
                Previous
              </Button>
            </PaginationItem>

            <PaginationItem>
              <Button disabled>{currentPage}</Button>
            </PaginationItem>

            <PaginationItem>
              <Button
                onClick={nextPage}
                disabled={currentPage === totalPages || loading}
              >
                <ChevronRight />
                Next
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};
