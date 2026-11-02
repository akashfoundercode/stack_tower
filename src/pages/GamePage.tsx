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
    <div className="w-screen h-[100dvh] overflow-hidden bg-[#097cd9] flex flex-col items-center justify-between">
      {/* Fullscreen responsive container: 100% width on laptop/desktop & mobile */}
      <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
        {/* Layer 1: Full-Screen Immersive Canvas Game Scene (stretches across laptop & mobile) */}
        <FullscreenGameScene
          gameState={gameState}
          onStackSuccess={handleStackSuccess}
          onGameOver={handleGameOver}
          onPerfectStack={handlePerfectStack}
          buildTrigger={buildTrigger}
        />

        {/* Layer 2: Top Bar Header (Screenshot Style dark-striped navbar) */}
        <header className="absolute top-0 inset-x-0 z-40 pointer-events-auto">
          <MobileHeader
            demoBalance={demoBalance}
            onResetBalance={handleResetBalance}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenHistory={() => setShowHistoryModal(true)}
          />
        </header>

        {/* Layer 3: Footer Betting Controls:
            Mobile: Centered max-w-md
            Desktop: Wide max-w-4xl horizontal dock (ALL IN / Stepper left side, BUILD right side) */}
        <footer className="absolute bottom-0 inset-x-0 z-30 p-2 sm:p-3 pb-3 sm:pb-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-black via-black/90 to-transparent pt-6 flex justify-center pointer-events-none">
          <div className="w-full max-w-md md:max-w-4xl pointer-events-auto">
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
        </footer>

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
