import { Get, Module, Param } from '@nestjs/common';
import { EthService } from './eth.service';
import { EthController } from './eth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/shared/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [EthController],
  providers: [EthService],
})
export class EthModule {}
