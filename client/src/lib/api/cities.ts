import { api } from "../axios";
import type { ApiResponse, City } from "../types";

export async function fetchCities(): Promise<City[]> {
  const { data } = await api.get<ApiResponse<City[]>>("/cities");
  return data.data;
}
