"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types";

interface UserContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const fetchUser = async () => {
      try {
        setLoading(true);

        // Obtener el usuario autenticado
        const { data: authData } = await supabase.auth.getUser();

        if (authData?.user) {
          // Obtener datos adicionales del usuario usando su ID
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", authData.user.id)
            .single();

          if (userData) {
            setUser({
              id: authData.user.id,
              email: authData.user.email ?? "",
              name: userData.name ?? "",
              ci: userData.ci ?? "",
              fecha_nacimiento: userData.fecha_nacimiento ?? "",
              created_at: userData.created_at,
            });
            setIsAdmin(userData.admin || false);
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    // Llamar al cargar el componente
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
}
