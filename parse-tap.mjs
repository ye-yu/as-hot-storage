import { Parser } from "tap-parser";
import chalk from "chalk";

/** indent */
function i(size = 2, char = " ") {
  return char.repeat(size);
}

/** parse time in ms */
function time(obj) {
  if (obj.diag.duration_ms < 5000) return "";
  return `${chalk.yellow(obj.diag.duration_ms.toFixed(2))}`;
}

const p = new Parser((_results) => {
  console.log();
  // console.log("====");
  // console.log();
  // if (results.fail) {
  //   console.log("test failed");
  // } else {
  //   console.log("test passed");
  // }
});
p.on("pass", (passed) => {
  console.log(i(), chalk.green("✓"), passed.name, time(passed));
});
p.on("todo", (todo) => {
  console.log(i(), chalk.blue("●"), todo.name);
  if (typeof todo.todo === "string") {
    console.log(i(4), `Reason: ${todo.todo}`);
  }
});
p.on("skip", (skipped) => {
  console.log(i(), chalk.yellow("…"), skipped.name);
  if (typeof skipped.skip === "string") {
    console.log(i(4), `Reason: ${skipped.skip}`);
  }
});
p.on("fail", (failed) => {
  console.log(i(), chalk.red("✘"), failed.name, time(failed));
  console.log(
    i(4),
    failed.diag.code,
    "\n",
    i(8),
    failed.diag.stack
      .split("\n")
      .map((e) => `${i(10)}${e}`)
      .join("\n")
      .slice(10)
  );
});

process.stdin.pipe(p);
