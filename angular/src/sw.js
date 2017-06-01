'use strict';


let applicationServerPublicKey = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


self.addEventListener('push', function(event) {
  const data = event.data.json();

  const title = data.title;
  const options = data.options;

  event.waitUntil(self.registration.showNotification(title, options));
});


self.addEventListener('notificationclick', function(event) {
  const url = event.notification.data.url;
  event.notification.close();
  event.waitUntil(
    clients.openWindow(url)
  );
});


self.addEventListener("message", function(e) {
  applicationServerPublicKey = e.data.applicationServerPublicKey;
}, false);


self.addEventListener('pushsubscriptionchange', function(event) {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      // TODO: Send to application server
    })
  );
});
