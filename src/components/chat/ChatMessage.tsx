"use client";

import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User, Loader2 } from "lucide-react";

type ChatMessageProps = {
  message: Message;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";
  
  const thinking = message.id === 'thinking';

  if (isSystem) {
    return (
      <div className="text-center text-sm text-muted-foreground italic">
        {message.content}
      </div>
    );
  }

  return (
    <div
      className={cn("flex items-start gap-3", {
        "justify-end": isUser,
      })}
    >
      {!isUser && (
        <Avatar className="h-9 w-9">
          <AvatarImage />
          <AvatarFallback className="bg-primary/20 text-primary">
            <Bot className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-md rounded-lg p-3 text-sm",
          {
            "bg-primary/80 text-primary-foreground": isUser,
            "bg-card border": isAssistant,
          }
        )}
      >
        {thinking ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Thinking...</span>
          </div>
        ) : (
          typeof message.content === 'string' ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            message.content
          )
        )}
      </div>
      {isUser && (
        <Avatar className="h-9 w-9">
          <AvatarImage />
          <AvatarFallback className="bg-secondary">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
