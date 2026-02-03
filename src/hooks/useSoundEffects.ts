import { useCallback, useRef } from 'react';

// Generate sound effects using Web Audio API
export function useSoundEffects() {
  const audioContextRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'square', volume = 0.1) => {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playClick = useCallback(() => {
    playTone(800, 0.05, 'square', 0.08);
  }, [playTone]);

  const playCrateOpen = useCallback(() => {
    // Rising arpeggio effect for crate opening
    const notes = [200, 300, 400, 500, 600];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.1, 'square', 0.06);
      }, i * 50);
    });
  }, [playTone]);

  const playCrateSpin = useCallback(() => {
    // Tick sound for spinning
    playTone(600, 0.02, 'square', 0.05);
  }, [playTone]);

  const playWin = useCallback(() => {
    // Triumphant ascending notes
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.3, 'square', 0.1);
      }, i * 100);
    });
  }, [playTone]);

  const playLose = useCallback(() => {
    // Sad descending notes
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.2, 'sawtooth', 0.08);
      }, i * 100);
    });
  }, [playTone]);

  const playUpgradeStart = useCallback(() => {
    // Spinning/building tension
    playTone(200, 0.1, 'square', 0.08);
  }, [playTone]);

  const playUpgradeWin = useCallback(() => {
    // Epic win sound
    const notes = [440, 554, 659, 880, 1108]; // A4, C#5, E5, A5, C#6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        playTone(freq, 0.4, 'square', 0.12);
      }, i * 80);
    });
  }, [playTone]);

  const playUpgradeLose = useCallback(() => {
    // Explosion/loss sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        playTone(100 + Math.random() * 100, 0.15, 'sawtooth', 0.1);
      }, i * 30);
    }
  }, [playTone]);

  const playMineReveal = useCallback(() => {
    // Soft reveal sound
    playTone(500, 0.08, 'square', 0.06);
  }, [playTone]);

  const playMineExplode = useCallback(() => {
    // Explosion sound
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        playTone(50 + Math.random() * 150, 0.2, 'sawtooth', 0.12 - i * 0.01);
      }, i * 20);
    }
  }, [playTone]);

  return {
    playClick,
    playCrateOpen,
    playCrateSpin,
    playWin,
    playLose,
    playUpgradeStart,
    playUpgradeWin,
    playUpgradeLose,
    playMineReveal,
    playMineExplode,
  };
}
