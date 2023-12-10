import { Injectable } from '@nestjs/common';
import { DistanceResult, Vec, add_in, between, getP } from './game.utils';
import { GAME_CONFIG } from './config';
import { PrismaService } from 'src/db/prisma.service';
import * as Cookie from 'cookie';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Match } from '@prisma/client';
import { GameQueue } from './queue.game';
import { MatchService } from './match.service';

type MatchStatus = 'FINISHED' | 'INIT' | 'PLAYING' | 'GOAL';

function defaultMatch(match: Match, initiator: string) {
  return {
    id: match.id,
    status: 'INIT' as MatchStatus,
    rounds: 0,
    participant: {
      id: match.participantId,
      status: 'READY',
      paddleY: 0,
      score: 0,
      clientId: '',
      disconnect: false,
    },
    initiator: {
      id: match.initiatorId,
      status: 'READY',
      paddleY: 0,
      score: 0,
      clientId: initiator,
      disconnect: false,
    },
    ball: {
      pos: Vec(),
      dir: Vec(-1, -1, 0),
    },
  };
}

type Pitch = ReturnType<typeof defaultMatch>;

export function paddleCollision(
  ball: Pitch['ball'],
  paddleY: number,
  dir: number,
) {
  const paddleW =
    GAME_CONFIG.worldWidth * GAME_CONFIG.paddleSizeX + GAME_CONFIG.ballSize;
  const paddleH2 = GAME_CONFIG.worldHeight * GAME_CONFIG.paddleSizeY * 0.5;
  const w2 = (dir * GAME_CONFIG.worldWidth) / 2 + paddleW * -dir;
  return (
    ball.pos.x < w2 &&
    between(ball.pos.y, paddleY - paddleH2, paddleY + paddleH2)
  );
}

@Injectable()
export class GameService {
  static client2user = new Map<string, string>();
  static user2match = new Map<string, Pitch>();
  static user2client = new Map<string, string>();
  constructor(
    private readonly prisma: PrismaService,
    private readonly matchService: MatchService,
    private readonly jwtService: JwtService,
    private readonly gameQueue: GameQueue,
  ) {}

  async findAll(userId: string) {
    const games = await this.prisma.match.findMany({
      where: {
        OR: [{ initiatorId: userId }, { participantId: userId }],
      },
      include: {
        initiator: true,
        participant: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return games;
  }

  async peer(client: Socket, userId: string) {
    const initiator = userId;
    let opponent: string | undefined;
    if (!this.gameQueue.addPlayer(userId)) return;
    while (true) {
      if (client.disconnected) return;
      {
        const match = GameService.user2match.get(userId);
        if (match && match.status === 'INIT') {
          return match;
        }
      }
      if (!(opponent = this.gameQueue.hasEnoughPlayers(userId))) {
        console.log('waiting for opponent', userId);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        continue;
      }

      if (!initiator || !opponent)
        throw new Error('initiator or opponent is null');

      this.gameQueue.pop(opponent);
      this.gameQueue.pop(initiator);

      const match = await this.matchService.create(initiator, opponent);
      const _match = defaultMatch(match, initiator);
      GameService.user2match.set(initiator, _match);
      GameService.user2match.set(opponent, _match);
      return _match;
    }
  }

  static getUserByClientId(clientId: string) {
    return GameService.user2match.get(clientId);
  }

  static getMatchByclientId(clientId: string) {
    const userId = GameService.findUser(clientId);
    return GameService.user2match.get(userId);
  }

  isGoal(data: DistanceResult, match: Pitch, dir: number) {
    if (data.reflectNormal[0] != dir) {
      return false;
    }

    const user = dir == 1 ? match.initiator : match.participant;
    const paddleSizeY = GAME_CONFIG.worldHeight * GAME_CONFIG.paddleSizeY;
    const y1 = user.paddleY - paddleSizeY / 2;
    const y2 = user.paddleY + paddleSizeY / 2;
    if (!between(match.ball.pos.y, y1, y2)) return true;
    return false;
  }

  movePaddle(clientId: string, dir: number) {
    const userId = GameService.findUser(clientId);
    const match = GameService.user2match.get(userId);
    if (!match) return;
    if (match.status !== 'PLAYING') return;
    const user =
      match.initiator.id === userId ? match.initiator : match.participant;
    const h2 =
      GAME_CONFIG.worldHeight / 2 -
      0.5 * GAME_CONFIG.worldHeight * GAME_CONFIG.paddleSizeY;
    if (dir == 1) {
      user.paddleY = add_in(user.paddleY, 0.1, -h2, h2);
    } else {
      user.paddleY = add_in(user.paddleY, -0.1, -h2, h2);
    }

    const event =
      userId === match.initiator.id
        ? 'MOVE_PADDLE_INITIATOR'
        : 'MOVE_PADDLE_PARTICIPANT';

    return {
      event,
      y: user.paddleY,
      users: [
        GameService.user2client[match.initiator.id],
        GameService.user2client[match.participant.id],
      ],
    };
  }

  getBall(clientId: string) {
    const match = GameService.getMatchByclientId(clientId);
    return {
      pos: match.ball.pos.pure(),
      dir: match.ball.dir.pure(),
    };
  }

  async startRound(match: Pitch, update: (data: any) => void) {
    match.ball.pos = Vec();
    for (let i = 3; i > 0; i--) {
      update({
        event: 'ANNOUNCE',
        users: [
          GameService.user2client[match.initiator.id],
          GameService.user2client[match.participant.id],
        ],
        data: { count: i.toString() },
      });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    update({
      event: 'ANNOUNCE',
      users: [
        GameService.user2client[match.initiator.id],
        GameService.user2client[match.participant.id],
      ],
      data: { count: 'GO' },
    });

    match.rounds++;
    match.status = 'PLAYING';
  }

  async saveMatch(match: Pitch, disconnectedUserId: string[]) {
    const initWithdrawl = disconnectedUserId.includes(match.initiator.id);
    const partWithdrawl = disconnectedUserId.includes(match.participant.id);

    let initscore = match.initiator.score;
    let partscore = match.participant.score;

    if (initWithdrawl && !partWithdrawl) {
      initscore = 0;
      partscore = 3;
    } else if (!initWithdrawl && partWithdrawl) {
      initscore = 3;
      partscore = 0;
    }

    await this.prisma.match.update({
      where: { id: match.id },
      data: {
        status: 'FINISHED',
        initiatorStatus: initWithdrawl ? 'UNFINISHED' : 'FINISHED',
        initiatorScore: initscore,
        participantStatus: partWithdrawl ? 'UNFINISHED' : 'FINISHED',
        participantScore: partscore,
      },
    });
  }

  async gameOver(match: Pitch, update: (data: any) => void) {
    update({
      event: 'ANNOUNCE',
      users: [
        GameService.user2client[match.initiator.id],
        GameService.user2client[match.participant.id],
      ],
      data: { count: 'FINISH' },
    });
  }

  async eventLoop(clientId: string, update: (data: any) => void) {
    const userId = GameService.findUser(clientId);
    const match = GameService.user2match.get(userId);
    const isPlaying = () =>
      match.initiator.status === 'PLAYING' &&
      match.participant.status === 'PLAYING';

    if (!match || match.status !== 'INIT') return;

    if (userId !== match.initiator.id) {
      match.participant.status = 'PLAYING';
      if (isPlaying()) match.status = 'PLAYING';
      return;
    }
    match.initiator.status = 'PLAYING';
    if (isPlaying()) match.status = 'PLAYING';

    await this.startRound(match, update);

    const paddleSizeX = GAME_CONFIG.worldWidth * GAME_CONFIG.paddleSizeX;
    const br = GAME_CONFIG.ballSize / 2;
    const h2 = GAME_CONFIG.worldHeight / 2 - br;
    const w2 = GAME_CONFIG.worldWidth / 2 - br - paddleSizeX;
    while (GameService.user2match.has(userId)) {
      if (match.status !== 'PLAYING') {
        await new Promise((resolve) => setTimeout(resolve, 50));
        continue;
      }
      const arr: DistanceResult[] = [];
      // prettier-ignore
      getP(arr, match.ball.pos, match.ball.dir, [-1,  0, 0], [ w2, 0, 0] );
      // prettier-ignore
      getP(arr, match.ball.pos, match.ball.dir, [ 1,  0, 0], [-w2, 0, 0] );
      // prettier-ignore
      getP(arr, match.ball.pos, match.ball.dir, [ 0, -1, 0], [ 0, h2, 0] );
      // prettier-ignore
      getP(arr, match.ball.pos, match.ball.dir, [ 0,  1, 0], [ 0, -h2, 0] );
      const data = arr.reduce((prev, curr) => {
        if (!prev) return curr;
        if (prev.dis > curr.dis) {
          return curr;
        }
        return prev;
      }, arr[0]);
      if (!data) {
        console.error('data is undefined (probably array is empty)', arr);
        // end game
        break;
      }
      const speed = 20;
      const time = data.dis / speed;
      const to = match.ball.pos.add(match.ball.dir.mul(data.dis));
      update({
        event: 'MOVE_BALL',
        users: [
          GameService.user2client[match.initiator.id],
          GameService.user2client[match.participant.id],
        ],
        data: {
          dis: data.dis,
          time,
          pos: match.ball.pos.pure(),
          to: to.pure(),
        },
      });
      await new Promise((resolve) => setTimeout(resolve, time * 1000));
      match.ball.pos = to;
      let isGoal = false;
      if (this.isGoal(data, match, 1)) {
        match.participant.score++;
        isGoal = true;
      } else if (this.isGoal(data, match, -1)) {
        match.initiator.score++;
        isGoal = true;
      }

      match.ball.pos = to;
      match.ball.dir = match.ball.dir.reflect3(data.reflectNormal);

      if (!isGoal) continue;
      else match.status = 'GOAL';

      update({
        event: 'SCOREBOARD',
        data: {
          left: match.initiator.score,
          right: match.participant.score,
        },
        users: [
          GameService.user2client[match.initiator.id],
          GameService.user2client[match.participant.id],
        ],
      });

      if (
        match.initiator.score >= GAME_CONFIG.maxScore ||
        match.participant.score >= GAME_CONFIG.maxScore
      ) {
        match.status = 'FINISHED';

        this.saveMatch(match, []);
        await this.prisma.match.update({
          where: { id: match.id },
          data: {
            participantStatus: 'FINISHED',
            initiatorStatus: 'FINISHED',
            initiatorScore: match.initiator.score,
            participantScore: match.participant.score,
          },
        });

        update({
          event: 'FINISHED',
          data: {},
          users: [
            GameService.user2client[match.initiator.id],
            GameService.user2client[match.participant.id],
          ],
        });

        this.cleanMatch(match.initiator.id);
        this.cleanMatch(match.participant.id);

        return;
      }

      await this.startRound(match, update);
    }
  }

  cleanMatch(userId: string) {
    GameService.user2match.delete(userId);
  }

  getMatch(id: string) {
    return this.matchService.get(id);
  }

  debug() {
    console.log(GAME_CONFIG);
  }

  config() {
    return GAME_CONFIG;
  }

  addClient(userId: string, client: Socket) {
    GameService.client2user[client.id] = userId;
    GameService.user2client[userId] = client.id;
    const match = GameService.user2match.get(userId);
    if (!match) return;
    const user =
      match.initiator.id === userId ? match.initiator : match.participant;
    user.disconnect = false;
  }

  static findUser(clientId: string) {
    return GameService.client2user[clientId];
  }

  removeUser(userId: string | undefined) {
    if (!userId) return;
    const clientId = GameService.user2client[userId];
    GameService.client2user.delete(clientId);
    GameService.user2client.delete(userId);
  }

  removeClient(clientId: string, server: Server) {
    const userId = GameService.findUser(clientId);
    const match = GameService.user2match.get(userId);
    this.gameQueue.pop(userId);
    this.removeUser(userId);
    if (!match || match.status === 'INIT') return;
    match.status = 'FINISHED';
    const user =
      match.initiator.id === userId ? match.participant : match.initiator;
    this.cleanMatch(userId);
    this.cleanMatch(user.id);
    this.saveMatch(match, [userId]);
    console.log('user disconnected', userId);
    server.to(GameService.user2client[user.id]).emit('FINISHED', {});
  }

  getClientIdFromSocket(client: Socket) {
    const authHeader = Cookie.parse(client.handshake.headers.cookie ?? '');
    console.log(client.handshake.headers);
    try {
      const payload = this.jwtService.verify(authHeader.access_token ?? '');
      return payload.sub as string;
    } catch (err) {
      console.log(err);
    }
    return null;
  }

  async getState() {
    const map2str = (map: Map<string, any>) =>
      JSON.stringify(map, (_, value) =>
        value instanceof Map ? [...value] : value,
      );

    return {
      matches: JSON.parse(map2str(GameService.user2match)),
      waiting: Array.from(this.gameQueue.players).join(', '),
    };
  }
}
