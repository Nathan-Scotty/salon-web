self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'DHB Davilas';
  const options = {
    body: data.body || 'New notification',
    icon: '/davilas_logo.png',
    badge: '/davilas_logo.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/admin' },
    actions: [
      { action: 'open', title: 'View' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'close') return;
  const url = event.notification.data?.url || '/admin';
  event.waitUntil(clients.openWindow(url));
});
