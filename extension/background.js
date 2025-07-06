importScripts('signalr.min.js');

const ROOM_ID = 'devroom';

// 1) Register your alarm handler
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name !== "pollActiveTab") return;

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    const t = tabs[0];
    const data = {
      tabId:   t.id,
      title:   t.title,
      url:     t.url,
      timestamp: new Date().toISOString()
    };

    console.log("Polled via alarm:", data);
    connection.invoke("SendEvent", {
      roomId: ROOM_ID,
      eventType: "tabInfo",
      payload: data
    }).catch(err => console.error("❌ SendEvent failed:", err));
  });
});

// 2) Bootstrap SignalR
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`https://localhost:5001/hub/${ROOM_ID}`)
  .withAutomaticReconnect()
  .build();

connection.start()
  .then(() => console.log(`✅ Connected to SignalR hub in room "${ROOM_ID}"`))
  .catch(err => console.error("❌ SignalR connection error:", err));

// 3) Do an immediate manual poll once on load (optional)
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    console.log("Manual poll on load:", {
      id:        tabs[0].id,
      title:     tabs[0].title,
      url:       tabs[0].url,
      timestamp: new Date().toISOString()
    });
  }
});

// 4) Schedule a recurring alarm every 1 minute
chrome.alarms.create("pollActiveTab", {
  periodInMinutes: 1
});