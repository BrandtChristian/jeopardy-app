"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { GameState, Player, Question } from '../types/game';
import { getQuestionsByCategory } from '../questions';
import { socket } from '../socket';

// Define all possible actions
type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'RESET_GAME' }
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

// Debug logging for questions data
console.log('Getting questions data for initial board...');
const questionsData = getQuestionsByCategory();
console.log('Questions data received:', {
  categories: Object.keys(questionsData),
  sampleCategory: Object.values(questionsData)[0]
});

// Convert our questions data into the board format
const initialBoard = Object.entries(questionsData).map(([name, questions]) => {
  const processedQuestions = questions.map(q => ({
    ...q,
    value: q.amount,
    isRevealed: false,
    isAnswered: false
  }));
  
  // Debug logging for each category
  console.log(`Processing category ${name}:`, {
    questionCount: processedQuestions.length,
    sample: processedQuestions[0]
  });
  
  return {
    name,
    questions: processedQuestions
  };
});

// Debug logging for final board
console.log('Initial board created:', {
  categoryCount: initialBoard.length,
  categories: initialBoard.map(c => c.name),
  sampleCategory: initialBoard[0]
});

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
      // Preserve our board state when receiving updates from the server
      // and handle player state updates more carefully
      const currentPlayerId = localStorage.getItem('playerId');
      const isThisTabReady = localStorage.getItem(`tab_ready_${currentPlayerId}`) === 'true';
      
      if (currentPlayerId) {
        // Find our current player in both states
        const ourPlayerInCurrentState = state.players.find(p => p.id === currentPlayerId);
        const ourPlayerInNewState = action.state.players.find(p => p.id === currentPlayerId);
        
        // If we're in the process of joining (exist in current but not in new state)
        // preserve our player data
        if (ourPlayerInCurrentState && !ourPlayerInNewState) {
          return {
            ...action.state,
            board: action.state.board.length > 0 ? action.state.board : state.board,
            players: [...action.state.players, ourPlayerInCurrentState]
          };
        }

        // If the player exists in new state but this tab isn't ready,
        // we should treat them as not ready in this tab
        if (ourPlayerInNewState && !isThisTabReady) {
          const updatedPlayers = action.state.players.map(p => 
            p.id === currentPlayerId ? { ...p, isReady: false } : p
          );
          return {
            ...action.state,
            board: action.state.board.length > 0 ? action.state.board : state.board,
            players: updatedPlayers
          };
        }
      }
      
      return {
        ...action.state,
        board: action.state.board.length > 0 ? action.state.board : state.board
      };
      
    case 'START_GAME':
      // Send the board state when starting the game
      socket.emit('start_game', { 
        gameCode: state.gameCode,
        board: initialBoard // Use our initial board with all questions
      });
      return {
        ...state,
        isActive: true
      };
      
    case 'END_GAME':
      socket.emit('end_game', { gameCode: state.gameCode });
      return state;
      
    case 'RESET_GAME':
      socket.emit('reset_game', { gameCode: state.gameCode });
      return {
        ...initialState,
        gameCode: state.gameCode,
        connections: state.connections
      };
      
    case 'ADD_PLAYER':
      // Only emit join_game if this player isn't already in the game
      const existingPlayer = state.players.find(p => p.id === action.player.id);
      if (!existingPlayer) {
        socket.emit('join_game', { 
          gameCode: state.gameCode, 
          player: action.player 
        });
      }
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
    // Connect to socket
    socket.connect();

    // When connected, register the connection type based on the current route
    socket.on('connect', () => {
      // Check if we're on the host or TV route
      const path = window.location.pathname;
      if (path === '/admin') {
        socket.emit('register_connection', {
          gameCode: state.gameCode,
          type: 'host'
        });
      } else if (path === '/tv') {
        socket.emit('register_connection', {
          gameCode: state.gameCode,
          type: 'tv'
        });
      }
    });

    // Listen for game state updates
    socket.on('game_state_update', (newState: GameState) => {
      dispatch({ type: 'SET_GAME_STATE', state: newState });
    });

    // Cleanup on unmount
    return () => {
      socket.off('connect');
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