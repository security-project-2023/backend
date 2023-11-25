import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AccessGuard } from '../auth/guards/access.guard';
import { CheckPurchaseDto } from './dto/check-purchase.dto';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async create(
    @Req() req: Express.Request,
    @Body() createPurchaseDto: CreatePurchaseDto,
  ) {
    return await this.purchaseService.create(req.user, createPurchaseDto);
  }

  @Patch('success/:purchaseId')
  @ApiBearerAuth()
  @UseGuards(AccessGuard)
  async success(
    @Req() req: Express.Request,
    @Body() body: CheckPurchaseDto,
    @Param('purchaseId') purchaseId: string,
  ) {
    return await this.purchaseService.success(req.user, body, purchaseId);
  }
}
