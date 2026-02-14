"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Introducton } from "./Introductun";

type TMDBVideo = {
  key: string;
  site: string;
  type: string;
  name: string;
};

const HeadSlideSkeleton = () => {
  return (
    <CarouselItem className="relative h-full">
      <Card className="py-0 rounded-none w-full">
        <CardContent className="p-0 relative">
          {/* backdrop skeleton */}
          <div className="w-full aspect-[5/2] bg-gray-200 animate-pulse" />

          {/* overlay skeleton (Introducton байрлалтай тааруулж absolute) */}
          <div className="absolute left-0 right-0 bottom-0 p-6 md:p-10">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="w-2/3 h-8 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="w-full max-w-xl h-16 bg-gray-200 rounded animate-pulse mb-5" />
            <div className="w-40 h-10 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </CarouselItem>
  );
};

export const HeadForMovie = () => {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [loadingMovies, setLoadingMovies] = useState(true);

  const [open, setOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState<string>("Trailer");
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      setLoadingMovies(true);
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
              accept: "application/json",
            },
          },
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`TMDB error ${res.status}: ${text}`);
        }

        const data = await res.json();
        setMovies((data.results || []).slice(0, 3));
      } catch (e) {
        console.error(e);
        setMovies([]);
      } finally {
        setLoadingMovies(false);
      }
    }

    fetchMovies();
  }, []);

  const handleWatchTrailer = async (movieId: number, title: string) => {
    try {
      setLoadingTrailer(true);
      setTrailerKey(null);
      setTrailerTitle(title);

      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            accept: "application/json",
          },
        },
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`TMDB error ${res.status}: ${text}`);
      }

      const data: { results: TMDBVideo[] } = await res.json();

      const trailer =
        data.results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer",
        ) ?? data.results.find((v) => v.site === "YouTube");

      setTrailerKey(trailer?.key ?? null);
      setOpen(true);
    } catch (e) {
      console.error(e);
      setTrailerKey(null);
      setOpen(true);
    } finally {
      setLoadingTrailer(false);
    }
  };

  return (
    <>
      <Carousel>
        <CarouselContent>
          {loadingMovies
            ? Array.from({ length: 3 }).map((_, i) => (
                <HeadSlideSkeleton key={i} />
              ))
            : movies.map((movie) => (
                <CarouselItem key={movie.id} className="relative h-full">
                  <Card className="py-0 rounded-none w-full">
                    <CardContent className="p-0">
                      <img
                        className="w-full aspect-[5/2] object-cover object-center"
                        src={
                          "https://image.tmdb.org/t/p/original" +
                          movie.backdrop_path
                        }
                        alt={movie.title}
                        loading="lazy"
                      />

                      <Introducton
                        name="Now Playing:"
                        moviename={movie.title}
                        rating={movie.vote_average}
                        description={movie.overview}
                        btn={loadingTrailer ? "Loading..." : "Watch Trailer"}
                        onWatchTrailer={() =>
                          handleWatchTrailer(movie.id, movie.title)
                        }
                      />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
        </CarouselContent>

        <CarouselNext className="w-fit h-fit p-4 rounded-full bg-[#F4F4F5] absolute right-6" />
        <CarouselPrevious className="w-fit h-fit p-4 rounded-full bg-[#F4F4F5] absolute left-6" />
      </Carousel>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setTrailerKey(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{trailerTitle}</DialogTitle>
          </DialogHeader>

          <div className="w-full aspect-video rounded-md overflow-hidden">
            {trailerKey ? (
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="YouTube trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {loadingTrailer ? "Loading trailer..." : "Trailer not found"}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
