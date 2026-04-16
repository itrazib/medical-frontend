import { useEffect, useState, useRef } from "react";
import socket from "./socket";

const WhatsAppChat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const room = "mbstu_room";
  const chatEndRef = useRef(null);

  // auto scroll bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    socket.emit("join_room", room);

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      room,
      message,
      sender: "USER",
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#e5ddd5]">

      {/* HEADER */}
      <div className="bg-[#075e54] text-white p-4 font-semibold text-lg">
        MBSTU AI Doctor 💬
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">

        {chat.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "USER" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg text-sm shadow
              ${
                msg.sender === "USER"
                  ? "bg-[#dcf8c6]"
                  : "bg-white"
              }`}
            >
              <div className="text-xs font-bold mb-1">
                {msg.sender === "USER" ? "You" : "AI Doctor"}
              </div>
              {msg.message}
            </div>
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="flex items-center gap-2 p-3 bg-[#f0f0f0]">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 rounded-full border focus:outline-none"
        />

        <button
          onClick={sendMessage}
          className="bg-[#075e54] text-white px-4 py-2 rounded-full"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default WhatsAppChat;