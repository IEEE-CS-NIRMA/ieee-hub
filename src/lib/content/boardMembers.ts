import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type BoardThemeVariant = "primary" | "secondary" | "inverse";

export interface BoardMember {
  id: string;
  name: string;
  position: string;
  bio: string;
  themeVariant: BoardThemeVariant;
  photoUrl: string | null;
  linkedinUrl: string | null;
}

interface BoardMemberRow {
  id: string;
  full_name: string;
  position: string;
  bio: string;
  theme_variant: BoardThemeVariant;
  photo_url: string | null;
  linkedin_url: string | null;
}

export interface BoardMembersQueryResult {
  items: BoardMember[];
  source: "supabase" | "fallback";
}

export const boardThemeClasses: Record<BoardThemeVariant, string> = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  inverse: "bg-foreground text-background",
};

export const fallbackBoardMembers: BoardMember[] = [
  {
    id: "arjun-patel",
    name: "Arjun Patel",
    position: "Chairperson",
    bio: "Final year CSE student passionate about AI and community building.",
    themeVariant: "primary",
    photoUrl: null,
    linkedinUrl: null,
  },
  {
    id: "priya-sharma",
    name: "Priya Sharma",
    position: "Vice Chair",
    bio: "Leading initiatives in cloud computing and open source advocacy.",
    themeVariant: "secondary",
    photoUrl: null,
    linkedinUrl: null,
  },
  {
    id: "rahul-mehta",
    name: "Rahul Mehta",
    position: "Technical Lead",
    bio: "Full-stack developer and competitive programmer with 1500+ on Codeforces.",
    themeVariant: "inverse",
    photoUrl: null,
    linkedinUrl: null,
  },
  {
    id: "ananya-desai",
    name: "Ananya Desai",
    position: "Design Lead",
    bio: "UI/UX enthusiast crafting beautiful and accessible digital experiences.",
    themeVariant: "primary",
    photoUrl: null,
    linkedinUrl: null,
  },
  {
    id: "karan-singh",
    name: "Karan Singh",
    position: "Event Lead",
    bio: "Organized 20+ tech events and hackathons with 1000+ participants.",
    themeVariant: "secondary",
    photoUrl: null,
    linkedinUrl: null,
  },
  {
    id: "neha-joshi",
    name: "Neha Joshi",
    position: "Marketing Lead",
    bio: "Building the IEEE CS Nirma brand across digital platforms.",
    themeVariant: "inverse",
    photoUrl: null,
    linkedinUrl: null,
  },
];

function mapBoardMemberRow(row: BoardMemberRow): BoardMember {
  return {
    id: row.id,
    name: row.full_name,
    position: row.position,
    bio: row.bio,
    themeVariant: row.theme_variant,
    photoUrl: row.photo_url,
    linkedinUrl: row.linkedin_url,
  };
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("");
}

export async function fetchPublishedBoardMembers(): Promise<BoardMembersQueryResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { items: fallbackBoardMembers, source: "fallback" };
  }

  const { data, error } = await supabase
    .from("board_members")
    .select("id, full_name, position, bio, theme_variant, photo_url, linkedin_url")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Failed to fetch board members from Supabase", error);
    return { items: fallbackBoardMembers, source: "fallback" };
  }

  return {
    items: (data as BoardMemberRow[]).map(mapBoardMemberRow),
    source: "supabase",
  };
}