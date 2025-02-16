"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Player, Question } from '../types/game';
import { getQuestionsByCategory } from '../questions';
import { socket } from '../socket';

// Define all possible actions
type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'ADD_PLAYER'; player: Player }
  | { type: 'REMOVE_PLAYER'; playerId: string }
  | { type: 'UPDATE_PLAYER_SCORE'; playerId: string; newScore: number }
  | { type: 'SET_PLAYER_READY'; playerId: string; isReady: boolean }
  | { type: 'SELECT_QUESTION'; question: Question }
  | { type: 'CLEAR_QUESTION' }
  | { type: 'RECORD_BUZZ'; playerId: string }
  | { type: 'CLEAR_BUZZ_ORDER' }
  | { type: 'START_TIMER' }
  | { type: 'STOP_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'SET_QUESTION_ANSWERED'; questionId: string }
  | { type: 'SET_GAME_STATE'; state: GameState };

// Convert our questions data into the board format
const initialBoard = Object.entries(getQuestionsByCategory()).map(([name, questions]) => ({
  name,
  questions: questions.map(q => ({
    ...q,
    value: q.amount,
    isRevealed: false,
    isAnswered: false
  }))
}));

// Initial state with fixed game code
const initialState: GameState = {
  gameCode: "1234", // Fixed game code matching our password
  isActive: false,
  players: [],
  currentQuestion: null,
  buzzOrder: [],
  board: initialBoard,
  timer: {
    isActive: false,
    seconds: 5,
    defaultDuration: 5
  },
  connections: {
    hostConnected: false,
    tvConnected: false
  }
};

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return action.state;
      
    case 'START_GAME':
      socket.emit('start_game', { gameCode: state.gameCode, board: state.board });
      return state;
      
    case 'END_GAME':
      socket.emit('end_game', { gameCode: state.gameCode });
      return state;
      
    case 'ADD_PLAYER':
      socket.emit('join_game', { 
        gameCode: state.gameCode, 
        player: action.player 
      });
      return state;
      
    case 'REMOVE_PLAYER':
      // Handled by server
      return state;
      
    case 'UPDATE_PLAYER_SCORE':
      socket.emit('update_score', {
        gameCode: state.gameCode,
        playerId: action.playerId,
        newScore: action.newScore
      });
      return state;
      
    case 'SET_PLAYER_READY':
      socket.emit('player_ready', {
        gameCode: state.gameCode,
        playerId: action.playerId,
        isReady: action.isReady
      });
      return state;
      
    case 'SELECT_QUESTION':
      socket.emit('select_question', {
        gameCode: state.gameCode,
        question: action.question
      });
      return state;
      
    case 'CLEAR_QUESTION':
      // This is handled through question_answered event
      if (state.currentQuestion) {
        socket.emit('question_answered', {
          gameCode: state.gameCode,
          questionId: state.currentQuestion.id
        });
      }
      return state;
      
    case 'RECORD_BUZZ':
      socket.emit('buzz', {
        gameCode: state.gameCode,
        playerId: action.playerId
      });
      return state;
      
    case 'CLEAR_BUZZ_ORDER':
      // Handled by server when clearing question
      return state;
      
    case 'START_TIMER':
    case 'STOP_TIMER':
    case 'RESET_TIMER':
    case 'SET_QUESTION_ANSWERED':
      // These are all handled by server-side events
      return state;
      
    default:
      return state;
  }
}

// Create context
const GameStateContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
} | null>(null);

// Provider component
export function GameStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    // Only connect to socket, don't join game yet
    socket.connect();

    // Listen for game state updates
    socket.on('game_state_update', (newState: GameState) => {
      dispatch({ type: 'SET_GAME_STATE', state: newState });
    });

    // Cleanup on unmount
    return () => {
      socket.off('game_state_update');
      socket.disconnect();
    };
  }, []);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
}

// Custom hook for using the game state
export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}

// Helper functions for common game actions
export function useGameActions() {
  const { dispatch } = useGameState();
  
  return {
    startGame: () => dispatch({ type: 'START_GAME' }),
    endGame: () => dispatch({ type: 'END_GAME' }),
    addPlayer: (player: Player) => dispatch({ type: 'ADD_PLAYER', player }),
    removePlayer: (playerId: string) => dispatch({ type: 'REMOVE_PLAYER', playerId }),
    updateScore: (playerId: string, newScore: number) => 
      dispatch({ type: 'UPDATE_PLAYER_SCORE', playerId, newScore }),
    setPlayerReady: (playerId: string, isReady: boolean) => 
      dispatch({ type: 'SET_PLAYER_READY', playerId, isReady }),
    selectQuestion: (question: Question) => 
      dispatch({ type: 'SELECT_QUESTION', question }),
    clearQuestion: () => dispatch({ type: 'CLEAR_QUESTION' }),
    recordBuzz: (playerId: string) => dispatch({ type: 'RECORD_BUZZ', playerId }),
    clearBuzzOrder: () => dispatch({ type: 'CLEAR_BUZZ_ORDER' }),
    startTimer: () => dispatch({ type: 'START_TIMER' }),
    stopTimer: () => dispatch({ type: 'STOP_TIMER' }),
    resetTimer: () => dispatch({ type: 'RESET_TIMER' }),
    setQuestionAnswered: (questionId: string) => 
      dispatch({ type: 'SET_QUESTION_ANSWERED', questionId })
  };
} 