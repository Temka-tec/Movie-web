"use client";

type IntroductionProps = {
  name: string;
  moviename: string;
  rating: number;
  description: string;
  btn: string;
};

export const Introducton = ({
  name,
  moviename,
  rating,
  description,
  btn,
}: IntroductionProps) => {
  return (
    <div className="absolute left-30 top-1/3 max-w-xl text-white drop-shadow-lg">
      {/* Now Playing */}
      <p className="text-lg opacity-90">{name}</p>

      {/* Movie Name */}
      <h1 className="text-5xl font-bold mb-4">{moviename}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-yellow-400 text-2xl">★</span>
        <p className="text-xl">{rating.toFixed(1)}/10</p>
      </div>

      {/* Description */}
      <p className="opacity-90 mb-6 line-clamp-4">{description}</p>

      {/* Button */}
      <button className="bg-white text-black px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-200 transition">
        ▶ {btn}
      </button>
    </div>
  );
};
