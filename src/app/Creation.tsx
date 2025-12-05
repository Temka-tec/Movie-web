"use client";


import { useEffect, useState } from "react";
import { MovieCard } from "./_components/MovieCard";

export type Movie = {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

type Response = {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;

};
const HomePage = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

 useEffect(() => {
  const getData = async () => {
    try{
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1`,
        {
          headers: {
            Authorization: 'Bearer ${process.env.TMDB_ACCESS_TOKEN}',
            accept: "application/json",
          },
        }
      );
      const data = (await res.json()) as Response;

      setMovies(data.results);
    }catch (error) {
      console.log(error);
    }
  };
  getData();
 }, []);

 return(
    <div className="grid grid-cols-4 gap-4 p-10 bg-gray-100">
        {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie}/>
        ))}
    </div>
 )
};
