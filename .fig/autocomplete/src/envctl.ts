const envs: Fig.Generator = {
  script: ["envctl", "list", "--json"],
  postProcess: (output) => {
    return JSON.parse(output).map((name: string) => {
      const indexSlash = name.lastIndexOf("/") + 1;
      return { name: name.substring(indexSlash) };
    });
  },
};

const completionSpec: Fig.Spec = {
  name: "envctl",
  description: "Manager env files",
  subcommands: [
    {
      name: "use",
      description: "Choice a environment context",
      args: {
        description: "Context",
        generators: envs,
      },
    },
    {
      name: "list",
      description: "List all context available",
    },
    {
      name: "init",
      description: "Initialize the env files",
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
