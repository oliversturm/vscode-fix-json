# Change Log

All notable changes to the "fix-json" extension will be documented in this file.

## [Unreleased]

## [0.2.0] - 2025-10-02

### Added
- Document formatting integration for JSON via `DocumentFormattingEditProvider`.
- Theme-aware error reporting using VS Code Diagnostics (squiggles).
- GitHub Actions: CI (lint/test/package) and Release (package/publish/tagged builds).
- Unit tests for core logic (`lib/fixText.js`) using Mocha.
- Badges and installation/usage documentation updates in `README.md`.

### Changed
- Modernized to VS Code engine `^1.75.0`; removed explicit `onCommand` activation (auto-generated).
- Menus added for command discoverability in editor context/title for JSON.
- ESLint updated to v9 flat config; legacy `.eslintrc.json` removed.
- Packaging scripts updated to use `@vscode/vsce` locally via npm scripts.

### Notes
- JSONC (JSON with comments) is currently not targeted; the extension focuses on JSON only.

## [0.1.2] - 2017-11-30

* Initial release
