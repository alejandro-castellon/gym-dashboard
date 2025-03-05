"use client";

import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mockMembers = [
  { id: "1", name: "John Doe", code: "123456", image: "/placeholder.svg" },
  { id: "2", name: "Jane Smith", code: "234567", image: "/placeholder.svg" },
  // Add more mock members as needed
];

export default function NameSearch() {
  const [searchResults] = useState(mockMembers);

  return (
    <div className="space-y-4">
      <Command className="rounded-lg border bg-white/20">
        <CommandInput
          placeholder="Buscar clientes..."
          className="text-white placeholder-white/50"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {searchResults.map((member) => (
              <CommandItem
                key={member.id}
                className="flex items-center gap-2 text-white hover:bg-white/20"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt={member.name}
                  />
                  <AvatarFallback>
                    {member?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("") || "CM"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p>{member.name}</p>
                  <p className="text-sm ">#{member.code}</p>
                </div>
                <Button size="sm" variant="ghost" className="ml-auto">
                  Check In
                </Button>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
