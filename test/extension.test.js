// Mocha tests for fixText
const assert = require('assert');
const fixText = require('../lib/fixText');

describe('fixText', function() {
  it('formats relaxed JSON object with default indentation (2)', function() {
    const source = `{
      int: 42,
      text: some text
    }`;
    const res = fixText(source, { indentation: 2 });
    assert.strictEqual(res.status, 'ok');
    assert.strictEqual(
      res.text,
      '{\n  "int": 42,\n  "text": "some text"\n}'
    );
  });

  it('respects indentation override (4 spaces)', function() {
    const source = `{ a: 1, b: 2 }`;
    const res = fixText(source, { indentation: 4 });
    assert.strictEqual(res.status, 'ok');
    assert.strictEqual(
      res.text,
      '{\n    "a": 1,\n    "b": 2\n}'
    );
  });

  it('returns error with line/column on syntax error', function() {
    // this unterminated array forces an error
    const bad = `{
      items: [1, 2
    }`;
    const res = fixText(bad, { indentation: 2 });
    assert.strictEqual(res.status, 'error');
    // Ensure we have message and some location info
    assert.ok(res.error && typeof res.error.message === 'string');
    assert.ok(typeof res.error.line === 'number');
    assert.ok(typeof res.error.column === 'number');
  });
});
