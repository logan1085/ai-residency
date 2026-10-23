# AI Learning and Interview Curriculum

The active plan follows Mark's supplied guide: **25 curriculum days, 100 hours**, with **one focused hour every calendar day** as the personal commitment. A curriculum day spans multiple study sessions. This replaces the earlier 30-session adaptation at this path.

Primary outcome: technical understanding for AI PM and applied AI work, interview judgment, and inspectable proof of work. Research scientist preparation is not the default.

[Exact daily activities and interview prompts](ai-pm-activity-guide.md) · [Current checkpoint and evidence](../progress/ai-pm-study-log.md) · [Question ledger](../progress/ai-pm-question-ledger.md) · [Tutor instructions](../learning/residency-coach.md)

## Master checklist

- [ ] Modeling, Days 1–9 / 27h: neural networks → transformers → MoE → pretraining → SFT → RL → PPO → alignment → reasoning.
- [ ] Agent academics, Days 10–13 / 12h: control/tools → retrieval/context → production controls → recovery.
- [ ] Dedicated building, Days 14–18 / 15h: grounded answers → tool loop → authorized actions → recovery → integration.
- [ ] Hardware and evals, Days 19–20 / 6h: serving mechanics → launch evidence.
- [ ] Interviews / 40h: one hour each curriculum day in Weeks 1–4, then five dedicated days.

## Daily schedule

| Day type | Learning or building | Interview preparation | Total |
| --- | --- | --- | --- |
| Academic, Days 1–13 and 19–20 | 20m overview + 100m assigned learning + 60m guided activity | 60m mock | 4h |
| Build, Days 14–18 | 180m building/testing | 60m mock | 4h |
| Final, Days 21–25 | No new academic/build assignment | Three 60m mocks + 60m targeted repair | 4h |

Each mock is **5m preparation + 45m interview + 10m review**. No tutoring during the 45-minute interview. Score framing, judgment, evidence and communication 1–5, plus technical correctness where relevant.

Weeks 1–4 each contain five interview hours; Week 5 contains 20. Total: **60h learning/building + 40h interview preparation**, comprising 35 full mocks and five repair hours. Behavioral, product sense, strategy, analytics and model judgment receive six full mocks each; technical receives five.

Breaks are outside active hours. Record actual focused minutes. At one hour per day, the plan requires approximately 100 study days. The five curriculum weeks are organizational groups, not five calendar weeks.

## Sequence and daily outputs

Week 1 = Days 1–5; Week 2 = Days 6–10; Week 3 = Days 11–15; Week 4 = Days 16–20; Week 5 = Days 21–25.

| Day | Focus | Required output | Independent interview | Status |
| --- | --- | --- | --- | --- |
| 1 | Neural networks | One gradient update; compare learning rates 0, .1, .5; draw prediction-to-loss flow | Behavioral: career pitch and decision under uncertainty | In progress; exercise and mock incomplete |
| 2 | Transformers | Attention calculation, causal mask, token loss; distinguish two softmax operations | Product sense: NYC transit disruption | Not assessed in this track |
| 3 | Mixture of experts | Router diagram; total/active parameters and memory calculation | Analytics: weekly active users down 15% | Not assessed in this track |
| 4 | Pretraining and generalization | Compute tradeoff, loss hypotheses/test, 150-word experiment recommendation | Strategy: project-management AI assistant | Not assessed in this track |
| 5 | Base model to assistant | Intervention choices, two SFT pairs, four evaluation questions | Technical: enterprise support assistant | Not assessed in this track |
| 6 | RL foundations | Decision tree, discounted returns, V/Q explanation | Model judgment: cheaper vs stronger model | Not assessed in this track |
| 7 | Policy gradients and PPO | Advantages, clipped objective calculations and sketch | Behavioral: disagreement and technical ownership | Not assessed in this track |
| 8 | Human feedback and alignment | SFT/PPO-RLHF/DPO comparison; reward exploitation counterexamples | Product sense: video creation | Not assessed in this track |
| 9 | Reasoning and verifiable rewards | GRPO advantages and comparison; verifier-failure experiment | Strategy: enterprise vs individual developers | Not assessed in this track |
| 10 | Agent control and tools | Fixed workflow vs agent loop; search contract and stop conditions | Analytics: activation up, paid conversion down | Not assessed in this track |
| 11 | Retrieval, context and memory | Retrieval diagram with permissions/freshness; diagnose three failures | Technical: multi-customer expansion | Not assessed in this track |
| 12 | Production controls and releases | Authorization/approval diagram; release bundle, pilot/rollback rules | Model judgment: benchmark vs pilot mismatch | Not assessed in this track |
| 13 | Recovery and observability | Idempotent write/retry/restart diagram and diagnostic log fields | Behavioral: owned failure or missed commitment | Not assessed in this track |
| 14 | Build: grounded answers | Five fictional policies, real model call, keyword retrieval, cited/unsupported answers | Product sense: hospital research coordinators | Not assessed in this track |
| 15 | Build: typed tools and loop | Validated search/draft tools, five-call cap, logs and stop-reason tests | Strategy: competitor bundles feature free | Not assessed in this track |
| 16 | Build: authorized actions | Role filtering, exact-draft approval, SQLite request IDs; no unapproved or duplicate writes | Analytics: usage/cost/retention and unit economics | Not assessed in this track |
| 17 | Build: recovery | Persist/resume state, bounded retries, cancellation, handoff, lost-response tests | Technical: duplicated customer action | Not assessed in this track |
| 18 | Build: integration and evidence | Integrated flow, six case types, five-minute demo, diagram and baseline copy | Model judgment: uncertain six-month capability investment | Not assessed in this track |
| 19 | Hardware and inference | Memory calculations, latency budget and trace-based bottleneck analysis | Behavioral: influence and team performance | Not assessed in this track |
| 20 | Evaluation and launch evidence | Eight new cases, four held out, baseline/change comparison and pilot/fix/wait memo | Product sense: B2B onboarding with reduced scope | Not assessed in this track |
| 21 | Interview loops | Three scorecards and three corrected answers | Strategy: new industry; analytics: low-N experiment; model judgment: uneven reliability | Not assessed in this track |
| 22 | Interview loops | Three scorecards and three corrected answers | Product: family care; technical: enterprise search; behavioral: stakeholder alignment | Not assessed in this track |
| 23 | Interview loops | Three scorecards and three corrected answers | Strategy: pricing; analytics: severe errors; model judgment: model vs inference tools | Not assessed in this track |
| 24 | Interview loops | Three scorecards and three corrected answers | Technical: service tiers; model judgment: multimodal readiness; behavioral: roadmap change | Not assessed in this track |
| 25 | Interview loops | Three scorecards, three corrected answers and remaining-gap summary | Product, strategy and analytics for one target company | Not assessed in this track |

## Sources and scope

The daily activities and interview cases are transcribed from the personal Notion curriculum built from Mark's supplied AI PM activity guide. The source sequence is 3Blue1Brown → Karpathy/Hugging Face → Anthropic/Sierra → build. Learning time includes pauses and explanations. Only named sections are assigned.

**Source gap:** the separate `AI_PM_Curriculum_Checklist.md` containing the assigned learning excerpts has not been supplied. Do not invent those assignments or mark assigned learning complete. The [activity guide](ai-pm-activity-guide.md) preserves the available exercise, completion check, interview and repair instructions.

Build one local Python notebook/CLI support assistant: five fictional policies, two roles, one provider, cited answers, ticket drafting, exact approval, SQLite idempotency and recovery. Follow the supplied scope: no cloud deployment, new framework or UI.

## Evidence and daily routine

Start with the current day/block, what is being learned, why it matters, and the output. Teach one question at a time. Preserve the original attempt before feedback.

At close, record actual minutes, calculations/code/diagrams, assistance, corrections, remaining gaps, and the exact next step. Distinguish planned, practiced with help, demonstrated independently, and applied. A day is complete only after its assigned learning/building, activity checks and interview/review are complete.

Existing research code and essays remain useful artifacts; their existence does not certify independent mastery in this track. The repository's original ten-module research curriculum remains available separately.

## Sync convention

This commit aligns the curriculum and study checkpoint with the personal Notion hub as of October 23, 2026. Sync is manual, not an automatic integration. At session close, update Notion records and these versioned progress documents from the same evidence, then push the changes. Do not advance from a reminder, a planning session, or an assistant-generated solution.
