import { cwd } from "process";
import { pathToFileURL } from "url";
import { parse } from "dotenv";
import { readFile, writeFile, exists } from "fs/promises";
import {
  flags,
  command,
  restArgumentsAt,
  flag,
  isStringAt,
  rule,
  type Rule,
  makeHelmMessage,
  any,
  isBooleanAt,
} from "@jondotsoy/flags";
import chalk from "chalk";

export const list = async (args: string[]) => {
  type Options = {
    formatJson: boolean;
  };
  const rules: Rule<Options>[] = [
    rule(flag("--json", "-j"), isBooleanAt("formatJson"), {
      description: "Print result on JSON format",
    }),
  ];
  const options = flags<Options>(args, {}, rules);

  const glob = new Bun.Glob(".env.*");
  const paths = (
    await Array.fromAsync(
      glob.scan({ cwd: process.cwd(), dot: true, onlyFiles: true }),
    )
  )
    .filter((e) => e !== `.env.template`)
    .map((e) => ({ context: e.substring(".env.".length) }));

  if (paths.length === 0) {
    return console.error(
      `No contexts found. You can create one by making a ${chalk.green(".env.<ctx>")} file and adding desired variables.`,
    );
  }

  if (options.formatJson) return console.log(JSON.stringify(paths, null, 2));

  for (const path of paths) {
    console.log(`- ${chalk.blue(path.context)}`);
  }

  return;
};

export const init = async (args: string[]) => {
  type Options = {};
  const rules: Rule<Options>[] = [];
  const options = flags<Options>(args, {}, rules);

  const templateLocation = new URL(`.env.template`, pathToFileURL(`${cwd()}/`));

  if (await exists(templateLocation)) {
    console.log(chalk.cyan(`# Already created .env.template file`));
  } else {
    console.log(chalk.cyan(`# Wrote ${templateLocation} file`));
    await writeFile(templateLocation, "");
  }

  console.log(``);
  console.log(
    `Congratulations on successfully initializing your project with the ${chalk.green(`envctl init`)} command! 🎉`,
  );
  console.log(``);
  console.log(
    `Now, you'll find the ${chalk.blue(`.env.template`)} file ready to be used for generating ${chalk.blue(".env")} with ${chalk.green("envctl build --ctx=<ctx>")}. Explore contexts using ${chalk.green("envctl list")}. Happy coding! 🚀`,
  );
};

export const build = async (args: string[]) => {
  type Options = {
    _: string;
  };

  const rules: Rule<Options>[] = [rule(any(), restArgumentsAt("_"))];
  const makeHelp = () => makeHelmMessage("envctl", rules, ["use <context>"]);

  const { _ } = flags<Options>(args, {}, rules);
  const context = _?.at(0);

  if (!context) {
    console.error(`Missing context`);
    console.error(``);
    console.error(makeHelp());
    return;
  }

  const envSource = new URL(`${context}`, pathToFileURL(`${cwd()}/`));
  const envTemplate = new URL(".env.template", pathToFileURL(`${cwd()}/`));
  const envDestiny = new URL(".env", pathToFileURL(`${cwd()}/`));

  const envSourceParsed = parse(await readFile(envSource));
  const envTemplateParsed = new TextDecoder()
    .decode(await readFile(envTemplate))
    .replace(/^((?:\w|_)*)=(.*)/gm, (_: string, varName: string) => {
      return `${varName}=${envSourceParsed[varName] ?? ""}`;
    });

  await writeFile(envDestiny, new TextEncoder().encode(envTemplateParsed));
};
