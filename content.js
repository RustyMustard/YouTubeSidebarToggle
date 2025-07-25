function applySidebar(hidden) {
  const html = document.documentElement;
  const styleId = "yt-sidebar-toggle-style";

  if (hidden) {
    html.classList.add("yt-sidebar-blocked");

    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        ytd-app[guide-persistent-and-visible] #guide {
          display: none !important;
        }
        ytd-mini-guide-renderer {
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }
  } else {
    html.classList.remove("yt-sidebar-blocked");
    const style = document.getElementById(styleId);
    if (style) style.remove();
  }
}

browser.runtime.onMessage.addListener((message) => {
  if (message.sidebarHidden !== undefined) {
    applySidebar(message.sidebarHidden);
  }
});

// On page load, apply last saved state
browser.storage.local.get("sidebarHidden").then(({ sidebarHidden }) => {
  applySidebar(sidebarHidden ?? false);
});
