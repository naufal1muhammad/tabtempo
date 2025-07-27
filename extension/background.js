importScripts('signalr.min.js');

// Helper to bootstrap once we know the roomId
function initWithRoom(roomId) {
  if (!roomId) {
    console.error('❌ No roomId found in storage; please set one in the popup.');
    return;
  }

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJvaXJvb20iLCJyb29tIjoib2lyb29tIiwiZXhwIjoxNzUzNTA2MDU1LCJpc3MiOiJUYWJUZW1wb0FQSSIsImF1ZCI6IlRhYlRlbXBvQ2xpZW50In0.oSpnFHU1w_SV1R-2V1YustaicCPos9615EDs98FrjqM";
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`https://localhost:5001/hub/${roomId}`, {
    accessTokenFactory: () => Promise.resolve(token)
  })
  .withAutomaticReconnect()
  .build();

  // Build and start the SignalR connection
//   const connection = new signalR.HubConnectionBuilder()
//     .withUrl(`https://localhost:5001/hub/${roomId}`)
//     .withAutomaticReconnect()
//     .build();

  connection.start()
    .then(() => console.log(`✅ Connected to SignalR hub in room "${roomId}"`))
    .catch(err => console.error('❌ SignalR connection error:', err));

  // Register the alarm listener
  chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name !== 'pollActiveTab') return;

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const t = tabs[0];
      if (!t) return;
      const data = {
        tabId:     t.id,
        title:     t.title,
        url:       t.url,
        timestamp: new Date().toISOString()
      };
      console.log('Polled via alarm →', data);

      connection.invoke('SendEvent', {
        roomId,
        eventType: 'tabInfo',
        payload:   data
      }).catch(e => console.error('❌ SendEvent failed:', e));
    });
  });

  // Schedule a repeating alarm every minute
  chrome.alarms.create('pollActiveTab', { periodInMinutes: 1 });
}

// On service-worker startup, read the stored roomId and initialize
chrome.storage.local.get(['roomId'], ({ roomId }) => {
  initWithRoom(roomId);
});