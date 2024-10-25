import type { HttpRequest } from "@azure/functions";
import { headersToObject } from "./utils";

export const newRequestFromAzureFunctions = (request: HttpRequest): Request => {
  const hasBody = !["GET", "HEAD"].includes(request.method);

  return new Request(request.url, {
    method: request.method,
    headers: headersToObject(request.headers),
    ...(hasBody ? { body: request.body as ReadableStream, duplex: "half" } : {}),
  });
};
