import path from "path";
import { cwd } from "process";
import { pathToFileURL } from "url";
import { parse } from "dotenv";
import { readFile, writeFile, exists, stat } from "fs/promises";
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
import { useMessages, type Message, type Streaming } from "../utils/streaming";
import { Envctl } from "../envctl";

export { version } from "./version";

export const list = async (args: string[]) => {
  const controller = await useMessages();

  type Options = {
    formatJson: boolean;
  };
  const rules: Rule<Options>[] = [
    rule(flag("--json", "-j"), isBooleanAt("formatJson"), {
      description: "Print result on JSON format",
    }),
  ];
  const options = flags<Options>(args, {}, rules);

  const workspaceLocation = pathToFileURL(`${cwd()}/`);
  const envs = await Array.fromAsync(
    new Envctl({ workspace: workspaceLocation }).findEnvs(),
  );

  if (envs.length === 0) {
    controller.send({
      type: "ERROR",
      value: `No contexts found. You can create one by making a ${chalk.green(".env.<ctx>")} file and adding desired variables.\n`,
    });
  }

  if (options.formatJson) return controller.send(JSON.stringify(envs, null, 2));

  const relativePath = (location: URL) => {
    return path.relative(workspaceLocation.pathname, location.pathname);
  };

  for (const path of envs) {
    controller.send(
      `- ${Envctl.getNameEnvFromLocation(path)} ${chalk.blue(`(${relativePath(path)})`)}\n`,
    );
  }
};

export const init = async (args: string[]) => {
  const controller = await useMessages();
  type Options = {};
  const rules: Rule<Options>[] = [];
  const options = flags<Options>(args, {}, rules);

  const templateLocation = new URL(`.env.template`, pathToFileURL(`${cwd()}/`));

  if (await exists(templateLocation)) {
    controller.send(chalk.cyan(`# Already created .env.template file\n`));
  } else {
    controller.send(chalk.cyan(`# Wrote ${templateLocation} file\n`));
    await writeFile(templateLocation, "");
  }

  controller.send(``);
  controller.send(
    `Congratulations on successfully initializing your project with the ${chalk.green(`envctl init`)} command! 🎉\n`,
  );
  controller.send(``);
  controller.send(
    `Now, you'll find the ${chalk.blue(`.env.template`)} file ready to be used for generating ${chalk.blue(".env")} with ${chalk.green("envctl build --ctx=<ctx>")}. Explore contexts using ${chalk.green("envctl list")}. Happy coding! 🚀\n`,
  );
};

export const build = async (args: string[]) => {
  const messages = await useMessages();
  type Options = {
    _: string;
  };

  const rules: Rule<Options>[] = [rule(any(), restArgumentsAt("_"))];
  const makeHelp = () => makeHelmMessage("envctl", rules, ["use <context>"]);

  const { _ } = flags<Options>(args, {}, rules);
  const contextName = _?.at(0);

  if (!contextName) {
    messages.send(`Missing context\n`);
    messages.send(``);
    messages.send(makeHelp());
    messages.send(`\n`);
    return;
  }

  const choiceFileIfExists = async (locations: URL[]) => {
    for (const location of locations) {
      const existFile = await exists(location);
      if (!existFile) continue;
      const statFile = await stat(location);
      if (!statFile.isFile()) continue;
      return location;
    }
    return undefined;
  };

  const workspaceLocation = pathToFileURL(`${cwd()}/`);
  const envSource = await Envctl.findEnvLocation(
    workspaceLocation,
    contextName,
  );
  const envTemplate = await choiceFileIfExists([
    new URL(".envs/template", workspaceLocation),
    new URL(".env.template", workspaceLocation),
    new URL(".env.sample", workspaceLocation),
    new URL(".env.example", workspaceLocation),
  ]);
  const envDestiny = new URL(".env", workspaceLocation);

  if (!envSource) throw new Error(`Missing context ${contextName}.`);

  const envctl = new Envctl({
    workspace: workspaceLocation,
    template: envTemplate,
    envDestination: envDestiny,
  });

  await envctl.switchEnv(envSource);

  const relativePath = (location: URL) => {
    return path.relative(workspaceLocation.pathname, location.pathname);
  };

  messages.send({
    type: "INFO",
    value: `Created env by ${relativePath(envSource)} file\n`,
  });
};
