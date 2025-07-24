import Header from "@/components/Header";
import ChatWindow from "@/components/chat/ChatWindow";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow />
      </main>
    </div>
  );
}
