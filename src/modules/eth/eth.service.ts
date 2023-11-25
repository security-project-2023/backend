import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { abi } from 'src/constants/abi';
import { Product } from 'src/shared/entities';
import { Repository } from 'typeorm';
import Web3 from 'web3';
import { CreateTicketsDto } from './dto/create-ticket.dto';
import { BuyTicketDto } from './dto/buy-ticket.dto';

@Injectable()
export class EthService {
  rpcUrl: string;
  web3: Web3;
  ticketsContract: any;
  contractAbi: any;
  contractAddress: string;

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {
    this.rpcUrl = 'http://127.0.0.1:8545';
    this.web3 = new Web3(new Web3.providers.HttpProvider(this.rpcUrl));
    this.contractAbi = abi;
    this.contractAddress = '0x8fe94376e6E7A350Ffdf3883ed0E2594F22168F2';
    this.ticketsContract = new this.web3.eth.Contract(
      this.contractAbi,
      this.contractAddress,
    );
  }

  async createTickets(body: CreateTicketsDto) {
    const product = await this.productRepository.findOneBy({
      id: body.productId,
    });

    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    const seat_index = product.tiers.findIndex((seat) => seat === body.seat);
    const price = product.prices[seat_index];

    const res = await this.ticketsContract.methods
      .createTicket(
        body.productId,
        product.title,
        body.seat,
        product.time,
        body.amount,
        price,
      )
      .send({
        from: '0x1E767E98CAf3902EB6b11ab54bc964Ccf696DdbF',
        gas: 3000000,
      });

    return res;
  }

  async buyTickets(body: BuyTicketDto) {
    const res = await this.ticketsContract.methods
      .getTicketIds(body.productId)
      .call();

    const ticketId = res[0];

    const ticketRes = await this.ticketsContract.methods
      .purchaseTicket(ticketId)
      .send({
        from: '',
        to: '',
        gas: 3000000,
      });
  }

  async getTicketsById(id: string) {
    const res = await this.ticketsContract.methods.getTicketIds(id).call();

    return res;
  }

  async getTicketsByOwnerId(owner: string) {
    const res = await this.ticketsContract.methods
      .getTicketsByOwnerId(owner)
      .call();

    return res;
  }

  async getAllTickets() {
    const res = await this.ticketsContract.methods.getAllTickets().call();

    return res;
  }
}
