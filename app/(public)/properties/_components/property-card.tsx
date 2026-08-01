import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Tag, ArrowRight } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatImageUrl } from "@/lib/image";

export function PropertyCard({ property }: { property: Property }) {
  const rawImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : undefined;

  const imageUrl = formatImageUrl(rawImage);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Image Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-800">
        <Image
          src={imageUrl}
          alt={property.title || "Rental Property"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {property.category?.name && (
            <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
              {property.category.name}
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
              property.isAvailable
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}
          >
            {property.isAvailable ? "Available" : "Rented"}
          </span>
        </div>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 flex items-baseline gap-1 text-white">
          <span className="text-2xl font-bold tracking-tight text-white">
            ${property.rentAmount?.toLocaleString()}
          </span>
          <span className="text-xs text-slate-300">/ month</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="line-clamp-1 text-lg font-semibold text-white transition-colors group-hover:text-indigo-400">
            {property.title}
          </h3>

          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {property.description}
          </p>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-1">
              <Bed className="h-4 w-4 text-indigo-400" />
              {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
            </span>
            {property.amenities && property.amenities.length > 0 && (
              <span className="flex items-center gap-1 text-slate-400">
                <Tag className="h-3.5 w-3.5 text-indigo-400" />
                {property.amenities.length} amenities
              </span>
            )}
          </div>

          <Link
            href={`/properties/${property.id}`}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
