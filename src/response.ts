import type { HttpResponseInit } from "@azure/functions";
import { cookieHeaderToConfig, headersToObject, streamToAsyncIterator } from "./utils";

export const newAzureFunctionsResponse = (
  response: Response
): HttpResponseInit => {
  let cookies;
  try {
    cookies = response.headers.getSetCookie().map(cookieHeaderToConfig);
    response.headers.delete('set-cookies');
  } catch {};
  return {
    cookies: cookies,
    status: response.status,
    headers: headersToObject(response.headers),
    body: streamToAsyncIterator(response.body),
  };
}
