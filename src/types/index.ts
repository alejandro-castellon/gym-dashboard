export interface User {
  id: string; // El ID del usuario, igual al ID de auth de Supabase
  email: string; // El correo del usuario
  name: string; // El nombre del usuario
  admin: boolean; // Indicador si el usuario es administrador
  created_at: string; // Fecha de creación del usuario en formato ISO
}

export interface Gym {
  id: string; // ID del gimnasio
  name: string; // Nombre del gimnasio
  created_at: string; // Fecha de creación del gimnasio en formato ISO
  user_id: string; // ID del usuario (propietario o administrador)
}

export interface Membership {
  id: string; // ID de la membresía
  created_at: string; // Fecha de creación de la membresía en formato ISO
  user_id: string; // ID del usuario (quien tiene la membresía)
  gym_id: string; // ID del gimnasio al que está asociada la membresía
  start_date: string; // Fecha de inicio de la membresía en formato ISO
  end_date: string; // Fecha de finalización de la membresía en formato ISO
  price: number; // Precio de la membresía
}
