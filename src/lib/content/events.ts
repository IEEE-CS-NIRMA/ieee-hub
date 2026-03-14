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