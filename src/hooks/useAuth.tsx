import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isPro: boolean;
  signOut: () => Promise<void>;
  refreshProStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  isPro: false,
  signOut: async () => {},
  refreshProStatus: async () => {},
});

const ADMIN_EMAIL = "lazy@lazyunicorn.ai";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);

  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshProStatus = async () => {
    if (!user) {
      setIsPro(false);
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke("check-pro-status");
      if (!error && data) {
        setIsPro(data.isPro === true);
      }
    } catch {
      // Fallback to user_roles check
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const roleList = (roles || []).map((r) => r.role);
      setIsPro(roleList.includes("pro") || roleList.includes("admin"));
    }
  };

  // Check pro status when user changes
  useEffect(() => {
    refreshProStatus();
  }, [user]);

  // Auto-assign admin role when admin logs in
  useEffect(() => {
    if (isAdmin && user) {
      supabase
        .from("user_roles")
        .select("id")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle()
        .then(({ data }) => {
          if (!data) {
            supabase
              .from("user_roles")
              .insert({ user_id: user.id, role: "admin" })
              .then(() => {});
          }
        });
    }
  }, [isAdmin, user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, isAdmin, isPro, signOut, refreshProStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
