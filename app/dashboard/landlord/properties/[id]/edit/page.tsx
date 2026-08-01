import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit } from "lucide-react";
import { Navbar } from "@/app/_components/navbar";
import { fetchPropertyForEdit } from "../../../actions";
import { PropertyForm } from "../../../_components/property-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = await fetchPropertyForEdit(id);
  return {
    title: property ? `Edit ${property.title} — Landlord Portal` : "Edit Property — Landlord Portal",
  };
}

export default async function EditPropertyPage({ params }: PageProps) {
  const { id } = await params;
  const property = await fetchPropertyForEdit(id);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/dashboard/landlord/properties"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to My Properties
          </Link>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-xl backdrop-blur-md">
            <div className="mb-6 border-b border-slate-800 pb-4">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Edit className="h-6 w-6 text-indigo-400" />
                Edit Property Details
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                Update pricing, description, amenities, or availability status for {property.title}.
              </p>
            </div>

            <PropertyForm initialData={property} />
          </div>
        </div>
      </main>
    </div>
  );
}
