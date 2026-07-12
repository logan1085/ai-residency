# Module 2: Training and Evaluation

Module 2 turns architecture into evidence by teaching residents to train models reproducibly and compare results honestly.

## Learning Objectives

- Build a minimal training loop with batching, optimizer steps, validation, and checkpointing.
- Interpret loss curves and diagnose underfitting, overfitting, and instability.
- Compare model variants with controlled experiments.
- Maintain experiment notes that another researcher can reproduce.

## Subtopics

- Dataset splits and leakage prevention.
- Cross-entropy loss and perplexity.
- Optimizers, learning rates, warmup, and weight decay.
- Gradient clipping and mixed precision.
- Checkpointing, seeds, and run metadata.
- Baselines, ablations, and comparison tables.

## Assignments

- Train the Module 1 transformer on a small corpus.
- Log train and validation loss every fixed number of steps.
- Run at least three controlled hyperparameter experiments.
- Write a short failure analysis for the weakest run.

## Projects

- Build a reusable training script for language-model experiments.
- Add checkpoint resume support.
- Produce a small model card for the trained baseline.

## Proof of Mastery

- Reproducible command, config, seed, and commit hash.
- Loss curves for baseline and variants.
- A table explaining which change improved or degraded validation loss.
- A saved checkpoint with documented limitations.
