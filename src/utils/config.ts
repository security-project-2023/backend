import { ConfigService } from '@nestjs/config';

export function get<T>(key: string): T | undefined {
  return new ConfigService().get<T>(key);
}

export const isProduction = () => get('NODE_ENV') === 'production';
export const isDevelopment = () => get('NODE_ENV') === 'development';

export default {
  get,
  isProduction,
  isDevelopment,
};
