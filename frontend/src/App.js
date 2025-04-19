import React, { useState, useEffect } from 'react';
import PhoneForm from './components/PhoneForm';
import MessageView from './components/MessageView';
import { api } from './api';
import './App.css';

function App() {
  const [phone, setPhone] = useState('');
  const [data, setData] = useState(null);
  const searchParams = new URLSearchParams(window.location.search);
  const paid = searchParams.get('paid') === 'true';

  useEffect(() => {
    const p = searchParams.get('phone');
    if (p) setPhone(p);
    if (p && paid) {
      api.post('/sms/send', { phone: p }).then(res => setData(res.data));
    } else if (p) {
      api.get(`/sms/${p}`).then(res => setData(res.data));
    }
  }, [paid]);

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>🌮 BOWLICIOUS 🌮</h1>
        <p className="tagline">Send a fake promotional Chipotle text for $1.</p>
        <p className="tagline">Watch the whole thing unfold.</p>
      </div>
      
      <div className="steps-container">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-content">
            <p>Enter a phone number and pay</p>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-content">
            <p>They'll get this text:</p>
            <div className="text-message">
              CHIPOTLE: Reply with "BOWLICIOUS" for a free meal code! Deal lasts through Friday!
            </div>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-content">
            <p>They reply: "BOWLICIOUS"</p>
          </div>
        </div>
        
        <div className="step">
          <div className="step-number">4</div>
          <div className="step-content">
            <p>We call them a fatass gremlin</p>
          </div>
        </div>
      </div>

      <div className="action-section">
        <PhoneForm setPhone={setPhone} data={data} setData={setData} />
        <MessageView data={data} />
      </div>
      
      <div className="disclaimer">
        <p>Not actually Chipotle.</p>
      </div>
    </div>
  );
}

export default App;