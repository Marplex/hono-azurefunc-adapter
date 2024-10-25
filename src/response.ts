import type { HttpResponseInit } from "@azure/functions";
import {
  cookiesFromHeaders,
  headersToObject,
  streamToAsyncIterator,
} from "./utils";

export const newAzureFunctionsResponse = (
  response: Response
): HttpResponseInit => {
  let headers = headersToObject(response.headers);
  let cookies = cookiesFromHeaders(response.headers);

  return {
    cookies,
    headers,
    status: response.status,
    body: streamToAsyncIterator(response.body),
  };
}
