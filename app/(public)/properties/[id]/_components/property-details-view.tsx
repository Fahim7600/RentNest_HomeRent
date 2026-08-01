"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Bed,
  CheckCircle2,
  User as UserIcon,
  Phone,
  Mail,
  ShieldCheck,
  Send,
  Building2,
} from "lucide-react";
import { getToken, getUser, type CookieUser } from "@/lib/auth";
import type { Property } from "@/lib/types";
import { ImageGallery } from "./image-gallery";
import { ReviewsList } from "./reviews-list";
import { RequestToRentModal } from "./request-modal";

export function PropertyDetailsView({ property }: { property: Property }) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<CookieUser | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentUser(getToken() ? getUser() || null : null);
    setMounted(true);
  }, []);

  const handleRequestClick = () => {
    if (!getToken() || !currentUser) {
      router.push(`/login?redirect=/properties/${property.id}`);
      return;
    }

    if (currentUser.role === "TENANT") {
      setIsModalOpen(true);
    }
  };

  const showCTA =
    mounted &&
    (!currentUser || currentUser.role === "TENANT");

  return (
    <div className="space-y-12">
      {/* Top Gallery & Quick Summary */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImageGallery images={property.images} title={property.title} />
        </div>

        {/* Price & Action Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-extrabold text-white">
                  ${property.rentAmount?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400"> / month</span>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  property.isAvailable
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {property.isAvailable ? "Available Now" : "Rented"}
              </span>
            </div>

            <div className="mt-6 space-y-3 border-t border-b border-slate-800 py-4 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Bedrooms</span>
                <span className="font-semibold text-white">{property.bedrooms} Beds</span>
              </div>
              {property.category?.name && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Category</span>
                  <span className="font-semibold text-indigo-400">
                    {property.category.name}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Location</span>
                <span className="font-semibold text-white line-clamp-1">
                  {property.location}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            {showCTA && (
              <div className="mt-6">
                <button
                  onClick={handleRequestClick}
                  disabled={!property.isAvailable}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  Request to Rent
                </button>
              </div>
            )}

            {/* Landlord Contact Info */}
            {property.landlord && (
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Landlord Info
                </h4>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                    <UserIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {property.landlord.name}
                    </p>
                    <p className="text-xs text-slate-400">Verified Landlord</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description & Amenities Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          {/* Description */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-bold text-white mb-3">About this Property</h3>
            <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Included Amenities</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {property.amenities.map((amenity, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl bg-slate-800/50 p-3 text-xs text-slate-200 border border-slate-700/50"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Tenant Reviews</h3>
            <ReviewsList propertyId={property.id} />
          </div>
        </div>
      </div>

      {/* Request Modal */}
      <RequestToRentModal
        property={property}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
