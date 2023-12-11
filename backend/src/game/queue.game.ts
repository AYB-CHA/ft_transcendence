import { Injectable } from '@nestjs/common';

@Injectable()
export class GameQueue {
  players = new Set<string>();

  addPlayer(userId: string) {
    if (this.players.has(userId)) return false;
    this.players.add(userId);
    return true;
  }

  getLast(otherthan: string) {
    for (const player of this.players) {
      if (player === otherthan) continue;
      return player;
    }
    throw new Error('No player found');
  }

  pop(userId: string) {
    this.players.delete(userId);
  }

  getPlayers() {
    return this.players;
  }

  consumePlayer(userId: string) {
    if (this.players.size >= 2) {
      const last = this.getLast(userId);
      this.pop(last);
      this.pop(userId);
      return last;
    }
    return undefined;
  }
}
