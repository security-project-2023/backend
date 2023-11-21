import * as crypto from 'crypto';

export function sha256(payload: string) {
  return crypto.createHash('sha256').update(payload).digest('hex');
}
