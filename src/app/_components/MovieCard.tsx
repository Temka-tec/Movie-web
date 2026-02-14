"use client";

import Link from "next/link";
import { ImageOff } from "lucide-react";

type MovieCardProps = {
  movie: MovieProps;
};

const IMG = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL;

export const MovieCard = ({ movie }: MovieCardProps) => {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="rounded-xl border bg-muted overflow-hidden block hover:shadow-md transition"
    >
      <div className="aspect-[2/3] bg-muted">
        {movie.poster_path ? (
          <img
            className="w-full h-full object-cover"
            src={`${IMG}w500${movie.poster_path}`}
            alt={movie.title || movie.original_title}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm text-gray-500">
            <ImageOff />
          </div>
        )}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
          <span>⭐</span>
          <span>{(movie.vote_average ?? 0).toFixed(1)}/10</span>
        </div>

        <p className="font-medium text-sm line-clamp-2">
          {movie.title || movie.original_title}
        </p>
      </div>
    </Link>
  );
};
