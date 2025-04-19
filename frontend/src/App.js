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
      <PhoneForm setPhone={setPhone} data={data} setData={setData} />
      <MessageView data={data} />
    </div>
  );
}

export default App;