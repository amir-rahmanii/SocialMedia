import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4002");

const Chat: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("receiveMessage", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Simple Chat Room</h1>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          width: "300px",
          height: "300px",
          overflow: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ marginRight: "10px" }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
