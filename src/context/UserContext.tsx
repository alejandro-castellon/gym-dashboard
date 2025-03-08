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
  gymId?: number | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  const [state, setState] = useState<UserContextType>({
    user: null,
    isAdmin: false,
    loading: true,
    gymId: null,
  });

  const fetchUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) {
        setState({ user: null, isAdmin: false, gymId: null, loading: false });
        return;
      }

      // Obtener la información del usuario
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (!userData) {
        setState({ user: null, isAdmin: false, gymId: null, loading: false });
        return;
      }

      let gymId: number | null = null;

      // Si el usuario es admin, buscar el gimnasio donde sea administrador
      if (userData.admin) {
        const { data: gymData } = await supabase
          .from("gyms")
          .select("id")
          .contains("admin_ids", [authData.user.id]) // Busca si el id está en admin_ids
          .single();

        gymId = gymData?.id ?? null;
      }

      setState({
        user: {
          id: authData.user.id,
          email: authData.user.email ?? "",
          name: userData.name ?? "",
          ci: userData.ci ?? "",
          phone: userData.phone ?? "",
          gender: userData.gender ?? "",
          fecha_nacimiento: userData.fecha_nacimiento ?? "",
          created_at: userData.created_at,
        },
        isAdmin: userData.admin || false,
        gymId,
        loading: false,
      });
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [supabase]);

  useEffect(() => {
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [fetchUser, supabase.auth]);

  return <UserContext.Provider value={state}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
}
