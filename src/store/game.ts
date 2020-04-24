import { action, computed } from "easy-peasy";

export default {
  type: "truco",
  players: 2,
  isFinished: computed(state => state.user != null),
  setType: action((state, payload) => {
    state.type = payload;
  }),
  setPlayers: action((state, payload) => {
    state.players = payload;
  })
};
