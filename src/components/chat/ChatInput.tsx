"use client";

import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Mic, Send, Paperclip } from "lucide-react";

type ChatInputProps = {
  onSubmit: (input: string) => void;
  onFileUpload: (file: File) => void;
  disabled: boolean;
};

export function ChatInput({ onSubmit, onFileUpload, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={disabled}
      />
      <Button
        type="button"
        size="icon"
        variant="secondary"
        onClick={handleAttachmentClick}
        disabled={disabled}
        aria-label="Upload file"
      >
        <Paperclip className="h-5 w-5" />
      </Button>
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
