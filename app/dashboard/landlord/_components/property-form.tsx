"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  DollarSign,
  ImageIcon,
  CheckCircle2,
  Loader2,
  Info,
} from "lucide-react";
import { fetchCategories } from "@/app/(public)/properties/actions";
import { createProperty, updateProperty, type PropertyPayload } from "../actions";
import { ApiError } from "@/lib/api-client";
import type { Category, Property } from "@/lib/types";

const propertySchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(2, "Location is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  propertyType: z.string().min(1, "Please select or specify a property type"),
  categoryId: z.string().min(1, "Please select a category"),
  availability: z.enum(["AVAILABLE", "RENTED", "MAINTENANCE"]),
  amenitiesInput: z.string(),
  imagesInput: z.string(),
});

type PropertyFormValues = z.infer<typeof propertySchema>;

export function PropertyForm({ initialData }: { initialData?: Property }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!initialData;

  const defaultAmenities = initialData?.amenities
    ? initialData.amenities.join(", ")
    : "Parking, Security, Generator";

  const defaultImages = initialData?.images
    ? initialData.images.join(", ")
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      price: initialData?.rentAmount ?? initialData?.price ?? 1000,
      propertyType: initialData?.propertyType || "APARTMENT",
      categoryId: initialData?.categoryId || "",
      availability: (initialData?.availability as "AVAILABLE" | "RENTED" | "MAINTENANCE") || "AVAILABLE",
      amenitiesInput: defaultAmenities,
      imagesInput: defaultImages,
    },
  });

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res))
      .catch((err) => console.error("Failed to load categories:", err));
  }, []);

  const onSubmit = async (values: PropertyFormValues) => {
    setIsSubmitting(true);

    const amenitiesArray = values.amenitiesInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const imagesArray = values.imagesInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const payload: PropertyPayload = {
      title: values.title,
      description: values.description,
      location: values.location,
      price: values.price,
      propertyType: values.propertyType,
      categoryId: values.categoryId,
      amenities: amenitiesArray.length > 0 ? amenitiesArray : ["Standard Amenities"],
      images: imagesArray.length > 0 ? imagesArray : ["https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"],
      availability: values.availability,
    };

    try {
      if (isEdit && initialData) {
        await updateProperty(initialData.id, payload);
        toast.success("Property updated successfully!");
      } else {
        await createProperty(payload);
        toast.success("Property created successfully!");
      }
      router.push("/dashboard/landlord/properties");
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(err.message || "Failed to save property");
      } else {
        toast.error("Failed to save property");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-xs font-medium text-slate-300 mb-1.5">
          Property Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="e.g. Modern 3-BHK Apartment in Gulshan"
          {...register("title")}
          className={`w-full rounded-xl border bg-slate-800/50 py-2.5 px-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 ${
            errors.title ? "border-red-500" : "border-slate-700"
          }`}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>
        )}
      </div>

      {/* Grid: Price, Property Type, Category */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-xs font-medium text-slate-300 mb-1.5">
            Monthly Price ($)
          </label>
          <div className="relative">
            <DollarSign className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              id="price"
              type="number"
              placeholder="1200"
              {...register("price", { valueAsNumber: true })}
              className={`w-full rounded-xl border bg-slate-800/50 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 ${
                errors.price ? "border-red-500" : "border-slate-700"
              }`}
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-xs text-red-400">{errors.price.message}</p>
          )}
        </div>

        {/* Property Type */}
        <div>
          <label htmlFor="propertyType" className="block text-xs font-medium text-slate-300 mb-1.5">
            Property Type
          </label>
          <select
            id="propertyType"
            {...register("propertyType")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 px-3 text-sm text-white outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="APARTMENT" className="bg-slate-900">Apartment</option>
            <option value="CONDO" className="bg-slate-900">Condo</option>
            <option value="STUDIO" className="bg-slate-900">Studio</option>
            <option value="HOUSE" className="bg-slate-900">House / Villa</option>
            <option value="DUPLEX" className="bg-slate-900">Duplex</option>
          </select>
          {errors.propertyType && (
            <p className="mt-1 text-xs text-red-400">{errors.propertyType.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-xs font-medium text-slate-300 mb-1.5">
            Category
          </label>
          <select
            id="categoryId"
            {...register("categoryId")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 px-3 text-sm text-white outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="" className="bg-slate-900">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-slate-900">
                {cat.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-xs text-red-400">{errors.categoryId.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-xs font-medium text-slate-300 mb-1.5">
          Location Address
        </label>
        <div className="relative">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            id="location"
            type="text"
            placeholder="e.g. Sector 4, Uttara, Dhaka"
            {...register("location")}
            className={`w-full rounded-xl border bg-slate-800/50 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 ${
              errors.location ? "border-red-500" : "border-slate-700"
            }`}
          />
        </div>
        {errors.location && (
          <p className="mt-1 text-xs text-red-400">{errors.location.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-xs font-medium text-slate-300 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe key features, space, surroundings, and house rules..."
          {...register("description")}
          className={`w-full rounded-xl border bg-slate-800/50 p-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 ${
            errors.description ? "border-red-500" : "border-slate-700"
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
        )}
      </div>

      {/* Amenities & Availability */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Amenities */}
        <div>
          <label htmlFor="amenitiesInput" className="block text-xs font-medium text-slate-300 mb-1.5">
            Amenities (comma separated)
          </label>
          <input
            id="amenitiesInput"
            type="text"
            placeholder="Parking, Generator, Security, Elevator, Gas"
            {...register("amenitiesInput")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 px-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
          />
          <p className="mt-1 text-[11px] text-slate-400">
            Separate multiple items with commas.
          </p>
        </div>

        {/* Availability */}
        <div>
          <label htmlFor="availability" className="block text-xs font-medium text-slate-300 mb-1.5">
            Listing Status
          </label>
          <select
            id="availability"
            {...register("availability")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 px-3 text-sm text-white outline-none focus:border-indigo-500 appearance-none"
          >
            <option value="AVAILABLE" className="bg-slate-900">AVAILABLE (Accepting requests)</option>
            <option value="RENTED" className="bg-slate-900">RENTED (Occupied)</option>
            <option value="MAINTENANCE" className="bg-slate-900">MAINTENANCE (Temporarily unlisted)</option>
          </select>
        </div>
      </div>

      {/* Images Multi-URL Input */}
      <div>
        <label htmlFor="imagesInput" className="block text-xs font-medium text-slate-300 mb-1.5">
          Image URLs (comma separated)
        </label>
        <div className="relative">
          <ImageIcon className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <textarea
            id="imagesInput"
            rows={2}
            placeholder="https://images.unsplash.com/photo-..., https://..."
            {...register("imagesInput")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800/50 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-indigo-300">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>
            Please provide full HTTP/HTTPS image URLs (e.g. from Unsplash, Imgur, or Cloudinary).
          </span>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-6">
        <button
          type="button"
          onClick={() => router.push("/dashboard/landlord/properties")}
          className="rounded-xl border border-slate-700 px-5 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="h-4 w-4" />
          )}
          {isSubmitting ? "Saving..." : isEdit ? "Update Property" : "Publish Property"}
        </button>
      </div>
    </form>
  );
}
