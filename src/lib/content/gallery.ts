import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  caption: string | null;
}

interface GalleryRow {
  id: string;
  title: string;
  image_url: string;
  alt_text: string | null;
  caption: string | null;
}

export interface GalleryQueryResult {
  items: GalleryItem[];
  source: "supabase" | "fallback";
}

export const fallbackGalleryItems: GalleryItem[] = [
  {
    id: "students-coding-workshop",
    title: "Workshop Coding Session",
    imageUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&w=900&q=80",
    altText: "Students coding in a workshop",
    caption: "Hands-on workshop session with active coding.",
  },
  {
    id: "event-team-collaboration",
    title: "Team Collaboration",
    imageUrl:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    altText: "Team collaboration during event",
    caption: "Participants collaborating during a chapter event.",
  },
  {
    id: "auditorium-speaker-session",
    title: "Speaker Session",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
    altText: "Speaker session in auditorium",
    caption: "Industry expert session in the auditorium.",
  },
  {
    id: "hackathon-night-desk",
    title: "Hackathon Night",
    imageUrl:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=900&q=80",
    altText: "Night hackathon desk setup",
    caption: "Late-night build energy at the hackathon.",
  },
  {
    id: "winners-medals",
    title: "Winner Moments",
    imageUrl:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80",
    altText: "Winners with medals",
    caption: "Winners celebrating after the final round.",
  },
  {
    id: "group-event-photo",
    title: "Community Photo",
    imageUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    altText: "Group photo at tech event",
    caption: "Group photo with students and organizers.",
  },
];

function mapGalleryRow(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    imageUrl: row.image_url,
    altText: row.alt_text ?? row.title,
    caption: row.caption,
  };
}

export async function fetchPublishedGalleryItems(): Promise<GalleryQueryResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { items: fallbackGalleryItems, source: "fallback" };
  }

  const { data, error } = await supabase
    .from("gallery_items")
    .select("id, title, image_url, alt_text, caption")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("taken_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch gallery items from Supabase", error);
    return { items: fallbackGalleryItems, source: "fallback" };
  }

  return {
    items: (data as GalleryRow[]).map(mapGalleryRow),
    source: "supabase",
  };
}
