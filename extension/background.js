// Load the SignalR client library
importScripts('signalr.min.js');

const ROOM_ID = 'devroom';

// Build the connection (using WebSockets transport under the hood)
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`wss://localhost:5001/hub/${ROOM_ID}`)
  .withAutomaticReconnect()
  .build();

// Start the connection
connection.start()
  .then(() => {
    console.log(`✅ Connected to SignalR hub in room "${ROOM_ID}"`);
  })
  .catch(err => {
    console.error("❌ SignalR connection error:", err);
  });

// Create a repeating alarm named "pollActiveTab" every 1 minute
chrome.alarms.create("pollActiveTab", {
  periodInMinutes: 1
});

// Listen for the alarm and send the active tab info over SignalR
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "pollActiveTab") return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return;
    const activeTab = tabs[0];

    const data = {
      tabId: activeTab.id,
      title: activeTab.title,
      url: activeTab.url,
      timestamp: new Date().toISOString()
    };

    connection.invoke("SendEvent", {
      roomId: ROOM_ID,
      eventType: "tabInfo",
      payload: data
    }).catch(err => console.error("❌ SendEvent failed:", err));
  });
});