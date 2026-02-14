"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MovieCard } from "./MovieCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type MovieSectionProps = {
  categoryName: string;
  title?: string;
  showButton: boolean;
};

export const MovieSection = (props: MovieSectionProps) => {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const { categoryName, title = "", showButton } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const SkeletonCard = () => (
    <div className="inline-block w-full ">
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${categoryName}?language=en-US&page=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            },
          },
        );
        const data: MovieResponse = await res.json();

        setMovies(data.results || []);
        setTotalPages(data.total_pages);
      } catch (err) {
        console.error("Error fetching movies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryName, currentPage]);

  const nextPage = () => setCurrentPage((prev) => prev + 1);
  const prevPage = () => setCurrentPage((prev) => prev - 1);

  return (
    <div className="w-full flex flex-col items-center px-20 pb-8">
      <div className="w-full flex justify-between items-center mt-10 mb-5">
        <h2 className="text-4xl font-bold capitalize">
          {categoryName.replace("_", " ")}
        </h2>

        <div className="flex gap-1 items-center cursor-pointer">
          <Link
            href={`/category/${categoryName}`}
            className="text-[#09090B] hover:underline text-xl"
          >
            See More
          </Link>
          <ArrowRight className="size-4" />
        </div>
      </div>

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
                Previus
              </Button>
            </PaginationItem>

            <PaginationItem>
              <Button>{currentPage}</Button>
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
