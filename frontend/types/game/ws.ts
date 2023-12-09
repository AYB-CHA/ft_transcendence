export const EMITED_MESSAGES = [
  "MOVE_BALL",
  "MOVE_PADDLE_INITIATOR",
  "MOVE_PADDLE_PARTICIPANT",
  "SCOREBOARD",
  "PEERING",
  "LAUNCH_GAME",
  "ANNOUNCE",
] as const;

export const SEND_MESSAGE_TYPE = [
  "MOVE_PADDLE",
  "START_GAME",
  "DEBUG",
  "PEERING",
] as const;

/* const wsGameSchema = z.discriminatedUnion("type", [
const numberTuple = z.tuple([z.number(), z.number(), z.number()]);
  z.object({
    type: z.literal("empty"),
    plyload: z.null(),
  }),
  z.object({
    type: z.literal(EMITED_MESSAGES.START_ROUND),
    payload: z.object({
      count: z.number(),
    }),
  }),
  z.object({
    type: z.literal(EMITED_MESSAGES.MV_BALL),
    payload: z.object({
      pos: numberTuple,
      to: numberTuple,
      time: z.number(),
      dis: z.number(),
    }),
  }),
  z.object({
    type: z.literal(EMITED_MESSAGES.MOVE_PADDLE_LEFT),
    payload: z.object({
      y: z.number(),
    }),
  }),

  z.object({
    type: z.literal(EMITED_MESSAGES.SCOREBOARD),
    payload: z.object({
      left: z.number(),
      right: z.number(),
    }),
  }),
]); */

export type SEND_MESSAGE_VALUES = (typeof SEND_MESSAGE_TYPE)[number];
export type EMITED_MESSAGES_VALUES = (typeof EMITED_MESSAGES)[number];
