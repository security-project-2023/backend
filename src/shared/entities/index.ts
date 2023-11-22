import { Product } from './product.entity';
import { Purchase } from './purchase.entity';
import { User } from './user.entity';

export * from './user.entity';
export * from './product.entity';
export * from './purchase.entity';

export default [User, Product, Purchase];
