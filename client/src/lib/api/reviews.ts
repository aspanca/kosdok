import { api } from "../axios";
import type { ApiResponse } from "../types";
import type { ProviderType, ReviewsSummary } from "./providers";

export type ProviderReview = {
  id: number;
  providerType: ProviderType;
  providerId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  patientName: string;
  patientPicture: string | null;
};

export type MyReview = {
  id: number;
  providerType: ProviderType;
  providerId: number;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  providerName: string;
  specialty: string | null;
  image: string | null;
};

export type CreateReviewPayload = {
  providerType: ProviderType;
  providerId: number;
  rating: number;
  comment: string;
};

export async function getProviderReviews(
  providerType: ProviderType,
  providerId: number
): Promise<{ reviews: ProviderReview[]; summary: ReviewsSummary }> {
  const { data } = await api.get<ApiResponse<{ reviews: ProviderReview[]; summary: ReviewsSummary }>>(
    `/reviews/${providerType}/${providerId}`
  );
  return data.data;
}

export async function createReview(payload: CreateReviewPayload): Promise<ProviderReview> {
  const { data } = await api.post<ApiResponse<ProviderReview>>("/reviews", payload);
  return data.data;
}

export async function getMyReviews(): Promise<MyReview[]> {
  const { data } = await api.get<ApiResponse<MyReview[]>>("/reviews/mine");
  return data.data;
}

export async function updateReview(
  id: number,
  payload: { rating?: number; comment?: string }
): Promise<ProviderReview> {
  const { data } = await api.patch<ApiResponse<ProviderReview>>(`/reviews/${id}`, payload);
  return data.data;
}

export async function deleteReview(id: number): Promise<void> {
  await api.delete(`/reviews/${id}`);
}
