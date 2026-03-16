import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { Plus, RefreshCcw } from "lucide-react";
import AdminShell from "@/components/admin/AdminShell";
import {
  createEventForAdmin,
  deleteEventForAdmin,
  fetchEventsForAdmin,
  getEventCategoryLabel,
  setEventPublishedForAdmin,
  type AdminEventItem,
  type AdminEventUpsertInput,
  type EventCategory,
  type EventRegistrationMode,
  updateEventForAdmin,
} from "@/lib/content/events";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAdminSession } from "@/hooks/use-admin-session";

const categoryOptions: EventCategory[] = [
  "workshop",
  "competition",
  "talk",
  "hackathon",
];

function toDatetimeLocalInput(isoDate: string | null) {
  if (!isoDate) {
    return "";
  }

  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  const timezoneOffsetMinutes = parsed.getTimezoneOffset();
  const localDate = new Date(
    parsed.getTime() - timezoneOffsetMinutes * 60 * 1000,
  );
  return localDate.toISOString().slice(0, 16);
}

function fromDatetimeLocalInput(value: string) {
  if (!value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function mapEventToDraft(event: AdminEventItem): AdminEventUpsertInput {
  return {
    title: event.title,
    description: event.description,
    category: event.category,
    eventDate: event.eventDate,
    posterUrl: event.posterUrl,
    registrationMode: event.registrationMode,
    registrationLink: event.registrationLink,
    isPublished: event.isPublished,
    sortOrder: event.sortOrder,
  };
}

function createEmptyEventDraft(): AdminEventUpsertInput {
  return {
    title: "",
    description: "",
    category: "workshop",
    eventDate: null,
    posterUrl: null,
    registrationMode: "external",
    registrationLink: null,
    isPublished: true,
    sortOrder: 0,
  };
}

const AdminEvents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { sessionChecked, isAdmin, adminEmail } = useAdminSession();
  const [draftEvents, setDraftEvents] = useState<
    Record<string, AdminEventUpsertInput>
  >({});
  const [newEventDraft, setNewEventDraft] = useState<AdminEventUpsertInput>(
    createEmptyEventDraft(),
  );

  const {
    data: events,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-events"],
    queryFn: fetchEventsForAdmin,
    enabled: isAdmin,
  });

  const saveEventMutation = useMutation({
    mutationFn: ({ id, input }: { id: string; input: AdminEventUpsertInput }) =>
      updateEventForAdmin(id, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({ title: "Saved", description: "Event updated." });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Could not update event.";
      toast({
        title: "Update failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const createEventMutation = useMutation({
    mutationFn: (input: AdminEventUpsertInput) => createEventForAdmin(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      setNewEventDraft(createEmptyEventDraft());
      toast({
        title: "Event added",
        description: "New event created successfully.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Could not create event.";
      toast({
        title: "Create failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const togglePublishMutation = useMutation({
    mutationFn: ({ id, isPublished }: { id: string; isPublished: boolean }) =>
      setEventPublishedForAdmin(id, isPublished),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: variables.isPublished ? "Event published" : "Event archived",
        description: variables.isPublished
          ? "Event is now visible on the website."
          : "Event is now hidden from the website.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : "Could not change publish status.";
      toast({
        title: "Status update failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (id: string) => deleteEventForAdmin(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      void queryClient.invalidateQueries({ queryKey: ["events"] });
      toast({
        title: "Event deleted",
        description: "Event removed permanently.",
      });
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : "Could not delete event.";
      toast({
        title: "Delete failed",
        description: message,
        variant: "destructive",
      });
    },
  });

  const pendingEventId = saveEventMutation.variables?.id;
  const pendingPublishEventId = togglePublishMutation.variables?.id;
  const pendingDeleteEventId = deleteEventMutation.variables;

  const hasUnsavedEventChanges = useMemo(() => {
    if (!events) {
      return false;
    }

    return events.some((event) => {
      const draft = draftEvents[event.id];
      if (!draft) {
        return false;
      }

      const original = mapEventToDraft(event);
      return JSON.stringify(draft) !== JSON.stringify(original);
    });
  }, [draftEvents, events]);

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
            Admin Events
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
      title="Admin: Events"
      adminEmail={adminEmail}
      activeTab="events"
      onLogout={handleLogout}
    >
      <section className="brutal-card mb-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-2xl font-heading font-extrabold">Events</h2>
          <button
            type="button"
            onClick={() => void refetch()}
            className="brutal-btn-outline inline-flex items-center gap-2"
          >
            <RefreshCcw size={14} /> Refresh
          </button>
        </div>

        <p className="font-body text-muted-foreground mb-6">
          Edit existing events and save each row directly to Supabase.
        </p>

        {isLoading && (
          <p className="font-heading font-bold uppercase tracking-wide text-sm text-muted-foreground mb-4">
            Loading events...
          </p>
        )}

        <div className="space-y-4">
          {events?.map((eventItem) => {
            const draft =
              draftEvents[eventItem.id] ?? mapEventToDraft(eventItem);
            const isSavingThis =
              saveEventMutation.isPending && pendingEventId === eventItem.id;
            const isPublishingThis =
              togglePublishMutation.isPending &&
              pendingPublishEventId === eventItem.id;
            const isDeletingThis =
              deleteEventMutation.isPending &&
              pendingDeleteEventId === eventItem.id;
            const isChanged =
              JSON.stringify(draft) !==
              JSON.stringify(mapEventToDraft(eventItem));

            return (
              <article key={eventItem.id} className="brutal-border p-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
                      Title
                    </label>
                    <input
                      className="w-full brutal-border bg-background px-3 py-2 font-body"
                      value={draft.title}
                      onChange={(event) =>
                        setDraftEvents((prev) => ({
                          ...prev,
                          [eventItem.id]: {
                            ...draft,
                            title: event.target.value,
                          },
                        }))
                      }
                      placeholder="Event title"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
                      Category
                    </label>
                    <select
                      className="w-full brutal-border bg-background px-3 py-2 font-body"
                      value={draft.category}
                      onChange={(event) =>
                        setDraftEvents((prev) => ({
                          ...prev,
                          [eventItem.id]: {
                            ...draft,
                            category: event.target.value as EventCategory,
                          },
                        }))
                      }
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {getEventCategoryLabel(category)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
                      Event Date
                    </label>
                    <input
                      type="datetime-local"
                      className="w-full brutal-border bg-background px-3 py-2 font-body"
                      value={toDatetimeLocalInput(draft.eventDate)}
                      onChange={(event) =>
                        setDraftEvents((prev) => ({
                          ...prev,
                          [eventItem.id]: {
                            ...draft,
                            eventDate: fromDatetimeLocalInput(
                              event.target.value,
                            ),
                          },
                        }))
                      }
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
                      Sort Order
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={0}
                        className="w-full brutal-border bg-background px-3 py-2 font-body"
                        value={draft.sortOrder}
                        onChange={(event) =>
                          setDraftEvents((prev) => ({
                            ...prev,
                            [eventItem.id]: {
                              ...draft,
                              sortOrder: Math.max(
                                0,
                                Number(event.target.value) || 0,
                              ),
                            },
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="brutal-btn-outline px-3"
                        onClick={() =>
                          setDraftEvents((prev) => ({
                            ...prev,
                            [eventItem.id]: {
                              ...draft,
                              sortOrder: Math.max(0, draft.sortOrder - 1),
                            },
                          }))
                        }
                      >
                        -1
                      </button>
                      <button
                        type="button"
                        className="brutal-btn-outline px-3"
                        onClick={() =>
                          setDraftEvents((prev) => ({
                            ...prev,
                            [eventItem.id]: {
                              ...draft,
                              sortOrder: draft.sortOrder + 1,
                            },
                          }))
                        }
                      >
                        +1
                      </button>
                      <button
                        type="button"
                        className="brutal-btn-outline px-3"
                        onClick={() =>
                          setDraftEvents((prev) => ({
                            ...prev,
                            [eventItem.id]: {
                              ...draft,
                              sortOrder: 0,
                            },
                          }))
                        }
                      >
                        Top
                      </button>
                      <button
                        type="button"
                        className="brutal-btn-outline px-3"
                        onClick={() =>
                          setDraftEvents((prev) => ({
                            ...prev,
                            [eventItem.id]: {
                              ...draft,
                              sortOrder: 999,
                            },
                          }))
                        }
                      >
                        Bottom
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
                      Registration Mode
                    </label>
                    <select
                      className="w-full brutal-border bg-background px-3 py-2 font-body"
                      value={draft.registrationMode}
                      onChange={(event) => {
                        const nextMode = event.target
                          .value as EventRegistrationMode;
                        setDraftEvents((prev) => ({
                          ...prev,
                          [eventItem.id]: {
                            ...draft,
                            registrationMode: nextMode,
                            registrationLink:
                              nextMode === "internal"
                                ? null
                                : draft.registrationLink,
                          },
                        }));
                      }}
                    >
                      <option value="external">External</option>
                      <option value="internal">Internal</option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wide">
                      <input
                        type="checkbox"
                        checked={draft.isPublished}
                        onChange={(event) =>
                          setDraftEvents((prev) => ({
                            ...prev,
                            [eventItem.id]: {
                              ...draft,
                              isPublished: event.target.checked,
                            },
                          }))
                        }
                      />
                      Published
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
                      Registration Link
                    </label>
                    <input
                      className="w-full brutal-border bg-background px-3 py-2 font-body"
                      value={draft.registrationLink ?? ""}
                      onChange={(event) =>
                        setDraftEvents((prev) => ({
                          ...prev,
                          [eventItem.id]: {
                            ...draft,
                            registrationLink: event.target.value,
                          },
                        }))
                      }
                      placeholder={
                        draft.registrationMode === "external"
                          ? "https://registration-link"
                          : "Internal mode uses on-site form; keep this empty"
                      }
                      disabled={draft.registrationMode === "internal"}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
                      Poster URL
                    </label>
                    <input
                      className="w-full brutal-border bg-background px-3 py-2 font-body"
                      value={draft.posterUrl ?? ""}
                      onChange={(event) =>
                        setDraftEvents((prev) => ({
                          ...prev,
                          [eventItem.id]: {
                            ...draft,
                            posterUrl: event.target.value,
                          },
                        }))
                      }
                      placeholder="https://.../poster.jpg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
                      Description
                    </label>
                    <textarea
                      className="w-full brutal-border bg-background px-3 py-2 font-body min-h-[96px]"
                      value={draft.description}
                      onChange={(event) =>
                        setDraftEvents((prev) => ({
                          ...prev,
                          [eventItem.id]: {
                            ...draft,
                            description: event.target.value,
                          },
                        }))
                      }
                      placeholder="Event details"
                    />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="brutal-btn-outline"
                    disabled={isPublishingThis}
                    onClick={() =>
                      togglePublishMutation.mutate({
                        id: eventItem.id,
                        isPublished: !eventItem.isPublished,
                      })
                    }
                  >
                    {isPublishingThis
                      ? "Updating..."
                      : eventItem.isPublished
                        ? "Archive"
                        : "Publish"}
                  </button>
                  <button
                    type="button"
                    className="brutal-btn-outline"
                    onClick={() =>
                      setDraftEvents((prev) => ({
                        ...prev,
                        [eventItem.id]: mapEventToDraft(eventItem),
                      }))
                    }
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    disabled={!isChanged || isSavingThis}
                    className="brutal-btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={() =>
                      saveEventMutation.mutate({
                        id: eventItem.id,
                        input: draft,
                      })
                    }
                  >
                    {isSavingThis ? "Saving..." : "Save Event"}
                  </button>
                  <button
                    type="button"
                    disabled={isDeletingThis}
                    className="brutal-btn-outline text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      const shouldDelete = window.confirm(
                        `Delete \"${eventItem.title}\" permanently? This cannot be undone.`,
                      );
                      if (!shouldDelete) {
                        return;
                      }
                      deleteEventMutation.mutate(eventItem.id);
                    }}
                  >
                    {isDeletingThis ? "Deleting..." : "Delete Permanently"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {!isLoading && events && events.length === 0 && (
          <p className="font-body text-muted-foreground">
            No events found yet.
          </p>
        )}

        <div className="mt-4 text-xs font-heading font-bold uppercase tracking-wide text-muted-foreground">
          Unsaved event changes: {hasUnsavedEventChanges ? "Yes" : "No"}
        </div>
      </section>

      <section className="brutal-card">
        <h2 className="text-2xl font-heading font-extrabold mb-4">
          Add New Event
        </h2>
        <p className="font-body text-muted-foreground mb-6">
          Create a new event directly from admin and push it live to Supabase.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
              Title
            </label>
            <input
              className="w-full brutal-border bg-background px-3 py-2 font-body"
              value={newEventDraft.title}
              onChange={(event) =>
                setNewEventDraft((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
              Category
            </label>
            <select
              className="w-full brutal-border bg-background px-3 py-2 font-body"
              value={newEventDraft.category}
              onChange={(event) =>
                setNewEventDraft((prev) => ({
                  ...prev,
                  category: event.target.value as EventCategory,
                }))
              }
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {getEventCategoryLabel(category)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
              Event Date
            </label>
            <input
              type="datetime-local"
              className="w-full brutal-border bg-background px-3 py-2 font-body"
              value={toDatetimeLocalInput(newEventDraft.eventDate)}
              onChange={(event) =>
                setNewEventDraft((prev) => ({
                  ...prev,
                  eventDate: fromDatetimeLocalInput(event.target.value),
                }))
              }
            />
          </div>

          <div>
            <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
              Sort Order
            </label>
            <input
              type="number"
              min={0}
              className="w-full brutal-border bg-background px-3 py-2 font-body"
              value={newEventDraft.sortOrder}
              onChange={(event) =>
                setNewEventDraft((prev) => ({
                  ...prev,
                  sortOrder: Number(event.target.value) || 0,
                }))
              }
            />
          </div>

          <div>
            <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
              Registration Mode
            </label>
            <select
              className="w-full brutal-border bg-background px-3 py-2 font-body"
              value={newEventDraft.registrationMode}
              onChange={(event) => {
                const nextMode = event.target.value as EventRegistrationMode;
                setNewEventDraft((prev) => ({
                  ...prev,
                  registrationMode: nextMode,
                  registrationLink:
                    nextMode === "internal" ? null : prev.registrationLink,
                }));
              }}
            >
              <option value="external">External</option>
              <option value="internal">Internal</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-2 font-heading font-bold text-xs uppercase tracking-wide">
              <input
                type="checkbox"
                checked={newEventDraft.isPublished}
                onChange={(event) =>
                  setNewEventDraft((prev) => ({
                    ...prev,
                    isPublished: event.target.checked,
                  }))
                }
              />
              Published
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
              Registration Link
            </label>
            <input
              className="w-full brutal-border bg-background px-3 py-2 font-body"
              value={newEventDraft.registrationLink ?? ""}
              onChange={(event) =>
                setNewEventDraft((prev) => ({
                  ...prev,
                  registrationLink: event.target.value,
                }))
              }
              placeholder={
                newEventDraft.registrationMode === "external"
                  ? "https://registration-link"
                  : "Internal mode uses on-site form; keep this empty"
              }
              disabled={newEventDraft.registrationMode === "internal"}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
              Poster URL
            </label>
            <input
              className="w-full brutal-border bg-background px-3 py-2 font-body"
              value={newEventDraft.posterUrl ?? ""}
              onChange={(event) =>
                setNewEventDraft((prev) => ({
                  ...prev,
                  posterUrl: event.target.value,
                }))
              }
              placeholder="https://.../poster.jpg"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block font-heading font-bold text-xs uppercase tracking-wide mb-1">
              Description
            </label>
            <textarea
              className="w-full brutal-border bg-background px-3 py-2 font-body min-h-[96px]"
              value={newEventDraft.description}
              onChange={(event) =>
                setNewEventDraft((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Event details"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="brutal-btn-outline"
            onClick={() => setNewEventDraft(createEmptyEventDraft())}
          >
            Reset New Event
          </button>
          <button
            type="button"
            className="brutal-btn-primary inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={createEventMutation.isPending}
            onClick={() => createEventMutation.mutate(newEventDraft)}
          >
            <Plus size={14} />
            {createEventMutation.isPending ? "Creating..." : "Create Event"}
          </button>
        </div>
      </section>
    </AdminShell>
  );
};

export default AdminEvents;
