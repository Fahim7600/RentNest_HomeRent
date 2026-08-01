import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchPropertyById } from "../actions";
import { PropertyDetailsView } from "./_components/property-details-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await fetchPropertyById(id);

  if (!property) {
    return { title: "Property Not Found — RentNest" };
  }

  return {
    title: `${property.title} — RentNest`,
    description: `${property.title} in ${property.location}. $${property.rentAmount}/month. ${property.bedrooms} bedrooms.`,
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = await fetchPropertyById(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/properties"
          className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all properties
        </Link>

        {/* Title Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {property.title}
          </h1>
          <p className="mt-2 text-sm text-slate-400">{property.location}</p>
        </div>

        {/* Client Interactive View */}
        <PropertyDetailsView property={property} />
      </div>
    </div>
  );
}
