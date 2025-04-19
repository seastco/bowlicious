import React from 'react';

export default function MessageView({ data }) {
  if (!data || !data.exists) return null;

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="message-view">
      <h3>Messages</h3>
      <div className="message-container">
        {data.exchanged.length === 0 ? (
          <div className="no-messages">No messages yet</div>
        ) : (
          data.exchanged.map((m, i) => (
            <div
              key={i}
              className={m.from === 'Bowlicious' ? 'bot-message' : 'user-message'}
            >
              <div className="message-header">
                <strong>{m.from === 'Bowlicious' ? 'Chipotle' : 'Friend'}</strong>
                {m.timestamp && <span className="message-time">{formatTime(m.timestamp)}</span>}
              </div>
              <div className="message-body">{m.text}</div>
            </div>
          ))
        )}
      </div>
      
      {data.botReply && (
        <div className="status">Mission accomplished ✓</div>
      )}
    </div>
  );
}