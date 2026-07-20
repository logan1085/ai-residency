import InteractiveViewer from "@/components/interactive-viewer";
import PolicySandbox from "@/components/policy-sandbox";

export default function Home() {
  return (
    <div
      className="flex flex-col flex-1"
      style={{ backgroundColor: "var(--background)" }}
    >
      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 sm:py-24">
        {/* ---- Hero ---- */}
        <header className="mb-16 text-center">
          <h1
            className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-4"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Policy Iteration
          </h1>
          <p
            className="text-lg italic mb-3"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--font-serif), serif",
            }}
          >
            An Interactive Walkthrough of Dynamic Programming in Reinforcement
            Learning
          </p>
          <p
            className="text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            How does an AI figure out the best way to do something? One of the
            oldest and most elegant answers is{" "}
            <strong>policy iteration</strong>: try a strategy, honestly evaluate
            how well it performs, make it a little better, and repeat. Same loop
            you&apos;d use to improve a recipe. Cook it, taste it, adjust, cook
            again. Below, you&apos;ll step through a concrete example and watch
            it converge on the optimal answer.
          </p>
        </header>

        {/* ---- The Big Idea ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            The Big Idea
          </h2>

          <div className="space-y-8">
            {/* Plain-language MDP */}
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Decision-Making as a Game
              </h3>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Imagine you&apos;re navigating a city you&apos;ve never visited.
                At every intersection you have to choose: go left, right,
                straight, or turn around. Some choices bring you closer to your
                hotel, others take you in circles. Every wrong turn wastes time
                (a small penalty), and arriving at the hotel is the reward.
              </p>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                In AI, this setup has a name: a{" "}
                <strong>Markov Decision Process</strong>. The
                intersections are <strong>states</strong>, your turns are{" "}
                <strong>actions</strong>, the wasted time is a negative{" "}
                <strong>reward</strong>, and your plan for which way to turn at
                each intersection is your <strong>policy</strong>. The goal:
                find the policy that gets you to the hotel with the least total
                cost.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                There&apos;s one more ingredient: a{" "}
                <strong>discount factor</strong> (&gamma;). It captures the
                common-sense idea that a reward right now is worth more than the
                same reward far in the future. A discount of 0.9 means that a
                reward two steps away is only worth 81% of a reward right now
                (0.9 &times; 0.9 = 0.81).
              </p>
            </div>

            {/* Plain-language Policy Iteration */}
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                The Evaluate-Improve Loop
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Policy iteration solves this problem in two alternating phases,
                repeated until nothing changes:
              </p>

              <div className="space-y-3 mb-4">
                <div
                  className="rounded-lg border p-4 flex gap-3"
                  style={{
                    borderColor: "#8B5CF6",
                    backgroundColor: "rgba(139, 92, 246, 0.05)",
                  }}
                >
                  <span
                    className="text-lg font-bold mt-0.5"
                    style={{ color: "#8B5CF6" }}
                  >
                    1
                  </span>
                  <div>
                    <p className="text-sm font-semibold mb-1">
                      Evaluate the current strategy
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      &ldquo;If I follow this plan forever, how much total cost
                      will I rack up from each starting point?&rdquo; This
                      produces a &ldquo;score&rdquo; (called V) for every state.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-lg border p-4 flex gap-3"
                  style={{
                    borderColor: "#F59E0B",
                    backgroundColor: "rgba(245, 158, 11, 0.05)",
                  }}
                >
                  <span
                    className="text-lg font-bold mt-0.5"
                    style={{ color: "#F59E0B" }}
                  >
                    2
                  </span>
                  <div>
                    <p className="text-sm font-semibold mb-1">
                      Improve it greedily
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      At each state, look at all the options and ask: &ldquo;Is
                      there a different action that would lead to a
                      higher-scoring state?&rdquo; If yes, switch to that
                      action.
                    </p>
                  </div>
                </div>
              </div>

              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                When the improvement step changes nothing, the strategy is as
                good as it gets. That&apos;s the <strong>optimal policy</strong>.
              </p>

              {/* Evaluate ↔ Improve loop diagram */}
              <div
                className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 py-4 sm:py-6 rounded-lg"
                style={{ backgroundColor: "var(--equation-bg)" }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-lg border-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold"
                    style={{
                      borderColor: "#8B5CF6",
                      color: "#8B5CF6",
                      backgroundColor: "white",
                    }}
                  >
                    Evaluate
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Score each state
                  </span>
                </div>

                <div className="flex flex-col items-center gap-0.5 rotate-90 sm:rotate-0">
                  <span style={{ color: "var(--accent)" }}>&#8594;</span>
                  <span style={{ color: "var(--accent)" }}>&#8592;</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className="rounded-lg border-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold"
                    style={{
                      borderColor: "#F59E0B",
                      color: "#F59E0B",
                      backgroundColor: "white",
                    }}
                  >
                    Improve
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Pick better actions
                  </span>
                </div>

                <span className="rotate-90 sm:rotate-0" style={{ color: "var(--text-secondary)" }}>&#8594;</span>

                <div className="flex flex-col items-center">
                  <div
                    className="rounded-lg border-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold"
                    style={{
                      borderColor: "#10B981",
                      color: "#10B981",
                      backgroundColor: "white",
                    }}
                  >
                    Done?
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Nothing changed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Problem Setup ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            The Example: A Tiny Grid World
          </h2>
          <p
            className="text-sm leading-relaxed mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            To see policy iteration in action, we&apos;ll use the simplest
            possible world: a 2&times;2 grid. Think of it as four rooms. The
            bottom-right room (<strong>G</strong>) is the goal, like finding
            your hotel. The other three rooms (A, B, C) are just places you
            might be.
          </p>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            The rules are simple: you can move Up, Down, Left, or Right. If you
            try to walk through a wall, you stay put (but still pay the penalty).
            Every move costs &minus;1 point, except stepping into the goal which
            is free. The discount factor is 0.9. One thing to watch for: if a
            state&apos;s policy points it into a wall or a loop so it never reaches
            the goal, the penalties pile up forever and its value drops to
            about <strong>&minus;10</strong> (the worst possible score in this grid).
          </p>

          {/* Static grid */}
          <div className="flex justify-center mb-4">
            <div
              className="grid grid-cols-2 gap-2 p-4 rounded-lg border"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--card-bg)",
                width: "200px",
              }}
            >
              {[
                { label: "A", sub: "start" },
                { label: "B", sub: "" },
                { label: "C", sub: "" },
                { label: "G", sub: "goal ★" },
              ].map((cell) => (
                <div
                  key={cell.label}
                  className="aspect-square rounded-md flex flex-col items-center justify-center text-sm font-semibold"
                  style={{
                    backgroundColor:
                      cell.label === "G"
                        ? "var(--cell-green)"
                        : "var(--cell-unknown)",
                    border: "1px solid var(--card-border)",
                  }}
                >
                  <span>{cell.label}</span>
                  {cell.sub && (
                    <span
                      className="text-[10px] font-normal"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {cell.sub}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className="text-xs text-center"
            style={{ color: "var(--text-secondary)" }}
          >
            4 actions (Up, Down, Left, Right) &middot; Walls = bounce back
            &middot; Each move costs &minus;1 &middot; Goal is free &middot;
            Discount = 0.9
          </div>
        </section>

        {/* ---- Interactive Visualization ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Interactive Walkthrough
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Step through the algorithm below. The grid shows each cell&apos;s
            score (how bad it is to be there) and an arrow for the current
            action. Use the buttons to navigate, or hit Play to auto-advance.
            <span className="hidden sm:inline">
              {" "}You can also use{" "}
              <kbd
                className="px-1.5 py-0.5 rounded text-xs border"
                style={{
                  borderColor: "var(--card-border)",
                  backgroundColor: "var(--equation-bg)",
                }}
              >
                &larr;
              </kbd>{" "}
              <kbd
                className="px-1.5 py-0.5 rounded text-xs border"
                style={{
                  borderColor: "var(--card-border)",
                  backgroundColor: "var(--equation-bg)",
                }}
              >
                &rarr;
              </kbd>{" "}
              keys.
            </span>
          </p>
          <InteractiveViewer />
        </section>

        {/* ---- Key Takeaways ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Key Takeaways
          </h2>

          <div className="space-y-4">
            <div
              className="rounded-lg border p-4"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <h4 className="text-sm font-semibold mb-1">
                It converges fast
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Even starting from a terrible strategy (every action bumps into
                a wall), the algorithm found the optimal answer in just two
                rounds. This isn&apos;t a fluke. Policy iteration typically
                converges in very few iterations, even on much larger problems.
              </p>
            </div>

            <div
              className="rounded-lg border p-4"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <h4 className="text-sm font-semibold mb-1">
                Improvement is guaranteed
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Each round of improvement is mathematically guaranteed to
                produce a strategy at least as good as the one before. Since
                there are only so many possible strategies, the algorithm must
                eventually land on the best one. You can&apos;t get worse —
                only better or the same.
              </p>
            </div>

            <div
              className="rounded-lg border p-4"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <h4 className="text-sm font-semibold mb-1">
                Policy iteration vs. value iteration
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                There&apos;s a sibling algorithm called <em>value iteration</em>{" "}
                that skips the full evaluation step and instead makes small
                updates to the scores in every pass. It&apos;s simpler to
                implement but usually needs more passes to finish. Policy
                iteration needs fewer rounds but each round is more work. In
                practice, the choice depends on the problem.
              </p>
            </div>
          </div>
        </section>

        {/* ---- Policy Iteration in the Real World ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Policy Iteration in the Real World
          </h2>
          <p
            className="text-sm leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Our grid had 4 states. Real problems have millions or billions. But
            the algorithm is the same: evaluate your current strategy, improve
            it, repeat. Here are three systems that use this exact loop at
            massive scale.
          </p>

          <div className="space-y-8">
            {/* ---- Example 1: RLHF ---- */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(139, 92, 246, 0.1)",
                      color: "#8B5CF6",
                    }}
                  >
                    Language Models
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  How ChatGPT &amp; Claude Learn to Write Better
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Language models start by learning patterns from text on the
                  internet, but they need refinement to be genuinely helpful. The
                  method is called{" "}
                  <strong>
                    Reinforcement Learning from Human Feedback
                  </strong>{" "}
                  (RLHF) — and it&apos;s the evaluate-improve loop in disguise.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  The model generates responses to thousands of prompts. Human
                  raters read pairs of responses and pick the better one —
                  that&apos;s <strong>evaluation</strong>. Then the model is
                  updated to produce more responses like the preferred ones —
                  that&apos;s <strong>improvement</strong>. One common algorithm
                  for this update is{" "}
                  <strong>PPO</strong> (Proximal Policy Optimization), which
                  makes small, careful changes to avoid breaking what already
                  works — like adjusting a recipe one ingredient at a time. The
                  cycle repeats until the model&apos;s responses consistently
                  score well.
                </p>

                {/* Flow diagram */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 px-3 rounded-lg"
                  style={{ backgroundColor: "var(--equation-bg)" }}
                >
                  {[
                    {
                      label: "Generate responses",
                      sub: "Policy in action",
                      color: "#8B5CF6",
                    },
                    {
                      label: "Humans rate them",
                      sub: "Evaluate",
                      color: "#F59E0B",
                    },
                    {
                      label: "Update model",
                      sub: "Improve",
                      color: "#10B981",
                    },
                    {
                      label: "Repeat",
                      sub: "Until stable",
                      color: "var(--text-secondary)",
                    },
                  ].map((step, i) => (
                    <div key={i} className="contents">
                      {i > 0 && (
                        <span
                          className="shrink-0 rotate-90 sm:rotate-0"
                          style={{ color: "var(--accent)" }}
                        >
                          &#8594;
                        </span>
                      )}
                      <div className="flex flex-col items-center">
                        <div
                          className="rounded-lg border-2 px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
                          style={{
                            borderColor: step.color,
                            color: step.color,
                            backgroundColor: "white",
                          }}
                        >
                          {step.label}
                        </div>
                        <span
                          className="text-[10px] mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {step.sub}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Concept mapping */}
                <div
                  className="rounded-lg border p-4"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--equation-bg)",
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Mapping to our grid
                  </p>
                  <div
                    className="grid gap-y-1.5 text-xs leading-relaxed"
                    style={{
                      gridTemplateColumns: "1fr auto 1fr",
                      columnGap: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span className="font-semibold">Grid World</span>
                    <span />
                    <span className="font-semibold">Language Model</span>
                    <span>Grid cells (A, B, C)</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Possible conversations</span>
                    <span>Up / Down / Left / Right</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Which word to write next</span>
                    <span>&minus;1 per wrong step</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Human preference score</span>
                    <span>Direction at each cell</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>How the model generates text</span>
                    <span>V-values per state</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Predicted response quality</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Example 2: AlphaGo ---- */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      color: "#10B981",
                    }}
                  >
                    Games
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  How AlphaGo Mastered the World&apos;s Hardest Board Game
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  In 2016, DeepMind&apos;s AlphaGo defeated the world champion
                  at Go — a game with more possible board positions than atoms in
                  the observable universe. Brute-force search was impossible.
                  Instead, AlphaGo used policy iteration.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  It trained two neural networks: a{" "}
                  <strong>policy network</strong> (which move to play) and a{" "}
                  <strong>value network</strong> (how good is this board
                  position — just like our V-values). It played millions of games
                  against itself. After each batch of games, it evaluated
                  positions with the value network, improved the policy network
                  based on which moves led to wins, and repeated.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  The same loop that found the optimal path through a 2&times;2
                  grid found superhuman Go strategy. The only difference is
                  scale.
                </p>

                {/* Flow diagram */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 px-3 rounded-lg"
                  style={{ backgroundColor: "var(--equation-bg)" }}
                >
                  {[
                    {
                      label: "Evaluate position",
                      sub: "Value network",
                      color: "#8B5CF6",
                    },
                    {
                      label: "Select best move",
                      sub: "Policy network",
                      color: "#F59E0B",
                    },
                    {
                      label: "Play game",
                      sub: "Self-play",
                      color: "#10B981",
                    },
                    {
                      label: "Update networks",
                      sub: "Improve",
                      color: "var(--text-secondary)",
                    },
                  ].map((step, i) => (
                    <div key={i} className="contents">
                      {i > 0 && (
                        <span
                          className="shrink-0 rotate-90 sm:rotate-0"
                          style={{ color: "var(--accent)" }}
                        >
                          &#8594;
                        </span>
                      )}
                      <div className="flex flex-col items-center">
                        <div
                          className="rounded-lg border-2 px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
                          style={{
                            borderColor: step.color,
                            color: step.color,
                            backgroundColor: "white",
                          }}
                        >
                          {step.label}
                        </div>
                        <span
                          className="text-[10px] mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {step.sub}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Concept mapping */}
                <div
                  className="rounded-lg border p-4"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--equation-bg)",
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Mapping to our grid
                  </p>
                  <div
                    className="grid gap-y-1.5 text-xs leading-relaxed"
                    style={{
                      gridTemplateColumns: "1fr auto 1fr",
                      columnGap: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span className="font-semibold">Grid World</span>
                    <span />
                    <span className="font-semibold">Go</span>
                    <span>Grid cells (A, B, C)</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>
                      Board positions (10<sup>170</sup> possibilities)
                    </span>
                    <span>Up / Down / Left / Right</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Where to place a stone (361 intersections)</span>
                    <span>&minus;1 per wrong step</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Win (+1) or loss (&minus;1)</span>
                    <span>Direction at each cell</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Move-selection neural network</span>
                    <span>V-values per state</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Position-evaluation neural network</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---- Example 3: Self-Driving Cars ---- */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      color: "#F59E0B",
                    }}
                  >
                    Transportation
                  </span>
                </div>
                <h3
                  className="text-lg font-semibold"
                  style={{ fontFamily: "var(--font-serif), serif" }}
                >
                  How Self-Driving Cars Learn to Navigate
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  A self-driving car faces a continuous stream of decisions:
                  brake, accelerate, change lanes, yield to a pedestrian.
                  Companies like Waymo train driving policies in simulation
                  before deploying them to real roads.
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  The car&apos;s sensors read the road (the{" "}
                  <strong>state</strong>). The policy decides what to do (the{" "}
                  <strong>action</strong>). A simulator scores the outcome — was
                  the ride safe? efficient? comfortable? (the{" "}
                  <strong>reward</strong>). The policy is updated based on
                  millions of simulated drives, improving its decision-making for
                  every scenario it might encounter. This is policy iteration at
                  industrial scale.
                </p>

                {/* Flow diagram */}
                <div
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-4 sm:py-5 px-3 rounded-lg"
                  style={{ backgroundColor: "var(--equation-bg)" }}
                >
                  {[
                    {
                      label: "Read sensors",
                      sub: "State",
                      color: "#8B5CF6",
                    },
                    {
                      label: "Decide action",
                      sub: "Policy",
                      color: "#F59E0B",
                    },
                    {
                      label: "Simulate drive",
                      sub: "Evaluate",
                      color: "#10B981",
                    },
                    {
                      label: "Score & update",
                      sub: "Improve",
                      color: "var(--text-secondary)",
                    },
                  ].map((step, i) => (
                    <div key={i} className="contents">
                      {i > 0 && (
                        <span
                          className="shrink-0 rotate-90 sm:rotate-0"
                          style={{ color: "var(--accent)" }}
                        >
                          &#8594;
                        </span>
                      )}
                      <div className="flex flex-col items-center">
                        <div
                          className="rounded-lg border-2 px-3 py-1.5 text-xs font-semibold whitespace-nowrap"
                          style={{
                            borderColor: step.color,
                            color: step.color,
                            backgroundColor: "white",
                          }}
                        >
                          {step.label}
                        </div>
                        <span
                          className="text-[10px] mt-1"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {step.sub}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Concept mapping */}
                <div
                  className="rounded-lg border p-4"
                  style={{
                    borderColor: "var(--card-border)",
                    backgroundColor: "var(--equation-bg)",
                  }}
                >
                  <p
                    className="text-[10px] font-semibold uppercase tracking-wider mb-2.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Mapping to our grid
                  </p>
                  <div
                    className="grid gap-y-1.5 text-xs leading-relaxed"
                    style={{
                      gridTemplateColumns: "1fr auto 1fr",
                      columnGap: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span className="font-semibold">Grid World</span>
                    <span />
                    <span className="font-semibold">Self-Driving Car</span>
                    <span>Grid cells (A, B, C)</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Sensor readings (cameras, lidar, radar)</span>
                    <span>Up / Down / Left / Right</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Steering, braking, acceleration</span>
                    <span>&minus;1 per wrong step</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Safety, efficiency, comfort scores</span>
                    <span>Direction at each cell</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Driving decisions for each road situation</span>
                    <span>V-values per state</span>
                    <span style={{ color: "var(--accent)" }}>&rarr;</span>
                    <span>Predicted safety of each road situation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Closing insight */}
          <p
            className="text-sm leading-relaxed mt-8"
            style={{ color: "var(--text-secondary)" }}
          >
            The deepest lesson isn&apos;t the math — it&apos;s the structure.{" "}
            <em>Evaluate honestly, improve incrementally, repeat until
            stable.</em> This pattern shows up wherever complex decisions need
            to be optimized, from training AI systems to how companies run A/B
            tests, athletes review game film, and scientists refine hypotheses.
          </p>
        </section>

        {/* ---- Try It Yourself ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Try It Yourself
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Now try a bigger challenge. Below is a 4&times;4 grid with 15
            states and a goal in the bottom-right corner. Click any cell to
            select it, choose a direction, and see how the values converge
            when you test your policy.
          </p>
          <PolicySandbox />
        </section>
      </main>

      {/* ---- Footer ---- */}
      <footer
        className="border-t py-6"
        style={{ borderColor: "var(--card-border)" }}
      >
        <div className="max-w-3xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            An interactive introduction to reinforcement learning
          </p>
          <p
            className="text-xs flex items-center gap-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Built with
            <span
              className="inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-medium"
              style={{
                borderColor: "var(--card-border)",
                backgroundColor: "var(--card-bg)",
              }}
            >
              &#9650; Next.js
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}

