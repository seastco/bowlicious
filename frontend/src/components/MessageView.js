import React from 'react';

export default function MessageView({ data }) {
  if (!data || !data.exists) return null;
  return (
    <div className="message-view">
      <h2>Conversation</h2>
      <div className="message-container">
        {data.exchanged.map((m, i) => (
          <div key={i} className={m.from === 'Bowlicious' ? 'bot-message' : 'user-message'}>
            <strong>{m.from}:</strong> {m.text}
          </div>
        ))}
      </div>
    </div>
  );
}