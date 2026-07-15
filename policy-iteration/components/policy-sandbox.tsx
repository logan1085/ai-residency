"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Direction = "up" | "down" | "left" | "right";
type State = "A" | "B" | "C" | "G";

interface Policy {
  A: Direction;
  B: Direction;
  C: Direction;
}

interface Values {
  A: number;
  B: number;
  C: number;
  G: number;
}

interface PathResult {
  path: State[];
  reachesGoal: boolean;
  loops: boolean;
}

/* ------------------------------------------------------------------ */
/*  Transition function                                                */
/* ------------------------------------------------------------------ */

function transition(state: State, dir: Direction): State {
  const moves: Record<string, Record<Direction, State>> = {
    A: { up: "A", down: "C", left: "A", right: "B" },
    B: { up: "B", down: "G", left: "A", right: "B" },
    C: { up: "A", down: "C", left: "C", right: "G" },
  };
  return moves[state]?.[dir] ?? state;
}

/* ------------------------------------------------------------------ */
/*  One Bellman iteration                                              */
/* ------------------------------------------------------------------ */

function bellmanStep(policy: Policy, v: Values): Values {
  const newV: Values = { A: 0, B: 0, C: 0, G: 0 };
  for (const s of ["A", "B", "C"] as const) {
    const next = transition(s, policy[s]);
    const reward = next === "G" ? 0 : -1;
    newV[s] = reward + 0.9 * v[next];
  }
  return newV;
}

function hasConverged(prev: Values, next: Values): boolean {
  return (
    Math.abs(prev.A - next.A) < 0.001 &&
    Math.abs(prev.B - next.B) < 0.001 &&
    Math.abs(prev.C - next.C) < 0.001
  );
}

/* ------------------------------------------------------------------ */
/*  Full evaluation (for instant results)                              */
/* ------------------------------------------------------------------ */

function evaluatePolicy(policy: Policy): Values {
  let v: Values = { A: 0, B: 0, C: 0, G: 0 };
  for (let i = 0; i < 200; i++) {
    v = bellmanStep(policy, v);
  }
  return v;
}

/* ------------------------------------------------------------------ */
/*  Path tracing                                                       */
/* ------------------------------------------------------------------ */

function tracePath(start: State, policy: Policy): PathResult {
  const path: State[] = [start];
  let current = start;

  for (let i = 0; i < 10; i++) {
    const next = transition(current, policy[current as "A" | "B" | "C"]);
    path.push(next);

    if (next === "G") {
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
/*  Optimality check                                                   */
/* ------------------------------------------------------------------ */

const OPTIMAL_VALUES: Values = { A: -1, B: 0, C: 0, G: 0 };

function isOptimal(values: Values): boolean {
  return (
    Math.abs(values.A - OPTIMAL_VALUES.A) < 0.01 &&
    Math.abs(values.B - OPTIMAL_VALUES.B) < 0.01 &&
    Math.abs(values.C - OPTIMAL_VALUES.C) < 0.01
  );
}

function allReachGoal(policy: Policy): boolean {
  for (const s of ["A", "B", "C"] as const) {
    const result = tracePath(s, policy);
    if (!result.reachesGoal) return false;
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

/* ------------------------------------------------------------------ */
/*  Direction Picker                                                   */
/* ------------------------------------------------------------------ */

const ALL_DIRS: Direction[] = ["up", "right", "down", "left"];

function DirectionPicker({
  state,
  selected,
  onChange,
  disabled,
}: {
  state: "A" | "B" | "C";
  selected: Direction;
  onChange: (dir: Direction) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-sm font-semibold w-5 shrink-0"
        style={{ fontFamily: "var(--font-serif), serif" }}
      >
        {state}
      </span>
      <div className="flex gap-1.5">
        {ALL_DIRS.map((dir) => {
          const active = selected === dir;
          return (
            <button
              key={dir}
              onClick={() => onChange(dir)}
              disabled={disabled}
              className="sandbox-dir-btn flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: active ? "var(--accent)" : "var(--equation-bg)",
                color: active ? "white" : "var(--text-secondary)",
                border: active
                  ? "1px solid var(--accent)"
                  : "1px solid var(--card-border)",
              }}
              aria-label={`Set ${state} to ${dir}`}
              aria-pressed={active}
            >
              <span className="text-sm leading-none">{ARROW_CHARS[dir]}</span>
              <span>{DIR_LABELS[dir]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Results section                                                    */
/* ------------------------------------------------------------------ */

function Results({
  values,
  policy,
}: {
  values: Values;
  policy: Policy;
}) {
  const optimal = isOptimal(values);
  const reaches = allReachGoal(policy);

  const paths = {
    A: tracePath("A", policy),
    B: tracePath("B", policy),
    C: tracePath("C", policy),
  };

  const improvementHints: string[] = [];
  if (!optimal) {
    for (const s of ["A", "B", "C"] as const) {
      if (!paths[s].reachesGoal) {
        improvementHints.push(
          `${s} never reaches the goal. Try pointing it toward a neighboring state that does.`
        );
      } else {
        const pathLen = paths[s].path.length - 1;
        const optLen = s === "A" ? 2 : 1;
        if (pathLen > optLen) {
          improvementHints.push(
            `${s} reaches the goal in ${pathLen} steps, but it could do it in ${optLen}.`
          );
        }
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
                : "Stuck in a loop"}
          </h4>
        </div>
        <p
          className="text-sm leading-relaxed ml-11"
          style={{ color: "var(--text-secondary)" }}
        >
          {optimal
            ? "Every state reaches the goal by the shortest possible path. This is the best policy for this grid."
            : reaches
              ? "All states eventually reach the goal, but some take a longer route than necessary."
              : "At least one state is stuck in an infinite loop and will never reach the goal."}
        </p>
      </div>

      {/* Path traces + values */}
      <div className="grid sm:grid-cols-3 gap-3">
        {(["A", "B", "C"] as const).map((s) => {
          const p = paths[s];
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
                    color: values[s] <= -9.99
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
                    {p.path[0]} {"\u2192"} {p.path[0]} {"\u2192"} ...
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
      {improvementHints.length > 0 && (
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
            {improvementHints.map((hint, i) => (
              <li
                key={i}
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {hint}
              </li>
            ))}
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
  const [policy, setPolicy] = useState<Policy>({
    A: "up",
    B: "up",
    C: "left",
  });
  const [values, setValues] = useState<Values>({ A: 0, B: 0, C: 0, G: 0 });
  const [iteration, setIteration] = useState(0);
  const [running, setRunning] = useState(false);
  const [converged, setConverged] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const valuesRef = useRef<Values>({ A: 0, B: 0, C: 0, G: 0 });

  const showValues = running || converged;

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const setDirection = useCallback(
    (state: "A" | "B" | "C", dir: Direction) => {
      setPolicy((prev) => ({ ...prev, [state]: dir }));
      // Reset evaluation state
      if (timerRef.current) clearInterval(timerRef.current);
      setRunning(false);
      setConverged(false);
      setIteration(0);
      setValues({ A: 0, B: 0, C: 0, G: 0 });
      valuesRef.current = { A: 0, B: 0, C: 0, G: 0 };
    },
    []
  );

  const startEvaluation = useCallback(() => {
    // Reset
    if (timerRef.current) clearInterval(timerRef.current);
    const init: Values = { A: 0, B: 0, C: 0, G: 0 };
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

      if (hasConverged(prev, next) || iter >= 50) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        // Snap to fully converged values for display accuracy
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
    setValues({ A: 0, B: 0, C: 0, G: 0 });
    valuesRef.current = { A: 0, B: 0, C: 0, G: 0 };
  }, []);

  const showOptimal = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    const optPolicy: Policy = { A: "right", B: "down", C: "right" };
    setPolicy(optPolicy);
    const v = evaluatePolicy(optPolicy);
    setValues(v);
    valuesRef.current = v;
    setIteration(200);
    setRunning(false);
    setConverged(true);
  }, []);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* ---- Top: Grid + Direction Pickers ---- */}
      <div className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
          {/* Grid visualization */}
          <div className="shrink-0">
            <div className="grid grid-cols-2 gap-2.5" style={{ width: "200px" }}>
              {(["A", "B", "C", "G"] as const).map((s) => {
                const isGoal = s === "G";
                const dir = isGoal ? null : policy[s];
                const val = showValues ? values[s] : null;

                return (
                  <div
                    key={s}
                    className="grid-cell relative flex flex-col items-center justify-center rounded-lg border-2 aspect-square"
                    style={{
                      backgroundColor: isGoal
                        ? "var(--cell-green)"
                        : cellBg(val, showValues),
                      borderColor: "var(--card-border)",
                    }}
                  >
                    <span
                      className="absolute top-1 left-1.5 text-[10px] font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s}
                    </span>

                    {isGoal && (
                      <span className="absolute top-0.5 right-1 text-sm">
                        &#9733;
                      </span>
                    )}

                    {isGoal ? (
                      <span
                        className="text-xl font-bold tabular-nums"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        0
                      </span>
                    ) : showValues && val !== null ? (
                      <span
                        className="text-lg font-bold tabular-nums"
                        style={{ fontFamily: "var(--font-mono), monospace" }}
                      >
                        {formatValue(val)}
                      </span>
                    ) : (
                      <span
                        className="text-2xl leading-none"
                        style={{ color: "var(--foreground)" }}
                      >
                        {dir ? ARROW_CHARS[dir] : ""}
                      </span>
                    )}

                    {!isGoal && showValues && val !== null && dir && (
                      <span
                        className="text-sm leading-none mt-0.5"
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
                  style={{ color: running ? "var(--accent)" : "var(--text-secondary)" }}
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
                Arrows show your chosen direction
              </p>
            )}
          </div>

          {/* Direction pickers + Bellman equation */}
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--text-secondary)" }}
            >
              Choose a direction for each state
            </p>
            <div className="space-y-2.5">
              <DirectionPicker
                state="A"
                selected={policy.A}
                onChange={(dir) => setDirection("A", dir)}
                disabled={running}
              />
              <DirectionPicker
                state="B"
                selected={policy.B}
                onChange={(dir) => setDirection("B", dir)}
                disabled={running}
              />
              <DirectionPicker
                state="C"
                selected={policy.C}
                onChange={(dir) => setDirection("C", dir)}
                disabled={running}
              />
            </div>

            {/* Live Bellman equation display */}
            {showValues && (
              <div className="equation-block mt-4 text-[11px]">
                <p
                  className="font-sans text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans), system-ui, sans-serif",
                  }}
                >
                  Bellman update (each iteration)
                </p>
                {(["A", "B", "C"] as const).map((s) => {
                  const next = transition(s, policy[s]);
                  const reward = next === "G" ? "0" : "-1";
                  return (
                    <div key={s}>
                      V({s}) = {reward} + 0.9 {"\u00d7"} V({next}) = <strong>{formatValue(values[s])}</strong>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Where each arrow leads */}
            {!showValues && (
              <div
                className="mt-4 rounded-md p-3"
                style={{ backgroundColor: "var(--equation-bg)" }}
              >
                <p
                  className="text-[10px] font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Where does each direction go?
                </p>
                <div
                  className="grid grid-cols-3 gap-x-4 gap-y-1 text-[11px]"
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-mono), monospace",
                  }}
                >
                  {(["A", "B", "C"] as const).map((s) => {
                    const next = transition(s, policy[s]);
                    const hitsWall = next === s;
                    return (
                      <span key={s}>
                        {s}{ARROW_CHARS[policy[s]]}{next}
                        {hitsWall && (
                          <span style={{ color: "#EF4444" }}> wall</span>
                        )}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
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
              (e.currentTarget.style.backgroundColor = "var(--accent-hover)")
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
              (e.currentTarget.style.backgroundColor = "var(--accent-hover)")
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
            if (!running) e.currentTarget.style.backgroundColor = "var(--equation-bg)";
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
            if (!running) e.currentTarget.style.backgroundColor = "var(--equation-bg)";
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
