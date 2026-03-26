import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Testimonial } from "@/components/ui/testimonials-columns-1";

export interface TestimonialRow {
  id: string;
  name: string;
  message: string;
  image_url: string | null;
  role: string | null;
  approved: boolean;
  created_at: string;
}

export interface TestimonialQueryResult {
  items: Testimonial[];
  source: "supabase" | "fallback";
}

export const fallbackTestimonials: Testimonial[] = [];

/**
 * Fetch approved testimonials from Supabase
 * Converts database format to component format
 */
export async function fetchTestimonials(): Promise<TestimonialQueryResult> {
  // Return fallback if Supabase is not configured
  if (!isSupabaseConfigured || !supabase) {
    console.warn("Supabase not configured. Using fallback testimonials.");
    return {
      items: fallbackTestimonials,
      source: "fallback",
    };
  }

  try {
    const { data, error } = await supabase
      .from("testimonials")
      .select("id, name, message, image_url, role, approved, created_at")
      .eq("approved", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch testimonials from Supabase:", error);
      return {
        items: fallbackTestimonials,
        source: "fallback",
      };
    }

    // Transform database rows to component format
    const testimonials: Testimonial[] = (data as TestimonialRow[]).map(
      (item) => ({
        text: item.message,
        image: item.image_url || null,
        name: item.name,
        role: item.role || "Member",
      })
    );

    return {
      items: testimonials,
      source: "supabase",
    };
  } catch (error) {
    console.error("Unexpected error fetching testimonials:", error);
    return {
      items: fallbackTestimonials,
      source: "fallback",
    };
  }
}
