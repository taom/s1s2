interface CommentaryContext {
  heartRate: number;
  confidence: number;
  previousHR: number | null;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  currentStreak: number;
  totalCheckIns: number;
  isFirstEver: boolean;
}

const FIRST_EVER = [
  (ctx: CommentaryContext) =>
    `First signal received, Captain. Engine rhythm: ${ctx.heartRate} BPM. A strong beginning.`,
  (ctx: CommentaryContext) =>
    `Welcome aboard, Captain. Your first reading — ${ctx.heartRate} BPM. The journey starts here.`,
];

const STREAK_MILESTONES: Record<number, (ctx: CommentaryContext) => string> = {
  3: (ctx) => `Three consecutive days of data, Captain. At ${ctx.heartRate} BPM, your rhythm is becoming familiar.`,
  7: (ctx) => `7 days of signal data, Captain. One full week. The patterns are becoming clearer.`,
  14: (ctx) => `Two weeks of consistent tracking, Captain. ${ctx.heartRate} BPM today. Your dedication is remarkable.`,
  30: (ctx) => `Thirty days, Captain. A full month of heartbeat data. This journey is truly underway.`,
  60: (ctx) => `Sixty days of data. Captain, your commitment to this voyage is extraordinary.`,
  100: (ctx) => `One hundred days, Captain. A century of heartbeats recorded. You are among the most dedicated.`,
};

function getHRPatternCommentary(ctx: CommentaryContext): string | null {
  if (ctx.previousHR === null) return null;
  const diff = ctx.heartRate - ctx.previousHR;

  if (diff > 15) {
    return `Engine running warm today — ${ctx.heartRate} BPM, notably above your recent readings. Worth noting, Captain.`;
  }
  if (diff < -15) {
    return `Unusually calm readings today, Captain. ${ctx.heartRate} BPM — well below your recent average. A restful signal.`;
  }
  return null;
}

const TIME_FLAVOR: Record<string, (ctx: CommentaryContext) => string> = {
  morning: (ctx) => `Morning readings logged, Captain. ${ctx.heartRate} BPM — a fresh signal to start the day.`,
  afternoon: (ctx) => `Afternoon check-in recorded. ${ctx.heartRate} BPM. The day's rhythm holds steady, Captain.`,
  evening: (ctx) => `Evening signal captured. ${ctx.heartRate} BPM. The day winds down, Captain.`,
  night: (ctx) => `Late readings, Captain. ${ctx.heartRate} BPM in the quiet hours. Rest well.`,
};

const GENERIC = [
  (ctx: CommentaryContext) => `Signal received, Captain. ${ctx.heartRate} BPM. All systems nominal.`,
  (ctx: CommentaryContext) => `Engine rhythm: ${ctx.heartRate} BPM. Another data point in your journey, Captain.`,
  (ctx: CommentaryContext) => `${ctx.heartRate} BPM logged, Captain. The ship hums onward.`,
  (ctx: CommentaryContext) => `Reading captured: ${ctx.heartRate} BPM. Your signal continues to chart the course, Captain.`,
];

export function generateCommentary(ctx: CommentaryContext): string {
  if (ctx.isFirstEver) {
    return FIRST_EVER[ctx.totalCheckIns % FIRST_EVER.length](ctx);
  }

  const milestone = STREAK_MILESTONES[ctx.currentStreak];
  if (milestone) {
    return milestone(ctx);
  }

  const hrPattern = getHRPatternCommentary(ctx);
  if (hrPattern) return hrPattern;

  const useTod = (ctx.totalCheckIns + ctx.currentStreak) % 3 !== 0;
  if (useTod && TIME_FLAVOR[ctx.timeOfDay]) {
    return TIME_FLAVOR[ctx.timeOfDay](ctx);
  }

  return GENERIC[ctx.totalCheckIns % GENERIC.length](ctx);
}

export function getTimeOfDay(): CommentaryContext['timeOfDay'] {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}
