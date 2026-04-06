import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="https://wa.me/91XXXXXXXXXX?text=Hi%20Digital%20Penta!"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      title="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300 group"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
      <MessageCircle className="w-6 h-6 text-white relative z-10" fill="white" />
    </a>
  );
}
