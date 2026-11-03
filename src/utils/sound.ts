// Web Audio API Synthesizer for high-energy arcade sounds without external asset dependencies

class SoundManager {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private femaleVoice: SpeechSynthesisVoice | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initFemaleVoice();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initFemaleVoice();
        };
      }
    }
  }

  private initFemaleVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // Comprehensive list of high-quality female voices across Chrome, macOS, iOS, Android, Windows:
    // (Chrome: 'Google UK English Female', macOS/iOS: 'Samantha', 'Victoria', 'Flo', 'Sandy', 'Shelley', 'Tara', 'Kathy', 'Karen', 'Moira'; Windows: 'Zira', 'Jenny', 'Aria')
    const femaleNames = [
      'google uk english female',
      'google us english female',
      'samantha',
      'victoria',
      'karen',
      'sandy',
      'shelley',
      'flo',
      'tara',
      'kathy',
      'zira',
      'jenny',
      'aria',
      'serena',
      'allison',
      'ava',
      'moira',
      'tessa',
      'fiona',
      'veena',
      'hazel',
      'susan',
      'grandma',
    ];

    // 1. Direct match on known female voice names (English)
    for (const name of femaleNames) {
      const match = voices.find((v) => {
        const full = `${v.name} ${v.voiceURI}`.toLowerCase();
        const lang = v.lang.toLowerCase();
        return lang.startsWith('en') && full.includes(name);
      });
      if (match) {
        this.femaleVoice = match;
        return match;
      }
    }

    // 2. Any English voice that contains 'female' or 'woman' in name/URI
    const femaleKeywordMatch = voices.find((v) => {
      const full = `${v.name} ${v.voiceURI}`.toLowerCase();
      const lang = v.lang.toLowerCase();
      return lang.startsWith('en') && (full.includes('female') || full.includes('woman'));
    });
    if (femaleKeywordMatch) {
      this.femaleVoice = femaleKeywordMatch;
      return femaleKeywordMatch;
    }

    // 3. Fallback: filter out ALL known male voices in Chrome/Mac/Windows
    const maleBlacklist = [
      'google us english', // Chrome's default Google US English is deep male!
      'google uk english male',
      'male',
      'david', 'mark', 'george', 'daniel', 'oliver', 'rishi',
      'fred', 'alex', 'tom', 'bruce', 'ralph', 'albert', 'aman',
      'eddy', 'reed', 'rocko', 'junior', 'grandpa', 'jester',
      'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos',
      'good news', 'organ', 'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox'
    ];

    const safeNonMale = voices.find((v) => {
      const full = `${v.name} ${v.voiceURI}`.toLowerCase();
      const lang = v.lang.toLowerCase();
      const isEnglish = lang.startsWith('en');
      const isMale = maleBlacklist.some((m) => full.includes(m));
      return isEnglish && !isMale;
    });
    if (safeNonMale) {
      this.femaleVoice = safeNonMale;
      return safeNonMale;
    }

    // 4. Any voice containing 'female' regardless of language
    const anyFemale = voices.find((v) => {
      const full = `${v.name} ${v.voiceURI}`.toLowerCase();
      return full.includes('female') || full.includes('woman');
    });
    if (anyFemale) {
      this.femaleVoice = anyFemale;
      return anyFemale;
    }

    return null;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPlace(isPerfect = false) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (isPerfect) {
        // High sparkling bell chime for PERFECT!
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.25); // D6

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        osc.start(now);
        osc.stop(now + 0.35);
      } else {
        // Solid thud & click sound
        osc.type = 'square';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.start(now);
        osc.stop(now + 0.12);
      }
    } catch {
      // AudioContext policy fallback
    }
  }

  playCut() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // White noise slice
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.Q.setValueAtTime(3, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.15);
    } catch {}
  }

  playCashOut() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Multi-note coin cascade
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.3, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.2);
      });
    } catch {}
  }

  playGameOver() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.45);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  playClick() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  playTick(urgent = false) {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(urgent ? 880 : 520, now);
      gain.gain.setValueAtTime(urgent ? 0.25 : 0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }) {
    if (!this.enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      const voice = this.femaleVoice || this.initFemaleVoice();
      if (voice) {
        this.femaleVoice = voice;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = 'en-US';
      }

      // Bright, cheerful female arcade hostess pitch
      utterance.pitch = options?.pitch ?? 1.3;
      utterance.rate = options?.rate ?? 1.05;
      utterance.volume = options?.volume ?? 1.0;

      window.speechSynthesis.speak(utterance);
    } catch {}
  }
}

export const soundFx = new SoundManager();

