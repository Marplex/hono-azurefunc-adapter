import { HttpRequest, InvocationContext } from "@azure/functions";
import { newRequestFromAzureFunctions } from "./request";
import { newAzureFunctionsResponse } from "./response";

export type FetchCallback = (
  request: Request,
  env: Record<string, unknown>
) => Promise<Response> | Response;

export function azureHonoHandler(fetch: FetchCallback) {
  return async (request: HttpRequest, _context: InvocationContext) =>
    newAzureFunctionsResponse(
      await fetch(newRequestFromAzureFunctions(request), process.env)
    );
}
