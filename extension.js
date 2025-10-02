const { Range, Position, window, commands, workspace, languages, Diagnostic, DiagnosticSeverity } = require('vscode');
const jsonic = require('jsonic');

const fixText = (text, options) => {
  try {
    return {
      status: 'ok',
      text: JSON.stringify(jsonic(text), null, options.indentation)
    };
  } catch (e) {
    let result = { status: 'error', error: { message: e.message } };
    if (e.name === 'SyntaxError') {
      result.error = Object.assign({}, result.error, {
        line: e.line,
        column: e.column,
        foundLength: e.found.length,
        message: `(${e.line}, ${e.column}) ${result.error.message}`
      });
    }
    return result;
  }
};

const fix = options => (editor, edit) => {
  const { selection, document } = editor;
  const text = selection.isEmpty
    ? document.getText()
    : document.getText(selection);

  const indentation =
    workspace.getConfiguration('fixJson').get('indentationSpaces') ||
    workspace.getConfiguration('editor', document.uri).get('tabSize');
  const result = fixText(text, { indentation });
  if (result.status === 'ok') {
    edit.replace(
      selection.isEmpty
        ? new Range(new Position(0, 0), new Position(document.lineCount, 0))
        : selection,
      result.text
    );
    // Clear diagnostics on success
    options.diagnostics.set(document.uri, []);
  } else {
    window.setStatusBarMessage(`Fixing failed: ${result.error.message}`, 5000);
    const range = new Range(
      new Position(result.error.line - 1, result.error.column - 1),
      new Position(
        result.error.line - 1,
        result.error.column - 1 + result.error.foundLength
      )
    );
    const diag = new Diagnostic(range, result.error.message, DiagnosticSeverity.Error);
    options.diagnostics.set(document.uri, [diag]);
  }
};

function activate(context) {
  const diagnostics = languages.createDiagnosticCollection('fix-json');
  context.subscriptions.push(diagnostics);
  context.subscriptions.push(
    commands.registerTextEditorCommand('fixJson.fix', fix({ diagnostics }))
  );
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;

exports.fixText = fixText;
