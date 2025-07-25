function updateIcon(state) {
  const path = state ? "icon-on.png" : "icon-off.png";
  browser.browserAction.setIcon({ path });
  browser.browserAction.setTitle({
    title: state ? "Sidebar Hidden — Click to Show" : "Sidebar Visible — Click to Hide"
  });
}

function updateIconState(tabId, changeInfo, tab) {
  if (!tab || !tab.url) return;

  const isYouTube = tab.url.includes("://www.youtube.com");
  if (isYouTube) {
    browser.browserAction.enable(tab.id);
  } else {
    browser.browserAction.disable(tab.id);
  }
}

// Run when tab is updated
browser.tabs.onUpdated.addListener(updateIconState);

// Run when tab is activated
browser.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await browser.tabs.get(activeInfo.tabId);
  updateIconState(tab.id, null, tab);
});

// Optional: run on startup for current tab
browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
  if (tabs[0]) updateIconState(tabs[0].id, null, tabs[0]);
});


browser.browserAction.onClicked.addListener(async (tab) => {
  const { sidebarHidden = false } = await browser.storage.local.get("sidebarHidden");
  const newState = !sidebarHidden;

  await browser.storage.local.set({ sidebarHidden: newState });
  updateIcon(newState);

  if (tab.id) {
    browser.tabs.sendMessage(tab.id, { sidebarHidden: newState });
  }
});

// When browser starts, update icon state
browser.runtime.onStartup.addListener(async () => {
  const { sidebarHidden = false } = await browser.storage.local.get("sidebarHidden");
  updateIcon(sidebarHidden);
});

browser.runtime.onInstalled.addListener(async () => {
  const { sidebarHidden = false } = await browser.storage.local.get("sidebarHidden");
  updateIcon(sidebarHidden);
});
