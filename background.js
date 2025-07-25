function updateIcon(state) {
  const path = state ? "icon-on.png" : "icon-off.png";
  browser.browserAction.setIcon({ path });
  browser.browserAction.setTitle({
    title: state ? "Sidebar Hidden — Click to Show" : "Sidebar Visible — Click to Hide"
  });
}

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
