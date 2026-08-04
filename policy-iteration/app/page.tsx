import { Fragment } from "react";
import InteractiveViewer from "@/components/interactive-viewer";
import PolicySandbox from "@/components/policy-sandbox";

/* ------------------------------------------------------------------ */
/*  Contents                                                           */
/* ------------------------------------------------------------------ */

const CONTENTS = [
  { id: "big-idea", index: "01", title: "The Big Idea" },
  { id: "grid-world", index: "02", title: "The Example: A Tiny Grid World" },
  { id: "walkthrough", index: "03", title: "Interactive Walkthrough" },
  { id: "takeaways", index: "04", title: "Key Takeaways" },
  { id: "real-world", index: "05", title: "Policy Iteration in the Real World" },
  { id: "sandbox", index: "06", title: "Try It Yourself" },
] as const;

/* ------------------------------------------------------------------ */
/*  Building blocks                                                    */
/* ------------------------------------------------------------------ */

function SectionHead({ id }: { id: (typeof CONTENTS)[number]["id"] }) {
  const entry = CONTENTS.find((c) => c.id === id)!;
  return (
    <div className="tl-section-head mb-6">
      <span className="tl-section-index">{entry.index}</span>
      <h2 className="tl-h2">{entry.title}</h2>
    </div>
  );
}

interface FlowStep {
  label: string;
  sub: string;
  color?: string;
  arrowH?: string;
  arrowV?: string;
}

function Flow({ steps }: { steps: FlowStep[] }) {
  return (
    <div className="tl-flow">
      {steps.map((step, i) => (
        <Fragment key={step.label}>
          {i > 0 && (
            <div className="tl-flow-arrow" aria-hidden="true">
              <span className="sm:hidden">{step.arrowV ?? "↓"}</span>
              <span className="hidden sm:inline">
                {step.arrowH ?? "→"}
              </span>
            </div>
          )}
          <div className="tl-flow-node">
            <span className="tl-flow-node-label">{step.label}</span>
            <span
              className="tl-flow-node-sub"
              style={step.color ? { color: step.color } : undefined}
            >
              {step.sub}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

function Mapping({
  system,
  rows,
}: {
  system: string;
  rows: [React.ReactNode, React.ReactNode][];
}) {
  return (
    <div className="tl-inset p-4">
      <table className="tl-map">
        <thead>
          <tr>
            <th scope="col">Grid World</th>
            <th className="tl-map-arrow" aria-hidden="true" />
            <th scope="col">{system}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row[0]}</td>
              <td className="tl-map-arrow" aria-hidden="true">
                &rarr;
              </td>
              <td>{row[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-[var(--tl-paper)]">
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-14 sm:py-20">
        {/* ---- Masthead article header ---- */}
        <header className="mb-16">
          <p className="tl-eyebrow mb-10">Reinforcement Learning</p>
          <h1 className="tl-display mb-6">Policy Iteration</h1>
          <p className="tl-deck mb-20">
            An interactive guide to how AI learns the best strategy
          </p>

          {/* Byline-style run parameters */}
          <dl className="tl-eyebrow mb-8 flex flex-wrap gap-x-5 gap-y-2">
            <div className="flex gap-1.5">
              <dt>World</dt>
              <dd className="text-[var(--tl-ink)]">2&times;2 grid</dd>
            </div>
            <span aria-hidden="true">&middot;</span>
            <div className="flex gap-1.5">
              <dt>Step cost</dt>
              <dd className="text-[var(--tl-ink)]">&minus;1</dd>
            </div>
            <span aria-hidden="true">&middot;</span>
            <div className="flex gap-1.5">
              <dt>Discount</dt>
              <dd className="text-[var(--tl-ink)]">0.9</dd>
            </div>
            <span aria-hidden="true">&middot;</span>
            <div className="flex gap-1.5">
              <dt>Converges in</dt>
              <dd className="text-[var(--tl-ink)]">2 rounds</dd>
            </div>
          </dl>

          <p className="tl-lede">
            How does an AI figure out the best way to do something? One of the
            oldest and most elegant answers is <strong>policy iteration</strong>
            : try a strategy, honestly evaluate how well it performs, make it a
            little better, and repeat. Same loop you&apos;d use to improve a
            recipe. Cook it, taste it, adjust, cook again. Below, you&apos;ll
            step through a concrete example and watch it converge on the optimal
            answer.
          </p>

          {/* Contents */}
          <nav aria-label="Contents" className="mt-12">
            <p className="tl-label mb-3">Contents</p>
            <ol className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              {CONTENTS.map((c) => (
                <li key={c.id} className="flex gap-3 text-sm">
                  <span className="tl-section-index">{c.index}</span>
                  <a
                    className="text-[var(--tl-muted)] underline decoration-[var(--tl-line)] underline-offset-4 transition-colors hover:text-[var(--tl-ink)] hover:decoration-[var(--tl-ink)]"
                    href={`#${c.id}`}
                  >
                    {c.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {/* ---- 01 · The Big Idea ---- */}
        <section id="big-idea" className="mb-16 scroll-mt-8">
          <SectionHead id="big-idea" />

          <div className="space-y-10">
            {/* Plain-language MDP */}
            <div>
              <h3 className="tl-h3 mb-3">Decision-Making as a Game</h3>
              <p className="tl-body mb-3">
                Imagine you&apos;re navigating a city you&apos;ve never visited.
                At every intersection you have to choose: go left, right,
                straight, or turn around. Some choices bring you closer to your
                hotel, others take you in circles. Every wrong turn wastes time
                (a small penalty), and arriving at the hotel is the reward.
              </p>
              <p className="tl-body mb-3">
                In AI, this setup has a name: a{" "}
                <strong>Markov Decision Process</strong>. The intersections are{" "}
                <strong>states</strong>, your turns are <strong>actions</strong>
                , the wasted time is a negative <strong>reward</strong>, and
                your plan for which way to turn at each intersection is your{" "}
                <strong>policy</strong>. The goal: find the policy that gets you
                to the hotel with the least total cost.
              </p>
              <p className="tl-body">
                There&apos;s one more ingredient: a{" "}
                <strong>discount factor</strong>. It captures the common-sense
                idea that a reward right now is worth more than the same reward
                far in the future. A discount of 0.9 means that a reward two
                steps away is only worth 81% of a reward right now (0.9 &times;
                0.9 = 0.81).
              </p>
            </div>

            {/* Plain-language Policy Iteration */}
            <div>
              <h3 className="tl-h3 mb-3">The Evaluate-Improve Loop</h3>
              <p className="tl-body mb-6">
                Policy iteration solves this problem in two alternating phases,
                repeated until nothing changes:
              </p>

              <div className="space-y-6 mb-6">
                <div className="tl-callout tl-callout-eval">
                  <p
                    className="tl-callout-index mb-1.5"
                    style={{ color: "var(--tl-good)" }}
                  >
                    Phase 01 &middot; Evaluate
                  </p>
                  <p className="tl-h4 mb-1.5">Evaluate the current strategy</p>
                  <p className="tl-body">
                    &ldquo;If I follow this plan forever, how much total cost
                    will I rack up from each starting point?&rdquo; This gives
                    every room a score — a single number capturing how good or
                    bad it is to be there.
                  </p>
                </div>

                <div className="tl-callout tl-callout-improve">
                  <p
                    className="tl-callout-index mb-1.5"
                    style={{ color: "var(--tl-mid)" }}
                  >
                    Phase 02 &middot; Improve
                  </p>
                  <p className="tl-h4 mb-1.5">Look for better options</p>
                  <p className="tl-body">
                    At each room, try every possible direction and ask:
                    &ldquo;Would going this way lead somewhere better?&rdquo; If
                    yes, switch to that direction.
                  </p>
                </div>
              </div>

              <p className="tl-body mb-6">
                When the improvement step finds nothing to change, the strategy
                is the best it can possibly be.
              </p>

              {/* Evaluate ↔ Improve loop diagram */}
              <Flow
                steps={[
                  {
                    label: "Evaluate",
                    sub: "Score each state",
                    color: "var(--tl-good)",
                  },
                  {
                    label: "Improve",
                    sub: "Pick better actions",
                    color: "var(--tl-mid)",
                    arrowH: "⇄",
                    arrowV: "⇅",
                  },
                  {
                    label: "Done?",
                    sub: "Nothing changed",
                    color: "var(--tl-ink)",
                  },
                ]}
              />
            </div>
          </div>
        </section>

        {/* ---- 02 · Problem Setup ---- */}
        <section id="grid-world" className="mb-16 scroll-mt-8">
          <SectionHead id="grid-world" />

          <p className="tl-body mb-3">
            To see policy iteration in action, we&apos;ll use the simplest
            possible world: a 2&times;2 grid. Think of it as four rooms. The
            bottom-right room (<strong>G</strong>) is the goal, like finding
            your hotel. The other three rooms (A, B, C) are just places you
            might be.
          </p>
          <p className="tl-body mb-8">
            The rules are simple: you can move Up, Down, Left, or Right. If you
            try to walk through a wall, you stay put (but still pay the
            penalty). Every move costs &minus;1 point, except stepping into the
            goal which is free. The discount factor is 0.9. One thing to watch
            for: if a state&apos;s policy points it into a wall or a loop so it
            never reaches the goal, the penalties pile up forever and its value
            drops to about <strong>&minus;10</strong> (the worst possible score
            in this grid).
          </p>

          {/* Static grid */}
          <figure className="m-0">
            <div className="flex justify-center">
              <div className="grid grid-cols-2 gap-px bg-[var(--tl-line)] border border-[var(--tl-line)] w-[200px]">
                {[
                  { label: "A", sub: "start" },
                  { label: "B", sub: "" },
                  { label: "C", sub: "" },
                  { label: "G", sub: "goal" },
                ].map((cell) => (
                  <div
                    key={cell.label}
                    className="relative aspect-square flex flex-col items-center justify-center"
                    style={{
                      backgroundColor:
                        cell.label === "G"
                          ? "var(--cell-green)"
                          : "var(--tl-paper)",
                    }}
                  >
                    {cell.label === "G" && (
                      <span
                        className="absolute top-1 right-1.5 text-xs"
                        style={{ color: "var(--tl-good)" }}
                        aria-hidden="true"
                      >
                        &#9733;
                      </span>
                    )}
                    <span className="tl-mono text-lg font-semibold">
                      {cell.label}
                    </span>
                    {cell.sub && (
                      <span className="tl-label mt-1.5">{cell.sub}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <figcaption className="tl-note mx-auto mt-4 max-w-md text-center">
              4 actions (Up, Down, Left, Right) &middot; Walls = bounce back
              &middot; Each move costs &minus;1 &middot; Goal is free &middot;
              Discount = 0.9
            </figcaption>
          </figure>
        </section>

        {/* ---- 03 · Interactive Visualization ---- */}
        <section id="walkthrough" className="mb-16 scroll-mt-8">
          <SectionHead id="walkthrough" />
          <p className="tl-body mb-6">
            Step through the algorithm below. The grid shows each cell&apos;s
            score (how bad it is to be there) and an arrow for the current
            action. Use the buttons to navigate, or hit Play to auto-advance.
            <span className="hidden sm:inline">
              {" "}
              Click the panel first and the <kbd>&larr;</kbd> <kbd>&rarr;</kbd>{" "}
              keys will step it too.
            </span>
          </p>
          <InteractiveViewer />
        </section>

        {/* ---- 04 · Key Takeaways ---- */}
        <section id="takeaways" className="mb-16 scroll-mt-8">
          <SectionHead id="takeaways" />

          <ol className="border-t border-[var(--tl-line-soft)]">
            {[
              {
                title: "It converges fast",
                body: (
                  <>
                    Even starting from a terrible strategy (every action bumps
                    into a wall), the algorithm found the optimal answer in just
                    two rounds. This isn&apos;t a fluke. Policy iteration
                    typically converges in very few iterations, even on much
                    larger problems.
                  </>
                ),
              },
              {
                title: "Improvement is guaranteed",
                body: (
                  <>
                    Each round of improvement is mathematically guaranteed to
                    produce a strategy at least as good as the one before. Since
                    there are only so many possible strategies, the algorithm
                    must eventually land on the best one. You can&apos;t get
                    worse — only better or the same.
                  </>
                ),
              },
              {
                title: "Policy iteration vs. value iteration",
                body: (
                  <>
                    There&apos;s a sibling algorithm called{" "}
                    <em>value iteration</em> that skips the full evaluation step
                    and instead makes small updates to the scores in every pass.
                    It&apos;s simpler to implement but usually needs more passes
                    to finish. Policy iteration needs fewer rounds but each
                    round is more work. In practice, the choice depends on the
                    problem.
                  </>
                ),
              },
            ].map((item, i) => (
              <li
                key={item.title}
                className="flex gap-4 border-b border-[var(--tl-line-soft)] py-5"
              >
                <span className="tl-section-index pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="tl-h4 mb-1.5">{item.title}</h3>
                  <p className="tl-body">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ---- 05 · Policy Iteration in the Real World ---- */}
        <section id="real-world" className="mb-16 scroll-mt-8">
          <SectionHead id="real-world" />

          <p className="tl-body mb-10">
            Our grid had 4 rooms. Real problems have millions or billions of
            possible situations. But the algorithm is the same: score your
            current strategy, look for improvements, repeat. Here are three
            systems that use this exact loop at massive scale.
          </p>

          <div className="space-y-12">
            {/* ---- Example 1: RLHF ---- */}
            <article className="border-t border-[var(--tl-line)] pt-6">
              <p className="mb-4">
                <span className="tl-tag" style={{ color: "var(--tl-muted)" }}>
                  Language Models
                </span>
              </p>
              <h3 className="tl-h3 mb-4">
                How ChatGPT &amp; Claude Learn to Write Better
              </h3>
              <p className="tl-body mb-3">
                Language models start by learning patterns from text on the
                internet, but they need refinement to be genuinely helpful. The
                method is called{" "}
                <strong>Reinforcement Learning from Human Feedback</strong>{" "}
                (RLHF) — and it&apos;s the evaluate-improve loop in disguise.
              </p>
              <p className="tl-body mb-6">
                The model generates responses to thousands of prompts. Human
                raters read pairs of responses and pick the better one —
                that&apos;s <strong>evaluation</strong>. Then the model is
                updated to produce more responses like the preferred ones —
                that&apos;s <strong>improvement</strong>. One common algorithm
                for this update is <strong>PPO</strong> (Proximal Policy
                Optimization), which makes small, careful changes to avoid
                breaking what already works — like adjusting a recipe one
                ingredient at a time. The cycle repeats until the model&apos;s
                responses consistently score well.
              </p>

              <div className="mb-6">
                <Flow
                  steps={[
                    {
                      label: "Generate responses",
                      sub: "Policy in action",
                      color: "var(--tl-ink)",
                    },
                    {
                      label: "Humans rate them",
                      sub: "Evaluate",
                      color: "var(--tl-good)",
                    },
                    {
                      label: "Update model",
                      sub: "Improve",
                      color: "var(--tl-mid)",
                    },
                    { label: "Repeat", sub: "Until stable" },
                  ]}
                />
              </div>

              <Mapping
                system="Language Model"
                rows={[
                  ["Rooms (A, B, C)", "Possible conversations"],
                  ["Which direction to go", "Which word to write next"],
                  [<>&minus;1 per extra move</>, "Human preference score"],
                  ["Direction for each room", "How the model generates text"],
                  ["Score for each room", "Predicted response quality"],
                ]}
              />
            </article>

            {/* ---- Example 2: AlphaGo ---- */}
            <article className="border-t border-[var(--tl-line)] pt-6">
              <p className="mb-4">
                <span className="tl-tag" style={{ color: "var(--tl-muted)" }}>
                  Games
                </span>
              </p>
              <h3 className="tl-h3 mb-4">
                How AlphaGo Mastered the World&apos;s Hardest Board Game
              </h3>
              <p className="tl-body mb-3">
                In 2016, DeepMind&apos;s AlphaGo defeated the world champion at
                Go — a game with more possible board positions than atoms in the
                observable universe. Brute-force search was impossible. Instead,
                AlphaGo used policy iteration.
              </p>
              <p className="tl-body mb-3">
                It trained two neural networks: a <strong>policy network</strong>{" "}
                (which move to play) and a <strong>value network</strong> (how
                good is this board position — just like our V-values). It played
                millions of games against itself. After each batch of games, it
                evaluated positions with the value network, improved the policy
                network based on which moves led to wins, and repeated.
              </p>
              <p className="tl-body mb-6">
                The same loop that found the optimal path through a 2&times;2
                grid found superhuman Go strategy. The only difference is scale.
              </p>

              <div className="mb-6">
                <Flow
                  steps={[
                    {
                      label: "Evaluate position",
                      sub: "Value network",
                      color: "var(--tl-good)",
                    },
                    {
                      label: "Select best move",
                      sub: "Policy network",
                      color: "var(--tl-mid)",
                    },
                    {
                      label: "Play game",
                      sub: "Self-play",
                      color: "var(--tl-ink)",
                    },
                    { label: "Update networks", sub: "Improve" },
                  ]}
                />
              </div>

              <Mapping
                system="Go"
                rows={[
                  [
                    "Rooms (A, B, C)",
                    <>
                      Board positions (10<sup>170</sup> possibilities)
                    </>,
                  ],
                  [
                    "Which direction to go",
                    "Where to place a stone (361 intersections)",
                  ],
                  [
                    <>&minus;1 per extra move</>,
                    <>Win (+1) or loss (&minus;1)</>,
                  ],
                  ["Direction for each room", "Neural network that picks moves"],
                  [
                    "Score for each room",
                    "Neural network that judges positions",
                  ],
                ]}
              />
            </article>

            {/* ---- Example 3: Self-Driving Cars ---- */}
            <article className="border-t border-[var(--tl-line)] pt-6">
              <p className="mb-4">
                <span className="tl-tag" style={{ color: "var(--tl-muted)" }}>
                  Transportation
                </span>
              </p>
              <h3 className="tl-h3 mb-4">
                How Self-Driving Cars Learn to Navigate
              </h3>
              <p className="tl-body mb-3">
                A self-driving car faces a continuous stream of decisions:
                brake, accelerate, change lanes, yield to a pedestrian.
                Companies like Waymo train driving policies in simulation before
                deploying them to real roads.
              </p>
              <p className="tl-body mb-6">
                The car&apos;s sensors read the road (the <strong>state</strong>
                ). The policy decides what to do (the <strong>action</strong>).
                A simulator scores the outcome — was the ride safe? efficient?
                comfortable? (the <strong>reward</strong>). The policy is
                updated based on millions of simulated drives, improving its
                decision-making for every scenario it might encounter. This is
                policy iteration at industrial scale.
              </p>

              <div className="mb-6">
                <Flow
                  steps={[
                    {
                      label: "Read sensors",
                      sub: "State",
                      color: "var(--tl-ink)",
                    },
                    {
                      label: "Decide action",
                      sub: "Policy",
                      color: "var(--tl-ink)",
                    },
                    {
                      label: "Simulate drive",
                      sub: "Evaluate",
                      color: "var(--tl-good)",
                    },
                    {
                      label: "Score & update",
                      sub: "Improve",
                      color: "var(--tl-mid)",
                    },
                  ]}
                />
              </div>

              <Mapping
                system="Self-Driving Car"
                rows={[
                  ["Rooms (A, B, C)", "Sensor readings (cameras, lidar, radar)"],
                  ["Which direction to go", "Steering, braking, acceleration"],
                  [
                    <>&minus;1 per extra move</>,
                    "Safety, efficiency, comfort scores",
                  ],
                  [
                    "Direction for each room",
                    "Driving decisions for each road situation",
                  ],
                  [
                    "Score for each room",
                    "Predicted safety of each road situation",
                  ],
                ]}
              />
            </article>
          </div>

          {/* Closing insight */}
          <p className="tl-body mt-12 border-l-2 border-[var(--tl-ink)] pl-4">
            The deepest lesson isn&apos;t the math — it&apos;s the structure.{" "}
            <em>
              Evaluate honestly, improve incrementally, repeat until stable.
            </em>{" "}
            This pattern shows up wherever complex decisions need to be
            optimized, from training AI systems to how companies run A/B tests,
            athletes review game film, and scientists refine hypotheses.
          </p>
        </section>

        {/* ---- 06 · Try It Yourself ---- */}
        <section id="sandbox" className="scroll-mt-8">
          <SectionHead id="sandbox" />
          <p className="tl-body mb-6">
            Now try a bigger challenge. Below is a 4&times;4 grid with 15 states
            and a goal in the bottom-right corner. Click a cell to select it,
            then click again (or use the arrow keys) to cycle its direction.
          </p>
          <p className="tl-body mb-6">
            Then run the algorithm on whatever policy you wrote.{" "}
            <strong>Evaluate only</strong> scores it without changing anything.{" "}
            <strong>Improve once</strong> runs a single greedy sweep, switching
            each state to its best-looking action — the changed cells are
            outlined. <strong>Run policy iteration</strong> alternates the two
            until nothing changes, which is the entire algorithm. However bad
            your starting policy, it lands on the optimal one in a handful of
            rounds.
          </p>
          <PolicySandbox />
        </section>
      </main>

      {/* ---- Footer ---- */}
      <footer className="border-t border-[var(--tl-line)]">
        <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="tl-label">
            An interactive introduction to reinforcement learning
          </p>
          <p className="tl-label">Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}
