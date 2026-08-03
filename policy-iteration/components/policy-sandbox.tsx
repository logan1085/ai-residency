"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types & Constants                                                  */
/* ------------------------------------------------------------------ */

type Direction = "up" | "down" | "left" | "right";
type Policy = Record<string, Direction>;
type Values = Record<string, number>;

interface PathResult {
  path: string[];
  reachesGoal: boolean;
  loops: boolean;
}

const GRID = 4;
const STATES = Array.from({ length: 15 }, (_, i) => String(i + 1));
const GOAL = "G";
const ALL_CELLS = [...STATES, GOAL];

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
/*  Bellman iteration                                                  */
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
    newV[s] = reward + 0.9 * v[next];
  }
  return newV;
}

function hasConverged(prev: Values, next: Values): boolean {
  for (const s of STATES) {
    if (Math.abs(prev[s] - next[s]) >= 0.001) return false;
  }
  return true;
}

function evaluatePolicy(policy: Policy): Values {
  let v = initValues();
  for (let i = 0; i < 200; i++) {
    v = bellmanStep(policy, v);
  }
  return v;
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
  up: "\u2191",
  down: "\u2193",
  left: "\u2190",
  right: "\u2192",
};

const DIR_LABELS: Record<Direction, string> = {
  up: "Up",
  down: "Down",
  left: "Left",
  right: "Right",
};

function cellBg(value: number | null, showValues: boolean): string {
  if (!showValues || value === null) return "var(--cell-unknown)";
  if (value <= -9.99) return "var(--cell-red)";
  if (value < -0.01) return "var(--cell-amber)";
  return "var(--cell-green)";
}

const ALL_DIRS: Direction[] = ["up", "right", "down", "left"];

/* ------------------------------------------------------------------ */
/*  Results section                                                    */
/* ------------------------------------------------------------------ */

const TRACE_STATES = ["1", "4", "13", "11"];

function Results({
  values,
  policy,
}: {
  values: Values;
  policy: Policy;
}) {
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
            ? "var(--tl-teal)"
            : reaches
              ? "var(--tl-gold)"
              : "var(--tl-rose)",
        }}
      >
        <p
          className="tl-callout-index mb-1.5"
          style={{
            color: optimal
              ? "var(--tl-teal)"
              : reaches
                ? "var(--tl-gold)"
                : "var(--tl-rose)",
          }}
        >
          {optimal ? "\u2713 Optimal" : reaches ? "! Suboptimal" : "\u2717 Incomplete"}
        </p>
        <h4 className="tl-h4 mb-1.5">
          {optimal
            ? "Optimal policy"
            : reaches
              ? "It works, but it\u2019s not optimal"
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
                  : "var(--tl-rose)",
                backgroundColor: p.reachesGoal
                  ? "var(--tl-paper)"
                  : "var(--tl-rose-wash)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="tl-label">State {s}</span>
                <span
                  className="tl-mono text-base font-semibold"
                  style={{
                    color:
                      values[s] <= -9.99
                        ? "var(--tl-rose)"
                        : values[s] < -0.01
                          ? "var(--tl-ink)"
                          : "var(--tl-teal)",
                  }}
                >
                  {formatValue(values[s])}
                </span>
              </div>
              <div
                className="tl-mono text-xs leading-relaxed"
                style={{
                  color: p.reachesGoal ? "var(--tl-muted)" : "var(--tl-rose)",
                }}
              >
                {p.reachesGoal ? (
                  <>
                    {p.path.join(" \u2192 ")}
                    <span className="tl-note block mt-1.5">
                      {stepCount} step{stepCount !== 1 ? "s" : ""} to goal
                    </span>
                  </>
                ) : (
                  <>
                    {p.path.slice(0, 5).join(" \u2192 ")} {"\u2192"} ...
                    <span
                      className="tl-note block mt-1.5"
                      style={{ color: "var(--tl-rose)" }}
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
          <p className="tl-label mb-2.5" style={{ color: "var(--tl-teal)" }}>
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
  const [iteration, setIteration] = useState(0);
  const [running, setRunning] = useState(false);
  const [converged, setConverged] = useState(false);
  const [selected, setSelected] = useState<string>("1");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valuesRef = useRef<Values>(initValues());

  const showValues = running || converged;

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const setDirection = useCallback(
    (state: string, dir: Direction) => {
      setPolicy((prev) => ({ ...prev, [state]: dir }));
      if (timerRef.current) clearInterval(timerRef.current);
      setRunning(false);
      setConverged(false);
      setIteration(0);
      const init = initValues();
      setValues(init);
      valuesRef.current = init;
    },
    []
  );

  const startEvaluation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const init = initValues();
    setValues(init);
    valuesRef.current = init;
    setIteration(0);
    setConverged(false);
    setRunning(true);

    let iter = 0;
    timerRef.current = setInterval(() => {
      const prev = valuesRef.current;
      const next = bellmanStep(policy, prev);
      iter++;

      valuesRef.current = next;
      setValues({ ...next });
      setIteration(iter);

      if (hasConverged(prev, next) || iter >= 100) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        const final = evaluatePolicy(policy);
        valuesRef.current = final;
        setValues({ ...final });
        setRunning(false);
        setConverged(true);
      }
    }, 120);
  }, [policy]);

  const skipToEnd = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    const final = evaluatePolicy(policy);
    setValues(final);
    valuesRef.current = final;
    setIteration(200);
    setRunning(false);
    setConverged(true);
  }, [policy]);

  const reset = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
    setConverged(false);
    setIteration(0);
    const init = initValues();
    setValues(init);
    valuesRef.current = init;
  }, []);

  const showOptimal = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    const optPolicy = getOptimalPolicy();
    setPolicy(optPolicy);
    const v = evaluatePolicy(optPolicy);
    setValues(v);
    valuesRef.current = v;
    setIteration(200);
    setRunning(false);
    setConverged(true);
  }, []);

  const selectedNext = transition(selected, policy[selected]);
  const selectedHitsWall = selectedNext === selected;

  return (
    <div className="tl-panel overflow-hidden">
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

                return (
                  <div
                    key={s}
                    onClick={() => {
                      if (!isGoal && !running) setSelected(s);
                    }}
                    className={`grid-cell relative flex flex-col items-center justify-center border aspect-square rounded-[var(--tl-radius)]${!isGoal && !running ? " cursor-pointer" : ""}`}
                    style={{
                      backgroundColor: isGoal
                        ? "var(--cell-green)"
                        : cellBg(val, showValues),
                      borderColor: isSelected
                        ? "var(--tl-ink)"
                        : "var(--tl-line)",
                      boxShadow: isSelected
                        ? "0 0 0 1px var(--tl-ink)"
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
                        style={{ color: "var(--tl-teal)" }}
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

            {/* Iteration counter */}
            {showValues && (
              <div className="mt-3 text-center">
                <span
                  className="tl-label"
                  style={{
                    color: running ? "var(--tl-teal)" : "var(--tl-muted)",
                  }}
                >
                  {converged
                    ? `Settled after ${iteration} rounds`
                    : `Round ${iteration}`}
                </span>
              </div>
            )}

            {!showValues && (
              <p className="tl-label text-center mt-3 leading-relaxed">
                Click a cell, then choose a direction
              </p>
            )}
          </div>

          {/* Direction picker for selected cell + info */}
          <div className="flex-1 min-w-0">
            <p className="tl-label mb-3">Direction for state {selected}</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
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

            {/* Bellman equation for selected cell (during evaluation) */}
            {showValues && (
              <div>
                <p className="tl-label mb-2">
                  Score calculation for room {selected}
                </p>
                <div className="equation-block text-[11px]">
                  V({selected}) ={" "}
                  {selectedNext === GOAL ? "0" : "-1"} + 0.9 {"\u00d7"} V(
                  {selectedNext}) ={" "}
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
                    <span style={{ color: "var(--tl-rose)" }}>
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
                          ? "var(--tl-teal)"
                          : selected === s
                            ? "var(--tl-ink)"
                            : "var(--tl-faint)",
                      fontWeight: selected === s ? 700 : 400,
                    }}
                  >
                    {s === GOAL ? "\u2605" : ARROW_CHARS[policy[s]]}
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
          borderBottom: converged ? "1px solid var(--tl-line)" : "none",
        }}
      >
        {running ? (
          <button onClick={skipToEnd} className="tl-btn tl-btn-primary">
            Skip to End
          </button>
        ) : (
          <button onClick={startEvaluation} className="tl-btn tl-btn-primary">
            Test My Policy
          </button>
        )}
        <button onClick={reset} disabled={running} className="tl-btn">
          Reset
        </button>
        <button onClick={showOptimal} disabled={running} className="tl-btn">
          Show Optimal
        </button>
      </div>

      {/* ---- Bottom: Results (only when converged) ---- */}
      {converged && (
        <div className="p-6 sm:p-8">
          <Results values={values} policy={policy} />
        </div>
      )}
    </div>
  );
}
