navigator.serviceWorker.getRegistration().then(registration => {
  if (!registration || !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('/worker.js').then(function() {
      console.log('Service worker registered, reloading the page');
      window.location.reload();
    });
  } else {
    document.body.classList.add('registered');
  }
});

window.unregister = async function(){
  const registration = await navigator.serviceWorker.getRegistration();
  await registration.unregister();
  document.body.classList.remove('registered');
  document.body.classList.add('unregistered');
}
