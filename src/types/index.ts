export interface User {
  id: string; // El ID del usuario, igual al ID de auth de Supabase
  email: string; // El correo del usuario
  name: string; // El nombre del usuario
  created_at: string; // Fecha de creación del usuario en formato ISO
  fecha_nacimiento: string; // Fecha de nacimiento del usuario en formato ISO
  ci: string; // Carnet de identidad del usuario
}

interface GymHours {
  [key: string]: {
    open: string;
    close: string;
  };
}

export interface Gym {
  id: string; // ID del gimnasio
  name: string; // Nombre del gimnasio
  created_at: string; // Fecha de creación del gimnasio en formato ISO
  user_id: string; // ID del usuario (propietario o administrador)
  hours: GymHours; // Horario de apertura y cierre del gimnasio
}

export interface Membership {
  id: string; // ID de la membresía
  created_at: string; // Fecha de creación de la membresía en formato ISO
  user_id: string; // ID del usuario (quien tiene la membresía)
  gym_id: string; // ID del gimnasio al que está asociada la membresía
  start_date: string; // Fecha de inicio de la membresía en formato ISO
  end_date: string; // Fecha de finalización de la membresía en formato ISO
  price: number; // Precio de la membresía
  gyms?: {
    // Información adicional sobre el gimnasio (opcional si no existe)
    name: string; // Nombre del gimnasio
  };
}
