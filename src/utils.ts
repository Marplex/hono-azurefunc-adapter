import type { Cookie } from "@azure/functions";

export const streamToAsyncIterator = (readable: Response["body"]) => {
  if (readable == null) return null;
  const reader = readable.getReader();
  return {
    next() {
      return reader.read();
    },
    return() {
      return reader.releaseLock();
    },
    [Symbol.asyncIterator]() {
      return this;
    },
  } as AsyncIterableIterator<Uint8Array>;
};

type LoopableHeader = {
  forEach: (callbackfn: (value: string, key: string) => void) => void;
};

export function headersToObject(input: LoopableHeader): Record<string, string> {
  const headers: Record<string, string> = {};
  input.forEach((v, k) => (headers[k] = v));
  return headers;
}

export function cookiesFromHeaders(headers: Headers): Cookie[] | undefined {
  const cookies = headers.getSetCookie();
  if (cookies.length === 0) return undefined;

  return cookies.map(parseCookieString);
}

export function parseCookieString(cookieString: string): Cookie {
  const [[name, encodedValue], ...attributesArray] = cookieString
    .split(";")
    .map((x) => x.split("="))
    .map(([key, value]) => [key.trim().toLowerCase(), value ?? "true"]);

  const attrs: Record<string, string> = Object.fromEntries(attributesArray);
  
  return {
    name,
    value: decodeURIComponent(encodedValue),
    path: attrs["path"],
    sameSite: attrs["samesite"] as "Strict" | "Lax" | "None" | undefined,
    secure: attrs["secure"] === "true",
    httpOnly: attrs["httponly"] === "true",
    domain: attrs["domain"],
    expires: attrs["expires"] ? new Date(attrs["expires"]) : undefined,
    maxAge: attrs["max-age"] ? parseInt(attrs["max-age"]) : undefined,
  };
}
