"use client";

import { useState } from "react";
import { X, Star, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitReview } from "../actions";
import { ApiError } from "@/lib/api-client";

export function ReviewModal({
  rentalRequestId,
  propertyTitle,
  isOpen,
  onClose,
}: {
  rentalRequestId: string;
  propertyTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!comment.trim()) {
        throw new Error("Please write a review comment.");
      }
      return await submitReview({
        rentalRequestId,
        rating,
        comment: comment.trim(),
      });
    },
    onSuccess: (data) => {
      toast.success("Review submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tenant-rentals"] });
      queryClient.invalidateQueries({ queryKey: ["property-reviews"] });
      onClose();
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        toast.error(err.message || "Failed to submit review");
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to submit review");
      }
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Leave a Review</h3>
            {propertyTitle && (
              <p className="text-xs text-slate-400 line-clamp-1">{propertyTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          {/* Rating Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 ${
                      star <= (hoverRating || rating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-700"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-xs font-semibold text-amber-400">
                {hoverRating || rating} / 5 Stars
              </span>
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Review Comment
            </label>
            <textarea
              rows={4}
              required
              placeholder="Share your experience renting this property..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              {mutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
