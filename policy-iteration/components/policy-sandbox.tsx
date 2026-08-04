"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

type Direction = "up" | "down" | "left" | "right";
type Policy = Record<string, Direction>;
type Values = Record<string, number>;

/** What the sandbox is currently doing. */
type Mode = "idle" | "evaluating" | "iterating" | "settled";

interface PathResult {
  path: string[];
  reachesGoal: boolean;
  loops: boolean;
}

const GRID = 4;
const STATES = Array.from({ length: 15 }, (_, i) => String(i + 1));
const GOAL = "G";
const ALL_CELLS = [...STATES, GOAL];
const GAMMA = 0.9;

/* ------------------------------------------------------------------ */
/*  Position helpers                                                   */
/* ------------------------------------------------------------------ */

function toPos(s: string): [number, number] {
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

function transition(state: string, dir: Direction): string {
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

function initValues(): Values {
  const v: Values = { G: 0 };
  for (const s of STATES) v[s] = 0;
  return v;
}

function bellmanStep(policy: Policy, v: Values): Values {
  const newV: Values = { G: 0 };
  for (const s of STATES) {
    const next = transition(s, policy[s]);
    const reward = next === GOAL ? 0 : -1;
    newV[s] = reward + GAMMA * v[next];
  }
  return newV;
}

function hasConverged(prev: Values, next: Values): boolean {
  for (const s of STATES) {
    if (Math.abs(prev[s] - next[s]) >= 0.001) return false;
  }
  return true;
}

/** Run evaluation to a fixed horizon — used for exact comparisons. */
function evaluatePolicy(policy: Policy): Values {
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
function evaluatePolicyCounted(policy: Policy): {
  values: Values;
  sweeps: number;
} {
  let v = initValues();
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

/* ------------------------------------------------------------------ */
/*  Policy improvement — the half the sandbox was missing              */
/* ------------------------------------------------------------------ */

const ALL_DIRS: Direction[] = ["up", "right", "down", "left"];

/** Score of taking `dir` from `state`, then following the current values. */
function qValue(state: string, dir: Direction, v: Values): number {
  const next = transition(state, dir);
  const reward = next === GOAL ? 0 : -1;
  return reward + GAMMA * v[next];
}

/**
 * One greedy improvement sweep: at every state, switch to the best-scoring
 * action. Ties keep the incumbent action, which is what makes the loop
 * terminate instead of oscillating between equally good policies.
 */
function improvePolicy(
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

/* ------------------------------------------------------------------ */
/*  Path tracing                                                       */
/* ------------------------------------------------------------------ */

function tracePath(start: string, policy: Policy): PathResult {
  const path: string[] = [start];
  let current = start;

  for (let i = 0; i < 20; i++) {
    const next = transition(current, policy[current]);
    path.push(next);

    if (next === GOAL) {
      return { path, reachesGoal: true, loops: false };
    }

    if (path.slice(0, -1).includes(next)) {
      return { path, reachesGoal: false, loops: true };
    }

    current = next;
  }

  return { path, reachesGoal: false, loops: true };
}

/* ------------------------------------------------------------------ */
/*  Optimal policy & check                                             */
/* ------------------------------------------------------------------ */

function getOptimalPolicy(): Policy {
  const p: Policy = {};
  for (const s of STATES) {
    const [, c] = toPos(s);
    p[s] = c === 3 ? "down" : "right";
  }
  return p;
}

const OPTIMAL_POLICY = getOptimalPolicy();
const OPTIMAL_VALUES = evaluatePolicy(OPTIMAL_POLICY);

function isOptimal(values: Values): boolean {
  for (const s of STATES) {
    if (Math.abs(values[s] - OPTIMAL_VALUES[s]) > 0.05) return false;
  }
  return true;
}

function allReachGoal(policy: Policy): boolean {
  for (const s of STATES) {
    if (!tracePath(s, policy).reachesGoal) return false;
  }
  return true;
}

/* ------------------------------------------------------------------ */
/*  Format helpers                                                     */
/* ------------------------------------------------------------------ */

function formatValue(v: number): string {
  if (v <= -9.99) return "-10";
  if (Math.abs(v) < 0.01) return "0";
  return v.toFixed(1);
}

const ARROW_CHARS: Record<Direction, string> = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→",
};

const DIR_LABELS: Record<Direction, string> = {
  up: "Up",
  down: "Down",
  left: "Left",
  right: "Right",
};

const KEY_TO_DIR: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

function cellBg(value: number | null, showValues: boolean): string {
  if (!showValues || value === null) return "var(--cell-unknown)";
  if (value <= -9.99) return "var(--cell-red)";
  if (value < -0.01) return "var(--cell-amber)";
  return "var(--cell-green)";
}

/* ------------------------------------------------------------------ */
/*  Results section                                                    */
/* ------------------------------------------------------------------ */

const TRACE_STATES = ["1", "4", "13", "11"];

function Results({ values, policy }: { values: Values; policy: Policy }) {
  const optimal = isOptimal(values);
  const reaches = allReachGoal(policy);

  let reachCount = 0;
  let loopCount = 0;
  const pathResults: Record<string, PathResult> = {};
  for (const s of STATES) {
    const p = tracePath(s, policy);
    pathResults[s] = p;
    if (p.reachesGoal) reachCount++;
    else loopCount++;
  }

  const loopingStates: string[] = [];
  const suboptimalStates: string[] = [];
  for (const s of STATES) {
    if (!pathResults[s].reachesGoal) {
      loopingStates.push(s);
    } else {
      const pathLen = pathResults[s].path.length - 1;
      const [r, c] = toPos(s);
      const optLen = 3 - r + (3 - c);
      if (pathLen > optLen) {
        suboptimalStates.push(s);
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Verdict banner */}
      <div
        className="verdict-card"
        style={{
          borderLeftColor: optimal
            ? "var(--tl-good)"
            : reaches
              ? "var(--tl-mid)"
              : "var(--tl-bad)",
        }}
      >
        <p
          className="tl-callout-index mb-1.5"
          style={{
            color: optimal
              ? "var(--tl-good)"
              : reaches
                ? "var(--tl-mid)"
                : "var(--tl-bad)",
          }}
        >
          {optimal
            ? "✓ Optimal"
            : reaches
              ? "! Suboptimal"
              : "✗ Incomplete"}
        </p>
        <h4 className="tl-h4 mb-1.5">
          {optimal
            ? "Optimal policy"
            : reaches
              ? "It works, but it’s not optimal"
              : "Some states are stuck"}
        </h4>
        <p className="tl-body">
          {optimal
            ? "Every state reaches the goal by the shortest possible path. This is the best policy for this grid."
            : reaches
              ? "All 15 states reach the goal, but some take a longer route than necessary."
              : `${reachCount} of 15 states reach the goal. ${loopCount} ${loopCount === 1 ? "is" : "are"} stuck in ${loopCount === 1 ? "a loop" : "loops"}.`}
        </p>
      </div>

      {/* Path traces for representative states */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TRACE_STATES.map((s) => {
          const p = pathResults[s];
          const stepCount = p.reachesGoal ? p.path.length - 1 : null;

          return (
            <div
              key={s}
              className="border p-3 rounded-[var(--tl-radius)]"
              style={{
                borderColor: p.reachesGoal
                  ? "var(--tl-line)"
                  : "var(--tl-bad)",
                backgroundColor: p.reachesGoal
                  ? "var(--tl-paper)"
                  : "var(--tl-bad-wash)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="tl-label">State {s}</span>
                <span
                  className="tl-mono text-base font-semibold"
                  style={{
                    color:
                      values[s] <= -9.99
                        ? "var(--tl-bad)"
                        : values[s] < -0.01
                          ? "var(--tl-ink)"
                          : "var(--tl-good)",
                  }}
                >
                  {formatValue(values[s])}
                </span>
              </div>
              <div
                className="tl-mono text-xs leading-relaxed"
                style={{
                  color: p.reachesGoal ? "var(--tl-muted)" : "var(--tl-bad)",
                }}
              >
                {p.reachesGoal ? (
                  <>
                    {p.path.join(" → ")}
                    <span className="tl-note block mt-1.5">
                      {stepCount} step{stepCount !== 1 ? "s" : ""} to goal
                    </span>
                  </>
                ) : (
                  <>
                    {p.path.slice(0, 5).join(" → ")} {"→"} ...
                    <span
                      className="tl-note block mt-1.5"
                      style={{ color: "var(--tl-bad)" }}
                    >
                      loops forever
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Hints */}
      {(loopingStates.length > 0 || suboptimalStates.length > 0) && (
        <div className="tl-inset p-4">
          <p className="tl-label mb-2.5" style={{ color: "var(--tl-ink)" }}>
            How to improve
          </p>
          <ul className="space-y-1.5">
            {loopingStates.length > 0 && (
              <li className="tl-note">
                {loopingStates.length <= 5
                  ? `States ${loopingStates.join(", ")} never reach the goal.`
                  : `${loopingStates.length} states never reach the goal.`}{" "}
                Try pointing them toward the bottom-right corner.
              </li>
            )}
            {suboptimalStates.length > 0 && (
              <li className="tl-note">
                {suboptimalStates.length <= 5
                  ? `States ${suboptimalStates.join(", ")} reach`
                  : `${suboptimalStates.length} states reach`}{" "}
                the goal but take a longer path than necessary.
              </li>
            )}
            <li className="tl-note">
              Or press <strong>Run policy iteration</strong> and let the
              algorithm fix it for you.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Sandbox Component                                             */
/* ------------------------------------------------------------------ */

export default function PolicySandbox() {
  const [policy, setPolicy] = useState<Policy>(() => {
    const p: Policy = {};
    for (const s of STATES) p[s] = "up";
    return p;
  });
  const [values, setValues] = useState<Values>(initValues);
  const [mode, setMode] = useState<Mode>("idle");
  const [sweeps, setSweeps] = useState(0);
  const [round, setRound] = useState(0);
  const [changed, setChanged] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("1");

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valuesRef = useRef<Values>(initValues());
  const policyRef = useRef<Policy>(policy);

  policyRef.current = policy;

  const running = mode === "evaluating" || mode === "iterating";
  const showValues = mode !== "idle";

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => stopTimer, [stopTimer]);

  /** Editing the policy invalidates every computed number. */
  const resetComputed = useCallback(() => {
    stopTimer();
    setMode("idle");
    setSweeps(0);
    setRound(0);
    setChanged([]);
    const init = initValues();
    setValues(init);
    valuesRef.current = init;
  }, [stopTimer]);

  const setDirection = useCallback(
    (state: string, dir: Direction) => {
      setPolicy((prev) => ({ ...prev, [state]: dir }));
      resetComputed();
    },
    [resetComputed]
  );

  /** Clicking the already-selected cell cycles its direction. */
  const cycleDirection = useCallback(
    (state: string) => {
      const cur = policyRef.current[state];
      const next = ALL_DIRS[(ALL_DIRS.indexOf(cur) + 1) % ALL_DIRS.length];
      setDirection(state, next);
    },
    [setDirection]
  );

  /* ---- Phase 1: evaluate the current policy, sweep by sweep ---- */
  const runEvaluation = useCallback(() => {
    stopTimer();
    const init = initValues();
    setValues(init);
    valuesRef.current = init;
    setSweeps(0);
    setRound(0);
    setChanged([]);
    setMode("evaluating");

    let n = 0;
    timerRef.current = setInterval(() => {
      const prev = valuesRef.current;
      const next = bellmanStep(policyRef.current, prev);
      n++;
      valuesRef.current = next;
      setValues({ ...next });
      setSweeps(n);

      if (hasConverged(prev, next) || n >= 200) {
        stopTimer();
        setMode("settled");
      }
    }, 45);
  }, [stopTimer]);

  /* ---- Phase 2: one greedy improvement sweep ---- */
  const runImprovement = useCallback(() => {
    stopTimer();
    // Improvement is only meaningful against evaluated values.
    const base =
      mode === "idle"
        ? evaluatePolicyCounted(policyRef.current)
        : { values: valuesRef.current, sweeps };
    const { policy: improved, changed: diff } = improvePolicy(
      policyRef.current,
      base.values
    );

    setPolicy(improved);
    policyRef.current = improved;
    setChanged(diff);

    // The old values describe the old policy, so re-score the new one.
    const re = evaluatePolicyCounted(improved);
    setValues(re.values);
    valuesRef.current = re.values;
    setSweeps(re.sweeps);
    setRound((r) => r + 1);
    setMode("settled");
  }, [mode, sweeps, stopTimer]);

  /* ---- The full loop: evaluate → improve → repeat until stable ---- */
  const runPolicyIteration = useCallback(() => {
    stopTimer();
    setChanged([]);
    setRound(0);
    setMode("iterating");

    let current = policyRef.current;
    let n = 0;

    // Animate at the round level — the outer loop is the thing worth
    // watching here, and it converges in only a handful of rounds.
    timerRef.current = setInterval(() => {
      const { values: v, sweeps: s } = evaluatePolicyCounted(current);
      setValues(v);
      valuesRef.current = v;
      setSweeps(s);

      const { policy: improved, changed: diff } = improvePolicy(current, v);
      n++;
      setRound(n);
      setChanged(diff);

      if (diff.length === 0 || n >= 25) {
        stopTimer();
        setMode("settled");
        return;
      }

      current = improved;
      policyRef.current = improved;
      setPolicy(improved);
    }, 900);
  }, [stopTimer]);

  const skipToEnd = useCallback(() => {
    stopTimer();
    let current = policyRef.current;
    let n = 0;
    let last = evaluatePolicyCounted(current);
    for (; n < 25; ) {
      last = evaluatePolicyCounted(current);
      const { policy: improved, changed: diff } = improvePolicy(
        current,
        last.values
      );
      n++;
      if (diff.length === 0) break;
      current = improved;
    }
    policyRef.current = current;
    setPolicy(current);
    setValues(last.values);
    valuesRef.current = last.values;
    setSweeps(last.sweeps);
    setRound(n);
    setChanged([]);
    setMode("settled");
  }, [stopTimer]);

  const reset = useCallback(() => {
    const p: Policy = {};
    for (const s of STATES) p[s] = "up";
    setPolicy(p);
    policyRef.current = p;
    resetComputed();
  }, [resetComputed]);

  const showOptimal = useCallback(() => {
    stopTimer();
    const optPolicy = getOptimalPolicy();
    setPolicy(optPolicy);
    policyRef.current = optPolicy;
    const { values: v, sweeps: s } = evaluatePolicyCounted(optPolicy);
    setValues(v);
    valuesRef.current = v;
    setSweeps(s);
    setRound(0);
    setChanged([]);
    setMode("settled");
  }, [stopTimer]);

  /** Arrow keys steer the selected cell — scoped to this widget only. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const dir = KEY_TO_DIR[e.key];
      if (!dir || running) return;
      // Don't hijack arrows while a control has focus — otherwise tabbing
      // to a button and pressing an arrow silently rewrites the policy.
      if ((e.target as HTMLElement).closest("button, input, a, select")) return;
      e.preventDefault();
      setDirection(selected, dir);
    },
    [running, selected, setDirection]
  );

  const selectedNext = transition(selected, policy[selected]);
  const selectedHitsWall = selectedNext === selected;

  const statusLine = () => {
    if (mode === "idle") return "Click a cell to cycle its direction";
    if (mode === "evaluating") return `Scoring · sweep ${sweeps}`;
    if (mode === "iterating")
      return `Round ${round} · ${changed.length} action${changed.length === 1 ? "" : "s"} changed`;
    if (round > 0)
      return `Stable after ${round} round${round === 1 ? "" : "s"} · ${sweeps} scoring sweeps`;
    return `Scored in ${sweeps} sweep${sweeps === 1 ? "" : "s"}`;
  };

  return (
    <div
      className="tl-panel overflow-hidden"
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="group"
      aria-label="Policy iteration sandbox"
    >
      {/* ---- Top: Grid + Direction Picker ---- */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {/* Grid visualization */}
          <div className="shrink-0">
            <div
              className="grid grid-cols-4 gap-1.5"
              style={{ width: "280px" }}
            >
              {ALL_CELLS.map((s) => {
                const isGoal = s === GOAL;
                const dir = isGoal ? null : policy[s];
                const val = showValues ? values[s] : null;
                const isSelected = !isGoal && selected === s;
                const justChanged = changed.includes(s);

                return (
                  <div
                    key={s}
                    onClick={() => {
                      if (isGoal || running) return;
                      if (selected === s) cycleDirection(s);
                      else setSelected(s);
                    }}
                    className={`grid-cell relative flex flex-col items-center justify-center border aspect-square rounded-[var(--tl-radius)]${!isGoal && !running ? " cursor-pointer" : ""}`}
                    style={{
                      backgroundColor: isGoal
                        ? "var(--cell-green)"
                        : cellBg(val, showValues),
                      borderColor: isSelected
                        ? "var(--tl-ink)"
                        : justChanged
                          ? "var(--tl-mid)"
                          : "var(--tl-line)",
                      boxShadow: isSelected
                        ? "0 0 0 1px var(--tl-ink)"
                        : justChanged
                          ? "0 0 0 1px var(--tl-mid)"
                          : "none",
                    }}
                  >
                    <span
                      className="tl-mono absolute top-0.5 left-1 text-[9px]"
                      style={{ color: "var(--tl-faint)" }}
                    >
                      {s}
                    </span>

                    {isGoal && (
                      <span
                        className="absolute top-0 right-0.5 text-xs"
                        style={{ color: "var(--tl-good)" }}
                      >
                        &#9733;
                      </span>
                    )}

                    {isGoal ? (
                      <span className="tl-mono text-sm font-semibold">0</span>
                    ) : showValues && val !== null ? (
                      <span className="tl-mono text-sm font-semibold">
                        {formatValue(val)}
                      </span>
                    ) : (
                      <span
                        className="text-lg leading-none"
                        style={{ color: "var(--tl-ink)" }}
                      >
                        {dir ? ARROW_CHARS[dir] : ""}
                      </span>
                    )}

                    {!isGoal && showValues && val !== null && dir && (
                      <span
                        className="text-xs leading-none"
                        style={{ color: "var(--tl-faint)" }}
                      >
                        {ARROW_CHARS[dir]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status */}
            <div className="mt-3 text-center">
              <span
                className="tl-label"
                style={{
                  color: running ? "var(--tl-ink)" : "var(--tl-muted)",
                }}
              >
                {statusLine()}
              </span>
            </div>
          </div>

          {/* Direction picker for selected cell + info */}
          <div className="flex-1 min-w-0">
            <p className="tl-label mb-3">Direction for state {selected}</p>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {ALL_DIRS.map((dir) => {
                const active = policy[selected] === dir;
                return (
                  <button
                    key={dir}
                    onClick={() => setDirection(selected, dir)}
                    disabled={running}
                    className="sandbox-dir-btn"
                    aria-label={`Set state ${selected} to ${dir}`}
                    aria-pressed={active}
                  >
                    <span className="text-sm leading-none">
                      {ARROW_CHARS[dir]}
                    </span>
                    <span>{DIR_LABELS[dir]}</span>
                  </button>
                );
              })}
            </div>
            <p className="tl-note mb-5 text-[13px]">
              Click a selected cell to cycle it, or use the arrow keys.
            </p>

            {/* Bellman equation for selected cell (during evaluation) */}
            {showValues && (
              <div>
                <p className="tl-label mb-2">
                  Score calculation for room {selected}
                </p>
                <div className="equation-block text-[11px]">
                  V({selected}) = {selectedNext === GOAL ? "0" : "-1"} + 0.9{" "}
                  {"×"} V({selectedNext}) ={" "}
                  <strong style={{ color: "var(--tl-ink)" }}>
                    {formatValue(values[selected])}
                  </strong>
                </div>
              </div>
            )}

            {/* Transition info for selected cell (before evaluation) */}
            {!showValues && (
              <div>
                <p className="tl-label mb-2">Where does this direction go?</p>
                <div className="equation-block text-[11px]">
                  {selected}
                  {ARROW_CHARS[policy[selected]]}
                  {selectedNext}
                  {selectedHitsWall && (
                    <span style={{ color: "var(--tl-bad)" }}>
                      {" "}
                      (wall — stays put!)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Current policy summary grid */}
            <div className="mt-5">
              <p className="tl-label mb-2">Current policy</p>
              <div className="tl-mono tl-inset grid grid-cols-4 gap-1 p-3 text-center">
                {ALL_CELLS.map((s) => (
                  <span
                    key={s}
                    className="text-xs"
                    style={{
                      color:
                        s === GOAL
                          ? "var(--tl-good)"
                          : selected === s
                            ? "var(--tl-ink)"
                            : changed.includes(s)
                              ? "var(--tl-mid)"
                              : "var(--tl-faint)",
                      fontWeight: selected === s ? 700 : 400,
                    }}
                  >
                    {s === GOAL ? "★" : ARROW_CHARS[policy[s]]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Middle: Action buttons ---- */}
      <div
        className="px-6 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-2.5"
        style={{
          borderTop: "1px solid var(--tl-line)",
          borderBottom:
            mode === "settled" ? "1px solid var(--tl-line)" : "none",
        }}
      >
        {running ? (
          <button onClick={skipToEnd} className="tl-btn tl-btn-primary">
            Skip to end
          </button>
        ) : (
          <button
            onClick={runPolicyIteration}
            className="tl-btn tl-btn-primary"
          >
            Run policy iteration
          </button>
        )}
        <button onClick={runEvaluation} disabled={running} className="tl-btn">
          Evaluate only
        </button>
        <button onClick={runImprovement} disabled={running} className="tl-btn">
          Improve once
        </button>
        <button onClick={showOptimal} disabled={running} className="tl-btn">
          Show optimal
        </button>
        <button onClick={reset} disabled={running} className="tl-btn">
          Reset
        </button>
      </div>

      {/* ---- Bottom: Results ---- */}
      {mode === "settled" && (
        <div className="p-6 sm:p-8">
          <Results values={values} policy={policy} />
        </div>
      )}
    </div>
  );
}
