import { Logo } from "./icons/Logo";

export default function Header() {
  return (
    <header className="flex items-center gap-3 p-4 border-b bg-primary/10">
      <Logo className="w-8 h-8 text-primary" />
      <h1 className="text-2xl font-bold text-primary-foreground font-headline">
        Seva Health AI
      </h1>
    </header>
  );
}
