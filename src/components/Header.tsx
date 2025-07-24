import { Logo } from "./icons/Logo";
import { LanguageSelector } from "./LanguageSelector";

type HeaderProps = {
  language: string;
  onLanguageChange: (language: string) => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 p-4 border-b bg-primary/10">
      <div className="flex items-center gap-3">
        <Logo className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-primary-foreground font-headline">
          Seva Health AI
        </h1>
      </div>
      <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
    </header>
  );
}
