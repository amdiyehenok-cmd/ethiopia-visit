import type { ChatMessage as Msg } from "@/types";

export function ChatMessageBubble({ message }: { message: Msg }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-gold-dark to-gold-primary text-obsidian"
            : "border border-white/10 bg-white/5 text-ivory backdrop-blur-md"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
