"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPropertyReviews } from "../../actions";
import { Star, MessageSquare } from "lucide-react";

export function ReviewsList({ propertyId }: { propertyId: string }) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["property-reviews", propertyId],
    queryFn: () => fetchPropertyReviews(propertyId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-2"
          >
            <div className="h-4 w-1/4 rounded bg-slate-800" />
            <div className="h-3 w-3/4 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 text-center">
        <MessageSquare className="mx-auto h-8 w-8 text-slate-600" />
        <p className="mt-2 text-xs text-slate-400">
          No reviews for this property yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-colors hover:border-slate-700"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">
                {review.tenant?.name || "Tenant"}
              </span>
              <span className="text-xs text-slate-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`h-3.5 w-3.5 ${
                    idx < review.rating ? "fill-amber-400" : "text-slate-700"
                  }`}
                />
              ))}
            </div>
          </div>

          <p className="mt-2 text-xs text-slate-300 leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
}
