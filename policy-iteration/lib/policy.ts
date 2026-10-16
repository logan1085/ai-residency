export type Direction = "up" | "down" | "left" | "right";
export type Policy = Record<string, Direction>;
export type Values = Record<string, number>;

const GRID = 4;
export const STATES = Array.from({ length: 15 }, (_, i) => String(i + 1));
export const GOAL = "G";
export const ALL_CELLS = [...STATES, GOAL];
const GAMMA = 0.9;

/* ------------------------------------------------------------------ */
/*  Position helpers                                                   */
/* ------------------------------------------------------------------ */

export function toPos(s: string): [number, number] {
  if (s === GOAL) return [3, 3];
  const n = parseInt(s) - 1;
  return [Math.floor(n / GRID), n % GRID];
}

function toState(r: number, c: number): string {
  if (r === 3 && c === 3) return GOAL;
  return String(r * GRID + c + 1);
}

/* ------------------------------------------------------------------ */
/*  Transition function                                                */
/* ------------------------------------------------------------------ */

export function transition(state: string, dir: Direction): string {
  const [r, c] = toPos(state);
  let nr = r,
    nc = c;
  if (dir === "up") nr = Math.max(0, r - 1);
  if (dir === "down") nr = Math.min(3, r + 1);
  if (dir === "left") nc = Math.max(0, c - 1);
  if (dir === "right") nc = Math.min(3, c + 1);
  return toState(nr, nc);
}

/* ------------------------------------------------------------------ */
/*  Policy evaluation                                                  */
/* ------------------------------------------------------------------ */

export function initValues(): Values {
  const v: Values = { G: 0 };
  for (const s of STATES) v[s] = 0;
  return v;
}

export function bellmanStep(policy: Policy, v: Values): Values {
  const newV: Values = { G: 0 };
  for (const s of STATES) {
    const next = transition(s, policy[s]);
    const reward = next === GOAL ? 0 : -1;
    newV[s] = reward + GAMMA * v[next];
  }
  return newV;
}

export function hasConverged(prev: Values, next: Values): boolean {
  for (const s of STATES) {
    if (Math.abs(prev[s] - next[s]) >= 0.001) return false;
  }
  return true;
}

/** Run evaluation to a fixed horizon, for exact comparisons. */
export function evaluatePolicy(policy: Policy): Values {
  let v = initValues();
  for (let i = 0; i < 200; i++) {
    v = bellmanStep(policy, v);
  }
  return v;
}

/**
 * Evaluate to convergence and report how many sweeps it actually took,
 * so the UI can state a real number rather than a fixed horizon.
 */
export function evaluateFrom(
  policy: Policy,
  start: Values
): { values: Values; sweeps: number } {
  let v = start;
  let sweeps = 0;
  for (let i = 0; i < 500; i++) {
    const next = bellmanStep(policy, v);
    sweeps++;
    const done = hasConverged(v, next);
    v = next;
    if (done) break;
  }
  return { values: v, sweeps };
}

export function evaluatePolicyCounted(policy: Policy): {
  values: Values;
  sweeps: number;
} {
  return evaluateFrom(policy, initValues());
}

/* ------------------------------------------------------------------ */
/*  Policy improvement: the half the sandbox was missing              */
/* ------------------------------------------------------------------ */

export const ALL_DIRS: Direction[] = ["up", "right", "down", "left"];

/** Score of taking `dir` from `state`, then following the current values. */
export function qValue(state: string, dir: Direction, v: Values): number {
  const next = transition(state, dir);
  const reward = next === GOAL ? 0 : -1;
  return reward + GAMMA * v[next];
}

/**
 * One greedy improvement sweep: at every state, switch to the best-scoring
 * action. Ties keep the incumbent action, which is what makes the loop
 * terminate instead of oscillating between equally good policies.
 */
export function improvePolicy(
  policy: Policy,
  v: Values
): { policy: Policy; changed: string[] } {
  const next: Policy = {};
  const changed: string[] = [];
  for (const s of STATES) {
    let best = policy[s];
    let bestQ = qValue(s, policy[s], v);
    for (const d of ALL_DIRS) {
      const q = qValue(s, d, v);
      if (q > bestQ + 1e-9) {
        bestQ = q;
        best = d;
      }
    }
    next[s] = best;
    if (best !== policy[s]) changed.push(s);
  }
  return { policy: next, changed };
}


export type Completion = "scored" | "improved" | "stable" | "limit";
export function completionStatus(result: Completion, rounds: number, sweeps: number): string {
  if (result === "scored") return `Scored in ${sweeps} sweep${sweeps === 1 ? "" : "s"}`;
  const count = `${rounds} round${rounds === 1 ? "" : "s"}`;
  const label = result === "stable" ? `Stable after ${count}` : result === "limit" ? `Stopped at ${count}; stability not confirmed` : `${count} completed; policy changed`;
  return `${label} · ${sweeps} sweeps total`;
}

/** Finish the requested operation, counting the final no-change pass as a round. */
export function finishRun(policy: Policy, values: Values, full: boolean, rounds = 0, total = 0, limit = 25) {
  let current = policy;
  let v = values;
  let result: Completion = "scored";
  while (true) {
    const ev = evaluateFrom(current, v);
    v = ev.values;
    total += ev.sweeps;
    if (!full) break;
    if (rounds >= limit) { result = "limit"; break; }
    const next = improvePolicy(current, v);
    rounds++;
    if (next.changed.length === 0) { result = "stable"; break; }
    current = next.policy;
  }
  return { policy: current, values: v, rounds, total, result };
}
