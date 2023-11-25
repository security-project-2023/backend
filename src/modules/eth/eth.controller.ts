import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EthService } from './eth.service';
import { CreateTicketsDto } from './dto/create-ticket.dto';

@Controller('eth')
export class EthController {
  constructor(private readonly ethService: EthService) {}

  @Post()
  async createTicket(@Body() body: CreateTicketsDto) {
    return await this.ethService.createTickets(body);
  }

  @Get(':id')
  async getTicket(@Param('id') id: string) {
    return await this.ethService.getTicketsById(id);
  }

  @Get('owner/:id')
  async getTicketOwner(@Param('id') id: string) {
    return await this.ethService.getTicketsByOwnerId(id);
  }

  @Get()
  async getAllTickets() {
    return await this.ethService.getAllTickets();
  }
}
