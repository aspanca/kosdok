import { useQuery } from "@tanstack/react-query";
import { fetchCities } from "../api/cities";

export const citiesQueryKey = ["cities"] as const;

export function useCities() {
  return useQuery({
    queryKey: citiesQueryKey,
    queryFn: fetchCities,
  });
}
