import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Introducton } from "./Introductun";

import React, { useEffect, useState } from "react";

export const HeadForMovie = () => {
  const [movies, setMovies] = useState<MovieProps[]>([]);
  useEffect(() => {
    async function fetchMovies() {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            accept: "application/json",
          },
        }
      );
      const data = await res.json();
      setMovies(data.results.slice(0, 3));
    }
    fetchMovies();
  }, []);
  return (
    <Carousel>
      <CarouselContent>
        {movies.map((movie, index) => (
          <CarouselItem key={index} className="relative h-full ">
            <Card className="py-0 rounded-none w-full">
              <CardContent className="p-0">
                <img
                  className="w-full aspect-5/2 object-center"
                  src={
                    "https://image.tmdb.org/t/p/original" + movie.backdrop_path
                  }
                />
                <Introducton
                  name="Now Playing:"
                  moviename={movie.title}
                  rating={movie.vote_average}
                  description={movie.overview}
                  btn="Watch Trailer"
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext className="w-fit h-fit p-4 rounded-full bg-[#F4F4F5] absolute right-6" />
      <CarouselPrevious className="w-fit h-fit p-4 rounded-full bg-[#F4F4F5] absolute left-6" />
    </Carousel>
  );
};
