export type CardType<SuitType, ValueType> = {
  id: string;
  value: ValueType;
  suit?: SuitType;
};

export type DeckInfoType<SuitType, ValueType> = {
  suits: Array<SuitType>;
  cardsPerSuit: number;
  jokers?: number;
  defaultValue?: ValueType;
};

export type PlayerType = {
  id: string;
  name: string;
  avatar: string;
  score: number;
};
