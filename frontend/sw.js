self.addEventListener("install", (e) => self.skipWaiting());
self.addEventListener("activate", (e) => self.clients.claim());

self.addEventListener("message", (ev) => {
  const data = ev.data || {};
  if (data.type === "show-notification" && data.payload) {
    const msg = data.payload;
    self.registration.showNotification(msg.username, {
      body: msg.message,
      tag: "chat-message",
      renotify: true,
    });
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      if (windowClients.length > 0) return windowClients[0].focus();
      return clients.openWindow("/");
    })
  );
});
