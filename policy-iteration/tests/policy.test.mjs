import test from 'node:test';
import assert from 'node:assert/strict';
import { STATES, initValues, improvePolicy, evaluatePolicyCounted, finishRun, completionStatus } from '../lib/policy.ts';
const initial = () => Object.fromEntries(STATES.map(s => [s, s === '1' ? 'right' : 'up']));
test('a changed improvement pass is not described as stable', () => {
  const p = initial();
  const base = evaluatePolicyCounted(p);
  const next = improvePolicy(p, base.values);
  assert.deepEqual(next.changed, ['12', '15']);
  assert.equal(next.policy['12'], 'down');
  assert.equal(next.policy['15'], 'right');
  assert.match(completionStatus('improved', 1, 69), /^1 round completed; policy changed/);
  assert.doesNotMatch(completionStatus('improved', 1, 69), /Stable/);
});
test('skipping evaluation preserves every direction and performs no improvement rounds', () => {
  const p = initial();
  const result = finishRun(p, initValues(), false);
  assert.deepEqual(result.policy, p);
  assert.equal(result.rounds, 0);
  assert.equal(result.result, 'scored');
  assert.equal(result.total, 67);
});
test('full run counts the final no-change pass and has a stable greedy policy', () => {
  const result = finishRun(initial(), initValues(), true);
  assert.equal(result.result, 'stable');
  assert.equal(result.rounds, 6);
  assert.deepEqual(improvePolicy(result.policy, result.values).changed, []);
  assert.match(completionStatus(result.result, result.rounds, result.total), /^Stable after 6 rounds/);
  const resumed = finishRun(result.policy, result.values, true, result.rounds - 1, 0);
  assert.equal(resumed.rounds, 6);
});
test('round cap retains matching policy values and never claims stability', () => {
  const result = finishRun(initial(), initValues(), true, 0, 0, 1);
  assert.equal(result.result, 'limit');
  assert.equal(result.rounds, 1);
  assert.equal(result.policy['12'], 'down');
  assert.equal(result.values['12'], 0);
  assert.match(completionStatus(result.result, 1, result.total), /stability not confirmed/);
});
