import React, { useState, useEffect, useCallback } from 'react';
import { GameState, BetHistoryItem } from '../types/game';
import { Header } from '../components/Header';
import { GameScene } from '../components/GameScene';
import { BettingPanel } from '../components/BettingPanel';
import { ResultModal } from '../components/ResultModal';
import { HistoryModal } from '../components/HistoryModal';
import { soundFx } from '../utils/sound';

const INITIAL_WALLET_BALANCE = 10000;

export const GamePage: React.FC = () => {
  // Demo Wallet & Storage
  const [demoBalance, setDemoBalance] = useState<number>(() => {
    const saved = localStorage.getItem('stack_tower_balance');
    return saved !== null ? Number(saved) : INITIAL_WALLET_BALANCE;
  });

  const [history, setHistory] = useState<BetHistoryItem[]>(() => {
    const saved = localStorage.getItem('stack_tower_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Active Game State
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [selectedBet, setSelectedBet] = useState<number>(100);
  const [activeBet, setActiveBet] = useState<number>(100); // Fixed bet for current running round
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [, setScore] = useState<number>(0);

  // Trigger from keyboard or UI button
  const [buildTrigger, setBuildTrigger] = useState<number>(0);

  // Modals
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [showHistoryModal, setShowHistoryModal] = useState<boolean>(false);
  const [roundResult, setRoundResult] = useState<{
    status: 'CASHED_OUT' | 'GAME_OVER';
    payout: number;
    highestLevel: number;
    finalMultiplier: number;
  }>({
    status: 'GAME_OVER',
    payout: 0,
    highestLevel: 0,
    finalMultiplier: 1.0,
  });

  // Persist balance
  useEffect(() => {
    localStorage.setItem('stack_tower_balance', demoBalance.toString());
  }, [demoBalance]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('stack_tower_history', JSON.stringify(history));
  }, [history]);

  // Handle keyboard SPACEBAR to trigger BUILD
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && gameState === 'PLAYING') {
        e.preventDefault();
        setBuildTrigger((prev) => prev + 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // START GAME: Deduct bet exactly once & initiate round
  const handleStartGame = () => {
    if (gameState === 'PLAYING') return;
    if (demoBalance < selectedBet) return;

    // Deduct bet atomically
    setDemoBalance((prev) => prev - selectedBet);
    setActiveBet(selectedBet);
    setCurrentLevel(0);
    setCurrentMultiplier(1.0);
    setScore(0);
    setShowResultModal(false);
    setGameState('PLAYING');
  };

  // BUILD clicked from UI panel
  const handleBuild = () => {
    if (gameState === 'PLAYING') {
      setBuildTrigger((prev) => prev + 1);
    }
  };

  // Block placement success
  const handleStackSuccess = useCallback(
    (level: number, multiplier: number, bonusPoints: number) => {
      setCurrentLevel(level);
      setCurrentMultiplier(multiplier);
      setScore((prev) => prev + bonusPoints);
    },
    []
  );

  // Perfect placement callback
  const handlePerfectStack = useCallback(() => {
    setScore((prev) => prev + 100);
  }, []);

  // CASH OUT: Settle round as WIN atomically
  const handleCashOut = () => {
    if (gameState !== 'PLAYING') return;

    soundFx.playCashOut();
    const finalPayout = Math.floor(activeBet * currentMultiplier * 100) / 100;
    const profit = finalPayout - activeBet;

    // Credit balance
    setDemoBalance((prev) => prev + finalPayout);

    // Save record
    const historyItem: BetHistoryItem = {
      id: `round-${Date.now()}`,
      timestamp: Date.now(),
      betAmount: activeBet,
      level: currentLevel,
      multiplier: currentMultiplier,
      payout: finalPayout,
      profit: profit,
      status: 'CASHED_OUT',
    };

    setHistory((prev) => [historyItem, ...prev]);

    setRoundResult({
      status: 'CASHED_OUT',
      payout: finalPayout,
      highestLevel: currentLevel,
      finalMultiplier: currentMultiplier,
    });

    setGameState('CASHED_OUT');
    setShowResultModal(true);
  };

  // GAME OVER: Missed block
  const handleGameOver = useCallback(
    (finalLevel: number, finalMult: number) => {
      if (gameState !== 'PLAYING') return;

      const historyItem: BetHistoryItem = {
        id: `round-${Date.now()}`,
        timestamp: Date.now(),
        betAmount: activeBet,
        level: finalLevel,
        multiplier: finalMult,
        payout: 0,
        profit: -activeBet,
        status: 'LOST',
      };

      setHistory((prev) => [historyItem, ...prev]);

      setRoundResult({
        status: 'GAME_OVER',
        payout: 0,
        highestLevel: finalLevel,
        finalMultiplier: finalMult,
      });

      setGameState('GAME_OVER');
      setShowResultModal(true);
    },
    [gameState, activeBet]
  );

  const handleResetBalance = () => {
    setDemoBalance(INITIAL_WALLET_BALANCE);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundFx.enabled = next;
    setSoundEnabled(next);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center">
      {/* Top Header */}
      <Header
        demoBalance={demoBalance}
        onResetBalance={handleResetBalance}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenHistory={() => setShowHistoryModal(true)}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-md px-3 py-2 md:py-4 flex-1 flex flex-col justify-between gap-3">
        {/* Game Scene */}
        <GameScene
          gameState={gameState}
          onStackSuccess={handleStackSuccess}
          onGameOver={handleGameOver}
          onPerfectStack={handlePerfectStack}
          buildTrigger={buildTrigger}
        />

        {/* Bottom Betting Controls */}
        <BettingPanel
          gameState={gameState}
          betAmount={selectedBet}
          onBetChange={(amt) => setSelectedBet(amt)}
          onStartGame={handleStartGame}
          onBuild={handleBuild}
          onCashOut={handleCashOut}
          multiplier={currentMultiplier}
          level={currentLevel}
          demoBalance={demoBalance}
        />
      </main>

      {/* Result Modal */}
      <ResultModal
        isOpen={showResultModal}
        status={roundResult.status}
        betAmount={activeBet}
        multiplier={roundResult.finalMultiplier}
        payout={roundResult.payout}
        highestLevel={roundResult.highestLevel}
        onPlayAgain={() => {
          setShowResultModal(false);
          setGameState('IDLE');
        }}
      />

      {/* Bet History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        history={history}
        onClose={() => setShowHistoryModal(false)}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};
