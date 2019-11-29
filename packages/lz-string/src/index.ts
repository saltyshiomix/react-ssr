import LZString from 'lz-string';
import URLSafeBase64 from 'urlsafe-base64';

export const compress = (json: any) => {
  const packed = JSON.stringify(json);
  const compressed = Buffer.from(LZString.compressToUint8Array(packed));
  const encoded = URLSafeBase64.encode(compressed);
  return encoded;
}

export const decompress = (compressed: string) => {
  const decoded = URLSafeBase64.decode(compressed);
  const decompressed = LZString.decompressFromUint8Array(decoded);
  const unpacked = JSON.parse(decompressed);
  return unpacked;
}
