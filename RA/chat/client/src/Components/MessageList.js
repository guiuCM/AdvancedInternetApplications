import React from "react";

export default function MessageList({ messages }) {
  return (
    <ul>
      {messages.map((m, index) => <li key={index}>{m}</li>)}
    </ul>
  );
}