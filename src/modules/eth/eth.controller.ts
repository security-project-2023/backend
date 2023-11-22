import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { EthService } from './eth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard } from '../auth/guards/access.guard';

@Controller('eth')
export class EthController {
  constructor(private readonly ethService: EthService) {}

  @Get('/balance/:address')
  async getBalance(@Param('address') address: string) {
    return await this.ethService.getBalance(address);
  }

  @Post('/:productId')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async buyProduct(
    @Param('productId') productId: string,
    @Req() req: Express.Request,
  ) {
    return await this.ethService.createTicket(req.user, productId);
  }
}
