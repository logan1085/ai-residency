# Curriculum Overview

The residency is organized as ten modules. The sequence moves from mechanistic understanding to independent research execution: implement the core machinery, train and evaluate systems, extend them into retrieval and agent workflows, then complete a capstone with publication-quality documentation.

[Download the curriculum source PDF](../assets/pdfs/thoughtful-labs-ai-research-curriculum.pdf){ .md-button .md-button--primary }
[Open the roadmap](roadmap.md){ .md-button }

<div class="curriculum-grid">
  <div class="module-card">
    <h3><a href="modules/module-01-transformers/">1. Transformers From Scratch</a></h3>
    <p><span class="badge foundation">Foundation</span> Attention, tokenization, decoding, and a runnable minimal transformer.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-02-training-evaluation/">2. Training and Evaluation</a></h3>
    <p><span class="badge foundation">Foundation</span> Optimization, loss curves, experiment hygiene, and model comparison.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-03-data-embeddings-rag/">3. Data, Embeddings, and RAG</a></h3>
    <p><span class="badge foundation">Foundation</span> Dataset design, vector search, retrieval quality, and grounded generation.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-04-agents-tools/">4. Agents and Tool Use</a></h3>
    <p><span class="badge ship">Systems</span> Tool contracts, planning loops, memory, and resilient agent workflows.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-05-multimodal-systems/">5. Multimodal Systems</a></h3>
    <p><span class="badge ship">Systems</span> Vision-language models, audio/text pipelines, and interface design.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-06-evaluation-observability/">6. Evaluation and Observability</a></h3>
    <p><span class="badge research">Research</span> Benchmarks, judge models, tracing, error taxonomies, and regression gates.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-07-alignment-safety/">7. Alignment and Safety</a></h3>
    <p><span class="badge research">Research</span> Preference learning, red teaming, policy design, and risk documentation.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-08-research-methods/">8. Research Methods</a></h3>
    <p><span class="badge research">Research</span> Literature reviews, replication, ablations, and research memos.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-09-systems-deployment/">9. Systems and Deployment</a></h3>
    <p><span class="badge ship">Systems</span> Serving, latency, monitoring, cost, and release operations.</p>
  </div>
  <div class="module-card">
    <h3><a href="modules/module-10-capstone/">10. Capstone</a></h3>
    <p><span class="badge ship">Portfolio</span> A complete research artifact with demo, evaluation, and write-up.</p>
  </div>
</div>

## AI PM Interview Track

Follow the [100-hour study and interview outline](ai-pm-interviews.md): modeling Days 1–9 (27 hours), agents Days 10–13 (12 hours), building Days 14–18 (15 hours), hardware/evals Days 19–20 (6 hours), then interviews (40 hours). Current learning is Day 1 neural nets; completion of the research modules above is not established. Exact activities from Mark Cinali’s guide remain unverified. The earlier 30-hour adaptation is retained as a supplemental exercise bank.

## Operating Rhythm

Each module should produce a pull request or release note with the same structure:

- What was learned.
- What was implemented.
- What evidence supports the result.
- What remains uncertain.
