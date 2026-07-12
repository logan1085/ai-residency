# Module 6: Evaluation and Observability

Module 6 makes quality measurable by combining offline evals, online traces, monitoring, and regression gates.

## Learning Objectives

- Choose evaluation metrics that match product and research goals.
- Build a reusable evaluation harness.
- Use traces and logs to debug model behavior.
- Gate changes with regression tests.

## Subtopics

- Unit tests, task evals, and human review.
- LLM-as-judge design and calibration.
- Golden datasets and adversarial cases.
- Observability, traces, spans, and metadata.
- Regression gates and scorecards.
- Cost, latency, and reliability tracking.

## Assignments

- Create a baseline eval for one prior project.
- Add at least ten adversarial examples.
- Compare automated judge scores against manual labels.
- Define release criteria for a model or prompt change.

## Projects

- Build an eval dashboard for the RAG or agent project.
- Add CI checks for deterministic parts of the system.
- Create a weekly quality report template.

## Proof of Mastery

- Versioned eval dataset.
- Evaluation script with documented metrics.
- Trace examples showing root-cause analysis.
- Regression gate that catches a known bad change.
