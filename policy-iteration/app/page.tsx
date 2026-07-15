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
                Computer scientists formalize this as a{" "}
                <strong>Markov Decision Process</strong> (MDP). The
                intersections are <em>states</em>, the turns are{" "}
                <em>actions</em>, the wasted time is a negative{" "}
                <em>reward</em>, and your overall plan for which way to turn at
                each intersection is called a <em>policy</em>. The goal is to
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
                    Evaluate
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Score each state
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
                    Improve
                  </div>
                  <span
                    className="text-xs mt-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Pick better actions
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
            Step through the algorithm below. The left panel shows the grid: the
            number in each cell is its score (how bad it is to be there), and
            the arrow is the current action. The right panel explains what&apos;s
            happening at each step. Use the{" "}
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
            keys or the buttons to navigate, or hit Play to watch it auto-advance.
          </p>
          <InteractiveViewer />
        </section>

        {/* ---- Why This Matters for AI Today ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Why This Matters for AI Today
          </h2>

          <p
            className="text-sm leading-relaxed mb-4"
            style={{ color: "var(--text-secondary)" }}
          >
            Policy iteration was published in the 1960s, but the core idea
            (evaluate your current strategy, then improve it) is alive and well
            in modern AI. Here&apos;s how:
          </p>

          <div className="space-y-6">
            <div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                The Conceptual Skeleton of Modern RL
              </h3>
              <p
                className="text-sm leading-relaxed mb-3"
                style={{ color: "var(--text-secondary)" }}
              >
                Policy iteration isn&apos;t a historical curiosity. It&apos;s the
                conceptual skeleton underneath modern reinforcement learning. The
                large language models you interact with daily (ChatGPT, Claude)
                were refined using a process called{" "}
                <strong>Reinforcement Learning from Human Feedback</strong>{" "}
                (RLHF): the model generates responses (its current
                &ldquo;policy&rdquo;), humans rate those responses (the
                &ldquo;evaluation&rdquo;), and the model is updated to produce
                better responses (&ldquo;improvement&rdquo;). That&apos;s the same
                evaluate → improve loop you just watched in the grid world.
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                One well-known implementation of this loop is{" "}
                <strong>PPO</strong> (Proximal Policy Optimization), which is
                designed to improve a policy without allowing any single update
                to be so large that performance collapses. Think of it as adjusting a
                recipe one ingredient at a time instead of overhauling everything
                at once. Modern language-model post-training may use
                other optimization methods as well, but the underlying structure
                is always the same two-phase cycle.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                Reinforcement Learning at Scale
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Our grid had 4 states. Real RL problems (teaching a robot to
                walk, playing Go, managing a power grid) can have billions of
                states. Modern algorithms like{" "}
                <strong>PPO</strong> and{" "}
                <strong>SAC</strong> (Soft Actor-Critic) are implementations
                of this same two-phase loop. They replace exact evaluation with
                neural network approximations so they can handle enormous state
                spaces, but the core rhythm (evaluate, improve, repeat) is
                unchanged from what you just stepped through.
              </p>
            </div>

            <div>
              <h3
                className="text-base font-semibold mb-2"
                style={{ fontFamily: "var(--font-serif), serif" }}
              >
                The Insight That Transfers Everywhere
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                The deepest lesson of policy iteration isn&apos;t the math. It&apos;s
                the structure. <em>Evaluate honestly, improve incrementally,
                repeat until stable.</em> This pattern shows up beyond AI: in
                how companies run A/B tests, how athletes review game film, how
                scientists refine hypotheses, and how editors revise drafts. The
                algorithm formalizes something humans already do intuitively.
              </p>
            </div>
          </div>
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
                The <em>policy improvement theorem</em> proves that each round
                of greedy improvement produces a strategy that is at least as
                good as the previous one. Since there are only so many possible
                strategies, the algorithm must eventually find the best one.
                You can&apos;t get worse, only better or the same.
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

        {/* ---- Real-World Examples ---- */}
        <section className="mb-14">
          <h2
            className="text-2xl font-semibold mb-6"
            style={{ fontFamily: "var(--font-serif), serif" }}
          >
            Real-World Examples
          </h2>
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            This same evaluate-improve loop powers some of the most impressive
            AI systems in the world. Here are a few:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <ExampleCard
              title="AlphaGo (DeepMind)"
              description="Defeated the world champion in Go, a game with more board positions than atoms in the universe. AlphaGo used policy iteration inside a Monte Carlo tree search: it evaluated board positions with a neural network and improved its move-selection policy through millions of self-play games."
              tag="Games"
            />
            <ExampleCard
              title="ChatGPT & Claude (RLHF)"
              description="Both OpenAI and Anthropic use reinforcement learning from human feedback to fine-tune their language models. Human raters evaluate model outputs (the evaluation step), and the model's response policy is updated to produce answers humans prefer (the improvement step)."
              tag="Language Models"
            />
            <ExampleCard
              title="Robotics (Boston Dynamics, Figure)"
              description="Teaching a robot to walk, grasp objects, or navigate a warehouse uses RL policies trained in simulation. The robot's control policy is repeatedly evaluated against physics simulations and improved, often thousands of times per second, before being deployed to the real hardware."
              tag="Robotics"
            />
            <ExampleCard
              title="Recommendation Systems"
              description="Netflix, Spotify, and YouTube use RL to decide what to show you next. Your viewing history is the state, the recommendation is the action, and your engagement (watch time, likes) is the reward. The platform continually evaluates its recommendation policy and improves it."
              tag="Products"
            />
            <ExampleCard
              title="Autonomous Vehicles (Waymo)"
              description="Self-driving cars face a continuous stream of decisions: brake, accelerate, change lanes. RL policies help plan maneuvers by evaluating possible trajectories and improving the driving policy in simulation before road testing."
              tag="Transportation"
            />
            <ExampleCard
              title="Data Center Cooling (Google)"
              description="Google used RL to cut data center energy consumption by 40%. The agent treats temperature readings as states, cooling system adjustments as actions, and energy savings as rewards. A textbook MDP solved with policy optimization."
              tag="Energy"
            />
          </div>
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
            Now that you&apos;ve seen how the algorithm works, try being the
            decision-maker yourself. Set a direction for each state and see
            what happens.
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

/* ------------------------------------------------------------------ */
/*  Example Card                                                       */
/* ------------------------------------------------------------------ */

function ExampleCard({
  title,
  description,
  tag,
}: {
  title: string;
  description: string;
  tag: string;
}) {
  return (
    <div
      className="rounded-lg border p-4 flex flex-col gap-2"
      style={{
        borderColor: "var(--card-border)",
        backgroundColor: "var(--card-bg)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "var(--equation-bg)",
            color: "var(--accent)",
          }}
        >
          {tag}
        </span>
      </div>
      <h4 className="text-sm font-semibold">{title}</h4>
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}
      >
        {description}
      </p>
    </div>
  );
}
