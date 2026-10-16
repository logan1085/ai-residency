"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

import { type Direction, type Policy, type Values, type Completion, STATES, GOAL, ALL_CELLS, ALL_DIRS, toPos, transition, initValues, bellmanStep, hasConverged, evaluatePolicy, evaluateFrom, evaluatePolicyCounted, improvePolicy, qValue, completionStatus, finishRun } from "../lib/policy";

/** What the sandbox is currently doing. */
type Mode = "idle" | "running" | "settled";
/** Which half of the loop is on screen. */
type Phase = "eval" | "improve" | null;

/** Animation pacing for the run. */
const SWEEP_MS = 40;
const PHASE_PAUSE_MS = 650;
const ANIM_SWEEP_CAP = 24;

interface PathResult {
  path: string[];
  reachesGoal: boolean;
  loops: boolean;
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
  const [phase, setPhase] = useState<Phase>(null);
  const [sweeps, setSweeps] = useState(0);
  const [totalSweeps, setTotalSweeps] = useState(0);
  const [round, setRound] = useState(0);
  const [completion, setCompletion] = useState<Completion>("scored");
  const [changed, setChanged] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("1");

  // Machine state lives in refs so the scheduler never reads a stale closure.
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickRef = useRef<() => void>(() => {});
  const mPolicy = useRef<Policy>(policy);
  const mValues = useRef<Values>(initValues());
  const mPhase = useRef<Phase>(null);
  const mSweeps = useRef(0);
  const mTotal = useRef(0);
  const mRound = useRef(0);
  const mFull = useRef(false);

  const running = mode === "running";
  const showValues = mode !== "idle";

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => stopTimer, [stopTimer]);

  // Mirror policy into the ref for the scheduler, without writing during render.
  useEffect(() => {
    mPolicy.current = policy;
  }, [policy]);

  const finish = useCallback(() => {
    stopTimer();
    mPhase.current = null;
    setPhase(null);
    setMode("settled");
  }, [stopTimer]);

  /**
   * One tick of the evaluate/improve machine. Evaluation is animated sweep
   * by sweep so the values visibly propagate out from the goal; improvement
   * gets its own beat so the changed actions are readable before the next
   * evaluation starts.
   */
  const tick = useCallback(() => {
    if (mPhase.current === "eval") {
      const prev = mValues.current;
      const next = bellmanStep(mPolicy.current, prev);
      mSweeps.current += 1;
      mTotal.current += 1;
      mValues.current = next;
      setValues({ ...next });
      setSweeps(mSweeps.current);
      setTotalSweeps(mTotal.current);

      const converged = hasConverged(prev, next);

      // Past the animation budget, jump to the exact fixed point rather than
      // grinding through ~60 more visually identical frames. The remaining
      // sweeps still count, so the reported totals stay true.
      if (!converged && mSweeps.current >= ANIM_SWEEP_CAP) {
        const exact = evaluateFrom(mPolicy.current, next);
        mValues.current = exact.values;
        mSweeps.current += exact.sweeps;
        mTotal.current += exact.sweeps;
        setValues({ ...exact.values });
        setSweeps(mSweeps.current);
        setTotalSweeps(mTotal.current);
      } else if (!converged) {
        timerRef.current = setTimeout(() => tickRef.current(), SWEEP_MS);
        return;
      }

      if (!mFull.current) {
        finish();
        return;
      }
      if (mRound.current >= 25) {
        setCompletion("limit");
        finish();
        return;
      }
      mPhase.current = "improve";
      setPhase("improve");
      timerRef.current = setTimeout(() => tickRef.current(), PHASE_PAUSE_MS);
      return;
    }

    if (mPhase.current === "improve") {
      const { policy: improved, changed: diff } = improvePolicy(
        mPolicy.current,
        mValues.current
      );
      mRound.current += 1;
      setRound(mRound.current);
      setChanged(diff);

      if (diff.length === 0) {
        setCompletion("stable");
        finish();
        return;
      }

      mPolicy.current = improved;
      setPolicy(improved);
      mPhase.current = "eval";
      setPhase("eval");
      mSweeps.current = 0;
      setSweeps(0);
      timerRef.current = setTimeout(() => tickRef.current(), PHASE_PAUSE_MS);
    }
  }, [finish]);

  useEffect(() => {
    tickRef.current = tick;
  }, [tick]);

  /** Editing the policy invalidates every computed number. */
  const resetComputed = useCallback(() => {
    stopTimer();
    setMode("idle");
    setPhase(null);
    mPhase.current = null;
    setSweeps(0);
    setTotalSweeps(0);
    setRound(0);
    setCompletion("scored");
    setChanged([]);
    const init = initValues();
    setValues(init);
    mValues.current = init;
    mSweeps.current = 0;
    mTotal.current = 0;
    mRound.current = 0;
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
      const cur = mPolicy.current[state];
      const next = ALL_DIRS[(ALL_DIRS.indexOf(cur) + 1) % ALL_DIRS.length];
      setDirection(state, next);
    },
    [setDirection]
  );

  const start = useCallback(
    (full: boolean) => {
      stopTimer();
      const init = initValues();
      mValues.current = init;
      setValues(init);
      mSweeps.current = 0;
      mTotal.current = 0;
      mRound.current = 0;
      setSweeps(0);
      setTotalSweeps(0);
      setRound(0);
      setCompletion("scored");
      setChanged([]);
      mFull.current = full;
      mPhase.current = "eval";
      setPhase("eval");
      setMode("running");
      timerRef.current = setTimeout(() => tickRef.current(), SWEEP_MS);
    },
    [stopTimer]
  );

  const runPolicyIteration = useCallback(() => start(true), [start]);
  const runEvaluation = useCallback(() => start(false), [start]);

  /** A single improvement sweep against the current values. */
  const runImprovement = useCallback(() => {
    stopTimer();
    const base =
      mode === "idle"
        ? evaluatePolicyCounted(mPolicy.current)
        : { values: mValues.current, sweeps: 0 };
    const { policy: improved, changed: diff } = improvePolicy(
      mPolicy.current,
      base.values
    );

    setPolicy(improved);
    mPolicy.current = improved;
    setChanged(diff);
    setCompletion(diff.length === 0 ? "stable" : "improved");

    // Old values describe the old policy, so re-score the new one.
    const re = evaluateFrom(improved, base.values);
    mValues.current = re.values;
    setValues(re.values);
    mTotal.current += base.sweeps + re.sweeps;
    setTotalSweeps(mTotal.current);
    setSweeps(re.sweeps);
    mRound.current += 1;
    setRound(mRound.current);
    setMode("settled");
    setPhase(null);
    mPhase.current = null;
  }, [mode, stopTimer]);

  const skipToEnd = useCallback(() => {
    stopTimer();
    const result = finishRun(mPolicy.current, mValues.current, mFull.current, mRound.current, mTotal.current);
    mPolicy.current = result.policy;
    setPolicy(result.policy);
    mValues.current = result.values;
    setValues(result.values);
    mTotal.current = result.total;
    setTotalSweeps(result.total);
    mRound.current = result.rounds;
    setRound(result.rounds);
    setCompletion(result.result);
    setChanged([]);
    finish();
  }, [finish, stopTimer]);

  const reset = useCallback(() => {
    const p: Policy = {};
    for (const s of STATES) p[s] = "up";
    setPolicy(p);
    mPolicy.current = p;
    resetComputed();
  }, [resetComputed]);

  const showOptimal = useCallback(() => {
    stopTimer();
    const optPolicy = getOptimalPolicy();
    setPolicy(optPolicy);
    mPolicy.current = optPolicy;
    const { values: v, sweeps: s } = evaluatePolicyCounted(optPolicy);
    mValues.current = v;
    setValues(v);
    setSweeps(s);
    setTotalSweeps(s);
    mTotal.current = s;
    setRound(0);
    setCompletion("scored");
    mRound.current = 0;
    setChanged([]);
    finish();
  }, [finish, stopTimer]);

  /** Arrow keys steer the selected cell, scoped to this widget only. */
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const dir = KEY_TO_DIR[e.key];
      if (!dir || running) return;
      // Don't hijack arrows while a control has focus, otherwise tabbing
      // to a button and pressing an arrow silently rewrites the policy.
      if ((e.target as HTMLElement).closest("button, input, a, select")) return;
      e.preventDefault();
      setDirection(selected, dir);
    },
    [running, selected, setDirection]
  );

  const selectedNext = transition(selected, policy[selected]);
  const selectedHitsWall = selectedNext === selected;

  // Per-action scores for the selected state. This is exactly what the
  // improvement step compares, so showing it makes "improve" legible.
  const selectedQ = ALL_DIRS.map((d) => ({
    dir: d,
    next: transition(selected, d),
    q: qValue(selected, d, values),
  }));
  const bestQ = Math.max(...selectedQ.map((r) => r.q));

  const statusLine = () => {
    if (mode === "idle") return "Click a cell to cycle its direction";
    if (mode === "running") {
      if (phase === "improve") return `Round ${round + 1} · improving`;
      return sweeps === 0
        ? `Round ${round + 1} · scoring`
        : `Round ${round + 1} · scoring · sweep ${sweeps}`;
    }
    return completionStatus(completion, round, totalSweeps);
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

            {/* Phase + status */}
            <div className="mt-3 flex flex-col items-center gap-1.5">
              {phase && (
                <span
                  className="phase-badge"
                  style={{
                    color:
                      phase === "eval"
                        ? "var(--phase-eval)"
                        : "var(--phase-improve)",
                  }}
                >
                  {phase === "eval" ? "Scoring" : "Improving"}
                </span>
              )}
              <span
                className="tl-label text-center leading-relaxed"
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

            {/* Per-action scores: what the improvement step compares */}
            {showValues && (
              <div>
                <p className="tl-label mb-2">
                  Options from state {selected}
                </p>
                <table className="q-table">
                  <thead>
                    <tr>
                      <th scope="col">Direction</th>
                      <th scope="col">Leads to</th>
                      <th scope="col">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedQ.map((row) => {
                      const isBest = row.q >= bestQ - 1e-9;
                      const isCurrent = policy[selected] === row.dir;
                      return (
                        <tr
                          key={row.dir}
                          className={isBest ? "winner" : ""}
                        >
                          <td>
                            {ARROW_CHARS[row.dir]} {DIR_LABELS[row.dir]}
                            {isCurrent && (
                              <span className="tl-label ml-2">current</span>
                            )}
                          </td>
                          <td className="tl-mono">
                            {row.next === selected ? "wall" : row.next}
                          </td>
                          <td className="tl-mono">
                            {formatValue(row.q)}
                            {isBest && (
                              <span className="tl-label ml-2">best</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
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
                      (wall, stays put)
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
