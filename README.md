<h1 align="center">hono-azurefunc-adapter</h1>
<p align="center">
 Azure Functions V4 adapter for Hono. Run Hono on Azure Functions.
</p>
<br>

<p align="center">
  <a href="https://github.com/marplex/hono-azurefunc-adapter/blob/main/LICENSE"><img alt="License" src="https://img.shields.io/github/license/marplex/hono-azurefunc-adapter"/></a>
  <a href="https://www.npmjs.com/package/@marplex/hono-azurefunc-adapter"><img alt="NPM" src="https://badge.fury.io/js/@marplex%2Fhono-azurefunc-adapter.svg"/></a>
  <a href="https://www.npmjs.com/package/@marplex/hono-azurefunc-adapter"><img src="https://img.shields.io/npm/dt/@marplex/hono-azurefunc-adapter.svg" alt="NPM Downloads"/></a>
  <a href="https://github.com/Marplex"><img alt="Github" src="https://img.shields.io/static/v1?label=GitHub&message=marplex&color=005cb2"/></a>
</p>

# Install

```bash
npm i @marplex/hono-azurefunc-adapter
```

# Getting started
The adapter exposes an handler that converts between standard web Request/Response (used by Hono) and HttpRequest/HttpResponse (used by Azure Functions). This handler is then called by the function http trigger.

```typescript
//app.ts

import { Hono } from "hono";
const app = new Hono();

...

export default app
```

```typescript
//httpTrigger.ts

import honoApp from "./app";

import { azureHonoHandler } from "@marplex/hono-azurefunc-adapter";
import { app } from "@azure/functions";

app.http("httpTrigger", {
  methods: [
    "GET",
    "POST",
    "DELETE",
    "HEAD",
    "PATCH",
    "PUT",
    "OPTIONS",
    "TRACE",
    "CONNECT",
  ],
  authLevel: "anonymous",
  route: "{*proxy}",
  handler: azureHonoHandler(honoApp.fetch),
});
```

# Limitations

There are some limitations and other things you should keep in mind when running Hono inside Azure Functions.

### Route Prefix

The default Azure Functions route prefix is `/api`. Be sure to start all your Hono routes with `/api` or change the default Azure Functions route prefix in `host.json`

```json
{
    "extensions": {
        "http": {
            "routePrefix": ""
        }
    }
}
```

### Crypto

If you are using `hono/bearer-auth` or any other library that uses crypto, be sure to define `global.crypto = require("crypto");` before registering the http trigger.

### Request signal

Azure Functions does not expose any signal or event for listening to http request interruptions. `c.req.raw.signal` is useless and its never aborted.

# Untested scenarios

- SSE (streaming response)