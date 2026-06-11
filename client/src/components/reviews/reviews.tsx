"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/auth-context";
import { getProviderReviews, createReview } from "../../lib/api/reviews";
import type { ProviderType } from "../../lib/api/providers";
import { Button } from "../ui/button";

interface ReviewsProps {
  entityType: "doctor" | "clinic" | "hospital";
  entityId: number;
  entityName: string;
}

const StarRating = ({ rating, onRatingChange, interactive = false, size = "sm" }: {
  rating: number;
  onRatingChange?: (r: number) => void;
  interactive?: boolean;
  size?: "xs" | "sm" | "md";
}) => {
  const [hover, setHover] = useState(0);
  const sizes = { xs: "w-3.5 h-3.5", sm: "w-4 h-4", md: "w-5 h-5" };

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          disabled={!interactive}
          onClick={() => onRatingChange?.(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : "cursor-default"}
        >
          <svg className={sizes[size]} viewBox="0 0 20 20" fill={(hover || rating) >= s ? "#FFB800" : "#E5E5E5"}>
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("sq-AL", { day: "numeric", month: "short", year: "numeric" });
}

export const Reviews = ({ entityType, entityId, entityName: _entityName }: ReviewsProps) => {
  void _entityName;
  const providerType: ProviderType = entityType === "doctor" ? "doctor" : "clinic";
  const { isLoggedIn, user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });

  const { data } = useQuery({
    queryKey: ["reviews", providerType, entityId],
    queryFn: () => getProviderReviews(providerType, entityId),
  });

  const reviews = data?.reviews ?? [];
  const avg = data?.summary.rating ?? 0;
  const count = data?.summary.reviewCount ?? 0;

  const reviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", providerType, entityId] });
      queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
      setNewReview({ rating: 0, comment: "" });
      setShowForm(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0 || !newReview.comment.trim() || reviewMutation.isPending) return;
    reviewMutation.mutate({
      providerType,
      providerId: entityId,
      rating: newReview.rating,
      comment: newReview.comment.trim(),
    });
  };

  const canReview = isLoggedIn && user?.type === "patient";
  const label = entityType === "doctor" ? "mjekun" : entityType === "clinic" ? "klinikën" : "spitalin";
  const visible = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="bg-white border border-[#dedede]">
      {/* Header */}
      <div className="p-4 border-b border-[#f0f0f0] flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Rating Display */}
          <div className="text-center">
            <div className="text-[32px] font-bold text-[#494e60] leading-none">{(avg ?? 0).toFixed(1)}</div>
            <StarRating rating={Math.round(avg ?? 0)} size="xs" />
            <p className="text-[10px] text-[#9fa4b4] mt-1">{count} vlerësime</p>
          </div>

          {/* Rating Bars */}
          <div className="hidden sm:flex flex-col gap-0.5">
            {[5, 4, 3, 2, 1].map((r) => {
              const barCount = reviews.filter((x) => x.rating === r).length;
              const pct = (barCount / reviews.length) * 100 || 0;
              return (
                <div key={r} className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#9fa4b4] w-2">{r}</span>
                  <div className="w-16 h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FFB800] rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        {canReview ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`h-8 px-4 text-[12px] font-[600] rounded-full transition-colors ${showForm ? "bg-[#f0f0f0] text-[#494e60]" : "bg-primary text-white hover:bg-primary/90"}`}
          >
            {showForm ? "Anulo" : "+ Shkruaj"}
          </button>
        ) : !isLoggedIn ? (
          <Link href={{ pathname: "/signin", query: { mode: "login" } }} className="h-8 px-4 inline-flex items-center bg-primary text-white text-[12px] font-[600] rounded-full hover:bg-primary/90 transition-colors">
            Kyçu
          </Link>
        ) : null}
      </div>

      {/* Form */}
      {showForm && canReview && (
        <form onSubmit={handleSubmit} className="p-4 bg-[#fafafa] border-b border-[#f0f0f0]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[12px] font-[600] text-[#494e60]">Vlerësimi:</span>
            <StarRating rating={newReview.rating} onRatingChange={(r) => setNewReview({ ...newReview, rating: r })} interactive size="md" />
            {newReview.rating > 0 && (
              <span className="text-[11px] text-primary font-[500]">
                {["", "Dobët", "Jo mirë", "Mirë", "Shumë mirë", "Shkëlqyer!"][newReview.rating]}
              </span>
            )}
          </div>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Ndani eksperiencën tuaj..."
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-[#e0e0e0] bg-white text-[13px] placeholder:text-[#bbb] focus:outline-none focus:border-primary resize-none mb-3"
            required
          />
          {reviewMutation.isError && (
            <p className="text-[12px] text-red-500 mb-2">
              {reviewMutation.error instanceof Error ? reviewMutation.error.message : "Diçka shkoi gabim"}
            </p>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={newReview.rating === 0 || reviewMutation.isPending} className="h-8 px-5 bg-primary text-white text-[12px] font-[600] rounded-full disabled:opacity-50">
              {reviewMutation.isPending ? "Duke dërguar..." : "Dërgo"}
            </Button>
            <Button type="button" onClick={() => setShowForm(false)} className="h-8 px-4 bg-white border border-[#e0e0e0] text-[#494e60] text-[12px] font-[600] rounded-full hover:bg-[#f8f8f8]">
              Anulo
            </Button>
          </div>
        </form>
      )}

      {/* Login prompt */}
      {!isLoggedIn && (
        <div className="px-4 py-3 bg-[#f0f7ff] border-b border-[#e0efff] text-[12px] text-[#494e60] flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <Link href={{ pathname: "/signin", query: { mode: "login" } }} className="text-primary font-[600] hover:underline">Kyçuni</Link> për të vlerësuar {label}.
        </div>
      )}

      {/* List */}
      <div className="divide-y divide-[#f0f0f0]">
        {reviews.length === 0 && (
          <div className="p-4 text-[12px] text-[#9fa4b4]">Ende nuk ka vlerësime. Bëhuni i pari!</div>
        )}
        {visible.map((r) => (
          <div key={r.id} className="p-4 flex gap-3 hover:bg-[#fafafa] transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-[#6AA8FF] flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 overflow-hidden">
              {r.patientPicture ? (
                <img src={r.patientPicture} alt={r.patientName} className="w-full h-full object-cover" />
              ) : (
                r.patientName.split(" ").map((n) => n[0]).join("").toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-[600] text-[#494e60]">{r.patientName}</span>
                  <StarRating rating={r.rating} size="xs" />
                </div>
                <span className="text-[11px] text-[#bbb]">{formatReviewDate(r.createdAt)}</span>
              </div>
              <p className="text-[12px] text-[#666] leading-relaxed">{r.comment}</p>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && !showAll && (
        <div className="p-3 border-t border-[#f0f0f0] text-center">
          <button onClick={() => setShowAll(true)} className="text-[12px] font-[600] text-primary hover:underline">
            Shiko të gjitha ({reviews.length})
          </button>
        </div>
      )}
    </div>
  );
};
