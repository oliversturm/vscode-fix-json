const jsonic = require('jsonic');

function fixText(text, options) {
  const indentation = options && typeof options.indentation === 'number' ? options.indentation : 2;
  try {
    return {
      status: 'ok',
      text: JSON.stringify(jsonic(text), null, indentation)
    };
  } catch (e) {
    let result = { status: 'error', error: { message: e.message } };
    if (e.name === 'SyntaxError') {
      result.error = Object.assign({}, result.error, {
        line: e.line,
        column: e.column,
        foundLength: e.found && typeof e.found.length === 'number' ? e.found.length : 1,
        message: `(${e.line}, ${e.column}) ${result.error.message}`
      });
    }
    return result;
  }
}

module.exports = fixText;
