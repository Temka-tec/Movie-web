"use client";

import Link from "next/link";
import { Star } from "lucide-react";

type MovieCardProps = {
  movie: MovieProps;
};

export const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="inline-block cursor-pointer"
    >
      <img
        src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
        className="w-full aspect-[2/3] rounded-t-md object-cover"
        alt={movie.title || movie.original_title}
      />

      <div className="w-full h-[100px] pl-3 bg-gray-100 rounded-b-lg">
        <div className="flex gap-2 items-center pt-4">
          <Star className="text-[#FDE047] size-4" />
          <p className="text-[16px] leading-5 font-medium">
            {movie.vote_average}
          </p>
        </div>

        <p className="text-[20px] leading-7 font-normal line-clamp-2">
          {movie.title || movie.original_title}
        </p>
      </div>
    </Link>
  );
};
