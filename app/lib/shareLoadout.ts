import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export function encodeLoadout<T>(data: T): string {
  return compressToEncodedURIComponent(JSON.stringify(data));
}

export function decodeLoadout<T>(encoded: string): T | null {
  try {
    const json = decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
