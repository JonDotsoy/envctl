import { getPackageJson } from "../utils/get_package_json" with { type: "macro" };
import { useMessages } from "../utils/streaming";
import { flag, flags, isBooleanAt, rule } from "@jondotsoy/flags";

export const version = async (args: string[]) => {
  type Options = {
    outputJson: boolean;
  };

  const options = flags<Options>(args, {}, [
    rule(flag("--json", "-j"), isBooleanAt("outputJson"), {}),
  ]);

  const messages = await useMessages();

  const pkg = getPackageJson();

  if (options.outputJson)
    return messages.send(
      JSON.stringify({
        version: pkg.version,
      }),
    );

  messages.send(`Version v${pkg.version}\n`);
};
