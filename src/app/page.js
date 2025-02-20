"use client";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState("");

  const fetchHelloWorld = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/hello");
      const data = await response.json();
      setMessage(data.message); // Update state with response
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Next.js Frontend</h1>
      <button
        onClick={fetchHelloWorld}
        style={{
          padding: "10px 20px",
          fontSize: "18px",
          cursor: "pointer",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#0070f3",
          color: "white",
        }}
      >
        Click Me
      </button>
      {message && <p style={{ marginTop: "20px", fontSize: "20px" }}>{message}</p>}
    </div>
  );
}
