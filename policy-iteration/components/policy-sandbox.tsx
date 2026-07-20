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
        className="verdict-card rounded-lg border-2 p-5"
        style={{
          borderColor: optimal ? "#10B981" : reaches ? "#F59E0B" : "#EF4444",
          backgroundColor: optimal
            ? "rgba(16, 185, 129, 0.06)"
            : reaches
              ? "rgba(245, 158, 11, 0.06)"
              : "rgba(239, 68, 68, 0.06)",
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span
            className="flex items-center justify-center w-8 h-8 rounded-full text-white text-sm font-bold"
            style={{
              backgroundColor: optimal
                ? "#10B981"
                : reaches
                  ? "#F59E0B"
                  : "#EF4444",
            }}
          >
            {optimal ? "\u2713" : reaches ? "!" : "\u2717"}
          </span>
          <h4
            className="text-base font-semibold"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {optimal
              ? "Optimal Policy!"
              : reaches
                ? "It works, but it\u2019s not optimal"
                : "Some states are stuck"}
          </h4>
        </div>
        <p
          className="text-sm leading-relaxed ml-11"
          style={{ color: "var(--text-secondary)" }}
        >
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
              className="rounded-lg border p-3"
              style={{
                borderColor: p.reachesGoal
                  ? "var(--card-border)"
                  : "rgba(239, 68, 68, 0.3)",
                backgroundColor: p.reachesGoal
                  ? "var(--card-bg)"
                  : "rgba(239, 68, 68, 0.04)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">State {s}</span>
                <span
                  className="text-lg font-bold tabular-nums"
                  style={{
                    fontFamily: "var(--font-mono), monospace",
                    color:
                      values[s] <= -9.99
                        ? "#EF4444"
                        : values[s] < -0.01
                          ? "var(--foreground)"
                          : "#10B981",
                  }}
                >
                  {formatValue(values[s])}
                </span>
              </div>
              <div
                className="text-xs leading-relaxed"
                style={{
                  color: p.reachesGoal
                    ? "var(--text-secondary)"
                    : "#EF4444",
                  fontFamily: "var(--font-mono), monospace",
                }}
              >
                {p.reachesGoal ? (
                  <>
                    {p.path.join(" \u2192 ")}
                    <span
                      className="block mt-1 font-sans"
                      style={{
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                      }}
                    >
                      {stepCount} step{stepCount !== 1 ? "s" : ""} to goal
                    </span>
                  </>
                ) : (
                  <>
                    {p.path.slice(0, 5).join(" \u2192 ")} {"\u2192"} ...
                    <span
                      className="block mt-1 font-sans"
                      style={{
                        fontFamily: "var(--font-sans), system-ui, sans-serif",
                      }}
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
        <div
          className="rounded-lg border p-4"
          style={{
            borderColor: "var(--card-border)",
            backgroundColor: "var(--equation-bg)",
          }}
        >
          <p
            className="text-xs font-semibold mb-2"
            style={{ color: "var(--accent)" }}
          >
            How to improve
          </p>
          <ul className="space-y-1">
            {loopingStates.length > 0 && (
              <li
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {loopingStates.length <= 5
                  ? `States ${loopingStates.join(", ")} never reach the goal.`
                  : `${loopingStates.length} states never reach the goal.`}{" "}
                Try pointing them toward the bottom-right corner.
              </li>
            )}
            {suboptimalStates.length > 0 && (
              <li
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
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
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
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

                return (
                  <div
                    key={s}
                    onClick={() => {
                      if (!isGoal && !running) setSelected(s);
                    }}
                    className={`grid-cell relative flex flex-col items-center justify-center rounded-lg border-2 aspect-square${!isGoal && !running ? " cursor-pointer" : ""}`}
                    style={{
                      backgroundColor: isGoal
                        ? "var(--cell-green)"
                        : cellBg(val, showValues),
                      borderColor: isSelected
                        ? "var(--accent)"
                        : "var(--card-border)",
                      boxShadow: isSelected
                        ? "0 0 0 1px var(--accent)"
                        : "none",
                    }}
                  >
                    <span
                      className="absolute top-0.5 left-1 text-[9px] font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s}
                    </span>

                    {isGoal && (
                      <span className="absolute top-0 right-0.5 text-xs">
                        &#9733;
                      </span>
                    )}

                    {isGoal ? (
                      <span
                        className="text-sm font-bold tabular-nums"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        0
                      </span>
                    ) : showValues && val !== null ? (
                      <span
                        className="text-sm font-bold tabular-nums"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {formatValue(val)}
                      </span>
                    ) : (
                      <span
                        className="text-lg leading-none"
                        style={{ color: "var(--foreground)" }}
                      >
                        {dir ? ARROW_CHARS[dir] : ""}
                      </span>
                    )}

                    {!isGoal && showValues && val !== null && dir && (
                      <span
                        className="text-xs leading-none"
                        style={{ color: "var(--text-secondary)" }}
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
              <div
                className="mt-2 text-center"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{
                    color: running
                      ? "var(--accent)"
                      : "var(--text-secondary)",
                  }}
                >
                  {converged
                    ? `Converged at iteration ${iteration}`
                    : `Iteration ${iteration}`}
                </span>
              </div>
            )}

            {!showValues && (
              <p
                className="text-[10px] text-center mt-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Click a cell to select it, then choose a direction
              </p>
            )}
          </div>

          {/* Direction picker for selected cell + info */}
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Direction for state {selected}
            </p>
            <div className="flex gap-1.5 mb-4">
              {ALL_DIRS.map((dir) => {
                const active = policy[selected] === dir;
                return (
                  <button
                    key={dir}
                    onClick={() => setDirection(selected, dir)}
                    disabled={running}
                    className="sandbox-dir-btn flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: active
                        ? "var(--accent)"
                        : "var(--equation-bg)",
                      color: active ? "white" : "var(--text-secondary)",
                      border: active
                        ? "1px solid var(--accent)"
                        : "1px solid var(--card-border)",
                    }}
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
              <div className="equation-block mt-4 text-[11px]">
                <p
                  className="font-sans text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  Bellman update for state {selected}
                </p>
                <div>
                  V({selected}) ={" "}
                  {selectedNext === GOAL ? "0" : "-1"} + 0.9 {"\u00d7"} V(
                  {selectedNext}) ={" "}
                  <strong>{formatValue(values[selected])}</strong>
                </div>
              </div>
            )}

            {/* Transition info for selected cell (before evaluation) */}
            {!showValues && (
              <div
                className="mt-2 rounded-md p-3"
                style={{ backgroundColor: "var(--equation-bg)" }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Where does this direction go?
                </p>
                <div
                  className="text-[11px]"
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-mono), monospace",
                  }}
                >
                  {selected}
                  {ARROW_CHARS[policy[selected]]}
                  {selectedNext}
                  {selectedHitsWall && (
                    <span style={{ color: "#EF4444" }}>
                      {" "}
                      (wall — stays put!)
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Current policy summary grid */}
            <div
              className="mt-3 rounded-md p-3"
              style={{ backgroundColor: "var(--equation-bg)" }}
            >
              <p
                className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: "var(--text-secondary)" }}
              >
                Current policy
              </p>
              <div
                className="grid grid-cols-4 gap-1 text-center"
                style={{ fontFamily: "var(--font-mono), monospace" }}
              >
                {ALL_CELLS.map((s) => (
                  <span
                    key={s}
                    className="text-xs"
                    style={{
                      color:
                        s === GOAL
                          ? "var(--text-secondary)"
                          : selected === s
                            ? "var(--accent)"
                            : "var(--text-secondary)",
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
        className="px-6 sm:px-8 py-4 flex flex-wrap items-center justify-center gap-3"
        style={{
          borderTop: "1px solid var(--card-border)",
          borderBottom: converged ? "1px solid var(--card-border)" : "none",
        }}
      >
        {running ? (
          <button
            onClick={skipToEnd}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
            style={{ backgroundColor: "var(--accent)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent)")
            }
          >
            Skip to End
          </button>
        ) : (
          <button
            onClick={startEvaluation}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition-colors cursor-pointer"
            style={{ backgroundColor: "var(--accent)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent)")
            }
          >
            Test My Policy
          </button>
        )}
        <button
          onClick={reset}
          disabled={running}
          className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: "var(--card-border)",
            color: "var(--foreground)",
            backgroundColor: "var(--card-bg)",
          }}
          onMouseEnter={(e) => {
            if (!running)
              e.currentTarget.style.backgroundColor = "var(--equation-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--card-bg)";
          }}
        >
          Reset
        </button>
        <button
          onClick={showOptimal}
          disabled={running}
          className="rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: "var(--card-border)",
            color: "var(--foreground)",
            backgroundColor: "var(--card-bg)",
          }}
          onMouseEnter={(e) => {
            if (!running)
              e.currentTarget.style.backgroundColor = "var(--equation-bg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--card-bg)";
          }}
        >
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
