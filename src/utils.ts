export const streamToAsyncIterator = (readable: ReadableStream<Uint8Array>) => {
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
