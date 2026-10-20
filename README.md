# AI Research Residency

A public, first-person AI residency. Transformers, reinforcement learning,
evals, agent systems. Worked through in code instead of summarized from
reading.

The rule this repo runs on is that every stretch of work leaves something
inspectable behind. Code that runs, a result someone can argue with, or a
write-up that admits what did not work. If a week produces no artifact, it did
not really happen.

## What is in here

| Artifact | Where | What it is |
| --- | --- | --- |
| Transformer from scratch | [`src/transformer_from_scratch.py`](src/transformer_from_scratch.py) | A 470,528-parameter GPT-style model. Embeddings, causal self-attention, pre-norm blocks, LM head, generation, plus [smoke tests](tests/test_transformer_from_scratch.py) |
| Policy iteration explainer | [`policy-iteration/`](policy-iteration) | Policy evaluation and improvement in a grid world, stepped through by hand, built on Professor George A. Lentzas's example from his Columbia Business School course. Live at [policy-iteration.vercel.app](https://policy-iteration.vercel.app) |
| Curriculum | [`docs/curriculum/`](docs/curriculum/index.md) | Ten modules, foundations through systems, evals, and deployment |
| AI PM interviews | [`100-hour study and interview outline`](docs/curriculum/ai-pm-interviews.md) | 20 technical study units (60 hours), interview preparation (40 hours), and a supplemental exercise bank |
| Progress | [`docs/progress/`](docs/progress/index.md) | Work log, rubric, session agendas |

## Write-ups

The code is the record. These are the explanations.

- [I Wrote a Transformer by Hand](https://www.loganzev.com/writing/transformer-from-scratch).
  The full walk through the implementation above, with diagrams for the forward
  pass, one attention head, and the causal mask, plus the shapes that make it
  click.
- [The Grading Room](https://www.loganzev.com/projects/ai-evals-lab). The public
  artifact for the evals work. Eight agent transcripts, a three-way rubric, and
  the disagreements that show where a rubric is underwritten.
- [AI Research Residency](https://www.loganzev.com/ai-research-residency). Where
  the whole thing is up to, including what I am working through now.

## Where this is up to

Current learning is **Day 1: neural nets**, following the [study checklist](docs/curriculum/ai-pm-interviews.md). Foundations are learning goals, not established as complete.

The repo contains a transformer implementation, tests, and a policy-iteration explainer. These artifacts do not by themselves demonstrate independent understanding. Prior exposure to GRPO and RL post-training remains material to revisit; progress and mastery need evidence from explanations and applied work.

## Local development

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

The curriculum source PDF is tracked at
`docs/assets/pdfs/thoughtful-labs-ai-research-curriculum.pdf`.
