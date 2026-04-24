import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function FloatingAi() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl =
    import.meta.env.VITE_API_BASE_URL || "https://medical-backend-api-3d8q.onrender.com";

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${backendUrl}/api/ai/chat`,
        { message }
      );

      const aiMsg = {
        sender: "ai",
        text: res.data.reply,
      };

      setChat((prev) => [...prev, aiMsg]);

    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "ai", text: "❌ Server error", err },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-lg z-50"
      >
        AI
      </div>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-24 right-5 w-80 bg-white rounded-xl shadow-2xl z-50 flex flex-col">

          {/* Header */}
          <div className="bg-blue-600 text-white p-3 font-bold">
            MBSTU AI Doctor
          </div>

          {/* Chat */}
          <div className="h-80 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm whitespace-pre-line ${
                  msg.sender === "user"
                    ? "bg-blue-100 text-right ml-auto"
                    : "bg-gray-200"
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <p className="text-sm text-gray-500">
                AI typing...
              </p>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              className="flex-1 p-2 outline-none"
              placeholder="আপনার সমস্যা লিখুন..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}