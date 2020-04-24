import { CardType as BaseCardType } from "./Game";

export type SuitsType = "espada" | "basto" | "oro" | "copa";
export type ValueType = number;
export type CardType = BaseCardType<SuitsType, ValueType>;
