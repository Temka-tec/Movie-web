"use client";

import { use } from "react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Star, Play, ImageOff, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type TMDBVideo = { key: string; site: string; type: string; name: string };

type CreditPerson = {
  id: number;
  name: string;
  job?: string;
  department?: string;
};

type CreditsResponse = {
  cast: { id: number; name: string }[];
  crew: CreditPerson[];
};

type MovieCard = {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
};

type TMDBListResponse = {
  results: MovieCard[];
};

const minutesToHM = (mins?: number) => {
  if (!mins || mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m}m`;
};

const MovieDetailSkeleton = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-6">
        <div className="w-full">
          <div className="h-12 w-2/3 bg-gray-200 rounded animate-pulse" />
          <div className="mt-3 h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="w-40">
          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse ml-auto" />
          <div className="mt-2 h-8 w-28 bg-gray-200 rounded animate-pulse ml-auto" />
          <div className="mt-2 h-3 w-20 bg-gray-200 rounded animate-pulse ml-auto" />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-8">
        <div className="col-span-12 md:col-span-4">
          <div className="w-full aspect-[2/3] bg-gray-200 rounded-xl animate-pulse" />
        </div>

        <div className="col-span-12 md:col-span-8">
          <div className="w-full aspect-[16/9] md:aspect-auto md:h-full bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-7 w-24 bg-gray-200 rounded-full animate-pulse"
          />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-11/12 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-10/12 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="mt-10 border-t pt-6 space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`grid grid-cols-12 gap-4 ${i ? "border-t pt-5" : ""}`}
          >
            <div className="col-span-12 md:col-span-2 h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="col-span-12 md:col-span-10 h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-5">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border bg-muted overflow-hidden animate-pulse"
            >
              <div className="aspect-[2/3] bg-gray-200" />
              <div className="p-3">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = use(params);

  const [movie, setMovie] = useState<any | null>(null);
  const [credits, setCredits] = useState<CreditsResponse | null>(null);
  const [similar, setSimilar] = useState<MovieCard[]>([]);
  const [loadingPage, setLoadingPage] = useState(true);

  const [openTrailer, setOpenTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [loadingTrailer, setLoadingTrailer] = useState(false);

  const BASE = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
  const IMG = process.env.NEXT_PUBLIC_TMDB_IMAGE_SERVICE_URL;
  const TOKEN = process.env.NEXT_PUBLIC_TMDB_API_TOKEN;

  useEffect(() => {
    if (!BASE || !TOKEN) {
      console.error("Missing env", { BASE, TOKEN });
      setLoadingPage(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${TOKEN}`,
      accept: "application/json",
    };

    const fetchAll = async () => {
      setLoadingPage(true);
      try {
        const [movieRes, creditsRes, similarRes] = await Promise.all([
          fetch(`${BASE}/movie/${movieId}?language=en-US`, { headers }),
          fetch(`${BASE}/movie/${movieId}/credits?language=en-US`, { headers }),
          fetch(`${BASE}/movie/${movieId}/similar?language=en-US&page=1`, {
            headers,
          }),
        ]);

        const movieData = await movieRes.json();
        const creditsData = await creditsRes.json();
        const similarData: TMDBListResponse = await similarRes.json();

        setMovie(movieData);
        setCredits(creditsData);
        setSimilar((similarData?.results ?? []).slice(0, 8));
      } catch (e) {
        console.error(e);
        setMovie(null);
        setCredits(null);
        setSimilar([]);
      } finally {
        setLoadingPage(false);
      }
    };

    fetchAll();
  }, [movieId, BASE, TOKEN]);

  const director = useMemo(() => {
    const d = credits?.crew?.find((p) => p.job === "Director");
    return d?.name ?? "";
  }, [credits]);

  const writers = useMemo(() => {
    const crew = credits?.crew ?? [];
    const writingJobs = new Set([
      "Writer",
      "Screenplay",
      "Story",
      "Novel",
      "Characters",
      "Author",
      "Original Story",
      "Teleplay",
      "Comic Book",
      "Book",
      "Adaptation",
    ]);

    const list = crew.filter((p) => {
      const job = (p.job ?? "").trim();
      const dep = (p.department ?? "").trim();
      return dep === "Writing" || writingJobs.has(job);
    });

    const uniq = Array.from(new Set(list.map((x) => x.name)));
    return uniq.slice(0, 4).join(" · ");
  }, [credits]);

  const stars = useMemo(() => {
    const list = credits?.cast?.map((c) => c.name) ?? [];
    return list.slice(0, 3).join(" · ");
  }, [credits]);

  const posterUrl =
    movie?.poster_path && IMG
      ? `${IMG}w500${movie.poster_path}`
      : "/no-poster.png";

  const backdropUrl =
    movie?.backdrop_path && IMG
      ? `${IMG}original${movie.backdrop_path}`
      : posterUrl;

  const playTrailer = async () => {
    if (!movie?.id || !BASE || !TOKEN) return;

    try {
      setLoadingTrailer(true);
      setTrailerKey(null);

      const res = await fetch(
        `${BASE}/movie/${movie.id}/videos?language=en-US`,
        {
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            accept: "application/json",
          },
        },
      );

      const data: { results: TMDBVideo[] } = await res.json();

      const trailer =
        data.results.find(
          (v) => v.site === "YouTube" && v.type === "Trailer",
        ) ?? data.results.find((v) => v.site === "YouTube");

      setOpenTrailer(true);
      if (trailer) setTrailerKey(trailer.key);
    } catch (e) {
      console.error(e);
      setOpenTrailer(true);
    } finally {
      setLoadingTrailer(false);
    }
  };

  if (loadingPage) return <MovieDetailSkeleton />;

  if (!movie) return <div className="p-10">Not found</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-5xl font-bold leading-tight">{movie.title}</h1>

          <div className="mt-2 text-muted-foreground">
            <span>{movie.release_date}</span>
            <span className="mx-2">·</span>
            <span>{movie.adult ? "R" : "PG"}</span>
            <span className="mx-2">·</span>
            <span>{minutesToHM(movie.runtime)}</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-muted-foreground">Rating</p>
          <div className="flex items-center justify-end gap-2 mt-1">
            <Star className="text-yellow-400" />
            <p className="text-2xl font-semibold">
              {Number(movie.vote_average ?? 0).toFixed(1)}
              <span className="text-sm text-muted-foreground">/10</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {Number(movie.vote_count || 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-8">
        <div className="col-span-12 md:col-span-4">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full rounded-xl object-cover"
          />
        </div>

        <div className="col-span-12 md:col-span-8">
          <button
            type="button"
            onClick={playTrailer}
            className="relative w-full h-full rounded-xl overflow-hidden group"
          >
            <img
              src={backdropUrl}
              alt={`${movie.title} backdrop`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

            <div className="absolute left-6 bottom-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                <Play className="text-black" />
              </div>
              <div className="text-white text-left">
                <p className="text-base font-medium">
                  {loadingTrailer ? "Loading..." : "Play trailer"}
                </p>
                <p className="text-sm opacity-80">Trailer</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-6">
        {(movie.genres ?? []).slice(0, 10).map((g: any) => (
          <Badge key={g.id} variant="secondary" className="rounded-full">
            {g.name}
          </Badge>
        ))}
      </div>

      <p className="mt-6 text-lg leading-7 text-muted-foreground">
        {movie.overview}
      </p>

      <div className="mt-10 border-t pt-6 space-y-5">
        <div className="grid grid-cols-12 gap-4">
          <p className="col-span-12 md:col-span-2 font-semibold">Director</p>
          <p className="col-span-12 md:col-span-10 text-muted-foreground">
            {director || "—"}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 border-t pt-5">
          <p className="col-span-12 md:col-span-2 font-semibold">Writers</p>
          <p className="col-span-12 md:col-span-10 text-muted-foreground">
            {writers || "—"}
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4 border-t pt-5">
          <p className="col-span-12 md:col-span-2 font-semibold">Stars</p>
          <p className="col-span-12 md:col-span-10 text-muted-foreground">
            {stars || "—"}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">More like this</h2>
          <Button variant="link" className="text-sm text-muted-foreground">
            See more <ArrowRight />
          </Button>
        </div>

        {similar.length === 0 ? (
          <div className="text-muted-foreground">No recommendations</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map((m) => (
              <Link
                key={m.id}
                href={`/movie/${m.id}`}
                className="rounded-xl border bg-muted overflow-hidden block hover:shadow-md transition"
              >
                <div className="aspect-[2/3] bg-gray-100">
                  {m.poster_path ? (
                    <img
                      className="w-full h-full object-cover"
                      src={`${IMG}w500${m.poster_path}`}
                      alt={m.title}
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full grid place-items-center text-sm text-gray-500">
                      <ImageOff />
                    </div>
                  )}
                </div>

                <div className="p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                    <span>⭐</span>
                    <span>{(m.vote_average ?? 0).toFixed(1)}/10</span>
                  </div>
                  <p className="font-medium text-sm line-clamp-2">{m.title}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={openTrailer}
        onOpenChange={(v) => {
          setOpenTrailer(v);
          if (!v) setTrailerKey(null);
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{movie.title} — Trailer</DialogTitle>
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
                Trailer not found
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
