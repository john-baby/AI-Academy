import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import messageIcon from "../../assets/message.png";

const AITutor = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { type: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const response = await fetch("http://localhost:5000/model/chat/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chapter_name: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }
      setInput("");
      const data = await response.json();
      const systemMessage = { type: "system", text: data.response };
      setMessages((prevMessages) => [...prevMessages, systemMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = { type: "system", text: "Error fetching response. Please try again." };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{
          ...styles.chatContainer,
          justifyContent: messages.length === 0 ? "center" : "flex-start",
        }}>
        {messages.length === 0 ? (
          <div style={styles.emptyState}>  
            <div style={styles.imageContainer}>
              <div style={styles.overlay}></div>
              <img
                src={messageIcon}
                alt="Start learning"
                style={styles.emptyStateImage}
              />
            </div>
            <p style={styles.emptyStateText}>Start your learning journey by asking a question!</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              style={
                message.type === "user"
                  ? { ...styles.message, ...styles.userMessage }
                  : { ...styles.message, ...styles.systemMessage }
              }
            >
              {message.type === "system" ? (
                <ReactMarkdown>{message.text}</ReactMarkdown>
              ) : (
                message.text
              )}
            </div>
          ))
        )}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#1e1e1e",
    color: "#e4e4e4",
  },
  chatContainer: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #333",
    backgroundColor: "#2c2c2c",
    position: "sticky",
    bottom: 0,
    // width: "100%",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #444",
    fontSize: "1rem",
    backgroundColor: "#1e1e1e",
    color: "#e4e4e4",
  },
  sendButton: {
    marginLeft: "10px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  message: {
    padding: "10px",
    borderRadius: "5px",
    maxWidth: "80%",
    wordWrap: "break-word",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    color: "#000",
  },
  systemMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#3C3C3C",
    color: "#fff",
  },
  emptyState: {
    textAlign: "center",
    color: "#ccc",
  },
  emptyStateImage: {
    width: "150px",
    marginBottom: "10px",
    filter: "brightness(0.8)",
  },
  emptyStateText: {
    fontSize: "1.2rem",
    color: "#ccc",
  },
  imageContainer: {
    position: "relative",
    display: "inline-block",
  },
  overlay: {
    position: "absolute",
    top: "40%", // Adjust to match the lines' vertical position
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "100px", // Adjust the size to cover the lines
    height: "50px", // Adjust the height to match the lines
    backgroundColor: "#fff",
    zIndex: 0,
  },
};

export default AITutor;
