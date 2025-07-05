"use client";

import CardCategory from "@/components/CategoryCard";
import { useParams } from "next/navigation";

export default function CountryPage() {
  const params = useParams();
  const country = params.country as string;

  return <CardCategory country={country} />;
}
