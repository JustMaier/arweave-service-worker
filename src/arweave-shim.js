import B64js from 'base64-js';

const gateway = 'https://arweave.net';
export function arQL(query){
  return fetch(gateway+'/arql',{
    method: 'post',
    body: JSON.stringify(query)
  }).then(x=>x.json())
}

export function getTransaction(id){
  return fetch(gateway+'/tx/'+id).then(x=>x.json());
}

export function get(id, init){
  return fetch(gateway+'/'+id, init);
}

function b64UrlEncode(b64UrlString) {
  return b64UrlString
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=/g, "");
}

function b64UrlDecode(b64UrlString) {
  b64UrlString = b64UrlString.replace(/\-/g, "+").replace(/\_/g, "/");
  let padding;
  b64UrlString.length % 4 == 0
    ? (padding = 0)
    : (padding = 4 - (b64UrlString.length % 4));
  return b64UrlString.concat("=".repeat(padding));
}

async function ownerToAddress(owner){
  const buffer = new Uint8Array(B64js.toByteArray(b64UrlDecode(owner)));
  const digest = await self.crypto.subtle.digest('SHA-256', buffer);
  return b64UrlEncode(B64js.fromByteArray(new Uint8Array(digest)));
}

export async function getUserAddress(userAlias){
  const txs = await arQL({
      op: 'and',
      expr1: {
          op: 'equals',
          expr1: 'App-Name',
          expr2: 'arweave-id'
      },
      expr2: {
          op: 'and',
          expr1: {
              op: 'equals',
              expr1: 'Alias',
              expr2: userAlias
          },
          expr2: {
              op: 'equals',
              expr1: 'Type',
              expr2: 'name'
          }
      }
  });

  if(!txs || txs.length === 0)
    throw new Error('User alias not found');

  const tx = await getTransaction(txs[txs.length - 1]);
  const address = await ownerToAddress(tx.owner);
  return address;
}

export function getTransactionsFor(address, service = 'me', path = 'index.html', version = null){
  const query = {
    op: 'and',
    expr1: {
        op: 'equals',
        expr1: 'service',
        expr2: service
    },
    expr2: {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: address
        },
        expr2: {
          op: 'equals',
          expr1: 'path',
          expr2: path
        }
    }
  };

  if(version){
    query.expr2.expr2 = {
      op: 'and',
      expr1: {
        op: 'equals',
        expr1: 'path',
        expr2: path
      },
      expr2: {
        op: 'equals',
        expr1: 'version',
        expr2: version
      }
    }
  }

  return arQL(query);
}
