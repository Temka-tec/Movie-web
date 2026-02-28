"use client";

import Link from "next/link";
import { ImageOff } from "lucide-react";
import { useState } from "react";

type MovieCardProps = {
  movie: MovieProps;
};

export const MovieCard = ({ movie }: MovieCardProps) => {
  const [imgError, setImgError] = useState(false);

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="rounded-xl border bg-muted overflow-hidden block hover:shadow-md transition"
    >
      <div className="aspect-[2/3] bg-muted">
        {posterUrl && !imgError ? (
          <img
            className="w-full h-full object-cover"
            src={posterUrl}
            alt={movie.title || movie.original_title || "movie poster"}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
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
