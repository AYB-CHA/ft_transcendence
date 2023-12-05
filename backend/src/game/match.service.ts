import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class MatchService {
  constructor(private readonly prisma: PrismaService) {}

  async create(initiator: string, opponent: string) {
    const match = await this.prisma.match.create({
      data: {
        status: 'READY',
        initiator: {
          connect: { id: initiator },
        },
        participant: {
          connect: { id: opponent },
        },
      },
    });
    return match;
  }

  async get(id: string) {
    const match = await this.prisma.match.findUnique({
      where: { id },
      include: {
        initiator: true,
        participant: true,
      },
    });
    return match;
  }
}
