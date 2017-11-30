const { Range, Position, window, commands, workspace } = require('vscode');
const jsonic = require('jsonic');

const fixText = (text, options) => {
  try {
    return {
      status: 'ok',
      text: JSON.stringify(jsonic(text), null, options.indentation)
    };
  } catch (e) {
    let result = { status: 'error', error: e.message };
    if (e.name === 'SyntaxError') {
      result = Object.assign({}, result, {
        line: e.line,
        column: e.column,
        error: `(${e.line}, ${e.column}) ${result.error}`
      });
    }
    return result;
  }
};

const fix = (editor, edit) => {
  const { selection, document } = editor;
  const text = selection.isEmpty
    ? document.getText()
    : document.getText(selection);

  const indentation = workspace
    .getConfiguration('fixJson')
    .get('indentationSpaces');
  const fixedText = fixText(text, { indentation });
  if (fixedText.status === 'ok') {
    edit.replace(
      selection.isEmpty
        ? new Range(new Position(0, 0), new Position(document.lineCount, 0))
        : selection,
      fixedText.text
    );
  } else {
    window.showInformationMessage(`Fixing failed: ${fixedText.error}`);
  }
};

function activate(context) {
  let disposable = commands.registerTextEditorCommand('fixJson.fix', fix);
  context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;

exports.fixText = fixText;
