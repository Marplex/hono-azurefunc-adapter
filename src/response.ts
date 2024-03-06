import { HttpResponseInit } from "@azure/functions";
import { headersToObject, streamToAsyncIterator } from "./utils";

export const newAzureFunctionsResponse = (
  response: Response
): HttpResponseInit => ({
  status: response.status,
  headers: headersToObject(response.headers),
  body: streamToAsyncIterator(response.body),
})
