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

      it('understands one-liner with text fields', function() {
        const source = `{ name: Ashley, lastName: de la Zouche, birthPlace: guess }`;
        const res = fixText(source, { indentation: 2 });
        assert.strictEqual(res.status, 'ok');
        assert.strictEqual(
          res.text,
          '{\n  "name": "Ashley",\n  "lastName": "de la Zouche",\n  "birthPlace": "guess"\n}'
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

  it('handles nested objects and arrays with relaxed input', function() {
    const source = `{
      a: { b: [1, { c: two }] },
      d: 3
    }`;
    const res = fixText(source, { indentation: 2 });
    assert.strictEqual(res.status, 'ok');
    assert.strictEqual(
      res.text,
      '{\n  "a": {\n    "b": [\n      1,\n      {\n        "c": "two"\n      }\n    ]\n  },\n  "d": 3\n}'
    );
  });

  it('understands strings with quotes', function() {
    const source = `{ text: "He said \\"hi\\"" }`;
    const res = fixText(source, { indentation: 2 });
    assert.strictEqual(res.status, 'ok');
    assert.strictEqual(
      res.text,
      '{\n  "text": "He said \\"hi\\""\n}'
    );
  });

  it('supports booleans, numbers, and null', function() {
    const source = `{ t: true, f: false, n: null, i: 1, f2: 1.5 }`;
    const res = fixText(source, { indentation: 2 });
    assert.strictEqual(res.status, 'ok');
    assert.strictEqual(
      res.text,
      '{\n  "t": true,\n  "f": false,\n  "n": null,\n  "i": 1,\n  "f2": 1.5\n}'
    );
  });

  it('formats empty structures', function() {
    const sourceObj = `{ }`;
    const resObj = fixText(sourceObj, { indentation: 2 });
    assert.strictEqual(resObj.status, 'ok');
    assert.strictEqual(resObj.text, '{}');

    const sourceArr = `[ ]`;
    const resArr = fixText(sourceArr, { indentation: 2 });
    assert.strictEqual(resArr.status, 'ok');
    assert.strictEqual(resArr.text, '[]');
  });

  it('errors on mismatched brackets', function() {
    const bad = `{ a: [1, 2} }`;
    const res = fixText(bad, { indentation: 2 });
    assert.strictEqual(res.status, 'error');
    assert.ok(res.error && typeof res.error.message === 'string');
  });
});
