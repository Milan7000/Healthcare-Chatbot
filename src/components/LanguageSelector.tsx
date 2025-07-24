"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

const languages = [
  { value: "english", label: "English" },
  { value: "hindi", label: "हिंदी" },
  { value: "odia", label: "ଓଡ଼ିଆ" },
  { value: "telugu", label: "తెలుగు" },
  { value: "tamil", label: "தமிழ்" },
  { value: "bengali", label: "বাংলা" },
];

type LanguageSelectorProps = {
  language: string;
  onLanguageChange: (language: string) => void;
};

export function LanguageSelector({ language, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-primary" />
      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
