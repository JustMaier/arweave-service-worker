Arweave Service Worker
===

A service worker proxy for the Arweave network.

## How it works
Service Workers have the ability to catch every fetch request a browser makes to a specified scope. Using this feature, we can capture all requests that match a specific pattern and proxy them to an Arweave transaction that has corresponding tags by querying the tags with ArQL.

For this version, the service worker looks for the following pattern/tags:
```
@{user}/@{service}/{path}@{version}
```

| attribute | details |
|-----------|---------|
| `user` | This is a user alias registered with a version of ArweaveID where an `Alias` tag is added to `name` registration. To resolve the appropriate user address for additional ArQL requests, this transaction is pulled first |
| `service` | This is the name of the service that created the data for the `user`. Defaults to `me` |
| `path` | This is the path tagged to the transaction. Defaults to `index.html` |
| `version` | This is an easy way to get different versions of a path. Defaults to fetching all version and getting the latest. |


## What's next
- Create new deploy tools to facilitate the multi-file deploy process using the tags needed for the service worker
- Enforce tag uniqueness/ownership to prevent malicious replacements that have the same tag set.
- Add additional request patterns
- Add post support combined with [Arweave Serverless Functions](https://hackmd.io/pGc1tjlFShKyl4wb67JDKA) to create distributed APIs.
