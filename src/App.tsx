import React, { useState, useEffect, useCallback } from "react";
import { useStoreState, useStoreActions } from "easy-peasy";
import "./styles.css";
import {
  getSpanishDeck,
  getTrucoDeck,
  shuffleDeck,
  dealHand,
  EnvidoTypes,
  checkHandForEnvido
} from "./helpers/deck";
import sampleSize from "lodash/sampleSize";

const TRUCO_RULES = {
  cardsPerHand: 3,
  rounds: 3
};

const Hand = ({ cards, player, onClick, ...props }) => {
  const envido = checkHandForEnvido(cards);
  return (
    <div {...props}>
      <h2>{player}</h2>
      <h4>Has Flor?: {envido.type === EnvidoTypes.flor ? "true" : "false"}</h4>
      <h4>
        Has Envido?: {envido.type === EnvidoTypes.envido ? "true" : "false"}
      </h4>
      <pre>{JSON.stringify(envido)}</pre>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {cards.map((card, i) => (
          <button
            key={`card_${i}`}
            onClick={() => onClick && onClick(card, i)}
            style={{
              flex: 1,
              height: "150px",
              maxWidth: "100px",
              padding: "1em",
              margin: "1em"
            }}
          >
            <h1>{card.value}</h1>
            <br />
            <h2>{card.suit}</h2>
            <h2>{card.played ? "true" : "false"}</h2>
          </button>
        ))}
      </div>
    </div>
  );
};

const PLAYERS = ["Thram", "Matute", "Hellion", "Negro", "Moishe", "Pela"];

const useHand = ({ nextTurn }: any) => {
  const game = useStoreState(state => state.game);
  const [hand, setHand] = useState<any>([]);
  return {
    hand,
    playCard: useCallback(
      handIndex => (card: any, cardIndex: number) => {
        if (!card.played) {
          hand[handIndex][cardIndex].played = true;
          setHand(hand);
          nextTurn();
        }
      },
      [hand, setHand, nextTurn]
    ),
    dealHand: useCallback(() => {
      const { hands } = dealHand(
        shuffleDeck(getTrucoDeck()),
        TRUCO_RULES.cardsPerHand,
        game.players
      );
      setHand(hands);
    }, [game.players])
  };
};

const useNextTurn = ({ setPlayerTurn, playingPlayers, playerTurn }: any) =>
  useCallback(() => {
    setPlayerTurn(
      playingPlayers[playingPlayers.indexOf(playerTurn) + 1] ||
        playingPlayers[0]
    );
  }, [setPlayerTurn, playingPlayers, playerTurn]);

export default function App() {
  const game = useStoreState(state => state.game);
  const setPlayers = useStoreActions(action => action.game.setPlayers);
  const [playingPlayers, setPlayingPlayers] = useState<Array<string>>([]);
  const [round, setRound] = useState(0);
  const [playerTurn, setPlayerTurn] = useState<string>("");
  const nextTurn = useNextTurn({ setPlayerTurn, playingPlayers, playerTurn });
  const { hand, dealHand, playCard } = useHand({ nextTurn });
  useEffect(() => {
    const selectedPlayers = sampleSize(PLAYERS, game.players);
    setPlayingPlayers(selectedPlayers);
    setPlayerTurn(selectedPlayers[0]);
    dealHand();
  }, [game.players, dealHand]);

  useEffect(() => {
    console.log({ hand });
    const isFinished = hand.every(h => {
      console.log({ h });
      return h.every(c => {
        console.log({ c });
        return c.played;
      });
    });
    console.log("Finished?", isFinished);
  }, [hand]);
  console.log("playerTurn", playerTurn, playingPlayers);
  console.log("chichon", { deck: getSpanishDeck() });
  console.log("truco", { deck: shuffleDeck(getTrucoDeck()) });

  console.log("Deal hand", hand);

  return (
    <div className="App">
      <h1>Truco</h1>
      <button onClick={() => setPlayers(game.players + 2)}>
        <h2>Add Players</h2>
      </button>
      <h3>Turn: {playerTurn}</h3>
      {hand.map((h, i) => (
        <Hand
          key={`hand_${i}`}
          cards={h}
          onClick={playingPlayers[i] === playerTurn ? playCard(i) : undefined}
          player={playingPlayers[i]}
          style={{
            color: playerTurn === playingPlayers[i] ? "green" : "black"
          }}
        />
      ))}
      <div>
        <button onClick={nextTurn}>
          <h2>Next Turn</h2>
        </button>
        <button onClick={dealHand}>
          <h2>Deal hand</h2>
        </button>
      </div>
    </div>
  );
}
