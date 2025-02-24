"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<UserContextType>({
    user: null,
    isAdmin: false,
    loading: true,
  });

  const fetchUser = useCallback(async () => {
    const supabase = createClient();
    const controller = new AbortController();

    try {
      setState((prev) => ({ ...prev, loading: true }));

      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", authData.user.id)
          .single();

        if (userData) {
          setState({
            user: {
              id: authData.user.id,
              email: authData.user.email ?? "",
              name: userData.name ?? "",
              ci: userData.ci ?? "",
              fecha_nacimiento: userData.fecha_nacimiento ?? "",
              created_at: userData.created_at,
            },
            isAdmin: userData.admin || false,
            loading: false,
          });
        } else {
          setState({ user: null, isAdmin: false, loading: false });
        }
      } else {
        setState({ user: null, isAdmin: false, loading: false });
      }
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }

    return () => controller.abort();
  }, []);

  useEffect(() => {
    fetchUser();

    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUser]);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
}
