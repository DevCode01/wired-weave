# Wired Weave

**JavaScript (Node.js)** · **v0.1.0**

_Kanban board CLI with persisted columns, tasks and moves_

---

## Features

- Custom columns (todo/doing/done by default, extendable)
- Add, move and remove tasks between columns
- Renders a multi-column text board, persisted to ~/.kanban-board.json

## Installation

```bash
git clone https://github.com/DevCode01/wired-weave.git
cd wired-weave
```

## Usage

```bash
./wired-weave.js add todo 'Write specs' && ./wired-weave.js board
```

## How it works

The board (custom columns plus tasks) is persisted as JSON at `~/.kanban-board.json` (override with `KANBAN_DB`). Each command loads the file, mutates it, and saves it back immediately, so state survives across invocations without a server.

## Options

- `add-column <name>` - create a new column
- `add <column> <text...>` - add a task to a column
- `move <id> <column>` - move a task to another column
- `rm <id>` / `remove <id>` - delete a task
- `board` (default) - render all columns side by side as a text board
- `KANBAN_DB` - environment variable, JSON file path

## Example

```bash
$ ./wired-weave.js add todo 'Write specs' && ./wired-weave.js board
TODO (1)                     | DOING (0)                    | DONE (0)                    
-----------------------------+------------------------------+-----------------------------
#1 Write specs               |                              |                             
```

## Testing

```bash
bash tests/run.sh
```

Includes a functional check against real captured output, plus the build/syntax check.

## License

MIT
