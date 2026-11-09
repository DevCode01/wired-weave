#!/usr/bin/env node
// Kanban board CLI — persisted to ~/.kanban-board.json
const fs = require("fs");
const path = require("path");
const os = require("os");

const DB = process.env.KANBAN_DB || path.join(os.homedir(), ".kanban-board.json");

function load() {
  try {
    return JSON.parse(fs.readFileSync(DB, "utf8"));
  } catch {
    return { columns: ["todo", "doing", "done"], tasks: [] };
  }
}

function save(board) {
  fs.writeFileSync(DB, JSON.stringify(board, null, 2));
}

function nextId(board) {
  return board.tasks.length === 0 ? 1 : Math.max(...board.tasks.map((t) => t.id)) + 1;
}

function addColumn(board, name) {
  if (board.columns.includes(name)) {
    console.log(`Column "${name}" already exists.`);
    return;
  }
  board.columns.push(name);
  save(board);
  console.log(`Added column: ${name}`);
}

function addTask(board, column, text) {
  if (!board.columns.includes(column)) {
    console.log(`Unknown column "${column}". Columns: ${board.columns.join(", ")}`);
    process.exit(1);
  }
  const task = { id: nextId(board), text, column, created: new Date().toISOString() };
  board.tasks.push(task);
  save(board);
  console.log(`Added task #${task.id} to ${column}: ${text}`);
}

function moveTask(board, id, column) {
  if (!board.columns.includes(column)) {
    console.log(`Unknown column "${column}". Columns: ${board.columns.join(", ")}`);
    process.exit(1);
  }
  const task = board.tasks.find((t) => t.id === id);
  if (!task) {
    console.log(`No task with id ${id}`);
    process.exit(1);
  }
  const from = task.column;
  task.column = column;
  save(board);
  console.log(`Moved #${id} from ${from} to ${column}`);
}

function removeTask(board, id) {
  const idx = board.tasks.findIndex((t) => t.id === id);
  if (idx === -1) {
    console.log(`No task with id ${id}`);
    process.exit(1);
  }
  board.tasks.splice(idx, 1);
  save(board);
  console.log(`Removed task #${id}`);
}

function printBoard(board) {
  const colWidth = 28;
  const header = board.columns
    .map((c) => `${c.toUpperCase()} (${board.tasks.filter((t) => t.column === c).length})`.padEnd(colWidth))
    .join(" | ");
  console.log(header);
  console.log(board.columns.map(() => "-".repeat(colWidth)).join("-+-"));

  const byColumn = board.columns.map((c) => board.tasks.filter((t) => t.column === c));
  const maxRows = Math.max(0, ...byColumn.map((a) => a.length));
  for (let i = 0; i < maxRows; i++) {
    const row = byColumn
      .map((tasks) => {
        const t = tasks[i];
        const cell = t ? `#${t.id} ${t.text}` : "";
        return cell.length > colWidth ? cell.slice(0, colWidth - 1) + "\u2026" : cell.padEnd(colWidth);
      })
      .join(" | ");
    console.log(row);
  }
  if (maxRows === 0) {
    console.log("(board is empty)");
  }
}

function main() {
  const board = load();
  const [cmd, ...rest] = process.argv.slice(2);

  switch (cmd) {
    case "add-column":
      addColumn(board, rest[0]);
      break;
    case "add":
      addTask(board, rest[0], rest.slice(1).join(" "));
      break;
    case "move":
      moveTask(board, parseInt(rest[0], 10), rest[1]);
      break;
    case "rm":
    case "remove":
      removeTask(board, parseInt(rest[0], 10));
      break;
    case "board":
    default:
      printBoard(board);
      break;
  }
}

main();
