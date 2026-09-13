import confetti from "canvas-confetti";

/**
 * Fires celebratory confetti from side cannons and center
 */
export function fireCelebrationConfetti() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;

  const defaults = {
    startVelocity: 30,
    spread: 360,
    ticks: 60,
    zIndex: 999,
  };

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 40 * (timeLeft / duration);

    // left side cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.2, y: 0.5 },
      colors: ["#38bdf8", "#fbbf24", "#f43f5e", "#a855f7", "#34d399"],
    });

    // right side cannon
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.8, y: 0.5 },
      colors: ["#38bdf8", "#fbbf24", "#f43f5e", "#a855f7", "#34d399"],
    });
  }, 250);
}

/**
 * Fires gentle candle extinguishing burst
 */
export function fireCakeCandleConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#fbbf24", "#f43f5e", "#38bdf8", "#a855f7"],
  });
}
