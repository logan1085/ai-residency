# Day 1: Write a Transformer From Scratch

Day 1 should be hands-on, but not buried in details from the first minute. The reference implementation exists so you have a destination and tests, but the main work is to understand the transformer story, then write the model yourself.

## Outcome

By the end of Day 1, you should be able to say:

> I can write a minimal GPT-style transformer, run it on token IDs, explain every tensor shape, and generate next tokens.

## Agenda

| Block | Time | Focus | Output |
| --- | --- | --- | --- |
| Big Picture | 20 min | Understand the transformer as tokens in, context mixing, next-token scores out. | One-paragraph explanation. |
| Architecture Map | 25 min | Identify embeddings, attention, feed-forward blocks, logits, and generation. | Diagram notes. |
| Scratch Build | 90 min | Implement config, attention, feed-forward, block, model, and generation. | Personal transformer implementation. |
| Test and Compare | 45 min | Run smoke tests, compare against the reference, fix shape or mask errors. | Passing tests or a clear bug list. |
| Explain | 30 min | Write a short explanation of how next-token prediction works. | Work-log entry and open questions. |

## Learning Modes

- **Map:** Start here. Build the conceptual picture before details.
- **Studio:** Write code in small chunks once the map feels clear.
- **Debug:** Use tensor shapes and tests when something breaks.
- **Reflect:** Explain what happened and capture open questions.

## Implementation Order

1. `TransformerConfig`
2. token and positional embeddings
3. causal self-attention
4. feed-forward network
5. transformer block
6. final layer norm and language-model head
7. loss computation
8. autoregressive `generate`

## Guardrails

- Do the first pass from memory and notes.
- Use the reference implementation only when blocked or when comparing after the first pass.
- When something breaks, write down the exact tensor shape you expected and the tensor shape you got.
- If the session gets too detailed, zoom back out to the transformer story before continuing.
- Do not optimize for elegance on Day 1. Optimize for understanding.

## Day 1 Deliverables

- [ ] Personal scratch transformer implementation.
- [ ] Passing smoke tests or a written list of the remaining failing cases.
- [ ] One-paragraph big-picture explanation.
- [ ] Shape notes for the parts that were confusing or broken.
- [ ] Five-sentence explanation of next-token prediction.
- [ ] Three open questions for Day 2.

## Suggested Work-Log Entry

```markdown
## YYYY-MM-DD

### Session Goal

Write a minimal GPT-style transformer from scratch.

### What I Built or Studied

- Implemented:
- Debugged:
- Compared against reference:

### Evidence

- Tests:
- Files:
- Notes:

### Open Questions

- 
```
