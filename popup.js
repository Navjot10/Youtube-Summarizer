document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');

  chrome.storage.sync.get('sidebarEnabled', function(data) {
    toggleSwitch.checked = data.sidebarEnabled !== undefined ? data.sidebarEnabled : true;
  });

  toggleSwitch.addEventListener('change', function() {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.sync.set({sidebarEnabled: isEnabled});

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'TOGGLE_SIDEBAR', enabled: isEnabled});
    });
  });
});
