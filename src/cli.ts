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

const main = async (args: string[]) => {
  type Options = {
    build: string[];
    list: string[];
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
    rule(command("init"), restArgumentsAt("init"), {
      description: "Init the template file",
    }),
  ];

  const makeHelp = () =>
    makeHelmMessage("envctl", rules, ["build --ctx=<ctx>"]);

  const options = flags<Options>(args, {}, rules);

  if (options.showHelp) return console.error(makeHelp());

  for (const [subcommand, handler] of Object.entries(subcommands)) {
    if (Reflect.has(options, subcommand)) {
      return handler(Reflect.get(options, subcommand));
    }
  }

  return console.error(makeHelp());
};

await main(process.argv.slice(2)).catch((ex) => {
  if (ex instanceof Error) {
    return console.error(ex.message);
  }
  throw ex;
});
