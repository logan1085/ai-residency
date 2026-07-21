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
    title: "The Grid",
    policy: { A: null, B: null, C: null },
    values: { A: null, B: null, C: null, G: 0 },
    focus: "all",
    explanation:
      "Here\u2019s a simple 2\u00d72 grid with four rooms: A (top-left), B (top-right), C (bottom-left), and G (bottom-right). G is the goal \u2014 it has a score of 0 because you\u2019re already there. Our job: figure out which direction each room should point so you reach the goal as fast as possible.",
  },
  {
    phase: "setup",
    title: "The Rules",
    policy: { A: null, B: null, C: null },
    values: { A: null, B: null, C: null, G: 0 },
    focus: null,
    explanation:
      "From any room, you can go Up, Down, Left, or Right. If you walk into a wall, you stay put. Every move costs you \u22121 point, except walking into the goal which is free. Future points are worth slightly less than immediate ones (worth 90% as much).",
    equation: "Each move costs:   \u22121 point\nReaching the goal:  0 (free!)\nFuture discount:    0.9 (90%)",
  },
  {
    phase: "init",
    title: "Starting Strategy",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: null, B: null, C: null, G: 0 },
    focus: "A,B,C",
    explanation:
      "We start with a deliberately bad strategy: A points Up, B points Up, C points Left. Look at the grid \u2014 every room is pointing straight into a wall! Nobody can reach the goal. Let\u2019s score this strategy to see how bad it really is.",
  },
  {
    phase: "eval-0",
    title: "Scoring Room A",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: null, C: null, G: 0 },
    focus: "A",
    explanation:
      "Room A says \"go Up,\" but that\u2019s a wall. So you stay in A, lose 1 point, and face the exact same situation again. You\u2019re stuck in an endless loop, losing 1 point over and over. The penalties add up to \u221210 \u2014 the worst possible score.",
    equation:
      "Score(A) = cost + 0.9 \u00d7 Score(where you end up)\nScore(A) = \u22121 + 0.9 \u00d7 Score(A)    \u2190 you end up back in A!\nSolving: Score(A) = \u221210",
  },
  {
    phase: "eval-0",
    title: "Rooms B and C",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "B,C",
    explanation:
      "Same story for B and C. B goes Up (wall) and C goes Left (wall). Both are stuck in place, losing 1 point per move forever. A score of \u221210 means \"you\u2019re trapped and will never reach the goal.\"",
    equation:
      "Score(B) = \u22121 + 0.9 \u00d7 Score(B) = \u221210\nScore(C) = \u22121 + 0.9 \u00d7 Score(C) = \u221210",
  },
  {
    phase: "eval-0",
    title: "Scoring Complete",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "all",
    explanation:
      "Scoring is done. Every room has a score of \u221210 \u2014 the worst it can get. All three rooms just bump into walls forever. This strategy is clearly terrible. Now let\u2019s see if we can do better.",
  },
  {
    phase: "improve-0",
    title: "Looking for Better Options",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: null,
    explanation:
      "Time to improve. At each room, we\u2019ll try every possible direction and calculate a score for each option. The formula is simple: the cost of moving, plus 90% of the score of wherever you end up. Then we pick whichever direction scores best.",
    equation: "Score for an option = cost of moving + 0.9 \u00d7 Score(room you land in)",
  },
  {
    phase: "improve-0",
    title: "Room A: All Options Tied",
    policy: { A: "up", B: "up", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "A",
    explanation:
      "From A, every direction either hits a wall (staying in A) or leads to B or C \u2014 but they all have a score of \u221210. So every option gives the same result. No improvement possible yet \u2014 we keep A pointing Up.",
    equation:
      "Try Up:    \u22121 + 0.9 \u00d7 Score(A) = \u22121 + 0.9(\u221210) = \u221210\nTry Down:  \u22121 + 0.9 \u00d7 Score(C) = \u22121 + 0.9(\u221210) = \u221210\nTry Left:  \u22121 + 0.9 \u00d7 Score(A) = \u22121 + 0.9(\u221210) = \u221210\nTry Right: \u22121 + 0.9 \u00d7 Score(B) = \u22121 + 0.9(\u221210) = \u221210",
    qTable: [
      { action: "Up", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Down", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Left", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Right", formula: "\u22121 + 0.9(\u221210)", value: -10 },
    ],
  },
  {
    phase: "improve-0",
    title: "Room B: Down Wins!",
    policy: { A: "up", B: "down", C: "left" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "B",
    explanation:
      "From B, going Down leads straight to the goal G (score 0), and reaching the goal is free. That gives a score of 0 \u2014 massively better than \u221210! We switch B\u2019s direction to Down.",
    equation:
      "Try Up:    \u22121 + 0.9 \u00d7 Score(B) = \u22121 + 0.9(\u221210) = \u221210\nTry Down:   0 + 0.9 \u00d7 Score(G) =  0 + 0.9(0) = 0  \u2190 best!\nTry Left:  \u22121 + 0.9 \u00d7 Score(A) = \u22121 + 0.9(\u221210) = \u221210\nTry Right: \u22121 + 0.9 \u00d7 Score(B) = \u22121 + 0.9(\u221210) = \u221210",
    qTable: [
      { action: "Up", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Down", formula: "0 + 0.9(0)", value: 0, winner: true },
      { action: "Left", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Right", formula: "\u22121 + 0.9(\u221210)", value: -10 },
    ],
  },
  {
    phase: "improve-0",
    title: "Room C: Right Wins!",
    policy: { A: "up", B: "down", C: "right" },
    values: { A: -10, B: -10, C: -10, G: 0 },
    focus: "C",
    explanation:
      "From C, going Right reaches the goal G (score 0) for free. Score of 0, same as B. We switch C\u2019s direction to Right!",
    equation:
      "Try Up:    \u22121 + 0.9 \u00d7 Score(A) = \u22121 + 0.9(\u221210) = \u221210\nTry Down:  \u22121 + 0.9 \u00d7 Score(C) = \u22121 + 0.9(\u221210) = \u221210\nTry Left:  \u22121 + 0.9 \u00d7 Score(C) = \u22121 + 0.9(\u221210) = \u221210\nTry Right:  0 + 0.9 \u00d7 Score(G) =  0 + 0.9(0) = 0  \u2190 best!",
    qTable: [
      { action: "Up", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Down", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Left", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Right", formula: "0 + 0.9(0)", value: 0, winner: true },
    ],
  },
  {
    phase: "policy-1",
    title: "Updated Strategy",
    policy: { A: "up", B: "down", C: "right" },
    values: { A: null, B: null, C: null, G: 0 },
    focus: "all",
    explanation:
      "After improving, our new strategy is: A \u2192 Up (unchanged), B \u2192 Down (improved!), C \u2192 Right (improved!). B and C now point toward the goal. But A is still stuck. Let\u2019s score this new strategy.",
  },
  {
    phase: "eval-1",
    title: "B and C Reach the Goal",
    policy: { A: "up", B: "down", C: "right" },
    values: { A: null, B: 0, C: 0, G: 0 },
    focus: "B,C",
    explanation:
      "With the updated strategy, B goes Down to the goal (free!) and C goes Right to the goal (free!). Both reach the goal in one step. Their scores are now 0 \u2014 as good as it gets.",
    equation: "Score(B) = 0 + 0.9 \u00d7 Score(G) = 0 + 0 = 0\nScore(C) = 0 + 0.9 \u00d7 Score(G) = 0 + 0 = 0",
  },
  {
    phase: "eval-1",
    title: "Room A Is Still Stuck",
    policy: { A: "up", B: "down", C: "right" },
    values: { A: -10, B: 0, C: 0, G: 0 },
    focus: "A",
    explanation:
      "Room A still goes Up (wall), bouncing in place forever. Its score stays at \u221210. We haven\u2019t changed A\u2019s direction yet \u2014 it still needs help.",
    equation:
      "Score(A) = \u22121 + 0.9 \u00d7 Score(A)\nSolving: Score(A) = \u221210",
  },
  {
    phase: "improve-1",
    title: "Room A: Right and Down Both Win!",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: -10, B: 0, C: 0, G: 0 },
    focus: "A",
    explanation:
      "Now B and C both have a score of 0. So from A, going Right (to B) or Down (to C) both give a score of \u22121. That\u2019s much better than \u221210! We pick Right (either would work). B and C are already doing their best.",
    equation:
      "Try Up:    \u22121 + 0.9 \u00d7 Score(A) = \u22121 + 0.9(\u221210) = \u221210\nTry Right: \u22121 + 0.9 \u00d7 Score(B) = \u22121 + 0.9(0)    = \u22121  \u2190 best!\nTry Down:  \u22121 + 0.9 \u00d7 Score(C) = \u22121 + 0.9(0)    = \u22121  \u2190 best!\nTry Left:  \u22121 + 0.9 \u00d7 Score(A) = \u22121 + 0.9(\u221210) = \u221210",
    qTable: [
      { action: "Up", formula: "\u22121 + 0.9(\u221210)", value: -10 },
      { action: "Right", formula: "\u22121 + 0.9(0)", value: -1, winner: true },
      { action: "Down", formula: "\u22121 + 0.9(0)", value: -1, winner: true },
      { action: "Left", formula: "\u22121 + 0.9(\u221210)", value: -10 },
    ],
  },
  {
    phase: "policy-2",
    title: "Final Strategy",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: null, B: null, C: null, G: 0 },
    focus: "all",
    explanation:
      "Our strategy now: A \u2192 Right (improved!), B \u2192 Down, C \u2192 Right. Every room has a clear path to the goal! Let\u2019s score it one more time to be sure.",
  },
  {
    phase: "eval-2",
    title: "Final Scores",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: -1, B: 0, C: 0, G: 0 },
    focus: "all",
    explanation:
      "A goes Right to B (\u22121 cost), then B goes Down to the goal (free). A reaches the goal in 2 steps. B and C each reach it in 1 step. These are the best scores possible.",
    equation:
      "Score(A) = \u22121 + 0.9 \u00d7 Score(B) = \u22121 + 0.9(0) = \u22121\nScore(B) = 0 + 0.9 \u00d7 Score(G) = 0\nScore(C) = 0 + 0.9 \u00d7 Score(G) = 0",
  },
  {
    phase: "converge",
    title: "Nothing Left to Improve",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: -1, B: 0, C: 0, G: 0 },
    focus: "all",
    explanation:
      "We check one more time: at every room, is there a better direction? Nope \u2014 each room is already pointing the best way. The strategy is stable, so we\u2019re done!",
    equation:
      "For each room, the best direction\nmatches what we already have.\n\nNo changes \u2192 strategy is final!",
  },
  {
    phase: "converge",
    title: "Best Strategy Found!",
    policy: { A: "right", B: "down", C: "right" },
    values: { A: -1, B: 0, C: 0, G: 0 },
    focus: "all",
    explanation:
      "That\u2019s it! In just 2 rounds of improvement, we found the best possible strategy. Every room takes the shortest path to the goal: A goes Right to B, then B goes Down to G (2 steps). B and C each reach the goal in 1 step. This is policy iteration in action.",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function phaseLabel(phase: Phase): string {
  if (phase === "setup" || phase === "init") return "SETUP";
  if (phase.startsWith("eval")) return "SCORING";
  if (phase.startsWith("improve")) return "IMPROVING";
  if (phase.startsWith("policy")) return "SETUP";
  return "FINISHED";
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
        className={`font-bold tabular-nums ${
          value !== null && value <= -10 ? "text-xl" : "text-2xl"
        }`}
        style={{ fontFamily: "var(--font-mono), monospace" }}
      >
        {isGoal ? "0" : value !== null ? value : "?"}
      </span>

      {/* Small label for -10 */}
      {!isGoal && value !== null && value <= -10 && (
        <span
          className="text-[9px] font-medium uppercase tracking-wide"
          style={{ color: "#B91C1C" }}
        >
          stuck
        </span>
      )}

      {/* Policy arrow */}
      {!isGoal && (value === null || value > -10) && (
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
          className="flex-shrink-0 flex items-center justify-center p-6 lg:p-8 lg:w-[340px] border-b lg:border-b-0 lg:border-r"
          style={{ borderColor: "var(--card-border)" }}
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
        <div className="flex-1 p-6 lg:p-8 flex flex-col gap-4 lg:min-h-[320px]">
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
                    <th>Direction</th>
                    <th>Calculation</th>
                    <th>Score</th>
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
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: phaseColor(step.phase) }}
            />
            <span
              className="text-xs font-medium tabular-nums whitespace-nowrap"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--font-mono), monospace",
              }}
            >
              {currentStep + 1}/{total}
            </span>
          </div>
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

        {currentStep === 0 && (
          <p
            className="text-xs text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            Press Play to watch the algorithm run, or step through one at a time
          </p>
        )}
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
