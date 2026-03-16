import { FormEvent, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { isAdminSession } from "@/lib/adminAuth";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [isAlreadyAdmin, setIsAlreadyAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      if (!supabase) {
        setSessionReady(true);
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setIsAlreadyAdmin(isAdminSession(data.session));
      setSessionReady(true);
    };

    void checkSession();

    const { data: authListener } = supabase?.auth.onAuthStateChange(
      (_event, session) => {
        setIsAlreadyAdmin(isAdminSession(session));
      },
    ) ?? { data: { subscription: null } };

    return () => {
      isMounted = false;
      authListener.subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      toast({
        title: "Supabase not configured",
        description: "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY first.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Enter an email to receive the magic login link.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/admin/events`,
      },
    });
    setIsSending(false);

    if (error) {
      toast({
        title: "Login link failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Check your inbox",
      description: "Magic link sent. Open it to complete admin login.",
    });
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen px-4 py-20">
        <div className="container mx-auto max-w-xl brutal-card">
          <h1 className="text-3xl font-heading font-extrabold mb-4">
            Admin Login
          </h1>
          <p className="font-body text-muted-foreground">
            Supabase is not configured for this project yet.
          </p>
        </div>
      </div>
    );
  }

  if (sessionReady && isAlreadyAdmin) {
    return <Navigate to="/admin/events" replace />;
  }

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="container mx-auto max-w-xl brutal-card">
        <span className="inline-flex brutal-border bg-foreground text-background px-3 py-1 text-xs font-heading font-bold uppercase tracking-wide mb-4">
          Hidden Route
        </span>
        <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3">
          Admin Login
        </h1>
        <p className="font-body text-muted-foreground mb-6">
          Sign in with magic link to access the admin panel.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block font-heading text-xs uppercase tracking-wide font-bold">
            Admin Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            className="w-full brutal-border bg-background px-4 py-3 font-body"
            autoComplete="email"
          />

          <button
            type="submit"
            disabled={isSending}
            className="brutal-btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSending ? "Sending..." : "Send Magic Link"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="mt-4 brutal-btn-outline"
        >
          Back to Website
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
