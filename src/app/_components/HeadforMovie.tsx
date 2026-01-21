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

export const HeadForMovie = () => {
  const [movies, setMovies] = useState<MovieProps[]>([]);

  const [open, setOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerTitle, setTrailerTitle] = useState<string>("Trailer");
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            accept: "application/json",
          },
        },
      );
      const data = await res.json();
      setMovies(data.results.slice(0, 3));
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

      const data: { results: TMDBVideo[] } = await res.json();

      const trailer =
        data.results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer",
        ) ?? data.results.find((v) => v.site === "YouTube");

      if (!trailer) {
        setOpen(true);
        return;
      }

      setTrailerKey(trailer.key);
      setOpen(true);
    } catch (e) {
      console.error(e);
      setOpen(true);
    } finally {
      setLoadingTrailer(false);
    }
  };

  return (
    <>
      <Carousel>
        <CarouselContent>
          {movies.map((movie, index) => (
            <CarouselItem key={index} className="relative h-full">
              <Card className="py-0 rounded-none w-full">
                <CardContent className="p-0">
                  <img
                    className="w-full aspect-[5/2] object-cover object-center"
                    src={
                      "https://image.tmdb.org/t/p/original" +
                      movie.backdrop_path
                    }
                    alt={movie.title}
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
