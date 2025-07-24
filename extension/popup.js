const input = document.getElementById('roomInput');
const button = document.getElementById('saveButton');
const status = document.getElementById('status');

// On load: populate input with any stored roomId
chrome.storage.local.get(['roomId'], ({ roomId }) => {
  if (roomId) input.value = roomId;
});

// On click: save the value
button.addEventListener('click', () => {
  const roomId = input.value.trim();
  if (!roomId) {
    status.textContent = 'Please enter a room ID.';
    status.style.color = 'red';
    return;
  }
  chrome.storage.local.set({ roomId }, () => {
    status.textContent = `Saved “${roomId}”`;
    status.style.color = 'green';
    // clear message after 2s
    setTimeout(() => (status.textContent = ''), 2000);
  });
});