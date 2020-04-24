import { CardType } from "./SpanishDeck";

export type PlayType = { playerId: string; card: CardType; round?: number };
export type RoundType = PlayType[];
export type ScoreType = { playerId: string; points: number };
