import { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

function App() {
  const [events, setEvents] = useState([]);
  const [roomId, setRoomId] = useState('');

  useEffect(() => {
    // 1) Read roomId from query string
    const params = new URLSearchParams(window.location.search);
    const r = params.get('roomId')?.trim() || '';
    setRoomId(r);

    if (!r) {
      console.error('❌ No roomId in query string. Use ?roomId=<your-room-id>');
      return;
    }

    // 2) Build the SignalR connection
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5001/hub/${r}`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => console.log(`✅ Viewer connected to room "${r}"`))
      .catch(err => console.error('❌ Hub connection error:', err));

    // 3) Subscribe to incoming events
    connection.on('ReceiveEvent', eventDto => {
      setEvents(prev => [...prev, eventDto.payload]);
    });

    // 4) Clean up on unmount
    return () => {
      connection.stop();
    };
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>TabTempo Live Viewer</h1>
      { !roomId && (
        <p style={{ color: 'red' }}>
          No roomId provided. Append <code>?roomId=&lt;your-room-id&gt;</code> to the URL.
        </p>
      )}
      { roomId && (
        <>
          <p>
            Viewing events for room <strong>{roomId}</strong>
          </p>
          <ul>
            {events.map((e, i) => (
              <li key={i}>
                [{e.timestamp}] <strong>{e.title}</strong> – {e.url}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;