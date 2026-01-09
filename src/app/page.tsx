"use client";
import Image from "next/image";
import { use, useState } from "react";
import { Input } from "@/components/ui/input";
// import { Button } from "../components/ui/button";
// import { HeadforMovie } from "./_components/HeadforMovie"

import { useEffect } from "react";
import { Link } from "lucide-react";
import { categories } from "./_constants";
import { MovieSection } from "./_components/MovieSection";
import MovieDetailPage from "./movie/[movieId]/page";
import { HeadForMovie } from "./_components/HeadforMovie";

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <main className="">
        <HeadForMovie />
      </main>
      <>
        <div className="flex flex-col ">
          <div>
            {categories.map((category) => {
              return (
                <MovieSection
                  key={category.categoryName}
                  categoryName={category.categoryName}
                  title={category.title}
                  showButton={category.showButton}
                />
              );
            })}
          </div>
        </div>
        <div></div>
      </>
    </>
  );
}
