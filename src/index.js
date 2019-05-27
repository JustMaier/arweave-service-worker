function redirect(){
  const redirectUrl = (new URL(document.location)).searchParams.get('redirect');
  if(redirectUrl) {
    window.location.replace(window.location.origin+redirectUrl);
    return true;
  }
  else return false;
}

navigator.serviceWorker.getRegistration().then(registration => {
  if (!registration || !navigator.serviceWorker.controller) {
    navigator.serviceWorker.register('./worker.js').then(function() {
      console.log('Service worker registered, reloading the page');
      if(!redirect()) window.location.reload();
    });
  } else {
    console.log('DEBUG: client is under the control of service worker');
    redirect();
  }
});

navigator.serviceWorker.addEventListener('message', function({data: {type, payload}}){
  console.log(type, payload);
});
