# AI PM Study and Interview Curriculum

The active outline follows the user-provided checklist: **60 hours of technical study across Days 1–20, followed by 40 hours of interview preparation — 100 hours total.** It supersedes the earlier 30-session, 30-hour adaptation. Days identify study units, not calendar dates; no weekly attendance or completion date is committed.

This sits alongside the [research residency modules](index.md). Those modules are a reference library and longer-term learning goals, not prerequisites already mastered.

## Source and limits

The user asked to follow Mark Cinali’s guide. The supplied checklist establishes the phase order, day ranges, and hours below. The full guide and its exact daily activities were unavailable for verification. This page does **not** claim to reproduce them. Exact readings, videos, exercises, and the guide’s week-by-week boundaries remain unverified; do not fill those gaps with invented guide content.

The [previous adaptation and exercise bank](ai-pm-exercise-bank.md) preserves the useful prompts, exercises, six mock formats, scoring rubric, and role-specific extensions. They are supplemental suggestions authored for this repo, not assignments verified against Mark’s guide. Their session numbers do not map directly to the checklist’s days, and their old six-week schedule is superseded.

## Current learning status

**Day 1: neural nets — in progress.** Foundations are not established as complete. Existing transformer code, tests, and the policy-iteration explainer are artifacts to inspect, not proof of independent understanding. Use a teach-back and recorded evidence to establish what is understood and what needs repair. See the [current Day 1 agenda](../progress/day-01.md) and [progress dashboard](../progress/index.md).

## Checklist and time budget

| Phase | Study units | Planned active time | Status | Exact guide activities |
| --- | --- | --- | --- | --- |
| Modeling | Days 1–9 | 27 hours | Day 1 neural nets in progress; remaining units not verified complete | Unavailable; Day 1 topic confirmed by current learning context |
| Agents | Days 10–13 | 12 hours | Planned | Unavailable |
| Building | Days 14–18 | 15 hours | Planned | Unavailable |
| Hardware / evals | Days 19–20 | 6 hours | Planned | Unavailable |
| Interviews | No day range supplied | 40 hours | Planned | Exact activities and allocation unavailable |
| **Total** | **20 technical study units + interview preparation** | **100 hours** | **Completion not established** | |

The technical phases imply three planned active hours per numbered study unit: 9 × 3 + 4 × 3 + 5 × 3 + 2 × 3 = 60 hours. A unit can span multiple sittings. Record actual time separately; a planned budget is neither elapsed study nor a calendar commitment. The checklist does not specify interview days or a weekly cadence.

## Working through the phases

The references and suggested evidence below help make progress inspectable while the exact guide is unavailable. They are **local support material, not a reconstructed daily activity guide**. Do not assign their topics to particular days beyond the confirmed Day 1 neural-nets starting point.

### Modeling — Days 1–9, 27 hours

Begin with neural nets: explain inputs, weights, activations, predictions, and loss; distinguish learning from inference. Record gaps before moving deeper.

Reference material: [transformers](modules/module-01-transformers.md), [training and evaluation](modules/module-02-training-evaluation.md), and [alignment and safety](modules/module-07-alignment-safety.md). The exercise bank’s Sessions 1–9 offer supplemental model explanations, approach selection, and post-training questions.

Suggested evidence: an unaided explanation, a small worked example, and a list of corrections after feedback. Existing implementation artifacts can support the explanation once personally understood.

### Agents — Days 10–13, 12 hours

Reference material: [data, embeddings, and RAG](modules/module-03-data-embeddings-rag.md) and [agents and tools](modules/module-04-agents-tools.md). Exercise-bank Sessions 11–14 cover retrieval, memory, tool contracts, authorization, and recovery.

Suggested evidence: a workflow diagram and success/failure traces showing where retrieval, tools, permissions, and human escalation belong.

### Building — Days 14–18, 15 hours

Exercise-bank Sessions 16–20 preserve a scoped internal-document assistant example, including baseline outputs, retrieval comparison, a tool loop, failure cases, and a pilot decision. This is an optional project choice within the phase; the checklist alone does not establish Mark’s required project.

Suggested evidence: a reproducible prototype or explicitly labeled simulation, a comparison on fixed cases, and a record of what was personally implemented. Use synthetic or shareable inputs. A production deployment is not a completion requirement established by the supplied checklist.

### Hardware / evals — Days 19–20, 6 hours

Reference material: [systems and deployment](modules/module-09-systems-deployment.md) and [evaluation and observability](modules/module-06-evaluation-observability.md). Exercise-bank Sessions 21–24 offer serving, economics, metrics, and model-selection practice.

Suggested evidence: a latency/cost budget with assumptions, a small evaluation set, failure analysis, and a conditional launch recommendation.

### Interviews — 40 hours

Keep the full 40-hour budget separate from the 60 technical hours. The supplied checklist does not establish an exact split among preparation, practice, feedback, and retries, or a required number of mocks per interview type. Record those allocations as they are chosen; do not double-count technical study as interview time.

Use the exercise bank’s technical/system design, product design, strategy, execution, analytical, and behavioral prompts, plus Sessions 26–30 for experience stories and synthesis. Its six one-hour mock formats and scoring rubric are reusable starting points, not the entirety of this 40-hour block or a verified guide prescription. Any additional role-specific work should have its time explicitly assigned within the budget or labeled extra.

Suggested evidence: scored answers, feedback, retries, and an evidence index that distinguishes personal decisions from assisted or reference work. Never invent experience or outcome metrics.

## Review and completion

At the end of each study unit, record actual active time, what was attempted, an artifact or explanation, corrections, and unresolved questions. Review at phase boundaries; if a weekly review is useful, choose its timing separately. There is no fixed six-week calendar here.

- Can I explain this without hints?
- Can I apply it to a concrete problem?
- Can I defend the decision under follow-up questions?
- What evidence supports progress, and what still needs repair?

Completing hours does not establish mastery or interview readiness. The exercise bank’s provisional readiness check — two consecutive full mocks with every rubric dimension at least 2 and no unresolved major technical error — is a local assessment suggestion, not a guarantee or a guide requirement. Re-test weak areas and preserve unresolved gaps.

## Study record

```markdown
### Day / interview block:
Topic:
Status: not started / in progress / needs repair / demonstrated
Actual active time:
Artifact or evidence link:
My explanation before feedback:
Main correction:
My revised explanation:
Rubric scores (when applicable):
Unresolved questions:
Next step:
```

Leave past units unverified until there is evidence. Do not publish confidential interview questions, employer data, private feedback, or unsupported claims.
