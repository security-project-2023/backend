import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import entities from '../entities';

import('adminjs').then(async ({ default: AdminJS }) => {
  AdminJS.registerAdapter(await import('@adminjs/typeorm'));
});

@Module({
  imports: [
    import('@adminjs/nestjs').then(async ({ AdminModule }) => {
      return AdminModule.createAdminAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          adminJsOptions: {
            rootPath: '/admin',
            resources: entities,
          },
          auth: {
            authenticate: async (email, password) => {
              const adminAccount = {
                email: config.get<string>('ADMIN_EMAIL'),
                password: config.get<string>('ADMIN_PW'),
              };
              if (
                email === adminAccount.email &&
                password === adminAccount.password
              ) {
                return Promise.resolve(adminAccount);
              }
              return null;
            },
            cookieName: 'adminjs',
            cookiePassword: config.get('ADMINJS_SECRET', 'secret'),
          },
          sessionOptions: {
            resave: false,
            saveUninitialized: true,
            secret: config.get('ADMINJS_SECRET', 'secret'),
          },
        }),
      });
    }),
  ],
})
export class AdminJSModule {}
