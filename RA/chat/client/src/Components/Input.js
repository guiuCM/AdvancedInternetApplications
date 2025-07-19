import React, { useState } from "react";

export default function Input({ send, buttonText }) {
  const [text, setText] = useState('');

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    send(text);
    setText('');
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={text} onChange={handleChange} />
      <input type="submit" value={buttonText} />
    </form>
  );
}