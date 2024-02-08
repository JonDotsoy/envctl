import { filepaths } from "@fig/autocomplete-generators";

const completionSpec: Fig.Spec = {
  name: "envctl",
  description: "Manager env files",
  subcommands: [
    {
      name: "use",
      description: "Choice a environment context",
      args: {
        description: "Context",
        generators: filepaths({
          filterFolders: true,
          matches: /\.env\.(?<name>.+)/,
        }),
      },
    },
    {
      name: "list",
      description: "List all context available",
      subcommands: [],
    },
    {
      name: "init",
      description: "Initialize the env files.",
      subcommands: [],
    },
  ],
  options: [
    {
      name: ["--help", "-h"],
      description: "Show help for envctl",
    },
  ],
};

export default completionSpec;
