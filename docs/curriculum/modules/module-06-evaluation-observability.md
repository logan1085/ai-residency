# Module 6: Evaluation and Observability

Module 6 makes quality measurable by combining offline evals, online traces, monitoring, and regression gates.

## Learning Objectives

- Choose evaluation metrics that match product and research goals.
- Build a reusable evaluation harness.
- Use traces and logs to debug model behavior.
- Gate changes with regression tests.
- Write a rubric precise enough that two graders reach the same verdict.

## Subtopics

- Unit tests, task evals, and human review.
- LLM-as-judge design and calibration.
- Golden datasets and adversarial cases.
- Grader agreement, and what disagreement tells you about the rubric.
- Failures an output-only eval cannot see: reward hacking, right answers by the wrong method, over-refusal.
- Observability, traces, spans, and metadata.
- Regression gates and scorecards.
- Cost, latency, and reliability tracking.

## Assignments

- Create a baseline eval for one prior project.
- Add at least ten adversarial examples.
- Compare automated judge scores against manual labels.
- Grade a set of traces yourself, then have someone else grade the same set and measure where you disagree.
- Define release criteria for a model or prompt change.

## Projects

- Build an eval dashboard for the RAG or agent project.
- Add CI checks for deterministic parts of the system.
- Create a weekly quality report template.

## Public artifact

[The Grading Room](https://www.loganzev.com/projects/ai-evals-lab) is the shipped
version of this module. Eight agent transcripts with full tool-call traces, a
three-way rubric, and reference grades with reasoning. Two of the cases are
marked contested, because competent graders genuinely split on them, and
pretending otherwise is the dishonest part.

The cases were chosen so each one teaches a failure that grading the final
output alone would miss:

- a fabricated citation wrapped in accurate, carefully hedged prose
- a coding agent that turns the suite green by editing the assertion
- an analytics agent that answers correctly from a stale recollection after its query times out
- a refusal that withholds an answer the agent had already found
- an agent that errs mid-trace, catches it, and reports the limitation
- a partial migration that names exactly what it did not do

## Proof of Mastery

- Versioned eval dataset.
- Evaluation script with documented metrics.
- Trace examples showing root-cause analysis.
- Regression gate that catches a known bad change.
- A rubric, plus the list of cases where careful graders still disagreed with it.
