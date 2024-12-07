self.addEventListener('push', function(event) {
  if (event.data) {
    const notification = event.data.json();
    event.waitUntil(
      self.registration.showNotification(notification.title, {
        body: notification.body,
        icon: notification.icon
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // 알림 클릭시 앱 열기
  event.waitUntil(
    clients.openWindow('/')
  );
});