enum Direction {
  UP = 1,
  DOWN = 2,
}

export class CreateGameDto {
  dir!: Direction;
  stop!: boolean;
}
