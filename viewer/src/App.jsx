import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const ROOM_ID = 'devroom';
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5001/hub/${ROOM_ID}`)
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log('✅ Viewer connected to hub'))
      .catch(err => console.error('❌ Hub connection error:', err));

    connection.on('ReceiveEvent', (eventDto) => {
      // eventDto.payload contains { tabId, title, url, timestamp }
      setEvents(prev => [...prev, eventDto.payload]);
    });

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>TabTempo Live Viewer</h1>
      <ul>
        {events.map((e, i) => (
          <li key={i}>
            [{e.timestamp}] <strong>{e.title}</strong> – {e.url}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;