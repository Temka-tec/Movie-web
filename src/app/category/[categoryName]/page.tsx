"use client";

import { categories } from "@/app/_constants";
import { MovieSection } from "@/app/_components/MovieSection";
import Link from "next/link";
import { use } from "react";
import { ChevronLeft } from "lucide-react";

const CategorySectionDetail = ({
  params,
}: {
  params: Promise<{ categoryName: string }>;
}) => {
  const { categoryName } = use(params);

  const title = categories.find(
    (el) => el.categoryName === categoryName
  )?.title;

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-10 lg:px-14">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to home
        </Link>
      </div>

      <div className="rounded-3xl border bg-gradient-to-b from-muted/60 to-background px-2 py-4 md:px-4">
        <MovieSection
          categoryName={categoryName}
          title={title}
          showButton={false}
        />
      </div>
    </main>
  );
};

export default CategorySectionDetail;
