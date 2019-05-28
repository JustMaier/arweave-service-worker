navigator.serviceWorker.getRegistration().then(registration => {
  if (!registration || !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('/worker.js').then(function() {
      console.log('Service worker registered, reloading the page');
      window.location.reload();
    });
  } else {
    console.log('DEBUG: client is under the control of service worker');
  }
});
