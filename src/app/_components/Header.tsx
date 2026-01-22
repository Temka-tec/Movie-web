"use client";

import { Film, Sun, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Genre = { id: number; name: string };

export const Header = () => {
  const router = useRouter();

  const [openGenre, setOpenGenre] = useState(false);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selected, setSelected] = useState<Genre | null>(null);
  const [q, setQ] = useState("");

  const didMount = useRef(false);

  useEffect(() => {
    const fetchGenres = async () => {
      const res = await fetch(
        "https://api.themoviedb.org/3/genre/movie/list?language=en",
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
            accept: "application/json",
          },
        },
      );
      const data = await res.json();
      setGenres(data.genres || []);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }

    const t = setTimeout(() => {
      const text = q.trim();
      if (text) router.push(`/discover?q=${encodeURIComponent(text)}`);
      else router.push("/discover");
    }, 350);

    return () => clearTimeout(t);
  }, [q, router]);

  const pickGenre = (g: Genre | null) => {
    setSelected(g);
    setOpenGenre(false);
    setQ("");

    if (!g) router.push("/discover");
    else
      router.push(`/discover?genre=${g.id}&name=${encodeURIComponent(g.name)}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="h-[59px] flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Film className="text-indigo-700" />
          <p className="text-indigo-700 font-semibold">MovieZ</p>
        </div>

        <div className="flex items-center gap-3 relative">
          <div className="relative">
            <button
              onClick={() => setOpenGenre((v) => !v)}
              className="h-10 px-3 rounded-md border flex items-center gap-2 text-sm bg-white"
            >
              <span>{selected ? selected.name : "Genre"}</span>
              <ChevronDown className="size-4 opacity-70" />
            </button>

            {openGenre && (
              <div className="absolute mt-2 w-64 rounded-xl border bg-white shadow-lg p-2 z-50">
                <button
                  onClick={() => pickGenre(null)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                >
                  All
                </button>

                <div className="max-h-72 overflow-auto">
                  {genres.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => pickGenre(g)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 text-sm"
                    >
                      {g.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search..."
            className="h-10 w-[420px] max-w-[55vw] rounded-md border px-3 text-sm outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <button className="h-10 w-10 rounded-md border grid place-items-center">
          <Sun className="size-5" />
        </button>
      </div>
    </header>
  );
};
