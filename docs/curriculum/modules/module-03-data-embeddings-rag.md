# Module 3: Data, Embeddings, and RAG

Module 3 focuses on grounding model outputs in external knowledge through high-quality datasets, embeddings, retrieval, and generation.

## Learning Objectives

- Design clean document ingestion pipelines.
- Explain embedding spaces, similarity search, chunking, and retrieval tradeoffs.
- Build a retrieval-augmented generation workflow with citations.
- Evaluate retrieval quality separately from generation quality.

## Subtopics

- Data collection, cleaning, deduplication, and metadata.
- Chunking strategies and overlap.
- Embedding model selection.
- Vector indexes and hybrid search.
- Reranking and context assembly.
- Grounded answers, citations, and abstention.

## Assignments

- Build a document corpus from residency notes and module pages.
- Create a small golden set of questions and source passages.
- Compare two chunking strategies.
- Report retrieval precision at top-k.

## Projects

- Ship a curriculum Q&A assistant over this repository.
- Add citations linking back to source module pages.
- Add an answerability classifier or abstention rule.

## Proof of Mastery

- Ingestion script with repeatable output.
- Evaluation set with expected passages.
- Retrieval metrics and error taxonomy.
- Demo answering questions with grounded citations.
