import uniqueId from "lodash/uniqueId";
import times from "lodash/times";
import shuffle from "lodash/shuffle";
import includes from "lodash/includes";
import sampleSize from "lodash/sampleSize";
import groupBy from "lodash/groupBy";
import forEach from "lodash/forEach";

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

export type SpanishSuitsType = "espada" | "basto" | "oro" | "copa";
export type SpanishValueType = number;
export type SpanishCardType = CardType<SpanishSuitsType, SpanishValueType>;
const SPANISH_DECK: DeckInfoType<SpanishSuitsType, SpanishValueType> = {
  suits: ["espada", "basto", "oro", "copa"],
  cardsPerSuit: 12,
  jokers: 2
};

export function generateDeck<SuitType, ValueType>(
  valueTransform: (index: number) => ValueType
) {
  return ({
    suits,
    cardsPerSuit,
    jokers = 0
  }: DeckInfoType<SuitType, ValueType>) => {
    return suits.reduce<Array<any>>(
      (cards, suit) => [
        ...cards,
        ...times(cardsPerSuit, n => ({
          id: uniqueId(`card-${suit}-`),
          value: valueTransform(n),
          suit
        }))
      ],
      times(jokers, () => ({ id: uniqueId("card-"), value: "joker" }))
    );
  };
}

export const getNumericDeck = generateDeck(index => index + 1);
export const getSpanishDeck = () => getNumericDeck(SPANISH_DECK);
export const getTrucoDeck = () =>
  getSpanishDeck().filter(({ value }) => !includes(["joker", 8, 9], value));

export const shuffleDeck = (deck: Array<CardType<any, any>>) => shuffle(deck);
export const dealHand = (
  deck: Array<CardType<any, any>>,
  cardsPerHand: number = 1,
  players: number = 1
) =>
  times(players).reduce(
    game => {
      const hand = sampleSize(game.deck, cardsPerHand);
      game.hands.push(hand);
      game.deck = game.deck.filter(card => !includes(hand, card));
      return game;
    },
    { deck, hands: [] } as {
      deck: Array<CardType<any, any>>;
      hands: Array<Array<CardType<any, any>>>;
    }
  );

const getEnvidoValue = (value: number) =>
  includes([10, 11, 12], value) ? 0 : value;

export enum EnvidoTypes {
  nada,
  envido,
  flor
}
const calcEnvido = (
  suit: Array<SpanishCardType>,
  type: EnvidoTypes = EnvidoTypes.nada
) =>
  suit.reduce(
    (res, { value }) => {
      const envidoValue = getEnvidoValue(value);
      return type === EnvidoTypes.nada
        ? res < envidoValue
          ? envidoValue
          : res
        : envidoValue + res;
    },
    type === EnvidoTypes.nada ? 0 : 20
  );

export const getEnvido = (suit: Array<SpanishCardType>) => {
  const type =
    suit.length === 3
      ? EnvidoTypes.flor
      : suit.length === 2
      ? EnvidoTypes.envido
      : EnvidoTypes.nada;
  return {
    type,
    value: calcEnvido(suit, type)
  };
};

const checkSuitForEnvido = (suit?: Array<SpanishCardType>) => {
  if (suit && suit.length > 1) throw getEnvido(suit);
};

export const checkHandForEnvido = (hand: Array<SpanishCardType>) => {
  try {
    forEach(groupBy(hand, "suit"), checkSuitForEnvido);
    return { type: EnvidoTypes.nada, value: calcEnvido(hand) };
  } catch (envido) {
    return envido;
  }
};
