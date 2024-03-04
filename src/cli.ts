import {
  flags,
  command,
  restArgumentsAt,
  rule,
  type Rule,
  makeHelmMessage,
  flag,
  isBooleanAt,
} from "@jondotsoy/flags";
import * as subcommands from "./subcommands";

export const cli = async (args: string[]) => {
  type Options = {
    build: string[];
    list: string[];
    version: string[];
    init: string[];
    showHelp: boolean;
  };

  const rules: Rule<Options>[] = [
    rule(flag("--help", "-h"), isBooleanAt("showHelp"), {
      description: "Show help to envctl",
    }),
    rule(command("use"), restArgumentsAt("build"), {
      description: "Build the env file. Example: envctl use <context>",
    }),
    rule(command("list"), restArgumentsAt("list"), {
      description: "List environment available",
    }),
    rule(command("version"), restArgumentsAt("version"), {
      description: "Show version enabled",
    }),
    rule(command("init"), restArgumentsAt("init"), {
      description: "Init the template file",
    }),
  ];

  const makeHelp = () => makeHelmMessage("envctl", rules, ["use <ctx>"]);

  const options = flags<Options>(args, {}, rules);

  if (options.showHelp) throw new Error(makeHelp());

  for (const [subcommand, handler] of Object.entries(subcommands)) {
    if (Reflect.has(options, subcommand)) {
      try {
        await handler(Reflect.get(options, subcommand));
        return;
      } catch (ex) {
        throw ex;
      }
    }
  }

  throw new Error(makeHelp());
};
