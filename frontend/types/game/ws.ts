import { z } from "zod";

export const EMITED_MESSAGES = [
  "START_ROUND",
  "MOVE_BALL",
  "MOVE_PADDLE_LEFT",
  "SCOREBOARD",
] as const;

export const SEND_MESSAGE_TYPE = [
  "MOVE_PADDLE_LEFT",
  "START_GAME",
  "DEBUG",
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
