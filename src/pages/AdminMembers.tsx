import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
  boardThemeClasses,
  fetchBoardMembersForAdmin,
  getInitials,
  updateBoardMemberPhotoPosition,
} from "@/lib/content/boardMembers";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAdminSession } from "@/hooks/use-admin-session";

const clampPercent = (value: number) =>
  Math.min(100, Math.max(0, Math.round(value)));

const AdminMembers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sessionChecked, isAdmin, adminEmail } = useAdminSession();
  const [draftOffsetX, setDraftOffsetX] = useState<Record<string, number>>({});
  const [draftOffsetY, setDraftOffsetY] = useState<Record<string, number>>({});

  const {
    data: members,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-board-members"],
    queryFn: fetchBoardMembersForAdmin,
    enabled: isAdmin,
  });

  const saveMutation = useMutation({
    mutationFn: ({
      id,
      valueX,
      valueY,
    }: {
      id: string;
      valueX: number;
      valueY: number;
    }) => updateBoardMemberPhotoPosition(id, valueX, valueY),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-board-members"] });
      void queryClient.invalidateQueries({ queryKey: ["board-members"] });
      toast({
        title: "Saved",
        description: "Board member photo position updated.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Could not update board member photo position.";
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const pendingMemberId = saveMutation.variables?.id;

  const hasUnsavedChanges = useMemo(() => {
    if (!members) {
      return false;
    }

    return members.some(
      (member) =>
        clampPercent(draftOffsetX[member.id] ?? member.photoPositionX) !==
          member.photoPositionX ||
        clampPercent(draftOffsetY[member.id] ?? member.photoPositionY) !==
          member.photoPositionY,
    );
  }, [draftOffsetX, draftOffsetY, members]);

  const handleLogout = async () => {
    if (!supabase) {
      navigate("/");
      return;
    }

    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="container mx-auto max-w-3xl brutal-card">
          <h1 className="text-3xl font-heading font-extrabold mb-3">
            Admin Members
          </h1>
          <p className="font-body text-muted-foreground">
            Supabase credentials are missing. Configure them first to use admin
            tools.
          </p>
        </div>
      </div>
    );
  }

  if (!sessionChecked) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="container mx-auto max-w-3xl font-heading font-bold uppercase tracking-wide text-sm text-muted-foreground">
          Checking admin session...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <AdminShell
      title="Admin: Board Members"
      adminEmail={adminEmail}
      activeTab="members"
      onLogout={handleLogout}
    >
      <section className="brutal-card">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-heading font-extrabold">
            Board Members
          </h2>
          <button
            type="button"
            onClick={() => void refetch()}
            className="brutal-btn-outline inline-flex items-center gap-2"
          >
            <RefreshCcw size={14} /> Refresh
          </button>
        </div>

        <p className="font-body text-muted-foreground mb-5">
          Adjust each member photo crop horizontally and vertically, then save
          per member.
        </p>

        {isLoading && (
          <p className="font-heading font-bold uppercase tracking-wide text-sm text-muted-foreground">
            Loading board members...
          </p>
        )}

        <div className="space-y-4">
          {members?.map((member) => {
            const currentX = clampPercent(
              draftOffsetX[member.id] ?? member.photoPositionX,
            );
            const currentY = clampPercent(
              draftOffsetY[member.id] ?? member.photoPositionY,
            );
            const isChanged =
              currentX !== member.photoPositionX ||
              currentY !== member.photoPositionY;
            const isSavingThis =
              saveMutation.isPending && pendingMemberId === member.id;

            return (
              <article key={member.id} className="brutal-border p-4">
                <div className="grid md:grid-cols-[minmax(260px,340px)_1fr] gap-4 items-start">
                  <div
                    className={`w-full h-72 brutal-border relative overflow-hidden flex items-center justify-center ${boardThemeClasses[member.themeVariant]}`}
                  >
                    {member.photoUrl ? (
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ objectPosition: `${currentX}% ${currentY}%` }}
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-5xl font-heading font-extrabold opacity-50">
                        {getInitials(member.name)}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-heading font-extrabold text-lg">
                        {member.name}
                      </h3>
                      {!member.isPublished && (
                        <span className="brutal-border px-2 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wide bg-secondary text-secondary-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      {member.position}
                    </p>

                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-2">
                      Photo Horizontal Position: {currentX}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={currentX}
                      onChange={(event) =>
                        setDraftOffsetX((prev) => ({
                          ...prev,
                          [member.id]: clampPercent(Number(event.target.value)),
                        }))
                      }
                      className="w-full accent-foreground"
                    />

                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mt-4 mb-2">
                      Photo Vertical Position: {currentY}%
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={1}
                      value={currentY}
                      onChange={(event) =>
                        setDraftOffsetY((prev) => ({
                          ...prev,
                          [member.id]: clampPercent(Number(event.target.value)),
                        }))
                      }
                      className="w-full accent-foreground"
                    />

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDraftOffsetX((prev) => ({
                            ...prev,
                            [member.id]: 50,
                          }))
                        }
                        className="brutal-btn-outline"
                      >
                        Center X (50)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setDraftOffsetY((prev) => ({
                            ...prev,
                            [member.id]: 50,
                          }))
                        }
                        className="brutal-btn-outline"
                      >
                        Center Y (50)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          saveMutation.mutate({
                            id: member.id,
                            valueX: currentX,
                            valueY: currentY,
                          })
                        }
                        disabled={!isChanged || isSavingThis}
                        className="brutal-btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSavingThis ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {!isLoading && members && members.length === 0 && (
          <p className="font-body text-muted-foreground">
            No board members found.
          </p>
        )}

        <div className="mt-4 text-xs font-heading font-bold uppercase tracking-wide text-muted-foreground">
          Unsaved board changes: {hasUnsavedChanges ? "Yes" : "No"}
        </div>
      </section>
    </AdminShell>
  );
};

export default AdminMembers;
