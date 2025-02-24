"use client";

import { Button } from "@/components/ui/button";
import { openGym } from "@/lib/supabase/actions";
import { useState } from "react";

interface OpenGymButtonProps {
  isOpen: boolean;
  gymId: string;
}

export function OpenGymButton({ isOpen, gymId }: OpenGymButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const handleOpenGym = () => {
    const submitForm = new FormData();
    submitForm.append("is_open", isOpen ? "false" : "true");
    submitForm.append("id", gymId);
    openGym(submitForm);
  };
  return (
    <Button
      className={`
        ${isOpen ? "bg-green-600" : "bg-red-600"} 
        transition-colors duration-200 
        ${isOpen ? "hover:bg-red-600" : "hover:bg-green-600"}
      `}
      onClick={handleOpenGym}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered
        ? isOpen
          ? "¿Cerrar?"
          : "¿Abrir?"
        : isOpen
        ? "Abierto"
        : "Cerrado"}
    </Button>
  );
}
