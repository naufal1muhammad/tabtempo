// Create a repeating alarm named "pollActiveTab" every 1 minute
chrome.alarms.create("pollActiveTab", {
  periodInMinutes: 1
});

// Listen for the alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pollActiveTab") {
    // Query the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const activeTab = tabs[0];

      // For now, just log the URL and title
      console.log("Polled active tab:", {
        id: activeTab.id,
        title: activeTab.title,
        url: activeTab.url
      });

      // TODO: send this data to storage or over SignalR
    });
  }
});