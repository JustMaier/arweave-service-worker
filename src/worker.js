import * as arweaveShim from './arweave-shim';
const urlRegex = /\/\@([\w\-]+)\/?\@?([\w\-]*)\/?([\w\-\/\.]*)@?(.+)?$/;

async function emit(event, type, payload){
  const client = await clients.get(event.clientId);
  client.postMessage({type, payload});
}

async function fetchFromArweave(event, [fullPath, user, service, path, version]){
  emit(event,'arweave:captured', {event, fullPath, user, service, path, version});

  const address = await arweaveShim.getUserAddress(user);
  emit(event,'arweave:addressFound', {event, address});

  const transactions = await arweaveShim.getTransactionsFor(address, service, path, version);
  emit(event,'arweave:transactionsFound', {event, transactions});

  if(transactions && transactions.length > 0){
    const transaction = transactions[transactions.length - 1];
    emit(event,'arweave:redirecting', {event, transaction});
    return await arweaveShim.get(transaction);
  }
}

self.addEventListener('fetch', event => {
  if(event.request.url.includes(self.location.origin)){
    const path = event.request.url.replace(self.location.origin,'');
    const match = urlRegex.exec(path);
    if(match) event.respondWith(fetchFromArweave(event, match));
  }

  event.respondWith(fetch(event.request));
});
