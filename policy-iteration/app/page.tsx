import InteractiveViewer from "@/components/interactive-viewer";

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
            className="text-sm mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            Based on the example by George A. Lentzas
          </p>
          <p
            className="text-base leading-relaxed max-w-xl mx-auto"
            style={{ color: "var(--foreground)" }}
          >
            Policy iteration is one of the foundational algorithms in
            reinforcement learning. It finds the optimal way to act in an
            environment by alternating between two phases: evaluating how good
            the current strategy is, then improving it. Below, we&apos;ll walk
            through a concrete example step by step — with an interactive
            visualization you can control.
          </p>
        </header>

        {/* ---- Background ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Background
          </h2>

          <div className="space-y-8">
            {/* MDP */}
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                What is an MDP?
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                A <strong>Markov Decision Process</strong> (MDP) is the
                mathematical framework for sequential decision-making. It
                consists of a set of <em>states</em> the agent can be in, a set
                of <em>actions</em> available in each state, a{" "}
                <em>transition function</em> that determines where actions lead,
                a <em>reward signal</em> that scores each transition, and a{" "}
                <em>discount factor</em> &gamma; &isin; [0,&thinsp;1) that
                balances immediate vs. future rewards. The goal is to find a{" "}
                <em>policy</em> &pi; — a mapping from states to actions — that
                maximises the total discounted reward.
              </p>
            </div>

            {/* Policy Iteration */}
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                What is Policy Iteration?
              </h3>
              <p
                className="text-sm leading-relaxed mb-4"
                style={{ color: "var(--text-secondary)" }}
              >
                Policy iteration is a two-phase loop. First,{" "}
                <strong>policy evaluation</strong>: given the current policy,
                compute the value V(s) of every state — how much total
                discounted reward the agent expects when following the policy
                from that state. Second,{" "}
                <strong>policy improvement</strong>: for each state, check
                whether a different action would yield a higher value. If so,
                switch to it. Repeat until no improvement is possible — at that
                point, the policy is optimal.
              </p>

              {/* Evaluate ↔ Improve loop diagram */}
              <div
                className="flex items-center justify-center gap-4 py-6 rounded-lg"
                style={{ backgroundColor: "var(--equation-bg)" }}
              >
                <div className="flex flex-col items-center">
                  <div
                    className="rounded-lg border-2 px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor: "#8B5CF6",
                      color: "#8B5CF6",
                      backgroundColor: "white",
                    }}
                  >
                    Evaluate &pi;
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Compute V(s)
                  </span>
                </div>

                <div className="flex flex-col items-center gap-0.5">
                  <span style={{ color: "var(--accent)" }}>&#8594;</span>
                  <span style={{ color: "var(--accent)" }}>&#8592;</span>
                </div>

                <div className="flex flex-col items-center">
                  <div
                    className="rounded-lg border-2 px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor: "#F59E0B",
                      color: "#F59E0B",
                      backgroundColor: "white",
                    }}
                  >
                    Improve &pi;
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Greedy update
                  </span>
                </div>

                <span style={{ color: "var(--text-secondary)" }}>&#8594;</span>

                <div className="flex flex-col items-center">
                  <div
                    className="rounded-lg border-2 px-4 py-2 text-sm font-semibold"
                    style={{
                      borderColor: "#10B981",
                      color: "#10B981",
                      backgroundColor: "white",
                    }}
                  >
                    Converged?
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    &pi; stable &rarr; done
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
            Problem Setup
          </h2>
          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Consider a simple 2&times;2 grid world. The agent starts in one of
            three non-goal states and must reach the goal <strong>G</strong> in
            the bottom-right corner. Each move costs &minus;1 reward (entering
            the goal costs 0). Bumping into a wall keeps the agent in place but
            still costs &minus;1. The discount factor is &gamma;&nbsp;=&nbsp;0.9.
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
            4 actions (Up, Down, Left, Right) &middot; Wall-bump = stay in place
            &middot; Reward = &minus;1 per move &middot; &gamma; = 0.9
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
            Use the controls below to step through the policy iteration
            algorithm. Watch the grid update as values are computed and the
            policy improves. You can also use the{" "}
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
            arrow keys to navigate.
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
                Convergence in 2 iterations
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Even starting from a terrible policy (every action bumps into a
                wall), policy iteration found the optimum in just two rounds of
                evaluate-then-improve. This rapid convergence is typical — policy
                iteration usually needs very few iterations even on larger
                problems.
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
                Guaranteed improvement
              </h4>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                The <em>policy improvement theorem</em> guarantees that each
                greedy update produces a policy that is at least as good as the
                previous one. Since the number of deterministic policies is
                finite, the algorithm must converge to the optimal policy
                &pi;*.
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
                Value iteration updates values and implicitly improves the
                policy in a single sweep, but may need many sweeps to converge.
                Policy iteration does exact evaluation (which can be expensive
                for large state spaces) but typically needs far fewer outer
                iterations. In practice, the choice depends on the problem size
                and structure.
              </p>
            </div>
          </div>
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
            Example based on work by George A. Lentzas
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
