# AI PM Daily Activity Guide

Synced October 23, 2026 from Logan's personal curriculum pages, which were prepared from Mark's supplied activity guide. This is the active 25-day track. The separate assigned-reading checklist is still missing; exact reading excerpts are not invented here.

[Curriculum and schedule](ai-pm-interviews.md) · [Current progress](../progress/ai-pm-study-log.md)

## Day 01: Neural networks

### Status

In progress. Concepts partially practiced; assigned exercise and full mock incomplete.

### Why this day matters

Understand how prediction errors become parameter changes.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** Without copying the worked solution, use prediction=w×x+b, loss=0.5×(prediction−y)², x=2, y=1, w=.25, b=0 and learning rate=.1. Calculate both gradients and one update.
- **25m:** Draw x,w,b → prediction → loss. Repeat the update from the original weights with learning rates 0 and .5; explain why the results differ.



#### Completion check: open after your attempt

**10m:** Check: initial loss .125; gradients −1 and −.5; at rate .1, w=.35,b=.05, loss=.03125. At rate 0 loss=.125; at .5 loss=.28125. Correct the first incorrect step.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Behavioral/leadership:** Start with your 90-second career pitch and why this role, then describe a consequential product decision you led with incomplete information. Probe personal contribution, alternatives, evidence, outcome and what you would change.

### My work and evidence

**Reviewed October 23, 2026. Day 1 is in progress.**

Original setup: x=2, target y=1, w=.25, b=0, learning rate=.1; prediction=w×x+b; loss=.5×(prediction−y)².

Logan calculated prediction .5, identified that w should increase, evaluated the supplied weight-gradient expression as −1, and calculated the updated weight .35. The loss answer .25 omitted the factor 1/2; the tutor corrected it to .125. The negative-gradient explanation required additional tutoring. Logan reported improved understanding; independent teach-back remains pending.

**Exact resume point:** calculate b_new=0−.1(−.5). Then use w_new=.35 and the new bias to calculate prediction and loss. Both parameter gradients come from the original forward pass. Repeat from the original parameters at learning rates 0 and .5, draw the computation, and explain the differences.

The bias answer, updated prediction/loss, rate comparison and diagram have not been submitted. The Day 1 career-pitch/decision interview is also pending. Focused minutes and streak are unknown. Setup, reminders and publishing do not count as studying.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: calculate b_new=0−.1(−.5), then updated prediction and loss.

---

## Day 02: Transformers

### Status

Not yet assessed in this track.

### Why this day matters

Understand how tokens use context to produce representations and predictions.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **30m:** For the third token use Q=\[1,0\], keys \[1,0\],\[0,1\],\[1,1\], values \[1,0\],\[0,2\],\[2,1\]. Divide dot products by √2, apply softmax, then calculate the weighted value sum.
- **20m:** Show which positions the first token may attend to. Calculate −ln(p) for correct-token probabilities .1 and .8; label attention versus output softmax on your diagram.



#### Completion check: open after your attempt

**10m:** Check: attention ≈\[.401,.198,.401\], value ≈\[1.203,.797\], losses≈2.303/.223. Explain one correction aloud.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Product sense:** Design a product that helps NYC commuters handle unexpected transit disruptions. Choose a segment, establish the unmet need, prioritize an MVP and define success.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 03: Mixture of experts

### Status

Not yet assessed in this track.

### Why this day matters

Distinguish model size, active computation and serving constraints.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** Draw a token entering a router and two of eight experts, then rejoining the transformer stream. Label shared versus expert weights and explain why routing is learned.
- **25m:** Assume 2B shared parameters and eight 1B experts, with two active per token. Calculate total parameters, active parameters and weight-only memory at 2 bytes/parameter. Explain what happens if every token selects the same experts.



#### Completion check: open after your attempt

**10m:** Check: 10B total, 4B active per token, 20GB weight-only storage if all weights are resident. Active count alone does not establish serving latency.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Execution/analytics:** A collaboration product’s weekly active users fell 15%. Investigate instrumentation, segments and behavior, identify plausible causes and choose the next action.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 04: Pretraining and generalization

### Status

Not yet assessed in this track.

### Why this day matters

Reason about learning, compute and performance on unseen data.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **20m:** Assume compute ∝ parameters × tokens: explain what happens to training tokens if parameters double at fixed compute. Distinguish this dense-model approximation from yesterday’s sparse model.
- **30m:** Training loss falls 1.2→.5 while validation loss rises 1.4→1.8. Give two hypotheses and one discriminating test; propose one next experiment. Specify what belongs in train, validation and untouched test sets.



#### Completion check: open after your attempt

**10m:** Check: available tokens halve under the stated approximation. Write a 150-word recommendation; avoid claiming these two losses identify the cause or optimal model size.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Strategy/business:** Should an established project-management company build an AI assistant? Assess customers, competition, differentiation, distribution and economics before recommending an investment.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 05: From base model to assistant

### Status

Not yet assessed in this track.

### Why this day matters

Choose between changing behavior and supplying current knowledge.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **20m:** For correct knowledge with inconsistent format, an outdated policy, and unanswerable questions, choose a first intervention: demonstrations, current evidence or abstention behavior.
- **30m:** Write two example SFT input/output pairs for the format problem and two test questions for each other failure. Explain what changes weights versus runtime context.



#### Completion check: open after your attempt

**10m:** Check that your examples teach behavior without inventing facts. State the evidence you would need before spending on fine-tuning.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Technical systems:** Design an enterprise support assistant that answers questions and requests account changes. Clarify requirements, components, permissions, failure handling and rollout. Plain language is sufficient.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 06: RL foundations

### Status

Not yet assessed in this track.

### Why this day matters

Understand decisions and rewards across multiple steps.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** Draw safe (reward2 then terminal) versus risky (reward0 then a 50/50 terminal reward4 or−1), discount .9. Define states, actions and both returns.
- **25m:** Label V and Q on the tree. Change discount to1, then discuss why a lucky risky rollout does not establish the better policy and why exploration can still matter.



#### Completion check: open after your attempt

**10m:** Check: safe2; risky1.35 at .9 and1.5 at1. Explain the Bellman relationship in words.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Model/research judgment:** Choose between a cheaper model strong on routine tasks and an expensive model better on difficult cases. Define the evidence needed for a pilot and a decision rule, including cost and user impact.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 07: Policy gradients and PPO

### Status

Not yet assessed in this track.

### Why this day matters

Understand reward-driven updates and the purpose of PPO clipping.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **20m:** For returns5 and1 and value baseline2 calculate advantages. Explain actor versus critic and why the baseline reduces variance.
- **30m:** Use r=π_new(action\|state)/π_old(action\|state)=1.5, ε=.2. Compute min(rA,clip(r,1−ε,1+ε)A) for A=+2 and−2; sketch both terms as r varies.



#### Completion check: open after your attempt

**10m:** Check: advantages3/−1; objective contributions2.4/−3. Clipping is not a hard divergence bound and these terms are not parameter updates.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Behavioral/leadership:** Describe a serious disagreement with engineering or research leadership. Explain competing goals, your actions, the resolution and the effect on the working relationship. Briefly revisit why this target role fits your experience. Close with a two-minute account of a technical tradeoff you personally owned; identify what you delegated and what evidence changed your decision.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 08: Human feedback and alignment

### Status

Not yet assessed in this track.

### Why this day matters

Understand preference learning and why reward optimization can fail.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** Make three rows: SFT, PPO-based RLHF and DPO. For each specify training examples, feedback source, model updated and one failure risk.
- **25m:** A reward model prefers lengthy confident answers. Give two ways a policy could exploit this and design two counterexamples for evaluation. Explain the reference-policy KL penalty versus PPO clipping.



#### Completion check: open after your attempt

**10m:** Check: DPO uses preference pairs without an online rollout loop in standard offline DPO; preferences are not ground truth. Explain why alignment is not a guarantee of correctness.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Product sense:** Improve a video-creation product for small marketing teams. Diagnose their workflow, pick one problem, explain the experience and defend priorities. AI features are optional.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 09: Reasoning and verifiable rewards

### Status

Not yet assessed in this track.

### Why this day matters

Understand verifiable rewards and group-relative learning signals.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** For rewards \[0,0,1,1\], calculate mean and population-standard-deviation-normalized advantages. Add GRPO to yesterday’s comparison; distinguish reward model/function from learned critic.
- **25m:** Verifier scores rise but paraphrased-question success falls. Propose a failure hypothesis and a test. Compare collecting demonstrations, verifier-based RL, distilling a stronger model and spending more inference compute.



#### Completion check: open after your attempt

**10m:** Check: mean.5, standard deviation.5, advantages\[−1,−1,1,1\]. GRPO avoids a separately learned critic; a KL penalty is optional in some variants.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Strategy/business:** Should an AI developer-tool company enter large enterprises or deepen its individual-developer business? Recommend a segment, differentiated offer and distribution plan; state when you would change course.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 10: Agent control and tools

### Status

Not yet assessed in this track.

### Why this day matters

Choose predictable workflows or model-directed control appropriately.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** For “replace my broken work laptop,” draw a fixed workflow and a model-directed loop. Label state, decision, tool arguments, validation, result and stop condition.
- **25m:** Write a search-tool contract: inputs, output fields and two errors. Explain when routing, parallel work or multiple agents would help; distinguish MCP from orchestration and authorization.



#### Completion check: open after your attempt

**10m:** Check: identify every decision that can be deterministic. An unexpected tool name must not execute.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Execution/analytics:** Trial activation rose after a redesign but paid conversion fell. Define the funnel, investigate segments and propose an experiment with decision thresholds. Use fictional cohorts with the same 30-day observation window: before, 1,000 trials / 400 activated / 100 paid; after, 1,000 / 600 / 90; every paid user activated first. Calculate activation, trial-to-paid and activated-to-paid rates. Ask what segmentation or assignment data is missing before attributing causality.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 11: Retrieval, context and memory

### Status

Not yet assessed in this track.

### Why this day matters

Diagnose grounding, access, freshness and memory problems.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** Trace “Can I expense the replacement?” through ingestion, chunks, embeddings, keyword/semantic retrieval, reranking and cited answer. Mark access and freshness filters.
- **25m:** Show three failures: paraphrase misses source, old policy outranks current policy, long conversation loses the task. Choose the component to inspect and one corrective change for each.



#### Completion check: open after your attempt

**10m:** Check: distinguish missing retrieval from unsupported generation, and context from durable task state. Retrieved instructions are not trusted authority.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Technical systems:** Expand a successful enterprise assistant pilot to multiple customers. Design tenant isolation, authorization, retrieval, observability and recovery; identify the highest-risk launch dependency.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 12: Production controls and releases

### Status

Not yet assessed in this track.

### Why this day matters

Keep model outputs within application-enforced controls.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** Add identity, authorization and exact-action approval to yesterday’s diagram. Trace an injected policy instruction and a denied action; identify where application code blocks them.
- **25m:** Define one release bundle containing model configuration, prompt and knowledge version. State a pilot gate, rollback trigger and how one user complaint becomes a regression case; mark human handoff.



#### Completion check: open after your attempt

**10m:** Check: distinguish Sierra’s vendor choices from general principles. Explain how failover can change behavior and requires evaluation.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Model/research judgment:** A new model wins internal benchmarks but receives worse pilot feedback. Diagnose the mismatch, propose an evaluation tied to the decision and advise whether to ship.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 13: Recovery and observability

### Status

Not yet assessed in this track.

### Why this day matters

Make tool workflows recover without repeating side effects.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **25m:** A ticket write succeeds but its response is lost. Draw request ID, approved payload, stored result and retry; show restart before and after commit.
- **25m:** Add a permanent read outage, bounded retries, cancellation and human handoff. Specify log fields needed to distinguish model, retrieval and tool failures.



#### Completion check: open after your attempt

**10m:** Check: the same request must return the prior result; a changed payload under the same ID must be rejected. Traces show observable calls/results, not private model reasoning.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Behavioral/leadership:** Describe a product failure or missed commitment you owned. Probe warning signs, accountability, difficult communications and the concrete change you made afterward.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 14: Build 1: grounded answers

### Status

Not yet assessed in this track.

### Why this day matters

Build a traceable grounded-answer baseline.

### Time and scope

180 minutes building/testing plus one separate 60-minute mock.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **35m:** Configure one provider and create five short fictional policies, including one outdated and one finance-only document. Make a real model call.
- **120m:** Implement keyword retrieval returning at most three snippets with IDs/dates, then a structured cited answer. Save retrieved IDs separately.
- **25m:** Test one supported and one unsupported question. Add “insufficient evidence”; fix the first failing path. If API access fails, label manual responses as simulated.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Product sense:** Improve the daily administrative work of hospital research coordinators. Clarify users, workflow and constraints before choosing a problem. Do not assume an AI product is the answer.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 15: Build 2: typed tools and loop

### Status

Not yet assessed in this track.

### Why this day matters

Make tool execution typed, bounded and observable.

### Time and scope

180 minutes building/testing plus one separate 60-minute mock.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **60m:** Implement typed search and draft-ticket tools; reject missing fields and unknown tool names. Drafting cannot write a ticket.
- **95m:** Implement choose → validate → execute → observe → answer, capped at five calls. Log inputs/results, elapsed time and available token usage.
- **25m:** Test direct answer, search and draft requests plus malformed arguments. Show completion, budget and tool-error stop reasons.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Strategy/business:** A competitor bundles your core feature for free. Recommend a response for a standalone enterprise software company through positioning, product, packaging and distribution.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 16: Build 3: authorized actions

### Status

Not yet assessed in this track.

### Why this day matters

Ensure only authorized and approved actions execute once.

### Time and scope

180 minutes building/testing plus one separate 60-minute mock.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **45m:** Filter documents using an application-provided role before retrieval; ignore role changes claimed in text or model output.
- **105m:** Require approval of the exact draft. Use SQLite with a unique request ID and transaction to store the approved payload and ticket. Replay returns the same ticket; changed payload requires a new approved request.
- **30m:** Test denied access, injected instructions, rejected approval and repeated execution. Check zero unapproved writes and one ticket for repeated approved execution.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Execution/analytics:** Assistant usage is growing while operating cost grows faster and retention stays flat. Define metrics, investigate drivers and prioritize interventions. Use fictional monthly inputs: 100,000 attempted tasks, 80% success, \$0.04 variable cost per attempt, \$1,000 fixed serving cost and \$12,000 revenue. Calculate cost per successful task and serving contribution margin, then double variable cost. Identify excluded support/sales costs and explain why usage alone is insufficient evidence of value.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 17: Build 4: recovery

### Status

Not yet assessed in this track.

### Why this day matters

Recover safely from failures and interruptions.

### Time and scope

180 minutes building/testing plus one separate 60-minute mock.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **100m:** Persist task status, draft and approval. Resume after restart and recover a lost write response using the request ID.
- **50m:** Add bounded read retries, cancellation before execution and a visible handoff on permanent failure.
- **30m:** Test timeout→success, permanent timeout and restart after commit but before response. Verify no duplicate tickets.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Technical systems:** An agent duplicated a customer-facing action during an outage. Explain containment, diagnosis, a safer execution design and the evidence needed to restart.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 18: Build 5: integration and evidence

### Status

Not yet assessed in this track.

### Why this day matters

Show a coherent system and reproducible evidence.

### Time and scope

180 minutes building/testing plus one separate 60-minute mock.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **60m:** Connect answer → draft → approval → write → result in one flow. Cap tool/context output while retaining full logs.
- **70m:** Run supported, unsupported, outdated-policy, restricted-access, paraphrased and interrupted cases. Fix the largest failure and save development smoke cases.
- **50m:** Prepare a five-minute demo and a diagram separating implemented controls from production authentication, tenant isolation and deployment. Save a baseline copy for Day 20; make results easy to record in a small table.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Model/research judgment:** Research proposes a capability that may take six months with uncertain quality. Decide how to invest, define milestones and state triggers for continuation, redirection or cancellation. Probe whether the limiting factor is data, base-model capability or product integration; compare prompting/retrieval, SFT and RL only where justified. Specify required human feedback, a representative evaluation and the partnership between PM, research and engineering.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 19: Hardware and inference

### Status

Not yet assessed in this track.

### Why this day matters

Connect hardware limits to latency and cost.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **20m:** Calculate weight-only memory for 8B parameters at2 and.5 bytes/parameter. List excluded memory costs and explain GPU/TPU and interconnect roles.
- **30m:** A request takes1s retrieval+4s model+1s tool. Halve only model time. Use one project trace to identify a suspected bottleneck and a measurement; explain a batching or quantization tradeoff.



#### Completion check: open after your attempt

**10m:** Check:16GB/4GB before overhead; latency6s→4s. A provider API trace may not separate prefill from decode: label that uncertainty.



### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Behavioral/leadership:** Describe how you raised team performance or changed organizational direction without formal authority. Probe standards, coaching, tradeoffs and durable results. Close with a concise why-this-role answer.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 20: Evaluation and launch evidence

### Status

Not yet assessed in this track.

### Why this day matters

Make a measured improvement and a defensible pilot decision.

### Time and scope

120 minutes learning (20-minute overview + 100-minute assigned learning), then the 60-minute activity below, then a separate 60-minute mock. Assigned learning excerpts await the separate curriculum checklist.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

- **15m:** Create eight new cases, distinct from smoke tests: ordinary, missing evidence, restricted access and tool failure. Write expected outcomes; reserve four (one per type) untouched.
- **15m:** Run the four development cases on the saved Day 18 agent. Grade citations and final action state, not fluency. Choose one small prompt/retrieval-setting change.
- **20m:** Apply that change, rerun development cases, then compare both versions on the four holdouts. Log success, severe failures and elapsed time. If time is tight, use a smaller configuration change rather than add features.
- **10m:** Recommend pilot/fix/wait with one online user-outcome metric. Explain grader uncertainty and what repeated trials would establish. Eight cases are an exercise, not production certification.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Product sense:** Design onboarding for a complex B2B analytics product. Halfway through, the interviewer removes your proposed integration and halves engineering capacity. Reprioritize while protecting user value.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 21: Interview loops and repair

### Status

Not yet assessed in this track.

### Why this day matters

Practice senior-level judgment under follow-up questions and changed constraints; correct weaknesses using evidence.

### Time and scope

Three 60-minute mock blocks plus 60 minutes targeted repair.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

No new academic lesson. Complete the three interview rounds and targeted repairs below.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Round 1 · Strategy/business:** Choose a new industry for an enterprise AI company. Compare three candidates and recommend a beachhead, buyer, pricing hypothesis and route to market. Respond to a six-month runway constraint.
- **Round 2 · Execution/analytics:** Design an experiment for an enterprise workflow feature with few customers and long buying cycles. Address leading indicators, rollout risk, confounding and the decision you can realistically make.
- **Round 3 · Model/research judgment:** A model can solve difficult tasks but fails unpredictably on routine ones. Design a capability-readiness decision with research: target users, failure taxonomy, human feedback, milestones and a stop rule. Halfway through, remove access to new training data.

**60m targeted repair:** for each round, spend 5m identifying the weakest answer, 10m re-answering with one changed constraint, and 5m comparing the result against the feedback. This is three 20m repair blocks, not another full mock.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 22: Interview loops and repair

### Status

Not yet assessed in this track.

### Why this day matters

Practice senior-level judgment under follow-up questions and changed constraints; correct weaknesses using evidence.

### Time and scope

Three 60-minute mock blocks plus 60 minutes targeted repair.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

No new academic lesson. Complete the three interview rounds and targeted repairs below.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Round 1 · Product sense:** Design a product that helps families coordinate care for an aging parent. Choose a segment and unmet need, sketch the workflow, prioritize an MVP and defend privacy and trust decisions. Do not assume AI is necessary.
- **Round 2 · Technical systems:** Design search across an enterprise’s documents and business applications. Defend freshness, access control, retrieval quality and failure handling. Midway through, add strict data-residency constraints.
- **Round 3 · Behavioral/leadership:** Describe how you aligned sales, design and engineering when each wanted a different priority. Probe your decision process, what you declined, measurable impact and a stakeholder who remained dissatisfied.

**60m targeted repair:** for each round, spend 5m identifying the weakest answer, 10m re-answering with one changed constraint, and 5m comparing the result against the feedback. This is three 20m repair blocks, not another full mock.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 23: Interview loops and repair

### Status

Not yet assessed in this track.

### Why this day matters

Practice senior-level judgment under follow-up questions and changed constraints; correct weaknesses using evidence.

### Time and scope

Three 60-minute mock blocks plus 60 minutes targeted repair.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

No new academic lesson. Complete the three interview rounds and targeted repairs below.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Round 1 · Strategy/business:** Your enterprise software product has strong usage but weak expansion revenue. Choose among seat, usage and outcome pricing. Defend buyer incentives, packaging, gross-margin assumptions and a rollout experiment.
- **Round 2 · Execution/analytics:** A new workflow improves completion rate but increases severe errors. Define the metric hierarchy, segment the failures, set launch/rollback thresholds and design the next experiment. Require the interviewer to supply hypothetical counts when you ask for denominators.
- **Round 3 · Model/research judgment:** Choose between improving the base model and adding inference-time search/tool use for a reasoning product. Identify the failure evidence, data, latency and cost tradeoffs; propose the smallest experiment that changes the investment decision.

**60m targeted repair:** for each round, spend 5m identifying the weakest answer, 10m re-answering with one changed constraint, and 5m comparing the result against the feedback. This is three 20m repair blocks, not another full mock.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 24: Interview loops and repair

### Status

Not yet assessed in this track.

### Why this day matters

Practice senior-level judgment under follow-up questions and changed constraints; correct weaknesses using evidence.

### Time and scope

Three 60-minute mock blocks plus 60 minutes targeted repair.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

No new academic lesson. Complete the three interview rounds and targeted repairs below.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Round 1 · Technical systems:** Design an assistant for latency-sensitive employees and slower background work. Defend service targets, model routing, cost controls and degradation during a traffic spike.
- **Round 2 · Model/research judgment:** A multimodal capability enables a compelling product but has uncertain reliability and misuse risks. Recommend users, scope, evidence and launch conditions; respond to pressure for an earlier release.
- **Round 3 · Behavioral/leadership:** Describe how you set a roadmap through ambiguity and changed it when evidence contradicted your plan. Probe resource allocation, influence without authority and your personal accountability. Finish with why this company and role.

**60m targeted repair:** for each round, spend 5m identifying the weakest answer, 10m re-answering with one changed constraint, and 5m comparing the result against the feedback. This is three 20m repair blocks, not another full mock.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

## Day 25: Interview loops and repair

### Status

Not yet assessed in this track.

### Why this day matters

Practice senior-level judgment under follow-up questions and changed constraints; correct weaknesses using evidence.

### Time and scope

Three 60-minute mock blocks plus 60 minutes targeted repair.
Split across one-hour sessions if needed. Track actual focused time. Follow the supplied activity guide; do not add unrelated exercises.

### Assigned activity and required output

No new academic lesson. Complete the three interview rounds and targeted repairs below.

### Independent interview

Each mock: 5m preparation, 45m interview, 10m review. Do not coach during the interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness when relevant.

- **Round 1 · Product sense:** For your target company, identify an underserved user problem and propose one improvement. Defend user insight, scope, experience and success measures under skeptical questioning.
- **Round 2 · Strategy/business:** For the same company, recommend its most important product investment over the next year. Explain alternatives, advantage, resource allocation, economics and evidence that would overturn your recommendation.
- **Round 3 · Execution/analytics:** That investment launches but misses its principal metric after 90 days. Diagnose the situation and choose whether to iterate, reposition or stop; specify the next evidence-gathering step.

**60m targeted repair:** for each round, spend 5m identifying the weakest answer, 10m re-answering with one changed constraint, and 5m comparing the result against the feedback. This is three 20m repair blocks, not another full mock.

### My work and evidence

- Original attempt: pending.
- Calculations, diagram, code or test-result link: pending.
- Assistance received: not recorded yet.
- Correction and explanation in my own words: pending.
- Independent demonstration: not yet verified.

### Interview record

- Completed full mock count today: 0.
- Answer outline and feedback: pending.
- Scores and supporting examples: pending.
- Corrected answer: pending.

### Session handoff

- Date and focused minutes:
- Completed block:
- Remaining gap:
- Next exact step: begin today's assigned block when preceding work is ready.

---

