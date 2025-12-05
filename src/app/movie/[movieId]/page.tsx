"use client";
import { use, useEffect, useState } from "react";

const MovieDetailPage = () => ({
    params,
}: {
    params: Promise<{movieId: string}>;
}) => {
    const { movieId } = use(params);
    const [ movie, setMovie] = useState<MovieProps>();

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_TMDB_BASE_URL}//movie/${movieId}?language=en-US`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
                    },
                }
            );
            const data = await res.json();
            console.log(data)

            setMovie(data);
        };
        fetchData();
    }, []);
    return (
        <div>
            <div>
                hi
                <img src={`${process.env.TMDB_IMAGE_SERVICE_URL}/original/${movie?.poster_path}`}
                alt=""
                className=""/>
            </div>
        </div>
    )
};

export default MovieDetailPage;