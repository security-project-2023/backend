import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePurchaseDto } from './dto/create-purchase.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Purchase, Status } from 'src/shared/entities';
import { Repository } from 'typeorm';
import { CheckPurchaseDto } from './dto/check-purchase.dto';
import { EthService } from '../eth/eth.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
``;
@Injectable()
export class PurchaseService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseRepository: Repository<Purchase>,
    private readonly ethService: EthService,
    private readonly configService: ConfigService,
  ) {}

  public async create(
    user: Express.User,
    createPurchaseDto: CreatePurchaseDto,
  ) {
    const existingPurchase = await this.purchaseRepository.findBy({
      user: {
        id: user.id,
      },
    });

    existingPurchase.forEach((purchase) => {
      if (purchase.status === 'pending') {
        throw new HttpException(
          "You've already purchased this product",
          HttpStatus.BAD_REQUEST,
        );
      }
    });

    const purchase = this.purchaseRepository.create({
      ...createPurchaseDto,
      user,
      status: Status.PENDING,
    });

    await this.purchaseRepository.save(purchase);

    return purchase;
  }

  public async success(
    user: Express.User,
    body: CheckPurchaseDto,
    purchaseId: string,
  ) {
    const purchase = await this.purchaseRepository.findOneBy({
      id: purchaseId,
    });

    if (!purchase) {
      throw new HttpException('Purchase not found', HttpStatus.NOT_FOUND);
    }

    if (purchase.status !== 'pending') {
      throw new HttpException(
        'Purchase has already been processed',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (purchase.user.id !== user.id) {
      throw new HttpException(
        'You are not authorized to access this purchase',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const { orderId } = body;

    try {
      const data = await axios.get(
        `https://api.tosspayments.com/v1/payments/orders/${orderId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${Buffer.from(
              this.configService.get('TOSS_SECRET_KEY'),
            ).toString('base64')}`,
          },
        },
      );

      const { status } = data.data;

      if (status !== 'DONE') {
        throw new HttpException(
          'Failed to check purchase status',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      purchase.status = Status.CONFIRMED;

      await this.purchaseRepository.save(purchase);
    } catch {
      throw new HttpException(
        'Failed to check purchase status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
