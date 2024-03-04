import fs from "fs/promises";
import dotenv from "dotenv";
import { Glob, type GlobScanOptions } from "bun";

export class Envctl {
  workspaceLocation: URL;
  templateLocation: URL;
  envDestination: URL;

  constructor(options: {
    workspace: URL;
    template?: URL;
    envDestination?: URL;
  }) {
    this.workspaceLocation = options.workspace;
    this.envDestination =
      options.envDestination ?? new URL(".env", this.workspaceLocation);
    this.templateLocation = options.template ?? this.envDestination;
  }

  private async *findEnvsStr() {
    const scanOptions: GlobScanOptions = {
      cwd: this.workspaceLocation.pathname,
      dot: true,
      onlyFiles: true,
      absolute: true,
    };

    yield* new Glob("{.*.env,.env.*}").scan(scanOptions);
    yield* new Glob(".envs/*").scan(scanOptions);
  }

  private async *findTemplatesStr() {
    const scanOptions: GlobScanOptions = {
      cwd: this.workspaceLocation.pathname,
      dot: true,
      onlyFiles: true,
      absolute: true,
    };

    yield* new Glob(".env.{template,sample,example}").scan(scanOptions);
    yield* new Glob(".envs/template").scan(scanOptions);
  }

  async *findEnvs() {
    const templatePaths = await Array.fromAsync(this.findTemplatesStr());

    for await (const envStr of this.findEnvsStr()) {
      if (templatePaths.includes(envStr)) continue;
      yield new URL(envStr, this.workspaceLocation);
    }
  }

  async switchEnv(envLocation: URL) {
    const envOriginSource = await fs.readFile(envLocation);
    const templateSource = await fs.readFile(this.templateLocation);
    const envOriginParsed = dotenv.parse(envOriginSource);

    const nextEnvPayload = new TextEncoder().encode(
      new TextDecoder()
        .decode(templateSource)
        .replace(/^((?:\w|_)*)=(.*)/gm, (_: string, varName: string) => {
          return `${varName}=${envOriginParsed[varName] ?? ""}`;
        }),
    );

    await fs.writeFile(this.envDestination, nextEnvPayload);
  }

  static *toAlternativesNames(base: URL, name: string) {
    yield new URL(`${name}`, base);
    yield new URL(`.env.${name}`, base);
    yield new URL(`.${name}.env`, base);
    yield new URL(`.envs/${name}`, base);
    yield new URL(`.envs/.${name}`, base);
    yield new URL(`.envs/${name}.env`, base);
    yield new URL(`.envs/.${name}.env`, base);
  }

  static getNameEnvFromLocation(location: URL) {
    const rules = [
      /\.env\.(?<name>\w+)$/,
      /\.(?<name>\w+)\.env$/,
      /(?<name>\w+)\.env$/,
      /\.envs\/(?<name>\w+)\.env$/,
      /\.envs\/.(?<name>\w+)\.env$/,
      /\.envs\/.(?<name>\w+)$/,
      /\.envs\/(?<name>\w+)$/,
    ];

    for (const rule of rules) {
      if (rule.test(location.pathname)) {
        return rule.exec(location.pathname)!.groups!.name;
      }
    }

    return null;
  }

  static async findEnvLocation(base: URL, name: string) {
    for (const alternativeName of this.toAlternativesNames(base, name)) {
      if (
        (await fs.exists(alternativeName)) &&
        (await fs.stat(alternativeName)).isFile()
      ) {
        return alternativeName;
      }
    }

    return null;
  }
}
