import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/shared/entities';
import { Repository } from 'typeorm';
import Web3 from 'web3';

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
    this.contractAbi = [
      {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'ERC721IncorrectOwner',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'ERC721InsufficientApproval',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'approver',
            type: 'address',
          },
        ],
        name: 'ERC721InvalidApprover',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
        ],
        name: 'ERC721InvalidOperator',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'ERC721InvalidOwner',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'receiver',
            type: 'address',
          },
        ],
        name: 'ERC721InvalidReceiver',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
        ],
        name: 'ERC721InvalidSender',
        type: 'error',
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'ERC721NonexistentToken',
        type: 'error',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'approved',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            indexed: false,
            internalType: 'bool',
            name: 'approved',
            type: 'bool',
          },
        ],
        name: 'ApprovalForAll',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            indexed: true,
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'getApproved',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
        ],
        name: 'isApprovedForAll',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [],
        name: 'name',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'ownerOf',
        outputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        name: 'safeTransferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'operator',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'approved',
            type: 'bool',
          },
        ],
        name: 'setApprovalForAll',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'bytes4',
            name: 'interfaceId',
            type: 'bytes4',
          },
        ],
        name: 'supportsInterface',
        outputs: [
          {
            internalType: 'bool',
            name: '',
            type: 'bool',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
          },
        ],
        name: 'tickets',
        outputs: [
          {
            internalType: 'string',
            name: 'owner',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'title',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'price',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'seat',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'date',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'tokenURI',
        outputs: [
          {
            internalType: 'string',
            name: '',
            type: 'string',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
      {
        inputs: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_owner',
            type: 'string',
          },
          {
            internalType: 'string',
            name: '_title',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: '_price',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: '_seat',
            type: 'string',
          },
          {
            internalType: 'string',
            name: '_date',
            type: 'string',
          },
        ],
        name: 'createTicket',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        inputs: [
          {
            internalType: 'string',
            name: '_owner',
            type: 'string',
          },
        ],
        name: 'getTicketsByOwnerId',
        outputs: [
          {
            components: [
              {
                internalType: 'string',
                name: 'owner',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'title',
                type: 'string',
              },
              {
                internalType: 'uint256',
                name: 'price',
                type: 'uint256',
              },
              {
                internalType: 'string',
                name: 'seat',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'date',
                type: 'string',
              },
            ],
            internalType: 'struct Tickets.TicketData[]',
            name: '',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
        constant: true,
      },
    ];
    this.contractAddress = '0x14ba56435514d6A81Fe54e9639745766c2E389f8';
    this.ticketsContract = new this.web3.eth.Contract(
      this.contractAbi,
      this.contractAddress,
    );
  }

  async getBalance(address: string) {
    const balance = await this.web3.eth.getBalance(address);
    console.log(balance);
    return balance;
  }

  async createTicket(user: Express.User, purchaseId: string) {
    //   const purchaseId = await this.productRepository.findOneBy({
    //     id: productId,
    //   });
    //   if (!product) {
    //     throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    //   }
    //   const construct = await this.ticketsContract.methods.createTicket(
    //     user.id,
    //     product.title,
    //     product.prices,
    //     'test',
    //     'test',
    //   );
  }
}
