"use client";

import Link from "next/link";

import { Star } from "lucide-react";
import MovieDetailPage from "../movie/[movieId]/page";

type MovieCardProps = {
  movie: MovieProps;
};
export const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <div className="w-full ">
      <img
        src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
        className="w-[300px] h-[450px] rounded-t-md"
      />

      <div className="w-[300px] h-[100px] pl-3 bg-gray-100 rounded-b-lg">
        <div className="flex gap-2 items-center pt-4">
          <Star className="text-[#FDE047] size-4" />
          <p className="text-[16px] leading-5 font-medium items-center">
            {movie.vote_average}
          </p>
        </div>
        <p className="text-[20px] leading-7 font-normal line-clamp-2">
          {movie.title || movie.original_title}
        </p>
      </div>
    </div>
  );
};
