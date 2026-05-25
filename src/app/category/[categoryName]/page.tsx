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
    (el) => el.categoryName === categoryName,
  )?.title;

  return (
    <main className="mx-auto w-full max-w-screen-2xl px-6 py-8 md:px-10 lg:px-14">
      <div className=" from-muted/60 to-background px-2 py-4 md:px-4">
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
