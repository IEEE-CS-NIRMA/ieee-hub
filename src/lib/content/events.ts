import { format, parseISO } from "date-fns";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type EventCategory =
  | "workshop"
  | "competition"
  | "talk"
  | "hackathon";

export type EventRegistrationMode = "external" | "internal";

export type EventFilter = "all" | EventCategory;

export interface EventItem {
  id: string;
  title: string;
  date: string;
  desc: string;
  category: EventCategory;
  registrationMode: EventRegistrationMode;
  posterLink?: string | null;
  registrationLink?: string | null;
}

interface EventRow {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  event_date: string | null;
  poster_url: string | null;
  registration_mode: EventRegistrationMode;
  registration_link: string | null;
}

interface AdminEventRow extends EventRow {
  is_published: boolean;
  sort_order: number;
}

export interface AdminEventItem {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  eventDate: string | null;
  posterUrl: string | null;
  registrationMode: EventRegistrationMode;
  registrationLink: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export interface AdminEventUpsertInput {
  title: string;
  description: string;
  category: EventCategory;
  eventDate: string | null;
  posterUrl: string | null;
  registrationMode: EventRegistrationMode;
  registrationLink: string | null;
  isPublished: boolean;
  sortOrder: number;
}

export interface EventsQueryResult {
  items: EventItem[];
  source: "supabase" | "fallback";
}

export const eventFilters: { label: string; value: EventFilter }[] = [
  { label: "All Events", value: "all" },
  { label: "Workshops", value: "workshop" },
  { label: "Competitions", value: "competition" },
  { label: "Talks", value: "talk" },
  { label: "Hackathons", value: "hackathon" },
];

export function getEventCategoryLabel(category: EventCategory) {
  switch (category) {
    case "workshop":
      return "Workshop";
    case "competition":
      return "Competition";
    case "talk":
      return "Talk";
    case "hackathon":
      return "Hackathon";
    default:
      return category;
  }
}

export const fallbackEvents: EventItem[] = [
  {
    id: "hacknirma-2025",
    title: "HackNirma 2025",
    date: "April 15, 2025",
    desc: "24-hour hackathon with prizes worth ₹1,00,000. Build innovative solutions.",
    category: "hackathon",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
  {
    id: "aiml-workshop",
    title: "AI/ML Workshop",
    date: "April 22, 2025",
    desc: "Hands-on workshop on building machine learning models from scratch.",
    category: "workshop",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
  {
    id: "web3-blockchain-talk",
    title: "Tech Talk: Web3 & Blockchain",
    date: "May 5, 2025",
    desc: "Industry expert discusses the future of decentralized web.",
    category: "talk",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
  {
    id: "cp-contest",
    title: "Competitive Programming Contest",
    date: "May 12, 2025",
    desc: "Test your algorithmic skills in this intense coding contest.",
    category: "competition",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
  {
    id: "cloud-bootcamp",
    title: "Cloud Computing Bootcamp",
    date: "May 20, 2025",
    desc: "3-day bootcamp on AWS, GCP, and Azure fundamentals.",
    category: "workshop",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
  {
    id: "cybersecurity-ctf",
    title: "Cybersecurity CTF",
    date: "June 1, 2025",
    desc: "Capture The Flag competition for aspiring security professionals.",
    category: "competition",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
  {
    id: "open-source-session",
    title: "Speaker Session: Open Source",
    date: "June 10, 2025",
    desc: "Learn how to contribute to open source and build your portfolio.",
    category: "talk",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
  {
    id: "full-stack-workshop",
    title: "Full Stack Web Dev Workshop",
    date: "June 18, 2025",
    desc: "Build a complete web application from frontend to backend.",
    category: "workshop",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
  {
    id: "codesprint-3",
    title: "CodeSprint 3.0",
    date: "July 5, 2025",
    desc: "Speed coding competition with real-world problem statements.",
    category: "hackathon",
    registrationMode: "external",
    posterLink: null,
    registrationLink: null,
  },
];

function formatEventDate(eventDate: string | null) {
  if (!eventDate) {
    return "TBA";
  }

  const parsed = parseISO(eventDate);

  if (Number.isNaN(parsed.getTime())) {
    return eventDate;
  }

  return format(parsed, "MMMM d, yyyy");
}

function mapEventRow(row: EventRow): EventItem {
  return {
    id: row.id,
    title: row.title,
    date: formatEventDate(row.event_date),
    desc: row.description,
    category: row.category,
    registrationMode: row.registration_mode,
    posterLink: row.poster_url,
    registrationLink: row.registration_link,
  };
}

function cleanOptionalText(value: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function mapAdminEventRow(row: AdminEventRow): AdminEventItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    eventDate: row.event_date,
    posterUrl: row.poster_url,
    registrationMode: row.registration_mode,
    registrationLink: row.registration_link,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
  };
}

function buildAdminEventPayload(input: AdminEventUpsertInput) {
  const registrationMode = input.registrationMode;
  const registrationLink =
    registrationMode === "external"
      ? cleanOptionalText(input.registrationLink)
      : null;

  return {
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    event_date: cleanOptionalText(input.eventDate),
    poster_url: cleanOptionalText(input.posterUrl),
    registration_mode: registrationMode,
    registration_link: registrationLink,
    is_published: input.isPublished,
    sort_order: Math.max(0, Math.round(input.sortOrder)),
  };
}

export async function fetchPublishedEvents(): Promise<EventsQueryResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { items: fallbackEvents, source: "fallback" };
  }

  const { data, error } = await supabase
    .from("events")
    .select("id, title, description, category, event_date, poster_url, registration_mode, registration_link")
    .eq("is_published", true)
    .order("event_date", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to fetch events from Supabase", error);
    return { items: fallbackEvents, source: "fallback" };
  }

  return {
    items: (data as EventRow[]).map(mapEventRow),
    source: "supabase",
  };
}

export async function fetchEventsForAdmin(): Promise<AdminEventItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("events")
    .select(
      "id, title, description, category, event_date, poster_url, registration_mode, registration_link, is_published, sort_order",
    )
    .order("event_date", { ascending: true })
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as AdminEventRow[]).map(mapAdminEventRow);
}

export async function updateEventForAdmin(
  eventId: string,
  input: AdminEventUpsertInput,
) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  if (!input.title.trim()) {
    throw new Error("Title is required");
  }

  if (!input.description.trim()) {
    throw new Error("Description is required");
  }

  const { error } = await supabase
    .from("events")
    .update(buildAdminEventPayload(input))
    .eq("id", eventId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createEventForAdmin(input: AdminEventUpsertInput) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  if (!input.title.trim()) {
    throw new Error("Title is required");
  }

  if (!input.description.trim()) {
    throw new Error("Description is required");
  }

  const { error } = await supabase
    .from("events")
    .insert(buildAdminEventPayload(input));

  if (error) {
    throw new Error(error.message);
  }
}

export async function setEventPublishedForAdmin(
  eventId: string,
  isPublished: boolean,
) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase
    .from("events")
    .update({ is_published: isPublished })
    .eq("id", eventId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteEventForAdmin(eventId: string) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Supabase is not configured");
  }

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    throw new Error(error.message);
  }
}