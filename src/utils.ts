import type { Cookie } from "@azure/functions";

export const streamToAsyncIterator = (readable: Response['body']) => {
  if(readable == null) {
    return null;
  }
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

export function cookieHeaderToConfig(cookie) {
  const [[name, encodedValue], ...configArray] = cookie.split(/;\s*/).map((assignment) => assignment.split('=')).map(([key, value]) => [key.toLowerCase(), value]),
    tokenized = Object.fromEntries(configArray),
    config: Cookie = {
      name,
      value: decodeURIComponent(encodedValue)
    };
  if (tokenized['max-age']) {
    config.maxAge = Number.parseInt(tokenized['max-age'], 10);
  }
  if (tokenized.path) {
    config.path = '/api'; // only works like this on swa azure functions v3. Better: tokenized.path;
  }
  if (tokenized.samesite) {
    config.sameSite = tokenized.samesite;
  }
  if (Object.hasOwnProperty.call(tokenized, 'secure')) {
    config.secure = tokenized.secure !== 'false';
  }
  if (Object.hasOwnProperty.call(tokenized, 'httponly')) {
    config.httpOnly = tokenized.httponly !== 'false';
  }
  if (tokenized.expires) {
    config.expires = new Date(tokenized.expires);
  }
  if (tokenized.domain) {
    config.expires = tokenized.Domain;
  }
  return config;
}