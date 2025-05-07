import { useState } from "react";
import styles from "../app/styles/Home.module.css"

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = { sender: "user", text: input };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      const botMessage: Message = { sender: "bot", text: data.output };
      setChat((prev) => [...prev, botMessage]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        { sender: "bot", text: "Error fetching response." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2>Traffic Assistant</h2>
        <div className={styles.navItem}>New Chat</div>
        <div className={styles.navItem}>History (soon)</div>
      </aside>

      <main className={styles.chatArea}>
        <div className={styles.chatBox}>
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`${styles.message} ${
                msg.sender === "user" ? styles.user : styles.bot
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div className={`${styles.message} ${styles.bot}`}>
              Bot is typing...
            </div>
          )}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} disabled={loading}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
