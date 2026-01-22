import { Suspense } from "react";
import { SearchAndGenreSection } from "../_components/SearchAndGenreSection";

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <SearchAndGenreSection />
    </Suspense>
  );
}
