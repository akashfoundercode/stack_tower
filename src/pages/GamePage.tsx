import React, { useState, useEffect, useCallback } from 'react';
import { GameState, BetHistoryItem, GameDifficulty } from '../types/game';
import { MobileHeader } from '../components/MobileHeader';
import { FullscreenGameScene } from '../components/FullscreenGameScene';
import { MobileBettingOverlay } from '../components/MobileBettingOverlay';
import { ResultModal } from '../components/ResultModal';
import { HistoryModal } from '../components/HistoryModal';
import { TutorialModal } from '../components/TutorialModal';
import { GameLoader } from '../components/GameLoader';
import { UserStatsModal } from '../components/UserStatsModal';
import { LoginModal } from '../components/LoginModal';
import { soundFx } from '../utils/sound';
import { useGameConfig } from '../hooks/useGameConfig';
import { stackTowerService, socketService, authService } from '../api';
import { UserProfileData } from '../api/types';

const INITIAL_WALLET_BALANCE = 1000;

export const GamePage: React.FC = () => {
  // Load dynamic API game config (min_bet, max_bet, quick_bets, difficulties)
  const { config: gameConfig } = useGameConfig();

  // Authentication & Player Token State
  const [currentUser, setCurrentUser] = useState<UserProfileData | null>(() => authService.getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => authService.isAuthenticated());
  const [showLoginModal, setShowLoginModal] = useState<boolean>(() => !authService.isAuthenticated());

  // Preloader State: Game only reveals after all images are 100% loaded and decoded
  const [isAssetsLoaded, setIsAssetsLoaded] = useState<boolean>(false);

  // Demo / Real Wallet Balance from Login Profile
  const [demoBalance, setDemoBalance] = useState<number>(() => {
    const user = authService.getStoredUser();
    if (user && typeof user.total_wallet === 'number') {
      return user.total_wallet;
    }
    const saved = localStorage.getItem('stack_tower_balance');
    return saved !== null ? Number(saved) : INITIAL_WALLET_BALANCE;
  });

  const [history, setHistory] = useState<BetHistoryItem[]>(() => {
    const saved = localStorage.getItem('stack_tower_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Game Difficulty Selection: EASY | MEDIUM | HARD
  const [difficulty, setDifficulty] = useState<GameDifficulty>('MEDIUM');

  // Active Game State
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [currentRoundId, setCurrentRoundId] = useState<string | null>(null);
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
  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(() => {
    return !localStorage.getItem('stack_tower_tutorial_seen');
  });
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

  // Sync remote history on history modal open
  useEffect(() => {
    if (showHistoryModal) {
      stackTowerService.getHistory(20).then((remoteHistory) => {
        if (remoteHistory && remoteHistory.length > 0) {
          setHistory(remoteHistory);
        }
      });
    }
  }, [showHistoryModal]);

  // Handle successful login
  const handleLoginSuccess = (user: UserProfileData) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    if (typeof user.total_wallet === 'number') {
      setDemoBalance(user.total_wallet);
    } else if (typeof user.wallet === 'number') {
      setDemoBalance(user.wallet);
    }
  };

  // START GAME / PLACE BET (Token must be stored before match can run)
  const handleStartGame = async () => {
    if (gameState === 'PLAYING') return;

    // 1. Enforce Token Check: Match will only run when token is stored!
    if (!authService.isAuthenticated()) {
      soundFx.playClick();
      soundFx.speak('Please login to start match');
      setShowLoginModal(true);
      return;
    }

    if (demoBalance < selectedBet) return;

    setActiveBet(selectedBet);
    setCurrentLevel(0);
    setCurrentMultiplier(1.0);
    setScore(0);
    setShowResultModal(false);
    setGameState('PLAYING');

    // Optimistic balance decrement
    setDemoBalance((prev) => Math.max(0, prev - selectedBet));

    // Call 1. Place Bet / Start Game API (POST /api/stack-tower/bet)
    try {
      const betData = await stackTowerService.placeBet(
        {
          amount: selectedBet,
          difficulty,
          userid: currentUser?.id || 15,
        },
        demoBalance
      );
      if (betData?.round_id) {
        setCurrentRoundId(betData.round_id);
        // Socket Step 2: Bet lagane ke baad room join karein with authenticated user
        socketService.joinRound(betData.round_id, currentUser?.id || 15);
      }
      if (typeof betData?.wallet_balance === 'number') {
        setDemoBalance(betData.wallet_balance);
      }
    } catch (err) {
      console.warn('Place Bet API error:', err);
    }
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

      // Socket Step 4: Player ka real-time level update broadcast karne ke liye
      socketService.emitStackBlock(currentRoundId || '', level, multiplier);
    },
    [currentRoundId]
  );

  // Perfect stack
  const handlePerfectStack = useCallback(() => {
    setScore((prev) => prev + 100);
  }, []);

  // CASH OUT (Claim Winnings)
  const handleCashOut = async () => {
    if (gameState !== 'PLAYING') return;

    soundFx.playCashOut();
    soundFx.speak('Cash Out');
    const finalPayout = Math.floor(activeBet * currentMultiplier * 100) / 100;
    const profit = Math.floor((finalPayout - activeBet) * 100) / 100;

    const roundId = currentRoundId || `ST${Date.now()}`;

    const historyItem: BetHistoryItem = {
      id: roundId,
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

    // Call 2. Cash Out API (POST /api/stack-tower/cashout)
    try {
      const cashOutData = await stackTowerService.cashOut(
        {
          round_id: roundId,
          level: currentLevel,
          multiplier: currentMultiplier,
        },
        activeBet,
        demoBalance
      );
      if (typeof cashOutData?.wallet_balance === 'number') {
        setDemoBalance(cashOutData.wallet_balance);
      } else {
        setDemoBalance((prev) => prev + finalPayout);
      }
    } catch {
      setDemoBalance((prev) => prev + finalPayout);
    }
  };

  // GAME OVER / TOWER FALL (Jab Block Miss Ho Jaye)
  const handleGameOver = useCallback(
    async (finalLevel: number, finalMult: number) => {
      if (gameState !== 'PLAYING') return;

      const roundId = currentRoundId || `ST${Date.now()}`;

      const historyItem: BetHistoryItem = {
        id: roundId,
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

      // Call 3. Game Over API (POST /api/stack-tower/game-over)
      try {
        await stackTowerService.gameOver({
          round_id: roundId,
          final_level: finalLevel,
          final_multiplier: finalMult,
        });
      } catch (err) {
        console.warn('Game Over API error:', err);
      }
    },
    [gameState, activeBet, currentRoundId]
  );

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
      {/* Game Asset Preloader: Ensures all high-res PNG images & backgrounds are 100% loaded before reveal */}
      {!isAssetsLoaded && (
        <GameLoader onLoaded={() => setIsAssetsLoaded(true)} />
      )}

      {/* Fullscreen responsive container: 100% width on laptop/desktop & mobile */}
      <div className="relative w-full h-full overflow-hidden flex flex-col justify-between">
        {/* Layer 1: Full-Screen Immersive Canvas Game Scene (stretches across laptop & mobile) */}
        <FullscreenGameScene
          gameState={gameState}
          difficulty={difficulty}
          difficultyConfig={gameConfig.difficulties}
          onStackSuccess={handleStackSuccess}
          onGameOver={handleGameOver}
          onPerfectStack={handlePerfectStack}
          buildTrigger={buildTrigger}
        />

        {/* Layer 2: Top Bar Header (Screenshot Style dark-striped navbar) */}
        <header className="absolute top-0 inset-x-0 z-40 pointer-events-auto">
          <MobileHeader
            demoBalance={demoBalance}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenHistory={() => setShowHistoryModal(true)}
            onOpenTutorial={() => setShowTutorial(true)}
            onOpenStats={() => setShowStatsModal(true)}
            onOpenLogin={() => setShowLoginModal(true)}
            isLoggedIn={isLoggedIn}
            userId={currentUser?.u_id || currentUser?.id || '489214'}
            username={currentUser?.username || 'User'}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            gameState={gameState}
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
              difficulty={difficulty}
              minBet={gameConfig.min_bet}
              maxBet={gameConfig.max_bet}
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

        <UserStatsModal
          isOpen={showStatsModal}
          onClose={() => setShowStatsModal(false)}
        />

        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <TutorialModal
          isOpen={showTutorial}
          onClose={() => setShowTutorial(false)}
        />
      </div>
    </div>
  );
};
