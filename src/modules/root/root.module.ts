import { Module } from '@nestjs/common';
import { RootController } from './root.controller';
import { RootService } from './root.service';
import { ConfigModule } from '@nestjs/config';
import { ConfigValidator } from 'src/validators/config';
import * as path from 'path';
import { DatabaseModule } from 'src/shared/providers/database.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { AdminJSModule } from 'src/shared/providers/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [path.resolve(`src/env/${process.env.NODE_ENV}.env`)],
      validationSchema: ConfigValidator,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProductModule,
    AdminJSModule,
  ],
  controllers: [RootController],
  providers: [RootService],
})
export class RootModule {}
