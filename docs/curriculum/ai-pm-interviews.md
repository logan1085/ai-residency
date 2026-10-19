# AI PM Interview Curriculum

A 30-session track for explaining AI systems, making product decisions, and defending those decisions in interviews. Designed for one focused hour per session, five sessions per week over six weeks. Dates are flexible; session numbers are the source of truth.

This track sits alongside the [research residency](index.md). It borrows the modeling → agents → building → serving/evaluation structure from the curriculum outline supplied during planning, but changes the depth and time allocation for AI PM interviews. It is an adaptation, not a reproduction of the original course or its activity guide.

## Outcome

By the end, independently:

- Explain an LLM and its training/inference lifecycle in plain language.
- Choose among prompting, retrieval, fine-tuning, and tool use for a specific user problem.
- Design an AI workflow with permissions, failure handling, and human escalation.
- Define an evaluation set, launch criteria, and monitoring plan.
- Reason quantitatively about quality, latency, cost, and product impact.
- Deconstruct a system with evidence and explain personal decisions honestly.
- Handle product design, strategy, technical, execution, analytical, and behavioral interviews.

Completing the schedule does not itself demonstrate readiness. Use the rubric and exit checks below.

## Time and depth

**24 standard sessions:** 15 minutes learning/recall + 15 minutes applying + 25 minutes interview practice + 5 minutes logging.
During the interview segment: 10-minute first answer, 5-minute critique, 10-minute retry and follow-ups.

**6 full mocks:** 5 minutes preparation + 45 minutes interview + 10 minutes review.

**Total: 30 hours:** 12 hours learning/application, 16 hours interview preparation/practice/review, and 2 hours standard-session logging. Optional builds and role-specific study are additional time. This is not the original 100-hour program compressed into 30 hours.

Breaks are outside active time. If an exercise cannot finish within its block, record the partial result and carry it into the next application block. Do not silently expand a one-hour commitment.

### Math policy

Keep the intuition for weights, activations, gradients, loss, probability, and vectors. Revisit calculations only when they resolve a concrete misunderstanding.

Prioritize practical calculations: confusion matrices, precision/recall, expected value, experiment interpretation, token budgets, cost per successful task, and latency budgets.

PPO derivations, full backprop by hand, and implementing a transformer are optional depth. The research residency already provides a home for implementation work. For foundation-model or post-training roles, add the extension below.

## How to begin

Start with Session 1. Existing exposure to neural networks and gradients earns a short diagnostic, not an assumption of mastery. Explain training versus inference and backprop versus parameter updates without hints. Repair a gap in at most 10 minutes, then continue.

Use existing residency artifacts where useful. Inspect code/results before claiming them as evidence; separate what was personally implemented from reference or assisted work. This curriculum does not reset or certify prior residency progress.

## Daily activity guide

Each row defines the learning scope, inspectable output, interview prompt, and a passing check. Read only enough of the linked residency module to answer that day's question; full-module completion is not a prerequisite.

### Week 1: Model fluency and choosing an approach

| Session | Learn or refresh | Application output | Interview question | Passing check |
| --- | --- | --- | --- | --- |
| 1. Prompting, RAG, fine-tuning | Context versus changed weights; training versus inference; when external knowledge is needed | One-page decision table for an internal-document assistant: user, knowledge freshness, permissions, citations, quality target, first baseline | Would you start with prompting, RAG, or fine-tuning? What must you learn first? | Clarify requirements, select a baseline, explain alternatives and a test; recognize approaches can be combined |
| 2. Tokens, embeddings, transformers | Tokenization, vector representations, attention, next-token prediction, context limits | Annotate the path from prompt to generated answer; give one failure at each stage | Explain an LLM to a designer, then handle an engineer's follow-up | Distinguish contextual processing from a database lookup; explain training and generation |
| 3. Pretraining, SFT, and data | General learning, demonstrations, adaptation, data quality, train/validation/test splits | Classify six failures as knowledge access, behavior, task ambiguity, or data/eval problems | An assistant knows the domain but gives inconsistent answers. Would you fine-tune? | Establish a measured failure pattern and compare cheaper interventions before training |
| 4. Evaluation before optimization | Representative tasks, rubrics, human labels, held-out cases, leakage | Create 12 synthetic document questions: 4 answerable, 4 ambiguous, 4 unsupported; write expected behavior | What evidence would justify launching the document assistant? | Specify measurable thresholds, severe-failure rules, slices, and limits of the small sample |
| 5. Full mock: technical/system design | No new reading | Architecture sketch plus scored review | Design an assistant for internal policies and changing documentation | Defend data flow, access control, retrieval, evaluation, and rollout under follow-up questions |

### Week 2: Post-training, reasoning, and product judgment

| Session | Learn or refresh | Application output | Interview question | Passing check |
| --- | --- | --- | --- | --- |
| 6. RL and reward design | Policy, actions, rewards, delayed outcomes, reward proxies | Define a reward and three ways a support assistant could exploit it | Would maximizing customer thumbs-up improve this assistant? | Separate the proxy from user/business outcomes; propose independent evaluation |
| 7. Policy gradients and PPO | How reward can influence action probabilities; why large policy updates can be unstable; clipping intuition | Explain one sampled-response → feedback → update cycle in six sentences | Explain PPO to a PM and identify what could go wrong with the reward | Explain the purpose and limits without relying on equations; avoid treating PPO as the only post-training method |
| 8. Preference optimization and reasoning | Compare SFT, preference optimization, and reward-based learning; conceptual DPO/GRPO differences; inference-time effort | Decision memo: improve a reasoning task through data, tools, training, or more inference compute | A reasoning model improves accuracy but doubles response time. Should we switch? | Tie the decision to task value, uncertainty, latency tolerance, and measured incremental benefit |
| 9. Alignment and safety | Instruction hierarchy, harmful actions, over-refusal, reward hacking, privacy | Five adversarial test cases and expected behavior for the assistant | How do you make the product useful while controlling serious failure modes? | Define boundaries and mitigations at model, application, and workflow levels |
| 10. Full mock: product design | No new reading | Product brief plus scored review | Pitch a 0-to-1 AI-first product beyond a generic chatbot; explain its larger opportunity | Name a specific user/problem, workflow, AI advantage, failure experience, and credible first release |

### Week 3: Retrieval and agent systems

| Session | Learn or refresh | Application output | Interview question | Passing check |
| --- | --- | --- | --- | --- |
| 11. Retrieval quality | Chunking, embeddings, keyword/hybrid retrieval, reranking, metadata | Draw ingestion and query paths; diagnose three bad-answer examples | The answer is wrong. How do you tell whether retrieval or generation caused it? | Inspect retrieved evidence separately from the final answer and propose targeted tests |
| 12. Context and memory | Context selection, stale information, session state, persistent memory, permission filtering | Policy for what to retain, retrieve, expire, and exclude | Should the assistant remember everything about the user? | Explain utility, privacy, freshness, ownership, and deletion tradeoffs |
| 13. Tools and control | Tool schemas, deterministic workflows versus agent loops, stop conditions | Tool contract for creating a support ticket: input, validation, result, error | When would you use an agent instead of a fixed workflow? | Identify where flexibility adds value and where predictable control is preferable |
| 14. Authorized actions and recovery | Confirmation, authorization, idempotency, retries, timeouts, escalation | Sequence for a failed action with five injected failure cases | An agent books the same appointment twice. How do you fix the system? | Diagnose duplicate side effects and distinguish safe retries from unsafe repeats |
| 15. Full mock: strategy | No new reading | Options memo plus scored review | A model update reproduces your product's signature feature for free. What do you do? | Reassess customer value and differentiation, compare options, define evidence, and lead the transition |

### Week 4: Applied system evidence

Use one small internal-document assistant throughout this week. Use synthetic or explicitly shareable documents. This is a scoped prototype, not a production system.

| Session | Learn or refresh | Application output | Interview question | Passing check |
| --- | --- | --- | --- | --- |
| 16. Grounded-answer baseline | Minimal prompt, source citations, abstention | Three short synthetic documents, a baseline prompt, and recorded outputs for six questions | What is the smallest version worth testing? | A reproducible input/output record and a clearly stated limitation |
| 17. Retrieval comparison | Consistent comparison conditions; retrieval precision versus answer correctness | Compare manual context selection or a simple retriever with the baseline on the same cases | Retrieval improved aggregate accuracy but worsened one critical slice. Now what? | Explain slice-level evidence and a targeted fix rather than declaring an overall win |
| 18. Tool loop | Structured tool requests and bounded control | A runnable mock tool or explicit state-machine simulation; three success and three failure traces | What should happen when the model emits invalid tool arguments? | Show validation, bounded repair, observable errors, and a safe stop |
| 19. Recovery and integration | Regression cases and end-to-end success | Replay timeout, missing evidence, unauthorized request, and duplicate action; produce a short demo | Deconstruct your system: architecture, surprising failures, and what you changed | Tie each claimed improvement to a trace or result; label simulated behavior |
| 20. Full mock: execution and launch | No new reading | Launch/no-launch memo plus scored review | This prototype looks strong in demos. How do you decide whether to pilot it? | Cover evaluation limits, rollout, ownership, monitoring, escalation, and rollback |

For a code-first portfolio artifact, add two optional 90-minute build blocks after Sessions 17 and 19. The core schedule supports a small evidence-backed prototype or simulation; it does not promise a production deployment.

### Week 5: Serving, metrics, and commercial tradeoffs

| Session | Learn or refresh | Application output | Interview question | Passing check |
| --- | --- | --- | --- | --- |
| 21. Serving and hardware | Prefill/decode intuition, memory, batching, KV cache, quantization, MoE intuition | Annotated latency budget and three candidate optimizations | Why might a larger context window increase cost or latency? | Distinguish time to first token, generation speed, total completion time, and task success |
| 22. Unit economics and routing | Cost per request versus per successful task, caching, routing, retries | Calculate cost for two hypothetical model routes including retry rates; label assumptions | A cheaper model causes more retries. Which model should we use? | Compare end-to-end value and quality floors; show sensitivity to assumptions |
| 23. Metrics and experiments | User outcomes, guardrails, precision/recall, confidence, online/offline differences | Metric tree and experiment plan for support resolution | Automation rate rose while satisfaction fell. How do you investigate? | Segment results, inspect selection effects and failures, and propose a discriminating test |
| 24. Model/vendor selection | Evaluation coverage, reliability, privacy needs, portability, build/buy | Weighted scorecard with an explicit disqualifying criterion | Should we adopt the top benchmark model or keep the current provider? | Use task-specific evidence and operational requirements, not leaderboard rank alone |
| 25. Full mock: analytical | No new reading | Calculations plus scored review | Choose a model and rollout using a supplied table of quality, cost, latency, and failure rates | Calculate correctly, question missing evidence, and give a conditional recommendation |

### Week 6: Interview synthesis and experience

| Session | Learn or refresh | Application output | Interview question | Passing check |
| --- | --- | --- | --- | --- |
| 26. Experience stories | Personal ownership, decisions, alternatives, outcomes, uncertainty | Three story outlines: technical tradeoff, failure/repair, influence without authority | Tell me about an ambiguous technical decision you owned | Separate personal contribution from team work; use real evidence and avoid invented metrics |
| 27. Product taste | User behavior, overlooked capability, market assumptions | One-page analysis of a familiar AI product with observed facts separated from hypotheses | What AI feature is underestimated, and what larger opportunity does it enable? | Explain a specific insight, adoption constraint, and validation plan |
| 28. Conviction and prioritization | Proxy evidence, qualitative signals, reversible bets, milestones | Investment memo with a falsifiable thesis and stop criteria | How do you win support for a novel product without an A/B test? | Build an evidence chain, state uncertainty, and propose staged commitment |
| 29. Target-role repair | Review a real job description and the weakest rubric dimensions | Target-role map; redo two weakest answers; choose three questions to ask interviewers | Why this role, and what would you focus on in your first 90 days? | Connect experience to the role and avoid unsupported company assumptions |
| 30. Full mock: behavioral and synthesis | No new reading | Final scorecard, evidence index, next-two-weeks repair plan | Walk through a difficult product decision, then defend its technical and strategic implications | Give clear, owned examples and handle follow-ups across product, systems, and measurement |

## Full mock protocol

Six primary types: technical/system design, product design, strategy, execution, analytical, and behavioral. This core track contains one full mock per type plus daily short practice. It does not claim the original plan's 5–6 full mocks per type.

Before a mock, the interviewer prepares a prompt and two hidden follow-ups. During the 45 minutes, avoid coaching; answer clarifying questions, then challenge assumptions. Feedback comes afterward.

For Session 25, use a clearly hypothetical comparison: Route A costs $0.02/attempt, succeeds on 80% of attempts, and has 2-second p95 latency; Route B costs $0.05/attempt, succeeds on 95%, and has 5-second p95 latency. First compare one-attempt cost per success. Then discuss why retries, dependence between attempts, severe errors, and user value can change the choice. Do not infer retry-adjusted p95 from these figures alone.

Score each dimension 0–3:

| Dimension | What to inspect |
| --- | --- |
| Problem framing | User, job, constraints, success definition, clarifying questions |
| Technical accuracy | Correct mechanisms, architecture, and limits |
| Judgment | Alternatives, explicit tradeoffs, defensible recommendation |
| Evidence | Metrics, calculations, tests, uncertainty, failure slices |
| Communication | Clear structure, direct answers, concise explanations |
| Ownership and reflection | Personal contribution, learning, changed decisions |

Scoring anchors: 0 = absent or materially wrong; 1 = needs substantial prompting; 2 = independent and sound; 3 = handles challenge and adapts with evidence.

A session passes when its row's check is met independently. Interview readiness is provisional when two consecutive full mocks have every dimension at least 2 and no unresolved major technical error. Re-test weak interview types; six mocks do not guarantee readiness for every company.

## Weekly outputs and review

- Week 1: approach-selection memo, system explanation, starter eval set.
- Week 2: post-training explanation, reward-risk analysis, product pitch.
- Week 3: retrieval/agent architecture, permission and recovery design, strategy memo.
- Week 4: reproducible prototype or simulation, traces, comparison, pilot decision.
- Week 5: serving budget, unit economics, metrics tree, vendor scorecard.
- Week 6: three evidence-backed stories, product thesis, role map, final mock review.

At each weekly review ask:
1. Can I explain this without hints?
2. Can I use it to make a decision?
3. Can I defend that decision under follow-up questions?
4. Did this week's work improve interview performance? What should we cut or deepen?

## Session record

Copy this into a work log after each session. Planned activities are not completed evidence.

```markdown
### Session NN: topic
Date:
Status: not started / in progress / passed / needs repair
Artifact or evidence link:
My answer before feedback:
Main correction:
My revised answer:
Rubric scores (when applicable):
One unresolved question:
Next session:
```

Do not publish confidential interview questions, employer data, private feedback, or unsupported claims. Public examples can use synthetic data and anonymized decisions.

## Resources within the residency

Use these as reference libraries, not additional mandatory homework:

- [Transformers](modules/module-01-transformers.md): tokens, embeddings, attention, generation.
- [Training and evaluation](modules/module-02-training-evaluation.md): loss, optimization, data splits.
- [Data, embeddings, RAG](modules/module-03-data-embeddings-rag.md): retrieval and grounding.
- [Agents and tools](modules/module-04-agents-tools.md): control and tools.
- [Evaluation and observability](modules/module-06-evaluation-observability.md): rubrics, traces, error analysis.
- [Alignment and safety](modules/module-07-alignment-safety.md): preferences and failure testing.
- [Systems and deployment](modules/module-09-systems-deployment.md): serving and rollout.
- [Transformer implementation](../code/transformer-from-scratch.md): existing concrete system to explain.

For outside learning, preserve the suggested sequence of visual intuition, implementation walkthroughs, then production examples. Select one named section that closes the current gap. Avoid adding full courses or paper-reading detours. Verify current product details and pricing at the time of use.

## Optional role-specific extensions

These are additional time, selected after target roles are known.

**Foundation-model or post-training PM (4–6 hours):** policy-gradient objective intuition, PPO versus DPO/GRPO, reward model quality, group-relative advantages, KL regularization, preference-data operations, reasoning evaluation. Deliver a training experiment brief and a technical mock. Use the residency's RL work as evidence where verified.

**Infrastructure PM (3 hours):** serving bottlenecks, utilization, batching, quantization, reliability, capacity and economics. Deliver a capacity/cost memo and an infrastructure mock.

**Agent/application PM (3 hours):** connectors, enterprise permissions, task completion, recovery, adoption and handoffs. Deliver a failure-injection report and an enterprise design mock.

**Design practice (2 hours):** 90 minutes manually building 2–3 Figma screens with loading, error, permission, and human-handoff states; 30 minutes comparing the same brief with Figma Make. Explain which decisions improved the user's task. This remains optional until the technical and interview blocks are consistent.

**Additional interview repetitions:** add one 60-minute mock at a time for weak or target-specific types. Reaching five full mocks in each of six types requires 24 additional mocks beyond this core track, or 24 hours.
