import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { DistanceResult, Vec, add_in, between, getP } from './game.utils';
import { GAME_CONFIG } from './config';
import { PrismaService } from 'src/db/prisma.service';

const pitch = {
  status: 0,
  paddle: {
    leftY: 0,
    rightY: 0,
  },
  ball: {
    pos: Vec(),
    dir: Vec(-1, -1, 0),
  },
  goal: {
    left: 0,
    right: 0,
  },
};

type Pitch = typeof pitch;

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
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const games = await this.prisma.match.findMany({});
    return games;
  }

  movePaddle(createGameDto: CreateGameDto) {
    const h2 =
      GAME_CONFIG.worldHeight / 2 -
      0.5 * GAME_CONFIG.worldHeight * GAME_CONFIG.paddleSizeY;
    if (createGameDto.dir == 1) {
      pitch.paddle.leftY = add_in(pitch.paddle.leftY, 0.2, -h2, h2);
    } else {
      pitch.paddle.leftY = add_in(pitch.paddle.leftY, -0.2, -h2, h2);
    }
    return { y: pitch.paddle.leftY };
  }

  resetGame(status: number) {
    pitch.status = status;
    pitch.ball.dir = Vec(-1, -1, 0).norm();
    pitch.ball.pos = Vec();
    return pitch;
  }

  getBall() {
    return {
      pos: pitch.ball.pos.pure(),
      dir: pitch.ball.dir.pure(),
    };
  }

  async eventLoop(update: (data: any) => void) {
    this.resetGame(1);
    const paddleSizeX = GAME_CONFIG.worldWidth * GAME_CONFIG.paddleSizeX;
    const paddleSizeY = GAME_CONFIG.worldHeight * GAME_CONFIG.paddleSizeY;
    const br = GAME_CONFIG.ballSize / 2;
    const h2 = GAME_CONFIG.worldHeight / 2 - br;
    const w2 = GAME_CONFIG.worldWidth / 2 - br - paddleSizeX;
    while (pitch.status == 1) {
      const arr: DistanceResult[] = [];
      // prettier-ignore
      getP(arr, pitch.ball.pos, pitch.ball.dir, [-1,  0, 0], [ w2, 0, 0] );
      // prettier-ignore
      getP(arr, pitch.ball.pos, pitch.ball.dir, [ 1,  0, 0], [-w2, 0, 0] );
      // prettier-ignore
      getP(arr, pitch.ball.pos, pitch.ball.dir, [ 0, -1, 0], [ 0, h2, 0] );
      // prettier-ignore
      getP(arr, pitch.ball.pos, pitch.ball.dir, [ 0,  1, 0], [ 0, -h2, 0] );
      const data = arr.reduce((prev, curr) => {
        if (!prev) return curr;
        if (prev.dis > curr.dis) {
          return curr;
        }
        return prev;
      }, arr[0]);
      if (!data) {
        console.error('data is undefined (probably array is empty)', arr);
        pitch.status = 0;
        break;
      }
      const speed = 1;
      const time = data.dis / speed;
      const to = pitch.ball.pos.add(pitch.ball.dir.mul(data.dis));
      update({
        event: 'MOVE_BALL',
        data: {
          dis: data.dis,
          time,
          pos: pitch.ball.pos.pure(),
          to: to.pure(),
        },
      });
      await new Promise((resolve) => setTimeout(resolve, time * 1000));
      /*
      const y1 = pitch.paddle.leftY - paddleSizeY / 2;
      const y2 = pitch.paddle.leftY + paddleSizeY / 2;
      if (data.reflectNormal[0] == 1) {
        if (!between(pitch.ball.pos.y, y1, y2)) {
          pitch.goal.right++;
          const border = pitch.ball.pos.add(pitch.ball.dir.mul(-0.1));
          update({
            event: 'MOVE_BALL',
            data: {
              dis: 0.1,
              time: 0.1 / speed,
              pos: to.pure(),
              to: border.pure(),
            },
          });
          await new Promise((resolve) => setTimeout(resolve, time * 1000));
          update({
            event: 'SCOREBOARD',
            data: pitch.goal,
          });
          this.resetGame(1);
          update({
            event: 'START_ROUND',
            data: { count: 3 },
          });
          continue;
        }
      } */
      pitch.ball.pos = to;
      pitch.ball.dir = pitch.ball.dir.reflect3(data.reflectNormal);

      //  break;
    }
  }

  debug() {
    console.log(pitch);
    console.log(GAME_CONFIG);
  }

  config() {
    return GAME_CONFIG;
  }
}
