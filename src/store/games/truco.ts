import { action, computed, Action, Computed } from "easy-peasy";
import { PlayerType } from "../../~types/Game";
import { CardType } from "../../~types/SpanishDeck";
import { RoundType, ScoreType } from "../../~types/Truco";

enum GameTypes {
  short,
  full
}

export interface TrucoModel {
  type: GameTypes;
  round: number;
  rounds: RoundType[];
  scores: ScoreType[];
  isFinished: Computed<TrucoModel, boolean>;
  nextRound: Action<TrucoModel>;
}

const trucoModel: TrucoModel = {
  type: GameTypes.full,
  round: 0,
  rounds: [],
  scores: [],
  isFinished: computed(state =>
    state.scores.some(({ points }) => {
      return state.type === GameTypes.full ? points >= 30 : points >= 15;
    })
  ),
  nextRound: action((state, payload) => {
    state.round = state.round + 1;
  }),
  setPlayers: action((state, payload) => {
    state.players = payload;
  })
};

export default trucoModel;
