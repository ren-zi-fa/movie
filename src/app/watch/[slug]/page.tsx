"use client";

import WatchMovieCard from "@/components/WatchCard";
import { useParams } from "next/navigation";

export default function WatchPage() {
  const params = useParams();
  const slug = params.slug as string;

  return <WatchMovieCard slug={slug} />;
}
