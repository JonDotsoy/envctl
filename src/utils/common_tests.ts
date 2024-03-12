import fs from "fs/promises";
import process from "node:process";
import { useWorkspace as createUseWorkspace } from "use-workspace";

namespace WorkspacesName {
  const toCharCode = (value: string) => value.charCodeAt(0);
  const range = (start: number, end: number) =>
    new Array(Math.max(0, end + 1 - start))
      .fill(null)
      .map((_, index) => start + index);

  const charCodeSerializable = [
    toCharCode("_"),
    toCharCode("-"),
    ...new Uint8Array(range(toCharCode("a"), toCharCode("z"))),
    ...new Uint8Array(range(toCharCode("A"), toCharCode("Z"))),
    ...new Uint8Array(range(toCharCode("0"), toCharCode("9"))),
  ];

  const isSerializable = (charCode: number) =>
    charCodeSerializable.includes(charCode);

  export const serialize = (value: string) => {
    return new TextDecoder().decode(
      new Uint8Array(
        Array.from(new TextEncoder("utf-8").encode(value)).flatMap(
          (charCode) =>
            isSerializable(charCode)
              ? charCode
              : [
                  toCharCode("["),
                  ...new TextEncoder().encode(`${charCode}`),
                  toCharCode("]"),
                ],
        ),
      ),
    );
  };

  export const deserialize = (value: string) => {
    let indexAtSkip = -1;
    return new TextDecoder().decode(
      new Uint8Array(
        Array.from(new TextEncoder("utf-8").encode(value)).flatMap(
          (charCode, index, charCodes) => {
            if (charCode === toCharCode("[")) {
              const indexClosed = charCodes.indexOf(toCharCode("]"), index);
              if (indexClosed) {
                const chunk = charCodes.slice(index + 1, indexClosed);
                const charCode = Number(
                  new TextDecoder().decode(new Uint8Array(chunk)),
                );
                indexAtSkip = indexClosed;
                return charCode;
              }
            }

            if (index <= indexAtSkip) return [];

            return charCode;
          },
        ),
      ),
    );
  };
}

const workspacesLocation = new URL(`__workspaces__/`, import.meta.url);
const getWorkspaceLocation = (workspacesName: string) =>
  new URL(`${WorkspacesName.serialize(workspacesName)}/`, workspacesLocation);

export const useWorkspace = async (name: string = "default") => {
  const { location: workspaceLocation } = await createUseWorkspace(name, {
    cleanBefore: true,
  });

  const toLocation = (relativeName: string) =>
    new URL(relativeName, workspaceLocation);

  const writeFile = async (
    relativeName: string,
    payload: Uint8Array,
    options?: { mode?: number },
  ) => {
    await fs.mkdir(new URL("./", toLocation(relativeName)), {
      recursive: true,
    });
    await fs.writeFile(toLocation(relativeName), payload, {
      mode: options?.mode,
    });
  };

  const readFile = async (relativeName: string) => {
    return fs.readFile(toLocation(relativeName));
  };

  await writeFile(".gitignore", new TextEncoder().encode("*"));

  return {
    workspaceLocation,
    toLocation,
    writeFile,
    readFile,
  };
};

/**
 *
 * @example
 * using useChdir()
 */
export const useChdir = (directory: URL) => {
  const cwd = () => process.cwd();

  const initialCWD = process.cwd();
  process.chdir(directory.pathname);

  const restore = () => {
    process.chdir(initialCWD);
  };

  return {
    cwd,
    restore,
    initial: {
      cwd: initialCWD,
    },
    [Symbol.dispose]() {
      restore();
    },
  };
};

export const runSample = async (location: URL) => {
  if (!location.pathname.endsWith(".ts"))
    throw new Error(`Expected a typescript file. with .ts extension.`);
  if (location.protocol !== "file:") throw new Error(`Expect a file url`);

  if (!(await fs.exists(location))) {
    await fs.mkdir(new URL("./", location), { recursive: true });
    await fs.writeFile(location, `# Your code here`);
  }

  const childProcess = Bun.spawn({
    cmd: [process.argv0, `${location.pathname}`],
    cwd: new URL("./", location).pathname,
    env: { NODE_ENV: "development", TZ: "America/Santiago" },
    stderr: "inherit",
    stdout: "inherit",
  });

  const exitCode = await childProcess.exited;
  console.log(`Exit Code: ${exitCode}`);
};
