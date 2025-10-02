const { Range, Position, window, commands, workspace, languages, Diagnostic, DiagnosticSeverity, TextEdit } = require('vscode');
const fixText = require('./lib/fixText');

// Helpers shared by command and formatting provider
const getIndentation = (document, formattingOptions) => {
  const override = workspace.getConfiguration('fixJson').get('indentationSpaces');
  if (override != null) return override;
  if (formattingOptions && typeof formattingOptions.tabSize === 'number') return formattingOptions.tabSize;
  return workspace.getConfiguration('editor', document.uri).get('tabSize');
};

const fullDocumentRange = document => new Range(new Position(0, 0), new Position(document.lineCount, 0));

const createDiagnosticFromError = (document, error) => {
  const start = new Position(Math.max(0, (error.line || 1) - 1), Math.max(0, (error.column || 1) - 1));
  const end = new Position(start.line, start.character + (error.foundLength || 1));
  return new Diagnostic(new Range(start, end), error.message, DiagnosticSeverity.Error);
};

const fix = options => (editor, edit) => {
  const { selection, document } = editor;
  const text = selection.isEmpty
    ? document.getText()
    : document.getText(selection);

  const indentation = getIndentation(document, null);
  const result = fixText(text, { indentation });
  if (result.status === 'ok') {
    const targetRange = selection.isEmpty ? fullDocumentRange(document) : selection;
    edit.replace(targetRange, result.text);
    // Clear diagnostics on success
    options.diagnostics.set(document.uri, []);
  } else {
    window.setStatusBarMessage(`Fixing failed: ${result.error.message}`, 5000);
    const diag = createDiagnosticFromError(document, result.error);
    options.diagnostics.set(document.uri, [diag]);
  }
};

function activate(context) {
  const diagnostics = languages.createDiagnosticCollection('fix-json');
  context.subscriptions.push(diagnostics);
  context.subscriptions.push(
    commands.registerTextEditorCommand('fixJson.fix', fix({ diagnostics }))
  );

  // Register a document formatting provider for JSON only
  const provider = languages.registerDocumentFormattingEditProvider(
    [{ language: 'json' }],
    {
      provideDocumentFormattingEdits(document, options, token) {
        const indentation = getIndentation(document, options);
        const result = fixText(document.getText(), { indentation });
        if (result.status === 'ok') {
          diagnostics.set(document.uri, []);
          const fullRange = fullDocumentRange(document);
          return [TextEdit.replace(fullRange, result.text)];
        } else {
          window.setStatusBarMessage(
            `Fixing failed: ${result.error.message}`,
            5000
          );
          const diag = createDiagnosticFromError(document, result.error);
          diagnostics.set(document.uri, [diag]);
          return [];
        }
      }
    }
  );
  context.subscriptions.push(provider);
}
exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;

exports.fixText = fixText;
