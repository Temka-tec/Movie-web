"use client";

import { useEffect, useState } from "react";
import { MovieDetail } from "@/app/_components/MovieDetail";

type PageProps = {
  params: {
    movieId: string;
  };
};

const MovieDetailPage = ({ params }: PageProps) => {
  const { movieId } = params;
  const [movie, setMovie] = useState<MovieProps>();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}/movie/${movieId}?language=en-US`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
          },
        },
      );

      const data = await res.json();
      setMovie(data);
    };

    fetchData();
  }, [movieId]);

  return (
    <div>
      <img
        src={`${process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL}/original/${movie?.poster_path}`}
        alt=""
      />
      <MovieDetail movieId={params.movieId} />
    </div>
  );
};

export default MovieDetailPage;
