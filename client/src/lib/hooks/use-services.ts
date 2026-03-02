import { useQuery } from "@tanstack/react-query";
import { getServices } from "../api/clinic";

export const servicesQueryKey = ["services"] as const;

export function useServices() {
  return useQuery({
    queryKey: servicesQueryKey,
    queryFn: getServices,
  });
}
