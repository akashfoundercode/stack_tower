import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, CheckCircle2, AlertTriangle, Coins, MousePointerClick } from 'lucide-react';
import { soundFx } from '../utils/sound';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  if (!isOpen) return null;

  const handleSkip = () => {
    soundFx.playClick();
    localStorage.setItem('stack_tower_tutorial_seen', 'true');
    onClose();
  };

  const handleNext = () => {
    soundFx.playClick();
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      localStorage.setItem('stack_tower_tutorial_seen', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    soundFx.playClick();
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const steps = [
    {
      badge: 'STEP 1 OF 3 • BUTTONS & CONTROLS',
      title: 'Game Buttons & Controls',
      titleHi: 'खेलते समय कौन सा बटन कब दबाएं',
      icon: '🎮',
      content: (
        <div className="space-y-2.5 w-full text-left">
          {/* BUILD Button explanation */}
          <div className="bg-slate-950/80 border border-emerald-500/40 rounded-2xl p-2.5 sm:p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-wider font-mono">
                <MousePointerClick className="w-3.5 h-3.5" /> BUILD / TAP SCREEN
              </span>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">BOX GIRANA</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
              Crane se swing kar rahe box ko tower par drop karne ke liye <strong className="text-white">BUILD</strong> button dabayein ya screen par kahi bhi tap karein!
            </p>
          </div>

          {/* CASH OUT Button explanation */}
          <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl p-2.5 sm:p-3 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider font-mono shadow-sm">
                <Coins className="w-3.5 h-3.5" /> CASH OUT
              </span>
              <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider font-mono">PAISA NIKALNA</span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 leading-snug">
              Har floor ke sath payout multiplier badhta hai. Jab aapko lage agla box miss ho sakta hai, turant <strong className="text-white">CASH OUT</strong> dabayein aur jeeta hua paisa wallet me le lein!
            </p>
          </div>

          {/* Bet Selector */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-1.5 flex items-center justify-between text-[11px] sm:text-xs text-slate-300">
            <span className="font-bold text-slate-200">💰 Bet Stepper (- / +):</span>
            <span className="text-sky-300 font-mono">Round shuru hone se pehle apni bet chunein (e.g. ₹100)</span>
          </div>
        </div>
      ),
      tip: '💡 Hint: Spacebar daba kar bhi box drop kar sakte hain!',
    },
    {
      badge: 'STEP 2 OF 3 • BALANCED DROP',
      title: 'Balanced Drop Physics',
      titleHi: 'बॉक्स को बैलेंस करके गिराना समझें',
      icon: '⚖️',
      content: (
        <div className="space-y-2 w-full text-left">
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed text-center px-2">
            Ye poora game <strong className="text-white">Balance aur Alignment</strong> ka hai. Box ko theek niche wale floor par balance karna zaroori hai:
          </p>

          {/* Perfect Hit */}
          <div className="bg-slate-950/80 border border-yellow-400/40 rounded-2xl p-2.5 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-yellow-400/20 text-yellow-300 flex items-center justify-center shrink-0 mt-0.5 text-base font-black">
              ★
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-yellow-300 text-xs tracking-tight">PERFECT DROP (CENTER SNAP)</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-400/20 text-yellow-200 font-mono">+0.75x BOOST</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                Jab box exact center (within 5px) me girta hai, to perfect balance banta hai aur multiplier me huge bonus boost milta hai!
              </p>
            </div>
          </div>

          {/* Balanced Stack */}
          <div className="bg-slate-950/80 border border-emerald-400/40 rounded-2xl p-2.5 flex items-start gap-2.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-emerald-300 text-xs tracking-tight">BALANCED STACK (GREAT / GOOD)</span>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                Box niche wale roof par theek se balance hokar tik jata hai aur agla floor aage badhta hai!
              </p>
            </div>
          </div>

          {/* Unbalanced Miss */}
          <div className="bg-slate-950/80 border border-rose-500/40 rounded-2xl p-2.5 flex items-start gap-2.5">
            <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-black text-rose-300 text-xs tracking-tight">UNBALANCED / MISSED (GIR JANA)</span>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                Agar box kinare se bahar gira aur uska balance nahi bana, to wo topple hokar niche gir jayega aur Game Over ho jayega!
              </p>
            </div>
          </div>
        </div>
      ),
      tip: '⚠️ Savdhani: 3rd aur 6th box par speed tezi se badhegi, balance ka dhyan rakhein!',
    },
    {
      badge: 'STEP 3 OF 3 • WALLET & MULTIPLIER',
      title: 'Wallet Balance & Payout',
      titleHi: 'वॉलेट बैलेंस और कमाई कैसे काम करती है',
      icon: '💰',
      content: (
        <div className="space-y-2.5 w-full text-left">
          {/* Top Balance Mockup */}
          <div className="bg-gradient-to-r from-sky-950/90 to-slate-950 border border-sky-400/30 rounded-2xl p-3 flex items-center justify-between shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Top-Right Wallet:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-base sm:text-lg font-black text-white font-mono">₹10,000</span>
                <span className="text-[10px] font-extrabold text-amber-300 font-mono">INR</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-sky-400 bg-sky-950/80 border border-sky-500/30 px-2 py-0.5 rounded-full">
                Demo Wallet
              </span>
              <p className="text-[9px] text-slate-400 mt-1">Click to reset anytime</p>
            </div>
          </div>

          {/* How balance works */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-2.5 space-y-1.5 text-[11px] sm:text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="text-rose-400 font-bold shrink-0">1. Bet Deduct:</span>
              <span>START dabane par chuni hui bet (e.g. ₹100) wallet se deduct hoti hai.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 font-bold shrink-0">2. Multiplier:</span>
              <span>Har floor par multiplier badhta hai: L1 (1.25x), L3 (2.1x), L6 (4.8x), L10 (15x+).</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold shrink-0">3. Winnings:</span>
              <span><strong className="text-white">CASH OUT</strong> dabate hi (Bet × Multiplier) turant aapke balance me wapis jud jata hai!</span>
            </div>
          </div>

          {/* Balance Reset Note */}
          <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-[10px] sm:text-[11px] text-emerald-300 flex items-center justify-between">
            <span>Agar balance khatm ho jaye:</span>
            <strong className="text-white underline">Header balance par tap karke ₹10,000 reset karein!</strong>
          </div>
        </div>
      ),
      tip: '🚀 Strategy: Lalach me pura round na gawayein — safe time par Cash Out karein!',
    },
  ];

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-sky-500/35 rounded-3xl p-4 sm:p-5 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex flex-col relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-sky-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header Row: Badge, SKIP button, and Close X */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-mono">
              {step.badge}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Prominent SKIP button */}
            <button
              onClick={handleSkip}
              className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 active:scale-95 transition"
            >
              SKIP ⏭
            </button>

            {/* Close X */}
            <button
              onClick={handleSkip}
              className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
              title="Close Tutorial"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="py-3 flex flex-col items-center text-center relative z-10 min-h-[310px] justify-between">
          {/* Header Title with Emoji Icon */}
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-2xl">{step.icon}</span>
            <div className="text-left">
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight drop-shadow-sm leading-none">
                {step.title}
              </h3>
              <p className="text-[11px] font-bold text-sky-400 mt-0.5">{step.titleHi}</p>
            </div>
          </div>

          {/* Dynamic Rich Step Content */}
          <div className="w-full my-2">{step.content}</div>

          {/* Golden / Amber Tip */}
          <div className="w-full text-center text-[11px] font-bold text-amber-300/90 bg-amber-500/10 border border-amber-500/20 py-1.5 px-3 rounded-xl">
            {step.tip}
          </div>
        </div>

        {/* Footer Navigation: Dots Indicator & Next / Start Button */}
        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between relative z-10">
          {/* Step Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentStep(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentStep === idx ? 'w-6 bg-sky-400 shadow-[0_0_8px_#38bdf8]' : 'w-2 bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons: Prev + Next/Start */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1 active:scale-95 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className={`px-4 sm:px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-1.5 active:scale-95 transition shadow-lg ${
                currentStep === 2
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-emerald-500/30'
                  : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/30'
              }`}
            >
              <span>{currentStep === 2 ? 'START PLAYING! 🚀' : 'Next'}</span>
              {currentStep < 2 && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
