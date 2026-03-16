import { useEffect, useState } from "react";
import { isAdminSession } from "@/lib/adminAuth";
import { supabase } from "@/lib/supabase";

export function useAdminSession() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      if (!supabase) {
        if (isMounted) {
          setSessionChecked(true);
        }
        return;
      }

      const { data } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      setAdminEmail(data.session?.user?.email ?? null);
      setIsAdmin(isAdminSession(data.session));
      setSessionChecked(true);
    };

    void bootstrap();

    const { data: authListener } =
      supabase?.auth.onAuthStateChange((_event, session) => {
        setAdminEmail(session?.user?.email ?? null);
        setIsAdmin(isAdminSession(session));
      }) ?? { data: { subscription: null } };

    return () => {
      isMounted = false;
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return {
    sessionChecked,
    isAdmin,
    adminEmail,
  };
}
