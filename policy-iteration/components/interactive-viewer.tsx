"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type Direction = "up" | "down" | "left" | "right" | null;

type Phase =
  | "setup"
  | "init"
  | "eval-0"
  | "improve-0"
  | "policy-1"
  | "eval-1"
  | "improve-1"
  | "policy-2"
  | "eval-2"
  | "converge";

type FocusTarget = "all" | "A" | "B" | "C" | "A,B,C" | "B,C" | null;

interface QRow {
  action: string;
  formula: string;
  value: number;
  winner?: boolean;
}

interface Step {
  phase: Phase;
  title: string;
  policy: { A: Direction; B: Direction; C: Direction };
  values: { A: number | null; B: number | null; C: number | null; G: number };
  focus: FocusTarget;
  explanation: string;
  equation?: string;
  qTable?: QRow[];
}

/* ------------------------------------------------------------------ */
/*  Step data (18 steps)                                               */
/* ------------------------------------------------------------------ */

const STEPS: Step[] = [
  {
    phase: "setup",
    title: "The Grid World",
    policy: { A: null, B: null, C: null },
    values: { A: null, B: null, C: null, G: 0 },
    focus: "all",
    explanation:
      "We have a 2\u00d72 grid with four states: A (top-left), B (top-right), C (bottom-left), and G (bottom-right). G is the goal state with value 0. Our task: find the optimal policy that reaches G as quickly as possible.",
  },
  {
    phase: "setup",
    title: "The Rules",
    policy: { A: null, B: null, C: null },
    values: { A: null, B: null, C: null, G: 0 },
    focus: null,
    explanation:
      "From each non-goal state, the agent can move Up, Down, Left, or Right. Moving into a wall keeps the agent in place. Every move costs \u22121 reward, except moving into the goal which gives 0. The discount factor \u03b3 = 0.9.",
    equation: "R(s, a) = \u22121  for all moves\nR(s, a) = 0   when entering goal G\n\u03b3 = 0.9",
  },
  {
    phase: "init",
    title: "Initial Policy \u03c0\u2080",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: null, B: null, C: null, G: 0 },
    focus: "A,B,C",
    explanation:
      "We start with an arbitrary (bad) policy: A \u2192 Up, B \u2192 Up, C \u2192 Left. Under this policy, every state bumps into a wall and stays in place \u2014 nobody can reach the goal! Let\u2019s evaluate it to see how bad it is.",
  },
  {
    phase: "eval-0",
    title: "Evaluating State A",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: null, C: null, G: 0 },
    focus: "A",
    explanation:
      "Under \u03c0\u2080, state A\u2019s policy is Up, which bumps into the top wall. The agent stays in A, pays \u22121, and faces the same situation forever. The Bellman equation gives us an infinite discounted sum.",
    equation:
      "V(A) = R + \u03b3\u00b7V(A)\nV(A) = \u22121 + 0.9\u00b7V(A)\nV(A) \u2212 0.9\u00b7V(A) = \u22121\n0.1\u00b7V(A) = \u22121\nV(A) = \u221210",
  },
  {
    phase: "eval-0",
    title: "States B and C",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "B,C",
    explanation:
      "The same logic applies: B goes Up (wall), C goes Left (wall). Both loop forever in place. Every non-goal state has the same value under this terrible policy.",
    equation:
      "V(B) = \u22121 + 0.9\u00b7V(B) = \u221210\nV(C) = \u22121 + 0.9\u00b7V(C) = \u221210",
  },
  {
    phase: "eval-0",
    title: "Evaluation Complete",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "all",
    explanation:
      "Policy evaluation for \u03c0\u2080 is done. Every non-goal state has value \u221210, reflecting the infinite loop of wall-bumping. The policy is clearly bad \u2014 now let\u2019s try to improve it.",
  },
  {
    phase: "improve-0",
    title: "Improving the Policy",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: null,
    explanation:
      "Policy improvement works by computing Q(s, a) for every action at each state, then picking the action with the highest Q-value. If a better action exists, we switch to it.",
    equation: "Q(s, a) = R(s, a) + \u03b3\u00b7V(s\u2032)\nwhere s\u2032 is the state reached by action a",
  },
  {
    phase: "improve-0",
    title: "State A: All Tied",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "A",
    explanation:
      "From A, every action leads to a state with value \u221210 (or stays in A with value \u221210). All Q-values are equal, so we keep the current action: Up.",
    equation:
      "Q(A, Up)    = \u22121 + 0.9\u00b7V(A) = \u22121 + 0.9(\u221210) = \u221210\nQ(A, Down)  = \u22121 + 0.9\u00b7V(C) = \u22121 + 0.9(\u221210) = \u221210\nQ(A, Left)  = \u22121 + 0.9\u00b7V(A) = \u22121 + 0.9(\u221210) = \u221210\nQ(A, Right) = \u22121 + 0.9\u00b7V(B) = \u22121 + 0.9(\u221210) = \u221210",
    qTable: [
      { action: "Up", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Down", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Left", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Right", formula: "\u22121 + 0.9(\u221210)", value: -10 },
    ],
  },
  {
    phase: "improve-0",
    title: "State B: Down Wins",
    policy: { A: "up", B: "down", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "B",
    explanation:
      "From B, moving Down reaches the goal G (value 0) with reward 0. That gives Q = 0, much better than the \u221210 from other actions. We switch B\u2019s policy to Down!",
    equation:
      "Q(B, Up)    = \u22121 + 0.9\u00b7V(B) = \u22121 + 0.9(\u221210) = \u221210\nQ(B, Down)  =  0 + 0.9\u00b7V(G) =  0 + 0.9(0) = 0  \u2190 best!\nQ(B, Left)  = \u22121 + 0.9\u00b7V(A) = \u22121 + 0.9(\u221210) = \u221210\nQ(B, Right) = \u22121 + 0.9\u00b7V(B) = \u22121 + 0.9(\u221210) = \u221210",
    qTable: [
      { action: "Up", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Down", formula: "0 + 0.9(0)", value: 0, winner: true },
      { action: "Left", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Right", formula: "\u22121 + 0.9(\u221210)", value: -10 },
    ],
  },
  {
    phase: "improve-0",
    title: "State C: Right Wins",
    policy: { A: "up", B: "down", C: "right" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "C",
    explanation:
      "From C, moving Right reaches the goal G (value 0) with reward 0. That gives Q = 0, the best option. We switch C\u2019s policy to Right!",
    equation:
      "Q(C, Up)    = \u22121 + 0.9\u00b7V(A) = \u22121 + 0.9(\u221210) = \u221210\nQ(C, Down)  = \u22121 + 0.9\u00b7V(C) = \u22121 + 0.9(\u221210) = \u221210\nQ(C, Left)  = \u22121 + 0.9\u00b7V(C) = \u22121 + 0.9(\u221210) = \u221210\nQ(C, Right) =  0 + 0.9\u00b7V(G) =  0 + 0.9(0) = 0  \u2190 best!",
    qTable: [
      { action: "Up", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Down", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Left", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Right", formula: "0 + 0.9(0)", value: 0, winner: true },
    ],
  },
  {
    phase: "policy-1",
    title: "New Policy \u03c0\u2081",
    policy: { A: "up", B: "down", C: "right" },
    values: { A: null, B: null, C: null, G: 0 },
    focus: "all",
    explanation:
      "After improvement, our new policy is: A \u2192 Up (unchanged), B \u2192 Down (improved!), C \u2192 Right (improved!). B and C now point toward the goal. Let\u2019s evaluate this new policy.",
  },
  {
    phase: "eval-1",
    title: "B and C Reach Goal",
    policy: { A: "up", B: "down", C: "right" },
    values: { A: null, B: 0, C: 0, G: 0 },
    focus: "B,C",
    explanation:
      "Under \u03c0\u2081, B goes Down to G (reward 0, done) and C goes Right to G (reward 0, done). Both reach the goal in one step!",
    equation: "V(B) = 0 + 0.9\u00b7V(G) = 0 + 0 = 0\nV(C) = 0 + 0.9\u00b7V(G) = 0 + 0 = 0",
  },
  {
    phase: "eval-1",
    title: "A Still Loops",
    policy: { A: "up", B: "down", C: "right" },
    values: { A: -10, B: 0, C: 0, G: 0 },
    focus: "A",
    explanation:
      "State A still goes Up (wall), looping forever in place. Its value remains \u221210. The policy for A hasn\u2019t changed yet \u2014 improvement is needed.",
    equation:
      "V(A) = \u22121 + 0.9\u00b7V(A)\n0.1\u00b7V(A) = \u22121\nV(A) = \u221210",
  },
  {
    phase: "improve-1",
    title: "A: Right and Down Win",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: -10, B: 0, C: 0, G: 0 },
    focus: "A",
    explanation:
      "Now B and C have value 0, so going Right (to B) or Down (to C) from A both give Q = \u22121 + 0.9(0) = \u22121. Much better than \u221210! We pick Right (arbitrary tie-break). B and C are already optimal.",
    equation:
      "Q(A, Up)    = \u22121 + 0.9\u00b7V(A) = \u22121 + 0.9(\u221210) = \u221210\nQ(A, Right) = \u22121 + 0.9\u00b7V(B) = \u22121 + 0.9(0)    = \u22121  \u2190 best!\nQ(A, Down)  = \u22121 + 0.9\u00b7V(C) = \u22121 + 0.9(0)    = \u22121  \u2190 best!\nQ(A, Left)  = \u22121 + 0.9\u00b7V(A) = \u22121 + 0.9(\u221210) = \u221210",
    qTable: [
      { action: "Up", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Right", formula: "\u22121 + 0.9(0)", value: -1, winner: true },
      { action: "Down", formula: "\u22121 + 0.9(0)", value: -1, winner: true },
      { action: "Left", formula: "\u22121 + 0.9(\u221210)", value: -10 },
    ],
  },
  {
    phase: "policy-2",
    title: "New Policy \u03c0\u2082",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: null, B: null, C: null, G: 0 },
    focus: "all",
    explanation:
      "Our new policy: A \u2192 Right (improved!), B \u2192 Down, C \u2192 Right. Now every state has a path to the goal! Let\u2019s evaluate one more time.",
  },
  {
    phase: "eval-2",
    title: "Final Evaluation",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: -1, B: 0, C: 0, G: 0 },
    focus: "all",
    explanation:
      "Under \u03c0\u2082: A goes Right to B (\u22121 reward), then B goes Down to G (0 reward). A reaches the goal in 2 steps. B and C each reach it in 1 step.",
    equation:
      "V(A) = \u22121 + 0.9\u00b7V(B) = \u22121 + 0.9(0) = \u22121\nV(B) = 0 + 0.9\u00b7V(G) = 0\nV(C) = 0 + 0.9\u00b7V(G) = 0",
  },
  {
    phase: "converge",
    title: "Policy Unchanged",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: -1, B: 0, C: 0, G: 0 },
    focus: "all",
    explanation:
      "We run policy improvement again: for every state, the greedy action matches the current policy. No changes are made \u2014 the policy is stable!",
    equation:
      "For each state s:\n  argmax_a Q(s, a) = \u03c0\u2082(s)\n\nPolicy stable \u2192 \u03c0\u2082 = \u03c0*",
  },
  {
    phase: "converge",
    title: "Optimal Policy Found!",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: -1, B: 0, C: 0, G: 0 },
    focus: "all",
    explanation:
      "Policy iteration has converged in just 2 improvement rounds. The optimal policy sends every state on the shortest path to the goal. A takes 2 steps (A \u2192 B \u2192 G), while B and C each take 1 step.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function phaseLabel(phase: Phase): string {
  if (phase === "setup" || phase === "init") return "SETUP";
  if (phase.startsWith("eval")) return "POLICY EVALUATION";
  if (phase.startsWith("improve")) return "POLICY IMPROVEMENT";
  if (phase.startsWith("policy")) return "SETUP";
  return "CONVERGENCE";
}

function phaseColor(phase: Phase): string {
  if (phase === "setup" || phase === "init" || phase.startsWith("policy"))
    return "var(--phase-setup)";
  if (phase.startsWith("eval")) return "var(--phase-eval)";
  if (phase.startsWith("improve")) return "var(--phase-improve)";
  return "var(--phase-converge)";
}

function cellBg(value: number | null): string {
  if (value === null) return "var(--cell-unknown)";
  if (value <= -10) return "var(--cell-red)";
  if (value < 0) return "var(--cell-amber)";
  return "var(--cell-green)";
}

function arrowChar(dir: Direction): string {
  switch (dir) {
    case "up":
      return "\u2191";
    case "down":
      return "\u2193";
    case "left":
      return "\u2190";
    case "right":
      return "\u2192";
    default:
      return "\u00b7";
  }
}

function isFocused(state: string, focus: FocusTarget): boolean {
  if (focus === "all") return true;
  if (focus === null) return false;
  return focus.split(",").includes(state);
}

/* ------------------------------------------------------------------ */
/*  Grid Cell                                                          */
/* ------------------------------------------------------------------ */

function GridCell({
  label,
  value,
  arrow,
  isGoal,
  focused,
}: {
  label: string;
  value: number | null;
  arrow: Direction;
  isGoal: boolean;
  focused: boolean;
}) {
  return (
    <div
      className={`grid-cell relative flex flex-col items-center justify-center rounded-lg border-2 aspect-square ${focused ? "cell-focused" : ""}`}
      style={{
        backgroundColor: isGoal ? "var(--cell-green)" : cellBg(value),
        borderColor: focused ? "var(--accent)" : "var(--card-border)",
      }}
    >
      {/* State label */}
      <span
        className="absolute top-1.5 left-2 text-xs font-semibold"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </span>

      {/* Goal badge */}
      {isGoal && (
        <span className="absolute top-1 right-1.5 text-base" title="Goal">
          &#9733;
        </span>
      )}

      {/* Value display */}
      <span
        className="text-2xl font-bold tabular-nums"
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        {isGoal ? "0" : value !== null ? value : "\u2014"}
      </span>

      {/* Policy arrow */}
      {!isGoal && (
        <span className="policy-arrow mt-0.5" style={{ color: arrow ? "var(--foreground)" : "var(--text-secondary)" }}>
          {arrowChar(arrow)}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function InteractiveViewer() {
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = STEPS[currentStep];
  const total = STEPS.length;

  const goTo = useCallback(
    (idx: number) => setCurrentStep(Math.max(0, Math.min(total - 1, idx))),
    [total]
  );

  const next = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= total - 1) {
        setPlaying(false);
        return prev;
      }
      return prev + 1;
    });
  }, [total]);

  const prev = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Auto-play
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(next, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, next]);

  // Keyboard controls
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      {/* Split panel */}
      <div className="flex flex-col lg:flex-row">
        {/* Left — Grid */}
        <div
          className="flex-shrink-0 flex items-center justify-center p-6 lg:p-8 lg:w-[340px]"
          style={{ borderRight: "1px solid var(--card-border)" }}
        >
          <div className="grid grid-cols-2 gap-3 w-full max-w-[240px]">
            <GridCell
              label="A"
              value={step.values.A}
              arrow={step.policy.A}
              isGoal={false}
              focused={isFocused("A", step.focus)}
            />
            <GridCell
              label="B"
              value={step.values.B}
              arrow={step.policy.B}
              isGoal={false}
              focused={isFocused("B", step.focus)}
            />
            <GridCell
              label="C"
              value={step.values.C}
              arrow={step.policy.C}
              isGoal={false}
              focused={isFocused("C", step.focus)}
            />
            <GridCell
              label="G"
              value={step.values.G}
              arrow={null}
              isGoal={true}
              focused={isFocused("G", step.focus)}
            />
          </div>
        </div>

        {/* Right — Explanation */}
        <div className="flex-1 p-6 lg:p-8 flex flex-col gap-4 min-h-[320px]">
          {/* Phase badge */}
          <div>
            <span
              className="phase-badge"
              style={{ backgroundColor: phaseColor(step.phase) }}
            >
              {phaseLabel(step.phase)}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-semibold leading-tight"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            {step.title}
          </h3>

          {/* Explanation */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {step.explanation}
          </p>

          {/* Equation */}
          {step.equation && (
            <div className="equation-block">{step.equation}</div>
          )}

          {/* Q-value table */}
          {step.qTable && (
            <div className="mt-auto">
              <table className="q-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Formula</th>
                    <th>Q-value</th>
                  </tr>
                </thead>
                <tbody>
                  {step.qTable.map((row) => (
                    <tr
                      key={row.action}
                      className={row.winner ? "winner" : ""}
                    >
                      <td>{row.action}</td>
                      <td style={{ fontFamily: "var(--font-mono), monospace" }}>
                        {row.formula}
                      </td>
                      <td style={{ fontFamily: "var(--font-mono), monospace" }}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Bottom — Controls */}
      <div
        className="px-6 py-4 flex flex-col gap-3"
        style={{ borderTop: "1px solid var(--card-border)" }}
      >
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium tabular-nums whitespace-nowrap"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-mono), monospace",
            }}
          >
            Step {currentStep + 1} of {total}
          </span>
          <div className="flex-1">
            <input
              type="range"
              min={0}
              max={total - 1}
              value={currentStep}
              onChange={(e) => goTo(Number(e.target.value))}
              className="w-full accent-[#E07A2F] cursor-pointer"
              style={{ height: "6px" }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-2">
          <ControlButton
            onClick={() => goTo(0)}
            disabled={currentStep === 0}
            label="First"
          >
            |&#9664;
          </ControlButton>
          <ControlButton onClick={prev} disabled={currentStep === 0} label="Previous">
            &#9664;
          </ControlButton>
          <button
            onClick={() => {
              if (playing) {
                setPlaying(false);
              } else {
                if (currentStep >= total - 1) setCurrentStep(0);
                setPlaying(true);
              }
            }}
            className="flex items-center justify-center gap-1.5 rounded-lg px-5 py-2 text-sm font-semibold text-white transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--accent)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--accent)")
            }
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? "\u23F8 Pause" : "\u25B6 Play"}
          </button>
          <ControlButton
            onClick={next}
            disabled={currentStep >= total - 1}
            label="Next"
          >
            &#9654;
          </ControlButton>
          <ControlButton
            onClick={() => goTo(total - 1)}
            disabled={currentStep >= total - 1}
            label="Last"
          >
            &#9654;|
          </ControlButton>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small control button                                                */
/* ------------------------------------------------------------------ */

function ControlButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex items-center justify-center rounded-lg border px-3 py-2 text-sm transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      style={{
        borderColor: "var(--card-border)",
        color: disabled ? "var(--text-secondary)" : "var(--foreground)",
        backgroundColor: "var(--card-bg)",
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.backgroundColor = "var(--equation-bg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "var(--card-bg)";
      }}
    >
      {children}
    </button>
  );
}
