import React, { useState, useEffect, useCallback } from 'react';
import { GameState, BetHistoryItem } from '../types/game';
import { MobileHeader } from '../components/MobileHeader';
import { FullscreenGameScene } from '../components/FullscreenGameScene';
import { MobileBettingOverlay } from '../components/MobileBettingOverlay';
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
  const [activeBet, setActiveBet] = useState<number>(100);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [currentMultiplier, setCurrentMultiplier] = useState<number>(1.0);
  const [, setScore] = useState<number>(0);

  // Trigger for build
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

  // Storage sync
  useEffect(() => {
    localStorage.setItem('stack_tower_balance', demoBalance.toString());
  }, [demoBalance]);

  useEffect(() => {
    localStorage.setItem('stack_tower_history', JSON.stringify(history));
  }, [history]);

  // Spacebar to build
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

  // START GAME
  const handleStartGame = () => {
    if (gameState === 'PLAYING') return;
    if (demoBalance < selectedBet) return;

    setDemoBalance((prev) => prev - selectedBet);
    setActiveBet(selectedBet);
    setCurrentLevel(0);
    setCurrentMultiplier(1.0);
    setScore(0);
    setShowResultModal(false);
    setGameState('PLAYING');
  };

  // BUILD
  const handleBuild = () => {
    if (gameState === 'PLAYING') {
      setBuildTrigger((prev) => prev + 1);
    }
  };

  // Stack success
  const handleStackSuccess = useCallback(
    (level: number, multiplier: number, bonusPoints: number) => {
      setCurrentLevel(level);
      setCurrentMultiplier(multiplier);
      setScore((prev) => prev + bonusPoints);
    },
    []
  );

  // Perfect stack
  const handlePerfectStack = useCallback(() => {
    setScore((prev) => prev + 100);
  }, []);

  // CASH OUT
  const handleCashOut = () => {
    if (gameState !== 'PLAYING') return;

    soundFx.playCashOut();
    const finalPayout = Math.floor(activeBet * currentMultiplier * 100) / 100;
    const profit = finalPayout - activeBet;

    setDemoBalance((prev) => prev + finalPayout);

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

  // GAME OVER
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
    <div className="w-screen h-[100dvh] overflow-hidden bg-slate-950 flex justify-center items-center">
      {/* Container: 100% full screen on phones, responsive frame on desktops */}
      <div className="relative w-full h-full max-w-[430px] max-h-[920px] shadow-2xl md:rounded-3xl md:border-4 md:border-slate-800 overflow-hidden flex flex-col justify-between">
        {/* Layer 1: Full-Screen Immersive Canvas Game Scene (The entire background) */}
        <FullscreenGameScene
          gameState={gameState}
          onStackSuccess={handleStackSuccess}
          onGameOver={handleGameOver}
          onPerfectStack={handlePerfectStack}
          buildTrigger={buildTrigger}
        />

        {/* Layer 2: Floating Top Header Overlay (Balance, Currency, Top Up, Sound) */}
        <MobileHeader
          demoBalance={demoBalance}
          onResetBalance={handleResetBalance}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenHistory={() => setShowHistoryModal(true)}
        />

        {/* Layer 3: Bottom Betting Controls Overlay Floating directly over the game world */}
        <div className="relative z-30 p-2.5 sm:p-3 pb-4 sm:pb-5">
          <MobileBettingOverlay
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
        </div>

        {/* Modals */}
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

        <HistoryModal
          isOpen={showHistoryModal}
          history={history}
          onClose={() => setShowHistoryModal(false)}
          onClearHistory={handleClearHistory}
        />
      </div>
    </div>
  );
};
