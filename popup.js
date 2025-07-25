const btn = document.getElementById("toggleSidebarBtn");

chrome.storage.sync.get("blockSidebar", (data) => {
  const state = data.blockSidebar ?? true;
  btn.textContent = state ? "Unblock Sidebar" : "Block Sidebar";
});

btn.addEventListener("click", () => {
  chrome.storage.sync.get("blockSidebar", (data) => {
    const newState = !data.blockSidebar;
    chrome.storage.sync.set({ blockSidebar: newState }, () => {
      btn.textContent = newState ? "Unblock Sidebar" : "Block Sidebar";
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { toggleSidebar: newState });
      });
    });
  });
});
