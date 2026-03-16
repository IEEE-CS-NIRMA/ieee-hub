import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";

interface AdminShellProps {
  title: string;
  adminEmail: string | null;
  activeTab: "events" | "members";
  onLogout: () => Promise<void> | void;
  children: ReactNode;
}

const tabClass =
  "brutal-border px-3 py-2 text-xs font-heading font-bold uppercase tracking-wide transition-all";

const AdminShell = ({
  title,
  adminEmail,
  activeTab,
  onLogout,
  children,
}: AdminShellProps) => {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="container mx-auto">
        <div className="brutal-card mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex brutal-border bg-foreground text-background px-3 py-1 text-xs font-heading font-bold uppercase tracking-wide mb-3">
                Control Center
              </span>
              <h1 className="text-4xl font-heading font-extrabold mb-2">
                {title}
              </h1>
              <p className="font-body text-muted-foreground">
                Signed in as {adminEmail ?? "admin"}.
              </p>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="brutal-btn-outline inline-flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/admin/events"
              className={`${tabClass} ${
                activeTab === "events"
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground"
              }`}
            >
              Events
            </Link>
            <Link
              to="/admin/members"
              className={`${tabClass} ${
                activeTab === "members"
                  ? "bg-foreground text-background"
                  : "bg-background text-foreground"
              }`}
            >
              Board Members
            </Link>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
};

export default AdminShell;
