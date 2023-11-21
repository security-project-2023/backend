import { User as CommonUser } from 'src/shared/entities';

declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface User extends CommonUser {}
  }
}
