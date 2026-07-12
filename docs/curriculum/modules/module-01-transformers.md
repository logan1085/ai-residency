# Module 1: Transformers From Scratch

Module 1 builds a mechanistic understanding of modern language models by implementing the core transformer pieces directly.

## Learning Objectives

- Explain why self-attention can route information across a context window.
- Implement scaled dot-product attention, causal masking, multi-head attention, residual connections, layer normalization, and a feed-forward block.
- Trace tensor shapes through a GPT-style forward pass.
- Connect architecture choices to training stability and generation behavior.

## Subtopics

- Tokenization and context windows.
- Token and positional embeddings.
- Query, key, value projections.
- Causal masks and autoregressive decoding.
- Multi-head attention and representation subspaces.
- Residual streams, normalization, MLP blocks, and logits.

## Assignments

- Write a tiny transformer from scratch before leaning on the reference implementation.
- Use [`src/transformer_from_scratch.py`](https://github.com/logan1085/ai-residency/blob/main/src/transformer_from_scratch.py) as the reference only after the first implementation pass.
- Reproduce the tensor shapes for one batch by hand.
- Run the smoke tests and record parameter count, logits shape, and loss.
- Modify `n_heads`, `d_model`, and `context_length`; document which combinations are valid.

## Projects

- Train the tiny transformer on a short text corpus.
- Add top-k or nucleus sampling to the `generate` method.
- Create a notebook that visualizes attention weights across tokens.

## Proof of Mastery

- A written walkthrough explaining each class in the implementation.
- A personal scratch implementation or annotated diff showing what was written independently.
- Passing tests for forward shape, loss computation, and generation.
- A diagram-level explanation using the [transformer architecture diagram](../../assets/images/transformer-from-scratch.svg).
- A short demo showing generation before and after training.

## Linked Assets

- [Transformer implementation](https://github.com/logan1085/ai-residency/blob/main/src/transformer_from_scratch.py)
- [Architecture diagram](../../assets/images/transformer-from-scratch.svg)
- [Code guide](../../code/transformer-from-scratch.md)
