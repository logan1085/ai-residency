import torch

from src.transformer_from_scratch import TinyTransformerLM, TransformerConfig, count_parameters


def test_forward_shape_and_loss() -> None:
    config = TransformerConfig(vocab_size=32, context_length=8, n_layers=1, n_heads=2, d_model=16, d_ff=32, dropout=0.0)
    model = TinyTransformerLM(config)
    idx = torch.randint(0, config.vocab_size, (3, 8))
    logits, loss = model(idx, targets=idx)

    assert logits.shape == (3, 8, config.vocab_size)
    assert loss is not None
    assert loss.item() > 0
    assert count_parameters(model) > 0


def test_generate_appends_tokens() -> None:
    config = TransformerConfig(vocab_size=16, context_length=4, n_layers=1, n_heads=2, d_model=16, d_ff=32, dropout=0.0)
    model = TinyTransformerLM(config)
    prompt = torch.randint(0, config.vocab_size, (1, 3))
    generated = model.generate(prompt, max_new_tokens=5)

    assert generated.shape == (1, 8)
