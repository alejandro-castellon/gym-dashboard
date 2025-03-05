"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NumericKeypad() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleKeyPress = (key: string) => {
    if (key === "delete") {
      setCode((prev) => prev.slice(0, -1));
    } else if (key === "submit") {
      handleSubmit();
    } else {
      setCode((prev) => (prev + key).slice(0, 6)); // Limit to 6 digits
    }
  };

  const handleSubmit = async () => {
    if (code.length < 4) {
      return;
    }

    setIsLoading(true);
    try {
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const keys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "delete",
    "0",
    "submit",
  ];

  const getKeyContent = (key: string) => {
    switch (key) {
      case "delete":
        return <X className="h-6 w-6" />;
      case "submit":
        return <Check className="h-6 w-6" />;
      default:
        return key;
    }
  };

  return (
    <>
      <input
        type="text"
        value={code}
        readOnly
        placeholder="Introduce el Ci..."
        className="w-full rounded-md bg-white/20 p-4 text-center text-xl text-white placeholder-white/50 focus:outline-none"
      />
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {keys.map((key) => (
            <Button
              key={key}
              onClick={() => handleKeyPress(key)}
              disabled={isLoading}
              variant="ghost"
              className={cn(
                "h-16 w-full rounded-full bg-white/20 text-2xl text-white hover:bg-white/30 disabled:opacity-50",
                (key === "delete" || key === "submit") && "text-base"
              )}
            >
              {getKeyContent(key)}
            </Button>
          ))}
        </div>
        <Button
          onClick={() => handleSubmit()}
          disabled={isLoading}
          className="w-full bg-emerald-500 py-6 text-lg font-medium hover:bg-emerald-600"
        >
          {isLoading ? "Checking..." : "Check In →"}
        </Button>
      </div>
    </>
  );
}
