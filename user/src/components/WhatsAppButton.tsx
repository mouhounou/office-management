import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/242069480905"
      target="_blank"
      rel="noreferrer"
      aria-label="Discuter sur WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-elegant animate-pulse-glow hover:scale-110 transition-transform"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
