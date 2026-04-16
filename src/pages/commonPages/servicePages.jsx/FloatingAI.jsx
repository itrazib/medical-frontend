import { useState } from "react";
import { MessageCircle } from "lucide-react";
import WhatsAppChat from "./WhatsAppChat";

const FloatingAI = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 bg-[#075e54] text-white p-4 rounded-full shadow-lg hover:scale-105 transition"
      >
        <MessageCircle />
      </button>

      {/* WHATSAPP CHAT MODAL */}
      {open && <WhatsAppChat onClose={() => setOpen(false)} />}
    </>
  );
};

export default FloatingAI;