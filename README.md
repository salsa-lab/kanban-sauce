<div align="center">

<img src="https://raw.githubusercontent.com/salsa-lab/kanban-sauce/main/resources/icon.png" alt="Kanban Sauce" width="150" />

# Kanban Sauce

**A flexible, local-first Kanban board for your editor. Manage projects, tasks, notes, and ideas using Markdown files you own and control.**

[![VS Marketplace](https://vsmarketplacebadges.dev/version/salsa-lab.kanban-sauce.svg?&colorB=blue)](https://marketplace.visualstudio.com/items?itemName=salsa-lab.kanban-sauce)
[![Open VSX](https://img.shields.io/open-vsx/v/salsa-lab/kanban-sauce?label=Open%20VSX&logo=vscodium)](https://open-vsx.org/extension/salsa-lab/kanban-sauce)
[![Open VSX Downloads](https://img.shields.io/open-vsx/dt/salsa-lab/kanban-sauce?label=Downloads&logo=vscodium)](https://open-vsx.org/extension/salsa-lab/kanban-sauce)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

<br />

![Board Overview](https://raw.githubusercontent.com/salsa-lab/kanban-sauce/main/docs/images/board-overview.png)

</div>

---

**Kanban Sauce** brings Trello- and Notion-style visual project and note management straight into your editor. Every card is stored on disk as a **plain Markdown file with YAML frontmatter**, making your boards 100% offline, version-controllable, Git-diffable, and portable. **No account setup, no cloud lock-in, no telemetry** — just fast, local productivity that lives right next to your code.

## Why Kanban Sauce?

Most editor Kanban extensions lock you into a single monolithic file or an opaque database. Kanban Sauce is built around your filesystem. Whether you are managing software projects, planning content, organizing research notes, tracking personal tasks, or coordinating a team, Kanban Sauce adapts to your workflow:

- **Any Folder is a Board:** Right-click *any* directory in your workspace to open it as an independent Kanban board.
- **1 Card = 1 Markdown File:** Moving a card updates its YAML frontmatter on disk and keeps active work separated from completed (`done/`) items — producing clean Git diffs and preventing merge conflicts.
- **Multi-Board Tabs & Sidebar:** Keep multiple boards open side-by-side in editor tabs and jump between known boards or active cards from the Activity Bar.
- **Version-Controlled Board Configs:** Customize columns and colors per board via a lightweight `.kanbansauce` JSON file that commits alongside your project.
- **Future-Proof & Scriptable:** Because cards are standard `.md` files, you can read, search, script, or edit them with external tool - even without the extension installed.

## Get Started in Seconds

### 1. Install

- **VS Code:** Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=salsa-lab.kanban-sauce) or run `ext install salsa-lab.kanban-sauce` in Quick Open (`Ctrl+P` / `Cmd+P`).
- **Cursor / Windsurf / VSCodium:** Install from the [Open VSX Registry](https://open-vsx.org/extension/salsa-lab/kanban-sauce).
- **Manual (`.vsix`):** Download the latest `.vsix` from [GitHub Releases](https://github.com/salsa-lab/kanban-sauce/releases) and run **Extensions: Install from VSIX...** from the Command Palette.

### 2. Open a Board

- **Explorer Context Menu:** Right-click any folder in the Explorer sidebar and select **Open as Kanban Board**.
- **Command Palette:** Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) and run **Kanban Sauce: Open Kanban Board**.

### 3. Create & Manage Cards

- Click **`+ New Card`** in the sidebar, press **`N`** on an active board, or click **`+`** in any column header to create a new card.
- Drag and drop cards across or within columns, or click any card to open the **Split-View Editor**.

## Key Features

### Split-View Rich Editor & Two-Way Sync

Edit cards inline with the built-in rich-text or raw-source Markdown editor (powered by MDXEditor) on the right while keeping your board visible on the left — or enable `markdownEditorMode` to open cards directly in your editor's native text tab. Changes auto-save as you type, and the board refreshes automatically whenever files are modified externally (e.g., via `git pull` or CLI scripts).

<div align="center">
  <img src="https://raw.githubusercontent.com/salsa-lab/kanban-sauce/main/docs/images/editor-view.png" alt="Editor View" />
</div>

### Multi-Board Workspace & Sidebar Navigation

- **Concurrent Editor Tabs:** Work on multiple boards simultaneously in separate editor tabs.
- **Available Boards Sidebar:** Jump between all known boards in your workspace with one click, sort them by name or last-modified date, and right-click to rename or remove boards from history.
- **Sidebar Cards View:** Inspect and filter cards by column directly from the Activity Bar without leaving your code.

### Rich Card Metadata & Epic Swimlanes

- **Priority Badges:** Color-coded indicators for `critical`, `high`, `medium`, and `low`.
- **Smart Due Dates:** Relative status badges (`Overdue`, `Today`, `Tomorrow`, `+5d`) at a glance.
- **Epics & Swimlane View:** Group cards under color-coded epics and toggle **Epic Board View** in the toolbar to organize your board into collapsible horizontal epic swimlanes.
- **Labels, Assignees & Timestamps:** Filter by multiple tags or assignees, with automatic lifecycle timestamps (`created`, `modified`, `completedAt`) and undo support (`Cmd/Ctrl+Z`).

### Fast Search, Filtering & Layouts

- **Instant Full-Text Search:** Filter cards in real time across titles, Markdown body content, IDs, epics, assignees, due dates, and labels.
- **Flexible Layouts:** Switch between horizontal and vertical column layouts, collapse individual columns, or enable **Compact Mode** for high-density backlogs.
- **Keyboard-First Workflow:** Press `N` to create a card, `Cmd/Ctrl+S` or `Cmd/Ctrl+Enter` to save, `Cmd/Ctrl+Z` to undo board actions, and `Esc` to close dialogs or the editor.

### Plain-Text File Format

Every card is a human-readable `.md` file that you can edit, grep, or automate outside the extension:

```markdown
---
id: "implement-oauth-pkce-2026-07-04"
status: "in-progress"
priority: "high"
assignee: "alex"
epic: "auth-v2"
dueDate: "2026-07-15"
created: "2026-07-04T09:27:55.052Z"
modified: "2026-07-06T14:12:10.110Z"
completedAt: null
labels: ["security", "backend"]
order: "a0"
---
# Implement OAuth 2.0 PKCE Flow

Replace the legacy implicit grant flow with PKCE for the desktop client.

## Acceptance Criteria

- [x] Generate code verifier and S256 challenge
- [ ] Add token exchange endpoint handler
- [ ] Update session refresh tests
```

### Per-Board Columns (`.kanbansauce`)

Click **Manage Columns** in the board toolbar to customize column IDs, display names, and hex colors for a specific board. Kanban Sauce saves this configuration to a `.kanbansauce` file at the root of the board directory:

```json
{
  "columns": [
    { "id": "backlog", "name": "Backlog", "color": "#6b7280" },
    { "id": "todo", "name": "To Do", "color": "#3b82f6" },
    { "id": "in-progress", "name": "In Progress", "color": "#f59e0b" },
    { "id": "review", "name": "Review", "color": "#8b5cf6" },
    { "id": "done", "name": "Done", "color": "#22c55e" }
  ]
}
```

## Configuration

Tailor Kanban Sauce under `kanban-sauce.*` in your editor settings:

| Setting | Default | Description |
|---------|---------|-------------|
| `filenamePattern` | `name-date` | Filename pattern for new cards (`name-date`, `date-name`, `name-datetime`, `datetime-name`) |
| `defaultPriority` | `medium` | Default priority for new cards (`critical`, `high`, `medium`, `low`) |
| `defaultStatus` | `backlog` | Default column status for new cards (`backlog`, `todo`, `in-progress`, `review`, `done`) |
| `columns` | *5 default columns* | Default column IDs, names, and colors when no `.kanbansauce` file is present |
| `showPriorityBadges` | `true` | Show priority on cards and in editors |
| `showAssignee` | `true` | Show assignee on cards and in editors |
| `showDueDate` | `true` | Show due date on cards and in editors |
| `showLabels` | `true` | Show labels on cards and in editors |
| `showEpic` | `true` | Show epic badge on cards and in editors |
| `showFileName` | `false` | Show the source Markdown filename on cards |
| `compactMode` | `false` | Use compact card layout for denser boards |
| `addNewCardsToTop` | `false` | Add newly created cards to the top of the column |
| `markdownEditorMode` | `false` | Open cards in the editor's native text tab instead of the inline split-view editor |
| `defaultEditorMode` | `rich-text` | Default mode for the inline editor (`rich-text` or `raw`) |
| `showLineNumbersInRawMode` | `true` | Show line numbers in the raw Markdown source mode |
| `editorToolbarHeight` | `32` | Height in pixels of the inline editor toolbar |
| `language` | `auto` | UI language (`auto`, `en` — English, `es` — Español, `pt` — Português) |
| `hideScrollbar` | `false` | Hide scrollbars on the Kanban board while keeping scrolling enabled |

<details>
<summary><strong>Font Size & Typography Settings (click to expand)</strong></summary>

<br />

| Setting | Default | Description |
|---------|---------|-------------|
| `fontSizeColumnHeader` | `16px` | Font size for column headers on the board (e.g., `16px`, `1.1rem`) |
| `fontSizeCardTitle` | `14px` | Font size for card titles on the board (e.g., `14px`, `1rem`) |
| `fontSizeCardDescription` | `14px` | Font size for card body/description previews on the board (e.g., `14px`, `0.9rem`) |
| `fontSizeCardLabel` | `12px` | Font size for label tags on cards (e.g., `12px`, `0.8rem`) |
| `fontSizeCardMeta` | `13px` | Font size for card metadata such as assignee, due date, epic, filename, and priority (e.g., `13px`, `0.8rem`) |
| `fontSizeEditorHeader` | `18px` | Base font size for headings in the inline editor/preview panel (e.g., `18px`, `1.5rem`) |
| `fontSizeEditorBody` | `16px` | Font size for body text, lists, and tables in the inline editor/preview panel (e.g., `16px`, `1.1rem`) |
| `fontSizeEditorMeta` | `14px` | Font size for the metadata block above the inline editor (e.g., `14px`, `0.9rem`) |

</details>

## Development

Contributions are welcome!

**Prerequisites:** Node.js 18+ and `pnpm`.

```bash
pnpm install       # Install dependencies
pnpm dev           # Start development (watch mode)
pnpm build         # Build for production
pnpm test          # Run unit and component tests
```

*See [CONTRIBUTING.md](CONTRIBUTING.md) for architecture and testing details.*

### Tech Stack

- **Extension Host:** TypeScript, VS Code Extension API, esbuild
- **Webview UI:** React 18, Vite, Tailwind CSS, Zustand, MDXEditor

## Acknowledgements

Kanban Sauce is a heavily evolved fork of [Kanban Markdown](https://github.com/LachyFS/kanban-markdown-vscode-extension). Huge thanks to the original contributors:
[@LachyFS](https://github.com/LachyFS), [@luciopaiva](https://github.com/luciopaiva), [@ungive](https://github.com/ungive), [@hodanli](https://github.com/hodanli), and [@SuperbDotHub](https://github.com/SuperbDotHub).

Kanban Sauce builds on their foundation to deliver a more flexible, multi-board, and 100% local-first experience.

## License

Released under the [MIT License](LICENSE).
