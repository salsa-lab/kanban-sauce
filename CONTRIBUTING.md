# Contributing to Kanban Sauce

Thanks for your interest in contributing to Kanban Sauce! This guide will help you get started.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v22+)
- [VS Code](https://code.visualstudio.com/) (v1.85.0+)
- [pnpm](https://pnpm.io/) (v11+)

### Setup

1. Fork and clone the repository:

   ```sh
   git clone https://github.com/<your-username>/kanban-sauce.git
   cd kanban-sauce
   ```

2. Install dependencies:

   ```sh
   pnpm install
   ```

3. Start the development watcher:

   ```sh
   pnpm dev
   ```

4. Press `F5` in VS Code to launch the Extension Development Host.

## Project Structure

```
├── src/
│   ├── extension/       # VS Code extension host (Node.js)
│   │   ├── index.ts     # Extension entry point & command registration
│   │   ├── KanbanPanel.ts
│   │   ├── SidebarViewProvider.ts
│   │   ├── BoardsTreeProvider.ts
│   │   ├── InProgressTreeProvider.ts
│   │   ├── FeatureHeaderProvider.ts
│   │   ├── boardConfig.ts
│   │   ├── featureFileUtils.ts
│   │   └── l10n.ts
│   ├── shared/          # Types and utilities shared between extension and webview
│   │   ├── types.ts
│   │   ├── featureFrontmatter.ts
│   │   ├── epicColor.ts
│   │   └── epicLane.ts
│   └── webview/         # React 19 frontend (Vite 7 + Tailwind CSS + Zustand + MDXEditor)
│       ├── App.tsx
│       ├── main.tsx
│       ├── components/
│       ├── lib/
│       └── store/
├── l10n/                # Localization bundles (en, es, pt)
├── resources/           # Extension icons and .kanbansauce JSON schema
├── scripts/             # Build, release, and localization check scripts
└── tests/               # Unit, component (Vitest), and integration (Mocha/VS Code) tests
```

- **Extension Host** is bundled with esbuild (`pnpm run build:extension`)
- **Webview UI** is bundled with Vite (`pnpm run build:webview`)

## Development

### Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Watch mode for both extension and webview |
| `pnpm build` | Production build (`build:extension` + `build:webview`) |
| `pnpm lint` | Run ESLint across `src/` |
| `pnpm typecheck` | Run TypeScript type checking (`tsc --noEmit`) |
| `pnpm test` | Run unit and React component tests with Vitest |
| `pnpm test:watch` | Run Vitest in interactive watch mode |
| `pnpm test:coverage` | Run Vitest with V8 code coverage report |
| `pnpm test:integration` | Build and run VS Code Extension Host integration tests |
| `pnpm check-l10n` | Verify that all locale bundles (`l10n/` and `package.nls.*.json`) are in sync |
| `pnpm package` | Package the extension into `releases/*.vsix` |

### Testing

- **Unit & Component Tests:** Located under `tests/shared/`, `tests/extension/`, and `tests/webview/`. Powered by Vitest 5, Testing Library, and `jsdom`. Run with `pnpm test`.
- **Integration Tests:** Located under `tests/integration/`. Runs inside a real headless VS Code instance via `@vscode/test-electron` and Mocha. Run with `pnpm test:integration` (requires building the extension first via `pnpm run build:extension`).
- **Localization Checks:** If you add or modify user-facing strings, update `l10n/bundle.l10n.*.json` and `package.nls.*.json`, then verify with `pnpm check-l10n`.

### Code Style

- **Prettier** is configured — single quotes, no semicolons, 100 char line width
- **2-space indentation**, UTF-8, LF line endings
- Run `pnpm lint` and `pnpm typecheck` before submitting a PR

## Submitting Changes

1. Create a branch from `main`:

   ```sh
   git checkout -b my-feature
   ```

2. Make your changes and verify they pass all checks:

   ```sh
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm check-l10n
   pnpm build
   ```

3. Commit your changes with a clear message:

   ```
   feat: add drag-and-drop reordering within columns
   fix: prevent duplicate feature IDs on rapid creation
   ```

   We follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, etc.).

4. Push your branch and open a pull request against `main`.

## Reporting Bugs

Open an issue at [GitHub Issues](https://github.com/salsa-lab/kanban-sauce/issues) with:

- Steps to reproduce
- Expected vs actual behavior
- Editor version (VS Code / Cursor / VSCodium) and OS

## Feature Requests

Feature requests are welcome! Please open an issue describing the use case and proposed behavior.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
