"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, Send } from "lucide-react";

type ChatInputProps = {
  onSubmit: (input: string) => void;
  disabled: boolean;
};

export function ChatInput({ onSubmit, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSubmit(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Describe your symptoms here..."
        className="flex-1 resize-none"
        rows={1}
        disabled={disabled}
      />
      <Button
        type="button"
        size="icon"
        variant="secondary"
        disabled={disabled}
        aria-label="Use voice"
      >
        <Mic className="h-5 w-5" />
      </Button>
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || disabled}
        aria-label="Send message"
        className="bg-primary hover:bg-primary/90"
      >
        <Send className="h-5 w-5" />
      </Button>
    </form>
  );
}
